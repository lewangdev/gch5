cc.Class({
	extends: cc.Component,

	properties: {
		// 声明一个预制体
		firework: cc.Prefab,
	},

	start() {
		// 烟花对象池
		this.fireworkPool = new cc.NodePool();
		// 预先放20个烟花进去
		var initCount = 20;
		for (var i = 0; i < initCount; i++) {
			var firework = cc.instantiate(this.firework);
			this.fireworkPool.put(firework);
		}
	},

	onEnable() {
		this.schedule(this.createfirework, 0.4);
	},

	onDisable()
	{
		this.unschedule(this.createfirework);
	},

	// 制造烟花
	createfirework() {
		// 防止对象池为空
		if (this.fireworkPool.size() > 0) {
			var firework = this.fireworkPool.get();
		}
		else {
			var firework = cc.instantiate(this.firework);
		}
		// 设置父节点
		firework.parent = fgui.GRoot.inst.node;//this.node;
		firework.setSiblingIndex(firework.childrenCount - 1);
		// 随机位置（960 * 640）
		firework.x = 1920 * Math.random();
		firework.y = -900 * Math.random();
		// resetSystem()函数重置发射器，开始发射粒子;
		firework.getComponent(cc.ParticleSystem).resetSystem();

		function callback() {// 回收之前stopSystem();
			firework.getComponent(cc.ParticleSystem).stopSystem();
			this.fireworkPool.put(firework);
		};

		// 2秒后自动回收
		this.scheduleOnce(callback, 2);
	},
});
