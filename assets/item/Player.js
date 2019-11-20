cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function () {
        this.head = this.node.getChildByName("Head").getComponent(cc.Sprite)
        this.nickName = this.node.getChildByName("NickName").getComponent(cc.Label)
        this.score = this.node.getChildByName("Score").getComponent(cc.Label)
        this.path = cc.url._rawAssets + "/image/head/"
    },

    fill: function (player) {
        this.head.spriteFrame = new cc.SpriteFrame(`${this.path}${player.head}.png`)
        this.nickName.string = player.nickName
        this.score.string = player.score.toString()
    },
});
