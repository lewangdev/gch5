import Util from "./Util";
import GameLogic from "./GameLogic";
import GarbageData from "./DataClass";
import Gameover from "./Gameover";
import MusicManager from "./MusicManager";

const level1Speed = 140;
const level2Speed = 220;
const level3Speed = 350;

const dropSpeed = 300;
const gcCreateSpeed_default = 2;
const topOfCarousel = 617;
const startPos = -2160;
const endPos = 2160;
const gameTime = 60;

const gcCreateSpeed_le1 = 2;
const gcCreateSpeed_le2 = 1;
const gcCreateSpeed_le3 = 0.6;

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameView extends cc.Component {

    public onDropGarbage: Function;

    private carousel1: fgui.GComponent;
    private carousel2: fgui.GComponent;

    private view: fgui.GComponent;
    private youhai: fgui.GGraph;
    private kehuishou: fgui.GGraph;
    private shilaji: fgui.GGraph;
    private ganlaji: fgui.GGraph;

    private timer: fgui.GTextField;
    private score: fgui.GTextField;
    private coolDownTxt: fgui.GTextField;
    private star_progress: fgui.GProgressBar;
    private btn_game_ctrl: fgui.GButton;
    private btn_game_sound: fgui.GButton;


    private coolDown: fgui.Transition;
    private right: fgui.Transition;
    private wrong: fgui.Transition;

    private shilaji_t: fgui.Transition;
    private ganlaji_t: fgui.Transition;
    private kehuishou_t: fgui.Transition;
    private youhai_t: fgui.Transition;

    private task: fgui.Controller;
    private status: fgui.Controller;
    private sound_status: fgui.Controller;

    private youhaiRect: cc.Rect;
    private kehuishouRect: cc.Rect;
    private shilajiRect: cc.Rect;
    private ganlajiRect: cc.Rect;
    private gamestatus: boolean = false;
    private carouselSpeed = level1Speed;
    private gcCreateSpeed = gcCreateSpeed_default;

    private tweenDic: { [key: string]: Function; } = {};

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("UI/gc_com", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this.view = fgui.UIPackage.createObject("gc_com", "game").asCom;
        this.view.makeFullScreen();
        fgui.GRoot.inst.addChild(this.view);
        this.GetUIElements();
    }

    private GetUIElements() {
        this.task = this.view.getController("task");
        this.status = this.view.getChild("btn_game_ctrl").asCom.getController("status");
        this.sound_status = this.view.getChild("btn_game_sound").asCom.getController("status");

        this.carousel1 = this.view.getChild("carousel1").asCom;
        this.carousel2 = this.view.getChild("carousel2").asCom;
        this.youhai = this.view.getChild("youhai").asGraph;
        this.kehuishou = this.view.getChild("kehuishou").asGraph;
        this.shilaji = this.view.getChild("shilaji").asGraph;
        this.ganlaji = this.view.getChild("ganlaji").asGraph;

        this.timer = this.view.getChild("timer").asTextField;
        this.score = this.view.getChild("score").asTextField;
        this.coolDownTxt = this.view.getChild("coolDownTxt").asTextField;
        this.star_progress = this.view.getChild("star_progress").asProgress;
        this.btn_game_ctrl = this.view.getChild("btn_game_ctrl").asButton;
        this.btn_game_sound = this.view.getChild("btn_game_sound").asButton;

        this.coolDown = this.view.getTransition("coolDown");
        this.right = this.view.getTransition("right");
        this.wrong = this.view.getTransition("wrong");

        this.shilaji_t = this.view.getTransition("shilaji_t");
        this.ganlaji_t = this.view.getTransition("ganlaji_t");
        this.kehuishou_t = this.view.getTransition("kehuishou_t");
        this.youhai_t = this.view.getTransition("youhai_t");

        this.youhaiRect = this.youhai.localToGlobalRect(0, 0, this.youhai.width, this.youhai.height);
        this.kehuishouRect = this.kehuishou.localToGlobalRect(0, 0, this.kehuishou.width, this.kehuishou.height);
        this.shilajiRect = this.shilaji.localToGlobalRect(0, 0, this.shilaji.width, this.shilaji.height);
		this.ganlajiRect = this.ganlaji.localToGlobalRect(0, 0, this.ganlaji.width, this.ganlaji.height);

		this.timer.text = gameTime + "S";
    }

    start() {
        this.AttachController();
        this.coolDown.play(() => {
            this.carouselTween();
            this.gamestatus = true;
        });

        this.task.on(fgui.Event.STATUS_CHANGED, this.levelChanged, this);

        this.fisherYatesShuffle();

        this.schedule(() => {
            this.shilaji_t.play();
        }, 6);

        this.schedule(() => {
            this.ganlaji_t.play();
        }, 8);

        this.schedule(() => {
            this.kehuishou_t.play();
        }, 10);

        this.schedule(() => {
            this.youhai_t.play();
        }, 12);

        this.createRuleFuc = ()=> {
            if (!this.gamestatus) return;
            this.instantiate();
        }
        this.schedule(this.createRuleFuc, this.gcCreateSpeed);
    }

    private createRuleFuc:Function;
    private levelChanged()
    {
        this.unschedule(this.createRuleFuc);
        this.schedule(this.createRuleFuc, this.gcCreateSpeed);
    }

    private AttachController() {
        this.btn_game_ctrl.onClick(this.onClickCtrlBtn, this);
        this.btn_game_sound.onClick(() => {
            var page = this.sound_status.selectedPage;
            page = page == "play" ? "pause" : "play";
            var volume = MusicManager.getInstance().getMusicVolume();
            if (volume == 0) {
                MusicManager.getInstance().setAllMusicVolume(1);
                MusicManager.getInstance().setAllSoundVolume(1);
            }
            else {
                MusicManager.getInstance().setAllMusicVolume(0);
                MusicManager.getInstance().setAllSoundVolume(0);
            }
            this.sound_status.selectedPage = page;
        }, this);

        //TODO
        let curgameTime = gameTime;
        this.schedule(() => {
            if (!this.gamestatus) return;
            this.timer.text = curgameTime + "S";
            curgameTime--;

            if (curgameTime <= 0) {
                this.gameEnd();
                return;
            }

            if(curgameTime >= 0 && curgameTime < gameTime/3)
            {
                this.gcCreateSpeed = gcCreateSpeed_le3;
                this.carouselSpeed = level3Speed;
                return;
            }

            if(curgameTime >= gameTime/3 && curgameTime < gameTime*2/3)
            {
                this.gcCreateSpeed = gcCreateSpeed_le2;
                this.carouselSpeed = level2Speed;
                return;
            }

            if(curgameTime >= gameTime*2/3 && curgameTime < gameTime)
            {
                this.gcCreateSpeed = gcCreateSpeed_le1;
                this.carouselSpeed = level1Speed;
                return;
            }

        }, 1);

        var volume = MusicManager.getInstance().getMusicVolume();
        this.sound_status.selectedPage = volume == 0 ? "pause" : "play";
    }

    private mask:fgui.GGraph;
    private onClickCtrlBtn() {
        try {
            var page = this.status.selectedPage;
            this.gamestatus = page == "play";
            this.coolDown.setPaused(!this.gamestatus);
            page = page == "play" ? "pause" : "play";
            this.status.selectedPage = page;
            if(page == "play")
            {
                if(this.mask == null)
                {
                    this.mask = new fgui.GGraph();
                }
                this.mask.setPosition(0,150);
                this.mask.setSize(1920,925);
                this.view.addChild(this.mask);
            }
            else
            {
                if(this.mask != null)
                {
                    this.mask.setPosition(10000,10000);
                }
            }

            cc.log(page);
        }
        catch (e) {
            console.log(e);
        }
    }

    private carouselTween() {
        var timeCallback = (dt) => {
            if (!this.gamestatus) return;
            this.carousel1.x -= dt * this.carouselSpeed;
            this.carousel2.x -= dt * this.carouselSpeed;

            if (this.carousel1.x < startPos) this.carousel1.x = endPos;
            if (this.carousel2.x < startPos) this.carousel2.x = endPos;
        }
        this.schedule(timeCallback, 0);
    }

    private offsetx = 0;
    private offsety = 0;
    private tmpDragObjName: string;
    onDragStart(evt: fgui.Event) {
        var garbage: fgui.GObject = fgui.GObject.cast(evt.currentTarget);
        this.tmpDragObjName = garbage.name;
        this.unschedule(this.tweenDic[garbage.id]);

        var pos = fgui.GRoot.inst.getTouchPosition();
        var btnRect = garbage.localToGlobalRect(0, 0, garbage.width, garbage.height);
        this.offsetx = pos.x - btnRect.x;
        this.offsety = pos.y - btnRect.y;
    }

    onDragEnd(evt: fgui.Event) {
        var garbage: fgui.GObject = fgui.GObject.cast(evt.currentTarget);

        var touchPos = fgui.GRoot.inst.getTouchPosition();
        this.judgeCorrect(garbage, touchPos, this.tmpDragObjName);
    }

    private getDropCan(touchPos: cc.Vec2) {
        var trashType = "none";
        if (this.youhaiRect.contains(touchPos)) trashType = "youhai";
        if (this.kehuishouRect.contains(touchPos)) trashType = "kehuishou";
        if (this.shilajiRect.contains(touchPos)) trashType = "shilaji";
        if (this.ganlajiRect.contains(touchPos)) trashType = "ganlaji";
        return trashType;
    }

    private putGarbageBack(garbage: fgui.GObject, touchPos: cc.Vec2) {
        if (garbage.y < topOfCarousel) {
            garbage.draggable = false;
            let dropTween = (dt) => {
                if (!this.gamestatus) return;
                var destinationY = Util.getRandomInteger(topOfCarousel, 960);
                garbage.y += dt * dropSpeed;
                if (garbage.y > destinationY) {
                    garbage.draggable = true;
                    this.schedule(this.tweenDic[garbage.id], 0);
                    this.unschedule(dropTween);
                }
            }
            this.schedule(dropTween, 0);
        }
        else {
            this.ResumeTween(garbage.asLoader);
            // this.schedule(this.tweenDic[garbage.id], 0);
        }
    }

    private level1:boolean = false;
    private level2:boolean = false;
    private judgeCorrect(garbage: fgui.GObject, touchPos: cc.Vec2, garbageName: string) {
        var whichTrash = this.getDropCan(touchPos)
        var gameData = this.onDropGarbage(whichTrash, garbageName) as GarbageData;

        if (whichTrash == "none") {
            if (garbage.y < topOfCarousel) {
                MusicManager.getInstance().playSound("clearFail");
                this.wrong.stop();
                this.wrong.setValue("pos", touchPos.x, touchPos.y);
                this.wrong.play();
            }
            this.putGarbageBack(garbage, touchPos);
            return;
        }
        if (gameData.correct) {

            MusicManager.getInstance().playSound("clearWin");
            this.right.stop();
            this.right.setValue("pos", touchPos.x, touchPos.y);
            this.right.play();

            this.returnToPool(garbage.asLoader);
        }
        else {
            this.wrong.stop();
            this.wrong.setValue("pos", touchPos.x, touchPos.y);
            this.wrong.play();
            MusicManager.getInstance().playSound("clearFail");
            this.putGarbageBack(garbage, touchPos);
        }

        this.score.text = gameData.score.toString();
        this.star_progress.value = gameData.curProgress;
        this.star_progress.max = gameData.curtotalProgress;
        this.task.selectedPage = gameData.level;
        // this.carouselSpeed = gameData.carouselSpeed;
        // this.gcCreateSpeed = gameData.gcCreateSpeed;

        if(gameData.dropedGarbageNum == 20 && !this.level1)
        {
            MusicManager.getInstance().playSound("level1");
            this.level1 = true;
        }
        if(gameData.dropedGarbageNum == 27 && !this.level2)
        {
            MusicManager.getInstance().playSound("level2");
            this.level2 = true;
        }
    }

    private garbageRes: string[] = [
        "kehuishou_1" , "kehuishou_2" , "kehuishou_3" , "kehuishou_4" , "kehuishou_5" , "kehuishou_6" , "kehuishou_7" , "kehuishou_8" , "kehuishou_9" , "kehuishou_10",
        "kehuishou_11", "kehuishou_12", "kehuishou_13", "kehuishou_14", "kehuishou_15", "kehuishou_16", "kehuishou_17", "kehuishou_18", "kehuishou_19", "kehuishou_20",
        "kehuishou_21", "kehuishou_22", "kehuishou_23", "kehuishou_24", "kehuishou_25", "kehuishou_26", "kehuishou_27", "kehuishou_28", "kehuishou_29", "kehuishou_30",
        "kehuishou_31","kehuishou_32","kehuishou_33","kehuishou_34","kehuishou_35",
        "ganlaji_1", "ganlaji_2", "ganlaji_3","ganlaji_4", "ganlaji_5", "ganlaji_6","ganlaji_7", "ganlaji_8",
        "shilaji_1", "shilaji_2", "shilaji_3", "shilaji_4", "shilaji_5", "shilaji_6", "shilaji_7", "shilaji_8", "shilaji_9", "shilaji_10","shilaji_11", "shilaji_12",
        "youhai_1","youhai_2","youhai_3","youhai_4","youhai_5","youhai_6","youhai_7","youhai_8","youhai_9"
    ];

    private gcInPool: fgui.GLoader[] = [];

	private strikeOut:number = 0;
    instantiate() {
        try {
			let gc = this.getFromPool();
			this.settingGc(gc);
            gc.draggable = true;
			this.setgcPos(gc);
			this.strikeOut++;
        }
        catch (e) {
            console.log(e);
        }
	}

	private settingGc(gc:fgui.GLoader)
	{
		if(this.strikeOut >= this.garbageRes.length)
		{
			this.strikeOut = 0;
			this.fisherYatesShuffle();
        }

		gc.url = "ui://gc_com/" + this.garbageRes[this.strikeOut];
		gc.name = this.garbageRes[this.strikeOut];
	}

	private fisherYatesShuffle() {

		var length:number = this.garbageRes.length;
		while(length>0)
		{
            var index = Util.getRandomInteger(0, length);
            var tmp = this.garbageRes[index];
			this.garbageRes[index] = this.garbageRes[length - 1];
			this.garbageRes[length - 1] = tmp;
			length--;
		}
	}

    instantiateFromSky() {
        try {
			let gc = this.getFromPool();

			this.settingGc(gc);
            gc.draggable = false;
			this.setSkygcPos(gc);
			this.strikeOut++;
        }
        catch (e) {
            console.log(e);
        }
    }

    private setSkygcPos(gc: fgui.GLoader) {
        var posx = Util.getRandomInteger(200, 1800);
        var posy = -50;
        let destinationY = Util.getRandomInteger(677, 850);
        gc.x = posx;
        gc.y = posy;
        let gcdel = gc;

        let initDropTween = (dt) => {
            if (!this.gamestatus) return;
            gcdel.y += dt * dropSpeed * 1.5;
            if (gcdel.y > destinationY) {
                gcdel.draggable = true;
                this.ResumeTween(gcdel);
                this.unschedule(initDropTween)
            }
        }
        this.schedule(initDropTween, 0);
    }

    private ResumeTween(gc: fgui.GLoader)
    {
        let gcdel = gc;
        var timeCallback = (dt)=> {
            if (!this.gamestatus) return;
            gcdel.x -= dt * this.carouselSpeed;
            if (gcdel.x < -gc.width) {
                this.returnToPool(gcdel);
            }
        }

        this.tweenDic[gc.id] = null;
        this.tweenDic[gc.id] = timeCallback;
        this.schedule(this.tweenDic[gc.id], 0);
    }

    private setgcPos(gc: fgui.GLoader) {
        var posx = Util.getRandomInteger(1920 + 50, 1920 + 52);
        var posy = Util.getRandomInteger(677, 850);
        gc.x = posx;
        gc.y = posy;
        let gcdel = gc;
        this.ResumeTween(gcdel);
    }

    private getFromPool() {
        var gc: fgui.GLoader;
        if (this.gcInPool.length > 0) {
            gc = this.gcInPool.pop();
        }
        else {
            gc = new fgui.GLoader();
            gc.setSize(200, 200);
            this.view.addChild(gc);
            gc.on(fgui.Event.DRAG_START, this.onDragStart, this);
            gc.on(fgui.Event.DRAG_END, this.onDragEnd, this);
        }
        return gc;
    }

    private returnToPool(element) {
        this.unschedule(this.tweenDic[element.id]);
        this.gcInPool.push(element);
        element.x = -500;
    }

    private gameEnd() {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Gameover);
        this.destroy();
        return;
    }

}
