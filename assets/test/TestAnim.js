cc.Class({
    extends: cc.Component,

    properties: {
        vs: cc.Node,
        fire: cc.Animation,
    },

    onLoad: function () {
        this.vs.active = false
    },

    btn: function () {
        this.vs.active = true
        this.vs.opacity = 255
        this.vs.getComponent(cc.Animation).play('vs')
        this.fire.play('fire')
        var animState = this.vs.getComponent(cc.Animation).getAnimationState('vs')
        if (animState) {
            animState.on('stop', (event) => {
                // 处理停止播放时的逻辑
                this.vs.runAction(cc.sequence(
                    cc.fadeOut(0.5),
                    cc.callFunc(() => {
                        this.vs.active = false
                    }),
                ))
            }, this);
        }
    }
});
