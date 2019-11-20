cc.Class({
    extends: cc.Component,

    properties: {
        layout: cc.Node,
        item: cc.Node,
    },

    onLoad: function () {
        // 设置 地图宽高
        this.mapWidth = this.mapHeight = 10
        // 创建 随机颜色
        this.colors = [cc.Color.RED, cc.Color.GREEN, cc.Color.BLUE, cc.Color.GRAY, cc.Color.CYAN, cc.Color.YELLOW]
        // 创建 随检色块
        this.createItem()
        // 清空
        this.clear()
    },

    createItem: function () {
        for (var i = 0; i < this.mapWidth * this.mapHeight; i++) {
            let item = new cc.instantiate(this.item)
            let idx = parseInt(Math.random() * 10) % this.colors.length
            item.i = i
            item.colorIdx = idx
            item.color = this.colors[idx]
            item.width = parseInt(((this.layout.width - 2) - (this.mapWidth - 1) * 2) / this.mapWidth)
            item.height = parseInt(((this.layout.height - 2) - (this.mapHeight - 1) * 2) / this.mapHeight)
            this.layout.addChild(item)
        }
    },

    clear: function () {
        // 初始化 第一个色块的颜色下标
        this.firstColIdx = this.layout.children[0].colorIdx
        // 初始化 天选色块
        this.theSelection = null
        // 初始化 过滤列表
        this.filterList = []
        // 初始化 待检测色块下标
        this.checkIdxList = []
        // 更新 待检测色块下标
        this.updateCheckIdx()
    },

    updateCheckIdx: function () {
        this.tryPushAround(0)
    },

    tryPushAround: function (i) {
        // 已经在待检测列表 || 已经在过滤列表 || 是天选色块
        if (this.checkIdxList.indexOf(i) != -1 || this.filterList.indexOf(i) != -1 || (this.theSelection && this.theSelection.i == i)) {
            return
        }
        // 直接加入过滤列表
        this.filterList.push(i)
        // 上边有色块
        if (i - this.mapWidth >= 0) {
            // 上边颜色和第1个色块同色 继续找
            if (this.layout.children[i - this.mapWidth].colorIdx == this.firstColIdx) {
                this.tryPushAround(i - this.mapWidth)
            } else {
                if (this.checkIdxList.indexOf(i - this.mapWidth) == -1) {
                    this.checkIdxList.push(i - this.mapWidth)
                }
            }
        }
        // 左边有色块
        if (i % this.mapWidth != 0) {
            // 左边颜色和第1个色块同色 继续找
            if (this.layout.children[i - 1].colorIdx == this.firstColIdx) {
                this.tryPushAround(i - 1)
            } else {
                if (this.checkIdxList.indexOf(i - 1) == -1) {
                    this.checkIdxList.push(i - 1)
                }
            }
        }
        // 下边有色块
        if (i + this.mapWidth < this.layout.children.length) {
            // 下边颜色和第1个色块同色 继续找
            if (this.layout.children[i + this.mapWidth].colorIdx == this.firstColIdx) {
                this.tryPushAround(i + this.mapWidth)
            } else {
                if (this.checkIdxList.indexOf(i + this.mapWidth) == -1) {
                    this.checkIdxList.push(i + this.mapWidth)
                }
            }
        }
        // 右边有色块
        if (i % this.mapWidth != this.mapWidth - 1) {
            // 右边颜色和第1个色块同色 继续找
            if (this.layout.children[i + 1].colorIdx == this.firstColIdx) {
                this.tryPushAround(i + 1)
            } else {
                if (this.checkIdxList.indexOf(i + 1) == -1) {
                    this.checkIdxList.push(i + 1)
                }
            }
        }
        return
    },

    wantToColor: function () {
        // 排序
        this.checkIdxList.sort(function (a, b) { return a - b })

        // 需要拿到每次修改最多的颜色
        let colorIdx2Info = {}
        for (var i = 0; i < this.checkIdxList.length; i++) {
            if (!colorIdx2Info[this.layout.children[this.checkIdxList[i]].colorIdx]) {
                colorIdx2Info[this.layout.children[this.checkIdxList[i]].colorIdx] = [this.checkIdxList[i], 0]
            }
            colorIdx2Info[this.layout.children[this.checkIdxList[i]].colorIdx][1] += 1
        }
        let theSelectionI = -1
        let count = -1
        for (var i in colorIdx2Info) {
            if (colorIdx2Info[i][1] > count) {
                theSelectionI = colorIdx2Info[i][0]
                count = colorIdx2Info[i][1]
            }
        }
        // 设置 天选色块
        this.theSelection = this.layout.children[theSelectionI]
        // 天选色块下标放进过滤列表
        this.filterList.push(this.theSelection.i)
    },

    changeColor: function () {
        for (var i = 0; i < this.filterList.length; i++) {
            this.layout.children[this.filterList[i]].color = this.theSelection.color
            this.layout.children[this.filterList[i]].colorIdx = this.theSelection.colorIdx
        }
    },

    btnItem: function (event) {
        // 如果没有待检测的色块 那么游戏结束
        if (this.checkIdxList.length == 0) {
            return
        }
        // 需要变成的颜色
        this.wantToColor()
        // 改变颜色
        this.changeColor()
        // 清空
        this.clear()
    },

    btnButton: function () {
        /*
            0  1  2  3  4
            5  6  7  8  9
            10 11 12 13 14
            15 16 17 18 19
            20 21 22 23 24
         */
        let boot = 0
        for (var i = 0; i < this.mapWidth * this.mapWidth; i++) {
            if (i >= this.mapWidth) {
                i += this.mapWidth - 1
            }
            let list = []
            let count = i < this.mapWidth ? i : parseInt((this.mapWidth * this.mapWidth - i) / this.mapWidth)
            let value = i
            while (count >= 0) {
                list.push(value)
                value += this.mapWidth - 1
                count--
            }
            boot++
            for (var j = 0; j < list.length; j++) {
                this.layout.children[list[j]].runAction(cc.sequence(
                    cc.delayTime(boot * 0.05),
                    cc.scaleTo(0.1, 1.1, 1.1),
                    cc.scaleTo(0.1, 0.9, 0.9),
                    cc.scaleTo(0.1, 1, 1),
                ))
            }
        }
    },
});