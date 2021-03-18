var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");
var userid = swan.getStorageSync("userid");
Page({
    data: {
        userid:-1
    },

// 获取搜索内容
    inputcontents:function(e){
        this.setData({
            searchcontents:e.detail.value
        })
    },
// 搜索
    search:function(page=1,size=100){
        swan.request({
            url: 'https://baidu.woohoy.com/search',
            method:"GET",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            data:{
                "type":"article",
                "contents":this.data.searchcontents,
                page,
                size
            },
            dataType: 'json',
            success: res => {
                var list=res.data.data.list
                for(let i = 0;i<list.length;i++){
                    if(list[i].photo !== null){
                        list[i].photo = list[i].photo.split(",");
                    }
                    if(list[i].likeUserId !== null){
                        list[i].likeUserId = list[i].likeUserId.split(",");
                    }                    
                    // console.log(list[i])
                    if(list[i].likeUserId!==null){

                        for(let j=0;j<list[i].likeUserId.length;j++){

                            if(list[i].likeUserId[j] == this.data.userid){
                                list[i].islike=true
                            }else{
                                list[i].islike=false
                            }
                        }
                    }else{
                        list[i].islike=false
                    }
                }

                this.setData({
                    list:res.data.data.list
                })
            },
            fail: err => {
                console.log(err)
            }
        });
    },

// 跳到用户详情页面
lookuser:function(e){

    swan.navigateTo({
        url: '../../pages/user/user?id='+e.detail
    });
},

// 点击查看约拍详情信息
gotalk:function(e){


    console.log(e)
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

// 点赞
like:function(e){
    // console.log(e)
    swan.checkSession({
        success: res => {
            console.log(e.detail.index)
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
        console.log(this.data.list[islikeindex].islike)
        swan.request({
            url: 'https://baidu.woohoy.com/article/like',
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
                    console.log(e)
                    e.data.data.islike=true

                },
                fail: er => {
                    console.log(er)
                }
        });
    }else{
        console.log(this.data.list[islikeindex].islike)
        swan.request({
            url: 'https://baidu.woohoy.com/article/unlike',
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
                    console.log(e)
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


    searchinput:function(){
       this.search(1,10)
    },
    onLoad: function () {
        // 监听页面加载的生命周期函数
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        // 监听页面显示的生命周期函数
        var userid = swan.getStorageSync("userid");
        if(userid!==""){
            this.setData({
                userid
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
    onShareAppMessage: function (e) {
        // 用户点击右上角转发
        console.log(e)
        let yuepailist = e.target.dataset.blog
        return{
            title:yuepailist.content,
            path:"/pages/yuepai/yuepai?id="+yuepailist.id
        }
    }
});