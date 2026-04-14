// —————— 扩展内皮肤系统 ——————
// 原版皮肤路径指向本体 image/skin/，扩展武将的 ext: 标签会短路掉皮肤判定，
// 所以这里将扩展武将的皮肤路径重定向到扩展内 image/skin/。
//
// 添加新皮肤步骤：
//   1. 把皮肤图放到 extension/舰r牌将/image/skin/{武将ID}/1.jpg, 2.jpg, ...
//   2. 在下方 skinRegistry 注册皮肤数量
// 编号从 1 开始，0 代表默认立绘（无需放图）。

import { lib, game, ui, get, ai, _status } from '../../noname.js';

// 皮肤注册表：{ 武将ID: 皮肤数量 }
export var skinRegistry = {
    shengwang_R: 2,
    // yamato_R: 3,  // 表示有 1.jpg, 2.jpg, 3.jpg 三张皮肤
};

// 初始化皮肤系统，由 extension.js 的 content 函数调用
export function initSkinSystem(extDir, extDisplay, isImportedMode) {

    // 向引擎注册皮肤数量（调试模式下的皮肤菜单会读 lib.skin）
    if (!lib.skin) lib.skin = {};
    for (var name in skinRegistry) {
        lib.skin[name] = skinRegistry[name];
    }

    // 路径辅助
    function skinFullPath(charName, num) {
        return 'extension/' + extDir + '/image/skin/' + charName + '/' + num + '.jpg';
    }
    function skinDbKey(charName, num) {
        return 'extension-' + extDisplay + ':image/skin/' + charName + '/' + num + '.jpg';
    }

    // ① 补丁 setBackground：扩展武将选中皮肤时从扩展目录加载
    var _origSetBg = HTMLDivElement.prototype.setBackground;
    HTMLDivElement.prototype.setBackground = function (name, type, ext, subfolder) {
        if (type === 'character' && name && skinRegistry[name] &&
            lib.config.skin[name] && arguments[2] !== 'noskin') {
            var skinNum = lib.config.skin[name];
            if (isImportedMode) {
                this.setBackgroundDB(skinDbKey(name, skinNum));
                return this;
            }
            var actualExt = ext || '.jpg';
            var skinSrc = skinFullPath(name, skinNum);
            var nameinfo = get.character(name);
            var sex = (nameinfo && ['male', 'female', 'double'].indexOf(nameinfo[0]) >= 0)
                ? nameinfo[0] : 'male';
            this.style.backgroundPositionX = 'center';
            this.style.backgroundSize = 'cover';
            this.setBackgroundImage([skinSrc, lib.characterDefaultPicturePath + sex + actualExt]);
            return this;
        }
        return _origSetBg.apply(this, arguments);
    };

    // ② 补丁 ui.click.skin：点击头像切换扩展武将皮肤
    var _origClickSkin = ui.click.skin.bind(ui.click);
    ui.click.skin = function (avatar, name, callback) {
        var cleanName = name;
        if (cleanName.startsWith('gz_')) cleanName = cleanName.slice(3);
        if (!skinRegistry[cleanName]) {
            return _origClickSkin(avatar, name, callback);
        }

        var maxSkin = skinRegistry[cleanName];
        var num = (lib.config.skin[cleanName] || 0) + 1;

        var fakeavatar = avatar.cloneNode(true);
        var finish = function (bool) {
            var player = avatar.parentNode;
            if (bool) {
                fakeavatar.style.boxShadow = 'none';
                player.insertBefore(fakeavatar, avatar.nextSibling);
                setTimeout(function () { fakeavatar.delete(); }, 100);
            }
            if (bool && lib.config.animation && !lib.config.low_performance) {
                player.$rare();
            }
            if (callback) callback(bool);
        };
        var resetSkin = function (hadSkin) {
            if (hadSkin) finish(true); else finish(false);
            delete lib.config.skin[cleanName];
            game.saveConfig('skin', lib.config.skin);
            avatar.setBackground(cleanName, 'character');
        };

        // 超过最大皮肤数 → 回到默认立绘
        if (num > maxSkin) {
            delete lib.config.skin[cleanName];
            game.saveConfig('skin', lib.config.skin);
            avatar.setBackground(cleanName, 'character');
            finish(true);
            return;
        }

        if (!isImportedMode) {
            // 目录模式：用 Image 探测皮肤图是否存在
            var img = new Image();
            img.onload = function () {
                lib.config.skin[cleanName] = num;
                game.saveConfig('skin', lib.config.skin);
                avatar.style.backgroundImage = 'url("' + img.src + '")';
                finish(true);
            };
            img.onerror = function () {
                resetSkin(!!lib.config.skin[cleanName]);
            };
            img.src = lib.assetURL + skinFullPath(cleanName, num);
        } else {
            // DB 模式：用 game.getDB 探测
            game.getDB('image', skinDbKey(cleanName, num)).then(function (src) {
                if (src) {
                    lib.config.skin[cleanName] = num;
                    game.saveConfig('skin', lib.config.skin);
                    avatar.style.backgroundImage = "url('" + src + "')";
                    finish(true);
                } else {
                    resetSkin(!!lib.config.skin[cleanName]);
                }
            }).catch(function () {
                resetSkin(!!lib.config.skin[cleanName]);
            });
        }
    };

    // ③ 补丁 charactercard：为扩展武将注入皮肤选择面板
    // 原版在弹窗内探测 image/skin/{name}/1.jpg 来决定是否显示换肤面板，
    // 扩展武将的皮肤不在那个路径，所以原版探测必定失败。这里在原版弹窗生成后补挂面板。
    var _origCharCard = ui.click.charactercard.bind(ui.click);
    ui.click.charactercard = function (name, sourcenode, noedit, resume, avatar) {
        _origCharCard(name, sourcenode, noedit, resume, avatar);

        var skinName = name;
        if (skinName.startsWith('gz_shibing')) skinName = skinName.slice(3, 11);
        else if (skinName.startsWith('gz_')) skinName = skinName.slice(3);
        var skinCount = skinRegistry[skinName];
        if (!skinCount) return;

        // 找到刚创建的弹窗元素
        var layers = document.querySelectorAll('.popup-container');
        var layer = layers[layers.length - 1];
        if (!layer) return;
        var playerbg = layer.querySelector('.menubutton.large.ava');
        if (!playerbg) return;
        // 原版已创建面板（该武将在本体也有皮肤）则跳过
        if (playerbg.querySelector('.changeskin')) return;

        var bg = playerbg.querySelector('.avatar');
        if (!bg) return;

        var skinNode = ui.create.div('.changeskin', '可换肤', playerbg);
        var skinAvatars = ui.create.div('.avatars', playerbg);
        var panelCreated = false;

        var showSkinPanel = function () {
            playerbg.classList.add('scroll');
            if (panelCreated) return;
            panelCreated = true;

            if (skinCount >= 4) {
                skinAvatars.classList.add('scroll');
                if (lib.config.touchscreen) lib.setScroll(skinAvatars);
            }

            for (var i = 0; i <= skinCount; i++) {
                (function (idx) {
                    var btn = ui.create.div(skinAvatars, function () {
                        playerbg.classList.remove('scroll');
                        if (idx > 0) {
                            lib.config.skin[skinName] = idx;
                            bg.style.backgroundImage = this.style.backgroundImage;
                            if (sourcenode) sourcenode.style.backgroundImage = this.style.backgroundImage;
                            if (avatar) avatar.style.backgroundImage = this.style.backgroundImage;
                        } else {
                            delete lib.config.skin[skinName];
                            bg.setBackground(skinName, 'character', 'noskin');
                            if (sourcenode) sourcenode.setBackground(skinName, 'character', 'noskin');
                            if (avatar) avatar.setBackground(skinName, 'character', 'noskin');
                        }
                        game.saveConfig('skin', lib.config.skin);
                    });
                    btn._link = idx;
                    if (idx > 0) {
                        if (!isImportedMode) {
                            btn.setBackgroundImage(skinFullPath(skinName, idx));
                        } else {
                            btn.setBackgroundDB(skinDbKey(skinName, idx));
                        }
                    } else {
                        btn.setBackground(skinName, 'character', 'noskin');
                    }
                })(i);
            }
        };

        bg.addEventListener('click', showSkinPanel);
    };
}
