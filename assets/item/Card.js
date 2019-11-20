cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function () {
        this.value1 = this.node.getChildByName("Value1").getComponent(cc.Label)
        this.value2 = this.node.getChildByName("Value2").getComponent(cc.Label)
        this.type = this.node.getChildByName("Type").getComponent(cc.Label)
    },

    fill: function (card) {
        this.value1.string = this.cardValueToString(card.value)
        this.value2.string = this.cardValueToString(card.value)
        this.type.string = this.cardTypeToString(card.type)
        //设置颜色
        this.setColor(card)
    },

    cardValueToString: function (value) {
        switch (value) {
            case 1:
                return "A"
            case 11:
                return "J"
            case 12:
                return "Q"
            case 13:
                return "K"
            case 14:
                return "小"
            case 15:
                return "大"
            default:
                return value
        }
    },

    cardTypeToString: function (type) {
        switch (type) {
            case 0:
                return "黑桃"
            case 1:
                return "红桃"
            case 2:
                return "梅花"
            case 3:
                return "方片"
        }
    },

    setColor: function (card) {
        //0:黑    1:红  2:梅  3:方
        if (card.type % 2) {
            this.value1.node.color = cc.Color.RED
            this.value2.node.color = cc.Color.RED
            this.type.node.color = cc.Color.RED
        } else {
            this.value1.node.color = cc.Color.BLACK
            this.value2.node.color = cc.Color.BLACK
            this.type.node.color = cc.Color.BLACK
        }
    },
});
