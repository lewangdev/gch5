
const {ccclass, property} = cc._decorator;

@ccclass
export default class Util{
   
    static getRandomInteger(min: number, max: number): number {
        if (min == max) {
            return min;
        }
        if (min > max) {
            return this.getRandomInteger(max, min);
        }
        let range = max - min;
        let rand = Math.random();
        return (min + Math.floor(rand * range));
    }
}
