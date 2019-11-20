let ERR_CODE = {
    EC_NONE: 0,
    EC_ACC_NOT_EXIST: 1,
    EC_PWD_ERR: 2,
    EC_USER_ONLINE: 3,
}

cc.Class({
    extends: cc.Component,

    properties: {
        accEditBox: cc.EditBox,
        pwdEditBox: cc.EditBox,
    },

    // onLoad 中建立连接
    onLoad() {
        this.socket = window.io('http://localhost:3000');

        this.socket.on('connect', () => {
        });

        this.socket.on('login', (data) => {
            // 判断是否成功
            if (data.msg === ERR_CODE.EC_NONE) {
                this.userID = data.userID;
                console.log('登陆成功');
            } else if (data.msg === ERR_CODE.EC_PWD_ERR) {
                console.log('密码错误');
            } else if (data.msg === ERR_CODE.EC_USER_ONLINE) {
                console.log('用户已经登陆');
            } else if (data.msg === ERR_CODE.EC_ACC_NOT_EXIST) {
                console.log('账户不存在');
            }
        });
    },

    // 按钮点击事件
    onClickLogin: function () {

        let id = this.accEditBox.string
        let pwd = this.pwdEditBox.string

        // 检测是否为空
        if (id == '') return;
        if (pwd == '') return;

        // 先检测连接是否还在
        if (this.socket.connected) {
            // 发送 userID 进行校验
            this.socket.emit('testlogin', { userId: id, pwd: pwd });
        }
    },
});