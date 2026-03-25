import { lib, game, ui, get, ai, _status } from '../../../noname.js';
const cangqinghuanying = {
 shuqinzhiyin: {
             nobracket: true,
             audio: "ext:舰R牌将/audio/skill:true",
             round: 1,
             trigger: {
                 global: ["useSkillAfter", "logSkill"],
             },
             filter: function (event, player) {
                 return event.type == "player" && event.player != player && player.countCards("h") >= 2;
             },
             check(event, player) {
                 return true;
             },
             direct: true,
             content() {
                 "step 0";
                 player.chooseTarget(get.prompt2("shuqinzhiyin"), function (card, player, target) {
                     return target != player;
                 })
                     .set("ai", function (target) {
                         var player = get.player();
                         var skills = target.getOriginalSkills();
                         var list = [];
                         for (var i = 0; i < skills.length; i++) {
                             var skillKey = skills[i];
                             if (!skillKey || typeof skillKey !== "string") {
                                 continue;
                             }
                             var info = get.info(skills[i]);
                             if (!info || typeof info !== "object") {
                                 continue;
                             }
                             if (typeof info.usable == "number") {
                                 if (target.hasSkill("counttrigger") && target.storage.counttrigger[skills[i]] && target.storage.counttrigger[skills[i]] >= 1) {
                                     list.push(skills[i]);
                                 }
                                 if (typeof get.skillCount(skills[i]) == "number" && get.skillCount(skills[i]) >= 1) {
                                     list.push(skills[i]);
                                 }
                             }
                             if (info.round && target.storage[skills[i] + "_roundcount"]) {
                                 list.push(skills[i]);
                             }
                             if (target.storage[`temp_ban_${skills[i]}`]) {
                                 list.push(skills[i]);
                             }
                             if (target.awakenedSkills.includes(skills[i])) {
                                 list.push(skills[i]);
                             }
                         }
                         //game.log(list);
                         if (target.isDamaged() || list.length >= 1) {
                             return get.attitude(player, target);
                         }
                         return 0;
                     });
 
                 "step 1";
                 if (result.bool) {
                     event.targets0 = result.targets[0];
                     player
                         .chooseToDiscard(2, "hes", get.prompt("shuqinzhiyin"))
                         .set("target", event.targets0)
                         .set("ai", function (card) {
                             var target = event.targets0;
                             if (target.isDamaged() && target.hp < 3) return 9 - get.value(card);
                             var skills = target.getOriginalSkills();
                             for (var i = 0; i < skills.length; i++) {
                                 var skillKey = skills[i];
                                 if (!skillKey || typeof skillKey !== "string") {
                                     continue;
                                 }
                                 var info = get.info(skills[i]);
                                 if (!info || typeof info !== "object") {
                                     continue;
                                 }
                                 if (typeof info.usable == "number") {
                                     if (target.hasSkill("counttrigger") && target.storage.counttrigger[skills[i]] && target.storage.counttrigger[skills[i]] >= 1 && !target.isDamaged()) {
                                         return 5 - get.value(card);
                                     }
                                     if (typeof get.skillCount(skills[i]) == "number" && get.skillCount(skills[i]) >= 1 && !target.isDamaged()) {
                                         return 5 - get.value(card);
                                     }
                                 }
                                 if (info.round && target.storage[skills[i] + "_roundcount"]) {
                                     return 7.5 - get.value(card);
                                 }
                                 if (target.storage[`temp_ban_${skills[i]}`]) {
                                     return 7 - get.value(card);
                                 }
                                 if (target.awakenedSkills.includes(skills[i])) {
                                     return 9 - get.value(card);
                                 }
                             }
                             return 7 - get.value(card);
                         });
                 }
                 "step 2";
                 if (result.bool) {
                     player.logSkill("shuqinzhiyin");
                     var skills = event.targets0.getStockSkills(true, true);
                     game.expandSkills(skills);
                     //game.log(skills);
                     var resetSkills = [];
                     var suffixs = ["used", "round", "block", "blocker"];
                     for (var skill of skills) {
                         //game.log(skill);
                         var skillKey = skill;
                         if (!skillKey || typeof skillKey !== "string") {
                             continue;
                         }
                         var info = get.info(skill);
                         if (!info || typeof info !== "object") {
                             continue;
                         }
                         if (typeof info.usable == "number") {
                             if (event.targets0.hasSkill("counttrigger") && event.targets0.storage.counttrigger[skill] && event.targets0.storage.counttrigger[skill] >= 1) {
                                 delete event.targets0.storage.counttrigger[skill];
                                 resetSkills.add(skill);
                             }
                             if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
                                 delete event.targets0.getStat("skill")[skill];
                                 resetSkills.add(skill);
                             }
                         }
                         if (info.round && event.targets0.storage[skill + "_roundcount"]) {
                             delete event.targets0.storage[skill + "_roundcount"];
                             resetSkills.add(skill);
                         }
                         if (event.targets0.storage[`temp_ban_${skill}`]) {
                             delete event.targets0.storage[`temp_ban_${skill}`];
                         }
                         if (event.targets0.awakenedSkills.includes(skill)) {
                             event.targets0.restoreSkill(skill);
                             resetSkills.add(skill);
                         }
                         for (var suffix of suffixs) {
                             if (event.targets0.hasSkill(skill + "_" + suffix)) {
                                 event.targets0.removeSkill(skill + "_" + suffix);
                                 resetSkills.add(skill);
                             }
                         }
                     }
                     if (resetSkills.length) {
                         var str = "";
                         for (var i of resetSkills) {
                             str += "【" + get.translation(i) + "】、";
                         }
                         game.log(event.targets0, "重置了技能", "#g" + str.slice(0, -1));
                     }
                     if (event.targets0.isDamaged()) {
                         event.targets0.recover(1);
                     }
                 } else {
                     delete player.storage["shuqinzhiyin_roundcount"];
                 }
             },
             "_priority": 0,
 
 
         },
         yixinyiyi: {
             nobracket: true,
             audio: "ext:舰R牌将/audio/skill:true",
             enable: ["chooseToRespond", "chooseToUse"],
             usable: function (event, player) {
                 if (game.zhu) return game.zhu.getDamagedHp();
                 return 0;
             },
             mod: {
                 cardUsable: function (card) {
                     if (card.storage && card.storage.yixinyiyi) return Infinity;
                 },
                 /* targetInRange(card, player, target, now) {
                     var check2 = game.countPlayer(function (current) {
                         let zhu = false;
                         switch (get.mode()) {
                             case "identity": {
                                 zhu = current.isZhu;
                                 break;
                             }
                             case "guozhan": {
                                 zhu = get.is.jun(current);
                                 break;
                             }
                             case "versus": {
                                 zhu = current.identity == "zhu";
                                 break;
                             }
                             case "doudizhu": {
                                 zhu = current == game.zhu;
                                 break;
                             }
                         }
                         return zhu && current.getDamagedHp() >= 1;
                     });
                     if (card.storage && card.storage.yixinyiyi && check2) return true;
                 }, */
             },
             filterCard(card) {
                 return true;
             },
             position: "h",
             viewAs: {
                 name: "sha",
                 nature: "thunder",
                 storage: {
                     yixinyiyi: true,
                 },
             },
             viewAsFilter(player) {
                 if (!player.countCards('h')) return false;
                 var zhunbei_damaged = game.filterPlayer(function (current) {
                     let zhu = false;
                     switch (get.mode()) {
                         case "identity": {
                             zhu = current.isZhu;
                             break;
                         }
                         case "guozhan": {
                             zhu = get.is.jun(current);
                             break;
                         }
                         case "versus": {
                             zhu = current.identity == "zhu";
                             break;
                         }
                         case "doudizhu": {
                             zhu = current == game.zhu;
                             break;
                         }
                     }
                     return zhu && current.getDamagedHp();
                 });
                 var num = player.getHistory("useSkill", function (evt) {
                     return evt.skill == "yixinyiyi";
                 }).length;
                 for (var i = 0; i < zhunbei_damaged.length; i++) {
                     if (num < zhunbei_damaged[i].getDamagedHp()) return true;
                 }
                 return false;
             },
             prompt: "将一张手牌当雷杀使用",
             check(card) { return 4 - get.value(card) },
             ai: {
                 threaten(player, target) {
                     let zhu = false;
                     switch (get.mode()) {
                         case "identity": {
                             zhu = target.isZhu;
                             break;
                         }
                         case "guozhan": {
                             zhu = get.is.jun(target);
                             break;
                         }
                         case "versus": {
                             zhu = target.identity == "zhu";
                             break;
                         }
                         case "doudizhu": {
                             zhu = target == game.zhu;
                             break;
                         }
                     }
                     if (zhu) {
                         if (target.maxHp - target.hp < 2) { return 0.5; }
                         return 3;
                     }
                     return 2;
                 },
                 yingbian: function (card, player, targets, viewer) {
                     if (get.attitude(viewer, player) <= 0) return 0;
                     var base = 0, hit = false;
                     if (get.cardtag(card, 'yingbian_hit')) {
                         hit = true;
                         if (targets.some(target => {
                             return target.mayHaveShan(viewer, 'use', target.getCards('h', i => {
                                 return i.hasGaintag('sha_notshan');
                             })) && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
                         })) base += 5;
                     }
                     if (get.cardtag(card, 'yingbian_add')) {
                         if (game.hasPlayer(function (current) {
                             return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0;
                         })) base += 5;
                     }
                     if (get.cardtag(card, 'yingbian_damage')) {
                         if (targets.some(target => {
                             return get.attitude(player, target) < 0 && (hit || !target.mayHaveShan(viewer, 'use', target.getCards('h', i => {
                                 return i.hasGaintag('sha_notshan');
                             })) || player.hasSkillTag('directHit_ai', true, {
                                 target: target,
                                 card: card,
                             }, true)) && !target.hasSkillTag('filterDamage', null, {
                                 player: player,
                                 card: card,
                                 jiu: true,
                             })
                         })) base += 5;
                     }
                     return base;
                 },
                 canLink: function (player, target, card) {
                     if (!target.isLinked() && !player.hasSkill('wutiesuolian_skill')) return false;
                     if (player.hasSkill('jueqing') || player.hasSkill('gangzhi') || target.hasSkill('gangzhi')) return false;
                     return true;
                 },
                 basic: {
                     useful: [5, 3, 1],
                     value: [5, 3, 1],
                 },
                 order: function (item, player) {
                     if (player.hasSkillTag('presha', true, null, true)) return 10;
                     if (typeof item === 'object' && game.hasNature(item, 'linked')) {
                         if (game.hasPlayer(function (current) {
                             return current != player && lib.card.sha.ai.canLink(player, current, item) && player.canUse(item, current, null, true) && get.effect(current, item, player, player) > 0;
                         }) && game.countPlayer(function (current) {
                             return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
                         }) > 1) return 3.1;
                         return 3;
                     }
                     return 3.05;
                 },
                 result: {
                     target: function (player, target, card, isLink) {
                         let eff = -1.5, odds = 1.35, num = 1;
                         if (isLink) {
                             let cache = _status.event.getTempCache('sha_result', 'eff');
                             if (typeof cache !== 'object' || cache.card !== get.translation(card)) return eff;
                             if (cache.odds < 1.35 && cache.bool) return 1.35 * cache.eff;
                             return cache.odds * cache.eff;
                         }
                         if (player.hasSkill('jiu') || player.hasSkillTag('damageBonus', true, {
                             target: target,
                             card: card
                         })) {
                             if (target.hasSkillTag('filterDamage', null, {
                                 player: player,
                                 card: card,
                                 jiu: true,
                             })) eff = -0.5;
                             else {
                                 num = 2;
                                 if (get.attitude(player, target) > 0) eff = -7;
                                 else eff = -4;
                             }
                         }
                         if (!player.hasSkillTag('directHit_ai', true, {
                             target: target,
                             card: card,
                         }, true)) odds -= 0.7 * target.mayHaveShan(player, 'use', target.getCards('h', i => {
                             return i.hasGaintag('sha_notshan');
                         }), 'odds');
                         _status.event.putTempCache('sha_result', 'eff', {
                             bool: target.hp > num && get.attitude(player, target) > 0,
                             card: get.translation(card),
                             eff: eff,
                             odds: odds
                         });
                         return odds * eff;
                     },
                 },
                 tag: {
                     respond: 1,
                     respondShan: 1,
                     damage: function (card) {
                         if (game.hasNature(card, 'poison')) return;
                         return 1;
                     },
                     natureDamage: function (card) {
                         if (game.hasNature(card, 'linked')) return 1;
                     },
                     fireDamage: function (card, nature) {
                         if (game.hasNature(card, 'fire')) return 1;
                     },
                     thunderDamage: function (card, nature) {
                         if (game.hasNature(card, 'thunder')) return 1;
                     },
                     poisonDamage: function (card, nature) {
                         if (game.hasNature(card, 'poison')) return 1;
                     },
                 },
             },
             //group: ["yixinyiyi_damage"],
             subSkill: {
                 damage: {
                     trigger: { player: "useCard" },
                     filter: function (event, player) {
                         var check3 = game.countPlayer(function (current) {
                             let zhu = false;
                             switch (get.mode()) {
                                 case "identity": {
                                     zhu = current.isZhu;
                                     break;
                                 }
                                 case "guozhan": {
                                     zhu = get.is.jun(current);
                                     break;
                                 }
                                 case "versus": {
                                     zhu = current.identity == "zhu";
                                     break;
                                 }
                                 case "doudizhu": {
                                     zhu = current == game.zhu;
                                     break;
                                 }
                             }
                             return zhu && current.getDamagedHp() >= 3;
                         });
                         return get.name(event.card, false) == 'sha' && event.card.storage && event.card.storage.yixinyiyi && check3;
                     },
                     forced: true,
                     silent: true,
                     popup: false,
                     content: function () {
                         if (!trigger.baseDamage) trigger.baseDamage = 1;
                         trigger.baseDamage += 1;
                         game.log(trigger.card, '的伤害值', '#y+' + 1);
                     },
                 },
             },
         },
         buxiuzhanshi: {
             nobracket: true,
             audio: "ext:舰R牌将/audio/skill:true",
             usable: 1,
             enable: "phaseUse",
             init: function (player) {
                 if (typeof player.storage.buxiuzhanshi === 'undefined') player.storage.buxiuzhanshi = 0;
             },
             filter: function (event, player) {
                 return player.countCards("h") > 0;
             },
             filterCard: true,
             filterTarget: function (card, player, target) {
                 return player != target && player.canUse("juedou", target, false);
             },
             selectCard: [1, Infinity],
             selectTarget: [1, Infinity],
             position: "h",
             filterOk: function () {
                 return ui.selected.cards.length == ui.selected.targets.length;
             },
             check: function (card) {
                 var player = get.player();
                 if (ui.selected.cards.length >= game.countPlayer(current => {
                     return current != player && get.attitude(player, current) <= 0;
                 })) return 0;
                 if (card.name == "sha" || card.name == "sheji9") {
                     return player.countCards("h", function (card) { return card.name == "sha" || card.name == "sheji9"; }) - ui.selected.cards.length;
                 }
                 return 7 - get.value(card);
             },
             prompt: "弃置任意张手牌并视为对等量角色使用决斗",
             complexSelect: true,
             multitarget: true,
             multiline: true,
             delay: false,
             contentBefore: function () {
                 event.getParent()._buxiuzhanshi_targets = targets.slice();
             },
             content: function () {
                 "step 0"
                 var targets = event.getParent()._buxiuzhanshi_targets;
                 var card = {
                     name: "juedou",
                     isCard: true,
                 };
                 player.useCard(card, targets, false);
                 /* for (var i = 0; i < targets.length; i++) {
                     var target = targets[i];
                     var card = {
                         name: "juedou",
                         isCard: true,
                     };
                     if (player.canUse(card, target, false)) {
                         player.useCard(card, target, false);
                     }
                 }  */
                 "step 1"
                 player.getHistory('sourceDamage', function (evt) {
                     var player = get.player();
                     //game.log("不朽战士" + evt.getParent("buxiuzhanshi").name + get.translation(evt.player) + get.translation(player));
                     if (evt.getParent("buxiuzhanshi").name == "buxiuzhanshi") {
                         player.addMark("buxiuzhanshi", 1);
                         return 1;
                     }
                     return 0;
                 });
             },
             ai: {
                 order: function () {
                     return get.order({ name: 'juedou' }) - 0.5;
                 },
                 wuxie: function (target, card, player, viewer, status) {
                     if (player === game.me && get.attitude(viewer, player._trueMe || player) > 0) return 0;
                     if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) return 0;
                 },
                 basic: {
                     order: 5,
                     useful: 1,
                     value: 5.5,
                 },
                 result: {
                     target: function (player, target, card) {
                         if (
                             player.hasSkillTag(
                                 "directHit_ai",
                                 true,
                                 {
                                     target: target,
                                     card: card,
                                 },
                                 true
                             )
                         )
                             return -2;
                         let td = get.damageEffect(target, player, target);
                         if (td >= 0) return td / get.attitude(target, target);
                         let pd = get.damageEffect(player, target, player),
                             att = get.attitude(player, target);
                         if (att > 0 && get.damageEffect(target, player, player) > pd) return -2;
                         let ts = target.mayHaveSha(player, "respond", null, "count"),
                             ps = player.mayHaveSha(
                                 player,
                                 "respond",
                                 player.getCards("h", (i) => {
                                     return (
                                         card === i ||
                                         (card.cards && card.cards.includes(i)) ||
                                         ui.selected.cards.includes(i)
                                     );
                                 }),
                                 "count"
                             );
                         if (ts < 1) return -1.5;
                         if (att > 0) return -2;
                         if (ts - ps < 1) return -2 - ts;
                         if (pd >= 0) return -1;
                         return -ts;
                     },
                     player: function (player, target, card) {
                         if (player.hasSkillTag('directHit_ai', true, {
                             target: target,
                             card: card,
                         }, true)) {
                             return 0;
                         }
                         if (get.damageEffect(target, player, target) > 0 && get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
                             return 0;
                         }
                         var hs1 = target.getCards('h', 'sha');
                         var hs2 = player.getCards('h', 'sha');
                         if (hs1.length > hs2.length + 1) {
                             return -2;
                         }
                         var hsx = target.getCards('h');
                         if (hsx.length > 2 && hs2.length == 0 && hsx[0].number < 6) {
                             return -2;
                         }
                         if (hsx.length > 3 && hs2.length == 0) {
                             return -2;
                         }
                         if (hs1.length > hs2.length && (!hs2.length || hs1[0].number > hs2[0].number)) {
                             return -2;
                         }
                         return -0.5;
                     },
                 },
                 tag: {
                     respond: 2,
                     respondSha: 2,
                     damage: 1,
                 },
             },
             mark: true,
             intro: {
                 name: "不朽战士",
                 content: function (storage, player) {
                     var str = "下回合摸牌增加" + get.translation(player.getStorage("buxiuzhanshi"));
                     return str;
                 },
             },
             group: ["buxiuzhanshi_draw"],
             subSkill: {
                 draw: {
                     trigger: {
                         player: "phaseDrawBegin2",
                     },
                     frequent: true,
                     filter(event, player) {
                         return !event.numFixed && player.countMark("buxiuzhanshi") > 0;
                     },
                     async content(event, trigger, player) {
                         var drawNum = player.countMark("buxiuzhanshi");
                         trigger.num += drawNum;
                         player.removeMark("buxiuzhanshi", drawNum);
                     },
                     ai: {
                         threaten: 1.3,
                     },
                 },
             },
         },
};

export { cangqinghuanying };