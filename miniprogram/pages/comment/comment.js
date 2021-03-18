var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");
Page({
    data: {
    inputanswer:"",
    answer:[]
    },
// 约拍详情信息
    loadlist:function(){
        swan.request({
            url: 'https://baidu.woohoy.com/appointment/'+this.data.id,
            method:"GET",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
                success: e => {
                    console.log(e)
                // console.log(e.data.data[0].photo)
                   var card = e.data.data[0]
                   if(card.photo!==null){
                    card.photo=card.photo.split(",")
                   }
                   for(var i=1;i<e.data.data.length;i++){

                       this.data.answer =this.data.answer.concat(e.data.data[i])
                   }
                   this.setData({
                       card,
                       user:card.user,
                       answer:this.data.answer
                   })
                },
                fail: er => {
                    console.log(er)
                }
        });
    },

// 点赞
    like:function(e){
        this.setData({
            likeid:e.detail
        })
        swan.checkSession({
            success: res => {
                if(this.data.islike==""){
                    this.data.islike="1"
                }else{
                    this.data.islike=""
                }
                this.setData({
                    islike:this.data.islike
                })

                if(this.data.islike=="1"){
                    swan.request({
                        url:"https://baidu.woohoy.com/appointment/like",
                        method:"POST",
                        header: {
                            "Session-Key":session_key,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data:{
                            "id":this.data.likeid
                        },
                        dataType: 'json',
                            success: e => {
                                console.log(e)
                            },
                            fail: er => {
                                console.log(er)
                            }
                    })
                }else{
                    swan.request({
                        url:"https://baidu.woohoy.com/appointment/unlike",
                        method:"POST",
                        header: {
                            "Session-Key":session_key,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data:{
                            "id":this.data.likeid
                        },
                        dataType: 'json',
                            success: e => {
                                console.log(e)
                            },
                            fail: er => {
                                console.log(er)
                            }
                    })
                }

            },
            fail: err => {
                swan.showToast({
                    title:"请先登录",
                    icon:"none"
                })
            }
        });
    },

// 获取回复内容
    inputanswer:function(e){
        // console.log(e.detail.value)
        this.setData({
            inputanswer:e.detail.value
        })
    },



// 点击发送按钮
    answer:function(){

        swan.checkSession({
            success: res => {

                if(this.data.inputanswer==""){
                    swan.showToast({
                        title: '请输入内容'
                    });

                }else{
                    swan.showLoading({
                    title: '发送中'
                });

                swan.request({
                    url:"https://baidu.woohoy.com/appointment",
                    method:"POST",
                    header: {
                        "Session-Key":session_key,
                        'Content-Type': 'application/json'
                    },
                    data:{
                        "content":this.data.inputanswer,
                        "parentId":this.data.id
                    },
                    dataType: 'json',
                        success: e => {
                            console.log(e)

                            swan.request({
                                url: 'https://baidu.woohoy.com/appointment/'+this.data.id,
                                method:"GET",
                                header: {
                                    "Session-Key":session_key,
                                    'Content-Type': 'application/json'
                                },
                                dataType: 'json',
                                    success: e => {
                                        console.log(e)

                                        this.data.answer =this.data.answer.concat(e.data.data[e.data.data.length-1])

                                       this.setData({
                                           answer:this.data.answer,
                                           inputanswer:""
                                       })
                                       swan.hideLoading();
                                       swan.showToast({
                                        title: '发送成功',
                                        icon: 'success'
                                    });
                                    },
                                    fail: er => {
                                        console.log(er)
                                    }
                            });

                        },
                        fail: er => {
                            console.log(er)
                        }
                })
                }
            },
            fail: err => {
                swan.showToast({
                    title:"请先登录",
                    icon:"none"
                })
            }
        });


    },

    // 跳到用户详情页面
    lookuser:function(e){
        console.log(e)
        swan.navigateTo({
            url: '../../pages/user/user?id='+e.detail
        });
    },


    onLoad: function (option) {
        console.log(option)
        this.setData({
            id:option.id,
            islike:option.islike
        })
        this.loadlist()
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
    onShareAppMessage: function (e) {
        // 用户点击右上角转发
        console.log(e)
        let commentlist = e.target.dataset.blog
        return{
            title:commentlist.content,
            path:"/pages/comment/comment?id="+commentlist.id
        }
    }
});