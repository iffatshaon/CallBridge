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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        manager = cc.find("GameManager");
    },

    getCard(crds){
        var len = crds.length;
        for(var i=0;i<len;i++)
        {
            this.loadAndMove(crds,i);   
        }


    },

    loadAndMove (crds,i) {
        var selCard = cc.find("Canvas/"+crds[i]);
        var dist = 30;
        var len = crds.length;
        selCard.x = this.node.x;
        selCard.y = this.node.y;
        if(selCard.x == 0)
            selCard.x = -(((len+1)/2)-(i+1))*dist;
        else if(selCard.y == 0)
        {
            selCard.y = -(((len+1)/2)-(i+1))*dist;
            selCard.angle=90;
        }

    },

    giveCall()
    {
        if(manager.getComponent("manager_code").cycleChecker()){
            //Call system code starts

            //call system code ends
            this.next.getComponent("playerController").giveCall();
        }
        else
            this.next.getComponent("playerController").makeMove(); 
    },

    makeMove()
    {
        if(manager.getComponent("manager_code").cycleChecker()){
            //move code starts

            //move code ends
            this.next.getComponent("playerController").makeMove();
        }
        else
            this.next.getComponent("playerController").makeMove();
        console.log(this.node.name+" making move");
    }

    // update (dt) {},
});
