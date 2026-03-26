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
                    if (trigger.target.Hp + trigger.target.hujia <= 2 && _status.currentPhase.countCards("h") > 1) {
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
            if (_status.currentPhase.hasSkill("quzhudd") || _status.currentPhase.group == 'ΒΜΦCCCP') {

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
                    return 4 - get.value(card);
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
    maliyanaliehuoji: {
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
                player.chooseTarget(1, get.prompt("maliyanaliehuoji"), "令一名其他角色使用区域内任意张花色数为" + event.suitNum + "的牌交换", function (card, player, target) {
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
        force: true,
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
        force: true,
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
        force: true,
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
        force: true,
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
                force: true,
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
        kelaosaiweici_R_jinji: {
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
                    var cards = get.cards(event.kelaosaiweici_R_lunzhan_hand);
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

        "_priority": 0,
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
                    var source = _status.event.player;
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
                });
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
            return cards.length > 0 && cards.every(function(card) { return get.type(card) != 'trick'; });
        },
        content: function () {
            var cards = player.getCards('h');
            player.showCards(cards, get.translation(player) + '展示了所有手牌');
            if (cards.some(function(card) { return get.type(card) == 'trick'; })) {
                return;
            }
            'step 0';
            player.chooseControl('摸两张牌', '伤害+1').set('choiceList', [
                '摸两张牌',
                '本回合你造成的伤害+1'
            ]).set('ai', function () {
                var player = get.player();
                var handlen = player.countCards('h');
                var hp = player.hp;
                var enemies = game.filterPlayer(function(current) {
                    return current != player && get.attitude(player, current) < 0;
                });
                var friendlies = game.filterPlayer(function(current) {
                    return current != player && get.attitude(player, current) > 0;
                });

                // 优先补充弱势手牌
                if (handlen <= 2 || hp <= 2) return 0;

                // 自己手牌很多时可以尝试进攻
                if (handlen >= 5 && enemies.length > 0) return 1;

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
};

export { unfulfilledambition };