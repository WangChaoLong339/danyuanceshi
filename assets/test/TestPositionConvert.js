cc.Class({
    extends: cc.Component,

    properties: {
        node1: cc.Node,
        node2: cc.Node,
    },

    onLoad: function () {
        console.log(this.node2.children[0].getPosition())
        console.log(this.node2.getPosition())
        let to = this.node2.convertToWorldSpaceAR(this.node2.children[0])
        let to1 = this.node1.convertToNodeSpaceAR(to)
        this.node1.children[0].runAction(cc.moveTo(0.5, to1))
    },
});
