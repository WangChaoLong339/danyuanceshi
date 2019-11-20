let setSprite = function (url, sprite) {
    sprite.spriteFrame = new cc.SpriteFrame(url)
}
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        let node = this.node.getChildByName("Sprite")
        if (node) {
            let sprite = node.getComponent("cc.Sprite")
            if (sprite) {
                let url = cc.url._rawAssets + "image/timg.png"
                setSprite(url, sprite)
            }

        }
    },
});
