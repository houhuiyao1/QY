Component({
    properties: {

        islike:{
            type:Boolean
        },
        card:{
            type:Array
        }

    },

    data: {}, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        },
        lookuser:function(e){
            this.triggerEvent("lookuser",e.currentTarget.dataset.userid)
        },
        share:function(e){
            // console.log(e)
            this.triggerEvent("share")
        },
        previewimage:function(e){
            swan.previewImage({
                urls: this.data.card.photo,
                current:e.target.dataset.imagesrc
            });
        },
        like:function(e){
            this.triggerEvent("like",e.currentTarget.dataset.id)
        }
    }
});