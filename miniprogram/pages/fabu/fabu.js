const MAXIMAGE = 9
const MAXTEXTNUM = 150
var openid = swan.getStorageSync("openid");
var session_key = swan.getStorageSync("session_key");
var location = swan.getStorageSync("location")
Page({
    data: {
        check1:true,
        check2:false,
        textcontent:"",
        textnum:0,
        images:[],
        add:true,
        index:0
    },
// 选择图片
    chooseimage:function(){
        var that = this;
        var max = MAXIMAGE - that.data.images.length;
        swan.chooseImage({
            count: max,
            sizeType: ['original','compressed'],
            sourceType: ['album','camera'],
            // 成功则返回图片的本地文件路径列表 tempFilePaths。
            success: res => {

                this.setData({
                    images:this.data.images.concat(res.tempFilePaths)
                })
                var less = MAXIMAGE - that.data.images.length;
                if(less == 0){
                    this.setData({
                        add:false
                    })
                }
            }
        });
    },
// 删除图片
    deleteimage:function(e){
        this.data.images.splice(e.target.dataset.index,1)
        this.setData({
            images:this.data.images
        })

        if(this.data.images.length == 8){
            this.setData({
                add:true
            })
        }
    },
// 输入框内容
    textnumber:function(e){
        var textcontent=e.detail.value+""

        this.setData({
            textnum:e.detail.value.length,
            textcontent
        })
    },
// 点击动态按钮
    binddongtai:function(){
        this.setData({
            check1:true,
            check2:false,
            index:0
        })
    },
// 点击约拍按钮
    bindyuepai:function(){
        this.setData({
            check1:false,
            check2:true,
            index:1
        })
    },
// 点击发布按钮
    fabu:function(){
        if(this.data.textcontent==""){
            swan.showToast({
                title: '请输入内容',
                icon: 'none'
            });

        }else{
            if(this.data.check2){
                this.fabuyuepai()
            }else{
                this.fabudongtai()
            }
        }
    },


// 发布动态
fabudongtai:function(){
    if(this.data.images.length == 0){
        swan.showLoading({
            title: '正在发布'
        });
        swan.request({
            url:"https://baidu.woohoy.com/appointment",
            method:"POST",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            data:{
                "content":this.data.textcontent
            },
            dataType: 'json',
                success: e => {
                    swan.showToast({
                        title: '发布成功'
                    });
                    swan.navigateBack({
                        delta: 1
                    });
                },
                fail: er => {
                    console.log(er)
                }
        })
    }else{
    swan.showLoading({
        title: '正在发布'
    });
    var fabuimg = []

        var item = this.data.images

        var promiseArr = []
        for(let i=0;i<item.length;i++){
            let p = new Promise((resolve,reject)=>{


            swan.uploadFile({
                url: 'https://baidu.woohoy.com/uploadImage',
                method:"POST",
                header: {
                    "Session-Key":session_key,
                    'Content-Type': 'multipart/form-data'
                },
                "filePath":item[i],
                name:"files",
                dataType: 'json',
                success: res => {

                    fabuimg.push(res.data.data[0].url)

                    this.setData({
                        fabuimg
                    })
                    resolve()
                },
                fail: err => {
                    console.log(err)
                    reject()
                }
            })
            })
        promiseArr.push(p)
        }
        Promise.all(promiseArr).then((res)=>{

            var a = this.data.fabuimg

            var imgs = a.toString()

            this.setData({
                imgs
            })
            swan.request({
                url:"https://baidu.woohoy.com/appointment",
                method:"POST",
                header: {
                    "Session-Key":session_key,
                    'Content-Type': 'application/json'
                },
                data:{
                    "content":this.data.textcontent,
                    "photo":imgs
                },
                dataType: 'json',
                    success: e => {
                        swan.showToast({
                            title: '发布成功'
                        });
                        swan.navigateBack({
                            delta: 1
                        });
                    },
                    fail: er => {
                        console.log(er)
                    }
            })
        })
    }
},

// 发布约拍
fabuyuepai:function(){

    if(this.data.images.length == 0){
        swan.showToast({
            title: '请选择图片',
            icon: 'none'
        });}else{

    var fabuimg = []

    var item = this.data.images

    var promiseArr = []
    for(let i=0;i<item.length;i++){
        let p = new Promise((resolve,reject)=>{


        swan.uploadFile({
            url: 'https://baidu.woohoy.com/uploadImage',
            method:"POST",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'multipart/form-data'
            },
            "filePath":item[i],
            name:"files",
            dataType: 'json',
            success: res => {
                console.log(res)
                console.log(res.data.data[0])
                fabuimg.push(res.data.data[0].url)
                console.log(fabuimg)
                this.setData({
                    fabuimg
                })
                resolve()
            },
            fail: err => {
                console.log(err)
                reject()
            }
        })
        })
    promiseArr.push(p)
    }
    Promise.all(promiseArr).then((res)=>{

        var a = this.data.fabuimg

        var imgs = a.toString()

        this.setData({
            imgs
        })
        swan.request({
            url:"https://baidu.woohoy.com/article",
            method:"POST",
            header: {
                "Session-Key":session_key,
                'Content-Type': 'application/json'
            },
            data:{
                "content":this.data.textcontent,
                "photo":imgs
            },
            dataType: 'json',
                success: e => {
                    swan.showToast({
                        title: '发布成功'
                    });
                    swan.navigateBack({
                        delta: 1
                    });
                },
                fail: er => {
                    console.log(er)
                }
        })
    })
        }

},

    onLoad: function () {
        // 监听页面加载的生命周期函数
        this.setData({
            location
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