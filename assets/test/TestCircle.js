cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
        moveRoot: cc.Node,
        centerOfCircle: cc.Node,
        center: {
            default: cc.v2(0, 0),
            tooltip: "圆心坐标",
        },
        radius: {
            default: 0,
            tooltip: "半径",
        },
        speed: {
            default: 0,
            tooltip: "运动速度",
        },
        offset: {
            default: 0,
            tooltip: "增量",
        },
        graphics: cc.Graphics,
        btnSpeed: cc.Node,
        btnRadius: cc.Node,
        tips: cc.Label,
    },

    onLoad: function () {
        this.angle = 0
        //0:speed增加 1:speed减小 2:radius增加 3:radius减小
        this.status = -1
        this.minSpeed = 2
        this.minRadius = 100
    },

    onEnable: function () {
        this.btnSpeed.on(cc.Node.EventType.TOUCH_START, this.onClickAddTouchStart, this)
        this.btnSpeed.on(cc.Node.EventType.TOUCH_END, this.onClickAddTouchEnd, this)
        this.btnRadius.on(cc.Node.EventType.TOUCH_START, this.onClickSubTouchStart, this)
        this.btnRadius.on(cc.Node.EventType.TOUCH_END, this.onClickSubTouchEnd, this)

    },

    onDisable: function () {
        this.btnSpeed.off(cc.Node.EventType.TOUCH_START, this.onClickAddTouchStart, this)
        this.btnSpeed.off(cc.Node.EventType.TOUCH_END, this.onClickAddTouchEnd, this)
        this.btnRadius.off(cc.Node.EventType.TOUCH_START, this.onClickSubTouchStart, this)
        this.btnRadius.off(cc.Node.EventType.TOUCH_END, this.onClickSubTouchEnd, this)
    },

    onClickAddTouchStart: function () {
        this.status = 0
        this.tips.string = "加速"
    },

    onClickAddTouchEnd: function () {
        this.status = 1
        this.tips.string = "减速"
    },

    onClickSubTouchStart: function () {
        this.status = 2
        this.tips.string = "伸长"
    },

    onClickSubTouchEnd: function () {
        this.status = 3
        this.tips.string = "缩短"
    },

    update: function (dt) {
        switch (this.status) {
            case 0:
                this.speed += this.offset / 10
                break
            case 1:
                if (this.speed - this.offset / 10 > this.minSpeed) {
                    this.speed -= this.offset / 10
                } else {
                    this.tips.string = ""
                }
                break
            case 2:
                this.radius += this.offset
                break
            case 3:
                if (this.radius - this.offset > this.minRadius) {
                    this.radius -= this.offset
                } else {
                    this.tips.string = ""
                }
                break
        }
        this.angle += dt * this.speed
        let x = this.radius * Math.cos(this.angle) + this.center.x
        let y = this.radius * Math.sin(this.angle) + this.center.y
        this.moveRoot.setPosition(x, y)

        this.graphics.clear()
        this.graphics.fillColor = cc.color(255, 0, 0, 0)
        this.graphics.moveTo(this.center.x, this.center.y);
        this.graphics.lineTo(this.moveRoot.x, this.moveRoot.y);
        this.graphics.stroke();
    },
});
