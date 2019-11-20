let Cow = {
    //克隆
    clone: function (obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    //排序
    cardsSort: function (cards) {
        return cards.sort(function (a, b) {
            return a.value - b.value
        })
    },
    //打印
    printCards: function (prefix, cards) {
        let s = prefix || ""
        if (cards instanceof Array) {
            for (var i = 0; i < cards.length; i++) {
                s += this.cardToString(cards[i])
            }
        } else {
            s += this.cardToString(cards)
        }
        return console.log(s)
    },
    //牌转字符串
    cardToString: function (card) {
        let s = ""
        switch (card.type) {
            case 0:
                s += "♠️"
                break
            case 1:
                s += "❤"
                break
            case 2:
                s += "♣️"
                break
            case 3:
                s += "♦️"
                break
            case 4:
                s += "G"
                break
        }
        switch (card.value) {
            case 1:
                s += "A"
                break
            case 11:
                s += "J"
                break
            case 12:
                s += "Q"
                break
            case 13:
                s += "K"
                break
            case 14:
                s += "小"
                break
            case 15:
                s += "大"
                break
            default:
                s += card.value
        }
        return s + " "
    },
    //创建牌库
    createCards: function () {
        let cards = []
        // 0:代表黑桃(b)
        // 1:代表红桃(r)
        // 2:代表梅花(m)
        // 3:代表方片(k)
        // 4:代表鬼牌(g)
        for (var type = 0; type < 4; type++) {
            for (var value = 1; value <= 13; value++) {
                cards.push({ type: type, value: value, v: (value > 10 ? 10 : value) })
            }
        }
        cards.push({ type: 4, value: 14, v: 10 }, { type: 4, value: 15, v: 10 })
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
        return c.slice(0, 5)
    },
    /*
        牛牛牌型逻辑:(无赖子)
        1.任意取出三张牌(遍历所有情况)
        2.分情况:
            a.能组成10的倍数,剩下的两张牌看牛几
            b.不能组成10的倍数,继续第一步
        3.特殊牛特殊处理
        牛牛牌型逻辑:(有赖子)
        1.剔除赖子,剩余牌任取两得到最大的组合(遍历所有情况)
        2.剩余的三张组成10的倍数
        3.特殊牛特殊处理
    */
    calculateCow: function (cards) {
        let laiZiCards = this.getLaiZiCard(cards)
        let result = { cow: -1, group: [], left: [] }
        let count = laiZiCards.length
        if (count == 0) {
            for (var i = 0; i < cards.length - 2; i++) {
                for (var j = i + 1; j < cards.length - 1; j++) {
                    for (var m = j + 1; m < cards.length; m++) {
                        if ((cards[i].v + cards[j].v + cards[m].v) % 10 == 0) {
                            let ret = this.getGroupCards([i, j, m], cards)
                            result.group = ret.group
                            result.left = ret.left
                            result.cow = (result.left[0].v + result.left[1].v) % 10
                            return result
                        }
                    }
                }
            }
        } else if (count == 1) {
            let newCards = this.clone(cards)
            let laiZiCard = laiZiCards.pop()
            this.removeCard(laiZiCard, newCards)
            let maxCow = -1
            for (var i = 0; i < newCards.length - 1; i++) {
                for (var j = i + 1; j < newCards.length; j++) {
                    let num = (newCards[i].v + newCards[j].v) % 10
                    if (num == 0 || maxCow < num) {
                        maxCow = num
                        let ret = this.getLeftCards([i, j], newCards)
                        result.group = ret.group
                        result.group.push(laiZiCard)
                        result.left = ret.left
                        result.cow = num
                        if (num == 0) {
                            return result
                        }
                    }
                }
            }
        } else if (count == 2) {
            //一定是牛牛 默认以排序
            result.group = [cards[0], cards[1], cards[3]]
            result.left = [cards[2], cards[4]]
            result.cow = 0
        }
        return result
    },
    //删除制定下标的牌
    removeCard: function (card, cards) {
        for (var i = 0; i < cards.length; i++) {
            if (this.equalCard(card, cards[i])) {
                cards.splice(i, 1)
            }
        }
    },
    //分牌1
    getGroupCards: function (indexs, cards) {
        let ret = { group: [], left: [] }
        for (var i = 0; i < cards.length; i++) {
            if (indexs.indexOf(i) == -1) {
                ret.left.push(cards[i])
            } else {
                ret.group.push(cards[i])
            }
        }
        return ret
    },
    //分牌2
    getLeftCards: function (indexs, cards) {
        let ret = { group: [], left: [] }
        for (var i = 0; i < cards.length; i++) {
            if (indexs.indexOf(i) == -1) {
                ret.group.push(cards[i])
            } else {
                ret.left.push(cards[i])
            }
        }
        return ret
    },
    //找出癞子
    getLaiZiCard: function (cards) {
        let ret = []
        for (var i = 0; i < cards.length; i++) {
            let card = cards[i]
            if (card.type == 4) {
                ret.push(card)
            }
        }
        return ret
    },
    //比较相同
    equalCard: function (card1, card2) {
        if (!card1 || !card2) {
            return false
        }
        return card1.type == card2.type && card1.value == card2.value
    },
}

/*------------------------------------------分割线----------------------------------------------*/
/*
                                       分割线以上是封装方法

                                       分割线以下是测试用例
*/
/*------------------------------------------分割线----------------------------------------------*/


//创建牌库
let cards = Cow.createCards()
//洗牌
Cow.shuffleCards(cards)
//获取手牌
let handCards = Cow.getHandCards(cards)
// 手牌排序
handCards = Cow.cardsSort(handCards)
// //计算牛牛
let ret = Cow.calculateCow(handCards)