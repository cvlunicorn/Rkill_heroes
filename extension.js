game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"1舰R牌将",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "u1405":["female","wu",1,["远航","潜艇","鱼(雷)攻击","袭击运输船","baiyin_skill","new_retuxi","开局摸锦囊","仁德界改","先制潜艇攻击","olniepan","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:无需隐匿的偷袭大师，马上就让对手的后勤捉襟见肘。"]],
            haiwangxing:["female","wu",2,["远航","轻巡洋舰","bagua_skill","鱼(雷)攻击","防空","biyue","zhangba_skill","qingnang","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:阻敌计谋表现优秀，这是先发制敌的优势所在，"]],
            liekexingdun:["female","shu",4,["航母","远航","zhangba_skill","回复出杀上限","制空权","先制航空攻击","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["zhu","des:血量中等的航母，温柔，体贴，过渡期追着大船打的航母。"]],
            chicheng:["female","wei",4,["航母","远航","zhangba_skill","回复出杀上限","制空权","先制航空攻击","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
            bisimai:["female","wei",5,["远航","战列舰","guanshi_skill","装甲防护","重炮","回复出杀上限","穿甲弹","lingxue","额外回合","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["zhu","des:更多刮痧，更多力量，更多护甲，更高血量。"]],
            lizhan:["female","wei",4,["重巡洋舰","远航","装甲防护","重炮","高爆弹","回复出杀上限","额外回合","guanshi_skill","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:这是个依赖科技的舰船，有着科幻的舰装，与兼备温柔体贴与意气风发的表现。"]],
            xuefeng:["female","shu",2,["远航","驱逐舰","rw_bagua_skill","hongyuan","olfengji","仁德界改","鱼(雷)攻击","retieji","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:幸运的驱逐舰，多位画师、花了大款的大佬亲情奉献。"]],
            addskilltest:["male","wei",9,["远航","军辅船"],["forbidai","des:测试用"]],
            kunxi:["female","wu",4,["重巡洋舰","远航","装甲防护","重炮","高爆弹","回复出杀上限","额外回合","guanshi_skill","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:画师优秀的功底让这名角色美而可爱，这是出色的角色塑造。"]],
            misuli:["female","shu",5,["远航","战列舰","guanshi_skill","装甲防护","重炮","回复出杀上限","穿甲弹","lingxue","额外回合","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:用精巧的手枪去质疑，用绝对的火力回击对手。"]],
            yixian:["female","wu",2,["远航","轻巡洋舰","bagua_skill","鱼(雷)攻击","防空","biyue","zhangba_skill","qingnang","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:经典美术设计的款式，意气风发，威猛先生"]],
            "z31":["female","wu",2,["远航","驱逐舰","rw_bagua_skill","hongyuan","olfengji","仁德界改","鱼(雷)攻击","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","retieji","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:婚纱与轻纱是多数人的美梦,与绿草平原，与绿水青山"]],
            ougengqi:["female","shu",4,["重巡洋舰","远航","装甲防护","重炮","高爆弹","回复出杀上限","额外回合","guanshi_skill","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:励志偶像，与标志性舰装，可惜没有适合的图与技能用于无名杀"]],
            kangfusi:["female","wei",2,["远航","retieji","驱逐舰","rw_bagua_skill","hongyuan","olfengji","仁德界改","鱼(雷)攻击","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:水手服欸，不过图少改造晚，得看莲k画师发力了。"]],
            rending:["female","wei",2,["远航","轻巡洋舰","bagua_skill","鱼(雷)攻击","防空","biyue","zhangba_skill","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:手持竹伞的轻巡，辅助队友，防御攻击。"]],
            jingjishen:["female","shu",3,["军辅船","远航","屯粮油","yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],["des:需要武器支援，伙计倒下了。"]],
        },
        translate:{
            "u1405":"u1405",
            haiwangxing:"海王星轻巡",
            liekexingdun:"列克星敦",
            chicheng:"赤城航母",
            bisimai:"俾斯麦&北宅",
            lizhan:"历战重巡",
            xuefeng:"雪风驱逐",
            addskilltest:"addskilltest",
            kunxi:"昆西重巡",
            misuli:"密苏里战列",
            yixian:"逸仙轻巡",
            "z31":"z31驱逐",
            ougengqi:"欧根重巡",
            kangfusi:"康弗斯驱逐",
            rending:"仁淀轻巡",
            jingjishen:"竞技神",
        },
    },
    card:{
        card:{
            "幸运":{
                derivation:"majun",
                type:"equip",
                subtype:"equip3",
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["rw_bagua_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:false,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:false,
                fullimage:true,
            },
            "炮火准备":{
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-2,
                },
                ai:{
                    basic:{
                        equipValue:2,
                        order:function(card,player){if(player.hp>2)return true
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 6.5-get.equipValue(card,player)/20;
                }
                else{
                    return 4+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["炮火准备1","高爆弹"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:false,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullskin:true,
            },
            "航空战":{
                type:"equip",
                subtype:"equip4",
                ai:{
                    basic:{
                        equipValue:7.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                skills:["先制航空攻击"],
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "攻击":{
                audio:true,
                nature:["thunder","fire","kami","ice"],
                type:"basic",
                enable:true,
                usable:1,
                updateUsable:"phaseUse",
                range:function(card,player,target){
        return player.inRange(target);
    },
                selectTarget:3,
                cardPrompt:function(card){
        if(card.nature=='stab') return '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，且在此之后需弃置一张手牌（没有则不弃）。否则你对其造成1点伤害。';
        if(lib.linked.contains(card.nature)) return '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点'+get.translation(card.nature)+'属性伤害。';
        return '出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害。';
    },
                "yingbian_prompt":function(card){
        var str='';
        if(get.cardtag(card,'yingbian_hit')){
            str+='此牌不可被响应';
        }
        if(get.cardtag(card,'yingbian_damage')){
            if(str.length) str+='；';
            str+='此牌的伤害值基数+1';
        }
        if(!str.length||get.cardtag(card,'yingbian_add')){
            if(str.length) str+='；';
            str+='当你使用此牌选择目标后，你可为此牌增加一个目标';
        }
        return str;
    },
                yingbian:function(event){
        var card=event.card,bool=false;
        if(get.cardtag(card,'yingbian_hit')){
            bool=true;
            event.directHit.addArray(game.players);
            game.log(card,'不可被响应');
        }
        if(get.cardtag(card,'yingbian_damage')){
            bool=true;
            if(typeof event.baseDamage!='number') event.baseDamage=1;
            event.baseDamage++;
            game.log(event.card,'的伤害值基数+1');
        }
        if(!bool||get.cardtag(card,'yingbian_add')){
            event.yingbian_addTarget=true;
        }
    },
                "yingbian_tags":["hit","damage","add"],
                filterTarget:function(card,player,target){return player!=target},
                content:function(){
        "step 0"
        if(typeof event.shanRequired!='number'||!event.shanRequired||event.shanRequired<0){
            event.shanRequired=1;
        }
        if(typeof event.baseDamage!='number') event.baseDamage=1;
        if(typeof event.extraDamage!='number') event.extraDamage=0;
        "step 1"
        if(event.directHit||event.directHit2||(!_status.connectMode&&lib.config.skip_shan&&!target.hasShan())){
            event._result={bool:false};
        }
        else if(event.skipShan){
            event._result={bool:true,result:'shaned'};
        }
        else{
            var next=target.chooseToUse('请使用一张闪响应杀');
            next.set('type','respondShan');
            next.set('filterCard',function(card,player){
                if(get.name(card)!='shan') return false;
                return lib.filter.cardEnabled(card,player,'forceEnable');
            });
            if(event.shanRequired>1){
                next.set('prompt2','（共需使用'+event.shanRequired+'张闪）');
            }
            else if(event.card.nature=='stab'){
                next.set('prompt2','（在此之后仍需弃置一张手牌）');
            }
            next.set('ai1',function(card){
                var target=_status.event.player;
                var evt=_status.event.getParent();
                var bool=true;
                if(_status.event.shanRequired>1&&!get.is.object(card)&&target.countCards('h','shan')<_status.event.shanRequired){
                    bool=false;
                }
                else if(target.hasSkillTag('useShan')){
                    bool=true;
                }
                else if(target.hasSkillTag('noShan')){
                    bool=false;
                }
                else if(get.damageEffect(target,evt.player,target,evt.card.nature)>=0) bool=false;
                if(bool){
                    return get.order(card);
                }
                return 0;
            }).set('shanRequired',event.shanRequired);
            next.set('respondTo',[player,card]);
            //next.autochoose=lib.filter.autoRespondShan;
        }
        "step 2"
        if(!result||!result.bool||!result.result||result.result!='shaned'){
            event.trigger('shaHit');
        }
        else{
            event.shanRequired--;
            if(event.shanRequired>0){
                event.goto(1);
            }
            else if(event.card.nature=='stab'&&target.countCards('h')>0){
                event.responded=result;
                event.goto(4);
            }
            else{
                event.trigger('shaMiss');
                event.responded=result;
            }
        }
        "step 3"
        if((!result||!result.bool||!result.result||result.result!='shaned')&&!event.unhurt){
            target.damage(get.nature(event.card),event.baseDamage+event.extraDamage);
            event.result={bool:true}
            event.trigger('shaDamage');
        }
        else{
            event.result={bool:false}
            event.trigger('shaUnhirt');
        }
        event.finish();
        "step 4"
        target.chooseToDiscard('刺杀：请弃置一张牌，否则此【杀】依然造成伤害').set('ai',function(card){
            var target=_status.event.player;
            var evt=_status.event.getParent();
            var bool=true;
            if(get.damageEffect(target,evt.player,target,evt.card.nature)>=0) bool=false;
            if(bool){
                return 8-get.useful(card);
            }
            return 0;
        });
        "step 5"
        if((!result||!result.bool)&&!event.unhurt){
            target.damage(get.nature(event.card),event.baseDamage+event.extraDamage);
            event.result={bool:true}
            event.trigger('shaDamage');
            event.finish();
        }
        else{
            event.trigger('shaMiss');
        }
        "step 6"
        if((!result||!result.bool)&&!event.unhurt){
            target.damage(get.nature(event.card),event.baseDamage+event.extraDamage);
            event.result={bool:true}
            event.trigger('shaDamage');
            event.finish();
        }
        else{
            event.result={bool:false}
            event.trigger('shaUnhirt');
        }
    },
                ai:{
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            var base=0,hit=false;
            if(get.cardtag(card,'yingbian_hit')){
                hit=true;
                if(targets.filter(function(target){
                    return target.hasShan()&&get.attitude(viewer,target)<0&&get.damageEffect(target,player,viewer,get.nature(card))>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_all')){
                if(game.hasPlayer(function(current){
                    return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
                })) base+=5;
            }
            if(get.cardtag(card,'yingbian_damage')){
                if(targets.filter(function(target){
                    return get.attitude(player,target)<0&&(hit||!target.mayHaveShan()||player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                    },true))&&!target.hasSkillTag('filterDamage',null,{
                        player:player,
                        card:card,
                        jiu:true,
                    })
                })) base+=5;
            }
            return base;
        },
                    canLink:function(player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||player.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,3,1],
                        value:[5,3,1],
                    },
                    order:function(item,player){
            if(player.hasSkillTag('presha',true,null,true)) return 10;
            if(lib.linked.contains(get.nature(item))){
                if(game.hasPlayer(function(current){
                    return current!=player&&current.isLinked()&&player.canUse(item,current,null,true)&&get.effect(current,item,player,player)>0&&lib.card.sha.ai.canLink(player,current,item);
                })&&game.countPlayer(function(current){
                    return current.isLinked()&&get.damageEffect(current,player,player,get.nature(item))>0;
                })>1) return 3.1;
                return 3;
            }
            return 3.05;
        },
                    result:{
                        target:function(player,target,card,isLink){
                var eff=function(){
                    if(!isLink&&player.hasSkill('jiu')){
                        if(!target.hasSkillTag('filterDamage',null,{
                            player:player,
                            card:card,
                            jiu:true,
                        })){
                            if(get.attitude(player,target)>0){
                                return -7;
                            }
                            else{
                                return -4;
                            }
                        }
                        return -0.5;
                    }
                    return -1.5;
                }();
                if(!isLink&&target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                    target:target,
                    card:card,
                },true)) return eff/1.2;
                return eff;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:function(card){
                if(card.nature=='poison') return;
                return 1;
            },
                        natureDamage:function(card){
                if(card.nature) return 1;
            },
                        fireDamage:function(card,nature){
                if(card.nature=='fire') return 1;
            },
                        thunderDamage:function(card,nature){
                if(card.nature=='thunder') return 1;
            },
                        poisonDamage:function(card,nature){
                if(card.nature=='poison') return 1;
            },
                    },
                },
                fullimage:true,
            },
            "民族乐器":{
                audio:true,
                mode:["guozhan"],
                type:"equip",
                subtype:"equip5",
                distance:{
                    attackFrom:-1,
                },
                nomod:true,
                nopower:true,
                unique:true,
                global:"g_dinglanyemingzhu_ai",
                skills:["dinglanyemingzhu_skill"],
                ai:{
                    equipValue:function(card,player){
            if(player.hasSkill('jubao')) return 8;
            if(player.hasSkill('gzzhiheng')) return 6;
            if(game.hasPlayer(function(current){
                return current.hasSkill('jubao')&&get.attitude(player,current)<=0;
            })){
                return 0;
            }
            return 7;
        },
                    basic:{
                        equipValue:6.5,
                        order:function(card,player){
                if(player&&player.hasSkillTag('reverseEquip')){
                    return 8.5-get.equipValue(card,player)/20;
                }
                else{
                    return 8+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.isDisabled(get.subtype(card))) return 0.01;
                var value=0;
                var info=get.info(card);
                var current=player.getEquip(info.subtype);
                if(current&&card!=current){
                    value=get.value(current,player);
                }
                var equipValue=info.ai.equipValue;
                if(equipValue==undefined){
                    equipValue=info.ai.basic.equipValue;
                }
                if(typeof equipValue=='function'){
                    if(method=='raw') return equipValue(card,player);
                    if(method=='raw2') return equipValue(card,player)-value;
                    return Math.max(0.1,equipValue(card,player)-value);
                }
                if(typeof equipValue!='number') equipValue=0;
                if(method=='raw') return equipValue;
                if(method=='raw2') return equipValue-value;
                return Math.max(0.1,equipValue-value);
            },
                    },
                    result:{
                        target:function(player,target,card){
                return get.equipResult(player,target,card.name);
            },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function(){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullimage:true,
            },
            "架空历史":{
                audio:true,
                type:"trick",
                enable:true,
                cardcolor:"red",
                selectTarget:-1,
                filterTarget:true,
                contentBefore:function(){
        "step 0"
        if(!targets.length){
            event.finish();
            return;
        }
        if(get.is.versus()){
            player.chooseControl('顺时针','逆时针',function(event,player){
                if(player.next.side==player.side) return '逆时针';
                return '顺时针';
            }).set('prompt','选择'+get.translation(card)+'的结算方向');
        }
        else{
            event.goto(2);
        }
        "step 1"
        if(result&&result.control=='顺时针'){
            var evt=event.getParent(),sorter=(_status.currentPhase||player);
            evt.fixedSeat=true;
            evt.targets.sortBySeat(sorter);
            evt.targets.reverse();
            if(evt.targets[evt.targets.length-1]==sorter){
                evt.targets.unshift(evt.targets.pop());
            }
        }
        "step 2"
        ui.clear();
        var num;
        if(event.targets){
            num=event.targets.length*2;
        }
        else{
            num=game.countPlayer()*2;
        }
        var cards=get.cards(num);
        game.cardsGotoOrdering(cards).relatedEvent=event.getParent();
        var dialog=ui.create.dialog('五谷丰登',cards,true);
        _status.dieClose.push(dialog);
        dialog.videoId=lib.status.videoId++;
        game.addVideo('cardDialog',null,['五谷丰登',get.cardsInfo(cards),dialog.videoId]);
        event.getParent().preResult=dialog.videoId;
        game.broadcast(function(cards,id){
            var dialog=ui.create.dialog('五谷丰登',cards,true);
            _status.dieClose.push(dialog);
            dialog.videoId=id;
        },cards,dialog.videoId);
        game.log(event.card,'亮出了',cards);
    },
                content:function(){
        "step 0"
        for(var i=0;i<ui.dialogs.length;i++){
            if(ui.dialogs[i].videoId==event.preResult){
                event.dialog=ui.dialogs[i];break;
            }
        }
        if(!event.dialog){
            event.finish();
            return;
        }
        if(event.dialog.buttons.length>1){
            var next=target.chooseButton(true,function(button){
                return get.value(button.link,_status.event.player);
            });
            next.set('dialog',event.preResult);
            next.set('closeDialog',false);
            next.set('dialogdisplay',true);
        }
        else{
            event.directButton=event.dialog.buttons[0];
        }
        "step 1"
        var dialog=event.dialog;
        var card;
        if(event.directButton){
            card=event.directButton.link;
        }
        else{
            for(var i of dialog.buttons){
                if(i.link==result.links[0]){
                    card=i.link;
                    break;
                }
            }
            if(!card) card=event.dialog.buttons[0].link;
        }

        var button;
        for(var i=0;i<dialog.buttons.length;i++){
            if(dialog.buttons[i].link==card){
                button=dialog.buttons[i];
                button.querySelector('.info').innerHTML=function(target){
                    if(target._tempTranslate) return target._tempTranslate;
                    var name=target.name;
                    if(lib.translate[name+'_ab']) return lib.translate[name+'_ab'];
                    return get.translation(name);
                }(target);
                dialog.buttons.remove(button);
                break;
            }
        }
        var capt=get.translation(target)+'选择了'+get.translation(button.link);
        if(card){
            target.gain(card,'visible');
            target.$gain2(card);
            game.broadcast(function(card,id,name,capt){
                var dialog=get.idDialog(id);
                if(dialog){
                    dialog.content.firstChild.innerHTML=capt;
                    for(var i=0;i<dialog.buttons.length;i++){
                        if(dialog.buttons[i].link==card){
                            dialog.buttons[i].querySelector('.info').innerHTML=name;
                            dialog.buttons.splice(i--,1);
                            break;
                        }
                    }
                }
            },card,dialog.videoId,function(target){
                if(target._tempTranslate) return target._tempTranslate;
                var name=target.name;
                if(lib.translate[name+'_ab']) return lib.translate[name+'_ab'];
                return get.translation(name);
            }(target),capt);
        }
        dialog.content.firstChild.innerHTML=capt;
        game.addVideo('dialogCapt',null,[dialog.videoId,dialog.content.firstChild.innerHTML]);
        game.log(target,'选择了',button.link);
        game.delay();
    },
                contentAfter:function(){
        for(var i=0;i<ui.dialogs.length;i++){
            if(ui.dialogs[i].videoId==event.preResult){
                var dialog=ui.dialogs[i];
                dialog.close();
                _status.dieClose.remove(dialog);
                if(dialog.buttons.length){
                    event.remained=[];
                    for(var i=0;i<dialog.buttons.length;i++){
                        event.remained.push(dialog.buttons[i].link);
                    }
                    event.trigger('wuguRemained');
                }
                break;
            }
        }
        game.broadcast(function(id){
            var dialog=get.idDialog(id);
            if(dialog){
                dialog.close();
                _status.dieClose.remove(dialog);
            }
        },event.preResult);
        game.addVideo('cardDialog',null,event.preResult);
    },
                ai:{
                    wuxie:function(){
            if(Math.random()<0.5) return 0;
        },
                    basic:{
                        order:3,
                        useful:0.5,
                    },
                    result:{
                        target:function(player,target){
                var sorter=(_status.currentPhase||player);
                if(get.is.versus()){
                    if(target==sorter) return 1.5;
                    return 1;
                }
                if(player.hasUnknown(2)){
                    return 0;
                }
                return (1-get.distance(sorter,target,'absolute')/game.countPlayer())*get.attitude(player,target)>0?0.5:0.7;
            },
                    },
                    tag:{
                        draw:1,
                        multitarget:1,
                    },
                },
                fullimage:true,
            },
            "近距支援":{
                audio:true,
                type:"trick",
                enable:true,
                selectTarget:-1,
                reverseOrder:true,
                "yingbian_prompt":"当你使用此牌选择目标后，你可为此牌减少一个目标",
                "yingbian_tags":["remove"],
                yingbian:function(event){
        event.yingbian_removeTarget=true;
    },
                filterTarget:function(card,player,target){
        return target!=player.isfriendsOf(player);
    },
                content:function(){
        "step 0"
        if(typeof event.baseDamage!='number') event.baseDamage=1;
        if(event.directHit) event._result={bool:false};
        else{
            var next=target.chooseToRespond({name:'shan'});
            next.set('ai',function(card){
                var evt=_status.event.getParent();
                if(get.damageEffect(evt.target,evt.player,evt.target)>=0) return 0;
                if(evt.player.hasSkillTag('notricksource')) return 0;
                if(evt.target.hasSkillTag('notrick')) return 0;
                if(evt.target.hasSkillTag('noShan')){
                    return -1;
                }
            return get.order(card);
            });
            next.autochoose=lib.filter.autoRespondShan;
        }
        "step 1"
        if(result.bool==false){
            target.damage(event.baseDamage);
        }
    },
                ai:{
                    wuxie:function(target,card,player,viewer){
            if(get.attitude(viewer,target)>0&&target.countCards('h','shan')){
                if(!target.countCards('h')||target.hp==1||Math.random()<0.7) return 0;
            }
        },
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        "target_use":function(player,target){
                if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                        target:function(player,target){
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:1,
                        multitarget:1,
                        multineg:1,
                    },
                },
                fullimage:true,
            },
        },
        translate:{
            "幸运":"幸运",
            "幸运_info":"当你需要使用或打出一张【闪】时，你可以进行判定，若判定结果不为黑桃，视为你使用或打出了一张【闪】。",
            "炮火准备":"炮火准备",
            "炮火准备_info":"试试就逝世，扣一血得属性杀增伤一次，然而现在所有舰船都有这个，可以图加一杀次数。",
            "航空战":"航空战",
            "航空战_info":"建树丰厚，参与每轮开始时的三连杀战斗吗，每轮最多弃置三张牌。",
            "攻击":"攻击",
            "攻击_info":"其实就是杀，但出此杀时必须能打三个目标。",
            "民族乐器":"民族乐器",
            "民族乐器_info":"北境之地的文化艺术。锁定技，你视为拥有技能“制衡”，若你已经有“制衡”，则改为取消弃置牌数的限制。",
            "架空历史":"架空历史",
            "架空历史_info":"群星璀璨，欧陆风云，两个五谷丰登的效果",
            "近距支援":"近距支援",
            "近距支援_info":"出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点伤害。",
        },
        list:[],
    },
    skill:{
        skill:{
            "后勤":{
                audio:"ext:牌将修改:2",
                trigger:{
                    player:"loseAfter",
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
                },
                frequent:true,
                filter:function(event,player){
        if(player.countCards('h')>3) return false;
        var evt=event.getl(player);
        return evt&&evt.player==player&&evt.hs&&evt.hs.length>0;
    },
                content:function(){
        player.draw();
    },
                ai:{
                    threaten:0.8,
                    effect:{
                        target:function(card){
                if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
            },
                    },
                    noh:true,
                    skillTagFilter:function(player,tag){
            if(tag=='noh'){
                if(player.countCards('h')!=1) return false;
            }
        },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "手枪":{
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                filter:function(event,player){
        return (event.name!='phase'||game.phaseNumber==0);
    },
                content:function(){
        player.equip(game.createCard2('幸运','club',0));
        player.equip(game.createCard2('炮火准备','club',0));
        player.equip(game.createCard2('miki_binoculars','diamond',0));
    },
                mod:{
                    canBeDiscarded:function(card){
            if(get.position(card)=='e'&&['equip1','equip5','equip6'].contains(get.subtype(card))) return false;
        },
                },
                intro:{
                    content:function(){
                return get.translation(skill+'_info');
            },
                },
                "audioname2":{
                    "key_shiki":"shiki_omusubi",
                },
            },
            "炮火准备1":{
                mod:{
                    maxHandcard:function(player,num){
            return num-1;
        },
                    cardUsable:function(card,player,num){
            if(card.name=='sha') return num+1;
        },
                },
                trigger:{
                    player:"equipAfter",
                },
                forced:true,
                equipSkill:true,
                filter:function(event,player){
        return event.card.name=='炮火准备';
    },
                content:function(){
        player.loseHp();
    },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "雪见_双刃":{
                trigger:{
                    player:["loseEnd"],
                },
                filter:function(event,player){
        if(!player.equiping) return false;
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='e'&&get.subtype(event.cards[i])=='equip1') return true;
        }
        return false;
    },
                content:function(){
        var card;
        for(var i=0;i<trigger.cards.length;i++){
            if(trigger.cards[i].original=='e'&&get.subtype(trigger.cards[i])=='equip1'){
                card=trigger.cards[i];
            }
        }
        if(card){
            if(player.storage.xshuangren){
                player.unmark(player.storage.xshuangren,'xshuangren');
                player.discard(player.storage.xshuangren);
                game.addVideo('unmarkId',player,[get.cardInfo(player.storage.xshuangren),'xshuangren']);
            }
            if(card.clone){
                card.clone.moveDelete(player);
                game.addVideo('gain2',player,get.cardsInfo([card.clone]));
                player.mark(card,'xshuangren');
                game.addVideo('markId',player,[get.cardInfo(card),'xshuangren']);
            }
            ui.special.appendChild(card);
            player.storage.xshuangren=card;
            var info=get.info(card);
            if(info.skills){
                player.addAdditionalSkill('xshuangren',info.skills);
            }
            else{
                player.removeAdditionalSkill('xshuangren');
            }
        }

    },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                if(get.subtype(card)=='equip1') return [1,3];
            },
                    },
                },
                intro:{
                    content:"card",
                },
                group:"xshuangren2",
            },
            "重炮":{
                enable:"phaseUse",
                usable:1,
                complexCard:true,
                selectCard:[2,5],
                filter:function(event,player){
        return !player.countCards('h','sha')&&!player.canUse('sha',player);
    },
                filterCard:function(card,player){
        if(ui.selected.cards.length){
            return get.suit(card)==get.suit(ui.selected.cards[0]);
        }
        var cards=player.getCards('he');
        for(var i=0;i<cards.length;i++){
            if(card!=cards[i]){
                if(get.suit(card)==get.suit(cards[i])) return true;
            }
        }
        return false;
    },
                check:function(card){  return 60-get.value(card);
    },
                prompt:"在没有杀或者不能出杀时，可弃置最多五张同花牌，耗n-1滴血，n为弃牌数,对你选择的目标视为出n-1个杀，<br>弃置达到（4，5）的杀拥有属性杀，极限4发，回复出杀次数会生效,技能结束后会获得袭击运输船技能",
                content:function(){//(if(event.num>2) player.useCard({name:'sha'},event.targets.randomGet());
event.num=event.cards.length;
event.targets=player.getEnemies();
 player.addTempSkill('袭击运输船','phaseAfter');var d=game.countPlayer(function(current){
   return current!=player&&(get.attitude(player,current)<1)&&(current.hasSkill('bagua_skill')|current.hasSkill('re_bagua_skill'));  });
 game.log('有八卦的角色:',d,'八弃置的手牌:',event.num);
if(event.num>1) player.chooseUseTarget({name:'sha'},false,'nodistance');
if(event.num>2) player.chooseUseTarget({name:'sha'},false,'nodistance');
if(event.num>3) player.chooseUseTarget({name:'sha',nature:'thunder',isCard:true},false,'nodistance');
if(event.num>4) player.useCard({name:'sha',nature:'fire',isCard:true},event.targets.randomGet());;
if(event.num>1) player.damage(event.num-1);
  },
                ai:{
                    expose:0.3,
                    threaten:6.8,
                    order:6,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "装甲防护":{
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                filter:function(event,player){
        return player.countCards('he',{color:'black'})>0&&player.hujia==0
    },
                content:function(){
        'step 0'
        var next=player.chooseToDiscard('he',{color:'black'},get.prompt('受伤后,若你没有护甲，可以弃置一张黑色牌获得1点护甲'));
        next.ai=function(card){
            return 8-get.value(card);
        };
        next.logSkill='huanglinzhicong_equip1'
        'step 1'
        if(result.bool){
            player.changeHujia();
        }
    },
            },
            "航母":{
                mod:{
                    maxHandcard:function(player,num){return num=num+1},
                    cardUsable:function(card,player,num){if(card.name=='sha'&&(player.hp>player.maxHp/4)) return num=num},
                    globalFrom:function(from,to,distance){
        return distance-2;},
                },
                group:[],
                ai:{
                    expose:0.3,
                    threaten:5.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            "远航":{
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                filter:function(event,player){
        return (event.name!='phase'||game.phaseNumber==0);
    },
                content:function(){
     //   group:["yuanhangmopai","huihejieshu","gaizaochuan","bingsimosanpai","雪见_双刃","dietogain","击中得牌","改良装备","递杀蝶舞","火杀燃烧","qianghuachuan"],
  
    player.addSkill()
    },
                ai:{
                    expose:0,
                    threaten:0,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "高爆弹":{
                equipSkill:true,
                trigger:{
                    player:"useCard1",
                },
                filter:function(event,player,card){
        if(event.card.name=='sha'&&!event.card.nature) return true;
    },
                audio:"ext:1牌将修改:true",
                usable:1,
                name:"高爆弹",
                check:function(event,player){
        var eff=0;
        for(var i=0;i<event.targets.length;i++){
            var target=event.targets[i];
            var eff1=get.damageEffect(target,player,player);
            var eff2=get.damageEffect(target,player,player,'fire');
            eff+=eff2;
            eff-=eff1;
        }
        return eff>=0;
    },
                "prompt2":function(event,player){
        return '将'+get.translation(event.card)+'改为火属性高爆弹（目标出牌结束时受到一点伤害）,没有铁索连环时也行，这个技能不增加青釭剑效果';
    },
                content:function(){
        trigger.card.nature='fire';
        if(get.itemtype(trigger.card)=='card'){
            var next=game.createEvent('zhuque_clear');
            next.card=trigger.card;
            event.next.remove(next);
            trigger.after.push(next);
            next.setContent(function(){
                delete card.nature;
            });
        }
    },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "潜艇":{
                mod:{
                    attackFrom:function(from,to,distance){return distance-1},
                    maxHandcard:function(player,num){return num=3+num},
                    cardUsable:function(card,player,num){if(card.name=='sha'&&(player.hp>player.maxHp/4)) return num=num},
                    globalTo:function(from,to,distance){//进攻距离-1的同时武器距离-1，减少潜艇攻击频率,发现锦囊，突袭拿牌，白银减伤，涅槃强化
return distance+1;},
                },
                group:[],
                ai:{
                    expose:0.3,
                    threaten:8.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "战列舰":{
                mod:{
                    maxHandcard:function(player,num){return num=num+(player.hp<player.maxHp)},
                    cardUsable:function(card,player,num){if(card.name=='sha') return num=num},
                    globalFrom:function(from,to,distance){
        return distance-1;},
                },
                group:[],
                ai:{
                    expose:0,
                    threaten:8.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            "轻巡洋舰":{
                mod:{
                    maxHandcard:function(player,num){return num=1+num},
                    cardUsable:function(card,player,num){if(card.name=='sha') return num=num+1},
                },
                group:[],
                ai:{
                    expose:0,
                    threaten:5.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                fullskin:true,
                intro:{
                    content:function(){//"bagua_skill","鱼(雷)攻击","防空","biyue","zhangba_skill","qingnang"
            return get.translation(skill+'_info');
        },
                },
            },
            "重巡洋舰":{
                mod:{
                    maxHandcard:function(player,num){return num=2+num},
                    cardUsable:function(card,player,num){if(card.name=='sha') return num=num+1},
                },
                group:[],
                ai:{
                    expose:0,
                    threaten:6.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "驱逐舰":{
                mod:{
                    maxHandcard:function(player,num){//按技能可以用模板批量制作一个一类角色，如果有大量美术资源，
 //还不用出现一堆技能文字，缺点是差异化吧，这么多角色用一个技能，战斗不分上下。
         return num=2+num},
                    cardUsable:function(card,player,num){//可以用青釭剑破藤甲和八卦，贯石斧消耗手牌强中，八卦仁王盾
 //反制杀，藤甲反制常规攻击，丈八耗牌增加手牌利用率反制仁王盾。这样设计大体的角色类型，再具体设计需要调整的技能
 //平衡与想法。2次摸牌，四次出杀，闪避拉满，首杀二血，递牌辅助，回血给甲，看破反制，回合外摸牌，一轮开始随机两刀之类的。
        if(card.name=='sha') return num=num+1},
                },
                group:[],
                ai:{
                    expose:0,
                    threaten:4.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            "回复出杀上限":{
                trigger:{
                    player:"shaMiss",
                },
                silent:true,
                filter:function(event){//return event.getParent(2).name=='重炮'
        ;
    },
                content:function(){
    player.getStat().card.sha--
    },
                forced:true,
                popup:false,
                ai:{
                    expose:0.3,
                    threaten:8.8,
                    order:5,
                    result:{
                        player:1,
                    },
                },
            },
            "先制航空攻击":{
                audio:"ext:1牌将修改:2",
                trigger:{
                    global:"roundStart",
                },
                direct:false,
                fullskin:true,
                filter:function(event,player){
    return player.countCards('h')>0;},
                content:function(){'step 0'
event.targets=player.getEnemies();game.playAudio('..','extension','1舰R牌将/audio',player.name)
        'step 1'
        game.log(game.playAudio('..','extension','1舰R牌将/audio',player.name))
if(player.countCards('h')>1){player.discard(player.getCards('h').randomGet())&&player.discard(player.getCards('h').randomGet())&&player.useCard({name:'wanjian'},event.targets)};
            'step 2'                                                                                     
if(player.countCards('h')>0){player.discard(player.getCards('h').randomGet())&&player.chooseUseTarget({name:'sha',nature:'ice',isCard:true},false,'nodistance')};
   

            
event.finish






        ;
    },
            },
            "先制潜艇攻击":{
                audio:"ext:1牌将修改:2",
                trigger:{
                    global:"roundStart",
                },
                filter:function(event,player){
    return player.countCards('h')>1;},
                content:function(){
event.targets=player.getEnemies();
if(player.countCards('h')>0){player.discard(player.getCards('h').randomGet()),player.chooseUseTarget({name:'sha',nature:'ice',isCard:true},false,'nodistance');};
if(player.countCards('h')>0){player.discard(player.getCards('h').randomGet()),player.chooseUseTarget({name:'sha',nature:'thunder',isCard:true},false,'nodistance');};

        
    },
            },
            yuanhangmopai:{
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:"loseAfter",
                    global:["equipAfter","addJudgeAfter","loseAsyncAfter","addToExpansionAfter"],
                },
                frequent:true,
                usable:2,
                nowuxie:false,
                filter:function(event,player){
    //角色于失去牌阶段后，经历全局阶段“装备装备后，加入判定牌后，失去牌后，用牌响应事件”后，执行content
    //sd没错，无名杀是阶段+事件驱动游戏，没有攻击和摸牌数值，大多数操作会先经历事件或者阶段再来实现。
    //各种阶段的名字找教程，教程全，要用复制粘贴即可。
    //防止仁德给牌移除了给牌阶段后。为了平衡用usable限制。建议触发条件按手牌上限算，不然不是强如曹金玉就是弱如陆逊。
        var d=(player.getHandcardLimit()/2)
        if(player.countCards('h')>d) return false;
        var evt=event.getl(player);
        return evt&&evt.player==player&&evt.hs&&evt.hs.length>0;
        //当手牌小于上线一半或者是准备阶段就执行，frequent自动执行，也可以force锁定强制执行。
    },
                content:function(){//最好是draw摸牌而不是增加事件阶段，事件会被跳过一个兵粮就没法玩了，player.markSkill不太行
     //不过想玩张辽技能的话，trigger改为玩家摸牌开始2，comtent加入trigger.num++，
    //这将增加摸牌2的回合数来实现增加摸牌。用addmark，countMark存储变量稳定但是他们需要清除。var a=player.简便
    //player.drawTo(num)补牌至x，可以里面来个math.min(3,player.maxHp)做平衡。filter里的运算也可以搬过来。
    //if引导多个事件触发推荐用大括号括一下，else为否则，与if连起来就可以使用了，别加;哦。下面的ai复制粘贴的，
    //ai：expose被发现的数值，积累至1以上被ai发现身份。threaten被打的权重，理解是威胁度、嘲讽能力。
     if(player.hasMark('yuanhangmopai')|(player.countMark('摸牌')<1)){ player.draw(1)}
        else {player.draw(1+player.countMark('摸牌')),player.addMark('yuanhangmopai')};
     
    },
                ai:{
                    expose:0,
                    threaten:0,
                    order:5,
                    result:{
                        player:1,
                    },
                },
            },
            huihejieshu:{
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                fixed:true,
                content:function(){
        if(player.hasMark('yuanhangmopai')){ player.removeMark('yuanhangmopai')}else player.draw();
    },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            bingsimosanpai:{
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:["dying","dyingAfter"],
                },
                prompt:"进入濒死会让一些舰船获得一些在前中期比较强力，后期会被针对的、锦上添花的技能，比如驱逐将得到把杀向队友的杀转移给自己的技能，但是驱逐还是怕后期的战列舰与重巡，这样的设计",
                usable:4,
                fixed:true,
                content:function(){//兵粮寸断与据守，刚烈，     镇卫同疾吸伤害，国风防锦囊牌。
        //轻巡提升己方防守与攻击距离，粮策全体发牌。  重巡提供免伤。战列刚烈反击。 
        player.draw(1); game.playAudio('..','extension','1舰R牌将/audio','bingsimosanpai');
    if(player.hasSkill('潜艇')){player.addSkill('gzduanliang','ganglie')};;
    if(player.hasSkill('驱逐舰')){player.addSkill('hzhenwei','retongji')};;
    if(player.hasSkill('轻巡洋舰')){player.addSkill('轻巡技能','轻巡技能二')};;
    if(player.hasSkill('重巡洋舰')){player.addSkill('ganglie',"仁德界改")};;
    if(player.hasSkill('战列舰')){player.addSkill('ganglie')};;
    if(player.hasSkill('航母')){player.addSkill('yingzi')};;
                                              
                                              
                                              
                                              
    },
                intro:{
                    content:function(){
        return get.translation(skill+'_info');},
                },
            },
            qianghuachuan:{
                mod:{
                    globalFrom:function(from,to,distance){//这个函数已经设置好发起者,防守者,距离三个对象，同player用就行。不用再加新的
        //from，to，（发起，受到）这两就是player，trigger，可使用相同代码。mod和trigger得考虑对象是否已经有代指。
       //distance也不用加减得到了，直接用就可以，用var，或者return赋值。最好是加减标记的数量，其次是数组类与固定数值。
        //进攻距离 输出distance给所有事件与触发器
return distance-from.countMark('远射');},
                    globalTo:function(from,to,distance){//注意这里是技能者要挨牌了，调用to的东西，from的hpmaxHp之类的也可以用，to也一样，
        //防守，肯定加距离，防止顺手牵羊。被boss恶心坏了。费用距离
return distance+to.countMark('机动');},
                    maxHandcard:function(player,num){//手牌上限，这个好理解，num是这个函数原本输出的数量，num=num加数字就可以变更了。
        return num=num},
                    cardUsable:function( card,player,num){//是技能者卡片使用次数，输出num，注意这个mod函数会遍历技能者各种卡片的使用次数。
         //if会让之后的函数/计算有条件的执行，还可以再接一个函数else，让不满足条件的时候再执行一个函数才｝或者；完成if制作。
         //没有huosha，火杀连牌都不是还行，定义nature吧，
     if(card.name=='sha') return num=num+player.countMark('攻击次数')},
                    selectTarget:function(card,player,range){//是卡片作用时可选的目标数量，输出range给牌的发起事件阶段用。
         //if(card.name=='sha'&&range[1]!=-1)range[1] ，这也能改吗……range[1]+=player.maxHp-player.hp
         ;
        },
                    attackFrom:function(from,to,distance){//打人的距离但主要是sha的攻击范围，应该是武器常用的mod技能，参考+=player.maxHp-player.hp
        //武器没东西的，外接了一个技能(group('zhangba_skill'))的牌罢了，游戏设计好了直接用模板，当然一些牌确有点难做出来。
       return distance;
    },
                },
                direct:true,
                init:function(player){//初始化数组，放心不是加法，也不会再执行一次就重置，这个数组设置了就一直存在这个对象上
        //getInfo[666，999]可以指定调出数组里面第x个的内容，最好var一个普通变量出来再调用。 delete 加代码可以删除
        //可以list= lib.skill.qianghuachuan.getInfo列表        lists[1,2,3,4]输出
    if(!player.storage.qianghuachuan) player.storage.qianghuachuan=[0,0,0,0];    },
                getInfo:function(player){//设置于player上的、可以输出数组，在lib.skill.数组 后加getinfo，就可以使用于有对象的地方了
    //，若下面intro的content的function没有player就无法使用storage数组，以及与player有关的其他数据。
    //，遇到error:notdifine变量，function加个player试试
    if(!player.storage.qianghuachuan) player.storage.qianghuachuan=[0,0,0,0];
    return player.storage.qianghuachuan;},
                marktext:"强化",
                mark:true,
                intro:{
                    content:function(storage,player){//介绍内容，没法var content的输出对象，那就return给这个函数内容吧。
       //marktext是武将牌上标记的强化舰船，mark默认显示标记吧，下面是动态介绍，数组有变化info就会变化，intro函数无需触发器，简单一点。
       //我注释又双双被吃了，不要在skill上写注释哦。要在有function的括号里写哦。函数的第二个单词要大写哦。
 var info=lib.skill.qianghuachuan.getInfo(player);
        return '<div class="text center"><span class=thundertext>攻击射程：'+info[0]+'</span>　<span class=firetext>攻击次数：'+info[1]+'</span><br><span class=greentext>响应摸牌：'+info[2]+'</span>　<span class=yellowtext>机动防御：'+info[3]+'</span></div>'
     ;     },
                },
                enable:"phaseUse",
                usable:2,
                filter:function(event,player){
     //enable能在什么阶段发动，这，么写会变为右下角按钮触发型技能，可以用trigger代替，设计为一个对象进入一个阶段就(被动选择)放，但会失去主动技能预设的一些功能，usable限制使用次数
     //fliter可以调用事件对向和技能使用者，对技能释放的卡片做限制，'het'是游戏预设的简写,见下。md，怎么下面那个会清空注释
     //  handCard手牌 ，equip装备牌，简写时是用于装备区， trick锦囊牌,judge是判定区，其他delay延时性锦囊牌。
     //选择玩家｛标签为装备｝（在手牌区与装备区）的卡片数量大于0，且玩家 能用杀时。lib.filter.cardEnabled({name:'sha'},player));
     //filter内还可以套娃，做更具体的限制，cardEnabled是能不能用卡片，抄一个用用，&&和&可以不用括号连接两个条件。
       var a=player.countMark('远射'),  b=player.countMark('攻击次数'), c=player.countMark('摸牌') , d=player.countMark('机动'),e=player.countMark('改造');
       if (player.countCards('he',{type:'equip'})>0){if((a+b+c+d)>(2+e*2))return false} return true;
        ;
    },
                filterCard:{
                    type:"equip",
                },
                position:"he",
                selectCard:1,
                prompt:"你可以弃置一张装备牌，选择一个永久效果升级角色,每回合限两次,最多四次",
                check:function(card){//这个不会清理注释,happy,ai选择什么牌，&&player.getEquip(1)
        //什么时候发动可以加player搬一个卡片数量限制下来，get.value(card)是常用代码，所有可用牌的价值。
        return 40-get.value
    },
                content:function(){
         'step 0'//好&&player.getEquip(1),这个注释不会清除欸。control是返回文字吧，要用==判定，而不是=赋值了
        //，备份代码 ，失误几十次了，怕了。不碰了，没爱了，恨透了，悔恨的泪水。好吧动态的文字不行
     //if(result.control=='防御距离')   player.addMark('机动',1)&&event.finish ;对于动态选项文字不可行
   //  if(result.control='所有伤害')  player.addMark('攻击',1)&&event.finish    ;
   //  if(result.control=='摸牌次数('+player.countMark('摸牌')+')')   player.addMark('摸牌',1)&&event.finish    ;
   //control适合静态文字比如取消，index适合subskill、list与storage协作引导的技能释放，以及生成会变化文本的选项。
   //分步事件是技能自己的阶段、自己的事件，可以作为其他技能的触发条件哦，当然大多数技能触发时也是事件。
         var a=player.countMark('远射'),  b=player.countMark('攻击次数'), c=player.countMark('摸牌') , d=player.countMark('机动')
 player.storage.qianghuachuan=[a,b,c,d];
 player.chooseControl('<span class=thundertext>攻击射程('+a+')</span>','<span class=firetext>攻击次数('+b+')</span>','<span class=greentext>响应摸牌('+c+')</span>','<span class=yellowtext>机动防御('+d+')</span>','cancel2').set('prompt',get.prompt('qianghuachuan')).set('prompt2','令其中一项数字+1，但为设备着想不要超过2,强化舰船强力之处，〖改造〗舰船薄弱之处<br>属性杀增伤，远航摸牌，含锦囊牌攻击距离，含锦囊牌防御距离').set('ai',function(event,player){
            var player=_status.event.player,info=lib.skill.qianghuachuan.getInfo(player);
            if(info[0]<info[3])return 0;
            if(info[3]<info[1]) return 3;
            if(info[1]<info[2]) return 1;
            if(info[2]<=info[0])  return 2;
        });
            'step 1'
         if(result.control!='cancel2'){event.suit = result.control;event.num = result.index;;game.log('你的选择为:',event.suit,result.index)};
            'step 2'
       if(event.num==0) {  player.addMark('远射',1)} ;;
            'step 3'
       if(event.num==1)    {player.addMark('攻击次数',1) }   ;;
            'step 4'
       if(event.num==2) {  player.addMark('摸牌',1)  }   ;;
       if(event.num==3)   {   player.addMark('机动',1)   } ;;
                
            var a=player.countMark('远射'),  b=player.countMark('攻击次数'), c=player.countMark('摸牌') , d=player.countMark('机动')
 player.storage.qianghuachuan=[a,b,c,d];//介绍的更新，update.storage没用过，if没有否则多打点英文“；”被害惨了。
        //下面是ai，md又清理文本没爱了，f--k you ，order为发动先后顺序，大概是7为装完装备，3为桃前，只是比大小罢了
        //result为让不让ai发动技能，player=1是有这个技能就放，可以-player.hp或者-countCard，甚至搬一个技能filter下来
        //配音输名字就行，本体有教程，选项-倒数2文件-导入资源，支持武将名+123
    },
                ai:{
                    order:9,
                    threaten:0,
                    result:{
                        player:1,
                    },
                },
            },
            dietogain:{
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:["dieAfter"],
                },
                direct:true,
                forceDie:true,
                filter:function(event,player){
        if(event.name=='die') return true;
        return player.isAlive();
    },
                content:function(){
        'step 0'
        event.count=trigger.num||1;
        'step 1'
        event.count--;
        player.chooseTarget(get.prompt2('在离开战斗前，你还可以令队友、关注的对象摸三张牌，或许会有转机出现'),function(card,player,target){
            return target.maxHp>0;
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            var draw=Math.min(5,target.maxHp);
            if(draw>=0){
                if(target.hasSkillTag('nogain')) att/=6;
                if(att>2){
                    return Math.sqrt(draw+1)*att;
                }
                return att/3;
            }
            if(draw<-1){
                if(target.hasSkillTag('nogain')) att*=6;
                if(att<-2){
                    return -Math.sqrt(1-draw)*att;
                }
            }
            return 0;
        });
        'step 2'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
            player.logSkill('oljieming',target);
            target.draw(Math.min(3,target.maxHp+2));
        }
        else event.finish();
    //    'step 3'
     //   var num=target.countCards('h')-Math.min(5,target.maxHp);
      //  if(num>0) target.chooseToDiscard('h',true,num);
       // 'step 4'
      //  if(event.count>0&&player.isAlive()) event.goto(1);
    },
                ai:{
                    expose:0.2,
                    maixie:false,
                    "maixie_hp":false,
                    effect:{
                        target:function(card,player,target,current){
                if(get.tag(card,'damage')&&target.hp>1){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    var max=0;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(get.attitude(target,players[i])>0){
                            max=Math.max(Math.min(0,player.getHandcardLimit()-players[i].hp)-players[i].countCards('h'),max);
                        }
                    }
                    switch(max){
                        case 0:return 2;
                        case 1:return 1.5;
                        case 2:return [1,2];
                        default:return [0,max];
                    }
                }
                if((card.name=='tao'||card.name=='caoyao')&&
                    target.hp>1&&target.countCards('h')<=target.hp) return [0,0];
            },
                    },
                },
            },
            gaizaochuan:{
                enable:"phaseUse",
                usable:1,
                complexCard:true,
                limited:true,
                selectCard:3,
                filterCard:function(card,player){
        if(ui.selected.cards.length){
            return get.suit(card)==get.suit(ui.selected.cards[0]);
        }
        var cards=player.getCards('he');
        for(var i=0;i<cards.length;i++){
            if(card!=cards[i]){
                if(get.suit(card)==get.suit(cards[i])) return true;
            }
        }
        return false;
    },
                filter:function(event,player){info=lib.skill.qianghuachuan.getInfo(player)
      if((player.countMark('远射')+(player.countMark('攻击'))+(player.countMark('摸牌'))+(player.countMark('机动')))>0)  return true},
                check:function(card){  return 60-get.value(card);
    },
                prompt:"当此角色强化了两次以后，你可弃三张同花色的牌，提升一点血量上限，回复两点体力，最大血量大于3会再加1点体力上限,重复改造只会回血。</br>注意,改造舰船将令此舰船受到舰种的属性杀克制，打不过就算了吧。。",
                content:function(){//skillAnimation:true,
        //player:function(player,card){
           //      if((player.countCard(h)-player.countMark('改造'))>player.maxHp/2)return 1;  },   
        player.addMark('改造');;player.recover();
if(player.countMark('攻击')<1){player.gainMaxHp(1);player.addMark('攻击',1);player.recover();player.awakenSkill('gaizaochuan');if(player.maxHp>2){player.gainMaxHp(1)};} ;
    
  },
                ai:{
                    expose:0,
                    threaten:0,
                    order:6,
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){},
                },
                mark:true,
                init:function(player,skill){
        player.storage[skill]=false;
    },
                skillAnimation:true,
            },
            "鱼(雷)攻击":{
                trigger:{
                    player:"useCard1",
                },
                filter:function(event,player){
        if(event.card.name=='sha'&&!event.card.nature) return true;
    },
                audio:"ext:1牌将修改:true",
                usable:1,
                name:"鱼雷攻击",
                check:function(event,player){
        var eff=0;
        for(var i=0;i<event.targets.length;i++){
            var target=event.targets[i];
            var eff1=get.damageEffect(target,player,player);
            var eff2=get.damageEffect(target,player,player,'thunder');
            eff+=eff2;
            eff-=eff1;
        }
        return eff>=0;
    },
                "prompt2":function(event,player){
        return '将'+get.translation(event.card)+'改为鱼(雷)攻击,使用杀时一次,令非属性杀获得雷属性（没有铁索连环时能穿透护甲）以及青釭剑无视防具效果，直到伤害结算完成';
    },
                content:function(){
        player.addTempSkill('qinggang_skill','useCard1');
        trigger.card.nature='thunder';
        if(get.itemtype(trigger.card)=='card'){
            var next=game.createEvent('zhuque_clear');
            next.card=trigger.card;
            event.next.remove(next);
            trigger.after.push(next);
            next.setContent(function(){
                delete card.nature;
            });
        }
    },
            },
            "轻巡技能":{
                global:"轻巡技能二",
                trigger:{
                    global:"phaseDrawBegin",
                },
                forced:true,
                logTarget:"player",
                filter:function(event,player){
        return event.player!=player&&event.player.isFriendOf(player);
    },
                content:function(){trigger.num++},
                intro:{
                    marktext:"技能二",
                    content:function(player){
            return (''+'提升友军摸牌与攻击距离');
        },
                },
            },
            "轻巡技能二":{
                mod:{
                    globalFrom:function(from,to,num){
            return num-game.countPlayer(function(current){
                return current!=from&&current.isFriendOf(from)&&current.hasSkill('轻巡技能');
            });
        },
                },
            },
            "减血学技能":{
                audio:"ext:1牌将修改:2",
                trigger:{
                    global:"roundStart",
                },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt2('减少1点血量上限，获得目标技能'),lib.filter.notMe).set('ai',function(target){
            var player=_status.event.player;
                if(player.isHealthy()) return 0;
                if(player.hp<3&&player.getDamagedHp()<2) return 0;
                var list=[];
                if(lib.character[target.name]) list.addArray(lib.character[target.name][3]);
                if(lib.character[target.name1]) list.addArray(lib.character[target.name1][3]);
                if(lib.character[target.name2]) list.addArray(lib.character[target.name2][3]);
                list=list.filter(function(i){
                    return !player.hasSkill(i);
                });
                if(!list.length) return 0;
            return 1+Math.random();
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('shiki_omusubi',target);
            player.loseMaxHp();
            var list=[];
            if(lib.character[target.name]) list.addArray(lib.character[target.name][3]);
            if(lib.character[target.name1]) list.addArray(lib.character[target.name1][3]);
            if(lib.character[target.name2]) list.addArray(lib.character[target.name2][3]);
            player.addSkill(list);
            game.broadcastAll(function(list){
                lib.character.key_shiki[3].addArray(list);
                game.expandSkills(list);
                for(var i of list){
                    var info=lib.skill[i];
                    if(!info) continue;
                    if(!info.audioname2) info.audioname2={};
                    info.audioname2.key_shiki='';
                }
            },list);
        }
    },
            },
            "燃烧":{
                mod:{
                    attackFrom:function(from,to,distance){//打人的距离但是是攻击距离，应该是武器常用的mod技能，参考+=player.maxHp-player.hp
        //武器没东西的，外接了一个技能(group('zhangba_skill'))的牌罢了，游戏设计好了直接用模板，当然一些牌确有点难做出来。
       return distance -to.hasSkill('燃烧');},
                },
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                frequent:true,
                content:function(){//player.countMark('燃烧'),唯一一个加伤的，还是给牌吧。
        if(player.hasSkill('燃烧')){player.draw(1);player.damage(1,'fire'); player.removeSkill('燃烧');player.removeMark('燃烧',1) };
    },
                intro:{
                    marktext:"燃烧",
                    content:function(player){
            return (''+'回合结束受到一点火焰伤害，火杀带来的负面效果');
            
            
            
            
            
            
            
            
            
            
        },
                },
            },
            "火杀燃烧":{
                trigger:{
                    source:"damageBefore",
                },
                name:"火杀燃烧",
                forced:true,
                filter:function(event,player){//usable:1,
    //trigger…（什么人的什么阶段让技能拥有者触发技能，伤害damage阶段与使用一张卡牌usecard阶段是在阶段内计算结果的哦）
    //trigger里一般有player：…（有技能的到阶段就发）/target：…被对面瞄准后到阶段就放/source：…伤害来源有这个技能的到…阶段就放 
    //global进入一些特殊阶段会让有技能的触发此技能（配合player缩小触发范围，实现全回合技能使用者摸牌）这几种，
    //当是player:'阶段'时，可用trigger.player指技能拥有者（player），当是target:'阶段'时，trigger.target是技能拥有者
    //但trigger.player变为指定技能拥有者为目标的人，当source:'阶段'时，trigger.player是技能拥有者指定的目标
        if((event.nature&&player!=event.player))
    //只有在filter才可以判断卡牌目标、伤害的种类、受伤的人，在伤害发生后这些判断不能在content使用。source、target也是
    //虽然不能在content使用source，但可以用全新的trigger.player表示被这个技能作用的人，player仍然指使用这个技能的人，
    //trigger.num仍然能指代阶段数，event.num仍然能代替abcd这些赋值的文字使用。game.log仍然能帮你查错。
    //trigger.num+=(1)是函数增伤的写法，num++是简写。
    return true},
                content:function(){//火杀先增加伤害次数，再考虑其他，比如负面效果。log用了翻译代码把武将名切换为中文，trigger.player.damage(1,'fire');可以无线触发这个技能哦。
    //而且content里面event要变成trigger,如event.num变为trigger.num。代码玄学风
   if(trigger.nature=='fire')  {if(player.hasSkill('重巡洋舰')&&trigger.player.hasMark('改造')&&trigger.player.hasSkill('驱逐舰')|trigger.player.hasSkill('轻巡洋舰')) {trigger.player.damage(player.countMark('攻击'));game.log('重巡克制改造驱逐伤害:',1);}else
  //   trigger.num+=(player.countMark('攻击'));
      {trigger.player.addSkill('燃烧');trigger.player.addMark('燃烧',1);
     game.log(get.translation(player.name)+'<span class=firetext>燃烧</span>'+get.translation(trigger.player.name)+'<span class=thundertext>,ta还能坚持一出牌回合');};
     game.log(trigger.nature,'是是是火');
        game.playAudio('..','extension','1舰R牌将/audio','火杀燃烧');};
        
     if(trigger.nature=='thunder')  {if((player.hasSkill('驱逐舰')|player.hasSkill('潜艇'))&&trigger.player.hasMark('改造')&&(trigger.player.hasSkill('战列舰')|trigger.player.hasSkill('航母'))){trigger.player.loseHp(1);game.log('鱼雷的穿透增伤:',1)};
   trigger.player.addSkill('减速');trigger.player.addMark('减速',1);//  trigger.num+=(player.countMark('攻击'));
 if(trigger.player.hujia>0&&!trigger.player.isLinked()){ trigger.player.loseHp(trigger.num);game.log('雷杀穿透护甲:',trigger.num);trigger.num+=(-trigger.num),trigger.cancel};
 game.log(get.translation(player.name)+'<span class=thundertext>减速了:</span>'+get.translation(trigger.player.name)+'小心随之而来的集火');
 game.log(trigger.nature,'是是是雷');     };
       
    if(trigger.nature=='ice')  {trigger.player.addSkill('进水');trigger.player.addMark('进水');//trigger.num+=(player.countMark('攻击'));
    if(player.hasSkill('战列舰')&&trigger.player.hasMark('改造')&&trigger.player.hasSkill('重巡洋舰')){trigger.player.damage(player.countMark('攻击'));game.log('改造重巡被击穿'+1)} ;
    if(trigger.player.hujia>0) {trigger.player.damage(1) ;game.log('对护甲加伤'+1)};
    game.log(get.translation(player.name)+'让:'+get.translation(trigger.player.name)+'进水减手牌上限了')
    
                                  game.log(trigger.nature,'是是是冰');                                    
                                   
                                   
    }
                           
        
    },
            },
            "减速":{
                mod:{
                    globalTo:function(from,to,distance){//注意这里是技能者要挨牌了，调用to的东西，from的hpmaxHp之类的也可以用，to也一样，
        //防守，肯定加距离，防止顺手牵羊。被boss恶心坏了。费用距离
return distance-to.hasMark('减速');},
                },
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                frequent:true,
                content:function(){
   
        if(player.hasSkill('减速')){; player.removeSkill('减速',player.countMark('减速')); };
    },
                intro:{
                    marktext:"减速",
                    content:function(player){
            return ('减速'+'减少1点与其他角色的防御距离，冰杀的效果，不叠加计算');
            
            
            
            
            
            
            
        },
                },
            },
            "仁德界改":{
                audio:"ext:1牌将修改:2",
                audioname:["gz_jun_liubei","shen_caopi"],
                enable:"phaseUse",
                filterCard:true,
                selectCard:[1,3],
                discard:false,
                usable:2,
                lose:false,
                delay:false,
                filterTarget:function(card,player,target){
        if(player.storage.rerende2&&player.storage.rerende2.contains(target)) return false;
        return player!=target;
    },
                onremove:["rerende","rerende2"],
                check:function(card){
        if(ui.selected.cards.length&&ui.selected.cards[0].name=='du') return 0;
        if(!ui.selected.cards.length&&card.name=='du') return 20;
        var player=get.owner(card);
        if(ui.selected.cards.length>=Math.max(2,player.countCards('h')-player.hp)) return 0;
        if(player.hp==player.maxHp||player.storage.rerende<0||player.countCards('h')<=1){
            var players=game.filterPlayer();
            for(var i=0;i<players.length;i++){
                if(players[i].hasSkill('haoshi')&&
                    !players[i].isTurnedOver()&&
                    !players[i].hasJudge('lebu')&&
                    get.attitude(player,players[i])>=3&&
                    get.attitude(players[i],player)>=3){
                    return 11-get.value(card);
                }
            }
            if(player.countCards('h')>player.hp) return 10-get.value(card);
            if(player.countCards('h')>2) return 6-get.value(card);
            return -1;
        }
        return 10-get.value(card);
    },
                content:function(){
        'step 0'
        var evt=_status.event.getParent('phaseUse');
        if(evt&&evt.name=='phaseUse'&&!evt.rerende){
            var next=game.createEvent('rerende_clear');
            _status.event.next.remove(next);
            evt.after.push(next);
            evt.rerende=true;
            next.player=player;
            next.setContent(lib.skill.rerende1.content);
        }
        if(!Array.isArray(player.storage.rerende2)){
            player.storage.rerende2=[];
        }
        player.storage.rerende2.push(target);
        target.gain(cards,player,'giveAuto');
        if(typeof player.storage.rerende!='number'){
            player.storage.rerende=0;
        }
        if(player.storage.rerende>=0){
            player.storage.rerende+=cards.length;
            if(player.storage.rerende>=2){
                var list=[];
                if(lib.filter.cardUsable({name:'sha'},player,event.getParent('chooseToUse'))&&game.hasPlayer(function(current){
                    return player.canUse('sha',current);
                })){
                    list.push(['基本','','sha']);
                }
                for(var i of lib.inpile_nature){
                 if(lib.filter.cardUsable({name:'sha',nature:i},player,event.getParent('chooseToUse'))&&game.hasPlayer(function(current){
                            return player.canUse({name:'sha',nature:i},current);
                        })){
                        list.push(['基本','','sha',i]);
                    }
                }
          //      if(lib.filter.cardUsable({name:'tao'},player,event.getParent('chooseToUse'))&&game.hasPlayer(function(current){
      //              return player.canUse('tao',current);
           //     })){
        //            list.push(['基本','','tao']);
      //          }
                if(lib.filter.cardUsable({name:'jiu'},player,event.getParent('chooseToUse'))&&game.hasPlayer(function(current){
                    return player.canUse('jiu',current);
                })){
                    list.push(['基本','','jiu']);
                }
                if(list.length){
                    player.chooseButton(['是否视为使用一张基本牌？',[list,'vcard']]).set('ai',function(button){
                        var player=_status.event.player;
                        var card={name:button.link[2],nature:button.link[3]};
                        if(card.name=='tao'){
                            if(player.hp==1||(player.hp==2&&!player.hasShan())||player.needsToDiscard()){
                                return 5;
                            }
                            return 1;
                        }
                        if(card.name=='sha'){
                            if(game.hasPlayer(function(current){
                                return player.canUse(card,current)&&get.effect(current,card,player,player)>0
                            })){
                                if(card.nature=='fire') return 2.95;
                                if(card.nature=='thunder'||card.nature=='ice') return 2.92;
                                return 2.9;
                            }
                            return 0;
                        }
                        if(card.name=='jiu'){
                            return 0.5;
                        }
                        return 0;
                    });
                }
                else{
                    event.finish();
                }
                player.storage.rerende=-1;
            }
            else{
                event.finish();
            }
        }
        else{
            event.finish();
        }
        'step 1'
        if(result&&result.bool&&result.links[0]){
            var card={name:result.links[0][2],nature:result.links[0][3]};
            player.chooseUseTarget(card,true);
        }
    },
                ai:{
                    fireAttack:true,
                    order:function(skill,player){
            if(player.hp<player.maxHp&&player.storage.rerende<2&&player.countCards('h')>1){
                return 6;
            }
            return 3;
        },
                    result:{
                        target:function(player,target){
                if(target.hasSkillTag('nogain')) return 0;
                if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
                    if(target.hasSkillTag('nodu')) return 0;
                    return -10;
                }
                if(target.hasJudge('lebu')) return 0;
                var nh=target.countCards('h');
                var np=player.countCards('h');
                if(player.hp==player.maxHp||player.storage.rerende<0||player.countCards('h')<=1){
                    if(nh>=np-1&&np<=player.hp&&!target.hasSkill('haoshi')) return 0;
                }
                return Math.max(1,5-nh);
            },
                    },
                    effect:{
                        target:function(card,player,target){
                if(player==target&&get.type(card)=='equip'){
                    if(player.countCards('e',{subtype:get.subtype(card)})){
                        if(game.hasPlayer(function(current){
                            return current!=player&&get.attitude(player,current)>0;
                        })){
                            return 0;
                        }
                    }
                }
            },
                    },
                    threaten:0.8,
                },
            },
            "穿甲弹":{
                trigger:{
                    player:"useCard1",
                },
                filter:function(event,player){
        if(event.card.name=='sha'&&!event.card.nature) return true;
    },
                audio:"ext:1牌将修改:true",
                usable:1,
                name:"穿甲弹",
                check:function(event,player){
        var eff=0;
        for(var i=0;i<event.targets.length;i++){
            var target=event.targets[i];
            var eff1=get.damageEffect(target,player,player);
            var eff2=get.damageEffect(target,player,player,'ice');
            eff+=eff2;
            eff-=eff1;
        }
        return eff>=0;
    },
                "prompt2":function(event,player){//trigger.extraDamage++
        return '将'+get.translation(event.card)+'改为穿甲弹攻击,使用牌时一次,令非属性杀获得冰属性（没有铁索连环时有护甲时+1伤）以及无视防具，直到伤害结算完成';
    },
                content:function(){
        player.addTempSkill('qinggang_skill','useCard1');var target=event.target;
        trigger.card.nature='ice';
        if(get.itemtype(trigger.card)=='card'){
            var next=game.createEvent('zhuque_clear');
            next.card=trigger.card;
            event.next.remove(next);
            trigger.after.push(next);
            next.setContent(function(){
                delete card.nature;
            });
        }
    },
            },
            "递杀得牌":{
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            "递杀蝶舞":{
                enable:"phaseUse",
                filter:function(event,player){
      return player.countCards('h','sha')>0;
    },
                filterCard:{
                    name:"sha",
                },
                filterTarget:function(card,player,target){
      if(get.attitude(player,target)>0)  return target!=player;
    },
                selectCard:[1,3],
                prepare:"give",
                discard:false,
                content:function(){
        target.gain(cards,player);
        if(!player.hasSkill('diewu2')){
            player.draw();
            player.addTempSkill('diewu2');
        }
    },
                ai:{
                    order:2,
                    expose:0.2,
                    result:{
                        target:function(player,target){//if(!player.hasSkill('diewu2'))
     return 1;//   return 0;
            },
                    },
                },
            },
            "进水":{
                mod:{
                    maxHandcard:function(player,num){//手牌上限，这个好理解，num是这个函数原本输出的数量，num=num加数字就可以变更了。
        return num=num-1},
                },
                audio:"ext:1牌将修改:2",
                trigger:{
                    player:"phaseBegin",
                },
                frequent:true,
                content:function(){
   
        if(player.hasSkill('进水')){; player.removeSkill('进水',player.countMark('进水')); };
    },
                intro:{
                    marktext:"进水",
                    content:function(player){
            return (''+'减少1点手牌上限，在出牌阶段会恢复，冰杀与袭击运输船的效果，不叠加计算也很可怕了');
            
            
            
            
            
            
            
        },
                },
            },
            "开局摸锦囊":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                usable:1,
                filter:function(event){
        return event.card&&get.type(event.card)=='trick'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
    },
                content:function(){game.log('要锦囊牌加伤了')
        trigger.num+=(player.countMark('攻击'));
    },
                group:["开局摸锦囊_discover","开局摸锦囊_draw"],
                ai:{
                    threaten:0,
                },
                subSkill:{
                    discover:{
                        trigger:{
                            player:"phaseUseBegin",
                        },
                        forced:true,
                        content:function(){game.log('要摸锦囊牌了')
                player.discoverCard(get.inpile('trick'));
            },
                        sub:true,
                    },
                    draw:{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        content:function(){game.log('要少摸牌了')
                trigger.num+=(-1);
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
            },
            "击中得牌":{
                trigger:{
                    source:"shaHit",
                },
                frequent:true,
                check:function(event,player){
        var att=get.attitude(player,event.target);
        if(player.hasSkill('jiu')) return att>0;
        if(event.target.hasSkillTag('maixie_hp')||event.target.hasSkillTag('maixie_defend')){
            return att<=0;
        }
        if(player.hasSkill('tianxianjiu')) return false;
        if(event.target.hujia>0) return att<0;
        if(event.target.hp==1) return att>0;
        return false;
    },
                content:function(){//击中与未击中只有处于阶段的玩家与目标，当然，player可以用于content。;用于条件与反馈之后末尾
      //  trigger.unhurt=true;这里为了平衡用对手得牌的代码，好吧还是自己拿牌吧。
      //  trigger.target.loseHp();
 //if(event.getParent(2).name=='重炮'){player.draw()};
        player.draw()
    },
            },
            "制空权":{
                mod:{
                    aiValue:function(player,card,num){
            if(get.name(card)!='wuxie'&&get.color(card)!='black') return;
            var cards=player.getCards('hs',function(card){
                return get.name(card)=='wuxie'||get.color(card)=='black';
            });
            cards.sort(function(a,b){
                return (get.name(b)=='wuxie'?1:2)-(get.name(a)=='wuxie'?1:2);
            });
            var geti=function(){
                if(cards.contains(card)){
                    return cards.indexOf(card);
                }
                return cards.length;
            };
            if(get.name(card)=='wuxie') return Math.min(num,[6,4,3][Math.min(geti(),2)])*0.6;
            return Math.max(num,[6,4,3][Math.min(geti(),2)]);
        },
                    aiUseful:function(){
            return lib.skill.kanpo.mod.aiValue.apply(this,arguments);
        },
                },
                audio:function(player){game.playAudio('..','extension','1舰R牌将/audio',player.name);},
                enable:"chooseToUse",
                locked:false,
                usable:1,
                fullskin:true,
                filterCard:function(card){
        return get.color(card)=='black';
    },
                viewAsFilter:function(player){
        return player.countCards('hs',{color:'black'})>0;
    },
                viewAs:{
                    name:"wuxie",
                },
                position:"hs",
                prompt:"将一张黑色手牌当无懈可击使用",
                check:function(card){
        var tri=_status.event.getTrigger();
        if(tri&&tri.card&&tri.card.name=='chiling') return -1;
        return 8-get.value(card)
    },
                threaten:1.2,
                ai:{
                    basic:{
                        useful:[6,4,3],
                        value:[6,4,3],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            "防空":{
                audio:"ext:1舰R牌将:1",
                fullskin:true,
                audioname:["yixian","sunce","re_sunben","re_sunce","ol_sunjian"],
                unique:true,
                usable:1,
                round:1,
                mark:true,
                nodelay:true,
                trigger:{
                    global:"useCardToPlayered",
                },
                filter:function(event,player){
        if(event.getParent().triggeredTargets3.length>1) return false;
        if(get.type(event.card)!='trick') return false;
        if(get.info(event.card).multitarget) return false;
        if(event.targets.length<2) return false;
        if(game.hasPlayer(function(current){
                            return current!=player&&get.attitude(player,current)>0;
                        })){
                            return 1;
                        }
    //    if(player.storage.fenwei) return false;
        return true;
    },
                init:function(player){
        player.storage.fenwei=false;
    },
                direct:true,
                content:function(){//limited:true,
        "step 0"
        player.chooseTarget(get.prompt('防空保护对象'),('X为选择的角色数，当一名角色使用的锦囊牌指定了至少两名角色为目标时，你可以消耗2X的手牌，令此牌对X名角色无效。'),
       [1,Math.min(trigger.targets.length,player.countCards('he')/2)],function(card,player,target){
       return _status.event.targets.contains(target);
        }).set('ai',function(target){
       var trigger=_status.event.getTrigger();
          if(game.phaseNumber>game.players.length*2&&trigger.targets.length>=game.players.length-1&&!trigger.excluded.contains(target))  {
        return -get.effect(target,trigger.card,trigger.player,_status.event.player);
            }
            return -1;
        }).set('targets',trigger.targets);
        "step 1"
        if(result.bool){
        var num=result.targets.length*2;event.target=result.targets//event的赋值不需要var 可以一直使用的事件结束
        var discard=player.countCards('he');
        var next=player.chooseToDiscard(get.prompt('防空弃牌事件'),num,'弃置两倍的手牌并让锦囊牌对目标角色无效');
        next.setHiddenSkill('防空');//还要隐藏还行skillAnimation:true,    animationColor:"wood",
        next.logSkill='防空';
        next.ai=function(card){
            if(discard){
                return 100-get.useful(card);
            }
            else{
                return -1;
            }
     }   };
        "step 2"
        if(result.bool){//trigger.getParent()找上个事件（万箭齐发）
          //  出现觉醒标识的player.awakenSkill('防空');与拖时间播录音的game.delay();以及真正完成觉醒技只能用一次的player.storage.fenwei=true;
            player.logSkill('防空',result.targets);
            player.storage.fenwei=true;
            trigger.getParent().excluded.addArray(event.target);
            
        }
    },
                intro:{
                    content:"limited",
                },
                group:["防空_roundcount"],
            },
            "袭击运输船":{
                enable:"phaseUse",
                frequent:true,
                usable:3,
                complexCard:true,
                check:function(card){  return get.value(card);
    },
                filterCard:function(card,player){return get.color(card)=='red'},
                prompt:"每回合限三次，弃置一张红色牌，随机弃置对手一张手牌或者装备牌，并为对手施加进水debuff。",
                content:function(){
var list=player.getEnemies();
        for(var i=0;i<list.length;i++){
            if(!list[i].countCards('he')){
                list.splice(i--,1);
            }
        }
        var target=list.randomGet();
        if(target){
            player.logSkill('袭击运输船',target);game.log('要进水弃牌了')
            target.discard(target.getCards('he').randomGet());
    //     if(target.hasMark('摸牌')){ target.discard(target.getCards('he').randomGet());};
            target.addSkill('进水');
            target.addExpose(0.2);
        }
},
                ai:{
                    expose:0.01,
                    threaten:0,
                    order:3,
                    result:{
                        player:function(player){player.countCards('he')>4},
                    },
                },
                intro:{
                    content:function(){
            return get.translation(袭击运输船);
        },
                },
            },
            "改良装备":{
                position:"he",
                audio:"xinfu_jingxie",
                enable:"phaseUse",
                filter:function(event,player){//group:["xinfu_jingxie2"],
        var he=player.getCards('he');
        for(var i=0;i<he.length;i++){
            if(["bagua","baiyin","lanyinjia","renwang","tengjia","zhuge"].contains(he[i].name)) return true;
        }
        return false;
    },
                filterCard:function(card){
        return ["bagua","baiyin","lanyinjia","renwang","tengjia","zhuge"].contains(card.name);
    },
                discard:false,
                lose:false,
                delay:false,
                check:function(){
        return 1;
    },
                content:function(){
        "step 0"
        player.showCards(cards);
        "step 1"
        var card=cards[0];
        var bool=(get.position(card)=='e');
        if(bool) player.removeEquipTrigger(card);
        game.addVideo('skill',player,['xinfu_jingxie',[bool,get.cardInfo(card)]])
        game.broadcastAll(function(card){
            card.init([card.suit,card.number,'rewrite_'+card.name]);
        },card);
        if(bool){
            var info=get.info(card);
            if(info.skills){
                for(var i=0;i<info.skills.length;i++){
                    player.addSkillTrigger(info.skills[i]);
                }
            }
        }
    },
                ai:{
                    basic:{
                        order:10,
                    },
                    result:{
                        player:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
                "audioname2":{
                    "key_shiki":"shiki_omusubi",
                },
            },
            "屯粮油":{
                audio:"ext:1舰R牌将:2",
                trigger:{
                    player:"phaseJieshuBegin",
                    global:"phaseBegin",
                },
                direct:true,
                frequent:true,
                preHidden:true,
                locked:false,
                filter:function(event,player){//输粮改
        return player.getExpansions('tunchu').length>0&&event.player.countCards('h')<76&&event.player.isAlive();
    },
                content:function(){
        'step 0'
        var goon=(get.attitude(player,trigger.player)>0);
        player.chooseCardButton(get.prompt('shuliang',trigger.player),player.getExpansions('tunchu')).set('ai',function(){
            if(_status.event.goon) return 1;
            return 0;
        }).set('goon',goon);
        'step 1'
        if(result.bool){
            player.logSkill('shuliang',trigger.player);
            player.loseToDiscardpile(result.links);
            trigger.player.draw(1);player.draw(1);player.useCard({name:'yiyi'},player)
        }
    },
                ai:{
                    combo:"tunchu",
                },
                group:["屯粮油_choose","屯粮油_damage"],
                onremove:function(player,skill){
        var cards=player.getExpansions(skill);
        if(cards.length) player.loseToDiscardpile(cards);
    },
                intro:{
                    content:"expansion",
                    markcount:"expansion",
                },
                subSkill:{
                    choose:{
                        trigger:{
                            global:"phaseBegin",
                        },
                        forced:true,
                        popup:false,
                        filter:function(event,player){
       if(event.numFixed||player.getExpansions('tunchu').length) return false;
        return true;
    },
                        charlotte:true,
                        content:function(){
                'step 0'
            //    player.removeSkill('tunchu_choose');
                var nh=player.countCards('h');
                if(nh){
                    player.chooseCard('h',[1,nh],'将任意张手牌置于你的武将牌上').set('ai',function(card){
                        var player=_status.event.player;
                        var count=game.countPlayer(function(current){
                            return get.attitude(player,current)>2&&current.hp-current.countCards('h')>1;
                        });
                        if(ui.selected.cards.length>=count) return -get.value(card);
                        return 5-get.value(card);
                    });
                }
                else{
                    event.finish();
                }
                'step 1'
                if(result.bool){
                    player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('tunchu');
                }
            },
                        sub:true,
                        damage:{
                            trigger:{
                                player:"damageEnd",
                            },
                            audio:"ext:1舰R牌将:2",
                            forced:true,
                            filter:function(event,player){
        if(event.name!='damage') return (event.name!='phase'||game.phaseNumber==0);
        player.getExpansions('tunchu').length>0;
    },
                            content:function(){
      'step 0'
        var goon=(get.attitude(player,trigger.player)>0);
        player.chooseCardButton(get.prompt('shuliang',trigger.player),player.getExpansions('tunchu')).set('ai',function(){
            if(_status.event.goon) return 1;
            return 0;
        }).set('goon',goon);
        'step 1'
        if(result.bool){
            player.logSkill('shuliang',trigger.player);
            player.loseToDiscardpile(result.links);}
    },
                            ai:{
                                threaten:function(player,target){
            return 1+target.countMark('tunchu')/2;
        },
                                effect:{
                                    target:function(card,player,target,current){
                if(target.hasMark('tunchu')){
                    if(card.name=='sha'){
                        if(lib.skill.global.contains('huoshaowuchao')||card.nature=='fire'||player.hasSkill('zhuque_skill')) return 2;
                    }
                    if(get.tag(card,'fireDamage')&&current<0) return 2;
                }
            },
                                },
                            },
                        },
                    },
                },
            },
            "军辅船":{
                mod:{
                    maxHandcard:function(player,num){return num=num+1+(player.hp<player.maxHp)},
                    cardUsable:function(card,player,num){if(card.name=='sha') return num=num+1},
                    globalFrom:function(from,to,distance){
        return distance;},
                },
                group:[],
                trigger:{
                    player:"phaseDrawBegin2",
                },
                frequent:true,
                preHidden:true,
                locked:false,
                filter:function(event,player){//"粮油运输","屯粮油","仓储","qingnang"
    return true;
    },
                content:function(){
        trigger.num-=2;
},
            },
            "额外回合":{
                trigger:{
                    player:"phaseEnd",
                },
                round:1,
                filter:function(event,player){
        return player.hujia>0;
    },
                check:function(event,player){
        return player.hujia>0&&player.hp>0;
    },
                content:function(){
        player.storage.额外回合=player.hujia;
        player.changeHujia(-player.hujia);
        player.insertPhase();
    },
                group:["额外回合_hp","额外回合_draw","额外回合_roundcount"],
                subSkill:{
                    hp:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        silent:true,
                        filter:function(event,player){
                return event.skill=='额外回合'&&!player.getStat('damage');
            },
                        content:function(){game.log('没输出要扣血了')
                player.loseHp();
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                    draw:{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        filter:function(event){
                return event.getParent('phase').skill=='额外回合';
            },
                        silent:true,
                        content:function(){game.log('要少摸牌了')
                trigger.num-=(2-player.storage.额外回合);
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
            },
        },
        translate:{
            "后勤":"后勤",
            "后勤_info":"手牌小于4，摸一张。",
            "手枪":"手枪",
            "手枪_info":"挑战锁定技，游戏开始时，你将一张【幸运】【炮火准备】和一张【望远镜】置入你的装备区。你装备区内的武器牌和宝物牌不能被其他角色弃置。",
            "炮火准备1":"炮火准备1",
            "炮火准备1_info":"e",
            "雪见_双刃":"雪见_双刃",
            "雪见_双刃_info":"当你的武器牌被替换时，你可以将其置于你的武将牌上，并获得此装备的武器效果（不含距离），仙剑奇侠传角色包雪见的技能",
            "重炮":"重炮",
            "重炮_info":"在没有杀或者不能出杀时，可弃置最多五张同花牌，耗n-1滴血，n为弃牌数,对你选择的目标视为出n-1个杀，<br>弃置达到（4，5）时使用的杀拥有属性杀，极限4发，回复出杀次数会生效,技能结束后会获得袭击运输船技能",
            "装甲防护":"装甲防护",
            "装甲防护_info":"受伤后,若你没有护甲，可以弃置一张黑色牌获得1点护甲，hujiahuode现在只消耗手牌了",
            "航母":"航母",
            "航母_info":"出杀次数1，手牌上限+1，血量一般的舰船，能在每一轮开始时攻击三次，在优秀的队友帮助下避开抽卡高峰期发挥火力,但过牌少，没有强制命中，对阵多个轻型单位时很弱。死而复生后获得青囊和胆守回复状态。",
            "远航":"远航",
            "远航_info":"最后的幸运，各摸牌技能每个回合限2次：任何阶段，手牌使用后少于手牌上限的一半加1时摸1+x张牌,之后于自己回合结束前只抽一张（可以通过强化提升x值），若没有使用技能，会在回合结束时摸一张牌；<br>可以为队友递杀，进入、脱离濒死时，你摸一牌；死亡后，令一名角色摸三张牌。<br>没有铁索连环时，火杀额外滞留1点燃烧伤害，冰杀对护甲加1伤，雷杀可以穿透护甲。<br>可以消耗装备，修改舰船的属性；可以消化同花牌，提升血量上限。双刃与精械是参考时遗留的技能，应该不影响局内对战。",
            "高爆弹":"高爆弹",
            "高爆弹_info":"改为火属性高爆弹（命中后，目标出牌结束时受到一点伤害，并摸一张牌）,没有青釭剑的效果",
            "潜艇":"潜艇",
            "潜艇_info":"出杀次数1，手牌上限+3，攻击距离-1，锦囊不变。有多个能削弱对手的技能，改造后可以增加锦囊牌伤害，还有开幕两杀，但手短，想用杀得拿到武器，幸运的是潜艇只会受到1点伤害，还可以复活获得八阵、看破和火攻技能。",
            "战列舰":"战列舰",
            "战列舰_info":"出杀次数1，手牌上限+1，这是通过主动耗血耗牌来最大化输出的攻击舰船，有丈八虚拟杀和贯石斧强中，受伤可以弃置黑色牌获得护甲，可以弃置手牌杀最多六次，但很快就会打空牌，需要给力队友以及双方都残血，濒死复生后获得刚烈、英姿。",
            "轻巡洋舰":"轻巡洋舰",
            "轻巡洋舰_info":"出杀次数2，手牌上限+1，过牌与利用手牌能力优秀的辅助舰船，有八卦给杀闭月看破青囊，缺点是没输出技能的同时怕强中攻击，但其较高的存牌量足以无效对手的锦囊牌，为队友保驾护航。濒死复生后，增加队友摸牌，减少队友攻击所需距离",
            "重巡洋舰":"重巡洋舰",
            "重巡洋舰_info":"出杀次数2，手牌上限+2，杀被闪回复出杀次数，一次高爆弹技能加上贯石斧能令其快速结束与小型舰船的战斗，但没有保命技能，被敌人围住会被暴打。濒死复生后可以扣血保护队友，以及仁德回血。",
            "驱逐舰":"驱逐舰",
            "驱逐舰_info":"出杀次数2，手牌上限+2，有奇门八卦、界仁德、令三人摸一牌以及令一次攻击额外拥有青釭剑和伤害+1，闪避拉满，怕攻击技能和南蛮，适合与队友配合，创造秒杀对面的时机。濒死但被救活后，能把对手的杀从队友传给自己。",
            "回复出杀上限":"回复出杀上限",
            "回复出杀上限_info":"杀被回避会回复当回合出杀次数",
            "先制航空攻击":"先制航空攻击",
            "先制航空攻击_info":"一轮游戏开始时选择发动，你随机弃置两张牌，视为对非友方角色使用万箭齐发，若你仍有手牌，会再弃置一张手牌，视为对你选择的敌人使用冰杀。没有手牌会结束此技能。能加快战局推进。",
            "先制潜艇攻击":"先制潜艇攻击",
            "先制潜艇攻击_info":"一轮游戏开始时选择发动，你先后随机弃置一张牌，视为用冰杀攻击一名你选择的敌人，视为用雷杀攻击你选择的敌人，没有手牌会结束此技能。能加快战局推进。",
            yuanhangmopai:"远航摸牌",
            "yuanhangmopai_info":"全局技能，每名角色的回合限2次，当你的手牌数下降至手牌上限/2+1后，若你没有摸牌标记，你摸1+x张牌，然后获得远航摸牌标记。此后于自己回合结束前，重复触发此技能，你只摸一张牌。可在强化中提升X值",
            huihejieshu:"回合结束",
            "huihejieshu_info":"移除所有进水、减速、燃烧、摸牌标记",
            bingsimosanpai:"濒死而后复生",
            "bingsimosanpai_info":"每当你进入或脱离濒死状态，你可以摸一张牌，脱离濒死状态后，依据舰种获得以下技能：潜艇-断粮（徐晃）、刚烈（夏侯惇）；驱逐-镇卫（文聘）、同疾（袁术）；轻巡-轻巡技能一、轻巡技能二；重巡-刚烈（夏侯惇）、界仁德改（刘备）；战列-刚烈（夏侯惇)；航母-英姿（周瑜）",
            qianghuachuan:"强化舰船",
            "qianghuachuan_info":"每回合限两次，弃置一张装备牌,强化舰船的攻击距离、攻击次数、响应摸牌和防御距离四个属性，在生效四次升级后无法继续强化。(其实专注摸牌就行，强化2次后可以通过改造增加血量上限与强化上限哦)<span class=thundertext>0</span>，<span class=firetext>0</span>，<span class=greentext>0</span>，<span class=yellowtext>0</span>",
            dietogain:"死亡给牌",
            "dietogain_info":"在离开战斗前，你还可以令队友、关注的对象摸三张牌，或许会有转机出现",
            gaizaochuan:"改造",
            "gaizaochuan_info":"当此角色强化了两次以后，你可弃三张同花色的牌，提升一点血量上限，回复两点体力，最大血量大于3会再加1点体力上限,重复改造只会回血。</br>注意,改造舰船将令此舰船受到舰种的属性杀克制，但高血量过牌存牌效果好，。",
            "鱼(雷)攻击":"鱼(雷)攻击",
            "鱼(雷)攻击_info":"改为鱼(雷)攻击,使用杀时一次,令非属性杀获得雷属性（有护甲时穿透护甲；减少舰船防御距离1点，增加舰船被集火的效果；潜艇、驱逐打改造战列加1伤害）以及青釭剑无视防具技能的效果，直到伤害结算完成",
            "轻巡技能":"轻巡技能",
            "轻巡技能_info":"增加队友攻击距离，摸牌阶段队友多摸一张牌",
            "轻巡技能二":"轻巡技能二",
            "轻巡技能二_info":"其他友军攻击时，检索到己方玩家有轻巡技能时攻击距离+1。",
            "减血学技能":"减血学技能",
            "减血学技能_info":"神将包神山识技能，一轮游戏开始时，你可以减1点体力上限，然后将一名其他角色武将牌上的技能加入到你的武将牌上。",
            "燃烧":"燃烧",
            "燃烧_info":"回合结束受到一点火焰伤害，摸一张牌，火杀带来的负面效果",
            "火杀燃烧":"火杀燃烧",
            "火杀燃烧_info":"火杀：令目标回合结束受到一点火焰伤害，摸一张牌，重巡火杀打改造驱逐加1伤。</br>雷杀：有护甲时穿透护甲；减少舰船防御距离1点；增加舰船被集火的效果；潜艇、驱逐雷杀改造战列、航母时加1伤害。</br>冰杀：护甲加1伤；减少对手1点防御距离；战列冰杀打改造重巡加1伤害",
            "减速":"减速",
            "减速_info":"减少1点与其他角色的防御距离，雷杀的效果，不叠加计算",
            "仁德界改":"仁德界改",
            "仁德界改_info":"给队友最多三张牌，一回合限2次，给出第二张牌时，你视为使用一张基本牌",
            "穿甲弹":"穿甲弹",
            "穿甲弹_info":"改为穿甲弹攻击,使用牌时一次,令非属性杀获得冰属性（有护甲时+1伤、减少对手防御距离以及冰杀弃牌的效果，战列冰杀打改造重巡加1伤害）以及无视防具技能，直到伤害结算完成",
            "递杀得牌":"递杀得牌",
            "递杀得牌_info":"只是配合技能布局新样式的标记，已经给队友至少一张杀",
            "递杀蝶舞":"递杀蝶舞",
            "递杀蝶舞_info":"给队友杀,首次给牌自己摸一张",
            "进水":"进水",
            "进水_info":"减少1点手牌上限，在出牌阶段会恢复，冰杀和袭击运输船的效果，不叠加计算也很可怕了",
            "开局摸锦囊":"开局摸锦囊",
            "开局摸锦囊_info":"技能名为魔王的技能，锦囊牌伤害加1（如果已经改造完成）和摸一张锦囊牌",
            "击中得牌":"击中得牌",
            "击中得牌_info":"重炮击中对手，对手摸一张牌",
            "制空权":"制空权",
            "制空权_info":"看破弱化版，将一张黑色手牌当无懈可击使用，每回合限一次。",
            "防空":"防空",
            "防空_info":"X为选择的角色数，当一名角色使用的锦囊牌指定了至少两名角色为目标时，你可以消耗2X的手牌，令此牌对X名角色无效。",
            "袭击运输船":"袭击运输船",
            "袭击运输船_info":"每回合限三次，弃置一张红色牌，随机弃置对手一张手牌或者装备牌，并为对手施加进水debuff。",
            "改良装备":"改良装备",
            "改良装备_info":"出牌阶段，你可以展示一张未强化过的【诸葛连弩】或标准包/军争包/SP包中的防具牌，然后对其进行强化。当你处于濒死状态时，你可以重铸一张防具牌，然后将体力回复至1点。",
            "屯粮油":"屯粮油",
            "屯粮油_info":"其他人回合开始时，若你没有粮，你可以把手牌存于武将牌上，称为粮。粮可以在自己或其他人的回合结束后使用，令你与目标抽一张牌。被火杀命中会失去一枚粮",
            "军辅船":"军辅船",
            "军辅船_info":"几乎没有摸牌阶段，一般不能出杀，但可以给其他人送牌",
            "额外回合":"额外回合",
            "额外回合_info":"祭祀：有护盾就能进行额外回合；发动后重置回合限制技能；额外回合的摸牌数等于护甲数。",
        },
    },
    intro:"制作组群，730255133，括号删除#(滑稽)   建议把其他武将包设为点将才能用，体验闪避航母一堆杀的驱逐、第一轮进水被集火的重巡、开幕后只有1滴血的航母以及一轮四杀的战列舰<br>简单说玩法，闪避（响应）对面的攻击，回复手牌数，强化自己的摸牌，赢得后手优势，在挨打中反击。 <br>没有铁索连环时，雷杀对有护甲的目标流失体力（穿甲），冰杀对有护甲的目标加1伤，火杀会让对手于出牌阶段结束后扣一血。<br>潜艇、驱逐雷杀改造战列、航母，重巡火杀改造驱逐、轻巡，战列冰杀打改造重巡，加1伤。攻击方没有改造也能生效。 <br>卡牌里也有作者尝试的身影，可以编辑牌堆尝试哦。改造前舰种加伤因平衡原因不再启用。",
    author:"※人杰地灵游戏中",
    diskURL:"复制这段内容后打开百度网盘APP，操作更方便哦。链接： https://pan.baidu.com/s/1JTv8QGtFu90UED_ZVYm5-A 提取码：5iox",
    forumURL:"",
    version:"1.03",
},files:{"character":["jingjishen.jpg"],"card":["近距支援.jpg"],"skill":[]}}})