const {ccclass, property} = cc._decorator;
import Welcome from "./Welcome";
import GameView from "./GameView";
import GameLogic from "./GameLogic";
import UserData from "./UserData";
import Rank from "./Rank";
import MusicManager from "./MusicManager";

@ccclass
export default class Gameover extends cc.Component {
    private view: fgui.GComponent;
    private input_root:fgui.GObject;
    private btn_return: fgui.GButton;
	private btn_replay: fgui.GButton;
	private btn_rank: fgui.GButton;
    private btn_confirm: fgui.GButton;
    private btn_cancel: fgui.GButton;
    private score_back: fgui.GTextField;
    private score: fgui.GTextField;
    private input:fgui.GTextInput;
    private task: fgui.Controller;
    private inputCtl: fgui.Controller;

    private gamelogic:GameLogic;
    private volume:number;

	//添加烟花组件
	// private barrel:cc.Object;

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("UI/gc_com", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this.view = fgui.UIPackage.createObject("gc_com", "gameover").asCom;
        this.view.makeFullScreen();
        fgui.GRoot.inst.addChild(this.view);

        this.input_root = this.view.getChild("input_root");

        this.btn_return = this.view.getChild("btn_return").asButton;
        this.btn_return.onClick(this.onClickReturn,this);

        this.btn_replay = this.view.getChild("btn_replay").asButton;
		this.btn_replay.onClick(this.onClickReplay,this);

		this.btn_rank = this.view.getChild("btn_rank").asButton;
        this.btn_rank.onClick(this.onClickRank,this);

        this.input = this.view.getChild("input").asTextInput;
        this.inputCtl = this.view.getController("input");

        this.btn_confirm = this.view.getChild("btn_confirm").asButton;
        this.btn_confirm.onClick(_=>{this.recordScore();},this);

        this.btn_cancel = this.view.getChild("btn_cancel").asButton;
        this.btn_cancel.onClick(_=>{this.inputCtl.selectedPage = "hide";},this);

        this.score = this.view.getChild("score").asTextField;
        this.score_back = this.view.getChild("score_back").asTextField;
        this.task = this.view.getController("task");

        this.gamelogic = GameLogic.getInstance();
        var level = this.gamelogic.garbageData.level;
        var score = this.gamelogic.garbageData.score;
        this.score.text = score.toString();
        this.score_back.text = score.toString();

        this.volume = MusicManager.getInstance().getMusicVolume();
        if(score>=0 && score <=80)
        {
            this.task.selectedPage = "level2";
            MusicManager.getInstance().setAllMusicVolume(0);
            MusicManager.getInstance().playSound("fail");
        }
        else
        {
            this.task.selectedPage = "level3";
            MusicManager.getInstance().playSound("firework");
            MusicManager.getInstance().playSound("vic");
            MusicManager.getInstance().playSound("finish");

            this.scheduleOnce((dt)=>{
               if(this.barrel != null) this.barrel.active = false;
            },10);

            this.loadBarrel();
        }

    }

    private recordScore():void
    {
        this.inputCtl.selectedPage = "hide";

        let userName = this.input.text;
        let score = this.gamelogic.garbageData.score;
        var curUserData = new UserData(Date.parse(new Date().toString()).toString(),userName,score);

        let userDatas:Array<UserData> = JSON.parse(cc.sys.localStorage.getItem('userData'));

        if(userDatas == null)
        {
            userDatas = new Array<UserData>();
        }

        let userExist = false;
        userDatas.forEach((value, index, array)=>{
            if(userName == value.name)
            {
                userDatas[index].score = Math.max(array[index].score,score);
                userExist = true;
            }
        },this);

        if(!userExist) userDatas.push(curUserData);

        var ret = JSON.stringify(userDatas);
        cc.sys.localStorage.setItem("userData",ret);

        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Rank);
        this.exit();
	}

    private barrel:cc.Node = null;
	private loadBarrel():void
	{
		cc.loader.loadRes("barrel", (err, prefab) => {
            if(this.barrel != null)
            {
                this.barrel.active = true;
                return;
            }
            this.barrel = cc.instantiate(prefab);
            cc.director.getScene().addChild(this.barrel);
		});
	}

    private onClickReturn():void
    {
        fgui.GRoot.inst.removeChildren(0, -1, true);
		this.addComponent(Welcome);
		this.exit();
    }

    private onClickReplay():void
    {
        fgui.GRoot.inst.removeChildren(0,-1,true);
        var gameViewCom = this.addComponent(GameView);
		this.gamelogic.gameStart(gameViewCom);
		this.exit();
	}

	private onClickRank():void
    {
        this.input_root.visible = true;
	}

	private exit():void
	{
        if(this.barrel != null) this.barrel.active = false;
        MusicManager.getInstance().setAllMusicVolume(this.volume);
	}

}
