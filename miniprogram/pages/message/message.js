const app = getApp()
Page({
    data: {
        list:[],
        list2:[],
        check:[],
        item:{},
        input:'',
        userImage:'',
        userName:'',
        appointment:[],
        tabsThree: [{
            name: '一',
            label: '未读消息',
        }, {
            name: '二',
            label: '已读消息',
        }],
        contentThree: '一',
        activeNameThree: '一',


    },
    tabsThree(e) {
        this.setData({
            contentThree: e.detail.name,
            activeNameThree: e.detail.name
        })
    },
    toOthers(e){
        var id = e.currentTarget.dataset['id'];
        console.log(id);
        swan.navigateTo({
            url: '../user/user?id='+id
        })
    },
    submit(e){
        var session_key = app.globalData.session_key;
        var content = this.data.input;
        var id = e.currentTarget.dataset['id'];
        console.log(content)
        console.log(id);
        var that = this;
        if(content){
        swan.request({
            url: "https://baidu.woohoy.com/notification/"+id,
            method: 'POST',
            dataType: 'json',
            data:{
                comment:content,
            },
            header: {
                "Session-key":session_key,
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res){
                //console.log(res.data);
            },
            fail: function(err){
                console.log('错误码: '+ err.errCode);
                console.log('错误信息: '+ err.errMsg);
            }
        })
    }
    },
    bindInput(e){
        var value=e.detail.value
        console.log(value)
        this.setData({
            input:value
        })
    },
    toComment(e){
        const id = e.currentTarget.dataset['id'];
        console.log(id);
        swan.navigateTo({
            url: '../comment/comment?userId='+id
        })

    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
        var that = this
        var session_key = app.globalData.session_key;
        var openid = swan.getStorageSync("openid");
        swan.request({
            url: "https://baidu.woohoy.com/user/login",
            method: 'POST',
            dataType: 'json',
            data:{
                openId: openid
            },
            header: {
                'content-type':'application/json'
            },
            success: function(res){
                //console.log(res.data);
                that.setData({
                    userImage:res.data.data.avatarUrl,
                    userName:res.data.data.nickname
                })
                //console.log(that.data.userImage);
                //console.log(that.data.userName);
            },
            fail: function(err){
                console.log('错误码: '+ err.errCode);
                console.log('错误信息: '+ err.errMsg);
            }
        })
        console.log(session_key);
        swan.request({
            url: "https://baidu.woohoy.com/notification/unread",
            method: 'GET',
            dataType: 'json',
            data:{},
            header: {
                "Session-Key":session_key,
                'content-type':'application/json'
            },
            success: function(res){
                console.log(res.data);
                that.setData({
                    list:res.data.data.list,
                })
                console.log(that.data.list);
            },

            fail: function(err){
                console.log('错误码: '+ err.errCode);
                console.log('错误信息: '+ err.errMsg);
            }
        })
        swan.request({
            url: "https://baidu.woohoy.com/notification/read",
            method: 'GET',
            dataType: 'json',
            data:{},
            header: {
                "Session-Key":session_key,
                'content-type':'application/json'
            },
            success: function(res){
                //console.log(res.data);
                that.setData({
                    list2:res.data.data.list,
                })
                //console.log(that.data.list);
            },

            fail: function(err){
                console.log('错误码: '+ err.errCode);
                console.log('错误信息: '+ err.errMsg);
            }
        })
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
    },
    onShareAppMessage: function () {
        // 用户点击右上角转发
    }
});