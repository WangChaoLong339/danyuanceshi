cc.Class({
    extends: cc.Component,

    properties: {
        players: [cc.Node],
        player: cc.Prefab,
        handCards: [cc.Node],
        card: cc.Prefab,
    },

    onLoad: function () {
        this.model = {}
        //player脚本
        this.model.playerCtrl = []
        //card脚本
        this.model.cardCtrl = []
        //牌库
        this.model.cards = []
        //所有玩家
        this.model.players = []

        //缓存相关的脚本
        this.cacheComponents()
        //创建玩家
        this.createPlayer()
        //创建牌库
        this.createCards()
        //隐藏手牌
        this.hideHandCards()
    },

    cacheComponents: function () {
        //player脚本
        for (var i = 0; i < this.players.length; i++) {
            let prefab = cc.instantiate(this.player)
            prefab.parent = this.players[i]
            this.model.playerCtrl.push(prefab.getComponent("Player"))
            prefab.getComponent("Player").init()
        }
        //card脚本
        for (var i = 0; i < this.handCards.length; i++) {
            let components = []
            for (var j = 0; j < 5; j++) {
                let prefab = cc.instantiate(this.card)
                prefab.parent = this.handCards[i]
                components.push(prefab.getComponent("Card"))
                prefab.getComponent("Card").init()
            }
            this.model.cardCtrl.push(components)
        }
    },

    clone: function (card) {
        return JSON.parse(JSON.stringify(card))
    },

    addExcpt: function (indexs, array) {
        let count = 0
        for (var i = 0; i < array.length; i++) {
            if (indexs.indexOf(i) == -1) {
                count += array[i]
            }
        }
        return count
    },

    createPlayer: function () {
        this.model.players = [
            { head: 0, nickName: "马里奥", score: 100, cow: -1, handCards: [], indexs: [], },
            { head: 1, nickName: "菲比勒多福", score: 67, cow: -1, handCards: [], indexs: [], },
            { head: 2, nickName: "cc", score: 33, cow: -1, handCards: [], indexs: [], },
            { head: 3, nickName: "力。", score: 126, cow: -1, handCards: [], indexs: [], },
        ]

        for (var i = 0; i < this.model.playerCtrl.length; i++) {
            let component = this.model.playerCtrl[i]
            component.fill(this.model.players[i])
        }
    },

    createCards: function () {
        for (var type = 0; type < 4; type++) {
            for (var value = 1; value < 14; value++) {
                this.model.cards.push({ type: type, value: value, v: (value > 10 ? 10 : value) })
            }
        }
    },

    shuffleCards: function () {
        let cards = this.model.cards
        for (var i = 0; i < cards.length; i++) {
            let index = Math.floor(Math.random() * (cards.length))
            if (i != index) {
                let c = this.clone(cards[i])
                cards[i] = this.clone(cards[index])
                cards[index] = c
            }
        }
    },

    dealCard: function () {
        for (var i = 0; i < this.model.players.length; i++) {
            this.model.players[i].handCards = this.model.cards.slice(i * 5, i * 5 + 5)
        }
    },

    showHandCards: function () {
        for (var i = 0; i < this.model.players.length; i++) {
            let player = this.model.players[i]
            for (var j = 0; j < player.handCards.length; j++) {
                this.model.cardCtrl[i][j].fill(player.handCards[j])
            }
        }
        for (var i = 0; i < this.handCards.length; i++) {
            this.handCards[i].active = true
        }
    },

    hideHandCards: function () {
        for (var i = 0; i < this.model.players.length; i++) {
            let player = this.model.players[i]
            player.handCards = []
            player.cow = -1
            player.indexs = []
        }
        for (var i = 0; i < this.handCards.length; i++) {
            for (var j = 0; j < this.handCards[i].children.length; j++) {
                this.handCards[i].children[j].y = 0
            }
            this.handCards[i].active = false
        }
    },

    calculateCow: function () {
        for (var i = 0; i < this.model.players.length; i++) {
            let player = this.model.players[i]
            let handCards = player.handCards
            for (var a = 0; a < handCards.length - 2; a++) {
                for (var b = a + 1; b < handCards.length - 1; b++) {
                    for (var c = b + 1; c < handCards.length; c++) {
                        if ((handCards[a].v + handCards[b].v + handCards[c].v) % 10 == 0) {
                            player.indexs = [a, b, c]
                            player.cow = (this.addExcpt([a, b, c], handCards) % 10)
                            a = b = c = Number.MAX_VALUE
                        }
                    }
                }
            }
        }
    },

    result: function () {
        //抬起提示的牌
        this.upTipsCard()
    },

    upTipsCard: function () {
        for (var i = 0; i < this.model.players.length; i++) {
            let player = this.model.players[i]
            let indexs = player.indexs
            if (indexs.length == 3) {
                for (var j = 0; j < player.handCards.length; j++) {
                    if (indexs.indexOf(j) != -1) {
                        this.handCards[i].children[j].y += 40
                    }
                }
            }
        }
    },

    btnStart: function () {
        //洗牌
        this.shuffleCards()
        //发牌
        this.dealCard()
        //显示手牌
        this.showHandCards()
    },

    btnTips: function () {
        //计算牛牛
        this.calculateCow()
        //结算
        this.result()
    },

    btnEnd: function () {
        //清理手牌 在隐藏
        this.hideHandCards()
    },
});
