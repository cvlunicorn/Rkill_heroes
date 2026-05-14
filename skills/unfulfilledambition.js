import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const unfulfilledambition = {
    jifu_R_weicheng: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        mod: {
            maxHandcard: function (player, num) {
                return num + 1;
            },
        },
        trigger: { player: "phaseZhunbeiBegin" },
        forced: true,
        content: function () {
            "step 0"
            player.judge(function (card) {
                if (get.color(card) == "red") return 1;
                return -1;
            });
            "step 1"
            if (result.color == 'red') {
                player.recover(1);
                player.draw(1);
                //player.addTempSkill('jifu_R_shanghai', { player: 'phaseJieshuBegin' });
            }
            if (result.color == 'black') {
                player.loseHp(1);
            }
        },
        "_priority": 0,
    },
    jifu_R_yuanjing: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            player: "dying",
        },
        unique: true,
        juexingji: true,
        forced: true,
        skillAnimation: true,
        animationColor: "gray",
        filter: function (event, player) {
            if (player.storage.jifu_R_yuanjing) return false;
            return player.hasSkill("jifu_R_weicheng") && player.hp <= 0;
        },
        content: function () {
            'step 0'
            player.awakenSkill('jifu_R_yuanjing');
            'step 1'
            player.gainMaxHp(1);
            'step 2'
            player.recover(player.maxHp - player.hp);
            player.removeSkill('jifu_R_weicheng');
        },
    },
    jifu_R_lingwei: {
        nobracket: true,
        trigger: {
            global: "useCardToPlayered",
        },
        audio: "ext:舰R牌将/audio/skill:true",
        filter: function (event, player) {
            return player != event.target && event.targets.length == 1 && get.tag(event.card, 'damage') && player.countCards("hes");
        },
        content: function () {
            'step 0'
            player.chooseToDiscard(1);
            'step 1'
            if (result.bool == true) {
                var str = get.translation(trigger.player);
                player.chooseControl('cancel2').set('choiceList', [
                    '令此牌伤害+1',
                    '令此牌无法响应',
                ]).set('ai', function () {
                    var player = get.player(), target = _status.event.getTrigger().target;
                    if (get.attitude(player, trigger.target) > 0) {
                        //game.log("return'cancel2'");
                        return 'cancel2';
                    }
                    if (target && trigger.target.hp + trigger.target.hujia <= 2 && _status.currentPhase && _status.currentPhase.countCards("h") > 1) {
                        return target.mayHaveShan() ? 1 : 0;
                    }
                    return 1;
                });
            } else {
                event.finish();
            }
            'step 2'
            if (result.control != 'cancel2') {
                var target = trigger.target;
                player.logSkill('jifu_R_lingwei', target);
                if (result.index == 1) {
                    game.log(trigger.card, '不可被响应');
                    trigger.directHit.add(target);
                }
                else {
                    game.log(trigger.card, '伤害+1');
                    var map = trigger.getParent().customArgs, id = target.playerid;
                    if (!map[id]) map[id] = {};
                    if (!map[id].extraDamage) map[id].extraDamage = 0;
                    map[id].extraDamage++;
                }
            }
            'step 3'
            //game.log(_status.currentPhase.group);
            if (_status.currentPhase && (_status.currentPhase.hasSkill("quzhudd") || _status.currentPhase.group == 'ΒΜΦCCCP')) {

                if (_status.currentPhase != player) { _status.currentPhase.draw(1); }
                player.draw(1);
            }
            'step 4'
            //game.log(player.hasHistory('sourceDamage'));
            if (player.isIn() && player.getHistory('sourceDamage', function (evt) {
                return evt.getParent(2) == event.parent;
            }).length > 0) {
                player.tempBanSkill('jifu_R_lingwei', 'roundStart');
            }


        },
        group: "jifu_R_lingwei_ban",
        subSkill: {
            ban: {
                trigger: {
                    global: "useCardAfter",
                },
                forced: true,
                filter: function (event, player) {
                    return (player.getHistory('useSkill', function (evt) {
                        return evt.skill == 'jifu_R_lingwei';
                    }).length) && event.targets.length == 1 && event.player.hasHistory('sourceDamage', function (evt) {
                        return evt.card == event.card;
                    });
                },
                content: function () {
                    player.tempBanSkill('jifu_R_lingwei', 'roundStart');
                },
                sub: true,
                "_priority": 0,
            },
        },



        "_priority": 0,

    },
    jifu_R_yuanqin: {
        nobracket: true,
        trigger: {
            target: "taoBegin",
        },
        forced: true,
        filter(event, player) {
            if (event.player == player) { return false; }
            //game.log(event.player);
            //game.log(event.player.group);
            if (event.player != player && (event.player.group == 'RM' || event.player.name == 'tashigan')) { return true; }
            return false;
        },
        async content(event, trigger, player) {
            trigger.baseDamage++;
        },
        "_priority": 0,
    },
    xiuqi: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
        /*able: 1,
        trigger: {
            global: "useCardAfter",
        },
        forced: true,
        filter(event, player) {
            return (event.card.name == "jinjuzhiyuan9" || event.card.name == "wanjian") && event.player != player && event.cards.someInD();
        },
        content() {
            player.gain(trigger.cards.filterInD(), "gain2");
        },
        ai: {
            effect: {
                target(card) {
                    if (card.name == "jinjuzhiyuan9" || card.name == "wanjian") return [0, 1];
                },
            },
        },*/
        "_priority": 0,
    },
    xiuqi2: {
        nobracket: true,
        usable: 1,
        trigger: {
            source: "damageSource",
        },
        filter(event, player) {
            return event.num > 0;
        },
        content() {
            player.recover(1);
        },
    },
    /*xiuqi2: {//上一版本的修葺
        name: "修葺",
        intro: {
            marktext: "修葺",
            content: function (storage, player) { return ('您的舰种技能【航空】临时提升了一级！在您发动【航空】后该效果消失。'); },
        },
        forced: true,
        trigger: {
            player: "phaseUseEnd",
        },
        filter: function (event, player) {
            var hangmucv = false;
            player.getHistory('useSkill', evt => {
                if (evt.skill == 'hangmucv') hangmucv = true;
            });
            return !hangmucv;
        },
        content: function () {
            "step 0"
            game.log('xiuqi2');
            var a = player.countMark('mopaiup'), b = player.countMark('jinengup'), c = player.countMark('wuqiup'), d = player.countMark('useshaup'), e = player.countMark('jidongup'), f = player.countMark('shoupaiup'), g = player.countMark('songpaiup'), h = player.countMark('Expup'), k = player.countMark('_jianzaochuan') + 1;
            if (b > 0) {
                b = b - 1;
                player.storage._qianghuazhuang = [a, b, c, d, e, f, g, h];
            }
            if (player.hasSkill('xiuqi2')) { player.removeSkill('xiuqi2'); player.removeMark('xiuqi2', player.countMark('xiuqi2')); };
        },
        "_priority": 200,
        sub: true,
    },*/
    wanbei: {
        nobracket: true,
        forced: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mod: {
            maxHandcard: function (player, num) {
                return num + player.countCards("s");
            },
        },
        trigger: { player: "phaseUseBegin" },
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        check: function (card) {
            return 17 - get.value(card);
        },
        frequent: true,
        content: function () {//hangmucv
            "step 0"
            player.chooseCardTarget({
                prompt: "弃置两张黑桃或梅花手牌,视为使用【万箭齐发】",
                filterCard: { color: 'black' },
                position: 'h',
                selectCard: 2,
                selectTarget: [1, Infinity],
                filterTarget: function (card, player, target) {
                    return player.canUse({ name: 'wanjian' }, target);
                },
                ai1: function (card) {
                    var player = get.player();
                    // 先评估是否有值得攻击的目标
                    var hasWorthyTarget = game.hasPlayer(function (current) {
                        return player.canUse({ name: 'wanjian' }, current) &&
                            get.effect(current, { name: 'wanjian' }, player, player) > 0;
                    });

                    if (!hasWorthyTarget) return -1; // 没有值得攻击的目标，不弃牌

                    // 计算总攻击效果
                    var totalEffect = 0;
                    game.countPlayer(function (current) {
                        if (player.canUse({ name: 'wanjian' }, current)) {
                            totalEffect += get.effect(current, { name: 'wanjian' }, player, player);
                        }
                    });

                    // 只有当攻击效果大于弃牌价值时才弃牌（需要弃2张牌，所以阈值更高）
                    var cardValue = get.value(card);
                    if (totalEffect > cardValue * 2) {
                        return 4 - cardValue;
                    }
                    return -1;
                },
                ai2: function (target) {
                    return get.effect(target, { name: 'wanjian' }, player, player);
                }
            });


            "step 1"
            if (result.targets && result.targets.length > 0) {
                player.useCard({ name: 'wanjian' }, result.cards, result.targets);
            }
        },
        ai: {
            basic: {
                order: 8.5,
                useful: 1,
                value: 7,
            },
            wuxie: function (target, card, player, viewer) {
                if (get.attitude(viewer, target) > 0 && target.countCards('h', 'shan')) {
                    if (!target.countCards('h') || target.hp == 1 || Math.random() < 0.7) return 0;
                }
            },
            result: {
                player: function (player) {
                    return 1;
                },
            },
            tag: {
                respond: 1,
                respondShan: 1,
                damage: 1,
                multitarget: 1,
                multineg: 1,
                skillTagFilter(player, tag, arg) {
                    if (tag == 'respondShan' && arg == 'respond') return false;
                    return true;
                },
            },
        },
        intro: {
            content: function () {
                return get.translation('hangmucv_info');
            },
        },
    },
    buju: {
        nobracket: true,
        group: ["buju_wuxie", "buju_jiu"],
    },
    buju_wuxie: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        enable: "chooseToUse",
        hiddenCard: function (player, name) {
            if (name == "wuxie") return player.countMark('shenfeng') >= 1;
            return false;
        },
        viewAs: {
            name: "wuxie",
            isCard: false,
        },
        viewAsFilter: function (player) {
            return (!player.hasSkill('buju_wuxie_disable')) && player.countMark('shenfeng') >= 1;
        },
        filterCard: () => true,
        prompt: "将一张牌当作【无懈可击】",
        selectCard: 1,
        check: () => 1,
        precontent: function () {
            player.logSkill("buju_wuxie");
            player.removeMark('shenfeng', 1);
            player.addTempSkill('buju_wuxie_disable', 'roundStart');
            player.restoreSkill("yuanjun");
            delete event.result.skill;
        },
        ai: {
            order: 4,
            basic: {
                useful: [6, 4, 3],
                value: [6, 4, 3],
            },
            result: {
                player: 1,
            },
            expose: 0.2,
        },
        sub: true,
        "_priority": 0,
    },
    buju_wuxie_disable: {
        mark: true,
        marktext: "禁",
        intro: {
            content: "无懈_本轮已发动",
        },
        sub: true,
    },
    buju_jiu: {
        nobracket: true,
        enable: "chooseToUse",
        audio: "ext:舰R牌将/audio/skill:true",
        hiddenCard: function (player, name) {
            if (name == "jiu") return player.countMark('shenfeng') >= 1;
            return false;
        },
        /* filter: function (event, player) {
            return (!player.hasSkill('buju_jiu_disable')) && player.countMark('shenfeng') >= 1 && event.filterCard({ name: "jiu", isCard: true }, player, event);
        }, */
        viewAs: {
            name: "jiu",
            isCard: false,
        },
        viewAsFilter: function (player) {
            return (!player.hasSkill('buju_jiu_disable')) && player.countMark('shenfeng') >= 1;
        },
        filterCard: () => true,
        prompt: "将一张牌当作【酒】",
        selectCard: 1,
        check: () => 1,
        precontent: function () {
            player.logSkill("buju_jiu");
            player.removeMark('shenfeng', 1);
            player.addTempSkill('buju_jiu_disable', 'roundStart');
            delete event.result.skill;
        },
        /* content: function () {
            if (_status.event.getParent(2).type == "dying") {
                event.dying = player;
                event.type = "dying";
            }
            player.removeMark('shenfeng', 1);
            player.addTempSkill('buju_jiu_disable', 'roundStart');
            player.useCard({ name: "jiu", isCard: true }, player);
        }, */
        ai: {
            order: 5,
            result: {
                player: function (player) {
                    if (_status.event.parent.name == "phaseUse") {
                        if (player.countCards("h", "jiu") > 0) return 0;
                        if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) return 0;
                        if (!player.countCards("h", "sha")) return 0;
                        var targets = [];
                        var target;
                        var players = game.filterPlayer();
                        for (var i = 0; i < players.length; i++) {
                            if (get.attitude(player, players[i]) < 0) {
                                if (player.canUse("sha", players[i], true, true)) {
                                    targets.push(players[i]);
                                }
                            }
                        }
                        if (targets.length) {
                            target = targets[0];
                        } else {
                            return 0;
                        }
                        var num = get.effect(target, { name: "sha" }, player, player);
                        for (var i = 1; i < targets.length; i++) {
                            var num2 = get.effect(targets[i], { name: "sha" }, player, player);
                            if (num2 > num) {
                                target = targets[i];
                                num = num2;
                            }
                        }
                        if (num <= 0) return 0;
                        var e2 = target.getEquip(2);
                        if (e2) {
                            if (e2.name == "tengjia") {
                                if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) return 0;
                            }
                            if (e2.name == "renwang") {
                                if (!player.countCards("h", { name: "sha", color: "red" })) return 0;
                            }
                            if (e2.name == "baiyin") return 0;
                        }
                        if (player.getEquip("guanshi") && player.countCards("he") > 2) return 1;
                        return target.countCards("h") > 3 ? 0 : 1;
                    }
                    if (player == _status.event.dying) return 3;
                },
            },
            effect: {
                target: function (card, player, target) {
                    if (card.name == "guiyoujie") return [0, 0.5];
                },
            },
        },
    },
    buju_jiu_disable: {
        mark: true,
        marktext: "禁",
        intro: {
            content: "酒_本轮已发动",
        },
        sub: true,
    },
    shenfeng: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        mark: true,
        marktext: "风",
        intro: {
            name: "风",
            content: "拥有$个风标记",
        },
        trigger: {
            player: "damageEnd",
            source: "damageSource",
        },
        frequent: true,
        filter: function (event) {
            return event.num > 0;
        },
        /*getIndex(event, player, triggername) {
            return event.num;
        },*/
        content: function () {
            event.count = trigger.num;
            player.addMark('shenfeng', event.count);
        },
        ai: {
            maixie: true,
            "maixie_hp": true,
        },
    },
    qiangyun: {
        nobracket: true,
        mark: true,
        marktext: "运",
        intro: {
            name: "强运",
            content: "强运未发动",
        },
        trigger: {
            player: "dying",
        },
        unique: true,
        juexingji: true,
        forced: true,
        skillAnimation: true,
        animationColor: "metal",
        filter: function (event, player) {
            if (player.storage.qiangyun) return false;
            return player.hasSkill("qiangyun") && player.hp <= 0;
        },
        content: function () {
            'step 0'
            player.awakenSkill('qiangyun');
            'step 1'
            player.recover(1 - player.hp);
            player.removeSkill('qiangyun');
        },
        "_priority": 0,
    },
    yuanjun: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        unique: true,
        enable: "phaseUse",
        skillAnimation: true,
        animationColor: "gray",
        mark: true,
        limited: true,
        filter: function (event, player) {
            return player.countMark('shenfeng') >= 6;
        },
        content: function () {
            player.awakenSkill('yuanjun');
            var i = player.countMark('shenfeng');
            player.removeMark('shenfeng', i);
            player.chooseUseTarget("wanjian", true);
        },
        ai: {
            basic: {
                order: 8.5,
                useful: 1,
                value: 5,
            },
            wuxie(target, card, player, viewer, status) {
                let att = get.attitude(viewer, target),
                    eff = get.effect(target, card, player, target);
                if (Math.abs(att) < 1 || status * eff * att >= 0) return 0;
                let evt = _status.event.getParent("useCard"),
                    pri = 1,
                    bonus = player.hasSkillTag("damageBonus", true, {
                        target: target,
                        card: card,
                    }),
                    damage = 1,
                    isZhu = function (tar) {
                        return (
                            tar.isZhu ||
                            tar === game.boss ||
                            tar === game.trueZhu ||
                            tar === game.falseZhu
                        );
                    },
                    canShan = function (tar, blur) {
                        let known = tar.getKnownCards(viewer);
                        if (!blur)
                            return known.some((card) => {
                                let name = get.name(card, tar);
                                return (
                                    (name === "shan" || name === "hufu") &&
                                    lib.filter.cardRespondable(card, tar)
                                );
                            });
                        if (
                            tar.countCards("hs", (i) => !known.includes(i)) >
                            3.67 - (2 * tar.hp) / tar.maxHp
                        )
                            return true;
                        if (!tar.hasSkillTag("respondShan", true, "respond", true)) return false;
                        if (tar.hp <= damage) return false;
                        if (tar.hp <= damage + 1) return isZhu(tar);
                        return true;
                    },
                    self = false;
                if (canShan(target)) return 0;
                if (
                    bonus &&
                    !viewer.hasSkillTag("filterDamage", null, {
                        player: player,
                        card: card,
                    })
                )
                    damage = 2;
                if (
                    (viewer.hp <= damage || (viewer.hp <= damage + 1 && isZhu(viewer))) &&
                    !canShan(viewer)
                ) {
                    if (viewer === target) return status;
                    let fv = true;
                    if (evt && evt.targets)
                        for (let i of evt.targets) {
                            if (fv) {
                                if (target === i) fv = false;
                                continue;
                            }
                            if (viewer == i) {
                                if (isZhu(viewer)) return 0;
                                self = true;
                                break;
                            }
                        }
                }
                let mayShan = canShan(target, true);
                if (
                    bonus &&
                    !target.hasSkillTag("filterDamage", null, {
                        player: player,
                        card: card,
                    })
                )
                    damage = 2;
                else damage = 1;
                if (isZhu(target)) {
                    if (eff < 0) {
                        if (target.hp <= damage + 1 || (!mayShan && target.hp <= damage + 2))
                            return 1;
                        if (mayShan && target.hp > damage + 2) return 0;
                        else if (mayShan || target.hp > damage + 2) pri = 3;
                        else pri = 4;
                    } else if (target.hp > damage + 1) pri = 2;
                    else return 0;
                } else if (self) return 0;
                else if (eff < 0) {
                    if (!mayShan && target.hp <= damage) pri = 5;
                    else if (mayShan) return 0;
                    else if (target.hp > damage + 1) pri = 2;
                    else if (target.hp === damage + 1) pri = 3;
                    else pri = 4;
                } else if (target.hp <= damage) return 0;
                let find = false;
                if (evt && evt.targets)
                    for (let i = 0; i < evt.targets.length; i++) {
                        if (!find) {
                            if (evt.targets[i] === target) find = true;
                            continue;
                        }
                        let att1 = get.attitude(viewer, evt.targets[i]),
                            eff1 = get.effect(evt.targets[i], card, player, evt.targets[i]),
                            temp = 1;
                        if (Math.abs(att1) < 1 || att1 * eff1 >= 0 || canShan(evt.targets[i]))
                            continue;
                        mayShan = canShan(evt.targets[i], true);
                        if (
                            bonus &&
                            !evt.targets[i].hasSkillTag("filterDamage", null, {
                                player: player,
                                card: card,
                            })
                        )
                            damage = 2;
                        else damage = 1;
                        if (isZhu(evt.targets[i])) {
                            if (eff1 < 0) {
                                if (
                                    evt.targets[i].hp <= damage + 1 ||
                                    (!mayShan && evt.targets[i].hp <= damage + 2)
                                )
                                    return 0;
                                if (mayShan && evt.targets[i].hp > damage + 2) continue;
                                if (mayShan || evt.targets[i].hp > damage + 2) temp = 3;
                                else temp = 4;
                            } else if (evt.targets[i].hp > damage + 1) temp = 2;
                            else continue;
                        } else if (eff1 < 0) {
                            if (!mayShan && evt.targets[i].hp <= damage) temp = 5;
                            else if (mayShan) continue;
                            else if (evt.targets[i].hp > damage + 1) temp = 2;
                            else if (evt.targets[i].hp === damage + 1) temp = 3;
                            else temp = 4;
                        } else if (evt.targets[i].hp > damage + 1) temp = 2;
                        if (temp > pri) return 0;
                    }
                return 1;
            },
            result: {
                player(player, target) {
                    if (player._wanjian_temp || player.hasSkillTag("jueqing", false, target))
                        return 0;
                    player._wanjian_temp = true;
                    let eff = get.effect(
                        target,
                        new lib.element.VCard({ name: "wanjian" }),
                        player,
                        target
                    );
                    delete player._wanjian_temp;
                    if (eff >= 0) return 0;
                    if (
                        target.hp > 2 ||
                        (target.hp > 1 &&
                            !target.isZhu &&
                            target != game.boss &&
                            target != game.trueZhu &&
                            target != game.falseZhu)
                    )
                        return 0;
                    if (target.hp > 1 && target.hasSkillTag("respondShan", true, "respond", true))
                        return 0;
                    let known = target.getKnownCards(player);
                    if (
                        known.some((card) => {
                            let name = get.name(card, target);
                            if (name === "shan" || name === "hufu")
                                return lib.filter.cardRespondable(card, target);
                            if (name === "wuxie")
                                return lib.filter.cardEnabled(card, target, "forceEnable");
                        })
                    )
                        return 0;
                    if (
                        target.hp > 1 ||
                        target.countCards("hs", (i) => !known.includes(i)) >
                        3.67 - (2 * target.hp) / target.maxHp
                    )
                        return 0;
                    let res = 0,
                        att = get.sgnAttitude(player, target);
                    res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
                    if (get.mode() === "identity" && target.identity === "fan") res += 2.4;
                    if (
                        (get.mode() === "guozhan" &&
                            player.identity !== "ye" &&
                            player.identity === target.identity) ||
                        (get.mode() === "identity" &&
                            player.identity === "zhu" &&
                            (target.identity === "zhong" || target.identity === "mingzhong"))
                    )
                        res -= 0.8 * player.countCards("he");
                    return res;
                },
                target(player, target) {
                    if (target && target != "undefined") {
                        let zhu = (get.mode() === "identity" && target.isZhu) || target.identity === "zhu";
                        if (!lib.filter.cardRespondable({ name: "shan" }, target)) {
                            if (zhu) {
                                if (target.hp < 2) return -99;
                                if (target.hp === 2) return -3.6;
                            }
                            return -2;
                        }
                        let known = target.getKnownCards(player);
                        if (
                            known.some((card) => {
                                let name = get.name(card, target);
                                if (name === "shan" || name === "hufu")
                                    return lib.filter.cardRespondable(card, target);
                                if (name === "wuxie")
                                    return lib.filter.cardEnabled(card, target, "forceEnable");
                            })
                        )
                            return -1.2;
                        let nh = target.countCards("hs", (i) => !known.includes(i));
                        if (zhu && target.hp <= 1) {
                            if (nh === 0) return -99;
                            if (nh === 1) return -60;
                            if (nh === 2) return -36;
                            if (nh === 3) return -8;
                            return -5;
                        }
                        if (target.hasSkillTag("respondShan", true, "respond", true)) return -1.35;
                        if (!nh) return -2;
                        if (nh === 1) return -1.65;
                    }
                    return -1.5;
                },
            },
            tag: {
                respond: 1,
                respondShan: 1,
                damage: 1,
                multitarget: 1,
                multineg: 1,
                skillTagFilter(player, tag, arg) {
                    if (tag == 'respondShan' && arg == 'respond') return false;
                    return true;
                },
            },
        },
        intro: {
            content: "limited",
        },
        init: (player, skill) => (player.storage[skill] = false),
        "_priority": 0,
    },
    mujizhengren: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        unique: true,
        enable: "phaseUse",
        skillAnimation: true,
        animationColor: "gray",
        mark: true,
        limited: true,
        filterCard: true,
        selectCard: 3,
        filter: function (event, player) {
            return player.countCards("h") >= player.maxHp;
        },
        filterTarget: function (card, player, target) {
            return true;
        },
        content: function () {
            player.awakenSkill('mujizhengren');
            target.turnOver();
        },
        intro: {
            content: "limited",
        },
        init: (player, skill) => (player.storage[skill] = false),
        "_priority": 0,
        ai: {
            order: 2,
            expose: 0.3,
            threaten: 1.2,
            result: {
                target: function (player, target) {
                    if (target.hasSkillTag("noturn")) return 0;
                    if (target.isTurnedOver()) return 2;
                    return -1;
                },
            },
        },
    },
    liehuoji: {
        audio: "ext:舰R牌将/audio/skill:true",
        nobracket: true,
        trigger: {
            global: ["phaseDiscardEnd"],
        },
        filter(event, player) {
            var cards = [];
            event.player.getHistory("lose", function (evt) {
                if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) cards.addArray(evt.cards2);
            });
            return cards.length > 0;
        },
        frequent: true,
        content: function () {
            "step 0"
            //var cards = Array.from(ui.discardPile.childNodes);
            var cards = [];
            trigger.player.getHistory("lose", evt => {
                if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) cards.addArray(evt.cards2.filterInD("d"));
            });
            if (cards.length) {
                player.chooseButton(["选择至多三张牌？", cards], [1, 3], true).set("ai", get.buttonValue);
            } else event._result = { bool: false };
            "step 1"
            if (result.links && result.links.length) {
                event.cards2 = result.links;
                var suits = event.cards2.map(card => get.suit(card));
                var uniqueSuits = [...new Set(suits)];
                event.suitNum = uniqueSuits.length;
                player.chooseTarget(1, get.prompt("liehuoji"), "令一名其他角色使用区域内任意张花色数为" + event.suitNum + "的牌交换", function (card, player, target) {
                    if (player == target) { return false; }
                    var cards1 = target.getCards('hej');
                    var suits3 = cards1.map(card => get.suit(card));
                    var uniqueSuits3 = [...new Set(suits3)];
                    return uniqueSuits3.length >= event.suitNum;
                }).ai = function (target) {
                    var player = get.player();
                    if (target.countCards("j") == 0 && target.countCards("h") < event.cards2.length) { return -get.attitude(player, target); }
                    return get.attitude(player, target);
                };
            }
            "step 2"
            if (result.bool) {
                event.targets = result.targets[0];
                //game.log(event.targets);
                var targetCards = event.targets.getCards('hej');
                event.targets.chooseCardButton('选择区域内任意张花色数为' + event.suitNum + '的牌与' + get.translation(event.cards2) + '交换', targetCards, [1, Infinity], true, function (card, player) {
                    return true;
                })
                    .set("ai", function (button) {
                        //game.log(get.translation(button.link));
                        //game.log(get.value(button.link));
                        let player = get.player();
                        if (ui.selected.buttons.length >= event.cards2.length) return 0;
                        if (get.position(button.link) == 'j') { return 12; }
                        if (player.hp < 3) return 7 - get.value(button.link, player);
                        return 10 - get.value(button.link, player);
                    })
                    .set("filterButton", function (button) {
                        var filtersuit = [...new Set(ui.selected.buttons.map(card => get.suit(card)))]
                        if (filtersuit.length == event.suitNum && !filtersuit.includes(get.suit(button.link))) { return false; }
                        return true;
                    });
            }
            "step 3"
            if (result.bool) {
                event.targets.gain(event.cards2, "gain2");
                event.targets.discard(result.links);
                if (event.cards2.length - result.links.length > 0) {
                    var fireDamage = event.cards2.length - result.links.length;
                    event.targets.damage(fireDamage, "fire");
                }
            } else {
                event.finish();
            }
        },
    },
    aizhi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        chooseTarget: true,
        filterTarget: function (card, player, target) {
            return get.distance(player, target, "attack") > 1 && player != target && target.countCards("h") > 0;
        },
        content: function () {
            'step 0';
            player.discardPlayerCard(target, "h", "visible");
            'step 1';
            if (result.bool) {
                event.card = result.cards[0];
                //game.log(event.card);
                if (get.type(event.card) == "trick") {
                    game.log("爱知视为未发动过");
                    player.getStat('skill').aizhi -= 1;
                }
                if (get.type(event.card) === "delay" || get.type(event.card) === "equip") {
                    event.finish();
                    return 0;
                }
                var unablelist = ["shan", "huibi9", "ganraodan9", "wuxie", "zhikongquan9"];
                if (unablelist.includes(get.name(event.card))) {
                    event.finish();
                    return 0;
                }
                player.chooseToDiscard("你可以弃置一张手牌视为使用" + get.translation(event.card), 1, false);
            }
            'step 2';
            if (result.bool) {
                player.chooseUseTarget(
                    {
                        name: event.card.name,
                        isCard: true,
                    },
                    "请选择" + get.translation(event.card) + "的目标",
                    false
                );
            }
        },
        ai: {
            order: 4,
            expose: 0.2,
            result: {
                target: -1,
                player: function (player, target) {
                    if (target.countCards('h') == 0) return 0;
                    if (target.countCards('h') == 1) return -0.1;
                    return -0.5;
                },
            },
        },
    },
    longgu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        global: "longgu_skill",
    },
    longgu_skill: {
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        filter: function (event, player) {
            if (game.hasPlayer(function (current) {
                return current.hasSkill("longgu") && current.isAlive();
            })
            ) {
                if (!(player.hasSkill("longgu_basic") || player.hasSkill("longgu_trick"))) {
                    return player == game.zhu || player.group == "ROCN";
                }
            }
        },
        check: function (event, player) {
            return player.hp <= 2;
        },
        content: function () {
            'step 0'
            player.skip('phaseDraw');
            var str = get.translation(trigger.player);
            player.chooseControl().set('choiceList', [
                '不能成为基本牌的目标',
                '不能成为普通锦囊牌和延时锦囊牌的目标',
            ]).set('ai', function () {
                if (player.countCards("h", card => get.type(card) === "trick") > 1) return 0;
                return 1;
            });
            'step 1'
            if (result.control) {
                if (result.index == 1) {
                    game.log(get.translation(player), '不能成为普通锦囊牌和延时锦囊牌的目标');
                    player.addSkill("longgu_trick");
                }
                else if (result.index == 0) {
                    game.log(get.translation(player), '不能成为基本牌的目标');
                    player.addSkill("longgu_basic");
                }
            }
        }
    },
    longgu_trick: {
        mod: {
            targetEnabled(card, player, target, now) {
                //game.log(get.translation(card));
                //game.log(get.type(card));
                if (get.type(card) == "trick" || get.type(card) == "delay") return false;
            },
        },
        forced: true,
        direct: true,
        trigger: {
            player: "useCard",
        },
        filter: function (event, player) {
            return get.type(event.card) == "trick" || get.type(event.card) == "delay";
        },
        content: function (event, player) {
            player.removeSkill("longgu_trick");
        },
        "_priority": 0,
    },
    longgu_basic: {
        mod: {
            targetEnabled(card, player, target, now) {
                //game.log(get.translation(card));
                //game.log(get.type(card));
                if (get.type(card) == "basic") return false;
            },
        },
        forced: true,
        direct: true,
        trigger: {
            player: "useCard",
        },
        filter: function (event, player) {
            return get.type(event.card) == "basic";
        },
        content: function (event, player) {
            player.removeSkill("longgu_basic");
        },
        "_priority": 0,
    },
    jianghun: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "die",
        },
        direct: true,
        skillAnimation: true,
        animationColor: "wood",
        forceDie: true,
        content: function (event, player) {
            game.addGlobalSkill("jianghun_effect");
            player.$fullscreenpop("江魂！", "thunder");
        },
    },
    jianghun_effect: {
        mod: {
            globalTo(from, to, distance) {
                if (to.group == "ROCN" || to.group == "PLAN") {
                    return distance + 1;
                }
            },
        },
        forced: true,
        silent: true,
    },
    zhuangjiajiaban: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: ["damageBegin4"],
        },
        filter(event, player, name) {
            return event.num > 0;
        },
        check: function (event, player) {
            return true;
        },
        content: function () {
            "step 0"
            player.judge(function (result) {
                return get.color(result) == "red" ? 2 : -2;
            });
            "step 1"
            if (result.bool == true)
                trigger.cancel();
        },
        ai: {
            effect: {
                target: function (card, player, target, current) {
                    if (get.tag(card, 'damage') && get.attitude(player, target) < 0) {
                        return 0.3;
                    }
                },
            },
        },
        "_priority": 0,
    },
    xiandaihuagaizao: {
        intro: {
            content: "已发动#次",
        },
        onremove: true,
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: ["phaseJieshuBegin"],
        },
        filter(event, player, name) {
            return player.countCards("hes") >= Math.min(player.countMark("xiandaihuagaizao") + 1, 3);
        },
        direct: true,
        content: function () {
            "step 0"
            num = player.countMark("xiandaihuagaizao") + 1;
            player
                .chooseToDiscard(get.prompt2("xiandaihuagaizao"), Math.min(num, 3), "hes")
                .set("ai", card => {
                    if (!player.hasSkill("xianjinkongguan") && player.maxHp == 4 && player.isTurnedOver()) {
                        return 12 - get.value(card);
                    }
                    if (player.maxHp < 5) {
                        return 9 - get.value(card);
                    }
                    if (_status.event.effect > 0) {
                        return 7 - get.value(card);
                    }
                    return 0;
                })
                .set("effect", get.effect(player, { name: "tao" }, player, player))
                .set("logSkill", ["xiandaihuagaizao", player]);
            "step 1"
            if (result.bool == true) {
                player.addMark("xiandaihuagaizao", 1, false);
                player.chooseControl().set('choiceList', [
                    '回复一点体力',
                    '增加一点体力上限',
                ]).set('ai', function () {
                    if (player.hp >= 3 && player.maxHp == 4) return 1;
                    if (player.hp != player.maxHp) return 0;
                    return 1;
                });
            } else {
                event.finish();
            }
            "step 2"
            if (result.index == 1) {
                player.gainMaxHp(1);
            }
            else player.recover(1);
            "step 3"
            if (player.maxHp >= 5 && !player.hasSkill("xianjinkongguan")) {
                player.recover();
                player.turnOver();
                player.addSkill("xianjinkongguan");
            }
        },
    },
    xianjinkongguan: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        intro: {
            content: function (storage, player, skill) {
                return '出牌阶段你使用杀或伤害类锦囊牌时,你可以受到一点无来源伤害令此牌额外结算一次。';
            }
        },
        trigger: {
            player: "useCard",
        },
        filter: function (event, player) {
            var evtx = event.getParent('phaseUse');
            if (!evtx || evtx.player != player) return false;
            return (_status.currentPhase == player && (get.type(event.card) == 'trick' || get.name(event.card) == "sha") && get.tag(event.card, 'damage') && event.getParent('phaseUse') == evtx);
        },
        check(event, player) {
            return !get.tag(event.card, 'norepeat') && get.value(event.cards) + player.hp * 2 - 14 > 0;
        },
        content: function () {
            player.damage("noSource");
            trigger.effectCount++;
        },
    },
    huofu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        count: function () {
            var num = 0;
            game.countPlayer2(function (current) {
                current.getHistory('lose', function (evt) {
                    if (evt.position == ui.discardPile) {
                        for (var i = 0; i < evt.cards.length; i++) {
                            if (get.color(evt.cards[i]) == 'red' && get.type(evt.cards[i]) == 'basic') num++;
                        }
                    }
                })
            });
            return num;
        },
        direct: true,
        forced: true,
        filter: function (event, player) {
            return lib.skill.huofu.count() > 0;

        },
        trigger: {
            player: "phaseJieshuBegin",
        },
        content: function () {
            if (lib.skill.huofu.count() > 0) player.addTempSkill("huofu_mianyi", { player: 'phaseBegin' })
        },
        group: "huofu_mianyi",
        subSkill: {
            mianyi: {
                audio: "ext:舰R牌将/audio/skill:2",
                trigger: {
                    player: "damageBegin4",
                },
                forced: true,
                filter: function (event, player) {
                    return get.color(event.card) == "red";
                },
                content: function () {
                    trigger.cancel();
                },
                ai: {
                    effect: {
                        target: function (card, player, target, current) {
                            if (get.color(card) == "red" && get.tag(card, "damage")) {
                                return "zeroplayertarget";
                            }
                        },
                    },
                },
                sub: true,
            },
        },
    },
    xunqian: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "useCard",
        },
        frequent: true,
        filter: function (event) {
            return get.type(event.card, "trick") == "trick" && event.card.isCard;
        },
        init: function (player) {
            player.storage.xunqian = 0;
        },
        content: function () {
            "step 0";
            player.draw();
            "step 1";
            player.chooseControl().set('choiceList', [
                '弃置一张牌',
                '将任意张牌交给一名其他角色',
            ]).set('prompt', get.prompt('xunqian')).setHiddenSkill('xunqian').set('ai', function () {
                var player = get.player();
                if (game.countPlayer(function (current) {
                    return get.attitude(player, current) > 0;
                })) { return 1; }
                return 0;

            });
            "step 2";
            if (result.index == 1) {
                player.chooseCardTarget({
                    filterCard: function (card) {
                        return get.itemtype(card) == "card";
                    },
                    filterTarget: lib.filter.notMe,
                    selectCard: [1, Infinity],
                    prompt: "请选择要分配的卡牌和目标",
                    ai1: function (card) {
                        if (!ui.selected.cards.length) return 1;
                        return 0;
                    },
                    ai2: function (target) {
                        var player = _status.event.player,
                            card = ui.selected.cards[0];
                        var val = target.getUseValue(card);
                        if (val > 0) return val * get.attitude(player, target) * 2;
                        return get.value(card, target) * get.attitude(player, target);
                    },
                });
            }
            else if (result.index == 0) {
                player.chooseToDiscard(1);
                event.finish();
            }
            "step 3";
            if (result.bool) {
                //game.log(get.translation(result.cards));
                //game.log(get.translation(result.targets));
                player.give(result.cards, result.targets[0]);
            }
        },
        ai: {
            threaten: 1.4,
            noautowuxie: true,
        },

        intro: {
            content: "本回合手牌上限+#",
        },
        "_priority": 0,
    },
    zhanxian: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseUseBefore",
        },
        frequent: true,
        mod: {
            maxHandcard: function (player, num) {
                return player.maxHp;
            }
        },
        filter(event, player) {
            return player.countCards("h") > 0;
        },
        content() {
            "step 0";
            player.chooseCard("h", [1, player.countCards("h")], get.prompt("zhanxian"), "将任意张牌作为“斩”置于武将牌上").set("ai", function (card) {
                var player = _status.event.player;
                var list = game.filterPlayer();
                var maxhs = 0;
                for (var i = 0; i < list.length; i++) {
                    if (list[i] != player && list[i].isMaxHandcard() && get.attitude(player, list[i]) < 0) {
                        maxhs = list[i].countCards("h");
                        break;
                    }
                }
                if (ui.selected.cards.length > maxhs) return 0;
                if (player.countCards("h", function (cards) {
                    return get.tag(card, "damage");
                }) <= 0) return 0;
                if (!player.hasValueTarget(card) && get.value(card) < 7.5) return 1;
                return 0;
            });
            "step 1";
            if (result.bool) {
                player.logSkill("zhanxian");
                player.addToExpansion(result.cards, player, "give").gaintag.add("zhanxian");
            }
        },
        onremove(player, skill) {
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
        intro: {
            content: "expansion",
            markcount: "expansion",
        },
        group: ["zhanxian_1", "zhanxian_2"],
        subSkill: {
            1: {
                trigger: {
                    player: "phaseJieshuBegin",
                },
                forced: true,
                locked: false,
                filter(event, player) {
                    return (
                        player.getExpansions("zhanxian") && player.getExpansions("zhanxian").length > 0
                    );
                },
                content() {
                    "step 0";
                    var cards = player.getExpansions("zhanxian");
                    if (cards.length) player.discard(cards);//player.gain(cards, "gain2");
                },
                sub: true,
                "_priority": 0,
            },
            2: {
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter: function (event, player) {
                    return (
                        game.hasPlayer(function (current) {
                            return /* current != player && */player.getExpansions("zhanxian") && current.countCards("h") <= player.getExpansions('zhanxian').length;
                        })
                    );
                },
                content: function () {
                    var hs = player.getExpansions('zhanxian').length;
                    trigger.directHit.addArray(
                        game.filterPlayer(function (current) {
                            return /* current != player && */ current.countCards("h") <= hs;
                        })
                    );
                },
                ai: {
                    threaten: 1.4,
                    "directHit_ai": true,
                    skillTagFilter: function (player, tag, arg) {
                        return (
                            player.getExpansions("zhanxian") && player.getExpansions('zhanxian').length >= arg.target.countCards("h")
                        );
                    },
                },
            },
        },
        "_priority": 0,
    },
    guishen: {
        nobracket: true,
        onremove(player, skill) {
            var targets = game.filterPlayer(current => current.hasSkill("guishen_fengyin"));
            for (i in targets) {
                targets[i].removeSkill("guishen_fengyin");
            }
        },
        forced: true,
        trigger: {
            player: "phaseUseBegin",
        },
        direct: true,
        filter: function (event, player) {
            return _status.currentPhase == player;
        },
        content: function () {
            "step 0";
            event.num = 0;
            event.targets = game.filterPlayer(current => current != player).sortBySeat();
            "step 1";
            event.target1 = event.targets.shift();
            if (event.target1.hp > event.target1.maxHp / 2) {
                event.target1.addTempSkill("guishen_fengyin", { global: "phaseUseEnd" });
            }
            'step 2';
            if (event.num < targets.length) { event.goto(1); }
            //game.log("技能结束");
        },
        group: ["guishen_change"],
        subSkill: {
            change: {
                forced: true,
                direct: true,
                trigger: {
                    global: ["damageEnd", "loseHpEnd", "recoverEnd", "loseMaxHpEnd", "gainMaxHpEnd"],
                },
                filter: function (event, player) {
                    return _status.currentPhase == player && event.player != player;
                },
                content: function () {
                    if (trigger.player.hp > trigger.player.maxHp / 2 && !trigger.player.hasSkill("guishen_fengyin")) { trigger.player.addTempSkill("guishen_fengyin", { global: "phaseUseEnd" }); }
                    if (trigger.player.hp <= trigger.player.maxHp / 2 && trigger.player.hasSkill("guishen_fengyin")) { trigger.player.removeSkill("guishen_fengyin"); }
                },
            },
        },
    },
    guishen_fengyin: {
        init: function (player, skill) {
            player.addSkillBlocker(skill);
        },
        onremove: function (player, skill) {
            player.removeSkillBlocker(skill);
        },
        charlotte: true,
        skillBlocker: function (skill, player) {
            return !lib.skill[skill].charlotte;
        },
        mark: true,
        intro: {
            content: function (storage, player, skill) {
                var list = player.getSkills(null, false, false).filter(function (i) {
                    return lib.skill.guishen_fengyin.skillBlocker(i, player);
                });
                if (list.length) return "失效技能：" + get.translation(list);
                return "无失效技能";
            },
        },
        "_priority": 0,
    },
    pingduzhanhuo: {
        nobracket: true,
        group: ["pingduzhanhuo_jieshu", "pingduzhanhuo_zhunbei", "pingduzhanhuo_zhunbei_damage"],
        subSkill: {
            jieshu: {
                trigger: { player: "phaseJieshuBegin", },
                frequent: true,
                filter: function (event, player) {

                    return player.getHistory("sourceDamage").length == 0;
                },
                content: function () {
                    //game.logSkill("pingduzhanhuo");
                    player.draw(1);

                },
            },
            zhunbei: {
                trigger: { player: "phaseZhunbeiBegin", },
                frequent: true,
                filter: function (event, player) {
                    return !player.hasSkill("pingduzhanhuo_zhunbei_disable");
                    //return player.getRoundHistory("damage").length == 0;
                },
                content: function () {
                    player.draw(1);
                },
            },
            zhunbei_damage: {
                forced: true,
                popup: false,
                charlotte: true,
                trigger: {
                    player: "damageEnd",
                },
                filter: function (event, player) {
                    return !player.hasSkill("pingduzhanhuo_zhunbei_disable");
                },
                content: function () {
                    player.addTempSkill("pingduzhanhuo_zhunbei_disable", "phaseJieshuBegin");

                },
            },
            zhunbei_disable: {
                charlotte: true,
                marktext: "平",
                intro: {
                    name: "平",
                    content: "平度战火_下个准备阶段不能摸牌",
                },
            },

        },
        "_priority": 0,
    }, kelaosaiweici_R_jinji: {
        // 进击：
        // 用【杀】后可先摸一张；若摸到基本牌,则可再弃掉它,
        // 把这张【杀】从本回合使用次数里“退款”,为连续进攻续航。
        nobracket: true,
        usable: 1,
        trigger: {
            player: "useCard",
        },
        frequent: true,
        filter: function (event) {
            return event.card && event.card.name == "sha";
        },
        prompt2: "摸一张牌,然后若此牌为基本牌,你可以弃置之令此【杀】不计入本回合的使用次数。",
        check: function (event, player) {
            return true;
        },
        content: function () {
            "step 0";
            player.draw();
            'step 1'
            event.card = result[0];
            if (get.type(event.card) != "basic") {
                event.finish();
                return;
            }
            // 只有摸到的牌仍在手里,才允许把它弃掉来换“不计次数”。
            if (get.position(event.card) != "h") {
                event.finish();
                return;
            }
            player.chooseBool("进击：是否弃置" + get.translation(event.card) + "令此【杀】不计入本回合的使用次数？").set("ai", function () {
                var player = get.player();
                var card = _status.event.getParent().card;
                if (!card || _status.currentPhase != player) return false;
                if (card.name == "sha") {
                    return game.hasPlayer(function (current) {
                        return current != player && get.attitude(player, current) < 0 && player.canUse({ name: "sha" }, current);
                    });
                }
                if (card.name == "jiu") {
                    return player.countCards("h", function (current) {
                        return current != card && current.name == "sha";
                    }) > 0;
                }
                return false;
            });
            "step 2";
            if (result.bool && get.position(event.card) == "h") {
                player.discard(event.card);
                if (trigger.addCount !== false) {
                    // 回退本次【杀】对次数统计的占用,和 addCount=false 的虚拟出牌保持一致。
                    trigger.addCount = false;
                    var stat = player.getStat().card;
                    if (stat && stat.sha > 0) player.getStat().card.sha--;
                }
                game.log(trigger.card, "不计入次数限制");
            }
        },
        ai: {
            expose: 0.15,
        },
    },
    kelaosaiweici_R_lunzhan: {
        // 论战：
        // 准备阶段在“控顶保资源”和“本回合杀伤强化”之间二选一。
        nobracket: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        frequent: true,
        content: function () {
            "step 0";
            // KMS 角色数量直接决定控顶分支的手牌上限补正。
            player.chooseControl().set("choiceList", [
                "观看并排列牌堆顶的4张牌,本回合手牌上限+" + game.countPlayer(function (current) {
                    return current.group == "KMS";
                }),
                "本回合你使用【杀】造成的伤害+1",
            ]).set("prompt", get.prompt("kelaosaiweici_R_lunzhan")).set("ai", function () {
                var player = get.player();
                if (player.countCards("h", function (card) {
                    return card.name == "sha";
                }) > 0 && game.hasPlayer(function (current) {
                    return current != player && get.attitude(player, current) < 0 && player.canUse({ name: "sha" }, current);
                })) return 1;
                return 0;
            });
            "step 1";
            if (result.index == 1) {
                player.addTempSkill("kelaosaiweici_R_lunzhan_damage", { player: "phaseAfter" });
                event.finish();
                return;
            }
            else {
                event.kelaosaiweici_R_lunzhan_hand = game.countPlayer(function (current) {
                    return current.group == "KMS";
                });
                var cards = get.cards(4);
                game.cardsGotoOrdering(cards);
                var next = player.chooseToMove();
                next.set('list', [
                    ['牌堆顶', cards],
                    ['牌堆底'],
                ]);
                next.set('prompt', '点击将牌移动到牌堆顶或牌堆底');
                next.processAI = function (list) {
                    var cards = list[0][1], player = _status.event.player;
                    var target = (_status.event.getTrigger().name == 'phaseZhunbei') ? player : player.next;
                    var att = get.sgn(get.attitude(player, target));
                    var top = [];
                    var judges = target.getCards('j');
                    var stopped = false;
                    if (player != target || !target.hasWuxie()) {
                        for (var i = 0; i < judges.length; i++) {
                            var judge = get.judge(judges[i]);
                            cards.sort(function (a, b) {
                                return (judge(b) - judge(a)) * att;
                            });
                            if (judge(cards[0]) * att < 0) {
                                stopped = true; break;
                            }
                            else {
                                top.unshift(cards.shift());
                            }
                        }
                    }
                    var bottom;
                    if (!stopped) {
                        cards.sort(function (a, b) {
                            return (get.value(b, player) - get.value(a, player)) * att;
                        });
                        while (cards.length) {
                            if ((get.value(cards[0], player) <= 5) == (att > 0)) break;
                            top.unshift(cards.shift());
                        }
                    }
                    bottom = cards;
                    return [top, bottom];
                }
            }
            "step 2"
            var top = result.moved[0];
            var bottom = result.moved[1];
            top.reverse();
            game.cardsGotoPile(
                top.concat(bottom),
                ['top_cards', top],
                function (event, card) {
                    if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
                    return null;
                }
            )
            if (event.triggername == 'phaseZhunbeiBegin' && top.length == 0) {
                player.addTempSkill('reguanxing_on');
            }
            player.popup(get.cnNumber(top.length) + '上' + get.cnNumber(bottom.length) + '下');
            game.log(player, '将' + get.cnNumber(top.length) + '张牌置于牌堆顶');
            "step 3"
            game.delayx();
            if (typeof event.kelaosaiweici_R_lunzhan_hand == "number") {
                player.addTempSkill("kelaosaiweici_R_lunzhan_hand", { player: "phaseAfter" });
                player.setStorage("kelaosaiweici_R_lunzhan_hand", event.kelaosaiweici_R_lunzhan_hand);

            }
        }
    },
    kelaosaiweici_R_lunzhan_hand: {
        charlotte: true,
        mark: true,
        onremove: function (player, skill) {
            // 临时上限在回合结束后清除,顺手把缓存值一并删掉。
            delete player.storage[skill];
        },
        mod: {
            maxHandcard: function (player, num) {
                return num + (player.storage.kelaosaiweici_R_lunzhan_hand || 0);
            },
        },
        intro: {
            content: function (storage) {
                return "本回合手牌上限+" + (storage || 0);
            },
        },
    },
    kelaosaiweici_R_lunzhan_damage: {
        charlotte: true,
        mark: true,
        intro: {
            content: "本回合你使用【杀】造成的伤害+1",
        },
        silent: true,
        popup: false,
        forced: true,
        trigger: {
            source: "damageBegin1",
        },
        filter: function (event, player) {
            return event.card && event.card.name == "sha" && event.player != player;
        },
        content: function () {
            // 直接在 damageBegin1 增伤,兼容绝大多数【杀】的后续结算。
            trigger.num++;
        },
    },
    jing_shu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        content: function () {
            'step 0';
            player.chooseCard('h', [1, Infinity], get.prompt('jing_shu')).set('ai', function (card) {
                return 6 - get.value(card);
            });
            'step 1';
            if (result.bool) {
                event.cards = result.cards;
                player.showCards(event.cards, get.translation(player) + '发动了【惊鼠】');
                player.chooseTarget('令一名其他角色选择', true, function (card, player, target) {
                    return target != player;
                }).set('ai', function (target) {
                    var player = get.player();
                    var att = get.attitude(player, target);
                    return -att;
                });
            } else {
                event.finish();
            }
            'step 2';
            if (result.bool && result.targets && result.targets.length > 0) {
                event.target = result.targets[0];
                event.num = event.cards.length;
                event.target.chooseControl('翻面获得牌', '弃置牌交牌').set('choiceList', [
                    '翻面并获得' + get.translation(player) + '展示的所有牌',
                    '弃置' + get.translation(player) + '展示的所有牌，然后交给' + get.translation(player) + '等量张牌'
                ]).set('ai', function () {
                    var player = get.player();
                    var source = _status.event.player1;
                    var handlen = player.countCards('h');
                    var hp = player.hp;
                    var sourceAtt = get.attitude(player, source);
                    // 基础得失评估：翻面能补牌+解除姿态；交牌可打击/消耗对手
                    var scoreFlip = 0;
                    var scoreGive = 0;

                    // 翻面角度
                    if (!player.isTurnedOver()) scoreFlip += 2;
                    if (handlen <= 2) scoreFlip += 3;
                    if (hp <= 2) scoreFlip += 1;
                    if (sourceAtt > 0) scoreFlip += 1; // 友方更倾向自保

                    // 交牌角度
                    if (sourceAtt < 0) scoreGive += 3; // 敌方直接补手非常吃亏
                    if (handlen >= 4) scoreGive += 2; // 手牌多时丢牌影响小
                    if (player.isTurnedOver()) scoreGive += 2; // 本身翻面反而可耍反击

                    // 小概率随机，避免千篇一律（0~1），阈值0.2随机翻转选择
                    var randomBias = Math.random();
                    if (randomBias < 0.1) return 0;
                    if (randomBias > 0.9) return 1;

                    return scoreGive > scoreFlip ? 1 : 0;
                }).set("player1", player);
            } else {
                event.finish();
            }
            'step 3';
            if (result.index == 0) {
                event.target.turnOver();
                event.target.gain(event.cards, player, 'giveAuto');
            } else {
                player.discard(event.cards);
                event.target.chooseCard('h', event.num, '交给' + get.translation(player) + event.num + '张牌', true).set('ai', function (card) {
                    return -get.value(card);
                });
                event.goto(4);
            }
            'step 4';
            if (result.bool) {
                event.target.give(result.cards, player);
            }
        },
        ai: {
            order: 7,
            result: {
                player: 1,
            },
        },
    },
    ling_mu: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: {
            player: "phaseDrawEnd",
        },
        filter: function (event, player) {
            return true;
        },
        check: function (event, player) {
            var cards = player.getCards('h');
            return cards.length > 0 && cards.every(function (card) { return get.type(card) != 'trick'; });
        },
        content: function () {
            var cards = player.getCards('h');
            player.showCards(cards, get.translation(player) + '展示了所有手牌');
            if (cards.some(function (card) { return get.type(card) == 'trick'; })) {
                return;
            }
            'step 0';
            player.chooseControl('摸两张牌', '伤害+1').set('choiceList', [
                '摸两张牌',
                '本回合你造成的伤害+1'
            ]).set('ai', function () {
                var player = get.player();
                var handlength = player.countCards('h');
                var hp = player.hp;
                var enemies = game.filterPlayer(function (current) {
                    return current != player && get.attitude(player, current) < 0;
                });
                var friendlies = game.filterPlayer(function (current) {
                    return current != player && get.attitude(player, current) > 0;
                });

                // 优先补充弱势手牌
                if (handlength <= 2 || hp <= 2) return 0;

                // 自己手牌很多时可以尝试进攻
                if (player.countCards("h", function (card) { return get.tag(card, "damage"); }) >= 5 && enemies.length > 0) return 1;

                // 友方较多时更偏向补牌支援
                if (friendlies.length > enemies.length) return 0;

                // 同时添加少量随机，避免绝对单一路线
                if (Math.random() < 0.15) return 0;
                if (Math.random() > 0.85) return 1;

                return hp >= 3 ? 1 : 0;
            });
            'step 1';
            if (result.index == 0) {
                player.draw(2);
            } else {
                player.addTempSkill('ling_mu_damage', { player: 'phaseEnd' });
            }
        },
        subSkill: {
            damage: {
                trigger: {
                    source: "damageBegin1",
                },
                forced: true,
                content: function () {
                    trigger.num++;
                },
                sub: true,
            },
        },
        ai: {
            threaten: 1.5,
        },
    },
    yuanzhenghuhang: {
        // 远征护航：
        // 把手牌寄存在友军武将牌上，作为其本回合外的可调用资源；
        // 只要对方真的把这张”护航”牌用出去，你就摸一张牌回补。
        enable: "phaseUse",
        usable: 1,
        position: "h",
        filterCard: true,
        filterTarget: function (card, player, target) {
            return target != player;
        },
        check: function (card) {
            return 6 - get.value(card);
        },
        content: function () {
            var ownerKey = "yuanzhenghuhang_owner";
            // 先把牌和自己绑定，再送入对方特殊区，避免后续结算时丢失归属信息。
            for (var i = 0; i < cards.length; i++) {
                cards[i][ownerKey] = player.playerid;
            }
            player.loseToSpecial(cards, "yuanzhenghuhang", target).visible = true;
        },
        group: "yuanzhenghuhang_draw",
        ai: {
            order: 7,
            result: {
                player: 0.6,
                target: function (player, target) {
                    if (get.attitude(player, target) <= 0) return 0;
                    var score = 1.2;
                    if (target.countCards("h") <= 1) score += 0.4;
                    if (target.hp <= 2) score += 0.2;
                    return score;
                },
            },
        },
    },

    yuanzhenghuhang_draw: {
        // 友军把你的"护航”牌当手牌使用/打出后，你立刻摸 1 作为后勤回报。
        frequent: true,
        silent: true,
        trigger: {
            global: ["useCardAfter", "respondAfter"],
        },
        filter: function (event, player) {
            if (!event.player || event.player == player || !player.playerid) return false;
            // 使用牌和响应牌的实体来源位置不完全一致，因此两种入口都要一起扫。
            if (event.cards) { var cards = event.cards; }
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (!card) continue;
                if (card["yuanzhenghuhang_owner"] != player.playerid) continue;
                return true;
            }
            return false;
        },
        content: function () {
            player.draw();
        },
    },

    yuanzhenghuwei: {
        // 远征护卫：
        // 回合开始时回收别人那里尚未使用的”护航”牌，
        // 再让这些角色各拿一次”直击”或”闪避”的预备效果。
        trigger: {
            player: "phaseBegin",
        },
        forced: true,
        filter: function (event, player) {
            return game.hasPlayer(function (current) {
                if (current == player || !player.playerid) return false;
                return current.getCards("s", function (card) {
                    return card.hasGaintag("yuanzhenghuhang") && card["yuanzhenghuhang_owner"] == player.playerid;
                }).length > 0;
            });
        },
        async content(event, trigger, player) {
            var targets = game.filterPlayer(function (current) {
                if (current == player || !player.playerid) return false;
                return current.getCards("s", function (card) {
                    return card.hasGaintag("yuanzhenghuhang") && card["yuanzhenghuhang_owner"] == player.playerid;
                }).length > 0;
            }).sortBySeat(player);
            for (var i = 0; i < targets.length; i++) {
                var target = targets[i];
                var cards = target.getCards("s", function (card) {
                    return card.hasGaintag("yuanzhenghuhang") && card["yuanzhenghuhang_owner"] == player.playerid;
                });
                if (!cards.length) continue;
                // 先把没用掉的补给收回来，再给对方新的战术选项。
                await player.gain(cards, target, "giveAuto");
                // clearMarks inlined: 护航牌一旦被打出、回收或离开特殊区，就需要彻底去掉归属标记。
                for (var ci = 0; ci < cards.length; ci++) {
                    var markedCard = cards[ci];
                    if (!markedCard) continue;
                    if (markedCard.hasGaintag && markedCard.hasGaintag("yuanzhenghuhang")) {
                        markedCard.removeGaintag("yuanzhenghuhang");
                    }
                    delete markedCard["yuanzhenghuhang_owner"];
                }
                if (!target.isIn()) continue;
                target.removeSkills(["yuanzhenghuwei_directhit", "yuanzhenghuwei_evade"]);
                // getChoice inlined: 进攻资源较足时优先拿"不可响应"，否则更偏向拿一次性保命。
                var choice = (function (t) {
                    if (!t || !t.isIn()) return 0;
                    var attackCards = t.countCards("hs", function (card) {
                        if (card.name == "sha") return true;
                        return get.type2(card) == "trick" && get.tag(card, "damage");
                    });
                    if (attackCards > 0 && t.hp > 2 && t.countCards("h") > 1) return 0;
                    return 1;
                })(target);
                var choiceResult = await target
                    .chooseControl("选项一", "选项二")
                    .set("prompt", "远征护卫：请选择一项")
                    .set("choiceList", [
                        "下一次使用的牌不可被响应",
                        "下一次成为牌的目标时取消之",
                    ])
                    .set("ai", function () {
                        return _status.event.choice;
                    })
                    .set("choice", choice);
                if (!choiceResult.result || !choiceResult.result.control) continue;
                if (choiceResult.result.control == "选项一") {
                    target.addSkill("yuanzhenghuwei_directhit");
                } else {
                    target.addSkill("yuanzhenghuwei_evade");
                }
            }
        },
    },

    yuanzhenghuwei_directhit: {
        // 下一次主动出牌变成“不可响应"，打完即失效。
        charlotte: true,
        mark: true,
        marktext: "航",
        intro: {
            content: "下一次使用的牌不可被响应",
        },
        trigger: {
            player: "useCard2",
        },
        forced: true,
        content: function () {
            player.removeSkill("yuanzhenghuwei_directhit");
            trigger.directHit.addArray(game.players);
            game.log(trigger.card, "不可被响应");
        },
        ai: {
            directHit_ai: true,
        },
    },

    yuanzhenghuwei_evade: {
        // 下一次成为目标时直接被排除，挡掉后即失效。
        charlotte: true,
        mark: true,
        marktext: "卫",
        intro: {
            content: "下一次成为牌的目标时取消之",
        },
        trigger: {
            target: "useCardToTarget",
        },
        forced: true,
        content: function () {
            player.removeSkill("yuanzhenghuwei_evade");
            if (trigger.excluded) {
                trigger.excluded.add(player);
            } else if (trigger.targets) {
                trigger.targets.remove(player);
            }
            game.log(trigger.card, "对", player, "无效");
        },
    },
    // ============================================
    // ③ SP深雪 - 彗袭
    // 触发时机：phaseUseBegin（出牌阶段开始时）
    // 效果：
    //   1. 玩家从按钮列表中选择一种基本牌/非延时锦囊类型
    //   2. 本回合内获得一次机会：可以将任意一张手牌视为所选类型使用（子技能huixi_viewas）
    //   3. 本回合内锁定类别：只能使用所选类别的牌（子技能huixi_lock，mod.cardEnabled限制）
    // ============================================
    huixi: {
        audio: 2,
        trigger: { player: "phaseUseBegin" },//出牌阶段开始时触发
        filter: function (event, player) {
            return true;
        },
        check: function (event, player) {
            return player.countCards('h', function (card) {
                return get.type(card, "trick") == "equip";
            }) < 2;//AI
        },
        content: function () {
            "step 0"
            //构建可选类型列表（基本牌+非延时锦囊）
            var vcards = [];
            //基本牌
            for (var name of lib.inpile) {
                if (get.type(name) == "basic") vcards.push(['基本', '', name]);
                if (get.type(name) == 'trick') {
                    vcards.push(['锦囊', '', name]);
                }
            }
            player.chooseButton(['彗袭：选择本回合可视为使用的牌', [vcards, 'vcard']])
                .set('ai', function (button) {
                    var card = {
                        name: button.link[2],
                    };
                    return (get.value(card) || 1);

                }).set('selectButton', 1);
            "step 1"
            if (!result.bool) { event.finish(); return; }//玩家取消则不发动
            var name = result.links[0][2];//选中的牌名（如'sha'）
            // //添加视为技能：本回合可将任意手牌视为选中类型使用一次
            player.addTempSkill('huixi_viewas', { player: 'phaseEnd' });
            //添加锁定技能：本回合只能使用同类别的牌
            player.addTempSkill('huixi_lock', { player: 'phaseEnd' });
            //存储选中的牌名供viewas子技能使用
            player.setStorage('huixi_viewas_name', name);
            //存储锁定的类别（'basic'或'trick'）供lock子技能使用
            player.setStorage('huixi_locked', get.type(name, "trick"));

        },
        intro: {
            content: function () {
                return get.translation('huixi_info');
            },
        },
    },
    huixi_viewas: {//彗袭子技能：将手牌视为选中类型使用（本回合1次）
        //此技能由addTempSkill在phaseUseBegin时临时添加，phaseEnd时自动移除
        charlotte: true,
        enable: 'chooseToUse',//出牌阶段可主动发动
        usable: 1,//本回合仅可使用1次（usable按回合重置，与addTempSkill配合实现精确1次限制）
        filter: function (event, player) {
            //有存储的目标牌名，且手上有牌可消耗
            return player.getStorage('huixi_viewas_name') && player.countCards('h') > 0;
        },
        filterCard: function (card, player) {
            return true;//任意手牌均可选为消耗
        },
        viewAs: function (cards, player) {
            //视为使用storage中存储的牌类型
            return { name: player.getStorage('huixi_viewas_name'), isCard: false };
        },
        position: 'h',//从手牌中选择
        check: function (card) {
            return 5 - get.value(card);//AI：优先消耗价值低的牌
        },
        ai: { result: { player: 1 } },
    },
    huixi_lock: {//彗袭子技能：锁定类别，本回合只能使用同类别的牌
        charlotte: true,
        mod: {
            cardEnabled: function (card, player) {
                var locked = player.getStorage('huixi_locked');
                if (!locked) return;//没有锁定则不干预
                var type = get.type(card);
                //if (type == 'equip' || type == 'delay') return;
                //只允许使用与锁定类别相同的牌
                if (type != locked) return false;
            },
        },
    },
    //========== 奥古斯塔 ==========
    //孤立 - 锁定技，多目标锦囊牌指定你为目标时，取消之
    guli: {
        audio: false,
        trigger: { target: "useCardToPlayered" },
        forced: true,
        locked: true,
        filter: function (event, player) {
            if (get.type(event.card) != 'trick') return false;
            return event.targets && event.targets.length > 1;
        },
        content: function () {
            trigger.getParent().excluded.add(player);
        },
        ai: {
            effect: {
                target: function (card, player, target) {
                    if (get.type(card) == 'trick') {
                        var info = get.info(card);
                        if (info && (info.selectTarget == -1 || card.name == 'nanman' || card.name == 'wanjian' || card.name == 'taoyuan')) {
                            return 'zeroplayertarget';
                        }
                    }
                },
            },
            threaten: 0.8,
        },
        "_priority": 0,
    },
    //转变 - 限定技，失去孤立获得外交，横置，选角色横置并摸牌
    zhuanbian: {
        audio: false,
        enable: "phaseUse",
        limited: true,
        skillAnimation: true,
        animationColor: "water",
        filter: function (event, player) {
            return player.hasSkill('guli');
        },
        selectTarget: [0, Infinity],
        multitarget: true,
        multiline: true,
        filterTarget: function (card, player, target) {
            if (target == player) return false;
            //至多包括2个其他势力
            var playerGroup = player.group;
            var otherGroups = [];
            for (var i = 0; i < ui.selected.targets.length; i++) {
                var g = ui.selected.targets[i].group;
                if (g != playerGroup && !otherGroups.includes(g)) otherGroups.push(g);
            }
            var targetGroup = target.group;
            if (targetGroup != playerGroup && !otherGroups.includes(targetGroup)) {
                if (otherGroups.length >= 2) return false;
            }
            return true;
        },
        content: function () {
            "step 0"
            player.awakenSkill('zhuanbian');
            //失去孤立，获得外交
            player.removeSkill('guli');
            player.addSkill('waijiao');
            //你横置
            if (!player.isLinked()) player.link(true);
            "step 1"
            //选择的角色进入横置
            if (targets && targets.length > 0) {
                for (var i = 0; i < targets.length; i++) {
                    if (!targets[i].isLinked()) targets[i].link(true);
                }
            }
            "step 2"
            //你和你选择的角色各摸两张牌
            var drawTargets = [player];
            if (targets && targets.length > 0) {
                for (var i = 0; i < targets.length; i++) {
                    drawTargets.push(targets[i]);
                }
            }
            game.asyncDraw(drawTargets, 2);
        },
        derivation: "waijiao",
        ai: {
            order: 2,
            result: {
                target: function (player, target) {
                    return get.attitude(player, target) > 0 ? 2 : 0;
                },
                player: 1,
            },
        },
        "_priority": 0,
    },
    //外交 - 转换技，阳：令一名角色回复体力或摸牌；阴：不能使用杀
    waijiao: {
        audio: false,
        zhuanhuanji: true,
        mark: true,
        marktext: "☯",
        init: function (player) {
            if (typeof player.storage.waijiao === 'undefined') player.storage.waijiao = false;
        },
        intro: {
            content: function (storage, player) {
                if (player.storage.waijiao) return "阴：出牌阶段，你不能使用杀直到此阶段结束。";
                return "阳：出牌阶段，你可令一名角色回复一点体力或摸两张牌。";
            },
        },
        enable: "phaseUse",
        usable: 1,
        filter: function (event, player) {
            //仅阳态可使用
            return !player.storage.waijiao;
        },
        filterTarget: true,
        content: function () {
            "step 0"
            player.chooseControl('回复体力', '摸牌').set('prompt', '令' + get.translation(target) + '执行一项').set('ai', function () {
                var target = _status.event.getParent().target;
                var player = _status.event.getParent().player;
                if (target.isDamaged() && get.recoverEffect(target, player, player) > 0) return '回复体力';
                return '摸牌';
            });
            "step 1"
            if (result.control == '回复体力') {
                target.recover();
            } else {
                target.draw(2);
            }
            player.changeZhuanhuanji('waijiao');
        },
        //阴态：出牌阶段不能使用杀
        mod: {
            cardEnabled: function (card, player) {
                if (player.storage.waijiao && card.name == 'sha') {
                    if (_status.currentPhase && _status.currentPhase == player) return false;
                }
            },
        },
        group: "waijiao_flip",
        subSkill: {
            //阴态在出牌阶段结束后翻回阳态
            flip: {
                trigger: { player: "phaseUseAfter" },
                forced: true,
                silent: true,
                popup: false,
                filter: function (event, player) {
                    return player.storage.waijiao === true;
                },
                content: function () {
                    player.changeZhuanhuanji('waijiao');
                },
                sub: true,
                "_priority": 0,
            },
        },
        ai: {
            order: 8,
            result: {
                target: function (player, target) {
                    if (target.isDamaged() && get.recoverEffect(target, player, player) > 0) return 2;
                    return 1.5;
                },
                player: function (player) {
                    if (player.canUse("sha") && player.countCards("h", { name: "sha" }) > 0) return 0;
                    return 1
                },
            },
            threaten: 1.2,
        },
        "_priority": 0,
    },
    //===================================
    //         厌战 技能
    //===================================
    //日德兰 - 限定技，受伤时将任意张手牌当闪使用或打出，若数量>发动次数则恢复
    ridelan: {
        audio: false,
        nobracket: true,
        enable: ["chooseToRespond", "chooseToUse"],
        filter: function (event, player) {
            if (player.storage.ridelan) return false;
            if (!player.isDamaged()) return false;
            if (player.countCards("h") == 0) return false;
            return event.filterCard({ name: "shan" }, player, event);
        },
        init: function (player) {
            player.storage.ridelan = false;
            player.storage.ridelan_count = 0;
        },
        filterCard: true,
        selectCard: [1, Infinity],
        position: "h",
        viewAs: { name: "shan", storage: { ridelan: true } },
        check: function (card) {
            return 6 - get.value(card);
        },
        group: ["ridelan_after"],
        subSkill: {
            //发动后判断是否恢复
            after: {
                trigger: { player: ["useCardAfter", "respondAfter"] },
                forced: true,
                popup: false,
                silent: true,
                filter: function (event, player) {
                    return event.card && event.card.storage && event.card.storage.ridelan;
                },
                content: function () {
                    var numCards = trigger.cards ? trigger.cards.length : 0;
                    player.storage.ridelan_count = (player.storage.ridelan_count || 0) + 1;
                    var count = player.storage.ridelan_count;
                    if (numCards >= count) {
                        game.log(player, "恢复了", "#g【日德兰】");
                    } else {
                        player.awakenSkill("ridelan");
                    }
                },
                sub: true,
                "_priority": 0,
            },
        },
        hiddenCard: function (player, name) {
            if (name == "shan" && !player.storage.ridelan && player.isDamaged() && player.countCards("h") > 0) return true;
        },
        ai: {
            respondShan: true,
            skillTagFilter: function (player, tag) {
                if (tag == "respondShan" && (player.storage.ridelan || !player.isDamaged() || player.countCards("h") == 0)) return false;
            },
            order: 2,
            result: { player: 1 },
        },
        "_priority": 0,
    },
    //纳尔维克 - 限定技，视为使用万箭齐发，摸X张牌（X=对驱逐舰造成的伤害）
    naerweike: {
        audio: false,
        nobracket: true,
        limited: true,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.storage.naerweike !== true;
        },
        content: function () {
            "step 0"
            player.awakenSkill("naerweike");
            player.storage.naerweike_damage = 0;
            player.addTempSkill("naerweike_count");
            var targets = game.filterPlayer(function (current) {
                return current != player && player.canUse({ name: "wanjian" }, current);
            });
            if (targets.length > 0) {
                player.useCard({ name: "wanjian", isCard: true }, targets, false);
            }
            "step 1"
            player.removeSkill("naerweike_count");
            var damage = player.storage.naerweike_damage || 0;
            delete player.storage.naerweike_damage;
            if (damage > 0) {
                player.draw(damage);
                game.log(player, "对驱逐舰造成了", "#g" + damage, "点伤害，摸了", "#g" + damage, "张牌");
            }
        },
        subSkill: {
            //计算对驱逐舰造成的伤害
            count: {
                trigger: { global: "damage" },
                forced: true,
                popup: false,
                silent: true,
                charlotte: true,
                filter: function (event, player) {
                    return event.source == player && event.card && event.card.name == "wanjian" && event.player && event.player.hasSkill("quzhudd");
                },
                content: function () {
                    player.storage.naerweike_damage = (player.storage.naerweike_damage || 0) + trigger.num;
                },
                sub: true,
                "_priority": 0,
            },
        },
        ai: {
            order: 8,
            result: { player: 1 },
        },
        "_priority": 0,
    },
    //马塔潘角 - 限定技，横置任意名角色，其中一名回血翻面，全巡洋舰则摸牌
    matapanjiao: {
        audio: false,
        nobracket: true,
        limited: true,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.storage.matapanjiao !== true && game.hasPlayer(function (current) {
                return current != player;
            });
        },
        filterTarget: function (card, player, target) {
            return target != player;
        },
        selectTarget: [1, Infinity],
        multitarget: true,
        multiline: true,
        content: function () {
            "step 0"
            player.awakenSkill("matapanjiao");
            //横置所有目标
            for (var i = 0; i < targets.length; i++) {
                targets[i].link(true);
            }
            "step 1"
            //选择一名目标恢复体力并翻面
            if (targets.length == 1) {
                event.chosenTarget = targets[0];
            } else {
                player.chooseTarget("马塔潘角：选择一名目标恢复一点体力并翻面", true, function (card, player, target) {
                    return _status.event.getParent().targets.includes(target);
                }).set("ai", function (target) {
                    var att = get.attitude(_status.event.player, target);
                    //对敌翻面有利（跳过回合），回血不利；对已翻面友方则很好
                    if (att < 0) return 10 + Math.abs(att);
                    if (att > 0 && target.isTurnedOver()) return 15 + att;
                    return 1;
                });
            }
            "step 2"
            var chosenTarget = event.chosenTarget;
            if (!chosenTarget && result && result.bool && result.targets && result.targets.length > 0) {
                chosenTarget = result.targets[0];
            }
            if (chosenTarget) {
                chosenTarget.recover();
                chosenTarget.turnOver();
            }
            "step 3"
            //检查是否全部为巡洋舰
            var allCruiser = true;
            for (var i = 0; i < targets.length; i++) {
                if (!targets[i].hasSkill("zhongxunca") && !targets[i].hasSkill("qingxuncl")) {
                    allCruiser = false;
                    break;
                }
            }
            if (allCruiser) {
                player.draw(targets.length);
                game.log(player, "目标全部为巡洋舰，摸了", "#g" + targets.length, "张牌");
            }
        },
        ai: {
            order: 6,
            result: {
                target: function (player, target) {
                    //横置对敌方不利
                    return -1;
                },
            },
        },
        "_priority": 0,
    },
    //远射记录 - 限定技，视为使用不可响应无距离限制的火杀，伤害+1
    yuanshejilu: {
        audio: false,
        limited: true,
        enable: "phaseUse",
        filter: function (event, player) {
            return player.storage.yuanshejilu !== true && game.hasPlayer(function (current) {
                return current != player;
            });
        },
        filterTarget: function (card, player, target) {
            return target != player;
        },
        content: function () {
            "step 0"
            player.awakenSkill("yuanshejilu");
            player.addTempSkill("yuanshejilu_damage");
            var sha = { name: "sha", nature: "fire", isCard: true, storage: { yuanshejilu: true } };
            var next = player.useCard(sha, target, false);
            next.directHit = [target];
        },
        subSkill: {
            //伤害+1
            damage: {
                trigger: { source: "damageBegin1" },
                forced: true,
                popup: false,
                silent: true,
                charlotte: true,
                filter: function (event, player) {
                    return event.card && event.card.storage && event.card.storage.yuanshejilu;
                },
                content: function () {
                    trigger.num++;
                    player.removeSkill("yuanshejilu_damage");
                },
                sub: true,
                "_priority": 0,
            },
        },
        ai: {
            order: 9,
            result: {
                target: function (player, target) {
                    return get.damageEffect(target, player, target, "fire");
                },
            },
        },
        "_priority": 0,
    },
    //弗里茨之殇 - 锁定技，体力<2时废弃武器栏，不能用无懈可击响应无懈可击
    fulicizhishang: {
        audio: false,
        nobracket: true,
        locked: true,
        trigger: { player: "changeHp" },
        forced: true,
        filter: function (event, player) {
            return player.hp < 2 && !player.storage.fulicizhishang_disabled;
        },
        init: function (player) {
            player.storage.fulicizhishang_disabled = false;
        },
        content: function () {
            player.storage.fulicizhishang_disabled = true;
            player.disableEquip("equip1");
            game.log(player, "废弃了武器栏");
        },
        mod: {
            cardEnabled2: function (card, player) {
                if (player.hp < 2 && card.name == "wuxie") {
                    var evt = _status.event;
                    if (evt.respondTo && evt.respondTo[1] && evt.respondTo[1].name == "wuxie") {
                        return false;
                    }
                }
            },
        },
        ai: {
            threaten: 0.8,
        },
        "_priority": 0,
    },
    //最后的挣扎 - 锁定技，死亡时手牌按任意顺序置入牌堆顶和牌堆底
    zuihoudezhengzha: {
        audio: false,
        nobracket: true,
        locked: true,
        trigger: { player: "dieBegin" },
        forced: true,
        forceDie: true,
        filter: function (event, player) {
            return player.countCards("h") > 0;
        },
        content: function () {
            "step 0"
            var cards = player.getCards("h");
            if (cards.length == 0) {
                event.finish();
                return;
            }
            event._zhengzhaCards = cards.slice();
            player.lose(cards, ui.special);
            "step 1"
            var cards = event._zhengzhaCards;
            if (!cards || cards.length == 0) {
                event.finish();
                return;
            }
            game.cardsGotoOrdering(cards);
            var next = player.chooseToMove();
            next.set("list", [
                ["牌堆顶", cards],
                ["牌堆底"],
            ]);
            next.set("prompt", "最后的挣扎：将手牌分配到牌堆顶和牌堆底");
            next.processAI = function (list) {
                var cards = list[0][1].slice();
                return [cards, []];
            };
            "step 2"
            var top = result.moved[0];
            var bottom = result.moved[1];
            top.reverse();
            game.cardsGotoPile(
                top.concat(bottom),
                ["top_cards", top],
                function (event, card) {
                    if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
                    return null;
                }
            );
            player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
            game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶，" + get.cnNumber(bottom.length) + "张牌置于牌堆底");
        },
        "_priority": 0,
    },
    //======= 德格拉斯 =======
    //遥远的希望（1级）- 锁定技，多摸X张（X=轮数/2向下取整，最低1），血量不满变势力G
    yaoyuandexiwang: {
        audio: false,
        locked: true,
        forced: true,
        nobracket: true,
        trigger: { player: "phaseDrawBegin2" },
        derivation: "yaoyuandexiwang2",
        filter: function (event, player) {
            return !event.numFixed;
        },
        content: function () {
            var x = Math.max(1, Math.floor(game.roundNumber / 2));
            trigger.num += x;
            player.storage.xiwang_extra = x;
            player.storage.xiwang_handBefore = player.getCards('h').map(function (c) { return c.cardid; });
            if (player.hp < player.maxHp && !player.storage.shuguang_done) {
                if (player.group != 'KMS') player.changeGroup('KMS');
            }
        },
        ai: {
            threaten: 1.7,
        },
        "_priority": 0,
    },
    //遥远的希望（2级）- 锁定技，多摸X张（X=轮数/2向上取整）
    yaoyuandexiwang2: {
        audio: false,
        locked: true,
        forced: true,
        nobracket: true,
        trigger: { player: "phaseDrawBegin2" },
        filter: function (event, player) {
            return !event.numFixed;
        },
        content: function () {
            var x = Math.ceil(game.roundNumber / 2);
            trigger.num += x;
        },
        ai: {
            threaten: 2.0,
        },
        "_priority": 0,
    },
    //未知的命运 - G势力技，摸牌阶段结束时选择：锁定额外牌或弃牌
    weizhidemingyun: {
        audio: false,
        nobracket: true,
        trigger: { player: "phaseDrawEnd" },
        forced: true,
        filter: function (event, player) {
            return player.group == 'KMS';
        },
        content: function () {
            "step 0"
            var x = player.storage.xiwang_extra || Math.max(1, Math.floor(game.roundNumber / 2));
            event.x = x;
            var beforeIds = player.storage.xiwang_handBefore || [];
            var newCards = player.getCards('h').filter(function (c) { return !beforeIds.includes(c.cardid); });
            event.lockCards = newCards.slice(-x);
            delete player.storage.xiwang_extra;
            delete player.storage.xiwang_handBefore;
            player.chooseControl("选项一", "选项二").set("prompt", "未知的命运：选择一项").set("choiceList", [
                '依靠"遥远的希望"获得的牌本回合无法使用且不计入手牌上限',
                "弃置" + x + "张牌"
            ]).set("ai", function () {
                var player = _status.event.player;
                var x = _status.event.getParent().x;
                var lowValueCards = player.getCards('he').filter(function (c) { return get.value(c) < 5; });
                if (lowValueCards.length >= x) return "选项二";
                return "选项一";
            });
            "step 1"
            if (result.index == 0) {
                //选项一：锁定牌（无法使用但不计入手牌上限）
                if (event.lockCards.length > 0) {
                    player.storage.weizhidemingyun_locked = event.lockCards.map(function (c) { return c.cardid; });
                    player.addTempSkill("weizhidemingyun_lock", "phaseEnd");
                    game.log(player, "锁定了", event.lockCards.length, "张牌");
                }
            } else {
                //选项二：弃牌
                player.chooseToDiscard(event.x, true, "he");
            }
        },
        subSkill: {
            lock: {
                charlotte: true,
                mod: {
                    cardEnabled: function (card, player) {
                        if (player.storage.weizhidemingyun_locked &&
                            player.storage.weizhidemingyun_locked.includes(card.cardid)) return false;
                    },
                    ignoredHandcard: function (card, player) {
                        if (player.storage.weizhidemingyun_locked &&
                            player.storage.weizhidemingyun_locked.includes(card.cardid)) return true;
                    },
                },
                onremove: function (player) {
                    delete player.storage.weizhidemingyun_locked;
                },
                sub: true,
            },
        },
        "_priority": 0,
    },
    //如愿的曙光 - 觉醒技，体力变化累计超过4点后觉醒
    ruyuandeshuguang: {
        audio: false,
        unique: true,
        juexingji: true,
        nobracket: true,
        derivation: ["yaoyuandexiwang2", "heshiyan"],
        trigger: { player: "changeHp" },
        forced: true,
        direct: true,
        filter: function (event, player) {
            return !player.storage.shuguang_done;
        },
        content: function () {
            "step 0"
            if (!player.storage.shuguang_count) player.storage.shuguang_count = 0;
            player.storage.shuguang_count += Math.abs(trigger.num);
            player.markSkill("ruyuandeshuguang");
            "step 1"
            if (player.storage.shuguang_count > 4) {
                player.logSkill("ruyuandeshuguang");
                player.storage.shuguang_done = true;
                player.awakenSkill("ruyuandeshuguang");
                //变更势力为F(MN)
                if (player.group != 'MN') player.changeGroup('MN');
                //升级防空（+1技能等级）
                player.addMark("jinengup", 1);
                //升级遥远的希望
                player.changeSkills(["yaoyuandexiwang2"], ["yaoyuandexiwang"]);
                //获得核试验旗舰
                player.addSkill("heshiyan");
            }
        },
        mark: true,
        intro: {
            content: function (storage, player) {
                var count = player.storage.shuguang_count || 0;
                if (player.storage.shuguang_done) return "已觉醒";
                return "体力变化累计：" + count + "点（需要超过4点）";
            },
        },
        "_priority": 0,
    },
    //核试验旗舰 - 主公技，限定技，F势力技，弃5牌对全场造成伤害
    heshiyan: {
        audio: false,
        nobracket: true,
        enable: "phaseUse",
        zhuSkill: true,
        limited: true,
        unique: true,
        mark: true,
        skillAnimation: true,
        animationColor: "fire",
        filter: function (event, player) {
            if (!player.hasZhuSkill("heshiyan")) return false;
            if (player.group != 'MN') return false;
            if (get.mode() != 'identity' || player.identity != 'zhu') return false;
            return player.countCards("he") >= 5;
        },
        content: function () {
            "step 0"
            player.chooseToDiscard(5, "he", true, "核试验旗舰：弃置5张牌").set("ai", function (card) {
                return 8 - get.value(card);
            });
            "step 1"
            if (!result.bool) {
                event.finish();
                return;
            }
            player.awakenSkill("heshiyan");
            event.baseDamage = 2;
            event.immunePlayers = [];
            //询问其他F(MN)势力角色是否响应
            event.mnPlayers = game.filterPlayer(function (current) {
                return current != player && current.group == 'MN' && current.countCards('h') >= 2;
            });
            event.mnIndex = 0;
            "step 2"
            if (event.mnIndex >= event.mnPlayers.length) {
                event.goto(4);
                return;
            }
            var target = event.mnPlayers[event.mnIndex];
            var expectedDmg = event.baseDamage + event.immunePlayers.length + 1;
            target.chooseToDiscard(2, "h", '核试验旗舰：是否弃置2张手牌，令伤害+1并免疫此伤害？').set("expectedDamage", expectedDmg).set("ai", function (card) {
                var damage = _status.event.expectedDamage;
                var target = _status.event.player;
                if (target.hp <= damage) return 10 - get.value(card);
                if (damage >= 3) return 8 - get.value(card);
                return -1;
            });
            "step 3"
            if (result.bool) {
                var target = event.mnPlayers[event.mnIndex];
                event.immunePlayers.push(target);
                event.baseDamage++;
                game.log(target, "响应了核试验旗舰，伤害+1");
            }
            event.mnIndex++;
            event.goto(2);
            "step 4"
            //对全场造成伤害
            event.totalDamage = event.baseDamage;
            event.damageTargets = game.filterPlayer(function (current) {
                return !event.immunePlayers.includes(current);
            });
            event.dmgIndex = 0;
            game.log(player, "发动了核试验旗舰，造成", event.totalDamage, "点伤害");
            "step 5"
            if (event.dmgIndex >= event.damageTargets.length) {
                event.finish();
                return;
            }
            player.line(event.damageTargets[event.dmgIndex], "fire");
            event.damageTargets[event.dmgIndex].damage(event.totalDamage, player);
            "step 6"
            event.dmgIndex++;
            event.goto(5);
        },
        ai: {
            order: 1,
            result: {
                player: function (player) {
                    var enemies = 0, allies = 0;
                    game.countPlayer(function (current) {
                        if (current == player) return;
                        if (get.attitude(player, current) < 0) enemies++;
                        else if (get.attitude(player, current) > 0) allies++;
                    });
                    if (enemies > allies + 1 && player.hp > 3) return 1;
                    return 0;
                },
            },
        },
        "_priority": 0,
    },
    //补给潜艇 - 锁定技，发动军辅将牌交给潜艇或G国船时，其选择一项
    bujiiqianting: {
        audio: false,
        locked: true,
        forced: true,
        trigger: {
            global: "gainAfter",
        },
        filter: function (event, player) {
            if (!player.hasSkill('junfu')) return false;
            var target = event.player;
            if (!target || target == player || !target.isIn()) return false;
            if (!target.hasSkill('qianting') && target.group != 'KMS') return false;
            //检查这次获得牌是否来自军辅
            var parent = event.getParent();
            for (var i = 0; i < 10; i++) {
                if (!parent || parent.name == 'game' || parent.name == 'phase') break;
                if (parent.name == 'junfu' && parent.player == player) return true;
                parent = parent.getParent();
            }
            return false;
        },
        logTarget: "player",
        content: function () {
            "step 0"
            var target = trigger.player;
            event.junfu_target = target;
            target.chooseControl("获得一张杀", "回复一点体力", "弃牌摸牌").set("prompt", "补给潜艇：选择一项").set("ai", function () {
                var player = get.player();
                if (player.isDamaged() && player.hp <= 2) return 1;
                if (player.countCards("h") >= 2) return 2;
                return 0;
            });
            "step 1"
            var target = event.junfu_target;
            if (result.index == 0) {
                //获得一张杀
                var sha = get.cardPile2(function (card) {
                    return card.name == "sha";
                });
                if (sha) {
                    target.gain(sha, "gain2");
                    game.log(target, "选择获得了一张", sha);
                }
                event.finish();
            } else if (result.index == 1) {
                //回复一点体力
                target.recover(1);
                event.finish();
            } else {
                //弃置一张牌，然后摸两张牌
                target.chooseToDiscard("he", true, "补给潜艇：弃置一张牌，然后摸两张牌").set("ai", function (card) {
                    return 6 - get.value(card);
                });
            }
            "step 2"
            if (result.bool) {
                event.junfu_target.draw(2);
            }
        },
        ai: {
            threaten: 1.2,
        },
        "_priority": 0,
    },
    //鱼死网破 - 失去一点体力，视为使用制空权（无懈可击）
    yusiwangpo: {
        audio: false,
        enable: ["chooseToUse"],
        filter: function (event, player) {
            if (player.hp <= 0) return false;
            return event.filterCard({ name: "wuxie", isCard: true }, player, event);
        },
        viewAs: { name: "wuxie", isCard: true },
        filterCard: () => false,
        selectCard: -1,
        precontent: function () {
            player.logSkill('yusiwangpo');
            player.loseHp(1);
        },
        hiddenCard: function (player, name) {
            if (name == "wuxie") return player.hp > 0;
        },
        ai: {
            order: 1,
            respondwuxie: true,
            skillTagFilter: function (player, tag) {
                if (tag == "respondwuxie" && player.hp <= 1) return false;
            },
            result: {
                player: function (player) {
                    //失去1点体力的代价
                    var hpCost = -7;
                    if (player.hp == 1) return -20; //濒死不用
                    if (player.hp == 2) hpCost = -10; //低血更谨慎

                    //评估无懈的价值
                    var event = _status.event.getParent();
                    if (!event || !event.card) return hpCost;

                    //如果是针对自己的负面锦囊，价值较高
                    if (event.targets && event.targets.includes(player)) {
                        if (get.tag(event.card, "damage")) return 10 + hpCost; //伤害锦囊
                        if (get.tag(event.card, "loseCard")) return 5 + hpCost; //弃牌锦囊
                        return 3 + hpCost; //其他负面效果
                    }

                    //如果是针对队友的负面锦囊
                    if (event.targets) {
                        for (var i = 0; i < event.targets.length; i++) {
                            var target = event.targets[i];
                            if (get.attitude(player, target) > 0) {
                                if (get.tag(event.card, "damage")) return 6 + hpCost;
                                if (get.tag(event.card, "loseCard")) return 3 + hpCost;
                                return 1 + hpCost;
                            }
                        }
                    }

                    //无懈别人的无懈（保护敌人的锦囊）
                    if (event.card.name == "wuxie") {
                        var parent = event.getParent(2);
                        if (parent && parent.targets) {
                            for (var i = 0; i < parent.targets.length; i++) {
                                if (get.attitude(player, parent.targets[i]) < 0) {
                                    return 4 + hpCost; //保护对敌人的锦囊
                                }
                            }
                        }
                    }

                    return hpCost; //默认不值得
                },
            },
        },
        "_priority": 0,
    },
    zhiqiu: {//掷球，只是看牌的。ai写了，没语音
        locked: true,//锁定技
        ai: {//全在ai里面
            viewHandcard: function (player) {//这部分不知道做什么的，注释掉以后可能看不了手牌
                if (!player.hasEmptySlot(5) || player.hasSkill('shuiji1_used')) {//装备5是宝具，或水机没有用过
                    return false;//符合条件的话失效
                }
                return true;//否则生效
            },
            skillTagFilter(player, tag, arg) {//这是给ai的
                if (!player.hasEmptySlot(5) || player.hasSkill('shuiji1_used')) {//有宝具或者用过水机的时候
                    return false;//失效
                }
                if (player == arg) { // 且加上过滤器，防止对自己使用
                    return false;
                }
                return true;//否则生效
            },
        },
    },
    zhiqiu2: {//掷球2，只是改杀的。ai和语音写了
        locked: true,
        audio: "ext:舰R牌将/audio/skill:true",
        mod: {
            cardnature: function (card, player) {//要修改牌的属性
                if (player.hasSkill('shuiji1_used'))
                    return card.nature;//如果水机用过，返回原属性
                //下面是没用过水机的处理
                if ((card.name == "sha" || card.name == 'sheji9') && card.nature == "thunder") //当是杀而且是鱼雷属性时，执行处理
                    return false;//处理的内容，把的属性改成无。
                return card.nature;//否则返回原属性
            },
        },
        ai: {//ai部分
            threaten: 1.5,//威胁值1.5
        },
    },
    shuiji1: {//水机，视为使用桃或无懈可击。语音写了，ai有
        audio: "ext:舰R牌将/audio/skill:true",//r杀的语音这样写，如果多个的话true写2
        enable: "chooseToUse",//主动技，技能触发阶段。这里指的出牌阶段。如果多个阶段可以使用数组写好几个
        filter: function (event, player) {//对技能能不能生效的检查。
            if (player.hasSkill('shuiji1_used')) return false;//不能一轮发动多次
            for (var name of ['tao', 'wuxie']) {//检查【桃】和【无懈可击】
                if (event.filterCard({ name: name, isCard: true }, player, event)) return true;//检查当前事件能不能使用【桃】或者【无懈可击】
            }
            return false;//不能使用则不能发动
        },
        hiddencard: function (player, name) {//隐藏牌技能标签（还没完全理解）
            if (name == 'wuxie' || name == 'tao')//如果是无懈可击或桃
                return true;//隐藏牌面
        },
        chooseButton: {//选择按钮技能标签
            dialog: function (event, player) {//选择按钮时的对话框
                var vcards = [];//存放按钮的数组
                for (var name of ['tao', 'wuxie']) {//检查【桃】和【无懈可击】
                    var card = { name: name, isCard: true };//创建牌对象
                    if (event.filterCard(card, player, event)) vcards.push(['基本', '', name]);//如果能使用就加入按钮数组
                }
                var dialog = ui.create.dialog('水机', [vcards, 'vcard'], 'hidden');//创建对话框
                //dialog.direct = true;//直接选择按钮，这段注释掉就需要选牌了
                return dialog;//返回对话框
            },
            backup: function (links, player) {//选择按钮后的备选方案

                return {//这其实是ai部分
                    filterCard: () => false,//不需要选牌，如果改成f会导致使用技能全弃牌 
                    selectCard: -1,//不需要选择牌为代价
                    viewAs: {//视为使用牌
                        name: links[0][2],  // 'tao' 或 'wuxie'                     
                        isCard: true,//是牌？
                    },
                    popname: true,//显示牌名
                    precontent: function () {
                        player.logSkill('shuiji1');//记录技能发动日志
                        player.addTempSkill('shuiji1_used', 'roundStart');//给玩家添加一轮一次的技能标记，防止多次发动，前缀下划线是全局的标签，否则北大技能用不了
                    },
                    // 不定义ai，让它自动继承viewAs牌的AI  。有一个  viewAs就行 
                }

            },
            prompt: function (links, player) {//选择按钮时的提示语
                return '水机：视为使用一张【' + get.translation(links[0][2]) + '】';
            },
        },
        ai: {
            tag: {
                order: 10,//救人优先级
                result: { player: 1 },//对自己有利
                save: 1,      // 标记：这个技能能救人
                respond: 1,   // 标记：这个技能能响应（无懈）


            },
        },


        subSkill: {//新开一轮的时候洗一遍
            used: {
                mark: true,
                intro: {
                    content: "本轮已发动",
                },
                sub: true,
                "_priority": 0,
            },
        },
        "_priority": 0,
    },
    benzhi1: {//本职,只是改杀。语音写了，ai写了
        audio: "ext:舰R牌将/audio/skill:true",
        locked: true,//锁定技
        mod: {
            cardnature: function (card, player, colo) {//要修改牌的属性

                if (card.name == "sha" && get.color(card) == "black")//当是杀是黑杀时，执行处理
                    return card.nature = "thunder"; //处理的内容，把黑色的杀改成鱼雷属性.
                if (card.name == "sha" && get.color(card) == "red")//当是杀是红杀时，执行处理
                    return card.nature = "fire"; //处理的内容，把红色的杀改成火属性.
                return card.nature;//否则返回原属性
            },
        },
        ai: {//ai部分
            threaten: 1.5,//威胁值1.5
        },
    },
    benzhi2: {//本职2,杀的mod效果。语音写了，ai有
        audio: "ext:舰R牌将/audio/skill:true",
        locked: true,//锁定技
        mod: {
            targetInRange(card, player, target) {//独角受让用这个无限，如果是无限距离会导致所有操作都无限射程
                if (get.color(card) == 'black' && !player.hasSkill('olsbduoshou_used'))//当是黑色牌时
                    return true;
            },
            cardUsable: function (card, player, num) {
                if (card.name == "sha" && get.color(card) == "red")//当是红杀时
                    return Infinity;//使用次数无限
            },
        },
        ai: {//ai部分
            threaten: 1.5,//威胁值1.5
        },
    },
    huidang: {//回档。ai和语音写了
        audio: "ext:舰R牌将/audio/skill:true",
        limited: true,//限定技
        trigger: {//触发时机,
            player: "phaseBegin"//准备阶段
        },
        check: function (event, player) {
            if (player.hasSkill('shuiji1_used')) {
                if (player.hp < 2) return true;
                if (player.countCards("j", { name: "lebu" }).length > 0 && player.countCards("h", { name: wuxie }).length <= 0) return true;
            }
            if (game.roundNumber > 1) {
                var enemiesCount = game.countPlayer(function (current) {
                    return get.attitude(player, current) < 0 && (!player.inRange(current) || current.hasSkillTag("fireAttack", null, null, true) || current.hasSkillTag("thunderAttack", null, null, true))
                });
                return enemiesCount > 1;
            }
            return false;
        },
        //要加判定一下有没有要删的技能
        filter: function (event, player) {//对技能能不能生效的检查。
            if (player.hasSkill('benzhi1') && player.hasSkill('benzhi2')) //如果有本职就不能发动
                return false;
            return player.hasSkill('zhiqiu') && player.hasSkill('shuiji1');//有掷球和水机才能发动
        },
        ai: {//ai部分
            order: 1,
            result: {
                player: function (event, player) {
                    return 2;
                },
            },
            threaten: 1.2,
        },//ai写的
        content: function () {//技能效果在这里
            player.awakenSkill('huidang');//记录下回档是个觉醒技能，这样后面就不会再发动了
            player.removeSkill('zhiqiu');//失去掷球
            player.removeSkill('zhiqiu2');//失去掷球2
            player.removeSkill('shuiji1');//失去水机
            player.addSkills('benzhi1');//获得本职1
            player.addSkills('benzhi2');//获得本职2
            player.skip('phaseUse');
            player.skip('phaseDiscard');
            player.recover(1);//回复一点体力

            var card = get.cardPile(function (card) {//从牌堆和弃牌堆中获得一张杀
                return card.name == 'sheji9';//杀的定义 ，指的要找的牌
            });
            if (card) {
                player.gain(card, 'gain2');//如果找到了就获得
            }
        },
    },
    /*
    //防御伞
    fangyusan: {
        audio: false,
        trigger: { player: "damageBefore", global: "useCardToTarget" },
        forced: true,
        filter: function (event, player, name) {
            if (name == "damageBefore") {
                var evt = event.getParent();
                if (!evt || !evt.card) return false;
                var cardname = evt.card.name;
                return cardname == "wanjian" || cardname == "zhiyuangongji" || cardname == "jinjuzhiyuan";
            }
            if (name == "useCardToTarget") {
                if (event.player == player) return false;
                var card = event.card;
                if (!card) return false;
                var cardname = card.name;
                if (cardname != "wanjian" && cardname != "zhiyuangongji" && cardname != "jinjuzhiyuan") return false;
                if (!event.target) return false;
                return player.inRange(event.target);
            }
            return false;
        },
        content: function () {
            if (event.triggername == "damageBefore") {
                trigger.cancel();
            } else {
                player.chooseToDiscard("he", "防御伞：是否弃置一张牌取消" + get.translation(trigger.target) + "成为目标？").set("ai", function (card) {
                    var player = _status.event.player;
                    var target = _status.event.getTrigger().target;
                    if (get.attitude(player, target) > 0) {
                        return 7 - get.value(card);
                    }
                    return 0;
                }).logSkill = ["fangyusan", trigger.target];
                if (result.bool) {
                    trigger.getParent().excluded.add(trigger.target);
                }
            }
        },
        ai: {
            effect: {
                target: function (card, player, target) {
                    if (card.name == "wanjian" || card.name == "zhiyuangongji" || card.name == "jinjuzhiyuan") return "zeroplayertarget";
                },
            },
        },
    },
    //舰队防御
    jianduifangyu: {
        audio: false,
        enable: "phaseUse",
        usable: 1,
        filterCard: function (card) {
            if (get.color(card) == "red") return true;
            var num = get.number(card);
            return num == 9 || num == 11;
        },
        position: "he",
        filterTarget: function (card, player, target) {
            return target != player;
        },
        check: function (card) {
            return 6 - get.value(card);
        },
        content: function () {
            target.gain(cards, player, "giveAuto");
            target.useCard({ name: "kuaixiu" }, target, false);
            if (get.color(cards[0]) == "red" && (get.number(cards[0]) == 9 || get.number(cards[0]) == 11)) {
                player.draw();
            }
        },
        ai: {
            order: 7,
            result: {
                target: function (player, target) {
                    if (target.hp < target.maxHp) return 2;
                    return 0;
                },
            },
        },
    },
    //迷途
    mitu: {
        audio: false,
        trigger: { player: "phaseEnd" },
        content: function () {
            "step 0"
            player.chooseControl("回复体力并翻面", "cancel2").set("prompt", "迷途：是否回复一点体力并翻面？").set("ai", function () {
                var player = _status.event.player;
                if (player.hp < player.maxHp - 1) return "回复体力并翻面";
                if (player.hp < player.maxHp && player.isTurnedOver()) return "回复体力并翻面";
                return "cancel2";
            });
            "step 1"
            if (result.control == "回复体力并翻面") {
                player.recover();
                player.turnOver();
            }
        },
        group: "mitu_turnover",
        subSkill: {
            turnover: {
                audio: false,
                trigger: { player: "turnOverAfter" },
                direct: true,
                content: function () {
                    "step 0"
                    var num = game.countPlayer();
                    player.chooseControl("摸牌", "cancel2").set("prompt", "迷途：是否将手牌摸至" + num + "张？若如此做，每个角色回合开始时，你须交给其一张牌。").set("ai", function () {
                        var player = _status.event.player;
                        if (player.countCards("h") < num - 2) return "摸牌";
                        return "cancel2";
                    });
                    "step 1"
                    if (result.control == "摸牌") {
                        player.logSkill("mitu");
                        var num = game.countPlayer();
                        var draw = num - player.countCards("h");
                        if (draw > 0) {
                            player.draw(draw);
                        }
                        player.addTempSkill("mitu_give", { player: "turnOverAfter" });
                    }
                },
            },
            give: {
                audio: false,
                trigger: { global: "phaseBegin" },
                forced: true,
                filter: function (event, player) {
                    return event.player != player && player.countCards("h") > 0;
                },
                content: function () {
                    player.chooseCard("h", true, "迷途：交给" + get.translation(trigger.player) + "一张牌").set("ai", function (card) {
                        return 6 - get.value(card);
                    });
                    if (result.bool) {
                        player.give(result.cards, trigger.player);
                    }
                },
            },
        },
    },

    //扎实的铁锤
    zhashidechuizi: {
        audio: false,
        trigger: { player: "useCardToTargeted" },
        direct: true,
        filter: function (event, player) {
            if (event.card.name != "sha") return false;
            return event.target && event.target.countCards("he") > 0;
        },
        content: function () {
            "step 0"
            player.choosePlayerCard(trigger.target, "he", "扎实的铁锤：是否将" + get.translation(trigger.target) + "的一张牌明置于自己武将牌上？").set("ai", function (button) {
                var player = _status.event.player;
                var target = _status.event.getTrigger().target;
                if (get.attitude(player, target) < 0) {
                    return get.value(button.link);
                }
                return 0;
            });
            "step 1"
            if (result.bool && result.cards && result.cards[0]) {
                player.logSkill("zhashidechuizi", trigger.target);
                var card = result.cards[0];
                if (!player.storage.zhashidechuizi_cards) player.storage.zhashidechuizi_cards = [];
                player.storage.zhashidechuizi_cards.push(card);
                player.addSkill("zhashidechuizi_effect");
                player.syncStorage("zhashidechuizi_cards");
                player.markSkill("zhashidechuizi_effect");
                trigger.target.lose(card, ui.special);
            }
        },
        subSkill: {
            effect: {
                audio: false,
                trigger: { global: "judgeBegin" },
                direct: true,
                filter: function (event, player) {
                    return player.storage.zhashidechuizi_cards && player.storage.zhashidechuizi_cards.length > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseButton(["扎实的铁锤：是否将一张牌交给" + get.translation(trigger.player) + "，令判定牌视为此牌的花色？", player.storage.zhashidechuizi_cards]).set("ai", function (button) {
                        var player = _status.event.player;
                        var target = _status.event.getTrigger().player;
                        if (get.attitude(player, target) > 0) {
                            var judge = _status.event.getTrigger().judge(button.link);
                            if (judge > 0) return judge;
                        }
                        return 0;
                    });
                    "step 1"
                    if (result.bool && result.links && result.links[0]) {
                        player.logSkill("zhashidechuizi", trigger.player);
                        var card = result.links[0];
                        player.storage.zhashidechuizi_cards.remove(card);
                        player.syncStorage("zhashidechuizi_cards");
                        if (player.storage.zhashidechuizi_cards.length == 0) {
                            player.removeSkill("zhashidechuizi_effect");
                        } else {
                            player.markSkill("zhashidechuizi_effect");
                        }
                        player.give(card, trigger.player);
                        trigger.fixedResult = { suit: get.suit(card) };
                    }
                },
                marktext: "锤",
                intro: {
                    content: "cards",
                },
            },
        },
    },
    //王牌猎手
    wangpaielieshou: {
        audio: false,
        trigger: { player: "phaseBegin" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseTarget(get.prompt("wangpaielieshou"), "弃置场上的一张牌，然后选择一名手牌数大于其体力值的角色，从左至右依次弃置其手牌，直至小于其当前体力值", function (card, player, target) {
                return target.countCards("h") > target.hp;
            }).set("ai", function (target) {
                var player = _status.event.player;
                if (get.attitude(player, target) < 0) {
                    return target.countCards("h") - target.hp;
                }
                return 0;
            });
            "step 1"
            if (result.bool && result.targets && result.targets[0]) {
                player.logSkill("wangpaielieshou", result.targets);
                event.target = result.targets[0];
                player.chooseTarget("王牌猎手：弃置场上的一张牌", function (card, player, target) {
                    return target.countCards("hej") > 0;
                }, true).set("ai", function (target) {
                    var player = _status.event.player;
                    if (get.attitude(player, target) < 0) {
                        return get.effect(target, { name: "guohe" }, player, player);
                    }
                    return 0;
                });
            } else {
                event.finish();
            }
            "step 2"
            if (result.bool && result.targets && result.targets[0]) {
                player.discardPlayerCard(result.targets[0], "hej", true);
            }
            "step 3"
            if (event.target && event.target.countCards("h") > event.target.hp) {
                var cards = event.target.getCards("h");
                var num = event.target.countCards("h") - event.target.hp;
                if (num > 0 && cards.length > 0) {
                    var toDiscard = cards.slice(0, num);
                    event.target.discard(toDiscard);
                }
            }
        },
    },
    //SP青叶技能
    sp_qingye_R_hongbaiouzhanxiang: {
        audio: false,
        trigger: { player: "phaseBegin" },
        content: function () {
            "step 0"
            player.draw();
            "step 1"
            player.chooseToDiscard("h", true, "回响：弃置一张牌");
            "step 2"
            if (result.bool && result.cards && result.cards[0]) {
                var card = result.cards[0];
                var type = get.type(card);
                if (type == "basic") {
                    player.addTempSkill("sp_qingye_R_hongbaiouzhanxiang_basic");
                } else if (type == "equip") {
                    player.addTempSkill("sp_qingye_R_hongbaiouzhanxiang_equip");
                } else if (type == "trick") {
                    player.chooseTarget("回响：选择一名角色，你摸两张牌，其摸一张牌", true).set("ai", function (target) {
                        var player = _status.event.player;
                        return get.attitude(player, target);
                    });
                }
            }
            "step 3"
            if (result.bool && result.targets && result.targets[0]) {
                player.draw(2);
                result.targets[0].draw();
            }
        },
        subSkill: {
            basic: {
                mod: {
                    cardUsable: function (card, player, num) {
                        if (get.type(card) == "basic") return Infinity;
                    },
                },
            },
            equip: {
                mod: {
                    targetInRange: function (card, player) {
                        return true;
                    },
                },
            },
        },
    },
    //前迫
    qianpo: {
        audio: false,
        mod: {
            selectTarget: function (card, player, range) {
                if (card.name == "sha" && range[1] != -1) range[1]++;
            },
        },
        trigger: { source: "damageBegin1", player: "useCardToTargeted" },
        forced: true,
        filter: function (event, player, name) {
            if (name == "damageBegin1") {
                return event.card && event.card.name == "sha";
            }
            if (name == "useCardToTargeted") {
                return event.card && event.card.name == "juedou" && event.target == player;
            }
            return false;
        },
        content: function () {
            if (event.triggername == "damageBegin1") {
                trigger.num++;
            } else {
                player.addTempSkill("qianpo_discard");
            }
        },
        subSkill: {
            discard: {
                mod: {
                    cardRespondable: function (card, player) {
                        if (card.name == "sha" && _status.event.name == "chooseToRespond") {
                            if (!player.countCards("he")) return false;
                        }
                    },
                },
                trigger: { player: "chooseToRespondBefore" },
                forced: true,
                filter: function (event, player) {
                    return event.filterCard({ name: "sha" }, player, event);
                },
                content: function () {
                    "step 0"
                    player.chooseToDiscard("he", "前迫：须弃置一张牌才可以打出一张【杀】", true);
                    "step 1"
                    if (!result.bool) {
                        trigger.result = { bool: false };
                    }
                },
            },
        },
    },
    //精防
    jingfang: {
        audio: false,
        trigger: { player: "damageBegin3" },
        forced: true,
        filter: function (event, player) {
            if (!player.storage.jingfang_damaged) return false;
            return true;
        },
        content: function () {
            trigger.num--;
        },
        group: "jingfang_mark",
        subSkill: {
            mark: {
                trigger: { player: "damageEnd" },
                forced: true,
                silent: true,
                popup: false,
                content: function () {
                    if (!player.storage.jingfang_damaged) {
                        player.storage.jingfang_damaged = true;
                    }
                },
            },
        },
    },
    //战端
    zhanduan: {
        audio: false,
        trigger: { player: "die" },
        forced: false,
        skillAnimation: true,
        animationColor: "fire",
        content: function () {
            "step 0"
            player.chooseControl("发动", "cancel2").set("prompt", "战端：是否令场上的所有【杀】与锦囊牌造成的伤害+1？").set("ai", function () {
                return "发动";
            });
            "step 1"
            if (result.control == "发动") {
                game.countPlayer(function (current) {
                    current.addSkill("zhanduan_effect");
                });
            }
        },
        subSkill: {
            effect: {
                trigger: { source: "damageBegin1" },
                forced: true,
                filter: function (event, player) {
                    if (!event.card) return false;
                    return event.card.name == "sha" || get.type(event.card) == "trick";
                },
                content: function () {
                    trigger.num++;
                },
                mark: true,
                intro: {
                    content: "你使用【杀】与锦囊牌造成的伤害+1",
                },
            },
        },
    },
    //381警告
    sanbayi_jinggao: {
        audio: false,
        trigger: { global: "gameStart", player: "enterGame" },
        forced: true,
        content: function () {
            var targets = game.filterPlayer(function (current) {
                var name = current.name;
                if (name == "weineituo" || name == "lituoliao" || name == "luoma" || name == "diguo") return true;
                if (current.name1 && (current.name1 == "weineituo" || current.name1 == "lituoliao" || current.name1 == "luoma" || current.name1 == "diguo")) return true;
                if (current.name2 && (current.name2 == "weineituo" || current.name2 == "lituoliao" || current.name2 == "luoma" || current.name2 == "diguo")) return true;
                return false;
            });
            for (var target of targets) {
                target.addMark("sanbayi_jinggao_mark", 1);
                target.addSkill("sanbayi_jinggao_effect");
            }
        },
        group: "sanbayi_jinggao_add",
        subSkill: {
            add: {
                audio: false,
                enable: "phaseUse",
                filterCard: function (card) {
                    return get.subtype(card) == "equip1";
                },
                position: "he",
                filterTarget: function (card, player, target) {
                    return !target.hasMark("sanbayi_jinggao_mark");
                },
                check: function (card) {
                    return 6 - get.value(card);
                },
                content: function () {
                    target.addMark("sanbayi_jinggao_mark", 1);
                    target.addSkill("sanbayi_jinggao_effect");
                    var count = 0;
                    game.countPlayer(function (current) {
                        if (current.hasMark("sanbayi_jinggao_mark")) count++;
                    });
                    if (count > 4) {
                        var targets = game.filterPlayer(function (current) {
                            return current.hasMark("sanbayi_jinggao_mark");
                        });
                        targets.sort(function (a, b) {
                            return a.countMark("sanbayi_jinggao_mark") - b.countMark("sanbayi_jinggao_mark");
                        });
                        if (targets[0]) {
                            targets[0].removeMark("sanbayi_jinggao_mark", 1);
                            if (!targets[0].hasMark("sanbayi_jinggao_mark")) {
                                targets[0].removeSkill("sanbayi_jinggao_effect");
                            }
                        }
                    }
                },
                ai: {
                    order: 8,
                    result: {
                        target: 2,
                    },
                },
            },
            effect: {
                mod: {
                    cardRespondable: function (card, player, target) {
                        if (!target) return;
                        var num = get.number(card);
                        if (num == 3 || num == 8 || num == 1) {
                            return false;
                        }
                    },
                },
                trigger: { player: "dyingBegin" },
                forced: true,
                content: function () {
                    player.removeMark("sanbayi_jinggao_mark", player.countMark("sanbayi_jinggao_mark"));
                    player.removeSkill("sanbayi_jinggao_effect");
                    player.recover(1 - player.hp);
                },
                marktext: "警",
                intro: {
                    content: "使用点数为3、8、1的牌时不可被响应；进入濒死状态时失去此标记并将体力恢复至一点",
                },
            },
            mark: {},
        },
    },
    //执政官的公裁
    zhigongdegongcai: {
        audio: false,
        trigger: { global: "judgeBegin" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseControl("发动", "cancel2").set("prompt", "执政官的公裁：是否发动议事？").set("ai", function () {
                var player = _status.event.player;
                var target = _status.event.getTrigger().player;
                if (get.attitude(player, target) > 0) return "发动";
                return "cancel2";
            });
            "step 1"
            if (result.control == "发动") {
                player.logSkill("zhigongdegongcai");
                event.videoId = lib.status.videoId++;
                var cards = get.cards(3);
                game.cardsGotoOrdering(cards);
                var next = player.chooseButton(["议事：选择一张牌", cards], true);
                next.set("ai", function (button) {
                    var player = _status.event.player;
                    var color = get.color(button.link);
                    if (color == "red") return 2;
                    return 1;
                });
                next.set("videoId", event.videoId);
                "step 2"
                game.broadcastAll("closeDialog", event.videoId);
                if (result.bool && result.links && result.links[0]) {
                    var card = result.links[0];
                    var color = get.color(card);
                    if (color == "red") {
                        game.log(player, "议事结果为红色");
                    } else {
                        game.log(player, "议事结果为黑色");
                        player.chooseControl("弃牌代替", "cancel2").set("prompt", "执政官的公裁：是否弃置一张牌代替判定牌？").set("ai", function () {
                            return "弃牌代替";
                        });
                    }
                    event.议事color = color;
                }
                "step 3"
                if (event.议事color == "black" && result.control == "弃牌代替") {
                    player.chooseToDiscard("he", true, "执政官的公裁：弃置一张牌代替判定牌");
                } else {
                    event.finish();
                }
                "step 4"
                if (result.bool && result.cards && result.cards[0]) {
                    trigger.fixedResult = result.cards[0];
                    player.gain(trigger.player.judging[0], "gain2");
                    player.chooseTarget("执政官的公裁：获得一名角色此次议事展示的牌", true).set("ai", function (target) {
                        return 1;
                    });
                }
                "step 5"
                if (result.bool && result.targets && result.targets[0]) {
                    var target = result.targets[0];
                    if (target.countCards("h") > 0) {
                        player.gainPlayerCard(target, "h", true);
                    }
                }
            }
        },
    },
    //刺玫
    cimei: {
        audio: false,
        trigger: { player: "phaseDiscardEnd" },
        forced: true,
        filter: function (event, player) {
            return player.getStat("card").discard == 0 || !player.getStat("card").discard;
        },
        content: function () {
            "step 0"
            player.loseHp();
            "step 1"
            player.chooseTarget("刺玫：是否令一名体力值低于你的角色获得'刺玫'直至其下个回合结束？", function (card, player, target) {
                return target.hp < player.hp;
            }).set("ai", function (target) {
                var player = _status.event.player;
                if (get.attitude(player, target) < 0) {
                    return -get.attitude(player, target);
                }
                return 0;
            });
            "step 2"
            if (result.bool && result.targets && result.targets[0]) {
                var target = result.targets[0];
                target.addSkill("cimei_effect");
                target.addTempSkill("cimei_remove", { player: "phaseEnd" });
            }
        },
        subSkill: {
            effect: {
                trigger: { player: "phaseDiscardEnd" },
                forced: true,
                filter: function (event, player) {
                    return player.getStat("card").discard == 0 || !player.getStat("card").discard;
                },
                content: function () {
                    player.loseHp();
                },
                mark: true,
                intro: {
                    content: "弃牌阶段结束时，若你于本阶段未弃置牌，你失去一点体力",
                },
            },
            remove: {
                trigger: { player: "phaseEnd" },
                forced: true,
                silent: true,
                popup: false,
                content: function () {
                    player.removeSkill("cimei_effect");
                },
            },
        },
    },
    //破交袭击
    pojiaoxiji: {
        audio: false,
        enable: "phaseUse",
        usable: 1,
        filterTarget: function (card, player, target) {
            return target != player && target.countCards("h") <= player.countCards("h");
        },
        content: function () {
            "step 0"
            var hs1 = player.getCards("h");
            var hs2 = target.getCards("h");
            player.lose(hs1, ui.special);
            target.lose(hs2, ui.special);
            player.gain(hs2, "gain2");
            target.gain(hs1, "gain2");
            "step 1"
            player.chooseTarget("破交袭击：是否视为对一名手牌数多于你的角色使用一张【杀】？", function (card, player, target) {
                return target.countCards("h") > player.countCards("h") && player.canUse({ name: "sha" }, target);
            }).set("ai", function (target) {
                var player = _status.event.player;
                return get.effect(target, { name: "sha" }, player, player);
            });
            "step 2"
            if (result.bool && result.targets && result.targets[0]) {
                player.useCard({ name: "sha" }, result.targets[0], false);
            }
        },
        ai: {
            order: 8,
            result: {
                target: function (player, target) {
                    var hs1 = player.countCards("h");
                    var hs2 = target.countCards("h");
                    if (hs1 > hs2) return hs1 - hs2;
                    return 0;
                },
            },
        },
    },
    //焉福
    yanfu: {
        audio: false,
        trigger: { global: "phaseBegin" },
        direct: true,
        filter: function (event, player) {
            if (player.storage.yanfu_used) return false;
            return true;
        },
        content: function () {
            "step 0"
            player.chooseTarget(get.prompt("yanfu"), "展示并获得一名其他角色的一张牌，然后本回合你不能使用、打出、弃置与获得牌牌名相同的牌", function (card, player, target) {
                return target != player && target.countCards("hej") > 0;
            }).set("ai", function (target) {
                var player = _status.event.player;
                if (get.attitude(player, target) < 0) {
                    return target.countCards("hej");
                }
                return 0;
            });
            "step 1"
            if (result.bool && result.targets && result.targets[0]) {
                player.logSkill("yanfu", result.targets);
                player.storage.yanfu_used = true;
                player.addTempSkill("yanfu_clear", { global: "roundStart" });
                player.gainPlayerCard(result.targets[0], "hej", true);
            } else {
                event.finish();
            }
            "step 2"
            if (result.bool && result.cards && result.cards[0]) {
                var card = result.cards[0];
                player.showCards(card);
                player.storage.yanfu_banned = card.name;
                player.addTempSkill("yanfu_ban");
            }
        },
        subSkill: {
            clear: {
                trigger: { global: "roundStart" },
                forced: true,
                silent: true,
                popup: false,
                content: function () {
                    delete player.storage.yanfu_used;
                },
            },
            ban: {
                mod: {
                    cardEnabled: function (card, player) {
                        if (card.name == player.storage.yanfu_banned) return false;
                    },
                    cardRespondable: function (card, player) {
                        if (card.name == player.storage.yanfu_banned) return false;
                    },
                    cardSavable: function (card, player) {
                        if (card.name == player.storage.yanfu_banned) return false;
                    },
                },
                trigger: { player: "loseAfter" },
                forced: true,
                silent: true,
                popup: false,
                filter: function (event, player) {
                    if (event.type != "discard") return false;
                    if (!event.cards) return false;
                    for (var card of event.cards) {
                        if (card.name == player.storage.yanfu_banned) return true;
                    }
                    return false;
                },
                content: function () {
                    game.log(player, "违反了【焉福】的限制");
                },
            },
        },
    },
    //震撼我妈
    zhenhanjingwoma: {
        audio: false,
        trigger: { global: "roundStart" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseControl("移动座次", "cancel2").set("prompt", "震撼我妈：是否将座次向前移动一位？").set("ai", function () {
                return "移动座次";
            });
            "step 1"
            if (result.control == "移动座次") {
                player.logSkill("zhenhanjingwoma");
                var list = game.players.slice(0);
                var index = list.indexOf(player);
                if (index > 0) {
                    list.remove(player);
                    list.splice(index - 1, 0, player);
                    game.players = list;
                    game.arrangePlayers();
                }
            }
        },
    },
    //一整年
    yizhengnian: {
        audio: false,
        trigger: { global: "roundStart" },
        forced: true,
        content: function () {
            if (!_status.roundCount) _status.roundCount = 1;
            player.draw(_status.roundCount);
        },
    },
    //岛勋
    t23_daoxun: {
        audio: false,
        trigger: { player: "gainAfter" },
        direct: true,
        filter: function (event, player) {
            return event.cards && event.cards.length > 0;
        },
        content: function () {
            "step 0"
            player.chooseControl("展示", "cancel2").set("prompt", "岛勋：是否展示获得的牌？").set("ai", function () {
                return "展示";
            });
            "step 1"
            if (result.control == "展示") {
                player.logSkill("t23_daoxun");
                player.showCards(trigger.cards);
                var colors = [];
                for (var card of trigger.cards) {
                    var color = get.color(card);
                    if (!colors.includes(color)) colors.push(color);
                }
                event.num = colors.length;
                player.chooseTarget("岛勋：令一名角色获得" + event.num + "点护甲", true).set("ai", function (target) {
                    var player = _status.event.player;
                    return get.attitude(player, target);
                });
            } else {
                event.finish();
            }
            "step 2"
            if (result.bool && result.targets && result.targets[0]) {
                var target = result.targets[0];
                target.changeHujia(event.num);
                var list = game.players.slice(0);
                var index1 = list.indexOf(player);
                var index2 = list.indexOf(target);
                if (index2 < index1) {
                    player.chooseToDiscard("he", "岛勋：弃置一张牌", true);
                }
            }
        },
    },
    //破隧
    posui: {
        audio: false,
        trigger: { player: "loseAfter" },
        direct: true,
        filter: function (event, player) {
            return event.type == "discard" && event.cards && event.cards.length > 0;
        },
        content: function () {
            "step 0"
            player.chooseTarget(get.prompt("posui"), "展示其他角色一张手牌", function (card, player, target) {
                return target != player && target.countCards("h") > 0;
            }).set("ai", function (target) {
                var player = _status.event.player;
                if (get.attitude(player, target) < 0) {
                    return target.countCards("h");
                }
                return 0;
            });
            "step 1"
            if (result.bool && result.targets && result.targets[0]) {
                player.logSkill("posui", result.targets);
                event.target = result.targets[0];
                player.choosePlayerCard(event.target, "h", true);
            } else {
                event.finish();
            }
            "step 2"
            if (result.bool && result.cards && result.cards[0]) {
                player.showCards(result.cards);
                event.card = result.cards[0];
                var list = game.players.slice(0);
                var index1 = list.indexOf(player);
                var index2 = list.indexOf(event.target);
                if (index2 > index1) {
                    player.draw();
                }
                if (event.target.canUse(event.card, false)) {
                    player.chooseControl("令其使用", "cancel2").set("prompt", "破隧：是否令" + get.translation(event.target) + "使用" + get.translation(event.card) + "？").set("ai", function () {
                        return "令其使用";
                    });
                } else {
                    event.finish();
                }
            } else {
                event.finish();
            }
            "step 3"
            if (result.control == "令其使用") {
                if (event.card.name == "sha") {
                    player.chooseTarget("破隧：选择【杀】的目标", true, function (card, player, target) {
                        return event.target.canUse(event.card, target);
                    }).set("ai", function (target) {
                        var player = _status.event.player;
                        return get.effect(target, event.card, event.target, player);
                    });
                } else {
                    event.goto(5);
                }
            } else {
                event.finish();
            }
            "step 4"
            if (result.bool && result.targets && result.targets[0]) {
                event.target.useCard(event.card, result.targets[0], false);
                event.target.addTempSkill("posui_unrespondable");
                event.finish();
            } else {
                event.finish();
            }
            "step 5"
            event.target.useCard(event.card, false);
        },
        subSkill: {
            unrespondable: {
                mod: {
                    cardRespondable: function (card, player, target) {
                        if (card.name == "sha") return false;
                    },
                },
            },
        },
    },
    //取首
    qushou: {
        audio: false,
        limited: true,
        skillAnimation: true,
        animationColor: "thunder",
        enable: "phaseUse",
        filterTarget: function (card, player, target) {
            return false;
        },
        content: function () {
            player.awakenSkill("qushou");
            var targets = game.filterPlayer(function (current) {
                return current.group == "KMS";
            });
            for (var i = 0; i < targets.length; i++) {
                var source = targets[i];
                var list = game.filterPlayer(function (current) {
                    return current != source && current.group != "KMS" && source.inRange(current);
                });
                for (var j = 0; j < list.length; j++) {
                    source.useCard({ name: "sha", nature: "thunder" }, list[j], false);
                }
            }
        },
        ai: {
            order: 1,
            result: {
                player: function (player) {
                    var num = 0;
                    var targets = game.filterPlayer(function (current) {
                        return current.group == "KMS";
                    });
                    for (var i = 0; i < targets.length; i++) {
                        var source = targets[i];
                        var list = game.filterPlayer(function (current) {
                            return current != source && current.group != "KMS" && source.inRange(current);
                        });
                        num += list.length;
                    }
                    if (num >= 3) return 1;
                    return 0;
                },
            },
        },
    },
    //高速轻弹
    gaosuqingdan: {
        audio: false,
        enable: "phaseUse",
        filterTarget: function (card, player, target) {
            return target != player && player.inRange(target) && target.countCards("he") > 0;
        },
        content: function () {
            "step 0"
            target.chooseToUse({ name: "sha" }, player, "高速轻弹：对" + get.translation(player) + "使用一张【杀】，否则其弃置你一张牌并对你造成一点伤害").set("ai", function (card) {
                var player = _status.event.player;
                var target = _status.event.getParent().player;
                if (get.attitude(player, target) < 0) return 1;
                return 0;
            });
            "step 1"
            if (!result.bool) {
                player.discardPlayerCard(target, "he", true);
                player.damage(target);
            }
        },
        group: "gaosuqingdan_damage",
        ai: {
            order: 8,
            result: {
                target: -1,
            },
        },
        subSkill: {
            damage: {
                trigger: { player: "damageEnd" },
                direct: true,
                filter: function (event, player) {
                    if (_status.currentPhase != player) return false;
                    if (event.source && event.source.countCards("he") > 0) return true;
                    return false;
                },
                content: function () {
                    "step 0"
                    player.chooseTarget("高速轻弹：是否选择一名有牌的目标视为对其使用一张【决斗】？", function (card, player, target) {
                        return target.countCards("he") > 0 && player.canUse({ name: "juedou" }, target);
                    }).set("ai", function (target) {
                        var player = _status.event.player;
                        return get.effect(target, { name: "juedou" }, player, player);
                    });
                    "step 1"
                    if (result.bool && result.targets && result.targets[0]) {
                        player.logSkill("gaosuqingdan", result.targets);
                        player.useCard({ name: "juedou" }, result.targets[0], false);
                    }
                },
            },
        },
    },
    //魔术兔子
    moshutuzi: {
        audio: false,
        trigger: { player: "phaseDrawBegin1" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseControl("发动", "cancel2").set("prompt", "魔术兔子：是否跳过摸牌阶段？").set("ai", function () {
                return "发动";
            });
            "step 1"
            if (result.control == "发动") {
                player.logSkill("moshutuzi");
                trigger.cancel();
                player.chooseTarget("魔术兔子：选择一名角色", true).set("ai", function (target) {
                    var player = _status.event.player;
                    return get.attitude(player, target);
                });
            } else {
                event.finish();
            }
            "step 2"
            if (result.bool && result.targets && result.targets[0]) {
                event.target = result.targets[0];
                event.shownCards = [];
                event.playerCards = [];
                event.targetCards = [];
            } else {
                event.finish();
            }
            "step 3"
            var card1 = get.cards(1)[0];
            var card2 = get.cards(1)[0];
            event.playerCards.push(card1);
            event.targetCards.push(card2);
            event.shownCards.push(card1, card2);
            player.showCards(card1, "魔术兔子");
            event.target.showCards(card2, "魔术兔子");
            var num1 = get.number(card1);
            var num2 = get.number(card2);
            var match = false;
            for (var i = 0; i < event.shownCards.length - 2; i++) {
                if (get.number(event.shownCards[i]) == num1 || get.number(event.shownCards[i]) == num2) {
                    match = true;
                    break;
                }
            }
            if (match) {
                event.goto(4);
            } else {
                event.goto(3);
            }
            "step 4"
            var lastPlayer = event.playerCards[event.playerCards.length - 1];
            var lastTarget = event.targetCards[event.targetCards.length - 1];
            var numP = get.number(lastPlayer);
            var numT = get.number(lastTarget);
            var winner = null;
            for (var i = 0; i < event.shownCards.length - 2; i++) {
                if (get.number(event.shownCards[i]) == numP) {
                    winner = player;
                    break;
                }
                if (get.number(event.shownCards[i]) == numT) {
                    winner = event.target;
                    break;
                }
            }
            if (winner) {
                winner.gain(event.shownCards, "gain2");
                if (winner != player) {
                    player.chooseControl("翻面", "cancel2").set("prompt", "魔术兔子：是否令" + get.translation(winner) + "翻面？").set("ai", function () {
                        return "翻面";
                    });
                } else {
                    event.finish();
                }
            } else {
                event.finish();
            }
            "step 5"
            if (result.control == "翻面") {
                event.target.turnOver();
                if (event.target.countCards("h") >= 2) {
                    player.gainPlayerCard(event.target, "h", 2, true);
                }
            }
        },
    },
    //强装药主炮
    qiangzhuangyaozhupao: {
        audio: false,
        trigger: { player: "useCardToTargeted" },
        forced: true,
        filter: function (event, player) {
            return event.targets && event.targets.length == 1;
        },
        content: function () {
            "step 0"
            player.judge();
            "step 1"
            if (result.color == "red") {
                trigger.getParent().directHit.addArray(game.players);
            }
            if (trigger.targets && trigger.targets.length == 1) {
                var evt = trigger.getParent();
                if (evt.name == "damage") {
                    evt.nature = "loseHp";
                }
            }
        },
    },
    //大道
    dadao: {
        audio: false,
        trigger: { player: "phaseBegin" },
        direct: true,
        content: function () {
            "step 0"
            player.chooseControl("发动", "cancel2").set("prompt", "大道：是否获得每名其他角色区域内一张牌，然后跳过判定和摸牌阶段？").set("ai", function () {
                var player = _status.event.player;
                var num = 0;
                game.countPlayer(function (current) {
                    if (current != player && current.countCards("hej") > 0) num++;
                });
                if (num >= 3) return "发动";
                return "cancel2";
            });
            "step 1"
            if (result.control == "发动") {
                player.logSkill("dadao");
                event.targets = game.filterPlayer(function (current) {
                    return current != player && current.countCards("hej") > 0;
                });
                event.num = 0;
            } else {
                event.finish();
            }
            "step 2"
            if (event.num < event.targets.length) {
                player.gainPlayerCard(event.targets[event.num], "hej", true);
                event.num++;
                event.redo();
            } else {
                var next = player.phaseSkip("phaseJudge");
                next = player.phaseSkip("phaseDraw");
            }
        },
        group: "dadao_end",
        subSkill: {
            end: {
                trigger: { player: "phaseUseEnd" },
                forced: false,
                filter: function (event, player) {
                    return player.countCards("h") > player.hp;
                },
                content: function () {
                    "step 0"
                    var num = game.countPlayer() - 1;
                    var give = Math.min(num, player.countCards("h") - player.hp);
                    if (give > 0) {
                        player.chooseCard("h", give, "大道：按座次交给其他角色各一张牌", true);
                    } else {
                        event.finish();
                    }
                    "step 1"
                    if (result.bool && result.cards && result.cards.length > 0) {
                        event.cards = result.cards;
                        event.targets = game.filterPlayer(function (current) {
                            return current != player;
                        });
                        event.num = 0;
                    } else {
                        event.finish();
                    }
                    "step 2"
                    if (event.num < event.cards.length && event.num < event.targets.length) {
                        player.give(event.cards[event.num], event.targets[event.num]);
                        event.num++;
                        event.redo();
                    } else {
                        if (event.cards.length < event.targets.length) {
                            player.chooseControl("失去体力", "翻面").set("prompt", "大道：交出的牌数少于其他角色数，选择失去一点体力或翻面").set("ai", function () {
                                var player = _status.event.player;
                                if (player.hp > 2) return "失去体力";
                                return "翻面";
                            });
                        } else {
                            event.finish();
                        }
                    }
                    "step 3"
                    if (result.control == "失去体力") {
                        player.loseHp();
                    } else {
                        player.turnOver();
                    }
                },
            },
        },
    },
    //特混攻击
    tehungongji: {
        audio: false,
        trigger: { player: "phaseBegin" },
        content: function () {
            "step 0"
            player.judge();
            "step 1"
            if (result.color == "red") {
                player.addTempSkill("tehungongji_damage");
            } else {
                player.addTempSkill("tehungongji_multi");
            }
        },
        subSkill: {
            damage: {
                trigger: { player: "useCard1" },
                forced: true,
                filter: function (event, player) {
                    if (!player.storage.tehungongji_used) return true;
                    return false;
                },
                content: function () {
                    player.storage.tehungongji_used = true;
                    var evt = trigger.getParent();
                    if (evt.name == "damage") {
                        evt.num++;
                    }
                },
            },
            multi: {
                trigger: { player: "useCard1" },
                forced: true,
                filter: function (event, player) {
                    if (!player.storage.tehungongji_used) return true;
                    return false;
                },
                content: function () {
                    player.storage.tehungongji_used = true;
                    var targets = game.filterPlayer(function (current) {
                        return current.distance(player) == 1;
                    });
                    trigger.targets = targets;
                },
            },
        },
    },
    //特混攻击2
    tehungongji2: {
        audio: false,
        trigger: { global: ["phaseSkipped", "phaseBegin"] },
        forced: true,
        filter: function (event, player, name) {
            if (event.player == player) return false;
            if (name == "phaseSkipped") return true;
            if (name == "phaseBegin") {
                return _status.currentPhase == event.player;
            }
            return false;
        },
        content: function () {
            player.draw();
        },
    },
    //航空曙光
    hangkongshuguang: {
        audio: false,
        trigger: { player: "phaseUseEnd" },
        direct: true,
        filter: function (event, player) {
            return player.countCards("h") > player.maxHp;
        },
        content: function () {
            "step 0"
            var num = player.countCards("h") - player.maxHp;
            player.chooseCard("h", [1, num], "航空曙光：将超出上限的任意张牌置于武将牌上").set("ai", function (card) {
                return 6 - get.value(card);
            });
            "step 1"
            if (result.bool && result.cards && result.cards.length > 0) {
                player.logSkill("hangkongshuguang");
                player.lose(result.cards, ui.special);
                if (!_status.hangkongshuguang_cards) _status.hangkongshuguang_cards = [];
                _status.hangkongshuguang_cards.addArray(result.cards);
                game.addGlobalSkill("hangkongshuguang_effect");
            }
        },
        subSkill: {
            effect: {
                enable: ["chooseToUse", "chooseToRespond"],
                filter: function (event, player) {
                    if (player.group != "MN") return false;
                    if (!_status.hangkongshuguang_cards || _status.hangkongshuguang_cards.length == 0) return false;
                    return true;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        return ui.create.dialog("航空曙光", _status.hangkongshuguang_cards, "hidden");
                    },
                    filter: function (button, player) {
                        return lib.filter.cardEnabled(button.link, player);
                    },
                    check: function (button) {
                        return get.value(button.link);
                    },
                    backup: function (links, player) {
                        return {
                            filterCard: function () { return false; },
                            selectCard: -1,
                            card: links[0],
                            popname: true,
                        };
                    },
                },
            },
        },
    },*/
};

export { unfulfilledambition };