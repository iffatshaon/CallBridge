// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var crds = ['2c','3c','4c','5c','6c','7c','8c','9c','10c','11c','12c','13c','14c','2d','3d','4d','5d','6d','7d','8d','9d','10d','11d','12d','13d','14d','2h','3h','4h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s','13s','14s'];
var turn = null;
var funcToCall = "giveCall";
var call = [0,0,0,0];
var point = [0,0,0,0];
var current = ["1","1","1","1"];
cc.Class({
    extends: cc.Component,

    properties: {
        scramble: {
            default: null,
            type: cc.Node,
        },
        player1: {
            default: null,
            type: cc.Node,
        },
        player2: {
            default: null,
            type: cc.Node,
        },
        player3: {
            default: null,
            type: cc.Node,
        },
        player4: {
            default: null,
            type: cc.Node,
        },
        slider: {
            default: null,
            type: cc.Node,
        },
        fCall: {
            default: null,
            type: cc.Object,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scramble.zIndex = 100;
        this.slider.getParent().zIndex = 120;
        for(var i=0;i<52;i++)
        {
            cc.resources.preload("Sprites/"+crds[i], cc.SpriteFrame);
        }
    },

    scrambler()
    {
        for(var i=0;i<52;i++)
        {
            var val = Math.floor(Math.random() * 52);
            var temp = crds[i];
            crds[i] = crds[val];
            crds[val] = temp;
        }
    },

    GameBegin()
    {
        this.scramble.active = false;
        this.scrambler();
        this.player1.getComponent("playerController").getCard(crds.slice(0,13));
        this.player2.getComponent("playerController").getCard(crds.slice(13,26));
        this.player3.getComponent("playerController").getCard(crds.slice(26,39));
        this.player4.getComponent("playerController").getCard(crds.slice(39,52));
        cc.find("Canvas/player"+(Math.floor(Math.random()*4)+1)).getComponent("playerController").giveCall();
    },

    cycleChecker()
    {
        turn++;
        if(turn>4)
        {
            turn=0;
            return false;
        }
        return true;
    },

    CallSlider()
    {
        var sVal = Math.round(this.slider.getComponent(cc.Slider).progress*12+1);
        this.slider.getParent().getChildByName("callAmount").getComponent(cc.Label).string = sVal;
    },

    sliderGiveCall()
    {
        this.takeCall("player1",Math.round(this.slider.getComponent(cc.Slider).progress*12+1));
        cc.find("Canvas/Call").active = false;
        this.player2.getComponent("playerController").giveCall();
    },

    takeCall(player,callGiven)
    {
        call[parseInt(player[player.length -1])-1] = callGiven;
        //console.log(call);
    }

    // update (dt) {},
});
