// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var manager;
cc.Class({
    extends: cc.Component,

    properties: {
        scramble: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        manager = cc.find("GameManager").getComponent("manager_code");
    },

    managerContinue()
    {
        manager.continue();
    },

    managerRestart(){
        manager.restart();
    },

    removeItem()
    {
        this.scramble.active = true;
        this.node.active = false;
    }
    // update (dt) {},
});
