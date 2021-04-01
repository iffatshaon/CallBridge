// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var crds = ['2c','3c','4c','5c','6c','7c','8c','9c','10c','11c','12c','13c','14c','2d','3d','4d','5d','6d','7d','8d','9d','10d','11d','12d','13d','14d','2h','3h','4h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s','13s','14s'];
cc.Class({
    extends: cc.Component,

    properties: {
        card: {
            default: null,
            type: cc.Prefab,
        },
        canvas: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        var cards;
        for(var i=0;i<52;i++)
        {
            cards = cc.instantiate(this.card);
            this.canvas.addChild(cards);
            cards.setPosition(cc.v2(0,0));
            cards.name = crds[i];
        }
    },

    start () {
        
    },

    // update (dt) {},
});
