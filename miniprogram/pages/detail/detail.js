const app = getApp()
Page({
    /* eslint-enable babel/new-cap */
        data: {
            list:[],
            index:0,
            userId:0,
            slider: [{
                imageUrl: 'https://b.bdstatic.com/searchbox/icms/searchbox/img/swiperA.png'
            }, {
                imageUrl: 'https://b.bdstatic.com/searchbox/icms/searchbox/img/swiperB.png'
            }, {
                imageUrl: 'https://b.bdstatic.com/searchbox/icms/searchbox/img/swiperC.png'
            }],
            swiperCurrent: 0,
        },
        onLoad: function (options) {
                    // 监听页面加载的生命周期函数
                var that = this
                swan.request({
                    url: "https://baidu.woohoy.com/appointment",
                    method: 'GET',
                    dataType: 'json',
                    data:{},
                    header: {
                        'content-type':'application/json'
                    },
                    success: function(res){
                        var l = res.data.data.list
                        for(let i=0;i<l.length;i++){
                            if(l[i].photo!=null)
                            l[i].photo = l[i].photo.split(",");
                        }
                        that.setData({
                            list:res.data.data.list
                        })
                        //console.log(that.data.list[1].photo);
                    },
                    fail: function(err){
                        console.log('错误码: '+ err.errCode);
                        console.log('错误信息: '+ err.errMsg);
                    }
                })
                    console.log(options.params);
                    console.log(options.userId);
                    this.setData({
                        index: options.params,
                        userId: options.userId

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
                },
        swiperChange(e) {
            console.log('swiperChange:', e.detail);
            this.setData({
                itemId: e.detail.current
            });
        },
        follow(e){
            var that = this
            var session_key = app.globalData.session_key;
            var id = that.data.userId;
            //console.log(that.data.userId);
            swan.request({
            url: "https://baidu.woohoy.com/user/follow",
            method: 'POST',
            dataType: 'json',
            data:{
                followId:id
            },
            header: {
                "Session-key":session_key,
                'content-type': 'application/x-www-form-urlencoded'

            },
            success: function(res){
                console.log(res.data);
            },
            fail: function(err){
                console.log('错误码: '+ err.errCode);
                console.log('错误信息: '+ err.errMsg);
            }
    })

        },
        /**
         * swiper 切换时的下标赋值，用于和圆点位置对应
         *
         * @param {Event} e 事件详情
         */
        swiperChangeCustom(e) {
            this.setData({
                swiperCurrent: e.detail.current
            });
        },
        animationfinish(e) {
            console.log(e.type);
        },
    });

// Page({
//     data: {
//         list:[],
//         current: 0,
//         itemId: 0,
//         switchIndicateStatus: true,
//         switchAutoPlayStatus: false,
//         switchVerticalStatus: false,
//         switchDuration: 500,
//         autoPlayInterval: 2000,
//         followText: ['关注', '取消关注'],
//         isFollowed: true,
//         index:0,
//         src: '../../images/photo1.png',
//         text: '终于见到干净的海！',
//         user: {
//             pic: '../../images/shareTitle2.png',
//             name: 'Sali',
//             position: '南京市.鼓楼区'
//             },
//             notlove: true
//     },
//     swiperChange(e) {
//         console.log('swiperChange:', e.detail);
//         this.setData({
//             itemId: e.detail.current
//         });
//     },
//     switchIndicate() {
//         this.setData({
//             switchIndicateStatus: !this.getData('switchIndicateStatus')
//         });
//     },
//     switchVertical() {
//         this.setData({
//             switchVerticalStatus: !this.getData('switchVerticalStatus')
//         });
//     },
//     switchAutoPlay() {
//         this.setData({
//             switchAutoPlayStatus: !this.getData('switchAutoPlayStatus')
//         });
//     },
//     changeSwitchDuration(e) {
//         this.setData({
//             switchDuration: e.detail.value
//         });
//     },
//     changeAutoPlayInterval(e) {
//         this.setData({
//             autoPlayInterval: e.detail.value
//         });
//     },
//     animationfinish(e) {
//         console.log(e.type);
//     },
//     onLoad: function (options) {
//         // 监听页面加载的生命周期函数
//         var that = this
//     swan.request({
//         url: "https://baidu.woohoy.com/article",
//         method: 'GET',
//         dataType: 'json',
//         data:{},
//         header: {
//             'content-type':'application/json'
//         },
//         success: function(res){
//             console.log(res.data);
//             that.setData({
//                 list:res.data.data.list
//             })
//             console.log(that.data.list);

//         },
//         fail: function(err){
//             console.log('错误码: '+ err.errCode);
//             console.log('错误信息: '+ err.errMsg);
//         }
//     })
//         console.log(options.params);
//         this.setData({
//             index: options.params
//         })
//     },
//     onReady: function() {
//         // 监听页面初次渲染完成的生命周期函数
//     },
//     onShow: function() {
//         // 监听页面显示的生命周期函数
//     },
//     onHide: function() {
//         // 监听页面隐藏的生命周期函数
//     },
//     onUnload: function() {
//         // 监听页面卸载的生命周期函数
//     },
//     onPullDownRefresh: function() {
//         // 监听用户下拉动作
//     },
//     onReachBottom: function() {
//         // 页面上拉触底事件的处理函数
//     },
//     onShareAppMessage: function () {
//         // 用户点击右上角转发
//     }
// });