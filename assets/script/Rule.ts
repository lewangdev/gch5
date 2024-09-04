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
export default class Rule extends cc.Component {

    private view: fgui.GComponent;
    private trash_list:fgui.GList;
    private btn_return:fgui.GButton;
    private rule_content:fgui.GLoader;

    private btn_game_sound: fgui.GButton;
    private sound_status: fgui.Controller;

    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("UI/gc_com", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this.view = fgui.UIPackage.createObject("gc_com", "rule").asCom;
        this.view.makeFullScreen();
        fgui.GRoot.inst.addChild(this.view);

        this.trash_list = this.view.getChild("trash_list").asList;
        this.trash_list.itemRenderer = this.renderListItem.bind(this);
        this.trash_list.numItems = 4;
        this.trash_list.on(fgui.Event.CLICK_ITEM, this.onClickItem, this);
        this.trash_list.selectedIndex = 0;

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


        this.btn_return = this.view.getChild("btn_return").asButton;
        this.btn_return.onClick(this.onClickReturn,this);

        this.rule_content = this.view.getChild("rule_content").asLoader;
    }

    private onClickItem(item: fgui.GObject): void {
        var index = this.trash_list.getChildIndex(item);
        this.rule_content.url = fgui.UIPackage.getItemURL("gc_com", "garbageInfo" + (index + 1));
    }

    private renderListItem(index:number, obj:fgui.GObject):void
    {
        var item:fgui.GButton = <fgui.GButton>obj;        
        item.icon = fgui.UIPackage.getItemURL("gc_com", "garbage" + (index + 1));
    }

    private onClickReturn():void
    {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Welcome);
    }

}
