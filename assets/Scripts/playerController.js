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
        
        
        var len = this.crds.length;
        
        for(var i=0;i<len;i++)
        {
            this.loadAndMove(i);
        }

    },

    loadAndMove (i) {
        var selCard = cc.find("Canvas/"+this.crds[i]);
        var len = this.crds.length;
        if(this.node.name == "player1")
        {
            cc.resources.load("Sprites/"+this.crds[i], cc.SpriteFrame, (err, asset) => {
                selCard.getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                selCard.getChildByName("Background").color = new cc.Color(94,94,94);
            });
        }
        else
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
        this.cardDict[this.crds[i][this.crds[i].length -1]].push(parseInt(this.crds[i].substr(0,this.crds[i].length - 1)));
    },

    giveCall()
    {
        if(manager.getComponent("manager_code").cycleChecker()){
            
            if(this.node.name == "player1")
            {
                cc.find("Canvas/Call").active = true;
            }
            
            else{
                manager.getComponent("manager_code").takeCall(this.node.name,1);
                this.next.getComponent("playerController").giveCall();
            }
            
        }
        else
            this.next.getComponent("playerController").makeMove(); 
    },

    makeMove()
    {
        if(manager.getComponent("manager_code").cycleChecker()){
            //move code starts
            if(this.node.name == "player1")
            {
                if(manager.getComponent("manager_code").fCall == null)
                {
                    for(var i=0;i<this.crds.length;i++)
                    {
                        var selCard = cc.find("Canvas/"+this.crds[i]);
                        selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                        
                        selCard.getComponent(cc.Button).interactable = true;
                        
                    }
                }
                else{
                    var c = manager.getComponent("manager_code").fCall;
                    var ct = c[c.length -1];
                    var cn = parseInt(c.substr(0,c.length - 1));
                    if(cardDict[ct].length > 0)
                    {
                        for(var i=0;i<cardDict[ct].length;i++)
                        {
                            var selCard = cc.find("Canvas/"+cardDict[ct][i]);
                            selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                            selCard.getComponent(cc.Button).interactable = true;
                        }
                    }
                    else if(cardDict['s'].length > 0)
                    {
                        for(var i=0;i<cardDict['s'].length;i++)
                        {
                            var selCard = cc.find("Canvas/"+cardDict['s'][i]);
                            selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                            selCard.getComponent(cc.Button).interactable = true;
                        }
                    }
                    else{
                        for(var i=0;i<this.crds.length;i++)
                        {
                            var selCard = cc.find("Canvas/"+this.crds[i]);
                            selCard.getChildByName("Background").color = new cc.Color(255,255,255);
                            selCard.getComponent(cc.Button).interactable = true;
                        }
                    }
                }
            }
            else{
                //If not player
                this.next.getComponent("playerController").makeMove();
            }
            
        }
        else
            //this.next.getComponent("playerController").makeMove();
            console.log(this.node.name+" making move");
    }

    // update (dt) {},
});
