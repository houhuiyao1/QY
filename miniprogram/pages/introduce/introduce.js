var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");
const MAXTEXT=20
Page({
    data: {
        textlength:0
    },

    inputintroduce:function(e){
        this.setData({
            text:e.detail.value,
            textlength:e.detail.value.length
        })
    },

    submit:function(){

        // 填写简介

        swan.request({
            url: 'https://baidu.woohoy.com/user/login',
            method:"POST",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            data:{
                "openId":openid,
                "bio":this.data.text
            },
            dataType: 'json',
            success: res => {
                console.log(res)
            },
            fail: err => {
                console.log(err)
            }
        });

        swan.setStorageSync("introduce", this.data.text);
        swan.switchTab({
            url: '../../pages/personal/personal'
        });
    },

    onLoad: function () {
        // 监听页面加载的生命周期函数
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