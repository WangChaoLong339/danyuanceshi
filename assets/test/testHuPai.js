
let Hu = {
    //克隆
    clone: function (obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    //排序
    cardsSort: function (cards) {
        return cards.sort(function (a, b) {
            return (a.type * 9 + a.value - 1) - (b.type * 9 + b.value - 1)
        })
    },
    //打印
    printCards: function (prefix, cards) {
        let s = prefix || ""
        if (cards instanceof Array) {
            for (var i = 0; i < cards.length; i++) {
                s += cards[i].value.toString() + (cards[i].type == 0 ? "万" : cards[i].type == 1 ? "筒" : "条") + " "
            }
        } else {
            s += cards.value.toString() + (cards.type == 0 ? "万" : cards.type == 1 ? "筒" : "条") + " "
        }
        return console.log(s)
    },
    //创建牌库
    createCards: function () {
        let cards = []
        let index = 0
        for (var type = 0; type < 3; type++) {
            for (var value = 1; value < 10; value++) {
                for (var j = 0; j < 4; j++) {
                    cards.push({ type: type, value: value, index: index })
                }
                index++
            }
        }
        return cards
    },
    //洗牌
    shuffleCards: function (cards) {
        for (var i = 0; i < cards.length; i++) {
            let index = Math.floor(Math.random() * (cards.length))
            if (i != index) {
                let c = this.clone(cards[i])
                cards[i] = this.clone(cards[index])
                cards[index] = c
            }
        }
        return cards
    },
    //获取手牌
    getHandCards: function (cards) {
        let c = this.clone(cards)
        return c.slice(0, 14)
    },
    /*
        胡牌逻辑:
        1.先摸一张牌(或者其他玩家出一张牌),把这张牌放到手牌里面,再排序
        2.从手牌中剔除任意一个对子(这里需要遍历每一种对子的情况,剩下的牌需要拆成顺子或者刻子)
            (第一张手牌的数量)
            a.如果是1张(2张):必须和后面的牌构成顺子(构不成不能胡牌)
            b.如果是3张:
                I:尝试和后面的牌构成个顺子(构不成再II)
                II:直接拆分成刻子(继续找下面的牌)
            c.如果是4张:剔除1张和后面的牌构成顺子(构不成不能胡牌),然后再b
        3.如果最后的手牌能全部拆完,则能胡牌
    */
    checkHu: function (moCard, handCards) {
        handCards.push(moCard)
        this.cardsSort(handCards)
        for (var i = 0; i < handCards.length - 1; i++) {
            let card1 = handCards[i]
            let card2 = handCards[i + 1]
            if (this.equalCard(card1, card2)) {
                let newCards = this.clone(handCards)
                this.spliceByIndex(newCards, i, 2)
                let ret = this.spliceCards(newCards, 0)
                if (ret) {
                    return true
                }
            }
        }
        return false
    },
    //拆分顺子或者刻子
    spliceCards: function (cards) {
        if (cards.length == 0) {
            return true
        }
        //不同牌的数量
        let diffCardsCount = this.dffCardsCount(cards)
        //当前第一张牌
        let currCard = cards[0]
        //当前第一张牌在不同牌的下标
        let i = currCard.type * 9 + currCard.value - 1
        //当前第一张牌在手牌的下标
        let index1 = 0
        //当前第一张牌的数量
        let count = diffCardsCount[i]
        //顺子的第二张牌
        let secondCard = this.indexToCard(i + 1)
        //顺子的第二张牌的下标
        let index2 = this.contain(secondCard, cards)
        //顺子的第三张牌
        let thridCard = this.indexToCard(i + 2)
        //顺子的第三张牌的下标
        let index3 = this.contain(thridCard, cards)

        if (count == 1 || count == 2) {
            //必须跟后面的拆出顺子
            if (index2 != -1 && index3 != -1 && this.isShunZi(currCard, secondCard, thridCard)) {
                this.spliceIndexs([index1, index2, index3], cards)
                return this.spliceCards(cards)
            } else {
                return false
            }
        } else if (count == 3) {
            //分情况讨论(1:直接拆成刻子 2:可全拆出顺子)
            this.spliceIndexs([index1, index1 + 1, index1 + 2], cards)
            let ret = this.spliceCards(cards)
            if (ret) {
                return true
            } else {
                cards.unshift(currCard, currCard, currCard)
                if (index2 != -1 && index3 != -1 && this.isShunZi(currCard, secondCard, thridCard)) {
                    this.spliceIndexs([index1, index2, index3], cards)
                    return this.spliceCards(cards)
                } else {
                    return false
                }
            }
        } else if (count == 4) {
            //取一张出来,必须跟后面的拆出顺子
            if (index2 != -1 && index3 != -1 && this.isShunZi(currCard, secondCard, thridCard)) {
                this.spliceIndexs([index1, index2, index3], cards)
                return this.spliceCards(cards)
            } else {
                return false
            }
        }
    },
    //是否是顺子
    isShunZi: function (card1, card2, card3) {
        if (!card1 || !card2 || !card3) {
            return false
        }
        return this.nextCard(card1, card2) && this.nextCard(card2, card3)
    },
    //拆顺子
    spliceIndexs: function (indexs, cards) {
        for (var i = indexs.length - 1; i >= 0; i--) {
            this.spliceByIndex(cards, indexs[i], 1)
        }
    },
    //剔除牌1
    spliceByIndex: function (cards, index, count) {
        let temp = cards.slice(index, index + count)
        cards.splice(index, count)
        return temp
    },
    //剔除牌2
    spliceByCard: function (card, cards) {
        let temp = null
        for (var i = 0; i < cards.length; i++) {
            if (equalCard(card, cards[i])) {
                temp = spliceByIndex(cards, i, 1)
                break
            }
        }
        return temp
    },
    //获取所有不同的牌
    getDiffCards: function () {
        let ret = []
        for (var type = 0; type < 3; type++) {
            for (var value = 1; value < 10; value++) {
                ret.push({ type: type, value: value, index: type * 9 + value - 1 })
            }
        }
        return ret
    },
    //包含
    contain: function (card, cards) {
        for (var i = 0; i < cards.length; i++) {
            if (this.equalCard(card, cards[i])) {
                return i
            }
        }
        return -1
    },
    //比较相同
    equalCard: function (card1, card2) {
        if (!card1 || !card2) {
            return false
        }
        return card1.type == card2.type && card1.value == card2.value
    },
    //比较连续
    nextCard: function (card1, card2) {
        if (!card1 || !card2) {
            return false
        }
        let ret = card1.type == card2.type && Math.abs(card1.value - card2.value) == 1
        return ret
    },
    //牌转下标
    cardToIndex: function (card) {
        if (!card) {
            return -1
        }
        return card.type * 9 + card.value - 1
    },
    //下标转牌
    indexToCard: function (index) {
        let diffCards = this.getDiffCards()
        return diffCards[index]
    },
    //不同牌的张数
    dffCardsCount: function (cards) {
        let diffCards = this.getDiffCards()
        let cardsCount = []
        for (var i = 0; i < diffCards.length; i++) {
            cardsCount[i] = 0
        }
        for (var i = 0; i < cards.length; i++) {
            let card = cards[i]
            cardsCount[this.cardToIndex(card)]++
        }
        return cardsCount
    },
}


/*------------------------------------------分割线----------------------------------------------*/
/*
                                       分割线以上是封装方法
                                       
                                       分割线以下是测试用例
*/
/*------------------------------------------分割线----------------------------------------------*/


// // 创建牌库
// let cards = Hu.createCards()
// // 洗牌
// cards = Hu.shuffleCards(cards)
// // 得到手牌
// let handCards = Hu.getHandCards(cards)
// // 手牌排序
// handCards = Hu.cardsSort(handCards)
let handCards = [
    { type: 0, value: 1, index: 0 },
    { type: 0, value: 1, index: 0 },
    { type: 0, value: 1, index: 0 },
    { type: 0, value: 2, index: 1 },
    { type: 0, value: 3, index: 2 },
    { type: 0, value: 4, index: 3 },
    { type: 0, value: 5, index: 4 },
    { type: 0, value: 6, index: 5 },
    { type: 0, value: 7, index: 6 },
    { type: 0, value: 8, index: 7 },
    { type: 0, value: 9, index: 8 },
    { type: 0, value: 9, index: 8 },
    { type: 0, value: 9, index: 8 },
]
let huCards = []
let diffCards = Hu.getDiffCards()
for (var i = 0; i < diffCards.length; i++) {
    let newCards = Hu.clone(handCards)
    let moCard = diffCards[i]
    if (Hu.checkHu(moCard, newCards)) {
        huCards.push(moCard)
    }
}