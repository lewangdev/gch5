const { ccclass, property } = cc._decorator;

@ccclass
export default class GarbageData {
    public correct: boolean;
    public dropedGarbageNum: number;
    public curProgress:number;
    public curtotalProgress:number;
    public score: number;
    public level: string;
    public carouselSpeed: number;
    public gcCreateSpeed:number;
}

