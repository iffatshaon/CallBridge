// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var player1;
var player2;
var manager;
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        player1 = cc.find("Canvas/player1").getComponent("playerController");
        player2 = cc.find("Canvas/player2").getComponent("playerController");
        manager = cc.find("GameManager").getComponent("manager_code");
    },

    cardClicked(){
        
        manager.cardPlayed(this.node.name,1);
        var pos = cc.v2(0,-80);
        
        cc.tween(cc.find("Canvas/"+this.node.name)).to(0.5,{angle:0,position: pos},{easing: 'sineIn'}).call(()=>{
            player1.playerInactiveAll();
            player1.removeFromDict(this.node.name);
            player1.cardMoveToPosition();
            player2.makeMove();
        }).start();
    }

    // update (dt) {},
});
