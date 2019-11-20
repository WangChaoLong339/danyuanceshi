cc.Class({
    extends: cc.Component,

    properties: {
        layout: cc.Layout,
        item: cc.Node,
        moving: cc.Node,
        showTrail: {
            default: false,
            tooltip: "是否显示运动轨迹",
        },
    },

    onLoad: function () {
        this.startPos = cc.p(0, 0)
        this.endPos = cc.p(0, 0)
        this.layout.node.active = false
        this.drawCache = []
        this.speed = 400
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this, true)
    },

    onTouchEnd: function (event) {
        this.moving.stopAllActions()
        this.clearDraw()
        this.startPos = this.moving.getPosition()
        this.endPos = cc.p(event.getLocation().x, event.getLocation().y)
        this.move()
        this.draw()
    },

    move: function () {
        //先旋转自身方向
        let posSub = this.startPos.sub(this.endPos)
        let angle = cc.pToAngle(posSub) / Math.PI * 180
        this.moving.rotation = -angle
        //移动
        let distance = cc.pDistance(this.startPos, this.endPos)
        let mTime = distance / this.speed
        let moveAction = cc.moveTo(mTime, this.endPos)
        let cb = cc.callFunc(function () {
            this.clearDraw()
        }, this)

        this.moving.runAction(cc.sequence(moveAction, cb))
    },

    draw: function () {
        if (!this.showTrail) {
            return
        }
        this.layout.node.active = true
        this.layout.node.setPosition(this.startPos)
        let distance = cc.pDistance(this.startPos, this.endPos)
        let count = Math.floor(distance / (this.item.width + this.layout.spacingX))

        for (var i = 0; i < count; i++) {
            let it = this.drawCache.pop()
            if (!it) {
                it = cc.instantiate(this.item)
            }
            this.layout.node.addChild(it)
        }

        let posSub = this.endPos.sub(this.startPos)
        let angle = cc.pToAngle(posSub) / Math.PI * 180
        this.layout.node.rotation = -angle
    },

    clearDraw: function () {
        if (!this.showTrail) {
            return
        }
        this.layout.node.active = false
        for (var i = 0; i < this.layout.node.children.length; i++) {
            let it = this.layout.node.children[i]
            this.drawCache.push(it)
        }
        this.layout.node.removeAllChildren()
    },

});
