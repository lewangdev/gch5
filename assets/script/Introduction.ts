// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Welcome from "./Welcome";
import MusicManager from "./MusicManager";

@ccclass
export default class Introduction extends cc.Component {

    private view: fgui.GComponent;
    private btn_return:fgui.GButton;

    private btn_game_sound: fgui.GButton;
    private sound_status: fgui.Controller;
    private btn_detail1:fgui.GButton;
    private btn_detail2:fgui.GButton;

    private btn_pre:fgui.GButton;
    private btn_next:fgui.GButton;
    private btn_returngame:fgui.GButton;
    private loader: fgui.GLoader;

    private simpleRoot:fgui.GObject;
    private detailRoot:fgui.GObject;
    private index:number = 1;

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("UI/gc_com", this.onUILoaded.bind(this));
    }

    onUILoaded() {

        this.view = fgui.UIPackage.createObject("gc_com", "introduction").asCom;
        this.view.makeFullScreen();
        fgui.GRoot.inst.addChild(this.view);

        this.simpleRoot = this.view.getChild("simpleRoot");
        this.detailRoot = this.view.getChild("detailRoot");
        this.loader = this.view.getChild("loader").asLoader;
        this.loader.url = this.index.toString();

        this.btn_detail1 = this.view.getChild("btn_detail1").asButton;
        this.btn_detail2 = this.view.getChild("btn_detail2").asButton;
        this.btn_detail1.onClick(()=>{
            this.index = 1;
            this.loader.url = this.index.toString();
            this.simpleRoot.visible = false;
            this.detailRoot.visible = true;
            MusicManager.getInstance().playMusic("bgm2");
        },this);
        this.btn_detail2.onClick(()=>{
            this.index = 1;
            this.loader.url = this.index.toString();
            this.simpleRoot.visible = false;
            this.detailRoot.visible = true;
            MusicManager.getInstance().playMusic("bgm2");
        },this);

        this.btn_returngame = this.view.getChild("btn_returngame").asButton;
        this.btn_returngame.onClick(()=>{
            this.simpleRoot.visible = true;
            this.detailRoot.visible = false;
            MusicManager.getInstance().playMusic("bj");
        },this);





        this.btn_pre = this.view.getChild("btn_pre").asButton;
        this.btn_next = this.view.getChild("btn_next").asButton;
        this.btn_pre.onClick(()=>{
            this.index--;
            if(this.index < 0)
            {
                this.index = 21;
            }
            this.loader.url = this.index.toString();
        },this);
        this.btn_next.onClick(()=>{
            this.index++;
            if(this.index > 21)
            {
                this.index = 0;
            }
            this.loader.url = this.index.toString();
        },this);




        this.btn_return = this.view.getChild("btn_return").asButton;
        this.btn_return.onClick(this.onClickReturn,this);

        this.btn_game_sound = this.view.getChild("btn_game_sound").asButton;
        this.sound_status = this.view.getChild("btn_game_sound").asCom.getController("status");
        var volume = MusicManager.getInstance().getMusicVolume();
        this.sound_status.selectedPage = volume == 0?"pause":"play";
        this.btn_game_sound.onClick(()=>{
            var page = this.sound_status.selectedPage;
            page = page == "play" ? "pause" : "play";
            var volume = MusicManager.getInstance().getMusicVolume();
            if(volume == 0)
            {
                MusicManager.getInstance().setAllMusicVolume(1);
                MusicManager.getInstance().setAllSoundVolume(1);
            }
            else
            {
                MusicManager.getInstance().setAllMusicVolume(0);
                MusicManager.getInstance().setAllSoundVolume(0);
            }
            this.sound_status.selectedPage = page;
        },this);


    }

    private onClickReturn():void
    {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Welcome);
    }

}
