import Util from "./Util";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GarbageFactory extends cc.Component {

    private garbageRes: string[] = [
        "kehuishou_1", "kehuishou_2", "kehuishou_3", "kehuishou_4", "kehuishou_5",
        "ganlaji_1", "ganlaji_2", "ganlaji_3", "ganlaji_4", "ganlaji_5",
        "shilaji_1", "shilaji_2", "shilaji_3", "shilaji_4", "shilaji_5",
        "youhai_1", "youhai_2", "youhai_3", "youhai_4", "youhai_5",
    ];

    public onDragStart: Function = null;
    public onDragEnd: Function = null;

    private carousel: fgui.GComponent;


    prepareRefrence(carousel: fgui.GComponent) {
        console.log("prepareRefrence");
        this.carousel = carousel;
    }

    instantial() {
        console.log("Instantita");
        try {
            var gc: fgui.GLoader = new fgui.GLoader();
            gc.setSize(200, 200);
            var index = Util.getRandomInteger(0, this.garbageRes.length + 1);            
            gc.url = "ui://gc_com/" + this.garbageRes[index];
            gc.draggable = true;

            this.carousel.addChild(gc);
            var posx = Util.getRandomInteger(800, 960);
            var posy = Util.getRandomInteger(677, 960);
            gc.x = posx;
            gc.y = posy;

            gc.on(fgui.Event.DRAG_START, this.onDragStart, this);
            gc.on(fgui.Event.DRAG_END, this.onDragEnd, this);
            console.log("Instantital success");
        }
        catch (e) {
            console.log(e);
        }
    }

}

