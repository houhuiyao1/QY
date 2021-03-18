var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");


Page({
    data: {
        userID:-1,
        list:[],
        id:0,
        number:1
    },

    like:function(e){
        // console.log(e)
        swan.checkSession({
            success: res => {

        var islikeindex=e.detail.index+""
        if(this.data.list[islikeindex].islike==false){
            this.data.list[islikeindex].islike=true
        }else{
            this.data.list[islikeindex].islike=false
        }

        this.setData({
            id:e.detail.id,
            list:this.data.list
        })

        if(this.data.list[islikeindex].islike==true){

            swan.request({
                url: 'https://baidu.woohoy.com/appointment/like',
                method:"POST",
                header: {
                    "Session-Key":session_key,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:{
                    "id":this.data.id
                },
                dataType: 'json',
                    success: e => {

                        e.data.data.islike=true

                    },
                    fail: er => {
                        console.log(er)
                    }
            });
        }else{

            swan.request({
                url: 'https://baidu.woohoy.com/appointment/unlike',
                method:"POST",
                header: {
                    "Session-Key":session_key,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:{
                    "id":this.data.id
                },
                dataType: 'json',
                    success: e => {

                        e.data.data.islike=false
                    },
                    fail: er => {
                        console.log(er)
                    }
            });
        }

            },
            fail: err => {
                swan.showToast({
                    title: '请先登录',
                    icon:"none"
                });
            }
        });


    },

// 跳到用户详情页面
    lookuser:function(e){
        console.log(e)
        swan.navigateTo({
            url: '../../pages/user/user?id='+e.detail.userid+"&isfollow="+e.detail.guanzhu
        });
    },

// 跳到发布页面
    add:function(){
        swan.checkSession({
            success: res => {

                swan.navigateTo({
                    url: '../../pages/fabu/fabu'
                });
                console.log(res)
            },
            fail: err => {
                swan.showToast({
                    title: '您还未登录',
                    icon:"none"
                });

            }
        });

    },

// 点击查看动态详情信息
    gotalk:function(e){

        if(e.detail.islike==true){
            this.setData({
                id:e.detail.id,
                islike:"1"
            })
        }else{
            this.setData({
                id:e.detail.id,
                islike:""
            })
        }

        swan.navigateTo({
            url: `../../pages/comment/comment?id=${this.data.id}&islike=${this.data.islike}`
        });
    },

// 加载动态列表
loadyuepailist:function(page=1,size=10){
    swan.request({
            url: 'https://baidu.woohoy.com/appointment',
            method:"GET",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            data:{
                page,
                size
            },
            dataType: 'json',
                success: e => {
                    console.log(e)
                    var list = e.data.data.list
                    if(e.data.code==200){
                        swan.showLoading({
                            title: '拼命加载中'
                        });
                    for(let i = 0;i<list.length;i++){
                        if(list[i].createTime != null){
                            list[i].createTime = list[i].createTime.substring(0,10);
                        }
                        if(list[i].photo !== null){
                            list[i].photo = list[i].photo.split(",");
                        }
                        if(list[i].likeUserId !== null){
                            list[i].likeUserId = list[i].likeUserId.split(",");
                        }
                        if(list[i].user.followByUserId!== null){
                            list[i].user.followByUserId= list[i].user.followByUserId.split(",");
                        }                    

                        if(list[i].likeUserId!==null){
                            for(let j=0;j<list[i].likeUserId.length;j++){
                                if(list[i].likeUserId[j] == this.data.userID){
                                    list[i].islike=true;
                                    break
                                }else{
                                    list[i].islike=false
                                }
                            }
                        }else{
                            list[i].islike=false
                        }

                        if(list[i].user.followByUserId!==null){
                            for(let j=0;j<list[i].user.followByUserId.length;j++){
                                console.log(list[i].user.followByUserId[j] == this.data.userID)
                                if(list[i].user.followByUserId[j] == this.data.userID){
                                    list[i].isfollow=1
                                    break
                                }else{
                                    list[i].isfollow=0
                                }
                            }
                        }else{
                            list[i].isfollow=0
                        }
                    }

                    this.setData({
                        list:this.data.list.concat(list)
                    })
                    // console.log(this.data.list)

                    swan.hideLoading();
                    swan.stopPullDownRefresh();
                    }else{
                        swan.showToast({
                            title: '请先登录',
                            icon:"none"
                        });
                    }

                },
                fail: er => {
                    console.log(er)
                }
        });
},

//关注用户
guanzhu:function(e){
    swan.checkSession({
        success: res => {
            swan.request({
                url: 'https://baidu.woohoy.com/user/follow',
                method:"POST",
                header: {
                    "Session-Key":session_key,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:{
                    "followId":e.detail
                },
                dataType: 'json',
                success: res => {

                    if(res.data.code==200){
                        swan.showToast({
                            title: '关注成功',
                            icon:"success"
                        });
                        this.onShow()
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
        fail: err => {
            swan.showToast({
                title: '您还未登录',
                icon:"none"
            });

        }
    });

},


    onLoad: function () {
        // 监听页面加载的生命周期函数

        // this.setData({
        //     userid
        // })

    },



    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        var userID = swan.getStorageSync("userid");
        if(userID!==""){
            this.setData({
                userID,
                list:[]
            })
        }
        this.loadyuepailist(1,10)
    },
    onHide: function() {
        // 监听页面隐藏的生命周期函数
    },
    onUnload: function() {
        // 监听页面卸载的生命周期函数
    },
    onPullDownRefresh: function() {
        // 监听用户下拉动作
        this.setData({
            list:[],
        })
        this.loadyuepailist(1,10)
    },
    onReachBottom: function() {
        // 页面上拉触底事件的处理函数
        this.loadyuepailist(this.data.list.length/10+1,10)
    },
    onShareAppMessage: function (e) {
        console.log(e)
        let yuepailist = e.target.dataset.blog
        return{
            title:yuepailist.content,
            path:"/pages/yuepai/yuepai?id="+yuepailist.id
        }
        // 用户点击右上角转发
    }
});