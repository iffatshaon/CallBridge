// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var manager = null;
cc.Class({
    extends: cc.Component,

    properties: {
        next:{
            default: null,
            type: cc.Node,
        },
        dist:{
            default:20,
            type: cc.Integer,
        },
        cardDict:{
            default:[],
            type: cc.Object,
        },
        crds:{
            default:[],
            type: cc.Array,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        manager = cc.find("GameManager");
        this.cardDict['c']=[];
        this.cardDict['h']=[];
        this.cardDict['d']=[];
        this.cardDict['s']=[];
    },

    getCard(crdst){
        this.crds = crdst;
        if(this.node.name == "player1")
        {
            this.crds = this.crds.sort(function(a, b){
                if (a[a.length - 1] > b[b.length - 1])
                    return 1;
                else if (a[a.length - 1] < b[b.length - 1])
                    return -1;
                else{
                    if(parseInt(a.substr(0,a.length - 1))>parseInt(b.substr(0,b.length - 1)))
                        return 1;
                    else
                        return -1;
                }
            });
        }
        else{
            this.crds = this.crds.sort(function(a, b){
                if(parseInt(a.substr(0,a.length - 1))>parseInt(b.substr(0,b.length - 1)))
                    return 1;
                else
                    return -1;
            });
        }
        
        
        var len = this.crds.length;
        
        for(var i=0;i<len;i++)
        {
            this.loadPlayerCards(i);
            cc.find("Canvas/"+this.crds[i]).active = true;
        }
        this.cardMoveToPosition();
        this.cardDict['c'].sort(function(a, b){return a-b});
        this.cardDict['h'].sort(function(a, b){return a-b});
        this.cardDict['d'].sort(function(a, b){return a-b});
        this.cardDict['s'].sort(function(a, b){return a-b});
    },

    loadPlayerCards (i) {
        var selCard = cc.find("Canvas/"+this.crds[i]);
        
        if(this.node.name == "player1")
        {
            cc.resources.load("Sprites/"+this.crds[i], cc.SpriteFrame, (err, asset) => {
                selCard.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                selCard.getChildByName("Background").color = new cc.Color(94,94,94);
            });
        }
        this.cardDict[this.crds[i][this.crds[i].length -1]].push(parseInt(this.crds[i].substr(0,this.crds[i].length - 1)));
    },
    cardMoveToPosition()
    {
        for(var i=0;i<this.crds.length;i++)
        {
            var selCard = cc.find("Canvas/"+this.crds[i]);
            var len = this.crds.length;
            selCard.zIndex = i+5;
            selCard.x = this.node.x;
            selCard.y = this.node.y;
            if(selCard.x == 0)
                selCard.x = -(((len+1)/2)-(i+1))*this.dist;
            else if(selCard.y == 0)
            {
                selCard.y = -(((len+1)/2)-(i+1))*this.dist;
                selCard.angle=90;
            }
        }
        
    },

    giveCall()
    {
        if(manager.getComponent("manager_code").cycleChecker()){
            
            if(this.node.name == "player1")
            {
                cc.find("Canvas/Call").active = true;
            }
            
            else{
                let enmCall = this.enemyCallCount();
                manager.getComponent("manager_code").takeCall(this.node.name,enmCall);
                this.showCallPoint(enmCall);
                this.next.getComponent("playerController").giveCall();
            }
            
        }
        else
            this.next.getComponent("playerController").makeMove(); 
    },

    makeMove()
    {
        if(manager.getComponent("manager_code").cycleChecker()){
            if(this.node.name == "player1")
            {
                if(manager.getComponent("manager_code").fCall == null)
                {
                    //console.log("fCall null")
                    for(var i=0;i<this.crds.length;i++)
                    {
                        var selCard = cc.find("Canvas/"+this.crds[i]);
                        //console.log(this.getTypeOfCard(this.crds[i]) + " " + manager.getComponent("manager_code").trumped)
                        if(this.getTypeOfCard(this.crds[i]) == "s" && !manager.getComponent("manager_code").trumped)
                        {
                            continue;
                        }
                        selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                        selCard.getComponent(cc.Button).interactable = true;
                    }
                }
                else{
                    //console.log("fCall not null")
                    var c = manager.getComponent("manager_code").fCall;
                    var ct = c[c.length -1];
                    var cn = parseInt(c.substr(0,c.length - 1));
                    if(this.cardDict[ct].length > 0)
                    {
                        for(var i=0;i<this.cardDict[ct].length;i++)
                        {

                            var selCard = cc.find("Canvas/"+this.cardDict[ct][i]+ct);
                            selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                            selCard.getComponent(cc.Button).interactable = true;
                        }
                    }
                    else if(this.cardDict['s'].length > 0)
                    {
                        for(var i=0;i<this.cardDict['s'].length;i++)
                        {
                            var selCard = cc.find("Canvas/"+this.cardDict['s'][i]+'s');
                            selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                            selCard.getComponent(cc.Button).interactable = true;
                        }
                    }
                    else{
                        for(var i=0;i<this.crds.length;i++)
                        {
                            var selCard = cc.find("Canvas/"+this.crds[i]);
                            if(this.getTypeOfCard(this.crds[i]) == "s" && !manager.getComponent("manager_code").trumped)
                            {
                                continue;
                            }
                            selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                            selCard.getComponent(cc.Button).interactable = true;
                        }
                    }
                }
            }
            else{
                //If not player
                var played = this.findCard(0);
                manager.getComponent("manager_code").cardPlayed(played,parseInt(this.getTypeOfCard(this.node.name)));
                console.log(this.node.name+" move: "+ played);
                cc.resources.load("Sprites/"+played, cc.SpriteFrame, (err, asset) => {
                    cc.find("Canvas/"+played).getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                });
                this.removeFromDict(played);
                this.cardMoveToPosition();
                if(this.node.x == 0)
                    var pos = cc.v2(0,Math.sign(this.node.y)*80);
                else
                    var pos = cc.v2(Math.sign(this.node.x)*80,0);
                cc.tween(cc.find("Canvas/"+played)).to(0.5,{angle:0,position: pos},{easing: 'sineIn'}).call(()=>{
                    
                    this.next.getComponent("playerController").makeMove();
                }).start();
                
            }
            
        }
        else
            manager.getComponent("manager_code").endOneRound();
    },

    playerInactiveAll()
    {
        for(var i=0;i<this.crds.length;i++)
            {
                var selCard = cc.find("Canvas/"+this.crds[i]);
                selCard.getChildByName("Background").color = new cc.Color(94,94,94);
                selCard.getComponent(cc.Button).interactable = false;
            }
    },

    removeFromDict(pl)
    {
        var index = this.cardDict[this.getTypeOfCard(pl)].indexOf(this.getNumberOfCard(pl));
        if (index > -1) {
            this.cardDict[this.getTypeOfCard(pl)].splice(index, 1);
        }
        var index = this.crds.indexOf(pl);
        if (index > -1) {
            this.crds.splice(index, 1);
        }
        //cc.find("Canvas/"+pl).active = false;
        cc.find("Canvas/"+pl).getChildByName("Background").color = new cc.Color(255,255,255);
    },

    findCard(shifter){
        var c = manager.getComponent("manager_code").fCall;
        var manCards = manager.getComponent("manager_code").cards;
        var cardUsed = this.crds[this.crds.length-1+shifter];
        var restriction;
        if(manager.getComponent("manager_code").trumped)
            restriction = ''
        else
            restriction = 's'
        if(c==null){
            console.log("findCard: "+ this.node.name + " "+ cardUsed);
            if(shifter<=0 && this.getNumberOfCard(cardUsed)>11)
            {
                
                if(this.getTypeOfCard(cardUsed) != restriction)
                {
                    if(this.getNumberOfCard(cardUsed) == 14)
                        return cardUsed;
                    else if(this.getNumberOfCard(cardUsed) == 13)
                    {
                        if(manCards.includes('14'+this.getTypeOfCard(cardUsed)))
                            return this.findCard(shifter-1)
                        else
                            return cardUsed;
                    }
                    else if(this.getNumberOfCard(cardUsed) == 12)
                    {
                        if(manCards.includes('14'+this.getTypeOfCard(cardUsed)) || manCards.includes('13'+this.getTypeOfCard(cardUsed)))
                            return this.findCard(shifter-1)
                        else
                            return cardUsed;
                    }
                    else
                        return this.findCard(1)
                }
                else{
                    return this.findCard(1);
                }
            }
            else
            {
                if(shifter<=0)
                    shifter = 1;
                cardUsed = this.crds[-1+shifter];
                console.log("findCard:+1 "+ this.node.name + " "+ cardUsed+ " " + this.crds + (-1+shifter));
                if(this.getTypeOfCard(cardUsed) != restriction)
                    return cardUsed
                else
                    return this.findCard(shifter+1);
            }
        }
        else
        {
            var cardTypeArray = this.cardDict[this.getTypeOfCard(c)];
            if(cardTypeArray.length>0){
                console.log("Matched type "+Math.max(...cardTypeArray))
                var mx = manager.getComponent("manager_code").maxPlayed();
                console.log("max: "+ mx);
                if(Math.max(...cardTypeArray) == 14 && mx<14)
                    return '14'+this.getTypeOfCard(c);
                else if(Math.max(...cardTypeArray) == 13 && mx<13 && !manCards.includes('14'+this.getTypeOfCard(c)))
                {
                        return '13'+this.getTypeOfCard(c);
                }
                else if(Math.max(...cardTypeArray) == 12 && mx<12 && (!manCards.includes('14'+this.getTypeOfCard(c)) || !manCards.includes('13'+this.getTypeOfCard(c))))
                {
                        return '12'+this.getTypeOfCard(c);
                }
                else{
                    console.log("Matched type but 14 13 12 not found");
                    for(let i=0;i<cardTypeArray.length;i++)
                    {
                        if(cardTypeArray[i]>mx)
                        {
                            console.log("Greater "+cardTypeArray[i]+" "+mx);
                            return cardTypeArray[i]+this.getTypeOfCard(c);
                        }
                    }
                    return cardTypeArray[0]+this.getTypeOfCard(c)
                }
            }
            else{
                for(let i=0;i<this.cardDict['s'].length;i++)
                {
                    if(this.cardDict['s'][i]>manager.getComponent("manager_code").maxTrumpPlayed())
                    {
                        manager.getComponent("manager_code").trumped = true;
                        return this.cardDict['s'][i]+'s';
                    }
                    else
                        return this.cardDict['s'][0]+'s'; 
                }
                return this.crds[0];
            }
        }
    },

    getNumberOfCard(str)
    {
        if(str == null || str == undefined)
            return 0;
        return parseInt(str.substr(0,str.length - 1))
    },
    getTypeOfCard(str)
    {
        if(str == null || str == undefined)
            return "n";
        return str[str.length -1];
    },

    flipCard(){
        for(let i=0;i<this.crds.length;i++)
        {
            cc.resources.load("Sprites/back", cc.SpriteFrame, (err, asset) => {
                selCard.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                selCard.getComponent(cc.Button).interactable = false;
            });
        }
        
    },

    enemyCallCount()
    {
        var cnt = 0;
        for(let i = this.crds.length-1;i>0;i--)
        {
            if(parseInt(this.crds[i])<14)
                break;
            cnt++;
        }
        for(let i = this.crds.length-1;i>0;i--)
        {
            if(parseInt(this.crds[i])<13)
                break;
            cnt+=0.5;
        }
        cnt+=Math.max(this.cardDict['s'].length-4,0)
        if(cnt>4)
            cnt = 4
        else if(cnt<1)
            cnt = 1
        return Math.round(cnt);
    },

    showCallPoint(text)
    {
        this.node.getChildByName("callCont").active = true;
        this.node.getChildByName("callCont").getChildByName("call").getComponent(cc.Label).string = text;
    },

    hideCallPoint()
    {
        this.node.getChildByName("callCont").active = false;
        this.node.getChildByName("callCont").getChildByName("point").getComponent(cc.Label).string = "0";
    },

    updatePoint(text)
    {
        this.node.getChildByName("callCont").getChildByName("point").getComponent(cc.Label).string = text;
    }

    // update (dt) {},
});
