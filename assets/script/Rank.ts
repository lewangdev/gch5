const { ccclass, property } = cc._decorator;
import Welcome from "./Welcome";
import GameView from "./GameView";
import GameLogic from "./GameLogic";
import UserData from "./UserData";
const itemNum = 8;

@ccclass
export default class Rank extends cc.Component {
    private view: fgui.GComponent;
    private btn_challenge: fgui.GButton;
    private btn_return: fgui.GButton;
    private rank_list: fgui.GList;
    private userDatas: Array<UserData>;


    onLoad() {
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage("UI/gc_com", this.onUILoaded.bind(this));
    }

    onUILoaded() {
        this.view = fgui.UIPackage.createObject("gc_com", "rank").asCom;
        this.view.makeFullScreen();
        fgui.GRoot.inst.addChild(this.view);

        this.btn_challenge = this.view.getChild("btn_challenge").asButton;
        this.btn_challenge.onClick(this.onClickChallenge, this);

        this.btn_return = this.view.getChild("btn_return").asButton;
        this.btn_return.onClick(this.onClickReturn, this);

		this.userDatas = JSON.parse(cc.sys.localStorage.getItem("userData"));
		if(this.userDatas !=null)
		{
			this.userDatas.sort((a, b) => {
				if (a.score > b.score) return -1;
				else if (a.score < b.score) return 1;
				else return 0;
			});
			cc.log(this.userDatas.length);
			this.rank_list = this.view.getChild("rank_list").asList;
			this.rank_list.itemRenderer = this.renderRank.bind(this);
			this.rank_list.numItems = this.userDatas.length;
		}
    }

    private colors: cc.Color[] =
        [
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1),
            new cc.Color(255, 143, 5, 1)
        ];
    private renderRank(index: number, item: fgui.GObject): void {
        var com = item.asCom;
        var name = com.getChild("name").asTextField;
        var rank = com.getChild("rank").asTextField;
		var score = com.getChild("score").asTextField;
		var rankIndex = index + 1;
		rank.text = rankIndex.toString();

		name.text = this.userDatas[index].name;
		score.text = this.userDatas[index].score.toString();

        if(index<3)
        {
            com.getChild((index+1).toString()).alpha = 1;
            rank.text = "";
        }
    }

    private onClickChallenge(): void {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        var gameViewCom = this.addComponent(GameView);
        GameLogic.getInstance().gameStart(gameViewCom);
    }

    private onClickReturn(): void {
        fgui.GRoot.inst.removeChildren(0, -1, true);
        this.addComponent(Welcome);
    }

}
