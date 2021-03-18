var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");
Page({
    data: {
        tablist:["SNAP","SHARE","FOLLOW"],
        introduce:"一句话介绍一下自己吧",
        location:"点击获取地理位置",
        show:true,
        yuepai:[],
        dongtai:[],
        guanzhu:[]
    },


    bindgetuserinfo:function(e){

        console.log(e);
        const userInfo = e.detail.userInfo;
        swan.setStorageSync("userinfo", userInfo);

        const userinfo = swan.getStorageSync("userinfo");

        this.setData({
            userinfo
        })

        if(this.data.userinfo!==undefined){
            this.getcode()
        }

    },

// 获取约拍列表信息
    getyuepai:function(page=1,size=100){
        try {
            swan.request({
                url: 'https://baidu.woohoy.com/article/user/'+this.data.userid,
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
                success: res => {
                    console.log(res)
                    let List=res.data.data.list
                    for(let i = 0;i<List.length;i++){
                         if(List[i].createTime != null){
                            List[i].createTime = List[i].createTime.substring(0,10);
                            if(List[i].photo != null){
                                List[i].photo = List[i].photo.split(",");
                            }
                        }
                    }
                    this.setData({
                        yuepai:List
                    })
                },
                fail: err => {
                    console.log(err)
                }
            });
        } catch (error) {
            console.log(error)
        }

    },

// 获取动态列表信息
    getdongtai:function(page=1,size=100){
        try {
            swan.request({
                url: 'https://baidu.woohoy.com/appointment/user/'+this.data.userid,
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
        } catch (error) {
            console.log(error)
        }

    },

// 获取关注列表
    getguanzhu:function(){
        try {
            var session_key = swan.getStorageSync("session_key");
        swan.request({
            url: 'https://baidu.woohoy.com/user/getfollow',
            method:"GET",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            data:{
                "page":0,
                "size":100
            },
            dataType: 'json',
            success: res => {
                console.log(res)
                console.log(session_key)
                let gList = res.data.data.list;
                console.log(res.data.data.list)
                this.setData({
                    guanzhu:gList
                })
            },
            fail: err => {
                console.log(err)
            }
        });
        } catch (error) {
            console.log(error)
        }

    },

//登录
    getcode:function(e){
        swan.login({
            success: res => {

                var Code = res.code;
                swan.setStorageSync("code",Code);
                var code = swan.getStorageSync("code");

                swan.request({
                    url: 'https://baidu.woohoy.com/user/authorization',
                    method:"POST",
                    header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data:{
                        "code":code
                    },
                    dataType: 'json',
                    success: res => {

                        swan.setStorageSync("openid", res.data.data.openid);
                        swan.setStorageSync("session_key", res.data.data.session_key);
                        var openid = swan.getStorageSync("openid");
                        var session_key = swan.getStorageSync("session_key");
                        swan.request({
                            url: 'https://baidu.woohoy.com/user/login',
                            method:"POST",
                            header: {
                                "Session-Key":session_key,
                                'Content-Type': 'application/json'
                            },
                            data:{
                                "openId":openid,
                                "nickname":this.data.userinfo.nickName,
                                "avatarUrl":this.data.userinfo.avatarUrl,
                                "gender":this.data.userinfo.gender,
                            },
                            dataType: 'json',
                            success: e => {


                                swan.setStorageSync("userid",e.data.data.id)
                                    this.setData({
                                        location:e.data.data.location,
                                        introduce:e.data.data.bio,
                                        userid:e.data.data.id,
                                        UserInfo:e.data.data
                                    })
                                    // console.log(this.data.userinfo)
                                    //获取页面信息
                                    if(this.data.UserInfo!==undefined){
                                        this.getyuepai()
                                        this.getdongtai()
                                        this.getguanzhu()
                                    }

                            },
                            fail: er => {
                                console.log(er)
                            }
                        });



                    },
                    fail: res => {
                        console.log(res)
                    }
                });
            }
        });


    },


    // 获取地理位置
    getschool:function(){
        swan.authorize({
            scope: 'scope.userLocation',
            success: res => {

            },
            fail: err => {

                swan.openSetting({});
            }
        });
        swan.chooseLocation({
            success: res => {

                swan.setStorageSync("school",res.name)
                swan.setStorageSync("address",res.address.substring(0,2))

                var school = swan.getStorageSync("school")
                var address = swan.getStorageSync("address")

                this.setData({
                    school,
                    address,
                    location:address+"·"+school
                })

                swan.request({
                    url: 'https://baidu.woohoy.com/user/login',
                    method:"POST",
                    header: {
                        "Session-Key":session_key,
                        'Content-Type': 'application/json'
                    },
                    data:{
                        "openId":openid,
                        "location":this.data.location
                    },
                    dataType: 'json',
                    success: res => {

                    },
                    fail: err => {
                        console.log(err)
                    }
                });
            }
        });
    },

// 取消关注
    unguanzhu:function(e){

        this.setData({
            deleltuser:e.detail
        })
        swan.request({
            url: 'https://baidu.woohoy.com/user/unfollow',
            method:"POST",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
                "followId":this.data.deleltuser
            },
            dataType: 'json',
            success: res => {
                this.getguanzhu()
                swan.showToast({
                    title: '已取消'
                });
            },
            fail: err => {
                console.log(err)
            }
        });
    },

// 点击查看关注用户详情
    lookuser:function(e){

        swan.navigateTo({
            url: `/pages/user/user?id=${e.detail}`
        });
    },

//判断是否已经登录
    checkSession() {
        swan.checkSession({
            success: res => {
                console.log(res)
                swan.request({
                    url: 'https://baidu.woohoy.com/user/login',
                    method:"POST",
                    header: {
                        "Session-Key":session_key,
                        'Content-Type': 'application/json'
                    },
                    data:{
                        "openId":openid
                    },
                    dataType: 'json',
                    success: e => {

                        swan.setStorageSync("location",e.data.data.location)
                        swan.setStorageSync("userid",e.data.data.id)
                            this.setData({
                                location:e.data.data.location,
                                introduce:e.data.data.bio,
                                userid:e.data.data.id,
                                UserInfo:e.data.data
                            })
                            // console.log(this.data.userinfo)
                            //获取页面信息

                            if(this.data.UserInfo!==undefined){
                                this.getyuepai()
                                this.getdongtai()
                                this.getguanzhu()
                            }

                    },
                    fail: er => {
                        console.log(er)
                    }
                });

            },
            fail: err => {

            }
        });
    },

    onLoad: function () {
        this.checkSession()
    },
    onReady: function() {
        // 监听页面初次渲染完成的生命周期函数
    },
    onShow: function() {
        if(session_key&this.data.userid){
            this.getyuepai()
            this.getdongtai()
            this.getguanzhu()
        }else{
            console.log("未登录")
        }


        var Introduce=swan.getStorageSync("introduce")
        var school = swan.getStorageSync("school")
        var address = swan.getStorageSync("address")
        if(school==""){

        }else{
        this.setData({
            location:address+"·"+school
        })
    }

        if(Introduce==""){

        }else{
            this.setData({
                introduce:Introduce
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


