cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
        ss: [cc.Node],
    },

    onEnable: function () {
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].on(cc.Node.EventType.TOUCH_MOVE, this.onClickouchMove, this)
        }
    },

    onDisble: function () {
        for (var i = 0; i < this.ss.length; i++) {
            this.ss[i].off(cc.Node.EventType.TOUCH_MOVE, this.onClickouchMove, this)
        }
    },

    onClickouchMove: function (event) {
        var index = this.ss.indexOf(event.currentTarget)
        let pos = event.getLocation()
        let p = this.root.convertToNodeSpace(pos)
        this.ss[index].setPosition(p.x, p.y)
    },
});
