cc.Class({
    extends: cc.Component,

    properties: {
        root: cc.Node,
        item: cc.Node,
    },

    onLoad: function () {
        cc.director.getPhysicsManager().enabled = true
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this, true)
    },

    onTouchStart: function (event) {
        let node = cc.instantiate(this.item)
        let pos2Node = this.root.convertToNodeSpaceAR(event.getLocation())
        node.setPosition(pos2Node.x, pos2Node.y)
        node.parent = this.root
        node.color = this.randColor()
        node.setRotation(this.randRotation())
    },

    randRotation: function () {
        return cc.randomMinus1To1() * 20
    },

    randColor: function () {
        return cc.color(this.randInt(0, 255), this.randInt(0, 255), this.randInt(0, 255))
    },

    randInt: function (min, max) {
        return parseInt(Math.random() * (max - min) + min)
    },
});
