const { ccclass, property } = cc._decorator;
import GameView from "./GameView";
import GarbageData from "./DataClass";
const baseSpeed = 140;
const level1progressMax = 20;
const level2progressMax = 27;
const level3progressMax = 30;
const baseScore = 3;
const maxScore = 100;

@ccclass
export default class GameLogic extends cc.Component {

    private deltaScore = 0;
    private gameView: GameView;
    public garbageData: GarbageData;

    private static instance: GameLogic;
    public static getInstance() {
        if (!GameLogic.instance) {
            GameLogic.instance = new GameLogic();
        }

        return GameLogic.instance;
    }

    public gameStart(gameview: GameView) {
        this.InitGame();
        this.gameView = gameview;
        //TODO complex rule coding
        this.gameView.onDropGarbage = (trashtype, garbageName) => {
            var garbageType = garbageName.split('_')[0];
            if (trashtype == garbageType) {
                this.garbageData.correct = true;
                this.garbageData.score += baseScore;
                this.garbageData.dropedGarbageNum++;
                var dropedNum = this.garbageData.dropedGarbageNum;
                // if(this.deltaScore > 4) this.deltaScore = 0;
                // this.deltaScore += 0;
                if (dropedNum < level1progressMax) {
                    this.garbageData.level = "none";
                    // this.garbageData.carouselSpeed = level1Speed;
                    this.garbageData.curProgress = dropedNum;
                    this.garbageData.curtotalProgress = level1progressMax;
                    //this.garbageData.gcCreateSpeed = gcCreateSpeed_le1;
                }
                if (dropedNum >= level1progressMax && dropedNum < level2progressMax + level1progressMax) {
                    this.garbageData.level = "level1";
                    // this.garbageData.carouselSpeed = level2Speed;
                    this.garbageData.curProgress = dropedNum - level1progressMax;
                    this.garbageData.curtotalProgress = level2progressMax;
                    // this.garbageData.gcCreateSpeed = gcCreateSpeed_le2;
                }
                if (dropedNum >= level2progressMax + level1progressMax && dropedNum < level3progressMax + level2progressMax + level1progressMax) {
                    this.garbageData.level = "level2";
                    // this.garbageData.carouselSpeed = level3Speed;
                    this.garbageData.curProgress = dropedNum - level2progressMax - level1progressMax;
                    this.garbageData.curtotalProgress = level3progressMax;
                    // this.garbageData.gcCreateSpeed = gcCreateSpeed_le3;
                }
                if (dropedNum > level3progressMax + level2progressMax + level1progressMax) {
                    this.garbageData.level = "level3";
                }
            }
            else {
                this.garbageData.correct = false;
                this.deltaScore = 0;
			}

			//this.garbageData.score = this.garbageData.score >= maxScore?maxScore:this.garbageData.score;

            return this.garbageData;
        };
    }

    private InitGame() {
        this.garbageData = new GarbageData();
        this.garbageData.correct = false;
        this.garbageData.dropedGarbageNum = 0;
        this.garbageData.score = 0;
        this.garbageData.level = "none";
        this.garbageData.carouselSpeed = baseSpeed;
    }

}
