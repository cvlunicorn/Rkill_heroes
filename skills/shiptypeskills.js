import { lib, game, get, ui, _status } from "../../../noname.js";
const shiptypeskills = {
    zhuangjiafh: {
        //mod:{maxHandcard:function(player,num){var a=0;if(player.hujia>0){a+=(player.hujia)};return num=(num-a);},},//取消护甲技能减少手牌上限的效果2023.8.7
        trigger: { player: ["damageEnd"], },
        audio: "ext:舰R牌将/audio/skill:true",
        frequent: true,
        firstDo: true,
        usable: 1,
        filter: function (event, player) {
            return !event.hujia && player.hujia == 0;
        },
        content: function () {
            //  game.log(event.triggername,!trigger.hujia);//灵血&&!player.countCards('h',{color:'red'})
            if (player.countMark('jinengup') <= 0) {
                if (event.triggername == 'damageEnd' && trigger.card && (trigger.card.name == 'sha' || trigger.card.name == 'sheji9') && trigger.source && !trigger.nature) {
                    player.changeHujia(1);
                    game.log(get.translation(player), '发动了技能【装甲防护】,增加了 1 点护甲值！');
                }
            } else if (player.countMark('jinengup') == 1) {
                if (event.triggername == 'damageEnd' && (trigger.card && (trigger.card.name == 'sha' || trigger.card.name == 'sheji9') || (trigger.nature && trigger.nature == "fire"))) {
                    player.changeHujia(1);
                    game.log(get.translation(player), '发动了技能【装甲防护】,增加了 1 点护甲值！');
                }
            } else if (player.countMark('jinengup') >= 2) {
                if (event.triggername == 'damageEnd' && (trigger.card && (trigger.card.name == 'sha' || trigger.card.name == 'sheji9') || trigger.nature)) {
                    player.changeHujia(1);
                    game.log(get.translation(player), '发动了技能【装甲防护】,增加了 1 点护甲值！');
                }
            }
            /*if(player.countCards('h',{color:'red'})){
            var next=player.chooseToDiscard('hejs',{color:'red'},[1,2],get.prompt('叠甲'),('你拥有护甲时,会减少等同于护甲值的手牌上限。<br>当你结算完回复/受伤时,你可以弃置至多2张红色牌,获得X点护甲。（X为弃牌数）<br>若你没有用护甲承受过此次伤害,会额外获得1点护甲。<br>你的出牌阶段开始时,会清除你的护甲,然后摸等量的牌（牺牲防御的制衡）'));
            next.ai=function(card){var player=_status.event.player;
             if(player.countCards({name:'tao'})&&player.hasSkill('lingxue'))return -1;
             if(event.triggername=='damageBefore'&&event.nature=="thunder")return-1;
             return 4-get.value(card);
            };*///移除了可以弃置红色牌获得等量护甲值的技能效果2023.8.7
            //if(result.bool&&result.cards){var num=result.cards.length;player.changeHujia(num);}
        },
        /*group:["zhuangjiafh_hujialose"],
        subSkill:{hujialose:{
                 trigger:{
                     player:"phaseUseBegin",
                 },forced:true,
                 name:"回合",
                 lastDo:true,
                 filter:function(event,player){//yichuhujia
         return player.hujia>0;
     },
                 check:function(event,player){
         return player.hujia>0&&player.hp>0;
     },
                 content:function(){player.draw(player.hujia);player.changeHujia(-player.hujia);
     },},},
                 ai:{
                     nohujia:true,
                     "maixie_hp":true,
                     skillTagFilter:function(event){return event.nature=="thunder";},
                 },*///移除回合开始时玩家可以移除自己的护甲值并摸等量的牌的技能。2023.8.7
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    hangmucv: {
        audio: "ext:舰R牌将/audio/skill:true",
        trigger: { player: "phaseUseBegin" },
        filter: function (event, player) {
            return player.countCards('h') > 0;
        },
        check: function (event, player) {
            return 1;
        },
        direct: true,
        content: function () {
            "step 0"
            if (player.countMark('jinengup') <= 0) {
                player.chooseCardTarget({
                    prompt: "弃置任意张黑桃或梅花手牌,视为使用【万箭齐发】",
                    filterCard: { color: 'black' },
                    position: 'h',
                    selectCard: [1, Infinity],
                    selectTarget: [1, Infinity],
                    filterOk: function () {
                        return ui.selected.cards.length == ui.selected.targets.length;
                    },
                    filterTarget: function (card, player, target) {
                        return player.canUse({ name: 'wanjian' }, target);
                    },
                    ai1: function (card) {
                        return 9 - get.value(card);
                    },
                    ai2: function (target) {
                        return get.effect(target, { name: 'wanjian' }, player, player);
                    }

                });
                /*player.chooseToDiscard(2, "h", function (card) {
                    return get.color(card) === 'black';
                }, "弃置两张黑桃或梅花手牌,视为使用【万箭齐发】").set("ai", function (card) {
                    return 4 - get.value(card);
                });*/
            } else if (player.countMark('jinengup') == 1) {
                player.chooseCardTarget({
                    prompt: "弃置任意张黑桃或梅花或红桃手牌,视为使用【万箭齐发】",
                    filterCard: { suit: ['spade', 'club', 'heart'] },
                    position: 'h',
                    selectCard: [1, Infinity],
                    selectTarget: [1, Infinity],
                    filterOk: function () {
                        return ui.selected.cards.length == ui.selected.targets.length;
                    },
                    filterTarget: function (card, player, target) {
                        return player.canUse({ name: 'wanjian' }, target);
                    },
                    ai1: function (card) {
                        return 9 - get.value(card);
                    },
                    ai2: function (target) {
                        return get.effect(target, { name: 'wanjian' }, player, player);
                    }
                });
                /*player.chooseToDiscard(2, "h", function (card) {
                    return get.suit(card) === 'spade' || get.suit(card) === 'club' || get.suit(card) === 'heart';
                }, "弃置两张黑桃或梅花或红桃手牌,视为使用【万箭齐发】").set("ai", function (card) {
                    return 4 - get.value(card);
                });*/
            } else if (player.countMark('jinengup') >= 2) {
                player.chooseCardTarget({
                    prompt: "弃置任意手牌,视为使用【万箭齐发】",
                    filterCard: true,
                    position: 'h',
                    selectCard: [1, Infinity],
                    selectTarget: [1, Infinity],
                    filterOk: function () {
                        return ui.selected.cards.length == ui.selected.targets.length;
                    },
                    filterTarget: function (card, player, target) {
                        return player.canUse({ name: 'wanjian' }, target);
                    },
                    ai1: function (card) {
                        return 9 - get.value(card);
                    },
                    ai2: function (target) {
                        return get.effect(target, { name: 'wanjian' }, player, player);
                    }
                });
                /*player.chooseToDiscard(2, "h", function (card) {
                    return true;
                }, "弃置两张手牌,视为使用【万箭齐发】").set("ai", function (card) {
                    return 4 - get.value(card);
                });*/
            }
            /*"step 1"
            if (result.bool && result.cards && result.cards.length === 2) {
                player.chooseTarget("请选择目标,视为使用【万箭齐发】", [1, Infinity], function (card, player, target) {
                    return player != target;
                }).set("ai", function (target) {
                    return -get.attitude(player, target);
                });
            }*/
            "step 1"
            if (result.targets && result.targets.length > 0) {
                player.logSkill("hangmucv");
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
                /*"target_use": function (player, target) {
                    if (player.hasUnknown(2) && get.mode() != 'guozhan') return 0;
                    var nh = target.countCards('h');
                    if (get.mode() == 'identity') {
                        if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                    }
                    if (nh == 0) return -2;
                    if (nh == 1) return -1.7
                    return -1.5;
                },
                target: function (player, target) {
                    var nh = target.countCards('h');
                    if (get.mode() == 'identity') {
                        if (target.isZhu && nh <= 2 && target.hp <= 1) return -100;
                    }
                    if (nh == 0) return -2;
                    if (nh == 1) return -1.7
                    return -1.5;
                },*/
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
                return get.translation(skill + '_info');
            },
        },
    },
    zhanliebb: {
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    qingxuncl: {
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    zhongxunca: {
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    misscoversha: {
        trigger: {
            player: "shaMiss",
        },
        silent: true,
        filter: function (event) {//return event.getParent(2).name=='zhongpaoduijue'
            ;
        },
        content: function () {
            player.getStat().card.sha--
        },
        forced: true,
        popup: false,
        ai: {
            expose: 0.3,
            threaten: 1.6,
            order: 5,
            result: {
                player: 1,
            },
        },
    },
    xianjinld: {
        enable: "phaseUse",
        usable: 2,
        init: function (player) {
            if (!player.hasMark('xianjinld_difend') && !player.hasMark('xianjinld_attack')) player.addMark('xianjinld_difend');
        },
        content: function () {
            'step 0'
            player.chooseControl('<span class=yellowtext>友军摸牌防御' + '</span>', '<span class=yellowtext>友军远射攻击' + '</span>', 'cancel2').set('prompt', get.prompt('huokongld')).set('prompt2', '<br>防御：你让实际距离此角色为' + (1 + player.countMark('songpaiup')) + '的队友：<br>防御距离+1,但用杀攻击的距离-1,令自己的摸牌阶段摸牌数-1。<br>攻击：让距离自己' + (1 + player.countMark('jinengup')) + '的队友及自己的攻击距离+1,但防御杀的距离-1,队友的摸牌阶段摸牌数+1。<br>强化技能可以增加这两个技能的作用距离').set('ai', function (event, player) {
                var player = get.player(), chusha = lib.filter.cardEnabled({ name: 'sha' }, player), renshu = game.countPlayer(function (current) { return get.attitude(player, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup'); });
                if (renshu < 2 || chusha) return 1; if (renshu >= 2 && !chusha) return 0;
            });
            'step 1'
            if (result.control != 'cancel2') { var i = result.index; game.log(i, 'xianjinld'); if (i == 0 && !player.hasMark('xianjinld_difend')) { player.addMark('xianjinld_difend'); player.removeMark('xianjinld_attack') }; if (i == 1 && !player.hasMark('xianjinld_attack')) { player.addMark('xianjinld_attack'); player.removeMark('xianjinld_difend') }; };
        },
        ai: {
            order: function (player) { if (lib.filter.cardEnabled({ name: 'sha' }, player)) { return 8; } return 3; },
        },
        onremove: function (player) { player.removeGaintag('xianjinld'); },
        mark: true,
        mod: {
            aiOrder: function (player, card, num) { if (get.itemtype(card) == 'card' && card.hasGaintag('xianjinld')) return num + 3; },
        },
        intro: {
            mark: function (dialog, content, player) {
                var tishi = ''; if (player.hasMark('xianjinld_difend')) { var tishi = '实际距离此角色为' + (1 + player.countMark('songpaiup')) + '的队友：防御距离+1,但用杀攻击的距离-1,令自己的摸牌阶段摸牌数-1' }; if (player.hasMark('xianjinld_attack')) { var tishi = '实际距离此角色为' + (1 + player.countMark('songpaiup')) + '的队友及自己：攻击距离+1,但防御杀的距离-1,队友的摸牌阶段摸牌数+1。' };
                if (get.attitude(game.me, player) <= 0 || player.hasMark('xianjinld_difend')) { return get.translation(player) + '观看牌堆中...' + '<br>增益' + tishi; };
                if (get.itemtype(_status.pileTop) != 'card') return '牌堆顶无牌'; var cardPile = Array.from(ui.cardPile.childNodes); var cardPile = cardPile.slice(0, Math.min(3, cardPile.length)); dialog.addAuto(cardPile, tishi);
            },
        },
        global: ["xianjinld_attack", "xianjinld_difend"],
        group: ["xianjinld_difend1"],
        subSkill: {
            attack: {
                mod: {
                    golbalFrom: function (from, to, num) {
                        return num - game.hasPlayer(function (current) {
                            return get.attitude(from, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_attack');
                        });
                    },
                    attackTo: function (from, to, num) {
                        return num - game.hasPlayer(function (current) {
                            return get.attitude(to, current) > 0 && get.distance(to, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_attack');
                        });
                    },
                },
                sub: true,
            },
            difend: {
                mod: {
                    globalTo: function (from, to, num) {
                        return num + game.hasPlayer(function (current) {
                            return current != to && get.attitude(to, current) > 0 && get.distance(to, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_difend');
                        });
                    },
                    attackFrom: function (from, to, num) {
                        return num + game.hasPlayer(function (current) {
                            return current != from && get.attitude(from, current) > 0 && get.distance(from, current, 'pure') <= 1 + current.countMark('jinengup') && current.hasSkill('xianjinld') && current.hasMark('xianjinld_defend');
                        });
                    },
                },
                sub: true,
            },
            "difend1": {
                trigger: {
                    global: "phaseDrawBegin",
                },
                frequent: function (event, player) { if (get.attitude(player, event.player) > 0) return true; return false },
                check: function (event, player) { if (get.attitude(player, event.player) < 0) return false; return true },
                logTarget: "player",
                filter: function (event, player) {//spshicai与云将技能在下面,除了帮助队友外还可以看牌顶。
                    return (get.attitude(player, event.player) >= 0 || player.identity == 'nei') && get.distance(player, event.player, 'pure') <= 1 + player.countMark('jinengup');
                },
                "prompt2": function (event, player) {
                    var a = get.translation('xianjinld_info');
                    if (player.identity == 'nei') { a += ('<br>控制全场状态有一手；<br>内奸需要辅助弱势方,攻击实力出色的角色,平衡场上局势,保持自己的状态,伺机实现连破。') }; return a;
                },
                content: function () { if (trigger.player == player && player.hasMark('xianjinld_difend')) { trigger.num-- }; if (trigger.player != player && player.hasMark('xianjinld_attack')) { trigger.num++; }; },
                sub: true,
            },
        },
    },
    "rendeonly2": {
        audio: "ext:舰R牌将/audio/skill:2",
        audioname: ["gz_jun_liubei", "shen_caopi"],
        enable: "phaseUse",
        filterCard: true,
        position: "hejs",
        selectCard: [1, 2],
        discard: false,
        usable: 2,
        lose: false,
        delay: false,
        filterTarget: function (card, player, target) {
            if (player.getStorage("rerende2").includes(target)) return false;
            return player != target && get.distance(player, target, 'pure') <= 2 + player.countMark('shoupaiup');
        },
        onremove: ["rerende", "rerende2"],
        check: function (card) {
            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
            if (!ui.selected.cards.length && card.name == 'du') return 20;
            var player = get.owner(card);
            if (ui.selected.cards.length >= Math.max(2, player.countCards('h') - player.hp)) return 0;
            if (player.hp == player.maxHp || player.getStorage("rerende") < 0 || player.countCards('h') <= 1) {
                var players = game.filterPlayer();
                for (var i = 0; i < players.length; i++) {
                    if (players[i].hasSkill('haoshi') &&
                        !players[i].isTurnedOver() &&
                        !players[i].hasJudge('lebu') &&
                        get.attitude(player, players[i]) >= 3 &&
                        get.attitude(players[i], player) >= 3) {
                        return 11 - get.value(card);
                    }
                }
                if (player.countCards('h') > player.hp) return 10 - get.value(card);
                if (player.countCards('h') > 2) return 6 - get.value(card);
                return -1;
            }
            return 10 - get.value(card);
        },
        content: function () {
            'step 0'
            var evt = _status.event.getParent('phaseUse');
            if (evt && evt.name == 'phaseUse' && !evt.rerende) {
                var next = game.createEvent('rerende_clear');
                _status.event.next.remove(next);
                evt.after.push(next);
                evt.rerende = true;
                next.player = player;
                next.setContent(lib.skill.rerende1.content);
            }
            if (!Array.isArray(player.storage.rerende2)) {
                player.storage.rerende2 = [];
            }
            player.storage.rerende2.push(target);
            target.gain(cards, player, 'giveAuto');//var usecard=cards[0];target.chooseUseTarget(usecard);
            for (var i = 0; i < cards.length; i += (1)) { var usecard = cards[i]; if (usecard.name != 'sha' || !target.hasSkill('diewulimitai_shale')) { target.chooseUseTarget(usecard) }; if (usecard.name == 'sha') { target.addSkill('diewulimitai_shale'); target.update(); }; };
            if (typeof player.storage.rerende != 'number') {
                player.storage.rerende = 0;
            }
            if (player.storage.rerende >= 0) {
                player.storage.rerende += cards.length;
                if (player.storage.rerende >= 2) {
                    var list = [];
                    if (lib.filter.cardUsable({ name: 'sha' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
                        return player.canUse('sha', current);
                    })) {
                        list.push(['基本', '', 'sha']);
                    }
                    for (var i of lib.inpile_nature) {
                        if (lib.filter.cardUsable({ name: 'sha', nature: i }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
                            return player.canUse({ name: 'sha', nature: i }, current);
                        })) {
                            list.push(['基本', '', 'sha', i]);
                        }
                    }
                    //      if(lib.filter.cardUsable({name:'tao'},player,event.getParent('chooseToUse'))&&game.hasPlayer(function(current){
                    //              return player.canUse('tao',current);
                    //     })){
                    //            list.push(['基本','','tao']);
                    //          }
                    if (lib.filter.cardUsable({ name: 'jiu' }, player, event.getParent('chooseToUse')) && game.hasPlayer(function (current) {
                        return player.canUse('jiu', current);
                    })) {
                        list.push(['基本', '', 'jiu']);
                    }
                    if (list.length) {
                        player.chooseButton(['是否视为使用一张基本牌？', [list, 'vcard']]).set('ai', function (button) {
                            var player = get.player();
                            var card = { name: button.link[2], nature: button.link[3] };
                            if (card.name == 'tao') {
                                if (player.hp == 1 || (player.hp == 2 && !player.hasShan()) || player.needsToDiscard()) {
                                    return 5;
                                }
                                return 1;
                            }
                            if (card.name == 'sha') {
                                if (game.hasPlayer(function (current) {
                                    return player.canUse(card, current) && get.effect(current, card, player, player) > 0
                                })) {
                                    if (card.nature == 'fire') return 2.95;
                                    if (card.nature == 'thunder' || card.nature == 'ice') return 2.92;
                                    return 2.9;
                                }
                                return 0;
                            }
                            if (card.name == 'jiu') {
                                return 0.5;
                            }
                            return 0;
                        });
                    }
                    else {
                        event.finish();
                    }
                    player.storage.rerende = -1;
                }
                else {
                    event.finish();
                }
            }
            else {
                event.finish();
            }
            'step 1'
            if (result && result.bool && result.links[0]) {
                var card = { name: result.links[0][2], nature: result.links[0][3] };
                player.chooseUseTarget(card, true);
            }
        },
        ai: {
            thunderAttack: true,
            order: function (skill, player) {
                if (player.hp < player.maxHp && player.storage.rerende < 2 && player.countCards('h') > 1) {
                    return 7;
                }
                return 3;
            },
            result: {
                target: function (player, target) {
                    if (target.hasSkillTag('nogain')) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                        if (target.hasSkillTag('nodu')) return 0;
                        return -10;
                    }
                    if (target.hasJudge('lebu')) return 0;
                    var nh = target.countCards('h');
                    var np = player.countCards('h');
                    if (player.hp == player.maxHp || player.storage.rerende < 0 || player.countCards('h') <= 1) {
                        if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                    }
                    return Math.max(1, 5 - nh);
                },
            },
            effect: {
                target: function (card, player, target) {
                    if (player == target && get.type(card) == 'equip') {
                        if (player.countCards('e', { subtype: get.subtype(card) }) < 2) {
                            if (game.hasPlayer(function (current) {
                                return current != player && get.attitude(player, current) > 0;
                            })) {
                                return 0;
                            }
                        }
                    }
                },
            },
            threaten: 0.8,
        },
    },
    _diewulimitai: {
        enable: "phaseUse",
        filter: function (event, player) {
            if (lib.config.extension_舰R牌将__diewulimitai === false) return false;
            return player.countCards('h', 'sha') > 0 || player.countCards('he', { type: 'equip' }) > 0;
        },
        filterCard: function (card) {
            var player = get.player();
            return card.name == 'sheji9' || card.name == 'zziqi9' || card.name == 'sha' || card.name == 'jiu' || get.type(card) == 'equip';
        },
        filterTarget: function (card, player, target) {
            if ((get.attitude(player, target) >= 0 || player.identity == 'nei')) return target != player && get.distance(player, target, 'pure') <= 1 + player.countMark('shoupaiup');
        },
        usable: 2,
        position: "hejs",
        prompt: function () { return "给队友一张杀或装备牌,每回合限2次。<br>之后目标可以选择使用此牌,如果因使用此牌而造成伤害,你摸一张牌。" },
        prepare: "give",
        discard: false,
        content: function () {
            'step 0'
            targets[0].gain(cards, player);
            for (var i = 0; i < cards.length; i += (1)) { var usecard = cards[i]; if (usecard.name != 'sha' || !targets[0].hasSkill('_diewulimitai_shale')) { targets[0].chooseUseTarget(usecard); } };
            if (!target.hasSkill('_diewulimitai_shale')) { target.addSkill('_diewulimitai_shale'); }


        },
        subSkill: {
            shale: {
                trigger: {
                    player: "phaseJieshuBegin",
                },
                fixed: true,
                silent: true,
                charlotte: true,
                filter: function (event, player) {
                    if (lib.config.extension_舰R牌将__diewulimitai === false) return false;
                    return true;
                },
                content: function () {
                    if (player.hasSkill('_diewulimitai_shale')) { player.removeSkill('_diewulimitai_shale'); };
                },
                intro: {
                    marktext: "给了杀",
                    content: function (storage, player) {
                        return ('此角色于其回合开始前,不能立即使用获得到的杀。<br>（通过改良仁德与改良递杀获得的杀）');
                    },
                },
                sub: true,
                forced: true,
                popup: false,
            },
        },
        ai: {
            order: function (skill, player) {
                if (player.countCards('h', 'nanman') > 0 && player.countCards('he', 'zhuge') < 1) {
                    return 10;
                }
                return 1;
            },
            expose: 0,
            result: {
                target: function (player, target) {
                    if (!player.canUse('sha', player) && player.countCards('h', 'sha') > 1 && get.attitude(player, target) >= 0 && get.distance(player, target, 'pure') <= 1 + player.countMark('shoupaiup')) {
                        var e1 = target.get('e', '1');
                        if (e1) {
                            if ((e1.name == 'zhuge') || (e1.name == 'rewrite_zhuge')) return 1.1;
                        };
                        if ((target.hasSkill('qigong') || target.hasSkill('guanshi_skill'))) return 1;
                    }; return 0;
                },
            },
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    /* kanpolimitai: {//人杰写的半成品的可强化看破,当下没有调用,先注释了
        enable: "chooseToUse",
        locked: false,
        filter: function (event, player) {
            return player.countCards('hs', { color: 'black' }) > 0 && player.countMark('kanpolimitai_wuxiele') < player.countMark('jinengup') + 2
        },
        filterCard: function (card) {
            return get.color(card) == 'black';
        },
        viewAsFilter: function (player) {
            return player.countCards('hs', { color: 'black' }) > 0 && player.countMark('kanpolimitai_wuxiele') < player.countMark('jinengup') + 2
        },
        viewAs: {
            name: "wuxie",
        },
        position: "hejs",
        prompt: "将一张黑色手牌当无懈可击使用；每轮你最多使用x+1次无懈可击,x为技能强化次数",
        check: function (card) {
            var tri = _status.event.getTrigger();
            if (tri && tri.card && tri.card.name == 'chiling') return -1;
            return 8 - get.value(card);
        },
        threaten: 1.2,
        hiddenCard: function (player, name) {
            if (name == 'wuxie' && _status.connectMode && player.countCards('hs') > 0) return true;
            if (name == 'wuxie') return player.countCards('hs', { color: 'black' }) > 0;

        },
        content: function () {
            if (!player.hasMark('kanpolimitai_wuxiele')) { player.addSkill('kanpolimitai_wuxiele'); }; player.addMark('kanpolimitai_wuxiele');
        },
        group: ["kanpolimitai_wuxiele", "kanpolimitai_canwuxie"],
        subSkill: {
            wuxiele: {
                trigger: {
                    global: "roundStart",
                },
                forced: true,
                silent: true,
                content: function () {
                    player.removeMark('kanpolimitai_wuxiele', player.countMark('kanpolimitai_wuxiele'));
                },
                intro: {
                    marktext: "",
                    content: function (storage, player) {
                        return ('使用无懈的次数');
                    },
                },
                sub: true,
                forced: true,
                popup: false,
            },
            canwuxie: {
                trigger: {
                    player: "useCardAfter",
                },
                filter: function (event, player) {
                    return event.card.name == 'wuxie';
                },
                fixed: true,
                silent: true,
                content: function () {//,player.countMark('diewulimitai_2_shale')player.removeSkill('kanpolimitai_wuxiele');
                    //   if(!player.hasMark('kanpolimitai_wuxiele')){
                    player.addMark('kanpolimitai_wuxiele', 1);
                    // };
                },
                intro: {
                    marktext: "给了杀",
                    content: function (storage, player) {
                        return ('使用无懈的次数');
                    },
                },
                sub: true,
                forced: true,
                popup: false,
            },
        },
        ai: {
            basic: {
                useful: [6, 4, 3],
                value: [6, 4, 3],
            },
            result: {
                player: 1,
            },
            expose: 0.2,
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    }, */
    kaifa: {
        position: "hejs",
        audio: "xinfu_jingxie",
        enable: "phaseUse",
        filter: function (event, player) {//group:["xinfu_jingxie2"],
            var he = player.getCards('he');
            for (var i = 0; i < he.length; i++) {
                if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(he[i].name)) return true;
            }
            return false;
        },
        filterCard: function (card) {
            return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(card.name);
        },
        discard: false,
        lose: false,
        delay: false,
        check: function () {
            return 1;
        },
        content: function () {
            "step 0"
            player.showCards(cards);
            "step 1"
            var card = cards[0];
            var bool = (get.position(card) == 'e');
            if (bool) player.removeEquipTrigger(card);
            game.addVideo('skill', player, ['xinfu_jingxie', [bool, get.cardInfo(card)]])
            game.broadcastAll(function (card) {
                card.init([card.suit, card.number, 'rewrite_' + card.name]);
            }, card);
            if (bool) {
                var info = get.info(card);
                if (info.skills) {
                    for (var i = 0; i < info.skills.length; i++) {
                        player.addSkillTrigger(info.skills[i]);
                    }
                }
            }
        },
        ai: {
            basic: {
                order: 10,
            },
            result: {
                player: 1,
            },
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    huijiahuihe: {
        trigger: { player: "phaseEnd", },
        round: 1, name: "回合", lastDo: true,
        filter: function (event, player) {//暂时不用
            return player.hujia > 0;
        },
        check: function (event, player) {
            return player.hujia > 0 && player.hp > 0;
        },
        content: function () {
            player.storage.huijiahuihe = player.hujia;
            player.changeHujia(-player.hujia);
            player.insertPhase();
        },
        group: ["huijiahuihe_hp", "huijiahuihe_draw", "huijiahuihe_roundcount"],
        subSkill: {
            hp: {
                trigger: {
                    player: "phaseAfter",
                },
                silent: true,
                filter: function (event, player) {
                    return event.skill == 'huijiahuihe' && !player.getStat('damage');
                },
                content: function () {
                    game.log('没输出还是来抽张牌吧')
                    player.draw();
                },
                sub: true,
                forced: true,
                popup: false,
            },
            draw: {
                trigger: {
                    player: "phaseDrawBegin",
                },
                filter: function (event) {
                    return event.getParent('phase').skill == 'huijiahuihe';
                },
                silent: true,
                content: function () {
                    game.log('要少摸牌了')
                    trigger.num -= (2 - player.storage.huijiahuihe);
                },
                sub: true,
                forced: true,
                popup: false,
            },
        },
    },
    qianting_xiji: {
        audio: "ext:舰R牌将/audio/skill:2",
        audioname: ["re_ganning", "re_heqi"],
        mod: {
            attackFrom: function (from, to, distance) { var a = 0; if (from.hasSkill('quzhudd') && to.hasSkill('qianting')) { var a = a - 1 }; return distance = (distance + a) },
            selectTarget: function (card, player, range) { if ((card.name == 'huogong' || card.name == 'guohe' || card.name == 'zhaomingdan9' || card.name == 'xiji9') && player.countMark('jinengup') && range[1] != -1) range[1] += (Math.min(player.countMark('jinengup'), game.players.length - 1)); },
            targetInRange: function (card, player, target) {
                var type = get.type(card);
                if (type == 'trick' || type == 'delay') { if (get.distance(player, target) <= 2) return true; };
            },
        },
        enable: "chooseToUse",
        usable: 2,
        position: "hejs",
        prompt: "将♦/♥非锦囊牌当做顺手牵羊,♣/♠非锦囊牌当做兵粮寸断使用,<br>限两次。张辽与徐晃合体版<br>锦囊牌可以对距离你为2以内的角色使用。",
        filter: function (event, player) { if (event.parent.name == 'phaseUse') return player.countCards('hs') > 0; },
        viewAs: function (cards, player) {
            var name = false;
            switch (get.suit(cards[0], player)) {
                case 'club': name = 'bingliang'; break;
                case 'diamond': name = 'shunshou'; break;
                case 'spade': name = 'bingliang'; break;
                case 'heart': name = 'shunshou'; break;
            }
            if (name) return { name: name };
            return null;
        },
        filterCard: function (card, player, event) { return true },
        selectCard: function (card) { return 1 },
        discard: false,
        check: function (card) {
            var player = get.player(); return 7 - get.value(card)//if(get.suit(card)=='club'&&player.countMark('jinengup')<1){return -1};,本回合内不能再对同一目标使用此技能
        },
        content: function () { },
        ai: {
            basic: {
                order: 1,
                useful: 3,
                value: 3,
            },
            yingbian: function (card, player, targets, viewer) {
                if (get.attitude(viewer, player) <= 0) return 0;
                if (game.hasPlayer(function (current) {
                    return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                })) return 6;
                return 0;
            },
            result: {
                target: function (player, target) {
                    var att = get.attitude(player, target);
                    var nh = target.countCards('h');
                    if (att > 0) {
                        if (target.countCards('j', function (card) {
                            var cardj = card.viewAs ? { name: card.viewAs } : card;
                            return get.effect(target, cardj, target, player) < 0;
                        }) > 0) return 3;
                        if (target.getEquip('baiyin') && target.isDamaged() &&
                            get.recoverEffect(target, player, player) > 0) {
                            if (target.hp == 1 && !target.hujia) return 1.6;
                        }
                        if (target.countCards('e', function (card) {
                            if (get.position(card) == 'e') return get.value(card, target) < 0;
                        }) > 0) return 1;
                    }
                    var es = target.getCards('e');
                    var noe = (es.length == 0 || target.hasSkillTag('noe'));
                    var noe2 = (es.filter(function (esx) {
                        return get.value(esx, target) > 0;
                    }).length == 0);
                    var noh = (nh == 0 || target.hasSkillTag('noh'));
                    if (noh && (noe || noe2)) return 0;
                    if (att <= 0 && !target.countCards('he')) return 1.5;
                    return -1.5;
                },
            },
            tag: {
                loseCard: 1,
                discard: 1,
            },
        },
        intro: {
            content: function () { return get.translation(skill + '_info'); },
        },
        group: [],
        subSkill: {},
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    qianting_jiezi: {
        trigger: {
            global: ["phaseJieshuBegin"],
        },
        forced: true,
        filter: function (event, player) {
            if (event.player != player) {//touxichuan_mod:{cardDiscardable:function(card,player,name){if(name=='dying') return false;},},&&event.trigger.name=="phaseUseBegin"&&event.trigger.name=="phaseUseBegin"
                if (event.player.getHistory('skipped').includes('phaseJudge')) return true;
                if (event.player.getHistory('skipped').includes('phaseDraw')) return true;
                if (event.player.getHistory('skipped').includes('phaseUse')) return true;
                if (event.player.getHistory('skipped').includes('discard')) return true;
            }; return false;
        },
        content: function () {
            player.logSkill('jiezi', trigger.player);
            //if(player.getHistory('skipped').length>0) player.draw(player.getHistory('skipped').length);
            if (trigger.player.getHistory('skipped').includes('phaseJudge')) player.draw();
            if (trigger.player.getHistory('skipped').includes('phaseDraw')) player.draw();
            if (trigger.player.getHistory('skipped').includes('phaseUse')) player.draw();
            if (trigger.player.getHistory('skipped').includes('discard')) player.draw();
        },
        sub: true,
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    qianting: {
        audio: "ext:1牌将修改:2",
        trigger: {
            player: ["phaseZhunbeiBegin", "phaseDiscardBegin"],
        },
        lastDo: true,
        frequent: true,
        filter: function (event, player) {//意外发现function应用广泛,然而解决不了自动显示隐藏标记。航母开幕,然后根据舰种判断具体出什么杀game.log();
            return player.countCards('h') > 0 && player.getHistory("sourceDamage").length == 0;
        },
        content: function () {
            'step 0'
            var next = player.chooseToDiscard(function (card, player) {
                if (player.countMark('jinengup') <= 0) {
                    if (card.suit == 'heart' || card.suit == 'spade') {
                        return lib.filter.cardDiscardable(card, player);
                    }
                }
                else if (player.countMark('jinengup') == 1) {
                    if (card.suit == 'heart' || card.suit == 'spade' || card.suit == 'diamond') {
                        return lib.filter.cardDiscardable(card, player);
                    }
                }
                else if (player.countMark('jinengup') >= 2) {
                    return lib.filter.cardDiscardable(card, player);
                }
                return false;
            }, 'h')
                .set('prompt', '开幕雷击')
                .set('prompt2', '弃置一张符合要求的牌视为使用一张雷杀')
                .set('ai', card => {
                    card1 = {
                        name: 'sha',
                        nature: 'thunder',
                        isCard: true,
                    };
                    return get.useful(card1) - get.useful(card);
                }).set('logSkill', '潜艇');

            /*var next = player.chooseCardTarget({
                prompt: ('雷杀'),
                prompt2: ('弃置一张符合要求的牌'),
                position: 'hejs',//hej代指牌的位置,加个j即可用木流流马的牌。
                selectCard: function () {
                    var player = get.player(); if (ui.selected.targets) return [1, 1]; return 1;
                },//要气质的卡牌,可以return[1,3]
                selectTarget: function () {
                    var player = get.player(); if (ui.selected.cards) return [ui.selected.cards.length, ui.selected.cards.length]; return 1;
                },//要选择的目标,同上,目标上限跟着手牌数走,怕报错跟个判定。
                
                filterCard: function (card, player) {
                    if (player.countMark('jinengup') <= 0) {
                        if (card.suit == 'heart') {
                            return lib.filter.cardDiscardable(card, player);
                        }
                    }
                    else if (player.countMark('jinengup') == 1) {
                        if (card.suit == 'heart' || card.suit == 'spade') {
                            return lib.filter.cardDiscardable(card, player);
                        }
                    }
                    else if (player.countMark('jinengup') >= 2) {
                        if (card.suit == 'heart' || card.suit == 'spade' || card.suit == 'diamond') {
                            return lib.filter.cardDiscardable(card, player);
                        }
                    }
                    return false;
                },
                filterTarget: function (card, player, target) {
                    return player.inRange(target);
                },//选择事件包含的目标,同trigger的目标。有其他同技能的角色时,ai不要重复选择目标。
                ai1: function (card) {
                    return 5 - get.useful(card);
                },//以5为标准就行。
                ai2: function (target) {
                    var att = -get.attitude(_status.event.player, target);
                    if (target.hasSkill('zhanliebb') | target.hasSkill('zhanliebb')) { att *= 1.5 };
                    if (Math.ceil(target.hp * 2) <= target.maxHp) { att *= 2 };
                    if (target.hasSkill('bagua_skill') | target.hasSkill('re_bagua_skill')) { att *= 0.5 };
                    return att;
                }, targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
            });//技能还没扩起来,括起来。*///移除选择目标这一过程,视为使用牌自带选择目标。2024.2.18
            'step 1'
            if (result.bool) {//只能判断你有没有选择,然后给你true与false,没其他文本。
                player.discard(result.cards);//前面有卡牌card,可以返回card,不同于仁德主动技能直接写card。
                //event.target = result.targets;//前面有目标target,可以返回target。player.discard(player.getCards('h').randomGet()),
                //if (player.countCards('h') > 0) { player.useCard({ name: 'sha', nature: 'thunder', isCard: true }, event.target); }//移除选择目标这一过程,视为使用牌自带选择目标。2024.2.18
                player.chooseUseTarget({
                    name: 'sha',
                    nature: 'thunder',
                    isCard: true,
                }, false, "nodistance");
            } else event.finish();
        },
        ai: {
            order: 1,
            result: {
                player: 1,
            },
            threaten: 1.5,
        },
        //a=game.countPlayer(function(current){return get.attitude(player,current)<0&&current.inRange(player)})-1;
        //if(a=0)event.finish();
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    junfu: {
        trigger: {
            global: ["phaseZhunbeiBegin"],
        },
        lastDo: true,
        frequent: true,
        //preHidden: true,
        locked: false,
        filter: function (event, player, name) {//输粮改
            //var a = (event.name == 'phase');
            return player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length > 0 && event.player.isAlive() && event.player != player;//&& a == true
        },
        content: function () {
            'step 0'
            var goon = (get.attitude(player, trigger.player) > 0);
            player.chooseCardButton(get.prompt('junfu', trigger.player), player.getCards('s', function (card) { return card.hasGaintag('junfu') }), [1, 3]).set('ai', function () {
                if (_status.event.goon) return 1;
                return -1;
            }).set('goon', goon);
            'step 1'
            if (result.bool) {
                player.logSkill('junfu', trigger.player);
                //player.loseToDiscardpile(result.links);player.discoverCard(get.inpile('trick'));target.loseToSpecial(event.cards2,'asara_yingwei',player).visible=true;player.draw(1);player.draw(1);player.loseToSpecial(,'junfu',player).visible=true;
                trigger.player.gain(result.links, player);
                //独角兽的技能修葺
                if (player.hasSkill("xiuqi") && (!trigger.player.hasSkill("xiuqi2"))) {
                    game.log(get.translation(trigger.player) + "获得了【修葺】带来的提升！");
                    trigger.player.addTempSkill('xiuqi2', { player: 'phaseAfter' });
                }

                //
                player.draw(1);
            } else event.finish();

        },
        group: ["junfu_choose", "junfu_mark"],
        onremove: function (player, skill) {
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
        //mark: true,
        /* intro: {
            mark: function (dialog, storage, player) {
                if (!player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length) return "共有零张牌";
                return "共有" + get.cnNumber(player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length) + "张军辅牌";
            },
            markcount: function (storage, player) {
                if (player.getCards('s', function (card) { return card.hasGaintag('junfu') })) return player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length;
                return 0;
            },
        }, */
        subSkill: {
            mark: {
                mark: true,
                intro: {
                    /* content: function (storage, player) {
                        if (!player.getCards('s', function (card) { return card.hasGaintag('junfu') })) return "共有零张牌";
                        return "共有" + get.cnNumber(player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length) + "张军辅牌";
                    }, */
                    mark: function (dialog, storage, player) {
                        if (!player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length) return "共有零张牌";
                        return "共有" + get.cnNumber(player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length) + "张军辅牌";
                    },
                    markcount: function (storage, player) {
                        if (player.getCards('s', function (card) { return card.hasGaintag('junfu') })) return player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length;
                        return 0;
                    },
                },
            },
            choose: {
                trigger: {
                    player: "phaseUseEnd",
                },
                forced: true,
                popup: false,
                //firstDo: true,
                locked: false,
                filter: function (event, player) {
                    var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('junfu').length + player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length;
                    return zongshu > cunpaishu && player.countCards('h');
                },
                content: function () {
                    'step 0'
                    var nh = Math.min(player.countCards('h'), Math.ceil(player.getHandcardLimit()));
                    var duiyou = game.countPlayer(function (current) { return get.attitude(player, current) > 0; });
                    var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('junfu').length + player.getCards('s', function (card) { return card.hasGaintag('junfu') }).length;
                    if (nh && zongshu > cunpaishu) {
                        player.chooseCard('h', [1, Math.min(nh, zongshu - cunpaishu)], '将任意张手牌置于你的武将牌上,<br>存牌上限为1+技能强化等级。<br>单次存牌量上限为手牌上限,<br>这些牌可以在回合外递给其他角色').set('ai', function (card) {
                            var player = get.player();
                            if (ui.selected.cards.type == "equip") return -get.value(card);
                            if (ui.selected.cards.length >= duiyou) return -get.value(card);
                            return 9 - get.value(card);
                        });
                    }
                    else { event.finish(); }
                    'step 1'
                    if (result.bool) {
                        // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('junfu');player.update();
                        player.loseToSpecial(result.cards, 'junfu', player).visible = true;
                    }
                },
                //sub: true,
                ai: { combo: "junfu", },
                mod: {
                    aiOrder: function (player, card, num) {
                        if (get.itemtype(card) == "card" && card.hasGaintag("junfu")) return num + 0.5;
                    },
                },
            },
        },
    },
    quzhudd: {
        mod: { globalFrom: function (from, to, distance) { return distance - (to.hasSkill('qianting')); }, },
        group: [],
        ai: {
            expose: 0,
            threaten: 1.8,
            order: 5,
            result: {
                player: 1,
            },
        },
        intro: {
            content: function () {
                return get.translation(skill);
            },
        },
    },
    fangqu: {
        trigger: {
            player: "phaseZhunbeiBegin",
            global: "gameStart",
        },
        frequent: true,
        firstDo: true,
        filter: function (event, player) {
            var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('daodan').length + player.getCards('s', function (card) { return card.hasGaintag('daodan') }).length;
            return zongshu > cunpaishu && player.countCards('h');
        },
        content: function () {
            'step 0'
            var nh = Math.min(player.countCards('h'), Math.ceil(player.getHandcardLimit()));
            var zongshu = 1 + player.countMark('jinengup'), cunpaishu = player.getExpansions('daodan').length + player.getCards('s', function (card) { return card.hasGaintag('daodan') }).length;
            if (nh && zongshu > cunpaishu) {
                player.chooseCard('h', [1, Math.min(nh, zongshu - cunpaishu)], '将任意张手牌置于你的武将牌上,<br>存牌上限为1+技能强化等级。<br>单次存牌量上限为手牌上限,<br>这些牌可以使锦囊牌无效').set('ai', function (card) {
                    var player = get.player();
                    if (ui.selected.cards.type == "equip") return -get.value(card);
                    return 9 - get.value(card);
                });
            }
            else { event.finish(); }
            'step 1'
            if (result.bool) {
                // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('junfu');player.update();
                player.loseToSpecial(result.cards, 'daodan', player).visible = true;
            }

        },
        ai: {
            combo: "fangqu_wuxie",
        },
        group: ["fangqu_wuxie"],
        onremove: function (player, skill) {
            var cards = player.getExpansions(skill);
            if (cards.length) player.loseToDiscardpile(cards);
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
        subSkill: {
            wuxie: {
                trigger: {
                    global: ["useCard"],
                },
                filter: function (event, player) {
                    return player.countCards('s', function (card) { return card.hasGaintag('daodan') }) > 0 && get.type(event.card) == "trick";
                },
                check: function (event, player) {
                    var effect = 0;
                    if (event.card.name == "wuxie") {
                        if (get.attitude(player, event.player) < -1) {
                            effect = -1;
                        }
                    } else if (event.targets && event.targets.length) {
                        for (var i = 0; i < event.targets.length; i++) {
                            effect += get.effect(event.targets[i], event.card, event.player, player);
                        }
                    }
                    return effect < 0;
                },
                prompt: function (event, player) {
                    var str = "防驱：是否拦截" + get.translation(event.player);
                    if (event.targets && event.targets.length) {
                        str += "对" + get.translation(event.targets);
                    }
                    str += "使用的" + get.translation(event.card);
                    return str;
                },
                content: function () {
                    "step 0";
                    if (player.getCards('s', function (card) { return card.hasGaintag('daodan') }).length <= 0) { return; }
                    player.chooseCardButton('移去一张防空导弹', player.getCards('s', function (card) { return card.hasGaintag('daodan') }), true, 1).set('ai', function (button) {
                        return 1;
                    });
                    "step 1";
                    if (result.bool) {
                        var cards = result.links;
                        player.loseToDiscardpile(cards);
                        trigger.targets.length = 0;
                        trigger.all_excluded = true;
                    }
                },
                ai: {
                    threaten: 1.8,
                    expose: 0.3,
                },
                "_priority": 0,
            }
        }
    },
    daoqu: {
        mod: {
            //selectTarget:function(card,player,range){///是卡片作用时可选的目标数量,输出range给牌的发起事件阶段用。
            //if(range[1]==-1) return;var a=game.countPlayer(function(current){return get.attitude(player,current)<=0&&current.inRange(player)})-1;
            //if(card.name=='sha') range[1]+=Math.min(player.countMark('jinengup'),a);},
            attackRange: function (from, distance) {
                return distance + (2 + 2 * from.countMark('jinengup'));
            },
        },
        usable: 1,
        filterTarget(card, player, target) {
            if (player == target) return false;
            return true;
        },
        enable: "phaseUse",
        filterCard: function (card) {
            var player = get.player();
            if (player.countMark('jinengup') <= 0) {
                return get.subtype(card) == "equip1";
            } else if (player.countMark('jinengup') == 1) {
                return get.type(card) == "equip";
            } else if (player.countMark('jinengup') >= 2) {
                return get.type(card) != "basic";
            }
        },
        selectCard: 1,
        content: function () {
            if (lib.card["yuanchengdaodan9"]) {
                var card = {
                    name: "yuanchengdaodan9",
                    isCard: true,

                };
                player.useCard(card, target, false).set("oncard", function () {
                    _status.event.directHit.addArray(game.filterPlayer());
                });
            } else {
                target.damage(1);
            }
            //target.damage("nocard");
        },
        check: function (card) {
            return 10 - get.value(card);
        },
        position: "he",
        ai: {
            order: 8.5,
            result: {
                target: function (player, target) {
                    return get.damageEffect(target, player);
                },
            },
        },
        threaten: 1.5,
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    /* dajiaoduguibi: {//2025.11-2026.1版本的回避,过强。
        trigger: {
            player: ["damageBefore"],
        },
        firstDo: true,
        filter(event, player, name) {
            if (!player.isEmpty(2)) return false;
            if (!event.card || !event.card.name) return false;
            return event.num > 0;
        },
        check: function (event, player) {
            return true;
        },
        content: function () {
            "step 0"
            event.cards = [];
            player.judge('dajiaoduguibi', function (card) {
                if (player.countMark('jinengup') <= 0) {
                    return (get.suit(card) == 'diamond') ? 1.6 : -0.5
                } else if (player.countMark('jinengup') == 1) {
                    return (get.name(card) == 'huibi9' || get.name(card) == 'kuaixiu9' || get.name(card) == 'tao' || get.name(card) == 'shan' || get.suit(card) == 'diamond') ? 1.6 : -0.5
                } else if (player.countMark('jinengup') >= 2) {
                    return (get.suit(card) == 'heart' || get.suit(card) == 'diamond') ? 1.6 : -0.5
                }
            }).judge2 = function (result) {
                return result.bool;
            };
            //以下部分是回避判定失败后摸牌。2023.8.6移除
            //if(result.judge<=0){event.cards.push(result.card);if(Math.max(player.getHandcardLimit(),3)>=player.countCards('h')){player.gain(event.cards);
      //var next=player.chooseToDiscard(get.prompt('回避弃牌事件'),1,'手牌数超过上限,请弃置一张手牌',true);
        //    next.ai=function(card){
                  //  return 30-get.useful(card);}
                
                  //};
       //if(player.hasSkill('quzhudd')){if(!player.countMark('dajiaoduguibi')){player.addMark('dajiaoduguibi');event.goto(0);}else {player.removeMark('dajiaoduguibi',player.countMark('dajiaoduguibi'));};};
            //};
            "step 1"
            if (result.judge > 0) {
                trigger.cancel();
            };
        },
        ai: {
            respondShan: true,
            effect: {
                target: function (card, player, target, effect) {
                    if (target.hasSkillTag('unequip2')) return;
                    if (player.hasSkillTag('unequip', false, {
                        name: card ? card.name : null,
                        target: target,
                        card: card
                    }) || player.hasSkillTag('unequip_ai', false, {
                        name: card ? card.name : null,
                        target: target,
                        card: card
                    })) return;
                    if (get.tag(card, 'damage')) return 0.5;
                },
            },
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
*/
    dajiaoduguibi: {
        trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
        filter: function (event, player) {
            if (event.responded) return false;
            if (event.dajiaoduguibi) return false;
            if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) return false;
            if (
                event.name == "chooseToRespond" &&
                !lib.filter.cardRespondable({ name: "shan" }, player, event)
            )
                return false;
            if (player.hasSkillTag("unequip2")) return false;
            var evt = event.getParent();
            if (
                evt.player &&
                evt.player.hasSkillTag("unequip", false, {
                    name: evt.card ? evt.card.name : null,
                    target: player,
                    card: evt.card,
                })
            )
                return false;
            if (!player.hasEmptySlot(2)) return false;
            return true;
        },
        check: function (event, player) {
            if (!event) return true;
            if (event.ai) {
                var ai = event.ai;
                var tmp = _status.event;
                _status.event = event;
                var result = ai({ name: "shan" }, _status.event.player, event);
                _status.event = tmp;
                return result > 0;
            }
            let evt = event.getParent();
            if (player.hasSkillTag("noShan", null, evt)) return false;
            if (!evt || !evt.card || !evt.player || player.hasSkillTag("useShan", null, evt))
                return true;
            if (
                evt.card &&
                evt.player &&
                player.isLinked() &&
                game.hasNature(evt.card) &&
                get.attitude(player, evt.player._trueMe || evt.player) > 0
            )
                return false;
            return true;
        },

        content: function () {
            "step 0"
            player.judge('dajiaoduguibi', function (card) {
                if (player.countMark('jinengup') <= 0) {
                    return (get.suit(card) == 'diamond') ? 1.6 : -0.5;
                } else if (player.countMark('jinengup') == 1) {
                    return ((get.name(card) == 'tao' || get.name(card) == 'kuaixiu9' || get.name(card) == 'shan' || get.name(card) == 'huibi9') || get.suit(card) == 'diamond') ? 1.6 : -0.5;
                } else if (player.countMark('jinengup') >= 2) {
                    return (get.suit(card) == 'heart' || get.suit(card) == 'diamond') ? 1.6 : -0.5;
                }
            }).judge2 = function (result) {
                return result.bool;
            };
            "step 1"
            if (result.judge > 0) {
                trigger.untrigger();
                trigger.set('responded', true);
                trigger.result = { bool: true, card: { name: 'shan' } }
            }
        },
        ai: {
            respondShan: true,
            skillTagFilter(player, tag, arg) {
                if (arg != 'respond') return false;
                return true;
            },
            effect: {
                target: function (card, player, target) {
                    if (player == target && get.subtype(card) == 'equip2') {
                        if (get.equipValue(card) <= 7.5) return 0;
                    }
                    if (!target.hasEmptySlot(2)) return;
                    return lib.skill.bagua_skill.ai.effect.target.apply(this, arguments);
                }
            }
        },
    },
    huokongld: {
        firstDo: true,
        frequent: true,
        trigger: { player: ["shaMiss", "eventNeutralized"], }, audio: "ext:舰R牌将/audio/skill:true",
        filter: function (event, player) {
            if (event.type != 'card' || event.card.name != 'sha') return false;

            return player.countCards('he', function (card) { return card != player.getEquip('guanshi'); }) >= 1 && event.target.isAlive();
        },
        content: function () {
            "step 0"
            //get.prompt2('huokongld')Math.max(0,2-player.countMark('jinengup'))player.chooseToCompare(trigger.player);if(player.countMark('jinengup')>1){player.chooseToCompare(trigger.target);event.goto(2);};else if(player.countMark('jinengup')>1){player.}
            var evt = _status.event.getTrigger(), num = evt.baseDamage + evt.extraDamage, a = player.countMark('jinengup'); if (player.countMark('jinengup') > 1) { a = 1 };
            /*if(player.hasSkill('guanshi_skill')||player.getEquip('shangyouyihao9')){
           player.chooseControl('<span class=yellowtext>强制命中'+'</span>','cancel2').set('prompt',get.prompt('huokongld')).set('prompt2','令本次攻击命中对手,<br>装备贯石斧时,此技能反转了贯石斧的效果,使其更为强悍,<br>根据技能强化等级*此次伤害量：对面摸2/1/0*'+num+'张牌。').set('ai',function(card){
           var evt=_status.event.getTrigger();
                if(get.attitude(evt.player,evt.target)<0){
                    if(evt.baseDamage+evt.extraDamage>=Math.min(2,evt.target.hp)){
                        return 1.1}return 1}return -1;});
            }else {*///以上是同时拥有火控技能与贯石斧时的处理方法。2023.8.6移除。
            var next = player.chooseToDiscard('令本次攻击改为命中对手,<br>0级,你弃置一张杀,一级,你弃置一张黑色牌,二级,你弃置1张牌。', 'he', function (card) {
                if (player.countMark('jinengup') <= 0) {
                    return get.name(card) == 'sha';
                } else if (player.countMark('jinengup') == 1) {
                    return (get.suit(card) == 'spade' || get.suit(card) == 'club') && _status.event.player.getEquip('guanshi') != card;
                } else if (player.countMark('jinengup') >= 2) {
                    return _status.event.player.getEquip('guanshi') != card;
                }
            });
            next.logSkill = 'guanshi_skill';
            next.set('ai', function (card) {
                var evt = _status.event.getTrigger();
                if (get.attitude(evt.player, evt.target) < 0) {
                    if (evt.baseDamage + evt.extraDamage >= Math.min(2, evt.target.hp)) {
                        return 7 - get.value(card)
                    } return 5 - get.value(card)
                } return -1;
            });
            "step 1"
            if (result.bool || result.index == 0) {
                if (event.triggername == 'shaMiss') {
                    var evt = _status.event.getTrigger();
                    /*if(!player.hasSkill('guanshi_skill')&&!player.getEquip('huokongld_equip')){if(player.countMark('jinengup')=1){trigger.target.draw((evt.baseDamage+evt.extraDamage));};}else{evt.target.draw((2-player.countMark('jinengup'))*(evt.baseDamage+evt.extraDamage));};*///移除对方摸牌的部分,2023.8.6
                    trigger.untrigger(); trigger.trigger('shaHit');
                    trigger._result.bool = false; trigger._result.result = null;
                }
                else { trigger.unneutralize(); }
            }
            "step 2"
            if (result.bool) {
                trigger.untrigger(); trigger.trigger('shaHit');
                trigger._result.bool = false; trigger._result.result = null;
            };
        },
        ai: {
            "directHit_ai": true,
            skillTagFilter: function (player, tag, arg) {
                if (player._guanshi_temp) return;
                player._guanshi_temp = true;
                var bool = (get.attitude(player, arg.target) < 0 && arg.card.name == 'sha' && player.countCards('he', function (card) {
                    return card != player.getEquip('guanshi') && card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) < 5;
                }) > 1);
                delete player._guanshi_temp;
                return bool;
            },
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    "ganglie_gai": {
        audio: "ext:舰R牌将/audio/skill:2",
        trigger: { player: "damageEnd", },
        filter: function (event, player) {
            return (event.source != undefined && event.source != player && event.player.hp <= event.player.maxHp / 2);
        },
        check: function (event, player) {
            return (get.attitude(player, event.source) <= 0);
        },
        logTarget: "source",
        content: function () {
            "step 0"//if(player.countCards('h')>=3) event.tishi+=('');
            event.num = trigger.num; if (trigger.hujia) { event.num = 1 }; event.tishi = '你可以弃置(0-2)张牌并进行判定。<br>若结果不为红桃,则伤害来源选择一项：<br>1.弃置x+1张手牌,<br>2.选择交给你一张牌;<br>3.失去一点体力(无视护甲)。<br>若你先弃置了两张牌,<br>则1.判定失败时可以获得目标的一张牌;<br>2.目标未选择弃牌时,会额外失去一张牌。'; var shili = trigger.source.countCards('he') / player.countCards('he');
            if (player.countCards('h') >= 3) { event.tishi += ('<br>'); if (shili >= 1.5) { event.tishi += ('对手处于优势,希望此技能 能成功减弱对手的攻势吧') }; if (shili < 1.5 && shili >= 1.2) { event.tishi += ('对手处于优势,尝试获取廉价的收益吧') }; if (shili < 1.2 && shili >= 0.8) { event.tishi += ('即将打破的僵持状况,稳住心态') }; if (shili < 0.8) { event.tishi += ('稳妥起见,多弃置一张也无妨,有一个弱化的顺手牵羊作为保底嘛') }; };
            "step 1"
            if (trigger.source.isAlive()) {
                player.chooseToDiscard([0, 2]).set('prompt2', event.tishi).set('ai', function (card) {
                    if (ui.selected.cards.length) return -1;
                    if (card.name == 'tao') return -10;
                    if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                    return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                });
            };
            "step 2"//game.log(result.cards);  
            //   if(result.bool){
            event.num -= (1); if (result.bool) { event.qipai = result.cards.length; } else event.qipai = 0;
            player.judge(function (card) {
                if (get.suit(card) == 'heart') return -2;
                return 2;
            }).judge2 = function (result) {
                return result.bool;
            };//}else event.finish();
            "step 3"
            if (result.judge < 2) {
                event.finish(); if (event.qipai > 1) { player.gainPlayerCard(true, trigger.source, 'he'); };
            } else {
                event.tishi = '作为伤害来源,选择一项：<br>现在是：1.弃置x+1张手牌,<br>接下来是：2.选择交给' + get.translation(player) + '一张手牌;<br>3.失去一点体力(无视护甲)。<br>'; if (event.qipai > 1) { event.tishi += ('对手先弃置了两张牌,其判定失败时,可以获得你的一张牌；你进行选择2前,会额外失去一张牌。') };
                trigger.source.chooseToDiscard(1 + event.qipai).set('prompt2', event.tishi).set('ai', function (card) {
                    if (card.name == 'tao') return -10;
                    if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                    return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                });
            };
            "step 4"
            if (result.bool == false) {
                event.tishi = '作为伤害来源：2.选择交给' + get.translation(player) + '一张手牌;<br>3.不执行,则自己失去一点体力(无视护甲)。<br>'; if (event.qipai > 1) { event.tishi += ('对手先弃置了两张牌,你进行选择2前,若手牌大于1,会额外失去一张牌。<br>'); if (trigger.source.countCards('h') >= 2) { trigger.source.discard(trigger.source.getCards('h').randomGet()); }; };
                if (trigger.source.countCards('h', { name: 'tao' }) >= 0) { event.tishi += ('有桃,不怕扣血；') }; if (trigger.source.countCards('h', { name: 'jiu' }) >= 0) { event.tishi += ('有酒,没血不慌；') }; if (trigger.source.countCards('h', { name: 'shandian' }) + trigger.source.countCards('h', { name: 'taoyuan' }) >= 0) { event.tishi += ('有些稀有卡牌能变废为宝,转给对手') };
                if (!trigger.source.countCards('h')) event._result = { bool: false };
                else trigger.source.chooseCard('h').set('prompt2', event.tishi).set('ai', function (card) {
                    if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
                        if (card.name == 'tao') return -10; if (card.name == 'jiu' && _status.event.player.hp != 1) return -10;
                        if (event.qipai < 1) { return -10; };
                        if (get.suit(card) != 'heart') return 7 - get.value(card);
                        return 5 - get.value(card);
                    }
                    else {
                        if (card.name == 'tao') return -10;
                        if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                        return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                    }
                });
            };
            'step 5'
            if (result.bool) {
                var card = result.cards[0];

                trigger.source.give(card, player);
            }
            else {
                trigger.source.loseHp();
            };
            if (event.num > 0) { event.goto(1) };
        },
        ai: {
            "maixie_defend": true,
            effect: {
                target: function (card, player, target) {
                    if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
                    return 0.8;
                    // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
                },
            },
        },
        intro: {
            content: function () {
                return get.translation(skill + '_info');
            },
        },
    },
    zhiyangai: {
        audio: "ext:舰R牌将/audio/skill:2",
        audioname: ["gexuan", "re_yufan"],
        trigger: {
            player: "phaseJieshuBegin",
        },
        frequent: true,
        content: function () {
            "step 0"
            event.num1 = player.countMark('jinengup') + 1; event.num2 = 0;
            var a = game.countPlayer(function (current) { return get.attitude(player, current) > 0 });
            player.chooseTarget(get.prompt('zhiyan'), [1, Math.min(event.num1, a)], '令目标角色摸一张牌并展示之。<br>若为装备牌,则其选择是否装备。<br>(每强化一次技能,便+1技能的可以选择的目标数)', function (card, player, target) {
                return get.distance(player, target, 'pure') <= 1 + player.countMark('jinengup');
            }).set('ai', function (target) {
                return get.attitude(_status.event.player, target);
            });
            "step 1"
            if (result.bool) {
                event.target = result.targets;
                player.logSkill('zhiyan', result.targets);
            }
            else {
                event.finish();
            }
            "step 2"
            event.target[event.num2].draw('visible');
            "step 3"
            var card = result[0];
            if (get.type(card) == 'equip') {
                if (event.target[event.num2].getCards('h').includes(card) && event.target[event.num2].hasUseTarget(card)) {
                    event.target[event.num2].chooseUseTarget(card);
                    game.delay();
                }
            }
            "step 4"
            if (event.target.length - 1 > event.num2) {
                event.num2 += (1); event.goto(2);
            }
        },
        ai: {
            expose: 0.2,
            threaten: 1.2,
        },
    },
    "fangkong2": {
        name: "防空", //audio: "ext:舰R牌将/audio/skill:1", audioname: ["yixian_R", "reganning", "sunce", "re_sunben", "re_sunce", "ol_sunjian"],
        unique: true, nodelay: true, lastDo: true,
        trigger: { global: "useCardToPlayered", },
        filter: function (event, player) {
            if (event.getParent().triggeredTargets3.length > 1) return false;//万箭要作用七个目标,而你不想跟着遍历七次技能。
            if (get.type(event.card) != 'trick') return false;
            if (get.info(event.card).multitarget) return false;
            if (!player.countCards('he')) return false;
            if (event.targets.length < 2) return false;
            for (var i = 0; i < event.targets.length; i++) {
                if (!event.targets[i].hasSkill("fangkong2_aibiexuan")) return true;
            } return false;
        },
        direct: true,
        content: function () {
            'step 0'
            var next = player.chooseCardTarget({
                prompt: get.prompt('防空保护对象'),
                prompt2: ('当一名角色使用的锦囊牌指定了至少两名角色为目标时,<br>你可弃置两张牌（拥有对空防御则改为一张）令此牌对距离你' + (player.countMark('jinengup') + 1) + '内的任意名角色无效。'),
                position: 'hejs',//hej代指牌的位置,加个s即可用木流流马的牌。
                selectCard: function () {
                    var player = get.player();/*if(ui.selected.targets)return [1,Math.min(trigger.targets.length,Math.floor(player.countCards('he')))];*///取消弃牌数与选择目标数相等改为固定弃置两张牌2023.8.7
                    if (player.hasSkill('duikongfangyu') || player.hasSkill("fangkongdanmu9_skill")) {
                        return 1;//对空防御的技能效果。若玩家拥有对空防御,则弃牌1。&&防空弹幕的装备效果,若玩家拥有防空弹幕则弃牌1。
                    }
                    return 2;
                },//要气质的卡牌,可以return[1,3]if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length+player.countMark('jinengup')];return 1;-player.countMark('jinengup')
                selectTarget: function () {
                    var player = get.player();/*if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length];*/return [1, 7];
                },//要选择的目标,同上,目标上限跟着手牌数走,怕报错跟个判定。
                filterCard: function (card, player) {
                    return lib.filter.cardDiscardable(card, player);
                },//气质能气质掉的卡牌。
                filterTarget: function (card, player, target) {
                    if (_status.event.targets.includes(target) && !target.hasSkill('fangkong2_aibiexuan')) {
                        if (player.hasSkill('duikongfangyu')) {
                            return get.distance(player, target) <= 5;//对空防御的技能效果。若玩家拥有对空防御,则视为满级强化。
                        }
                        return get.distance(player, target) <= (1 + 2 * player.countMark('jinengup'));
                    }
                },//选择事件包含的目标,同trigger的目标。有其他同技能的角色时,ai不要重复选择目标。
                ai1: function (card) {
                    return 7 - get.useful(card);
                },//建议卡牌以7为标准就行,怕ai不救队友,所以调高了。同时ai顺次选择卡牌时不要选太多卡牌,要形成持续的牵制。
                ai2: function (target) {
                    var player = get.player(); var trigger = _status.event.getTrigger();
                    //game.log(get.translation(_status.event.player)); 
                    if (!target.hasSkill("fangkong2_aibiexuan")) {
                        return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                    }
                    return 0;
                }, targets: trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
            });//技能还没扩起来,括起来。
            'step 1'
            if (result.bool) {//只能判断你有没有选择,然后给你true与false,没其他文本。
                player.discard(result.cards);//前面有卡牌card,可以返回card,不同于仁德主动技能直接写card。
                event.target = result.targets;//前面有目标target,可以返回target。
                if (event.target && event.target.length > 0) {
                    for (var i = 0; i < trigger.targets.length; i += 1) {
                        if (event.target.includes(trigger.targets[i])) {
                            trigger.getParent().excluded.add(trigger.targets[i]);
                            trigger.targets[i].addSkill('fangkong2_aibiexuan');
                            game.log('取消卡牌目标', trigger.targets[i], '编号', i)
                        }
                    }
                };//三级选择,集合target是否包含trigger.target。同时测试是否选到了目标。
                player.logSkill('fangkong2', event.target);
                //if (player.hasSkill('duikongfangyu') && _status.currentPhase != player) player.draw(2);//对空防御的技能效果。若玩家拥有对空防御,则发动防空后可以摸牌。
            }//让技能发语音,发历史记录。
        },
        subSkill: {
            aibiexuan: {
                trigger: {
                    global: "useCardEnd",
                },
                forced: true,
                content: function () {
                    game.log('保护结束');
                    player.removeSkill('fangkong2_aibiexuan');
                },
                sub: true,
            },
        },
    },
    yaosai: {
        init: function (player) {//初始化数组,也可以运行事件再加if后面的内容
            if (!player.storage.yaosai) player.storage.yaosai = 0;
        },
        enable: "phaseUse",
        filter: function (event, player) {
            return player.storage.yaosai < player.countMark('jinengup');
        },
        content() {
            player.gainMaxHp(1);
            player.recover(1);
            player.storage.yaosai += 1;
        },
        ai: {
            order: 11,
            result: {
                player: function (player, target) {
                    return 2;
                }
            },
            threaten: 1.1,
        },
    },
    shixiangquanneng: {
        init: function (player) {
            player.storage.shixiangquanneng = [];
        },
        nobracket: true,
        trigger: { global: "roundStart", },
        forced: true,
        content() {
            "step 0"
            if (player.storage.shixiangquanneng.length) {
                player.removeSkills(player.storage.shixiangquanneng[0]);

            }
            player.storage.shixiangquanneng = [];
            "step 1"
            event.skills = ["junfu", "fangkong2", "hangmucv"]
            player
                .chooseControl(event.skills)
                .set("prompt", "请选择要获得的技能")
                .set("ai", function () {
                    return event.skills.randomGet();
                });
            "step 2"
            player.addTempSkills(result.control, { player: "dieAfter" });
            player.storage.shixiangquanneng = [result.control];
        },
        "_priority": 0,
    },
    zhongleizhuangjiantuxi: {
        nobracket: true,
        audio: "ext:舰R牌将/audio/skill:true",
        skillAnimation: true,
        animationColor: "wood",
        limited: true,
        unique: true,
        trigger: {
            player: "phaseZhunbeiBegin",
        },
        filter(event, player) {
            return player.hp <= 1 && !player.storage.zhongleizhuangjiantuxi;
        },
        content() {
            "step 0"
            player.awakenSkill(event.name);
            player.addSkill("zhongleizhuangjiantuxi_count");
            player
                .chooseTarget(get.prompt("zhongleizhuangjiantuxi"), "对一名其他角色视为使用三张雷杀", function (card, player, target) {
                    return target != player;
                })
                .set("ai", function (target) {
                    var player = get.player();
                    return get.damageEffect(target, player, player, "thunder") * (target.hp == 1 ? 2 : 1);
                });
            "step 1"
            if (result.bool) {
                var target = result.targets[0];
                for (var i = 0; i < 3; i++) {
                    player.useCard({ name: "sha", nature: "thunder", isCard: true }, target);
                }
            } else event.finish();
            "step 2"
            var list = player.getStorage("zhongleizhuangjiantuxi_count").filter(function (target) {
                return 1;
            });
            //game.log(list);
            if (list.length) {
                player.removeSkill("zhongleizhuangjiantuxi_count");
                event.finish();
            } else {
                player.discard(player.getCards("he"));
                player.removeSkill("zhongleizhuangjiantuxi_count");
            }
        },
        ai: {
            threaten(player, target) {
                if (target.hp == 1) return 1.1;
                return 0.5;
            },
            maixie: true,
            effect: {
                target(card, player, target) {
                    if (!target.hasFriend()) return;
                    if (target.hp === 2 && get.tag(card, "damage") == 1 && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) return [0.5, 1];
                    if (target.hp === 1 && get.tag(card, "recover") && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) return [1, -3];
                },
            },
        },
        "_priority": 0,
        subSkill: {
            count: {
                sub: true,
                trigger: {
                    global: "dyingBegin",
                },
                silent: true,
                charlotte: true,
                filter: function (event, player) {
                    return event.getParent("zhongleizhuangjiantuxi").player == player;
                },
                content: function () {
                    player.markAuto("zhongleizhuangjiantuxi_count", [trigger.player]);
                },
            },
        },
    },
};
export { shiptypeskills };