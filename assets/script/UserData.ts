const {ccclass, property} = cc._decorator;

@ccclass
export default class UserData{
    public id:string;
    public name:string;
    public score:number;

    constructor(id:string,name:string,score:number) {
        this.id = id;
        this.name = name;
        this.score = score;
    }
}