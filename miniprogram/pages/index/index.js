//index.js
const app = getApp()
var session_key = app.globalData.session_key;

Page({
  data: {
    input:'',
    currentId:0,
    isRelease:false,
    love:[],
    followlove:[],
    list:[],
    followlist:[],
    imageList:[],
    isReleaseShow: false,
    height: 0,
    tabs: [{
        name: '一',
        label: '推荐'
    }, {
        name: '二',
        label: '关注'
    }
],
    banner_list: [{
        "banner": [{
        "pic_url": "../../images/indexTitle.png"
        }, {
        "pic_url": "../../images/shareTitle1.png"
        }]
    }, {
        "banner": []
    }],
    activeNameOne: '一',
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
  },
  scroll: function (e) {
    if (this.data.toView == "top") {
      this.setData({
        toView: ""
      });
    }
  },
  //查看用户详情
  toOthers(e){
    console.log(e.currentTarget.dataset['id']);
    var id = e.currentTarget.dataset['id'];
    //console.log(id);
    swan.navigateTo({
        url: '../user/user?id='+id
    })
  },
  //点赞（推荐页面）
  love(e){
    var session_key = app.globalData.session_key;
    //console.log(e.currentTarget.dataset['index']);
    //console.log(e.currentTarget.dataset['id']);
    const index = e.currentTarget.dataset['index'];
    const id = e.currentTarget.dataset['id'];
    //console.log(this.data.love[index]);
    var lovelist = this.data.love;
    if(this.data.love[index]==true){
        lovelist[index]=false;
    }
    else{
        lovelist[index]=true;
    }
    this.setData({
        love:lovelist
    })
    console.log(session_key);
    var that = this
    swan.request({
        url: "https://baidu.woohoy.com/appointment/like",
        method: 'POST',
        dataType: 'json',
        data:{
            id:id
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
  //点赞（约拍页面）
  love2(e){
    var session_key = app.globalData.session_key;
    //console.log(e.currentTarget.dataset['index']);
    //console.log(e.currentTarget.dataset['id']);
    const index = e.currentTarget.dataset['index'];
    const id = e.currentTarget.dataset['id'];
    //console.log(this.data.love[index]);
    var lovelist = this.data.followlove;
    if(this.data.followlove[index]==true){
        lovelist[index]=false;
    }
    else{
        lovelist[index]=true;
    }
    this.setData({
        followlove:lovelist
    })
    console.log(session_key);
    var that = this
    swan.request({
        url: "https://baidu.woohoy.com/appointment/like",
        method: 'POST',
        dataType: 'json',
        data:{
            id:id
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
  //评论
  comment(e){
      const id = e.currentTarget.dataset['id'];
      console.log(id);
      swan.navigateTo({
        url: '../comment/comment?userId='+id
    })
  },
  //转发
  onShareAppMessage() {
    return {
        title: '小程序标题',
        content: '世界很复杂，百度更懂你',
        imageUrl: 'https://b.bdstatic.com/miniapp/images/baidulogo1.jpg',
        path: 'swan-api/open-share/open-share'
    };
},
openShare(e) {
    const id = e.currentTarget.dataset['id'];
    swan.openShare({
        title: '智能小程序示例',
        content: '世界很复杂，百度更懂你',
        path: 'swan-api/open-share/open-share?key=value',
        imageUrl: 'https://smartprogram.baidu.com/docs/img/logo_new.png',
        success: res => {
            swan.showToast({
                title: '分享成功',
                icon: 'none'
            });
            console.log('openShare success', res);
        },
        fail: err => {
            console.log('openShare fail', err);
        }
    });
},
  transmit(e){
    // var session_key = app.globalData.session_key;
    // console.log(e.currentTarget.dataset['id']);
    // const id = e.currentTarget.dataset['id'];
    // var that = this
    // swan.request({
    //     url: "https://baidu.woohoy.com/appointment/forward",
    //     method: 'POST',
    //     dataType: 'json',
    //     data:{
    //         id:id
    //     },
    //     header: {
    //         "Session-key":session_key,
    //         'content-type': 'application/x-www-form-urlencoded'
    //     },
    //     success: function(res){
    //         console.log(res.data);

    //     },
    //     fail: function(err){
    //         console.log('错误码: '+ err.errCode);
    //         console.log('错误信息: '+ err.errMsg);

    //     }
    // })
  },
  //发布
  toRelease(e){
        swan.navigateTo({
            url:'../fabu/fabu'
        })
  },
  //查看动态详情
  todetail(e){
    const index = e.currentTarget.dataset['index'];
    const id = this.data.list[index].userId;
    // console.log(id);
    // console.log(index);
    swan.navigateTo({
        url: '../detail/detail?params='+index+'&userId='+id
    })
  },
  onLoad: function() {
    if (!swan.cloud) {
      swan.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    //var session_key = app.globalData.session_key;
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
            console.log(res.data);
            var l = res.data.data.list
            for(let i=0;i<l.length;i++){
                that.data.love.push(false);
                if(l[i].photo!=null)
                    l[i].photo = l[i].photo.split(",");
            }
            that.setData({
                list:res.data.data.list
            })
            //console.log(that.data.love);
            //console.log(that.data.list[1].photo);

        },
        fail: function(err){
            console.log('错误码: '+ err.errCode);
            console.log('错误信息: '+ err.errMsg);

        }

    })
    var session_key = swan.getStorageSync("session_key");
    //var session_key = app.globalData.session_key;
    console.log(session_key)
    swan.request({
        url: "https://baidu.woohoy.com/appointment/getfollow",
        method: 'GET',
        dataType: 'json',
        data:{},
        header: {
            "Session-key":session_key,
            'content-type':'application/json'
        },
        success: function(res){
            console.log(res.data)
            var l = res.data.data.list
            for(let i=0;i<l.length;i++){
                that.data.followlove.push(false);
                if(l[i].photo!=null)
                    l[i].photo = l[i].photo.split(",");
            }
            that.setData({
                followlist:res.data.data.list
            })
            //console.log(that.data.list);
            //console.log(that.data.list[1].photo);

        },
        fail: function(err){
            console.log('错误码: '+ err.errCode);
            console.log('错误信息: '+ err.errMsg);

        }
    })
  },


  bindInput(e){
    var value=e.detail.value
    console.log(value)
    this.setData({
        input:value
    })
  },
  tabsOne(e) {
      console.log(this.data.activeNameOne);
    this.setData({
        content: e.detail.name,
        activeNameOne: e.detail.name
    })
}

})
