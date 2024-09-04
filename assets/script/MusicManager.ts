
const { ccclass, property } = cc._decorator;
@ccclass
export default class MusicManager{

    private static instance: MusicManager;
    public static getInstance() {
        if (!MusicManager.instance) {
            MusicManager.instance = new MusicManager();
            MusicManager.instance.registerMusicManage();
        }

        return MusicManager.instance;
    }

    private musicManagerNode:cc.Node;

    private musicBox:cc.Node; //音乐容器

    private soundBox:cc.Node; //音效容器

    private musicNum:number; //音乐大小

    private soundNum:number; //音效大小

    /******************
     * 注册音乐管理器
     * ************** */
    public registerMusicManage() {

        this.musicManagerNode = cc.find("MusicManager");
        this.musicBox = this.musicManagerNode.getChildByName('musicBox');
        this.soundBox = this.musicManagerNode.getChildByName('soundBox');

        this.musicNum = 1;
        this.soundNum = 1;

        // this.setAllMusicVolume(1);
        // this.setAllSoundVolume(1);
    }

    /******************
     * 设置全局音乐音量
     * @param num：音量大小  取值(0~1)
     * ************** */
    public setAllMusicVolume(num:number) {
        this.musicNum = num;

        let list = this.musicBox.getComponents(cc.AudioSource); //获取音乐盒中所有音乐对象
        for(let i = 0; i < list.length; i++){
            list[i].volume = num;
        }
    }


    public getMusicVolume() {
        return this.musicNum;
    }

    public getSoundVolume() {
        return this.soundNum;
    }

    /******************
     * 设置全局音效音量
     * @param num：音量大小  取值(0~1)
     * ************** */
    public setAllSoundVolume(num:number) {
        this.soundNum = num;

        let list = this.soundBox.getComponents(cc.AudioSource); //获取音效盒中所有音乐对象
        for(let i = 0; i < list.length; i++){
            list[i].volume = num;
        }
    }

    /******************
     * 根据音乐名称获取音频对象
     * @param str：音乐名
     * ************** */
    public getMusicAudioSource(str:string) {
        let list = this.musicBox.getComponents(cc.AudioSource); //获取音乐盒中所有音乐对象
        for(let i = 0; i < list.length; i++){
            if(str == list[i].clip + ''){
                return list[i];
            }
        }
    }

    /******************
     * 播放音乐
     * @param resUrl：资源列表
     * ************** */
    public playMusic(resUrl:string) {
        cc.loader.loadRes(resUrl,cc.AudioClip,(error,resource)=>{
            let clip:cc.AudioClip = resource;

            let audioSource = this.musicBox.getComponent(cc.AudioSource);
            audioSource.clip = clip;

            audioSource.volume = this.musicNum; //设置音量

            audioSource.loop = true; //循环播放

            if(!audioSource.isPlaying)audioSource.play(); //播放
        });
    }

    /******************
     * 播放音效
     * @param resList：资源列表
     * ************** */
    public playSound(resUrl:string) {
        cc.loader.loadRes(resUrl,cc.AudioClip,(error,resource)=>{
            let clip:cc.AudioClip = resource;

            let audioSource = this.soundBox.addComponent(cc.AudioSource);
            audioSource.clip = clip;

            audioSource.volume = this.soundNum; //设置音量

            audioSource.scheduleOnce(() => {
                let length: any = audioSource.getDuration(); //音频时长
                setTimeout(() => { //启动一个音频时长的定时器控制音效播放结束
                    audioSource.destroy();
                }, length * 1000);
            })

            audioSource.play(); //播放
        });
    }
}