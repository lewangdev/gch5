const {ccclass, property} = cc._decorator;
import Rule from "./Rule";
import Rank from "./Rank";
import GameView from "./GameView";
import GameLogic from "./GameLogic";
import UserData from "./UserData";
import MusicManager from "./MusicManager";
import Introduction from "./Introduction";

@ccclass
export default class Welcome extends cc.Component {
    private view: fgui.GComponent;
    private btn_rule: fgui.GButton;
    private btn_start: fgui.GButton;
    private btn_rank: fgui.GButton;
    private btn_close: fgui.GButton;

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("UI/gc_com", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this.view = fgui.UIPackage.createObject("gc_com", "welcome").asCom;
        this.view.makeFullScreen();
        fgui.GRoot.inst.addChild(this.view);

        this.btn_rule = this.view.getChild("btn_rule").asButton;
        this.btn_rule.onClick(this.onClickRule,this);

        this.btn_start = this.view.getChild("btn_start").asButton;
        this.btn_start.onClick(this.onClickStart,this);

        this.btn_start = this.view.getChild("btn_intro").asButton;
        this.btn_start.onClick(this.onClickIntro,this);

        this.btn_rank = this.view.getChild("btn_rank").asButton;
        this.btn_rank.onClick(this.onClickRank,this);

        this.btn_close = this.view.getChild("btn_close").asButton;
        this.btn_close.onClick(()=>{cc.game.end();},this);

        MusicManager.getInstance().playMusic("bj");
    }

    private onClickRule():void
    {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Rule);
    }

    private onClickStart():void
    {
        fgui.GRoot.inst.removeChildren(0,-1,true);
        var gameViewCom = this.addComponent(GameView);
        GameLogic.getInstance().gameStart(gameViewCom);
    }

    private onClickIntro():void
    {
        fgui.GRoot.inst.removeChildren(0,-1,true);
        var introCom = this.addComponent(Introduction);
    }

    private onClickRank():void
    {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Rank);
    }
}
