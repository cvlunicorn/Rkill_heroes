game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"舰R牌将",content:function (config,pack){
    if (config.kaishimopao) {
        lib.skill._kaishimopao2={
            superCharlotte: true,usable:1,
			silent: true,
			filter:function(event,player){
        return (game.phaseNumber==1);},
            trigger:{
                global:"useCardToPlayered",
            },
            content:function(){
            if(player.hasSkill('yuanhang')&&!player.hasSkill('kaishimopao')){
                player.addSkill('kaishimopao');
            }},
        }
    };
       if (config.qyzhugeliang) { 
       lib.skill._qyzhugeliang={
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                filter:function(event,player){
        return (event.name!='phase'||game.phaseNumber==0);
    },
                content:function(){
                'step 0'
        if(player.identity=='zhu'){
 event.choiceList=[ ]; event.skills=[ ]; event.cao=cards;event.jieshao=[];
        event.skills=['qixing','nzry_cunmu','huogong','repojun','gushe','new_reyiji'];for(var skill of event.skills){
 event.jieshao.push([skill,'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【'+get.translation(skill)+'】</div><div>'+lib.translate[skill+'_info']+'</div></div>'],);};
   event.choiceList=(event.jieshao);    
        event.first=true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
        var next=player.chooseButton([ '令所有人获得一组技能或一张卡牌的使用权,用于熟悉游戏;这些技能（与附赠的技能）会在下一个回合开始后移除。',[event.choiceList,'textbutton'],]);
       next.set('selectButton',[1]);//可以选择多个按钮，可计算可加变量。
        next.set('ai',function(button){
switch(ui.selected.buttons.length){
case 0: return Math.random();
default: return 0;}});
 }
            'step 1'
            game.log(result.links,result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
     if(result.bool){  //player.addMark('Expup',event.cadechangdu);//先给经验再计算         miki_binoculars smyyingshi  gwjingtian gushe tongxie jyzongshi reqiaoshui nlianji zhuandui reluoyi zhongji
    if(result.bool!='cancel2'){game.log();var targets=game.filterPlayer();
 var f=result.index;for(var i=0;i<targets.length;i++){
 if(result.links.contains('qixing')){targets[i].addTempSkill('qixing','roundStart');targets[i].addTempSkill('qixing2','roundStart')};
 if(result.links.contains('reguanxing')){targets[i].addTempSkill('reguanxing','roundStart');targets[i].addTempSkill('nzry_cunmu','roundStart');targets[i].addTempSkill('gwjingtian','phaseZhunbeiBegin');if(i<targets.length/2-1){var s=targets.length-i;targets[s].useSkill('reguanxing');};};
 if(result.links.contains('repojun')){targets[i].addTempSkill('repojun','roundStart');targets[i].addTempSkill('zhongji','roundStart');targets[i].addTempSkill('tongxie','roundStart');targets[i].addTempSkill('kaikang','roundStart')};
 if(result.links.contains('gushe')){targets[i].addTempSkill('gushe','roundStart');targets[i].addTempSkill('nlianji','roundStart');targets[i].addTempSkill('songshu','roundStart');targets[i].addTempSkill('weimu','roundStart');};
 if(result.links.contains('new_reyiji')){targets[i].addTempSkill('jianxiong','roundStart');targets[i].addTempSkill('reganglie','roundStart');targets[i].addTempSkill('new_reyiji','roundStart');};
 if(result.links.contains('huogong')){targets[i].chooseUseTarget({name:'jiu'});targets[i].chooseUseTarget({name:'huogong'});};};
        };
    }},}};
        if (config.yidong){
        lib.skill._yidong={
        name:"移动座位",
        prompt:"与相邻的队友交换座次，适合互相攻击临近的目标。<br>事件过程为：双方交换座次，之后若你的座次靠后并处于出牌阶段，<br>翻面，目标获得额外回合。",
                enable:"phaseUse",
                usable:1,
                filterTarget:function(card,player,target){
        return get.attitude(player,target)>0&&player!=target&&target==player.next||target==player.previous;
    },
                selectTarget:1,
                filter:function(event,player){return  player.hasSkill('yuanhang')},
                content:function(){game.log(game.countPlayer(function(current){return current!=player&&(get.distance(current,player)==1&&player.countCards('h',function(card){return get.type(card,'trick')=='trick'})||get.distance(current,player,'attack')==1&&lib.filter.cardUsable({name:'sha'},player))&&get.attitude(player,current)<0}));
                game.swapSeat(player,target);
        if(target==player.previous){
        var evt=_status.event.getParent('phaseUse');
        if(evt&&evt.name=='phaseUse'){//player.turnOver();
        target.insertPhase();event.finish();}};
    if(target==player.next){target.turnOver();event.finish()};
 },
                ai:{
                    order:1,
                    result:{
                        target:function(player,target){
                       var ziji=game.countPlayer(function(current){return current!=player&&(get.distance(current,player)==1||get.distance(current,player,'attack')==1)&&get.attitude(player,current)<0}),mubiao=game.countPlayer(function(current){return current!=player&&(get.distance(current,player)==2&&get.distance(current,player,'pure')==2)&&get.attitude(player,current)<0});
                if(player.hasUnknown()||ziji>0||mubiao>0) return 0;
                var distance=Math.pow(get.distance(player,target,'absolute'),2);
                if(!ui.selected.targets.length) return distance;
                var distance2=Math.pow(get.distance(player,ui.selected.targets[0],'absolute'),2);   return Math.min(0,distance-distance2);},},},
                intro:{content:function(){return get.translation('_yidong2_info');},},
        }
        lib.skill._tiaozhan3={
            superCharlotte: true,
			silent: true,
			usable:1,
			filter:function(event,player){
        return (game.phaseNumber==1);},
            trigger:{
                global:"useCardToPlayered",
            },
            content:function(){
if(player.hasSkill('yuanhang')){if(!player.hasSkill('gzbuqu')&&get.mode()=='boss'){player.addSkill('gzbuqu');player.loseHp(player.hp-1);player.draw(player.hp-1);};
if(!player.hasSkill('rendeonly2')){player.addSkill('diewulimitai');};
            }},
            }
    };
	if(config.jianrjinji){
		for(var i in lib.characterPack['jianrjinji']) {
			if(lib.character[i][4].indexOf("forbidai")<0) lib.character[i][4].push("forbidai");
		};
	};//选项触发内容，原因见config
	
},precontent:function(jianrjinji){

	if(jianrjinji.enable){
		//武将包,"qigong","qingnang"
		game.import('character',function(){
			var jianrjinji={
				name:'jianrjinji',//武将包命名（必填）
				connect:true,//该武将包是否可以联机（必填）,"xianjinld""zhiyangai","baiyin_skill",
		character:{
            liekexingdun:["female","wu",4,["kanpolimitai","roundonefire","hangmucv","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["zhu","des:血量中等的航母，温柔，体贴，过渡期追着大船打的航母。"]],
            chicheng:["female","wu",4,["kanpolimitai","roundonefire","hangmucv","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["des:大佬友情放出精美壁纸，坚定与自信的姿态"]],
            bisimai:["female","shu",4,["huokongld","zhuangjiafh","fupaozu","ganglie_gai","yuanhang","zhanliebb","jianzaochuan","wulidebuff","qianghuazhuang"],["zhu","des:更多刮痧，更多力量，更多护甲，更高血量。"]],
            misuli:["female","shu",4,["huokongld","zhuangjiafh","fupaozu","ganglie_gai","yuanhang","zhanliebb","jianzaochuan","wulidebuff","qianghuazhuang"],["des:用精巧的手枪去质疑，用绝对的火力回击对手。"]],
            kunxi:["female","shu",4,["huokongld","zhuangjiafh","fupaozu","zhongxunca","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["des:画师优秀的功底让这名角色美而可爱，这是出色的角色塑造。"]],
            ougengqi:["female","shu",4,["huokongld","zhuangjiafh","fupaozu","zhongxunca","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["des:励志偶像，与标志性舰装，可惜没有适合的图与技能用于无名杀"]],
            yixian:["female","wei",3,["fangkong2","huibi","yuanhang","qingxuncl","jianzaochuan","wulidebuff","qianghuazhuang"],["des:经典美术设计的款式，意气风发，威猛先生"]],
            haiwangxing:["female","wei",3,["fangkong2","huibi","yuanhang","qingxuncl","jianzaochuan","wulidebuff","qianghuazhuang"],["des:阻敌计谋表现优秀，这是先发制敌的优势所在，"]],
            rending:["female","wei",3,["fangkong2","huibi","yuanhang","qingxuncl","jianzaochuan","wulidebuff","qianghuazhuang"],["des:手持竹伞的轻巡，辅助队友，防御攻击。"]],
            "z31":["female","wei",3,["huibi","rendeonly2","yuanhang","quzhudd","jianzaochuan","wulidebuff","qianghuazhuang"],["des:婚纱与轻纱是多数人的美梦,与绿草平原，与绿水青山"]],
            xuefeng:["female","wei",3,["huibi","rendeonly2","yuanhang","quzhudd","jianzaochuan","wulidebuff","qianghuazhuang"],["des:幸运的驱逐舰，多位画师、花了大款的大佬亲情奉献。"]],
            kangfusi:["female","wei",3,["huibi","rendeonly2","yuanhang","quzhudd","jianzaochuan","wulidebuff","qianghuazhuang"],["des:水手服欸,优秀的构图，不过图少改造晚。"]],
            lizhan:["female","shu",4,["huibi","rendeonly2","yuanhang","quzhudd","jianzaochuan","wulidebuff","qianghuazhuang"],["des:这是个依赖科技的舰船，有着科幻的舰装，与兼备温柔体贴与意气风发的表现。"]],
            "u1405":["female","shu",2,["rendeonly2","roundonefire","qianting","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["des:无需隐匿的偷袭大师，马上就让对手的后勤捉襟见肘。"]],
            jingjishen:["female","wu",3,["junfu","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["des:需要武器支援，伙计倒下了。"]],
            changchun:["female","wu",3,["daoqu","tianyi","huokongld","yuanhang","jianzaochuan","wulidebuff","qianghuazhuang"],["des:尚处于正能量之时。"]],
        },
        skill:{
            tiaozhanzhuanbei:{
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                firstDo:true,
                filter:function(event,player){//"huijiahuihe",
        return (event.name!='phase'||game.phaseNumber==0)&&get.mode()=='boss';
    },
                content:function(){
    if(player.hasSkill('qianting')){player.equip(game.createCard2('yuleiqianting3','club',0));player.equip(game.createCard2('xingyun','club',0));};
    if(player.hasSkill('quzhudd')){player.equip(game.createCard2('quzhupao3','club',0));player.equip(game.createCard2('xingyun','club',0));};
    if(player.hasSkill('qingxuncl')){player.equip(game.createCard2('qingxunpao3','club',0));player.equip(game.createCard2('xingyun','club',0));};
    if(player.hasSkill('zhongxunca')){player.equip(game.createCard2('zhongxunpao3','club',0));player.equip(game.createCard2('huokongld','club',0));};
    if(player.hasSkill('zhanliebb')){player.equip(game.createCard2('zhanliepao3','club',0));player.equip(game.createCard2('huokongld','club',0));};
    if(player.hasSkill('hangmucv')){player.equip(game.createCard2('zhandouji3','club',0));player.equip(game.createCard2('tansheqi3','club',0));};
    if(player.hasSkill('junfu')){player.equip(game.createCard2('yuleiji3','club',0));player.equip(game.createCard2('xingyun','club',0));};      
    if(player.hasSkill('daoqu')){player.equip(game.createCard2('jianzaidaodan3','club',0));player.equip(game.createCard2('fasheqi3','club',0));};   
        
       player.equip(game.createCard2('xingyun','club',0));
        player.equip(game.createCard2('miki_binoculars','diamond',0));
    },
                mod:{canBeDiscarded:function(card){
if(get.position(card)=='e'&&get.mode()=='boss'&&['equip1','equip5','equip6'].contains(get.subtype(card))) return false;},},
                intro:{content:function(){return get.translation(skill+'_info');},},
            },
            danzong:{
                trigger:{
                    player:"useCard1",
                },
                filter:function(event,player,card){var chusha=player.getAllHistory('useCard',function(evt){
 return get.name(evt.card,'sha')=='sha'; }).length,danzong=player.getAllHistory('useSkill',function(evt){return evt.skill=="danzong";}).length;var e=Math.random(),f=0.4;if(player.hasSkill('quzhudd'))var f=0.35;if(player.hasSkill('qingxuncl'))var f=0.45;if(player.hasSkill('zhongxunca'))var f=0.55;
 return event.card.name=='sha'&&!event.card.nature&&!player.hasSkill('danzong_damage')&&e<f||chusha>danzong*4+4;
    },
                audio:"ext:1牌将修改:true",
                usable:2,
                priority:2,
                name:"弹种",
                check:function(event,player){//"useCard1",history.length%5==0;
        var eff=0;
        for(var i=0;i<event.targets.length;i++){
            var target=event.targets[i];
            var eff1=get.damageEffect(target,player,player);
            var eff2=get.damageEffect(target,player,player,'fire');
           if(player.hasSkill('quzhudd')||player.hasSkill('qianting'))var eff2=get.damageEffect(target,player,player,'thunder');
             if(player.hasSkill('zhanliebb')||player.hasSkill('hangmucv'))var eff2=get.damageEffect(target,player,player,'thunder');
            eff+=eff2;
            eff-=eff1;
        }
        return eff>=0;
    },
                prompt:function(event,player){
   {if(player.hasSkill('quzhudd')||player.hasSkill('qianting')) {return '穿甲鱼雷'};
   if(player.hasSkill('zhanliebb')||player.hasSkill('hangmucv')) {return '弃牌穿甲弹'};
    return '点燃'};
    },
                "prompt2":function(event,player){var evt= event;
        var chusha=player.getAllHistory('useCard',function(evt){
 return get.name(evt.card,'sha');}).length,danzong=player.getAllHistory('useSkill',function(evt){return evt.skill=="danzong";}).length;
        var tishi='总计可用'+Math.floor(chusha/4-danzong)+'次，每回合限2次，令非属性'+get.translation(event.card)+'在计算伤害前：<br>',xiaochuan=player.hasSkill('quzhudd')||player.hasSkill('qianting'),dachuan=player.hasSkill('zhanliebb')||player.hasSkill('hangmucv');
   {if(xiaochuan) {tishi+=('获得雷属性（命中后：目标有护甲时，伤害穿透护甲；减少对手1点防御距离)。<br>被集火了，快跑')};
   if(dachuan) {tishi+=('获得雷属性（命中后：目标有护甲时，加1伤；减少对手1点手牌上限；放弃伤害，改为弃置对手的卡牌）<br>一般般啦，绝境求生。')};
  if(!dachuan&&!xiaochuan)
   {tishi+=('获得火属性（命中后：目标出牌阶段结束时受到一点火焰伤害，并摸一张牌）。<br>团战利器')}};tishi+=('，每使用三张杀，使用次数+1');return tishi
    },
                content:function(){//player.addTempSkill('qinggang_skill','useCard1');
        var chusha=player.getAllHistory('useCard',function(evt){
 return get.name(evt.card,'sha'); }).length,danzong=player.getAllHistory('useSkill',function(evt){return evt.skill=="danzong";}).length;
 //return event.card.name=='sha'&&!event.card.nature&&chusha/2-danzong>0;   
        game.log(chusha,danzong);
       if(1>2){trigger.card.nature='fire';
        if((player.hasSkill('quzhudd')|player.hasSkill('qianting'))){ trigger.card.nature='thunder'};        if((player.hasSkill('zhanliebb')|player.hasSkill('hangmucv'))){trigger.card.nature='thunder'; player.addTempSkill('hanbing_gai','damageEnd');};
        if(get.itemtype(trigger.card)=='card'){
            var next=game.createEvent('zhuque_clear');
            next.card=trigger.card;
            event.next.remove(next);
            trigger.after.push(next);
            next.setContent(function(){
                delete card.nature;
            });}
        }else player.addSkill('danzong_damage')  ;
    },
                subSkill:{
                    damage:{
                        equipSkill:true,
                        frequent:true,
                        trigger:{
                            source:"damageBefore",
                        },
                        filter:function(event,player,card){
 return !event.nature;   
    },
                        prompt:"增强杀",
                        "prompt2":"下一次造成伤害时，可以改变伤害属性（接近伤害的触发时机,几乎就是个特效）",
                        content:function(){//player.addTempSkill('qinggang_skill','useCard1');
        trigger.nature='fire';
       if((player.hasSkill('quzhudd')|player.hasSkill('qianting'))){ trigger.nature='thunder'};        if((player.hasSkill('zhanliebb')|player.hasSkill('hangmucv'))){trigger.nature='thunder'; player.addTempSkill('hanbing_gai','damageEnd');};
        player.removeSkill('danzong_damage');},
                        mark:true,
intro:{marktext:"增强",content:function(player){return ('下一次造成伤害时，可以改变伤害属性（接近伤害的触发时机,几乎就是个特效）');},},
                        sub:true,},},
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            kaishimopao:{
                audio:"ext:1牌将修改:2",
                group:["kaishimopao_jieshu","kaishimopao_mark","kaishimopao_discover","kaishimopao_draw","kaishimopao_jieshudraw"],
                subSkill:{
                    jieshu:{
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        fixed:true,
                        silent:true,
                        friquent:true,
                        content:function(){
                'step 0'
 if(player.countMark('kaishimopao_jieshudraw')){player.draw(player.countMark('kaishimopao_jieshudraw')); player.removeMark('kaishimopao_jieshudraw',player.countMark('kaishimopao_jieshudraw'))}; 
    },
                        sub:true,
                        forced:true,
                        popup:false,
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                    mark:{
                        priority:1,
                        trigger:{
                            player:"gainBegin",
                            global:"phaseBeginStart",
                        },
                        silent:true,
                        filter:function(event,player){
        return event.name!='gain'||player==_status.currentPhase;    },
                        content:function(){
        if(trigger.name=='gain'&&!player.isPhaseUsing()) trigger.gaintag.add('kaishimopao');else player.removeGaintag('kaishimopao');},
                        sub:true,
                        forced:true,
                        popup:false,
                        mark:false,
                        intro:{marktext:"摸牌",content:function(player){return ('摸牌阶段获得的一些牌');},},
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                    discover:{
                        trigger:{
                            player:"phaseDrawEnd",
                        },
                        forced:true,
                        filter:function(event,player){//xinfu_bijing
                return player.getCards('h',function(card){
                    return card.hasGaintag('kaishimopao');
                }).length>1;
            },
                        content:function(){
                 'step 0'
                event.cards=player.getCards('h',function(card){return card.hasGaintag('kaishimopao'); });   
                player.chooseToDiscard('he',false,event.cards.length).set('prompt2','弃置于摸牌阶段获得的牌数，然后随机获得一张你指定类别的卡牌。').set('ai',function(card){
          　if(ui.selected.cards.length>2) return -1;
            if(card.name=='tao') return -10;
            if(card.name=='jiu'&&_status.event.player.hp==1) return -10;
            return get.unuseful(card)+2.5*(5-get.owner(card).hp);
        });
                                         'step 1'
        if(result.bool){
            player.chooseControl('<span class=yellowtext>基本','<span class=yellowtext>装备','<span class=yellowtext>锦囊','cancel2').set('prompt',get.prompt('kaishimopao')).set('prompt2','选择一张牌并发现之').set('ai',function(event,player){  var player=_status.event.player;  return 1;        });};
               'step 2'
    if(result.control!='cancel2'){
                game.log();var i=result.index;if(i==0){var a=('basic')};if(i==1){var a=('equip')};if(i==2){var a=('trick')};
        event.cards=[];
        var cardPile=Array.from(ui.cardPile.childNodes);
        var discardPile=Array.from(ui.discardPile.childNodes);
        var cardList=cardPile.concat(discardPile);
        event.cards.addArray(cardList.filter(function(card){
            return get.type(card,a)==a;game.log(get.type(card,a)==a);
        }));
        player.gain(event.cards[0],'gain2');
            }},
                        sub:true,
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                    draw:{
                        priority:4,
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        content:function(){
                'step 0'
for(var i=0;i<trigger.num;i+=(1)){if(trigger.num>0&&player.countMark('kaishimopao_draw')){trigger.num-=(1);player.removeMark('kaishimopao_draw',1)}}
            },
                        sub:true,
                        forced:true,
                        popup:false,
                        mark:false,
                        intro:{
                            marktext:"减摸牌数",
                            content:function(player){return ('减少1点摸牌'); },
                        },
                    },
                    jieshudraw:{
                        trigger:{
                            player:"phaseJudgeBefore",
                        },
                        forced:true,
                        prompt:"闭月",
                        filter:function(event,player){return player.countCards('j')>0},
                        usable:1,
                        content:function(){
                 'step 0'
                player.chooseControl('<span class=yellowtext>少摸一张牌'+'</span>','cancel2').set('prompt',get.prompt('判定藏牌')).set('prompt2','准备阶段，若你的判定区有牌时，<br>你可以令自己的摸牌阶段少摸一张牌，<br>然后在自己的回合结束时摸一张牌。').set('ai',function(event,player){  var player=_status.event.player;  return 0;        });
                 'step 1'
                  if(result.control!='cancel2'){player.addMark('kaishimopao_jieshudraw');player.addMark('kaishimopao_draw');};
    },
                        sub:true,
                        mark:false,
                        intro:{
                            marktext:"闭月",
                            content:function(player){
            return ('结束时摸一张牌');
        },
                        },
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            jianzaochuan:{
                enable:"chooseToUse",
                limited:false,
                complexCard:true,
                filter:function(event,player){var info=lib.skill.qianghuazhuang.getInfo(player);var a=info[0]+info[1]+info[2]+info[3];
   if(event.type=='dying'){if(player!=event.dying) return false; return player.countCards('hejs')>=3;}
else if(event.parent.name=='phaseUse'&&(a)>0){return (player.countCards('hejs')>=2)&&a;    }return false;
     },
                selectCard:function(event,player){var event=_status.event;if(event.type=='dying')return [4,4];return [3,3];},
                position:"hejs",
                filterCard:function (card){
        var suit=get.suit(card);
        for(var i=0;i<ui.selected.cards.length;i++){
            if(get.suit(ui.selected.cards[i])==suit) return false;
        }
        return true;
    },
                check:function(card){
        var player=_status.event.player;var event=_status.event;var huifu=player.countCards('h','jiu')+player.countCards('h','tao');
       if(player!=event.dying&&(player.hp<player.maxHp)&&(player.countCards('h')>4||!player.hasMark('jianzaochuan'))) return 11-get.value(card);
        if(player.hp<=0&&(huifu<(-player.hp+1)||!player.hasMark('jianzaochuan')))  return 15-get.value(card);
    },
                prompt:function(event,player){//<br>或弃置三张牌，回复一点血量。或弃置四张牌，回复两点体力
   if(event.parent.name=='phaseUse') {return '1.出牌阶段<br>你可以弃置3张不同花色的牌，提升一点血量上限。'}; if(event.type=='dying') {return "2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。"};},
                content:function(){player.addMark('jianzaochuan');game.log(event.parent.name,event.cards);
if(event.cards.length<3){player.gainMaxHp(1);};if(event.cards.length>2){player.gainMaxHp(1);};if(event.cards.length>3){player.recover();};
},
                ai:{
                    save:true,
                    expose:0,
                    threaten:0,
                    order:2,
                    result:{
player:function(player){var huifu=player.countCards('h','jiu')+player.countCards('h','tao');
if(player.hp<=0&&(huifu<(-player.hp+1)||!player.hasMark('jianzaochuan'))) return 10;
if((player.hp<player.maxHp)&&(player.countCards('h')>4)) {return 10;};
                return 0;},},},
                mark:false,
                intro:{content:function(){return get.translation('建造的次数，用于提升升级上限。');},},
            },
            "paohuozb_skill":{
mod:{maxHandcard:function(player,num){return num-1;},
cardUsable:function(card,player,num){if(card.name=='sha') return num+1;},},
  trigger:{
player:"equipAfter",
},
forced:true,
equipSkill:true,
filter:function(event,player){
        return event.card.name=='paohuozb';
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
            fupaozu:{
                enable:"phaseUse",
                usable:1,
                complexCard:true,
                selectCard:[2,5],
                filterTarget:function(card,player,target){  if( target!=player&&target.inRange(player))return true;    },
                filter:function(event,player){
        return !player.countCards('h','sha')||!player.canUse('sha',player);
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
                prompt:"你可以弃置最多五张相同花色的牌，并摸等量的牌,目标摸n-1张牌<br>然后你与目标轮流视为对对方使用一张决斗,<br>直到双方的决斗次数超过2n，n为你弃置的牌数。<br>你使用的第3、4张决斗的属性为火。",
                content:function(){
'step 0'//你获得技能[]player.addTempSkill('touxichuan','phaseAfter');
event.num=event.cards.length;
    var d=game.countPlayer(function(current){ return current!=player&&(get.attitude(player,current)<1)&&(current.hasSkill('bagua_skill')|current.hasSkill('re_bagua_skill'));  });
 game.log('有八卦的角色:',d);
        player.chooseTarget(get.prompt2('选择攻击目标'),function(card,player,target){
            return target.maxHp>0&&player.inRange(target);
        }).set('ai',function(target){
            var att=-get.attitude(_status.event.player,target);
            if(target.hasSkill('zhanliebb')|target.hasSkill('hangmucv')){ att*=1.1};
    if(Math.ceil(target.hp*2)<=target.maxHp){ att*=1.3};if(target.countCards('h')<3){ att*=1.3};
    if(target.hasSkill('bagua_skill')|target.hasSkill('re_bagua_skill')){ att*=0.5};
             return att
        });
        'step 1'
        if(result.bool){
event.target=result.targets[0];player.draw(event.num);event.target.draw(event.num-1);
if(event.num>1){ player.useCard({name:'juedou'},event.target);event.target.useCard({name:'juedou'},player);};
if(event.num>2){ player.useCard({name:'juedou'},event.target);event.target.useCard({name:'juedou'},player);};
if(event.num>3){ player.useCard({name:'juedou',nature:'fire',isCard:false},event.target);event.target.useCard({name:'juedou'},player);};
if(event.num>4){ player.useCard({name:'juedou',nature:'fire',isCard:false},event.target);event.target.useCard({name:'juedou'},player);};
}else event.finish();
  },
                ai:{
                    expose:0,
                    threaten:0.8,
                    order:4,
                    result:{
                        target:function(target,player){if(get.attitude(player,target)<0&&target.inRange(player)){
        if(player.countCards('he')>3){if(target.countCards('h')<4)return -2;return -1};return 0};
    },
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill);
        },
                },
            },
            zhuangjiafh:{
            mod:{maxHandcard:function(player,num){var a=0;if(player.hujia>0){a+=(player.hujia)};return num=(num-a);},},
                trigger:{
                    player:["recoverEnd","damageEnd"],
                },
                direct:true,
                firstDo:true,
                usable:6,
                filter:function(event,player){return true},
                content:function(){
        'step 0'
      //  game.log(event.triggername,!trigger.hujia);//灵血
        if(event.triggername=='damageEnd'&&!player.countCards('h',{color:'red'})&&!trigger.hujia&&player.hujia==0){player.changeHujia(1);};
        if(player.countCards('h',{color:'red'})){
        var next=player.chooseToDiscard('hejs',{color:'red'},[1,3],get.prompt('叠甲'),('你拥有护甲时，会减少等同于护甲值的手牌上限。<br>每当你结算完回复的血量/受到的伤害时,<br>你可以弃置至多三张红色牌，获得X点护甲。（X为弃牌数）<br>若你没有红色牌，且没有用护甲承受过此次伤害，<br>你在伤害结算后获得1点护甲。<br>你的回合结束后，会清除你的护甲，然后摸等量的牌'));
        next.ai=function(card){var player=_status.event.player;
         if(player.countCards({name:'tao'})&&player.hasSkill('lingxue'))return -1;
         if(event.triggername=='damageBefore'&&event.nature=="thunder")return-1;
         return 8-get.value(card);
        };
        next.logSkill='zhuangjiafh'};
        'step 1'
        if(result.bool&&result.cards){var num=result.cards.length;player.changeHujia(num);}
    }, 
       group:["zhuangjiafh_hujialose"],
       subSkill:{hujialose:{
                trigger:{
                    player:"phaseEnd",
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
                },
            },
            hangmucv:{
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            yuanhang:{
                group:["yuanhang_mopai","yuanhang_kaishi","yuanhang_bingsimopai","yuanhang_dietogain","tiaozhanzhuanbei"],
                mod:{
                    maxHandcard:function(player,num){var a=0;if(player.hasSkill('qianting')){var a=a+1};
       if(player.hp<player.maxHp){ a+=(1)}; if(player.hp<=0){ a+=(1)};
         return num=(num+a);},
                    },
                trigger:{
                    global:"phaseBefore",
                    player:"enterGame",
                },
                forced:true,
                filter:function(event,player){
        return (event.name!='phase'||game.phaseNumber==0);
    },
                content:function(){
        if(player.identity=='zhu'){
 player.changeHujia(1);game.log()
        };
    },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
                subSkill:{
                    mopai:{
                        trigger:{
                            player:"loseAfter",
                            global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter"],
                        },
                        "prompt2":"当你有摸牌标记时，你失去手牌后能摸1张牌，然后失去1个摸牌标记，其他人回合开始时回复一个标记，自己回合暂时+1标记上限并回满标记，标记上限x个，可在强化中提升X值。",
                        frequent:true,
                        filter:function(event,player){
        var d=(player.getHandcardLimit()/2),a=0;if(player==_status.currentPhase){a+=(1)};
        if(player.countCards('h')>d) return false;
        var evt=event.getl(player);
        if(!player.countMark('yuanhang_mopai'))return false;
        return evt&&evt.player==player&&evt.hs&&evt.hs.length>0;
    },
                        content:function(){
                player.draw(1);player.removeMark('yuanhang_mopai');
    },
                        intro:{
                            marktext:"摸牌",
                            content:function(player,mark){;var a=game.me.countMark('yuanhang_mopai');
            return '手牌较少时，失去手牌可以摸一张牌，还可以摸'+a+'次';
        },
                        },
                        sub:true,
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                    kaishi:{
                        trigger:{
                            global:"phaseBegin",
                        },
                        fixed:true,
                        silent:true,
                        friquent:true,
                        content:function(){//else if(!player.countMark('mopaiup')<1&&player.countCards('h','shan')<1){player.draw()}
        var a=player.countMark('mopaiup');var b=player.countMark('yuanhang_mopai');game.log(event.skill!='huijiahuihe');
        if(player==_status.currentPhase&&event.getParent('phase').skill!='huijiahuihe'){a+=(1);if(a-b>0) player.addMark('yuanhang_mopai',a-b);};
        if(a>b&&player!=_status.currentPhase){player.addMark('yuanhang_mopai',1);};    },
                        sub:true,
                        forced:true,
                        popup:false,
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                    dietogain:{
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
        event.count--;//让优势方有一轮的挑战，因为第二轮对手就因为过牌量下降而失去威胁。
        player.chooseTarget(get.prompt2('在离开战斗前，若你的身份：<br>是忠臣，你可令一名角色摸2张牌；<br>是反贼，令一名角色摸1张牌；<br>内奸，令一名角色获得一张闪。<br>或许会有转机出现。'),function(card,player,target){
            return target.maxHp>0;
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            var draw=Math.max(3,player.maxHp+1);
            if(target==trigger.source) att*=0.35;
            if(target.hasSkill('zhanliebb')) att*=1.05;
                return att
        });
        'step 2'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
            player.logSkill('yuanhang_dietogain',target);
         //   if(target==trigger.source){target.draw(Math.max(1,player.maxHp))}else
 if(player.identity=='zho'){target.draw(2);};
 if(player.identity=='nei'){target.gain(game.createCard('shan'),'gain2');};
 if(player.identity=='fan'){target.draw(1);};
        }
        else event.finish();
    },
                        sub:true,
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                    bingsimopai:{
                        trigger:{
                            player:"changeHp",
                        },
                        filter:function(event,player){
        return player.hp<=0&&event.num<0},
                        name:"濒死摸牌",
                        "prompt2":function(event,player){
   if((player.hasMark('yuanhang_bingsimopai'))) {return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你需失去一点体力上限，摸一张牌。'};
 if((!player.hasMark('yuanhang_bingsimopai'))) {return '当你进入濒死状态时，你可以摸一张牌,<br>若血量上限大于2，你需失去一点体力上限，摸一张牌。同时，依据舰种获得以下技能：<br>潜艇-志继（姜维）、重生（）；驱逐-镇卫（文聘）、齐攻（）；<br>轻巡-齐攻；重巡-刚烈改（改自夏侯惇）；<br>战列-刚烈改（夏侯惇)；航母-界连营（陆逊）；军辅：藏匿（）；导驱-界连营（陆逊）'}; },
                        usable:2,
                        fixed:true,
                        content:function(){//兵粮寸断与据守，刚烈，     镇卫同疾吸伤害，国风防锦囊牌。
        //轻巡提升己方防守与攻击距离，粮策全体发牌。  重巡提供免伤。战列刚烈反击。 
        player.draw(1);if(player.maxHp>2){player.loseMaxHp(1);player.draw();}else game.playAudio('..','extension','舰R牌将/audio','bingsimosanpai');if(player.maxHp>5){player.loseMaxHp(1);player.draw();game.log('血量上限好高啊，额外来一次扣血摸牌吧',player);}
     if(!player.hasMark('yuanhang_bingsimopai')){
   // if(player.hasSkill('qianting')){player.addSkill('olzhiji');;};
    if(player.hasSkill('quzhudd')){player.addSkill('hzhenwei');player.addSkill('qigong')};
    if(player.hasSkill('qingxuncl')){player.addSkill('qigong')};
    if(player.hasSkill('zhongxunca')){player.addSkill('ganglie_gai')};
    if(player.hasSkill('zhanliebb')){player.addSkill('ganglie_gai')};
    if(player.hasSkill('hangmucv')){player.addSkill('relianying')};
   if(player.hasSkill('junfu')){player.addSkill('spcangni')};      
   if(player.hasSkill('daoqu')){player.addSkill('relianying')};   
  }; trigger.player.addMark('yuanhang_bingsimopai',1); },
                        mark:false,
                        intro:{
                            marktext:"濒死",
                            content:function(player){
            var player=_status.event.player,a=player.countMark('yuanhang_bingsimopai'),tishi='因濒死而减少的体力上限，牺牲上限，获得应急的牌，保一时的平安。<br>';if(a>0&&a<2&&player.hp<=2){tishi+=('勇敢的前锋<br>')};if(a>2&&a<4&&player.hp<=2){tishi+=('英勇的中坚<br>')};if(a>4&&player.hp<=2){tishi+=('顽强的、折磨对手的大将<br>')};
            return tishi;  },
                        },
                        sub:true,
                        "audioname2":{
                            "key_shiki":"shiki_omusubi",
                        },
                    },
                },
            },
            zhanliebb:{
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            qingxuncl:{
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            zhongxunca:{
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            misscoversha:{
                trigger:{
                    player:"shaMiss",
                },
                silent:true,
                filter:function(event){//return event.getParent(2).name=='fupaozu'
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
            roundonefire:{
                audio:"ext:1牌将修改:2",
                trigger:{
                    global:"roundStart",
                },
                lastDo:true,
                "prompt2":function(event,player){event.targets=player.getEnemies();
   var  xiaohao=Math.floor(Math.min(2,event.targets.length/2+0.5));
   var d=game.countPlayer(function(current){return current!=player&&event.targets.contains(current)&&!current.hasSkill('bagua_skill')&&!current.hasSkill('re_bagua_skill')&&!current.hasSkill('tengjia1');});
  var c=game.countPlayer(function(current){return current!=player&&event.targets.contains(current)&&(current.hasSkill('rw_renwang_skill')||current.hasSkill('renwang_skill')||current.hasSkill('tengjia1'));});
   if(player.hasSkill('hangmucv')) {return '（需满足：至少有两张手牌）<br>一轮游戏开始时选择发动，<br>你随机弃置'+xiaohao+'张牌，视为对非友方角色使用万箭齐发，<br>'+xiaohao+'：'+d+'的收益，<br>不必考虑队友状态的技能，但用完后容易去世'};
   if(player.hasSkill('daoqu')) {return '一轮游戏开始时选择发动，<br>你随机弃置一张牌，<br>视为用火杀攻击一名你选择的敌人'};
 if(player.hasSkill('qianting')) {return '一轮游戏开始时选择发动，<br>你随机弃置一张牌，<br>视为用雷杀攻击一名你选择的敌人<br>有'+c+'个目标的防具无法防御虚拟杀和雷杀的组合攻击'};  },
                filter:function(event,player){//意外发现function应用广泛，然而解决不了自动显示隐藏标记。航母开幕，然后根据舰种判断具体出什么杀game.log();
    return player.countCards('h')>0&&player.getEnemies();},
                content:function(){
        'step 0'
event.targets=player.getEnemies();game.playAudio('..','extension','舰R牌将/audio',player.name);
        'step 1'
var e1=player.countCards('e','hangkongzhan'),xiaohao=Math.floor(Math.min(2,event.targets.length/2+0.5));
if(player.countCards('h')>=1&&(player.hasSkill('hangmucv')||e1>0)){if(player.countCards('h')>=0&&xiaohao>=2){player.discard(player.getCards('h').randomGet());};player.update();player.discard(player.getCards('h').randomGet());player.useCard({name:'jinjuzy',nature:'thunder'},event.targets)};                  //wanjian,jinjuzy                                                 
'step 2'
a=game.countPlayer(function(current){return get.attitude(player,current)<0&&current.inRange(player)})-1;
        if(a=0)event.finish();
if(player.hasSkill('qianting')){player.chooseTarget(get.prompt2('选择杀的目标'),function(card,player,target){
            return target.maxHp>0&&player.inRange(target);
        }).set('ai',function(target){
            var att=-get.attitude(_status.event.player,target);
            if(target.hasSkill('zhanliebb')|target.hasSkill('zhanliebb')){ att*=1.5};
    if(Math.ceil(target.hp*2)<=target.maxHp){ att*=2};
    if(target.hasSkill('bagua_skill')|target.hasSkill('re_bagua_skill')){ att*=0.5};
             return att});}else event.finish();
        'step 3'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
if(player.countCards('h')>0&&player.hasSkill('qianting')){player.discard(player.getCards('h').randomGet()),player.useCard({name:'sha',nature:'thunder',isCard:true},event.target);}
}else event.finish();},
                intro:{
                    content:function(){return get.translation(skill+'_info');},
                },
            },
            xianjinld:{
                enable:"phaseUse",
                usable:2,
                init:function(player){
    if(!player.hasMark('xianjinld_difend')&&!player.hasMark('xianjinld_attack'))player.addMark('xianjinld_difend');},
                content:function(){
        'step 0'
        player.chooseControl('<span class=yellowtext>友军摸牌防御'+'</span>','<span class=yellowtext>友军远射攻击'+'</span>','cancel2').set('prompt',get.prompt('huokongld')).set('prompt2','<br>防御：你让实际距离此角色为'+(1+player.countMark('songpaiup'))+'的队友：<br>防御距离+1，但用杀攻击的距离-1，令自己的摸牌阶段摸牌数-1。<br>攻击：让距离自己'+(1+player.countMark('jinengup'))+'的队友及自己的攻击距离+1，但防御杀的距离-1,队友的摸牌阶段摸牌数+1。<br>强化技能可以增加这两个技能的作用距离').set('ai',function(event,player){  var player=_status.event.player,chusha=lib.filter.cardEnabled({name:'sha'},player),renshu=game.countPlayer(function(current){return get.attitude(player,current)>0&&get.distance(from,current,'pure')<=1+current.countMark('jinengup');  });
        if(renshu<2||chusha)return 1;if(renshu>=2&&!chusha)return 0;});
            'step 1'
           if(result.contron!='cancel2'){var i=result.index;game.log(i,'xianjinld');if(i==0&&!player.hasMark('xianjinld_difend')){player.addMark('xianjinld_difend');player.removeMark('xianjinld_attack')};if(i==1&&!player.hasMark('xianjinld_attack')){player.addMark('xianjinld_attack');player.removeMark('xianjinld_difend')};};
    },
                ai:{
                    order:function(player){if(lib.filter.cardEnabled({name:'sha'},player)){return 8;}return 3;},
                },
                onremove:function(player){player.removeGaintag('xianjinld');},
                mark:true,
                mod:{
                    aiOrder:function(player,card,num){if(get.itemtype(card)=='card'&&card.hasGaintag('xianjinld')) return num+3;},
                },
                intro:{
                    mark:function(dialog,content,player){var tishi='';if(player.hasMark('xianjinld_difend')){var tishi='实际距离此角色为'+(1+player.countMark('songpaiup'))+'的队友：防御距离+1，但用杀攻击的距离-1，令自己的摸牌阶段摸牌数-1'};if(player.hasMark('xianjinld_attack')){var tishi='实际距离此角色为'+(1+player.countMark('songpaiup'))+'的队友及自己：攻击距离+1，但防御杀的距离-1,队友的摸牌阶段摸牌数+1。'};
if(get.attitude(game.me,player)<=0||player.hasMark('xianjinld_difend')) {return get.translation(player)+'观看牌堆中...'+'<br>增益'+tishi;};
if(get.itemtype(_status.pileTop)!='card') return '牌堆顶无牌';var cardPile=Array.from(ui.cardPile.childNodes);var cardPile=cardPile.slice(0,Math.min(3,cardPile.length));dialog.addAuto(cardPile,tishi);
        },
                },
                global:["xianjinld_attack","xianjinld_difend"],
                group:["xianjinld_difend1"],
                subSkill:{
                    attack:{
                        mod:{
                            golbalFrom:function(from,to,num){
            return num-game.hasPlayer(function(current){
                return get.attitude(from,current)>0&&get.distance(from,current,'pure')<=1+current.countMark('jinengup')&&current.hasSkill('xianjinld')&&current.hasMark('xianjinld_attack');});},
                            attackTo:function(from,to,num){
            return num-game.hasPlayer(function(current){
                return get.attitude(to,current)>0&&get.distance(to,current,'pure')<=1+current.countMark('jinengup')&&current.hasSkill('xianjinld')&&current.hasMark('xianjinld_attack');});},
                        },
                        sub:true,
                    },
                    difend:{
                        mod:{
                            globalTo:function(from,to,num){
            return num+game.hasPlayer(function(current){
                return current!=to&&get.attitude(to,current)>0&&get.distance(to,current,'pure')<=1+current.countMark('jinengup')&&current.hasSkill('xianjinld')&&current.hasMark('xianjinld_difend');});},
                            attackFrom:function(from,to,num){
            return num+game.hasPlayer(function(current){
                return current!=from&&get.attitude(from,current)>0&&get.distance(from,current,'pure')<=1+current.countMark('jinengup')&&current.hasSkill('xianjinld')&&current.hasMark('xianjinld_defend');});},
                        },
                        sub:true,
                    },
                    "difend1":{
                        trigger:{
                            global:"phaseDrawBegin",
                        },
                        frequent:function(event,player){if(get.attitude(player,event.player)>0) return true;return false},
                        check:function(event,player){if(get.attitude(player,event.player)<0) return false;return true},
                        logTarget:"player",
                        filter:function(event,player){//spshicai与云将技能在下面，除了帮助队友外还可以看牌顶。
        return (get.attitude(player,event.player)>=0||player.identity=='nei')&&get.distance(player,event.player,'pure')<=1+player.countMark('jinengup');},
                        "prompt2":function(event,player){
                        var a=get.translation('xianjinld_info');
   if(player.identity=='nei') {a+=('<br>控制全场状态有一手；<br>内奸需要辅助弱势方，攻击实力出色的角色，平衡场上局势，保持自己的状态，伺机实现连破。')};return a;},
                        content:function(){if(trigger.player==player&&player.hasMark('xianjinld_difend')){trigger.num--};if(trigger.player!=player&&player.hasMark('xianjinld_attack')){trigger.num++;};},
                        sub:true,},
                },
            },
            "rendeonly2":{
                audio:"ext:舰R牌将:2",
                audioname:["gz_jun_liubei","shen_caopi"],
                enable:"phaseUse",
                filterCard:true,
                position:"hejs",
                selectCard:[1,2],
                discard:false,
                usable:2,
                lose:false,
                delay:false,
                filterTarget:function(card,player,target){
        if(player.storage.rerende2&&player.storage.rerende2.contains(target)) return false;
        return player!=target&&get.distance(player,target,'pure')<=2+player.countMark('shoupaiup');
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
        target.gain(cards,player,'giveAuto');//var usecard=cards[0];target.chooseUseTarget(usecard);
        for(var i=0;i<cards.length;i+=(1)){var usecard=cards[i];if(usecard.name!='sha'||!target.hasSkill('diewulimitai_shale')){target.chooseUseTarget(usecard)};if(usecard.name=='sha'){target.addSkill('diewulimitai_shale');target.update();};};
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
                    thunderAttack:true,
                    order:function(skill,player){
            if(player.hp<player.maxHp&&player.storage.rerende<2&&player.countCards('h')>1){
                return 7;
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
                    if(player.countCards('e',{subtype:get.subtype(card)})<2){
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
            diewulimitai:{
                enable:"phaseUse",
                filter:function(event,player){return player.countCards('h','sha')>0||player.countCards('he',{type:'equip'})>0;
},
                filterCard:function(card){var player=_status.event.player;
        return  card.name=='sha'||card.name=='jiu'||get.type(card)=='equip';    },
                filterTarget:function(card,player,target){
      if((get.attitude(player,target)>=0||player.identity=='nei'))  return target!=player&&get.distance(player,target,'pure')<=1+player.countMark('shoupaiup');
    },
                usable:2,
                position:"hejs",
                prompt:function(){return "给队友一张杀或装备牌，每回合限2次。<br>之后目标可以选择使用此牌，如果因使用此牌而造成伤害，你摸一张牌。"},
                prepare:"give",
                discard:false,
                content:function(){//group:["diewulimitai_2"],
        'step 0' 
 targets[0].gain(cards,player);
        for(var i=0;i<cards.length;i+=(1)){var usecard=cards[i];if(usecard.name!='sha'||!targets[0].hasSkill('diewulimitai_shale')){targets[0].chooseUseTarget(usecard);}};
if(!target.hasSkill('diewulimitai_shale')){target.addSkill('diewulimitai_shale');}

        
    },
                subSkill:{
                    shale:{
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        fixed:true,
                        silent:true,
                        content:function(){
     if(player.hasSkill('diewulimitai_shale')){player.removeSkill('diewulimitai_shale');};
    },
                        intro:{
                            marktext:"给了杀",
                            content:function(player){
            return ('此角色于其回合开始前，不能立即使用获得到的杀。<br>（通过改良仁德与改良递杀获得的杀）');
        },
                        },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                ai:{
                    order:function(skill,player){
            if(player.countCards('h','nanman')>0&&player.countCards('he','zhuge')<1){
                return 10;
            }
            return 1;
         },
                    expose:0,
                    result:{
                        target:function(player,target){if(!player.canUse('sha',player)&&player.countCards('h','sha')>1&&get.attitude(player,target)>=0&&get.distance(player,target,'pure')<=1+player.countMark('shoupaiup'))　{var e1=target.get('e','1');
　　if(e1){
　　if((e1.name=='zhuge')||(e1.name=='rewrite_zhuge')) return 1.1;};
   if((target.hasSkill('qigong')||target.hasSkill('guanshi_skill')))  return 1;};return 0;
            },
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            kanpolimitai:{
                enable:"chooseToUse",
                locked:false,
                filter:function(event,player){
        return player.countCards('hs',{color:'black'})>0&&player.hasUsableCard('wuxie')  },
                filterCard:function(card){
        return get.color(card)=='black';
    },
                viewAsFilter:function(player){
        return player.countCards('hs',{color:'black'})>0&&!player.countMark('kanpolimitai_wuxiele');
    },
                viewAs:{
                    name:"wuxie",
                },
                position:"hejs",
                prompt:"将一张黑色手牌当无懈可击使用",
                check:function(card){
        var tri=_status.event.getTrigger();
        if(tri&&tri.card&&tri.card.name=='chiling') return -1;
        return 8-get.value(card);
    },
                threaten:1.2,
                hiddenCard:function(player,name){
        if(name=='wuxie'&&_status.connectMode&&player.countCards('hs')>0) return true;
        if(name=='wuxie') return player.countCards('hs',{color:'black'})>0;

    },
                content:function(){
          if(!player.hasMark('kanpolimitai_wuxiele')){player.addSkill('kanpolimitai_wuxiele');};player.addMark('kanpolimitai_wuxiele');
    },
                group:["kanpolimitai_wuxiele","kanpolimitai_canwuxie"],
                subSkill:{
                    wuxiele:{
                        trigger:{
                            golbal:"phaseJieshuBegin",
                        },
                        fixed:true,
                        silent:true,
                        content:function(){//,player.countMark('diewulimitai_2_shale')player.removeSkill('kanpolimitai_wuxiele');
     if(player.hasMark('kanpolimitai_wuxiele')){player.removeMark('kanpolimitai_wuxiele',player.countMark('kanpolimitai_wuxiele'));};
    },
                        intro:{
                            marktext:"给了杀",
                            content:function(player){
            return ('使用无懈的次数');
        },
                        },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                    canwuxie:{
                        trigger:{
                            player:"kanpolimitaiAfter",
                        },
                        filter:function(event,player){
        return true//event.skill=='kanpolimitai';
    },
                        fixed:true,
                        silent:true,
                        content:function(){//,player.countMark('diewulimitai_2_shale')player.removeSkill('kanpolimitai_wuxiele');
     if(!player.hasMark('kanpolimitai_wuxiele')){player.addMark('kanpolimitai_wuxiele',1);};
    },
                        intro:{
                            marktext:"给了杀",
                            content:function(player){
            return ('使用无懈的次数');
        },
                        },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
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
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            kaifa:{
                position:"hejs",
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
            },
            huijiahuihe:{
                trigger:{
                    player:"phaseEnd",
                },
                round:1,
                name:"回合",
                lastDo:true,
                filter:function(event,player){//暂时不用
        return player.hujia>0;
    },
                check:function(event,player){
        return player.hujia>0&&player.hp>0;
    },
                content:function(){
        player.storage.huijiahuihe=player.hujia;
        player.changeHujia(-player.hujia);
        player.insertPhase();
    },
                group:["huijiahuihe_hp","huijiahuihe_draw","huijiahuihe_roundcount"],
                subSkill:{
                    hp:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        silent:true,
                        filter:function(event,player){
                return event.skill=='huijiahuihe'&&!player.getStat('damage');
            },
                        content:function(){game.log('没输出还是来抽张牌吧')
                player.draw();
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
                return event.getParent('phase').skill=='huijiahuihe';
            },
                        silent:true,
                        content:function(){game.log('要少摸牌了')
                trigger.num-=(2-player.storage.huijiahuihe);
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
            },
            qianting:{
                audio:"ext:舰R牌将:2",
                audioname:["re_ganning","re_heqi"],
                mod:{
attackFrom:function(from,to,distance){var a=0;if(from.hasSkill('quzhudd')&&to.hasSkill('qianting')){var a=a-1};return distance=(distance+a)},
targetInRange:function(card,player,target){
var type=get.type(card);
if(type=='trick'||type=='delay'){if(get.distance(player,target)<=2) return true;};},
    },
                enable:"chooseToUse",
                usable:2,
                position:"hejs",
                prompt:"将♦/♥非锦囊牌当做顺手牵羊，♣/♠非锦囊牌当做兵粮寸断使用，<br>限两次，本回合内不能再对同一目标使用此技能。张辽与徐晃合体版<br>锦囊牌可以对距离你为2以内的角色使用。",
                filter:function(event,player){if(event.parent.name=='phaseUse')return player.countCards('hs')>0;},
                viewAs:function(cards,player){
        var name=false;
        switch(get.suit(cards[0],player)){
            case 'club':name='bingliang';break;
            case 'diamond':name='shunshou';break;
            case 'spade':name='bingliang';break;
            case 'heart':name='shunshou';break;
        }
        if(name) return {name:name};
        return null;
    },
                filterCard:function(card,player,event){return true},
                selectCard:function(card){return 1},
                check:function(card){ var player=_status.event.player;if(get.suit(card)=='club'&&player.countMark('jinengup')<1){return -1};return 7-get.value(card)},
                content:function(){},
                ai:{
                    basic:{
                        order:1,
                        useful:3,
                        value:3,
                    },
                    yingbian:function(card,player,targets,viewer){
            if(get.attitude(viewer,player)<=0) return 0;
            if(game.hasPlayer(function(current){
                return !targets.contains(current)&&lib.filter.targetEnabled2(card,player,current)&&get.effect(current,card,player,player)>0;
            })) return 6;
            return 0;
        },
                    result:{
                        target:function(player,target){
                var att=get.attitude(player,target);
                var nh=target.countCards('h');
                if(att>0){
                    if(target.countCards('j',function(card){
                        var cardj=card.viewAs?{name:card.viewAs}:card;
                        return get.effect(target,cardj,target,player)<0;
                    })>0) return 3;
                    if(target.getEquip('baiyin')&&target.isDamaged()&&
                        get.recoverEffect(target,player,player)>0){
                        if(target.hp==1&&!target.hujia) return 1.6;
                    }
                    if(target.countCards('e',function(card){
                        if(get.position(card)=='e') return get.value(card,target)<0;
                    })>0) return 1;
                }
                var es=target.getCards('e');
                var noe=(es.length==0||target.hasSkillTag('noe'));
                var noe2=(es.filter(function(esx){
                    return get.value(esx,target)>0;
                }).length==0);
                var noh=(nh==0||target.hasSkillTag('noh'));
                if(noh&&(noe||noe2)) return 0;
                if(att<=0&&!target.countCards('he')) return 1.5;
                return -1.5;
            },
                    },
                    tag:{
                        loseCard:1,
                        discard:1,
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
                group:["qianting_jiezi"],
subSkill:{
jiezi:{
    trigger:{
        global:["phaseUseBegin","phaseJieshuBegin"],
    },
    forced:true,
    filter:function(event,player){if(event.player!=player){//touxichuan_mod:{cardDiscardable:function(card,player,name){if(name=='dying') return false;},},
if(event.player.getHistory('skipped').contains('phaseJudge')&&event.trigger.name=="phaseUseBegin") return true;
if(event.player.getHistory('skipped').contains('phaseDraw')&&event.trigger.name=="phaseUseBegin") return true;
if(event.player.getHistory('skipped').contains('phaseUse')) return true;
if(event.player.getHistory('skipped').contains('discard')) return true;};return false;},
    content:function(){player.logSkill('jiezi',trigger.player);
//if(player.getHistory('skipped').length>0) player.draw(player.getHistory('skipped').length);
if(trigger.player.getHistory('skipped').contains('phaseJudge')) player.draw();
if(trigger.player.getHistory('skipped').contains('phaseDraw')) player.draw();
if(trigger.player.getHistory('skipped').contains('phaseUse')) player.draw();
if(trigger.player.getHistory('skipped').contains('discard')) player.draw();},
sub:true,},
},},
            wulidebuff:{
                trigger:{
                    source:"damageBefore",
                },
                name:"属性效果",
                lastDo:true,
                forced:true,
                filter:function(event,player){
        if((event.nature&&player!=event.player)&&event.num>0)
    return true},
                content:function(){
       var  link=(game.hasPlayer(function(current){return get.attitude(player,current)<0&&current==trigger.player&&current.isLinked();})-game.hasPlayer(function(current){return get.attitude(player,current)>0&&current==trigger.player&&current.isLinked();}));

   if(trigger.nature=='fire')  {
      {trigger.player.addSkill('wulidebuff_ranshao');trigger.player.addMark('wulidebuff_ranshao',1);
     game.log(get.translation(player.name)+'<span class=firetext>燃烧</span>'+get.translation(trigger.player.name)+'<span class=thundertext>,ta还能坚持到出完牌');};
     if(trigger.player.hp*2<trigger.player.maxHp){player.$throwEmotion(trigger.player,'yanhua')};game.playAudio('..','extension','舰R牌将/audio','wulidebuff');};     
        
     if(trigger.nature=='thunder'){
 if(player.hasSkill('hanbing_gai')){
 trigger.player.addSkill('wulidebuff_jiansu');trigger.player.addMark('wulidebuff_jiansu');
    if(trigger.player.hujia>0) {trigger.num+=(1);game.log('对护甲加伤'+1)};
   game.log(get.translation(player.name)+'<span class=thundertext>减速了:</span>'+get.translation(trigger.player.name)+'小心随之而来的集火');
    if(trigger.player.hp*2<trigger.player.maxHp){player.$throwEmotion(trigger.player,'wine')}; };            
        
       if(!player.hasSkill('hanbing_gai')){
   trigger.player.addSkill('wulidebuff_jinshui');trigger.player.addMark('wulidebuff_jinshui',1);
 if((trigger.player.hujia>0||trigger.player.hasSkillTag('maixie_defend'))&&(!trigger.player.isLinked()||(trigger.player.isLinked()&&link<2||trigger.num<2))){
 trigger.player.loseHp(trigger.num);game.log('雷杀穿透护甲:',trigger.num);trigger.num-=(trigger.num),trigger.cancel};
 game.log(get.translation(player.name)+'让:'+get.translation(trigger.player.name)+'进水减手牌上限了') ; 
  if(trigger.player.hp*2<trigger.player.maxHp){player.$throwEmotion(trigger.player,'hehua')};  };};      
        trigger.player.updateMarks();
    },
                subSkill:{
                    jiansu:{
                        mod:{
                            globalTo:function(from,to,distance){return distance-to.hasMark('wulidebuff_jiansu');},
                        },
                        trigger:{
                            player:["phaseJieshuBegin","dying"],
                        },
                        name:"减速",
                        priority:3,
                        forced:true,
                        content:function(){
        if(player.hasSkill('wulidebuff_jiansu')){ player.removeSkill('wulidebuff_jiansu');player.removeMark('wulidebuff_jiansu',player.countMark('wulidebuff_jiansu')); };
    },
                        intro:{
                            marktext:"减速",
                            content:function(player){
            return ('减少1点与其他角色的防御距离，令舰船更容易被对手集火，雷杀的效果，不叠加计算');
        },
                        },
                        sub:true,
                    },
                    jinshui:{
                        mod:{
                            maxHandcard:function(player,num){//手牌上限
return num=num-1},
                        },
                        trigger:{
                            player:["phaseBegin","phaseJieshuBegin","dying"],
                        },
                        name:"进水",
                        priority:2,
                        forced:true,
                        content:function(){//player.removeMark('wulidebuff_jinshui',player.countMark('wulidebuff_jinshui')); 
        if(player.hasSkill('wulidebuff_jinshui')){ player.removeSkill('wulidebuff_jinshui');player.removeMark('wulidebuff_jinshui',player.countMark('wulidebuff_jinshui')); };
    },
                        intro:{
                            marktext:"进水",
                            content:function(player){
            return ('减少1点手牌上限，在出牌阶段会恢复，冰杀与袭击运输船的效果，不叠加计算也很可怕了');   
            },
                        },
                        sub:true,
                    },
                    ranshao:{
                        trigger:{
                            player:["phaseJieshuBegin","dying"],
                        },
                        name:"燃烧",
                        forced:true,
                        priority:1,
                        content:function(){
        if(player.hasSkill('wulidebuff_ranshao')){if(event.triggername!='dying'){player.draw(2);player.damage(1,'fire');};player.removeSkill('wulidebuff_ranshao');player.removeMark('wulidebuff_ranshao',player.countMark('wulidebuff_ranshao'));  };  },
                        intro:{
                            marktext:"燃烧",
                            content:function(player){//+player.countMark('wulidebuff_ranshao')+'次，'+tishi
            var player=_status.event.player;var tishi='回合结束受到一点火焰伤害，摸一张牌，火杀带来的负面效果，本回合被攻击了'+player.countMark('wulidebuff_ranshao')+'次，';if(player.countMark('wulidebuff_ranshao')>0&&player.hp<=2){tishi+=('可能小命不保，求求队友给点力，发挥抽卡游戏的玄学力量。”')};if(player.countMark('wulidebuff_ranshao')>2&&player.hp<=2){tishi+=('“被集火了，希望队友能能继续扛起重任。')};if(player.identity=='nei'){tishi+=('为了自己的光辉岁月，我内奸一定能苟住，一定要苟住')};if(player.identity=='zhu'){tishi+=('我的生命在燃烧，')};if(player.identity=='zho'){tishi+=('同志，救我，我被火力压制了。')};if(player.identity=='fan'){tishi+=('就怕火攻一大片啊，我们的大好前程被火杀打到功亏一篑')};
            return tishi;  },
                        },
                        sub:true,
                        ai:{
                            effect:{
                                player:function(card,player){var a=game.countPlayer(function(current){ return current!=player&&(!get.attitude(player,current)<0&&(player.hasSkill=='zhongxunca'||player.hasSkill=='qingxun'));  });
 
                    if(card.name=='tengjia'){
                    var equip1=player.getEquip(1);if(a>0||player.hasSkill=='wulidebuff_ranshao'){return -10;};
                    if(a>0) return -1;}},
                            },
                        },
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            junfu:{
                audio:"ext:舰R牌将:2",
                trigger:{
                    global:["phaseBegin","phaseJieshuBegin"],
                },
                direct:true,
                lastDo:true,
                frequent:true,
                preHidden:true,
                locked:false,
                filter:function(event,player,name){//输粮改
        var a=((!player.getEnemies().contains(event.player)&&event.name=='phase')||(player.getEnemies().contains(event.player)&&event.name=='phaseJieshu'));
    return player.getCards('s',function(card){return card.hasGaintag('tunchu')}).length>0&&event.player.countCards('h')<8&&get.distance(player,event.player,'pure')<=1+player.countMark('jinengup')&&event.player.isAlive()&&event.player!=player&&a==true   ;  },
                content:function(){
        'step 0'
        var goon=(get.attitude(player,trigger.player)>0);game.log(trigger.name)
        player.chooseCardButton(get.prompt('junfu',trigger.player),player.getCards('s',function(card){return card.hasGaintag('tunchu')}),[1,3]).set('ai',function(){
            if(_status.event.goon) return 1;
            return -1;
        }).set('goon',goon);
        'step 1'
        if(result.bool){
            player.logSkill('shuliang',trigger.player);
       //player.loseToDiscardpile(result.links);player.discoverCard(get.inpile('trick'));target.loseToSpecial(event.cards2,'asara_yingwei',player).visible=true;player.draw(1);player.draw(1);player.loseToSpecial(,'tunchu',player).visible=true;
            trigger.player.gain(result.links,player);player.draw(1);}else event.finish();
        'step 2'
      
 },
                ai:{combo:"tunchu",},
                group:["junfu_choose"],
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
                            global:"phaseDiscardBefore",
                        },
                        forced:true,
                        popup:false,
                        firstDo:true,
                        filter:function(event,player){ var duiyou=game.countPlayer(function(current){return get.attitude(player,current)>0;}),zongshu=player.getHandcardLimit()/2+duiyou/2,cunpaishu=player.getExpansions('tunchu').length+player.getCards('s',function(card){return card.hasGaintag('tunchu')}).length;
        return zongshu>cunpaishu&&player.countCards('h');
    },
                        charlotte:true,
                        content:function(){
        'step 0'
        var nh=Math.min(player.countCards('h'),Math.ceil(player.getHandcardLimit()));
       var duiyou=game.countPlayer(function(current){return get.attitude(player,current)>0;});
 var zongshu=Math.max(player.getHandcardLimit()/2,duiyou-1),cunpaishu=player.getExpansions('tunchu').length+player.getCards('s',function(card){return card.hasGaintag('tunchu')}).length;
        if(nh&&zongshu>cunpaishu){
            player.chooseCard('h',[1,Math.min(nh,zongshu-cunpaishu)],'将任意张手牌置于你的武将牌上,<br>存牌上限为手牌上限/2与队友数，取最大值。<br>单次存牌量上限为手牌上限,<br>这些牌可以在回合外递给其他角色').set('ai',function(card){
var player=_status.event.player;
if(ui.selected.cards.type=="equip") return -get.value(card);
if(ui.selected.cards.length>=duiyou) return -get.value(card);
return 9-get.value(card);});}
else{event.finish();}
        'step 1'
        if(result.bool){
       // player.addToExpansion(result.cards,player,'giveAuto').gaintag.add('tunchu');player.update();
        player.loseToSpecial(result.cards,'tunchu',player).visible=true;
            }
                    'step 2'
            
            },
sub:true,}
                    ,},},
            quzhudd:{
                mod:{globalFrom:function(from,to,distance)  { return distance-(to.hasSkill('qianting'));},},
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
            daoqu:{
                mod:{
                    selectTarget:function(card,player,range){///是卡片作用时可选的目标数量，输出range给牌的发起事件阶段用。
            if(range[1]==-1) return;var a=game.countPlayer(function(current){return get.attitude(player,current)<=0&&current.inRange(player)})-1;
            if(card.name=='sha') range[1]+=Math.min(player.countMark('jinengup'),a);},
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            huibi:{
                inherit:"bagua_skill",
                audio:"bagua_skill",
                firstDo:true,
                content:function(){//已经有一个给牌技能了
        "step 0"
        event.cards=[];
        player.judge('huibi',function(card){return (get.name(card)=='huibi9'||get.name(card)=='kuaixiu9'||get.name(card)=='tao'||get.name(card)=='shan'||get.suit(card)=='diamond')?1.6:-0.5}).judge2=function(result){
          return result.bool;
        };
        "step 1"
        if(result.judge>0){
            trigger.untrigger();player.removeMark('huibi',player.countMark('huibi'));
            trigger.set('responded',true);
            trigger.result={bool:true,card:{name:'shan'}}
        };if(result.judge<=0){event.cards.push(result.card);if(Math.max(player.getHandcardLimit(),4)>=player.countCards('h')){player.gain(event.cards);
  //var next=player.chooseToDiscard(get.prompt('回避弃牌事件'),1,'手牌数超过上限，请弃置一张手牌',true);
    //    next.ai=function(card){
              //  return 30-get.useful(card);}
            
              };
   //if(player.hasSkill('quzhudd')){if(!player.countMark('huibi')){player.addMark('huibi');event.goto(0);}else {player.removeMark('huibi',player.countMark('huibi'));};};
        };
    
    },
                equipSkill:true,
                trigger:{
                    player:["chooseToRespondBegin","chooseToUseBegin"],
                },
                filter:function(event,player){
        if(event.responded) return false;
        if(event.huibi) return false;
        if(!player.isEmpty(2)) return false;
        if(!event.filterCard||!event.filterCard({name:'shan'},player,event)) return false;
        if(event.filterCard({name:'tao'},player,event))return false;
        if(event.name=='chooseToRespond'&&!lib.filter.cardRespondable({name:'shan'},player,event)) return false;
      if(player.hasSkillTag('unequip2')) return false;
        var evt=event.getParent();
        if(evt.player&&evt.player.hasSkillTag('unequip',false,{
            name:evt.card?evt.card.name:null,
            target:player,
            card:evt.card
        })) return false;
        return true;
    },
                check:function(event,player){
        if(event&&(event.ai||event.ai1)){
            var ai=event.ai||event.ai1;
            var tmp=_status.event;
            _status.event=event;
            var result=ai({name:'shan'},_status.event.player,event);
            _status.event=tmp;
            return result>0;
        }
        return true;
    },
                ai:{
                    respondShan:true,
                    effect:{
                        target:function(card,player,target,effect){
                if(target.hasSkillTag('unequip2')) return;
                if(player.hasSkillTag('unequip',false,{
                    name:card?card.name:null,
                    target:target,
                    card:card
                })||player.hasSkillTag('unequip_ai',false,{
                    name:card?card.name:null,
                    target:target,
                    card:card
                })) return;
                if(get.tag(card,'respondShan')) return 0.5;
            },
                    },
                },
                intro:{
                    content:function(){
            return get.translation(huibi+'_info');
        },
                },
            },
            "hanbing_gai":{
                inherit:"hanbing_skill",
                trigger:{
                    source:"damageBegin2",
                },
                equipSkill:false,
                ruleSkill:true,
                firstDo:true,
                filter:function(event,player){//||player.hasSkill('hanbing_gai')
        return (event.nature=='thunder')&&event.notLink()&&event.player.getCards('he').length>0;
    },
                audio:"ext:舰R牌将:true",
                check:function(event,player){
var target=event.player;
var eff=get.damageEffect(target,player,player,event.nature);
if(get.attitude(player,target)>0){
if(eff>=0) return false;
return true;
}
if(eff<=0) return true;
if(target.hp>=2&&target.countCards('he')>=2&&player.hasSkill('yunqingleng')&&player.getHistory('useCard',function(evt){
return evt.card.name=='jiu'
}).length<=0) return true;
if(target.hp==1) return false;
if(player.getHistory('useCard',function(evt){
return evt.card.name=='jiu'
}).length>=1) return false;
if(event.num>1||player.hasSkill('tianxianjiu')||
player.hasSkill('luoyi2')||player.hasSkill('reluoyi2')) return false;
if(target.countCards('he')<2) return false;
var num=0;
var cards=target.getCards('he');
for(var i=0;i<cards.length;i++){
if(get.value(cards[i])>=6) num++;
}
if(num>=3&&player.getHistory('useCard',function(evt){
return evt.card.name=='jiu'
}).length<=0) return true;
if(num>=2&&target.hasSkillTag("maixie")&&player.getHistory('useCard',function(evt){
return evt.card.name=='jiu'
}).length<=0) return true;
if(num>=2&&player.hasSkill('yunqingleng')&&player.getHistory('useCard',function(evt){
return evt.card.name=='jiu'
}).length<=0) return true;
return false;
},
                logTarget:"player",
                content:function(){
"step 0"
event.num1=trigger.num*2;game.log(trigger.num,event.num1)
trigger.cancel();
"step 1"
if(trigger.player.countDiscardableCards(player,'he')){
player.line(trigger.player);
player.discardPlayerCard('he',trigger.player,true);player.addMark('hanbing_gai');
}else {var a=Math.floor((event.num1-player.countMark('hanbing_gai'))/2);game.log(event.num1,Math.floor((event.num1-player.countMark('hanbing_gai'))/2));
 player.removeMark('hanbing_gai',player.countMark('hanbing_gai'));trigger.player.damage(a);event.finish();};
"step 2"
if(player.countMark('hanbing_gai')<event.num1&&player.countMark('hanbing_gai')){event.goto(1)}else {
 player.removeMark('hanbing_gai',player.countMark('hanbing_gai'));};
},
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            qianghuazhuang:{
                mod:{
                    attackFrom:function(from,to,distance){
  var a=0;if(from.countMark('wuqiup')){var a=a+from.countMark('wuqiup')};return distance=(distance-a)},
                    attackTo:function(from,to,distance){
  var a=0;if(to.countMark('jidongup')){var a=a+to.countMark('jidongup')};return distance=(distance+a)},
                    cardUsable:function( card,player,num){
  var a=0;if(card.name=='sha') return num=num+=(player.countMark('useshaup'))},
                    maxHandcard:function(player,num){
  var a=0;if(player.countMark('shoupaiup')){var a=a+player.countMark('shoupaiup')};  return num=(num+a);},
                },
                direct:true,
                mark:true,
                init:function(player){//初始化数组，也可以运行事件再加if后面的内容
    if(!player.storage.qianghuazhuang) player.storage.qianghuazhuang=[0,0,0,0,0,0,0,0,0];},
                getInfo:function(player){//让其他技能可以更简单的获取该技能的数组。
    if(!player.storage.qianghuazhuang) player.storage.qianghuazhuang=[0,0,0,0,0,0,0,0,0];
    return player.storage.qianghuazhuang;},
                intro:{
                    marktext:"装备",
                    content:function(storage,player){//只有content与mark可以function吧，内容，介绍的文字与内容。
 var info=lib.skill.qianghuazhuang.getInfo(player);
  return '<div class="text center"><span class=greentext>用一摸一:'+info[0]+'<br>技能耗牌：'+info[1]+'</span><br><span class=firetext>武器距离：'+info[2]+'<br>攻击次数:'+info[3]+'</span><br><span class=thundertext>机动：'+info[4]+'<br>手牌上限:'+info[5]+'</span><br><span class=yellowtext>辅助技能：'+info[6]+'<br>Exp:'+info[7]+'</span></div>'
     ;     },
                },
                enable:"phaseUse",
                usable:2,
                filter:function(event,player){//if (player.countCards('he',{type:'equip'})>0){if((a+b+c+d)>(4+k*4))return false} return player.countCards('he',{type:'equip'})>0||player.countMark('Expup')>0;type:"equip",
       var a=player.countMark('mopaiup'),b=player.countMark('jinengup'), c=player.countMark('wuqiup') , d=player.countMark('useshaup'),e=player.countMark('jidongup'),  f=player.countMark('shoupaiup'), g=player.countMark('songpaiup') , h=player.countMark('Expup'),k=player.countMark('jianzaochuan')+1,lv=0;if(k<3){lv=k*6};if(k>=3){lv=k+10};
       if(player.countCards('he')>0){if((a+b+c+d+e+f+g)>=(lv))return false}; return player.countCards('e')>0||player.countCards('he')>1||player.countMark('Expup')>1;
     //比较保守的设计，便于设计与更改。
    ;},
                filterCard:{
                },
                position:"hejs",
                selectCard:function(card){
        var player=_status.event.player,num=0;num+=(player.countMark('Expup'));if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip'){num+=(1)};if(ui.selected.cards.length>1&&get.type(ui.selected.cards[1],'equip')=='equip'){num+=(1)};
        return [Math.max(2-num,0),Math.max(4-num,2)];
    },
                prompt:"你可以消耗经验，或弃置二至四张牌，选择一个永久效果升级。装备等于两张牌哦<br>（如摸牌、攻击距离、手牌上限等）每回合限两次<br>强化上限为建造的次数，摸牌最高强化至5级，其他为2级。",
                check:function(card){//ui，参考仁德，ai执行判断，卡牌价值大于1就执行（只管卡片）当然，能把玩家设置进来就可以if玩家没桃 return-1。
        var player=_status.event.player;
        if(ui.selected.cards.length&&get.type(ui.selected.cards[0],'equip')=='equip') return 13-get.value(card);
        if(ui.selected.cards.length>=Math.max(1,player.countCards('he')/3)) return 0;
        if(game.phaseNumber<3)return 9-get.value(card);
        return 5-get.value(card);
    },
                content:function(){//choiceList.unshift
         'step 0'
 var a=player.countMark('mopaiup'),b=player.countMark('jinengup'), c=player.countMark('wuqiup') , d=player.countMark('useshaup'),e=player.countMark('jidongup'),  f=player.countMark('shoupaiup'), g=player.countMark('songpaiup') , h=player.countMark('Expup'),k=player.countMark('jianzaochuan')+1;
 player.storage.qianghuazhuang=[a,b,c,d,e,f,g,h,k];event.cadechangdu=event.cards.length;
   event.choiceList=[ ]; event.list=[ ]; event.cao=cards;event.jieshao=['+'+a+'→'+(a+1)+'摸牌标记上限，<br>防守反击必备。','+'+(b)+'→'+(b+1)+'升级，降低重巡、战列使用必中攻击时所需的手牌数;<br>增加导驱用杀时可选的目标数、潜艇用普通(非延时)锦囊牌时可选的目标数;轻巡能令更远距离的友军增加摸牌阶段摸牌数、军辅能于更远距离给其他角色递牌。','+'+c+'→'+(c+1)+'武器攻击距离，<br>不如减一马','+'+d+'→'+(d+1)+'出杀次数，<br>不再依赖连弩，但有连弩更好。','+'+e+'→'+(e+1)+'武器防御距离<br>不如加一马，但仍能让对手的烦恼。','+'+f+'→'+(f+1)+'手牌上限，且能于更远距离给其他角色递牌给杀，<br>一般是用来降低摸牌门槛。','+'+h+'→'+(h+1)+'经验，将没有机会用来强化的卡牌转为经验，供下次升级<br>'+(h+1)+'建造次数']//player.getEquip(1)，定义空数组，push填充它，事件变量可以自定义名字，什么都可以存。game.log('已强化:',a+b+c+d);
        var info=lib.skill.qianghuazhuang.getInfo(player);
        if(info[0]<k&&info[0]<5){event.list.push('mopaiup');
   event.choiceList.push(event.jieshao[0]);};
        if(info[1]<k&&info[1]<2){event.list.push('jinengup');
   event.choiceList.push(event.jieshao[1]);};
        if(info[2]<k&&info[2]<2){event.list.push('wuqiup');
   event.choiceList.push(event.jieshao[2]);};//若此值：你强化的比目标多时，+1含锦囊牌防御距离。
        if(info[3]<k&&info[3]<2){event.list.push('useshaup');
    event.choiceList.push(event.jieshao[3]);};
        if(info[4]<k&&info[4]<2){event.list.push('jidongup');
   event.choiceList.push(event.jieshao[4]);};
        if(info[5]<k&&info[5]<2){event.list.push('shoupaiup');
   event.choiceList.push(event.jieshao[5]);};
  //      if(info[6]<k&&info[6]<2){event.list.push('songpaiup');
 //  event.choiceList.push('+'+g+'→'+(g+1)+'给牌次数，<br>提升“先进雷达”技能的送牌范围。');};
      if(info[7]<k&&info[7]<2){event.list.push('Expup');
   event.choiceList.push(event.jieshao[6]);};
        event.first=true;    //存了6个变量，可以导出为button，与textbutton样式，看需求
        var next=player.chooseButton([
            '请令其中一项+1；可以取消，取消后会返还卡牌；升级后，多的卡牌会转化为经验，供下次升级使用。',
            [event.choiceList,'textbutton'],
        ]);
        var xuanze=event.cao.length;xuanze+=(player.countMark('Expup'));if(event.cao.length&&get.type(event.cao[0],'equip')=='equip'){xuanze+=(1)};if(event.cao.length>1&&get.type(event.cao[1],'equip')=='equip'){xuanze+=(1)};
         xuanze=(Math.floor(xuanze/2));
        
       next.set('selectButton',[Math.max(xuanze,0),Math.max(xuanze,0)]);//可以选择多个按钮，可计算可加变量。
        next.set('prompt',get.prompt('qianghuazhuang'),'令其中一项+1,好吧不显示info');
        next.set('ai',function(button){
       var haode=[event.jieshao[0],event.jieshao[1]];var yingji=[];var tunpai=[event.jieshao[5]];//其实一个例子就行，不如直接if(){return 2;};
   if(game.hasPlayer(function(current){  return current.inRange(player)&&get.attitude(player,current)<0;})<1) {yingji.push(event.jieshao[2])}else if(player.countCards('h',{name:'sha'})>1){yingji.push(event.jieshao[3])};
        if(game.hasPlayer(function(current){return player.inRange(current)&&get.attitude(player,current)<0;})>0) yingji.push(event.jieshao[4]);
           
            switch(ui.selected.buttons.length){
                case 0:
                    if(haode.contains(button.link)) return 3;
                    if(yingji.contains(button.link)) return 2;
                    if(tunpai.contains(button.link)) return 1;
                    return Math.random();
                case 1:
                    if(haode.contains(button.link)) return 3;
                    if(yingji.contains(button.link)) return 2;
                    if(tunpai.contains(button.link)) return 1;
                    return Math.random();
                case 2:
                  return Math.random();
                default: return 0;
            }
        });
 
            'step 1'
            game.log(result.links,result.bool)//只能返还这两个，所以更适合技能，更需要循环的方式进行计算。
     if(!result.bool){;player.gain(event.cao,player);event.finish();};//返还牌再计算
     if(result.bool){  //player.addMark('Expup',event.cadechangdu);//先给经验再计算
        for(var i=0;i<event.cao.length;i+=(1)){if(get.type(event.cao[i],'equip')=='equip'){player.addMark('Expup',2)}else player.addMark('Expup',1);game.log(player.countMark('Expup'),'卡牌:',event.cao[0],'类别',get.type(event.cao[i],'equip'),get.type(event.cao[i],'equip')=='equip');};
        for(var i=0;i<event.choiceList.length;i+=(1)){if( result.links.contains(event.choiceList[i])){  player.addMark(event.list[i],1);player.removeMark('Expup',2);game.log('数组自动识别、升级:',event.list[i],'编号',i,'，总编号',result.links.length-1);}}};
    //    if(event.choiceList.length<event.cao){player.addMark('Expup',1);};从0开始，当介绍数组有内容==选项数组的内容（第i个），就加的简称数组第i个(内容)标签。并写上调试内容。记录查看效果。
            'step 2'
  var a=player.countMark('mopaiup'),b=player.countMark('jinengup'), c=player.countMark('wuqiup') , d=player.countMark('useshaup'),e=player.countMark('jidongup'),  f=player.countMark('shoupaiup'), g=player.countMark('songpaiup') , h=player.countMark('Expup'),k=player.countMark('jianzaochuan')+1;game.log('结束',a,b,c,d,e,f,g,h,k);
 player.storage.qianghuazhuang=[a,b,c,d,e,f,g,h];

    
    
    
    
    },
                ai:{
                    order:function(player){var player=_status.event.player;if(player.countMark('jianzaochuan')<3){return 9};return 1},
                    threaten:0,
                    result:{
                        player:function(player){var player=_status.event.player;
                var num=player.countCards('e')+player.countCards('h',{name:'shan'})-1;
            return num;},
                    },
                },
            },
            huokongld:{
                equipSkill:true,
                trigger:{
                    player:["shaMiss","eventNeutralized"],
                },
                direct:true,
                audio:"ext:舰R牌将:true",
                filter:function(event,player){
        if(event.type!='card'||event.card.name!='sha') return false;
        return player.countCards('he',function(card){
            return card!=player.getEquip('guanshi');
        })>=Math.max(0,2-player.countMark('jinengup'))&&event.target.isAlive();
    },
                content:function(){
        "step 0"
 var evt=_status.event.getTrigger(),num=evt.baseDamage+evt.extraDamage;
        if(player.countMark('jinengup')>0){//get.prompt2('huokongld')Math.max(0,2-player.countMark('jinengup'))
        var next=player.chooseToDiscard('令本次攻击命中对手,<br>一级，你弃置1张牌，对面摸'+num+'张牌；二级：你弃置张牌。',1,'he',function(card){
            return _status.event.player.getEquip('guanshi')!=card;
        });
        next.logSkill='guanshi_skill';
        next.set('ai',function(card){
            var evt=_status.event.getTrigger();
            if(get.attitude(evt.player,evt.target)<0){
                if(evt.baseDamage+evt.extraDamage>=Math.min(2,evt.target.hp)){
                    return 12-get.value(card)
                }
                return 8-get.value(card)
            }
            return -1;
        });}else player.chooseControl('<span class=yellowtext>强制命中'+'</span>','cancel2').set('prompt',get.prompt('huokongld')).set('prompt2','令本次攻击命中对手,<br>零级，对面摸2*'+num+'张牌，一级，你弃置1张牌，对面摸1*'+num+'张牌；二级：你弃置1张牌。<br>').set('ai',function(card){
            var evt=_status.event.getTrigger();
            if(get.attitude(evt.player,evt.target)<0){
                if(evt.baseDamage+evt.extraDamage>=Math.min(2,evt.target.hp)){
                    return 1.1
                }
                return 1
            }
            return -1;
        });
        "step 1"
        if(result.bool||result.index==0){
            if(event.triggername=='shaMiss'){var evt=_status.event.getTrigger();
                trigger.untrigger();
                trigger.trigger('shaHit');
                trigger.target.draw((2-player.countMark('jinengup'))*(evt.baseDamage+evt.extraDamage));
                trigger._result.bool=false;
                trigger._result.result=null;
            }
            else{
                trigger.unneutralize();
            }
        }
    },
                ai:{
                    "directHit_ai":true,
                    skillTagFilter:function(player,tag,arg){
            if(player._guanshi_temp) return;
            player._guanshi_temp=true;
            var bool=(get.attitude(player,arg.target)<0&&arg.card.name=='sha'&&player.countCards('he',function(card){
                return card!=player.getEquip('guanshi')&&card!=arg.card&&(!arg.card.cards||!arg.card.cards.contains(card))&&get.value(card)<5;
            })>1);
            delete player._guanshi_temp;
            return bool;
        },
                },
            },
            "ganglie_gai":{
                audio:"ext:舰R牌将:2",
                trigger:{
                    player:"damageEnd",
                },
                filter:function(event,player){
        return (event.source!=undefined&&event.source!=player&&event.player.hp<=event.player.maxHp/2);
    },
                check:function(event,player){
        return (get.attitude(player,event.source)<=0);
    },
                logTarget:"source",
                content:function(){  "step 0"//if(player.countCards('h')>=3) event.tishi+=('');
        event.num=trigger.num;if(trigger.hujia){event.num=1};event.tishi='你可以弃置x张牌并进行判定。<br>若结果不为红桃，则伤害来源顺序选择执行一项：1.弃置x+1张手牌，2.选择交给你一张牌;3.都未执行，则其失去一点体力(无视护甲)。<br>若你先弃置了两张牌，则判定失败时可以获得目标的一张牌;目标来到选择2面前前，会额外失去一张牌。';var shili=trigger.source.countCards('he')/player.countCards('he');
   if(player.countCards('h')>=3){event.tishi+=('<br>');if(shili>=1.5) {event.tishi+=('对手处于优势，希望此技能 能成功减弱对手的攻势吧')};if(shili<1.5&&shili>=1.2){ event.tishi+=('对手处于优势，尝试获取廉价的收益吧')};if(shili<1.2&&shili>=0.8){ event.tishi+=('即将打破的僵持状况，稳住心态')};if(shili<0.8){ event.tishi+=('稳妥起见，多弃置一张也无妨，有一个弱化的顺手牵羊作为保底嘛')};};
                   "step 1"
      if(trigger.source.isAlive()){  player.chooseToDiscard([0,2]).set('prompt2',event.tishi).set('ai',function(card){
          　if(ui.selected.cards.length) return -1;
            if(card.name=='tao') return -10;
            if(card.name=='jiu'&&_status.event.player.hp==1) return -10;
            return get.unuseful(card)+2.5*(5-get.owner(card).hp);
        });};
        "step 2"//game.log(result.cards);  
   //   if(result.bool){
          event.num-=(1);if(result.bool){event.qipai=result.cards.length;}else event.qipai=0;
        player.judge(function(card){
            if(get.suit(card)=='heart') return -2;
            return 2;
        }).judge2=function(result){
            return result.bool;
        };//}else event.finish();
        "step 3"
        if(result.judge<2){
            event.finish();if(event.qipai>1){player.gainPlayerCard(true,trigger.source,'he');};
        }else {event.tishi='作为伤害来源，顺序执行：<br>1.弃置x+1张手牌，2.选择交给'+get.translation(player)+'一张手牌;3.前两项都不执行，则你失去一点体力(无视护甲)。<br>';if(event.qipai>1){ event.tishi+=('对手先弃置了两张牌，其判定失败时，可以获得你的一张牌；你进行选择2前，会额外失去一张牌。')};
        trigger.source.chooseToDiscard(1+event.qipai).set('prompt2',event.tishi).set('ai',function(card){
            if(card.name=='tao') return -10;
            if(card.name=='jiu'&&_status.event.player.hp==1) return -10;
            return get.unuseful(card)+2.5*(5-get.owner(card).hp);
        });};
        "step 4"
        if(result.bool==false){event.tishi='作为伤害来源：2.选择交给'+get.translation(player)+'一张手牌;<br>3.不执行，则自己失去一点体力(无视护甲)。<br>';if(event.qipai>1){event.tishi+=('对手先弃置了两张牌，你进行选择2前，若手牌大于1，会额外失去一张牌。<br>');if(trigger.source.countCards('h')>=2){trigger.source.discard(trigger.source.getCards('h').randomGet());};};
       if(trigger.source.countCards('h',{name:'tao'})>=0) {event.tishi+=('有桃，不怕扣血；')};if(trigger.source.countCards('h',{name:'jiu'})>=0) {event.tishi+=('有酒,没血不慌；')};if(trigger.source.countCards('h',{name:'shandian'})+trigger.source.countCards('h',{name:'taoyuan'})>=0) {event.tishi+=('有些稀有卡牌能变废为宝，转给对手')};
        if(!trigger.source.countCards('h')) event._result={bool:false};
        else trigger.source.chooseCard('h').set('prompt2',event.tishi).set('ai',function(card){
            if(get.attitude(_status.event.player,_status.event.getParent().player)>0){
                if(card.name=='tao') return -10;if(card.name=='jiu'&&_status.event.player.hp!=1) return -10;
                if(event.qipai<1){return -10;};
                if(get.suit(card)!='heart') return 7-get.value(card);
                return 5-get.value(card);
            }
            else{
                if(card.name=='tao') return -10;
            if(card.name=='jiu'&&_status.event.player.hp==1) return -10;
            return get.unuseful(card)+2.5*(5-get.owner(card).hp);
            }
        });};
        'step 5'
        if(result.bool){
            var card=result.cards[0];
            
            trigger.source.give(card,player);
        }
        else{
            trigger.source.loseHp();};
        if(event.num>0){event.goto(1)};
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
                // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
            },
                    },
                },
                intro:{
                    content:function(){
            return get.translation(skill+'_info');
        },
                },
            },
            zhiyangai:{
                audio:"ext:舰R牌将:2",
                audioname:["gexuan","re_yufan"],
                trigger:{
                    player:"phaseJieshuBegin",
                },
                direct:true,
                content:function(){
        "step 0"
         event.num1=player.countMark('jinengup')+1;event.num2=0;
        var a=game.countPlayer(function(current){return get.attitude(player,current)>0});
        player.chooseTarget(get.prompt('zhiyan'),[1,Math.min(event.num1,a)],'令目标角色摸一张牌并展示之。<br>若为装备牌，则其选择是否装备。<br>(每强化一次技能，便+1技能的目标数)',function(card,player,target){
            return get.distance(player,target,'pure')<=1+player.countMark('jinengup');
        }).set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
        "step 1"
        if(result.bool){
            event.target=result.targets;
            player.logSkill('zhiyan',result.targets);
        }
        else{
            event.finish();
        }
        "step 2"
        event.target[event.num2].draw('visible');
        "step 3"
        var card=result[0];
        if(get.type(card)=='equip'){
            if(event.target[event.num2].getCards('h').contains(card)&&event.target[event.num2].hasUseTarget(card)){
                event.target[event.num2].chooseUseTarget(card);
                game.delay();
            }
        }
        "step 4"
        if(event.target.length-1>event.num2){       
         event.num2+=(1);  event.goto(2);}
    },
                ai:{
                    expose:0.2,
                    threaten:1.2,
                },
            },
            "fangkong2":{
                audio:"ext:舰R牌将:1",
                audioname:["yixian","reganning","sunce","re_sunben","re_sunce","ol_sunjian"],
                unique:true,
                nodelay:true,
                lastDo:true,
                trigger:{
                    global:"useCardToPlayered",
                },
                filter:function(event,player){
        if(event.getParent().triggeredTargets3.length>1) return false;//万箭要作用七个目标,而你不想跟着遍历七次技能。
        if(get.type(event.card)!='trick') return false;
        if(get.info(event.card).multitarget) return false;
        if(!player.countCards('he'))return false;
        if(event.targets.length<2) return false;return true;},
                direct:true,
                content:function(){
    'step 0'
    var next=player.chooseCardTarget({
            prompt:get.prompt('防空保护对象'),
            prompt2:('X为选择的角色数，当一名角色使用的锦囊牌指定了至少两名角色为目标时，<br>你可以消耗X的手牌，令此牌对X名角色无效。<br>强化技能:-'+(player.countMark('jinengup'))+'需要弃置的卡牌'),
        position:'hejs',//hej代指牌的位置，加个j即可用木流流马的牌。
            selectCard:function(){var player=_status.event.player;if(ui.selected.targets)return [1,Math.min(trigger.targets.length,Math.floor(player.countCards('he')-player.countMark('jinengup')))];return 1;
 },//要气质的卡牌，可以return[1,3]
            selectTarget:function(){var player=_status.event.player;if(ui.selected.cards)return [ui.selected.cards.length,ui.selected.cards.length+player.countMark('jinengup')];return 1;
},//要选择的目标，同上，目标上限跟着手牌数走，怕报错跟个判定。
        filterCard:function(card,player){
                return lib.filter.cardDiscardable(card,player);
        },//气质能气质掉的卡牌。
        filterTarget:function(card,player,target){
       return _status.event.targets.contains(target)&&!target.hasSkill('fangkong2_aibiexuan');
    },//选择事件包含的目标，同trigger的目标。有其他同技能的角色时，ai不要重复选择目标。
        ai1:function(card){
            if(ui.selected.cards&&ui.selected.cards.length>=Math.max(player.countCards('h')/3,1)) return -1; return 12-get.useful(card);},//建议卡牌以7为标准就行，怕ai不救队友，所以调高了。同时ai顺次选择卡牌时不要选太多卡牌，要形成持续的牵制。
        ai2:function(target){var trigger=_status.event.getTrigger();
    return -get.effect(target,trigger.card,trigger.player,_status.event.player);
        },targets:trigger.targets,//这个代码不能照搬到content以外的地方。贯石斧、朱雀羽扇有类似代码。还有recover版的。
           });//技能还没扩起来，括起来。
    'step 1'
    if(result.bool){//只能判断你有没有选择，然后给你true与false，没其他文本。
        player.discard(result.cards);//前面有卡牌card，可以返回card，不同于仁德主动技能直接写card。
            event.target=result.targets;//前面有目标target，可以返回target。
        if(event.target!=undefined){for(var i=0;i<trigger.targets.length;i+=(1)){if( event.target.contains(trigger.targets[i])){ trigger.getParent().excluded.add(trigger.targets[i]);trigger.targets[i].addSkill('fangkong_aibiexuan');game.log('取消卡牌目标',trigger.targets[i],'编号',i)}}};//三级选择，集合target是否包含trigger.target。同时测试是否选到了目标。
    player.logSkill('fangkong2',event.target);}//让技能发语音，发历史记录。
    },
                subSkill:{
                    aibiexuan:{
                        trigger:{
                            global:"useCardEnd",
                        },
                        forced:true,
                        content:function(){game.log('保护结束');player.removeSkill('fangkong2_aibiexuan');},
                        sub:true,
                    },
                },
            },
        },
        translate:{
            addskilltest:"addskilltest",
            liekexingdun:"列克星敦",
            chicheng:"赤城航母",
            bisimai:"俾斯麦&北宅",
            misuli:"密苏里战列",
            kunxi:"昆西重巡",
            ougengqi:"欧根重巡",
            haiwangxing:"海王星轻巡",
            yixian:"逸仙轻巡",
            rending:"仁淀轻巡",
            kangfusi:"康弗斯驱逐","z31":"z31驱逐",
            lizhan:"历战驱逐",
            xuefeng:"雪风驱逐",
            jingjishen:"竞技神军辅",
            "u1405":"u1405潜艇",
            changchun:"长春导驱",
            tiaozhanzhuanbei:"挑战装备",
            "tiaozhanzhuanbei_info":"挑战锁定技，游戏开始时，你将一张【回避】【专属武器】和一张【望远镜】置入你的装备区。你装备区内的武器牌和宝物牌不能被其他角色弃置。",
            danzong:"增强杀",
            "danzong_info":"每使用六张杀，你便可以在造成无属性伤害附加属性：<br>潜艇、驱逐：获得雷属性的效果，<br>战列、航母：获得雷属性与改进型冰杀的效果。<br>其他舰种时：获得火属性,点燃目标。<br>效果持续到伤害结算完成时（打不穿藤甲的高爆弹与暴击藤甲的决斗）",
            kaishimopao:"开始摸牌",
            "kaishimopao_info":"<br>，判定阶段你可以减少一次摸牌阶段的摸牌，然后在回合结束时摸一张牌。",
            jianzaochuan:"建造",
            "jianzaochuan_info":"当你进行了至少一次强化后1.出牌阶段<br>你可以弃置3张不同花色的牌，提升一点血量上限。<br>2.当你濒死时，<br>你可以弃置4张不同花色的牌，回复一点体力。",
            "paohuozb_skill":"炮火准备1",
            "paohuozb_skill_info":"装备技能",
            fupaozu:"副炮",
            "fupaozu_info":"每回合限一次，你可以弃置最多五张相同花色的牌，失去n-2点体力，n为弃牌数,对你选择的目标视为使用n-1张决斗(第一个选择只是优化ai表现用的)，<br>第三、四张决斗将造成属性伤害。你获得技能[袭击]",
            zhuangjiafh:"装甲防护",
            "zhuangjiafh_info":"拥有护甲时，减少等同于护甲的手牌上限。<br>每当你结算完回复的血量，或受到的伤害时,<br>你可以弃置至多三张红色牌，获得X点护甲。（X为弃牌数）<br>若你没有红色牌且没有用护甲承受此次伤害，<br>你在伤害结算后获得1点护甲，而无需弃牌。",
            hangmucv:"航母",
            "hangmucv_info":"一轮游戏开始时，你可以弃置两张手牌，<br>视为对非友方角色使用万箭齐发。<br>没有手牌会结束此技能。",
            yuanhang:"远航",
            "yuanhang_info":"受伤时手牌上限+1<br>限x次，当你失去手牌后，且手牌数小于手牌上限/2+1时，你摸一张牌。可在强化中提升X值。<br>当你进入濒死状态时，你摸一张牌，体力上限大于二时需减少一点体力上限，额外摸一张牌；死亡后，你可以令一名角色摸一张牌。",
            zhanliebb:"战列",
            "zhanliebb_info":"",
            qingxuncl:"轻巡",
            "qingxuncl_info":"",
            zhongxunca:"重巡",
            "zhongxunca_info":"",
            misscoversha:"回出杀数",
            "misscoversha_info":"杀被回避会回复当回合出杀次数",
            roundonefire:"先制攻击",
            "roundonefire_info":"能加快战局推进的技能。",
            xianjinld:"先进雷达",
            "xianjinld_info":"可以选择一个增益：1.攻击，实际距离此角色为1的队友：武器攻击距离+1;但防御杀的距离-1，队友的摸牌阶段多摸一张牌。或：2.防御距离+1，但是攻击距离-1，自己的摸牌阶段少抽一张牌。",
            "rendeonly2":"仁德界改",
            "rendeonly2_info":"给实际距离为1的队友最多两张牌，一回合限2次，给出第二张牌时，你视为使用一张基本牌。",
            diewulimitai:"递杀",
            "diewulimitai_info":"给实际距离为1的队友递一张杀或装备牌，可以立即使用（杀只能用一次），一回合限2次。",
            kanpolimitai:"制空权",
            "kanpolimitai_info":"你可以将一张黑色手牌当无懈可击使用。",
            kaifa:"开发装备",
            "kaifa_info":"出牌阶段，你可以展示一张未强化过的【诸葛连弩】或标准包/军争包/SP包中的防具牌，然后对其进行强化。当你处于濒死状态时，你可以重铸一张防具牌，然后将体力回复至1点。",
            huijiahuihe:"额外回合",
            "huijiahuihe_info":"祭祀：当你有护甲时，你可以移除所有护甲并进行一个额外的回合；额外回合的摸牌数等于护甲数。",
            qianting:"潜艇",
            "qianting_info":"每回合限两次，将♦/♥牌当做顺手牵羊，♣/♠牌当做兵粮寸断使用<br>你使用的锦囊牌可以对距离你2以内的角色使用。<br>一轮游戏开始时，当你有《开幕》技能时，你可以弃置一张牌，对一个目标使用一张雷杀。没有手牌会结束此技能。",
            wulidebuff:"雷火永续",
            "wulidebuff_info":"火杀：令目标回合结束受到一点火焰伤害，摸一张牌。</br>冰杀：护甲加1伤；减少对手1点防御距离。</br>雷杀：自动判断是否流失对手体力；减少对手1点手牌上限；。</br>回合结束后移除所有进水、减速、燃烧。",
            junfu:"军辅船",
            "junfu_info":"可以给其他人送牌，濒死给青囊技能<br>其他人回合开始时,你可以把至多手牌上限/2张的手牌存于武将牌上，如手牌般使用。<br>实际距离你 1+x 的队友回合开始时，你可以把存储的牌交给ta，然后你摸一张牌。<br>(目标的手牌数<8才能使用此技能)。",
            quzhudd:"驱逐舰",
            "quzhudd_info":"脱离濒死后获得，当一名角色成为杀的目标时，你可以弃置一张牌，令此杀转移给你。此杀结算完成后你摸一张牌。",
            daoqu:"导驱",
            "daoqu_info":"你使用杀时可以额外指定x名目标。(x为技能强化次数)",
            huibi:"回避(八卦)",
            "huibi_info":"你需要打出闪时可以进行一次判定，为桃、闪、方块，则视为打出闪。<br>若判定未生效,且手牌数在手牌上限以下(含)，你会获得判定牌。<br>(手牌上限小于4则视为4)",
            "hanbing_gai":"寒冰改",
            "hanbing_gai_info":"当你造成属性伤害时，你可以防止此伤害并弃置目标2*X张牌，x为伤害值",
            qianghuazhuang:"强化装备",
            "qianghuazhuang_info":"你可以消耗经验，或弃置二至四张牌，选择一至两个永久效果升级。<br>（如摸牌、攻击距离、手牌上限等）每回合限两次。装备牌代表两张牌",
            huokongld:"火控雷达",
            "huokongld_info":"当你使用的【杀】被目标角色使用的【闪】抵消时，你可以令对手获得（2*受伤量）张牌，令此【杀】依然对其造成伤害。强化技能能减少给牌量卡牌。",
            "ganglie_gai":"刚烈弱化",
            "ganglie_gai_info":"每当你受到1点伤害后，若你的体力不大于2，你可以弃置x张牌并进行判定。<br>若结果不为红桃，则伤害来源顺序选择执行一项：1.弃置x+1张手牌，2.选择交给你一张牌;3.都未执行，则其失去一点体力(无视护甲)。<br>若你先弃置了两张牌，则判定失败时可以获得目标的一张牌;目标进行选择2前，会额外失去一张牌。",
            _yidong:"移动座位",
            "_yidong_info":"",
            zhiyangai:"直言",
            "zhiyangai_info":"令目标角色摸一张牌并展示之。<br>若为装备牌，则其可以选择是否装备。<br>(每强化一次技能，便+1技能的目标数)",
        },
			};
			if(lib.device||lib.node){
				for(var i in jianrjinji.character){jianrjinji.character[i][4].push('ext:舰R牌将/'+i+'.jpg');}
			}else{
				for(var i in jianrjinji.character){jianrjinji.character[i][4].push('db:extension-舰R牌将:'+i+'.jpg');}
			}//由于以此法加入的武将包武将图片是用源文件的，所以要用此法改变路径。可以多指定x个目标数（x技能强化的次数），
			return jianrjinji;
		});
		lib.config.all.characters.push('jianrjinji');
		if(!lib.config.characters.contains('jianrjinji')) lib.config.characters.push('jianrjinji');
		lib.translate['jianrjinji_character_config']='舰R竞技';// 包名翻译
		//卡包（手牌）
		game.import('card',function(){
			var jianrjinjibao={
			name:'jianrjinjibao',//卡包命名
			connect:true,//卡包是否可以联机
        card:{
            jinjuzy:{
                audio:true,
                image:'ext:舰R牌将/jinjuzy.jpg',
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
        return get.attitude(player,target)<0&&target.getEquip(2)!='tengjia';
    },
                content:function(){
        "step 0"
        if(typeof event.baseDamage!='number') event.baseDamage=1;
        if(event.directHit) event._result={bool:false};
        else{
            var next=target.chooseToRespond({name:'shan'||'huibi9'});
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
            if(target.getEquip(2)!='tengjia')target.damage(event.baseDamage);
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
                        value:7,
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
            jiakongls:{
            image:'ext:舰R牌将/jiakongls.jpg',
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
            num=Math.floor(event.targets.length*1.5);
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
        game.addVideo('cardDialog',null,event.preResult);if(!player.countMark('jiakongls')){player.addMark('jiakongls');player.chooseUseTarget(true,'jiakongls')};
    },
                ai:{
                    wuxie:function(){
            if(Math.random()<0.5) return 0;
        },
                    basic:{
                        order:10,
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
                return (3-get.distance(sorter,target,'absolute')/game.countPlayer())*get.attitude(player,target)>0?0.5:0.7;
            },
                    },
                    tag:{
                        draw:1,
                        multitarget:1,
                    },
                },
                fullimage:true,
            },
            mingzuyq:{
            image:'ext:舰R牌将/mingzuyq.jpg',
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
            hangkongzhan:{
            image:'ext:舰R牌将/hangkongzhan.jpg',
                type:"equip",
                subtype:"equip4",
                distance:{
                    attackFrom:-1,
                },
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
                skills:["roundonefire"],
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
            paohuozb:{
            image:'ext:舰R牌将/paohuozb.png',
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
                    return 2.5-get.equipValue(card,player)/20;
                }
                else{
                    return 0+get.equipValue(card,player)/20;
                }
            },
                        useful:2,
                        value:function(card,player,index,method){
                if(player.hp<2||player.countCards('h','sha')<1||!player.canUse('sha',player))return 0.01
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
                skills:["paohuozb_skill","danzong"],
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
            xingyun:{
            image:'ext:舰R牌将/xingyun.png',
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
                skills:["huibi"],
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
                fullskin:true,
            },
            sansheyl:{
            image:'ext:舰R牌将/sansheyl.png',
                type:"basic",
                cardcolor:"club",
                derivation:"gjqt_xieyi",
                enable:true,
                notarget:true,
                content:function(){
        'step 0'
        var choice='liutouge';
        player.chooseVCardButton('选择一张牌视为使用之',['sha','sha','sha']).set('ai',function(button){
            if(button.link[2]==_status.event.choice) return 2;
            return Math.random();
        }).set('choice',choice).set('filterButton',function(button){
            return _status.event.player.hasUseTarget(button.link[2]);
        });
        'step 1'
        if(result.bool){
        player.chooseUseTarget(result.links[0][2]);player.chooseUseTarget(result.links[0][2]);}else event.finish();
    },
                ai:{
                    order:5,
                    result:{
                        player:1,
                    },
                },
                fullimage:true,
            },
            "quzhupao3":{
            image:'ext:舰R牌将/quzhupao3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "qingxunpao3":{
            image:'ext:舰R牌将/qingxunpao3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "zhongxunpao3":{
            image:'ext:舰R牌将/zhongxunpao3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "zhanliepao3":{
            image:'ext:舰R牌将/zhanliepao3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "zhandouji3":{
            image:'ext:舰R牌将/zhandouji3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            huokongld:{
            image:'ext:舰R牌将/huokongld.png',
                fullskin:true,
                type:"equip",
                subtype:"equip4",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "yuleiqianting3":{
            image:'ext:舰R牌将/yuleiqianting3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "jianzaidaodan3":{
            image:'ext:舰R牌将/jianzaidaodan3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "yuleiji3":{
            image:'ext:舰R牌将/yuleiji3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
            "tansheqi3":{
               image:'ext:舰R牌将/tansheqi3.png',
                derivation:"majun",
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
                skills:[],
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
                fullskin:true,
            },
            "fasheqi3":{
            image:'ext:舰R牌将/fasheqi3.png',
                fullskin:true,
                type:"equip",
                subtype:"equip4",
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:2.5,
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
                skills:[],
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
            },
        },
          translate:{
            jinjuzy:"近距支援",
            "jinjuzy_info":"出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点伤害。",
            jiakongls:"架空历史",
            "jiakongls_info":"群星璀璨，欧陆风云，该武将首次使用会有两轮1.5展示牌量的五谷丰登，再次使用仅有一轮。",
            mingzuyq:"民族乐器",
            "mingzuyq_info":"北境之地的文化艺术。锁定技，你视为拥有技能“制衡”，若你已经有“制衡”，则改为取消弃置牌数的限制。",
            hangkongzhan:"航空战",
            "hangkongzhan_info":"建树丰厚，参与每轮开始时的三连杀战斗吗，每轮最多弃置三张牌。",
            paohuozb:"炮火准备",
            "paohuozb_info":"试试就逝世，扣一血得属性杀增伤一次，然而现在所有舰船都有这个，可以图加一杀次数。",
            xingyun:"强力规避",
            "xingyun_info":"可以进行一次判定，为桃、闪则视为打出闪。<br>若判定未生效,会获得判定牌。<br>若武将为驱逐且没有判定成功，可以额外触发一次。",
            sansheyl:"攻击",
            "sansheyl_info":"其实就是杀，但此杀能连打两次。。",
            "sushepao3":"速射炮",
            "sushepao3_info":"没有特殊效果",
            "quzhupao3":"速射炮",
            "quzhupao3_info":"",
            "qingxunpao3":"两用炮",
            "qingxunpao3_info":"",
            "zhongxunpao3":"中型主炮",
            "zhongxunpao3_info":"",
            "zhanliepao3":"大型主炮",
            "zhanliepao3_info":"",
            "zhandouji3":"战斗机",
            "zhandouji3_info":"",
            huokongld:"火控雷达",
            "huokongld_info":"强大的雷达，可以精准的命中对手。（没有技能的装备）",
            "yuleiqianting3":"鱼雷(潜艇用)",
            "yuleiqianting3_info":"",
            "jianzaidaodan3":"反舰导弹",
            "jianzaidaodan3_info":"",
            "yuleiji3":"鱼雷机",
            "yuleiji3_info":"",
            "tansheqi3":"弹射器",
            "tansheqi3_info":"",
            "fasheqi3":"发射器",
            "fasheqi3_info":"",
        },
				list:[["heart","1","hangkongzhan"],["heart","1","paohuozb"],["heart","1","xingyun"],["heart","1","sansheyl"],["heart","1","jinjuzy"],["heart","1","jiakongls"],["heart","1","mingzuyq"]],//牌堆添加
			}
			return jianrjinjibao
		});
		lib.translate['jianrjinjibao_card_config']='舰R竞技卡包';
		lib.config.all.cards.push('jianrjinjibao');
		if(!lib.config.cards.contains('jianrjinjibao')) lib.config.cards.push('jianrjinjibao');//包名翻译
	};
},help:{},config:{"jianrjinji":{"name":"将舰R竞技内武将设为禁用","init":false},"qyzhugeliang":{"name":"第一轮添加额外技能","intro":"开启后，主公可以在回合开始时，选择一组技能，令所有角色获得这些技能的使用权，直到下一回合开始；还有火攻一类的卡组可以选择","init":false},"yidong":{"name":"战术移动","intro":"开启后，角色包内的角色获得以下技能：<br>1.可以在局内移动自己角色的座位 ，限制为相邻座位与队友。<br>2.可以给队友递装备、杀，队友得到牌就能立即使用，但杀只能出一次。<br>与挑战技能：<br>全员一血开局，根据流失的体力数多摸牌；<br>全员不屈，让阴间的力量站起来。","init":true},"kaishimopao":{"name":"改良型摸牌阶段","intro":"开启后，卡牌包内的武将获得技能【优质摸牌】，<br>能减少摸牌阶段摸牌量，<br>获得获取所需卡牌的能力，<br>与应对延时锦囊牌的方案。","init":true}},package:{
    character:{
        character:{
          addskilltest:["male","wei",9,["yuanhang","fangko2"],["forbidai","des:测试用"]],
        
        },
        translate:{
            addskilltest:"addskilltest",
        },
    },
    card:{
        card:{},
        translate:{
            
        },
        list:[],
    },
    skill:{
        
        translate:{
            
        },
    },
    intro:"制作组群，730255133，括号删除#(滑稽)   建议把其他武将包设为点将才能用，体验丰富而简单的卡牌对战<br>闪避（响应）对面的攻击，强化自己的摸牌，与队友互给关键牌，通过攻击减少对手手牌数，拉开牌差，赢得优势。 <br>雷杀对有护甲或者有失血反击技能的目标流失体力（穿甲），冰杀对有护甲的目标加1伤，火杀会让对手于出牌阶段结束后扣一血。<br>卡牌里也有作者尝试的身影，可以编辑牌堆尝试哦。",
    author:"※人杰地灵游戏中",
    diskURL:"https://pan.baidu.com/s/1JTv8QGtFu90UED_ZVYm5-A 提取码：5iox",
    forumURL:"",
    version:"1.14",
},files:{"character":["changchun.jpg"],"card":["fasheqi3.png"],"skill":[]}}})