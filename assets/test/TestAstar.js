cc.Class({
    extends: cc.Component,

    properties: {
        layout: cc.Node,
        item: cc.Node,
        graphics: cc.Graphics,
        diagonal: {
            default: false,
            tooltip: "允许走斜线"
        },
    },

    onLoad: function () {
        window.Astar = this

        this.createMap()
        this.initData()
        this.aStarSearchRoad()
        this.drawLine()
    },

    onClickBtn: function (event) {
        let index = this.layout.children.indexOf(event.currentTarget)
        if (index == 0) {
            this.diagonal = !this.diagonal
        } else if (index < this.layout.children.length - 1) {
            let item = this.layout.children[index]
            item.hinder = !item.hinder
            item.color = item.hinder ? cc.Color.BLACK : cc.Color.WHITE
        }

        this.initData()
        this.aStarSearchRoad()
        this.drawLine()
    },

    createMap: function () {
        for (var i = 0; i < 96; i++) {
            let item = cc.instantiate(this.item)
            //
            item.f = 0//总
            item.g = 0//开始到当前
            item.h = 0//当前到结束
            item.i = i
            item.p = null
            item.hinder = false
            item.color = cc.Color.WHITE
            //随机生成障碍
            if (parseInt(Math.random() * 10) % 6 == 0) {
                item.hinder = true
                item.color = cc.Color.BLACK
            }
            item.children[0].getComponent(cc.Label).string = i
            this.layout.addChild(item)
        }
    },

    initData: function () {
        this.layout.children[0].hinder = false
        this.layout.children[0].color = cc.Color.RED
        this.layout.children[this.layout.children.length - 1].hinder = false
        this.layout.children[this.layout.children.length - 1].color = cc.Color.BLUE
        this.layout.getComponent(cc.Layout).updateLayout()

        this.offset = this.item.width
        this.countX = this.layout.width / this.item.width
        this.end = this.layout.children[this.layout.children.length - 1]
        this.end.p = null
        this.openList = [this.layout.children[0]]
        this.closeList = []
    },

    aStarSearchRoad: function () {
        while (true) {
            let current = this.openList.pop()
            this.closeList.push(current)
            let items = this.getItemsFromCurrent(current)
            for (var i = 0; i < items.length; i++) {
                let item = items[i]
                let index1 = this.getIndexFromList(item, this.closeList)
                //如果是障碍 或者在过滤列表里面 直接跳过检查
                if (item.hinder || index1 !== -1) {
                    continue
                }
                let g = current.g + ((current.x - item.x) / this.offset / 2 * (current.y - item.y) / this.offset / 2 == 0 ? 10 : 14)
                let index = this.getIndexFromList(item, this.openList)
                //不在查找列表
                if (index == -1) {
                    item.h = (Math.abs(this.end.x - item.x) + Math.abs(this.end.y - item.y)) * 10
                    item.g = g
                    item.f = item.g + item.h
                    item.p = current
                    this.openList.push(item)
                } else {
                    if (g < item.g) {
                        item.g = g
                        item.f = item.g + item.h
                        item.p = current
                    }
                }
            }
            if (this.openList.length == 0) {
                break
            }
            this.openList.sort(function (a, b) {
                return b.f - a.f
            })
            if (this.getIndexFromList(this.end, this.openList) != -1) {
                break
            }
        }
    },

    drawLine: function () {
        //得到路线的item.i
        let result = []
        let curr = this.end
        while (curr.p) {
            result.unshift(curr.i)
            curr = curr.p
        }
        result.unshift(0)

        //绘制路线
        this.graphics.clear()
        this.graphics.fillColor = cc.color(255, 0, 0, 0)
        for (var i = 0; i < result.length; i++) {
            let item = this.layout.children[result[i]]
            if (i == 0) {
                this.graphics.moveTo(item.x, item.y)
            } else {
                this.graphics.lineTo(item.x, item.y)
                this.graphics.moveTo(item.x, item.y)
            }
        }
        this.graphics.stroke();
    },

    getItemsFromCurrent: function (current) {
        let ret = []
        let up = current.y + this.offset <= this.layout.height / 2 - this.offset / 2
        let down = current.y - this.offset >= -this.layout.height / 2 + this.offset / 2
        let left = current.x - this.offset >= -this.layout.width / 2 + this.offset / 2
        let right = current.x + this.offset <= this.layout.width / 2 - this.offset / 2
        if (up) {// ↑
            ret.push(this.layout.children[current.i - this.countX])
        }
        if (down) {// ↓
            ret.push(this.layout.children[current.i + this.countX])
        }
        if (left) {// ←
            ret.push(this.layout.children[current.i - 1])
        }
        if (right) {// →
            ret.push(this.layout.children[current.i + 1])
        }
        if (this.diagonal) {
            if (up && left) {// ↖
                ret.push(this.layout.children[current.i - this.countX - 1])
            }
            if (up && right) {// ↗
                ret.push(this.layout.children[current.i - this.countX + 1])
            }
            if (down && left) {// ↙
                ret.push(this.layout.children[current.i + this.countX - 1])
            }
            if (down && right) {// ↘
                ret.push(this.layout.children[current.i + this.countX + 1])
            }
        }
        return ret
    },

    getIndexFromList: function (item, list) {
        for (var i = 0; i < list.length; i++) {
            if (item.i == list[i].i) {
                return i
            }
        }
        return -1
    },
});
