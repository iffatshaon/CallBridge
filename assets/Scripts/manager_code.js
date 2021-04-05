// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var turn = null;
var funcToCall = "giveCall";
var call = [0,0,0,0];
var point = [0,0,0,0];
var current = ["1","1","1","1"];
var boardPoints = [[],[],[],[]];
var lastWin = null;
var total = [0,0,0,0];
var cardsComplete = ['2c','3c','4c','5c','6c','7c','8c','9c','10c','11c','12c','13c','14c','2d','3d','4d','5d','6d','7d','8d','9d','10d','11d','12d','13d','14d','2h','3h','4h','5h','6h','7h','8h','9h','10h','11h','12h','13h','14h','2s','3s','4s','5s','6s','7s','8s','9s','10s','11s','12s','13s','14s'];
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
        board: {
            default: null,
            type: cc.Node,
        },
        win: {
            default: null,
            type: cc.Node,
        },
        boardScore: {
            default: null,
            type: cc.Prefab,
        },
        fullBoard: {
            default: null,
            type: cc.Prefab,
        },
        fCall: {
            default: null,
            type: cc.Object,
        },
        trumped: false,
        cards:{
            default:[],
            type: cc.Array,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scramble.zIndex = 100;
        this.board.zIndex = 150;
        this.board.getChildByName("totalLine").zIndex = 152;
        this.board.getChildByName("Total").zIndex = 152
        this.board.getChildByName("buttonContainer").zIndex = 152;
        this.slider.getParent().zIndex = 120;
        this.cards = [...cardsComplete];
        for(var i=0;i<52;i++)
        {
            cc.resources.preload("Sprites/"+this.cards[i], cc.SpriteFrame);
        }
        cc.resources.preload("Sprites/back", cc.SpriteFrame);
        lastWin = (Math.floor(Math.random()*4));
    },

    scrambler()
    {
        for(var i=0;i<52;i++)
        {
            var val = Math.floor(Math.random() * 52);
            var temp = this.cards[i];
            this.cards[i] = this.cards[val];
            this.cards[val] = temp;
        }
    },

    GameBegin()
    {
        this.scramble.active = false;
        this.scrambler();
        cardsComplete = [...this.cards];
        this.player1.getComponent("playerController").getCard(this.cards.slice(0,13));
        this.player2.getComponent("playerController").getCard(this.cards.slice(13,26));
        this.player3.getComponent("playerController").getCard(this.cards.slice(26,39));
        this.player4.getComponent("playerController").getCard(this.cards.slice(39,52));

        cc.find("Canvas/player"+(lastWin+1)).getComponent("playerController").giveCall();
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
        this.slider.getComponent(cc.Slider).progress = (sVal-1)/12;
    },

    sliderGiveCall()
    {
        this.takeCall("player1",Math.round(this.slider.getComponent(cc.Slider).progress*12+1));
        this.player1.getComponent("playerController").showCallPoint(Math.round(this.slider.getComponent(cc.Slider).progress*12+1));
        cc.find("Canvas/Call").active = false;
        this.player2.getComponent("playerController").giveCall();
    },

    takeCall(player,callGiven)
    {
        call[parseInt(player[player.length -1])-1] = callGiven;
    },

    endOneRound()
    {
        console.log("end of one round");
        var usedCards = [...current];
        for(let i=0;i<4;i++)
        {
            var c = current[i][current[i].length-1];
            if(c == 's')
                current[i] = parseInt(current[i])*10;
            else if(c == this.fCall[this.fCall.length-1])
                current[i] = parseInt(current[i])*1;
            else
                current[i] = 0;
        }
        console.log(current);
        lastWin = current.indexOf(Math.max(...current));
        point[lastWin]+=1;
        cc.find("Canvas/player"+(lastWin+1)).getComponent("playerController").updatePoint(point[lastWin]);
        current = ["1","1","1","1"];
        this.fCall = null;
        var pos = cc.find("Canvas/player"+(lastWin+1)).position;
        cc.tween(cc.find("Canvas/"+usedCards[0])).to(0.5,{position: pos},{easing: 'sineIn'}).call(()=>{
            cc.resources.load("Sprites/back", cc.SpriteFrame, (err, asset) => {
                cc.find("Canvas/"+usedCards[0]).getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                cc.find("Canvas/"+usedCards[0]).active = false;
            });
        }).start();
        cc.tween(cc.find("Canvas/"+usedCards[1])).to(0.5,{position: pos},{easing: 'sineIn'}).call(()=>{
            cc.resources.load("Sprites/back", cc.SpriteFrame, (err, asset) => {
                cc.find("Canvas/"+usedCards[1]).getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                cc.find("Canvas/"+usedCards[1]).active = false;
            });
        }).start();
        cc.tween(cc.find("Canvas/"+usedCards[2])).to(0.5,{position: pos},{easing: 'sineIn'}).call(()=>{
            cc.resources.load("Sprites/back", cc.SpriteFrame, (err, asset) => {
                cc.find("Canvas/"+usedCards[2]).getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                cc.find("Canvas/"+usedCards[2]).active = false;
            });
        }).start();
        cc.tween(cc.find("Canvas/"+usedCards[3])).to(0.5,{position: pos},{easing: 'sineIn'}).call(()=>{
            cc.resources.load("Sprites/back", cc.SpriteFrame, (err, asset) => {
                cc.find("Canvas/"+usedCards[3]).getChildByName("Background").getComponent(cc.Sprite).spriteFrame = asset;
                cc.find("Canvas/"+usedCards[3]).active = false;
            });
            if(this.cards.length<1)
                this.endOneGame();
            else
                cc.find("Canvas/player"+(lastWin+1)).getComponent("playerController").makeMove();
        }).start();
        
    },

    cardPlayed(card,fromPlayer)
    {
        current[fromPlayer-1] = card;
        if(card[card.length - 1] == "s")
            this.trumped = true;
        if(this.fCall == null)
            this.fCall = card;
        var index = this.cards.indexOf(card);
        if (index > -1) {
            this.cards.splice(index, 1);
        }
    },
    maxPlayed(){
        var mx = 0;
        for(let i=0;i<4;i++)
        {
            let c = current[i];
            if(c[c.length-1] == this.fCall[this.fCall.length-1])
            {
                if(parseInt(c)>mx)
                    mx = parseInt(c);
            }
            else if(c[c.length-1] == 's')
                return false;
        }
        return mx;
    },
    maxTrumpPlayed(){
        var mx = 0;
        for(let i=0;i<4;i++)
        {
            if(current[i][current[i].length-1] == 's')
            {
                if(parseInt(current[i])>mx)
                    mx = parseInt(current[i]);
            }
        }
        return mx;
    },

    endOneGame(){
        this.cards = [...cardsComplete];
        for(var i=0;i<52;i++)
        {
            let card = cc.find("Canvas/"+this.cards[i]);
            card.position = cc.Vec2(0,0);
            card.active = true;
            card.angle = 0;
        }
        var scr = cc.instantiate(this.boardScore);
        scr.zIndex = 151;
        this.board.addChild(scr);
        for(let i=0;i<4;i++)
        {
            boardPoints[i].push((point[i]-call[i]>=0) ? (call[i]+(point[i]-call[i])*0.2):(-call[i]));
            total[i] += boardPoints[i][boardPoints[i].length-1];
            scr.getChildByName((i+1).toString()).getComponent(cc.Label).string = boardPoints[i][boardPoints[i].length-1];
            this.board.getChildByName("Total").getChildByName((i+1).toString()).getComponent(cc.Label).string = total[i].toFixed(2);
        }
        this.slider.getComponent(cc.Slider).progress = 0;
        this.slider.getParent().getChildByName("callAmount").getComponent(cc.Label).string = 1;
        console.log(boardPoints + " " + call + " " + point);
        point = [0,0,0,0];
        call = [0,0,0,0];
        
        this.scramble.active = true;
        this.trumped = false;
        this.player1.getComponent("playerController").hideCallPoint();
        this.player2.getComponent("playerController").hideCallPoint();
        this.player3.getComponent("playerController").hideCallPoint();
        this.player4.getComponent("playerController").hideCallPoint();
        
        this.board.active = true;
        this.player1.getComponent("playerController").flipCard();
        if(boardPoints[0].length>2)
            this.endOneBoard()
    },

    endOneBoard(){
        this.win.getChildByName("winText").getComponent(cc.Label).string = "Player "+(total.indexOf(Math.max(...total))+1)+" wins";
        this.win.active = true;
        this.win.zIndex = 200;
        this.scramble.active = false;
        this.restart();
    },

    continue(){
        this.board.active = false;
    },

    restart(){
        total = [0,0,0,0];
        this.board.destroy();
        this.board = cc.instantiate(this.fullBoard);
        cc.find("Canvas").addChild(this.board);
        this.board.zIndex = 150;
        this.board.getChildByName("totalLine").zIndex = 152;
        this.board.getChildByName("Total").zIndex = 152
        this.board.getChildByName("buttonContainer").zIndex = 152;
        lastWin = (Math.floor(Math.random()*4));
        boardPoints = [[],[],[],[]];
        this.board.active = false;
    },
    // update (dt) {},
});
