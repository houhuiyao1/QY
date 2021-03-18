//app.js
App({
  globalData: {
    code:'',
    openid:'',
    session_key:'',
    avatarUrl:'',
    nickname:''
  },
  onLaunch: function () {
    let that = this;
    swan.login({
        success: function(res){
            //console.log(res.code);
            let code = res.code
            //console.log(this.data.code);
            if (res.code) {
              //发起网络请求
              swan.request({
                url: "https://baidu.woohoy.com/user/authorization",
                method: 'POST',
                dataType: 'json',
                data:{
                    code: code
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res){
                    const openid = res.data.data.openid;
                    const session_key = res.data.data.session_key;
                    that.globalData.openid=openid
                    that.globalData.session_key=session_key
                },
                fail: function(err){
                    console.log('错误码: '+ err.errCode);
                    console.log('错误信息: '+ err.errMsg);
                }
            })
            }
            else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
        }
    })
  }
})
