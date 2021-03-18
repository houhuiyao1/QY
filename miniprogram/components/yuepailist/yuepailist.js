Component({
    properties: {
        islike:{
            type:Array,
            value:[]
        },

        list:{
            type:String,
            value:""
        },
        userid:{
            type:Number
        }

    },

    data: {
        likeParam: {}
    }, // 私有数据，可用于模版渲染



    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        lookuser:function(e){
            console.log(e)
            this.triggerEvent("lookuser",e.currentTarget.dataset)
        },
        gotalk:function(e){

            this.triggerEvent("gotalk",e.currentTarget.dataset)

        },

        like:function(e){

            this.triggerEvent("like",e.currentTarget.dataset)
        },

        share:function(e){

            this.triggerEvent("share")
        },

        guanzhu:function(e){
            this.triggerEvent("guanzhu",e.currentTarget.dataset.userid)
        },

        previewimage:function(e){

            swan.previewImage({
                urls: this.data.blog.photo,
                current:e.target.dataset.imagesrc
            });
        }
    }
});