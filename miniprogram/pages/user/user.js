var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");

Page({
    data: {
        tablist:["YUEPAI","SHARE","FOLLOW"],
        isguanzhu:"关注",
        show:false
    },
// 查看用户信息
userinformation:function(){
    swan.request({
        url: 'https://baidu.woohoy.com/user/'+this.data.userid,
        method:"GET",
        header: {
            "Session-Key":session_key,
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: res => {

            this.setData({
                userinfo:res.data.data
            })
        },
        fail: err => {
            console.log(err)
        }
    });
},

// 获取某用户发布的约拍信息
lookyuepai:function(){
    swan.request({
        url: 'https://baidu.woohoy.com/article/user/'+this.data.userid,
        method:"GET",
        header: {
            "Session-Key":session_key,
            'Content-Type': 'application/json'
        },
        dataType: 'json',
        success: res => {
            console.log(res.data.data.list)
            var List = res.data.data.list
            var list = []

            for(let i=0;i<List.length;i++){
                 if(List[i].createTime != null){
                    List[i].createTime = List[i].createTime.substring(0,10);
                    if(List[i].photo != null){
                        List[i].photo = List[i].photo.split(",");
                    }
                }
                list.push(List[i])
            }
            this.setData({
                yuepai:list
            })
        },
        fail: err => {
            console.log(err)
        }
    });
},

// 获取动态列表信息
lookdongtai:function(){
    swan.request({
        url: 'https://baidu.woohoy.com/appointment/user/'+this.data.userid,
        method:"GET",
        header: {
            "Session-Key":session_key,
            'Content-Type': 'application/json'
        },
        data:{
            "page":0,
            "size":10
        },
        dataType: 'json',
        success: res => {
            console.log(res)
            let dList=res.data.data.list
            for(let i = 0;i<dList.length;i++){
                 if(dList[i].createTime != null){
                    dList[i].createTime = dList[i].createTime.substring(0,10);
                    if(dList[i].photo != null){
                        dList[i].photo = dList[i].photo.split(",");
                    }
                }
            }
            this.setData({
                dongtai:dList
            })
        },
        fail: err => {
            console.log(err)
        }
    });
},

// 获取关注列表
lookguanzhu:function(){
    swan.request({
        url: 'https://baidu.woohoy.com/user/getfollowUseId',
        method:"GET",
        header: {
            'Content-Type': 'application/json'
        },
        data:{
            "id":this.data.userid,
            "page":0,
            "size":10
        },
        dataType: 'json',
        success: res => {

            let gList = res.data.data.list;
            this.setData({
                guanzhu:gList
            })
        },
        fail: err => {
            console.log(err)
        }
    });
},

//关注用户
guanzhu:function(){
        swan.request({
            url: 'https://baidu.woohoy.com/user/follow',
            method:"POST",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
                "followId":this.data.userid
            },
            dataType: 'json',
            success: res => {
                console.log(res.data.code)
                if(res.data.code==200){
                    swan.showToast({
                        title: '关注成功',
                        icon:"success"
                    });
                    console.log(res)
                    this.setData({
                        isfollow:1
                    })

                }else if(res.data.code==400){
                    swan.showToast({
                        title: '已关注该用户'
                    });

                }

            },
            fail: err => {
                console.log(err)
            }
        });
    },




    onLoad: function (option) {
        // 监听页面加载的生命周期函数
        console.log(option)
        this.setData({
            userid:option.id,
            isfollow:option.isfollow
        })
        this.userinformation()
        this.lookyuepai()
        this.lookdongtai()
        this.lookguanzhu()
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        var userID = swan.getStorageSync("userid");
        if(userID!==""){
            this.setData({
                userID,
            })
        }
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