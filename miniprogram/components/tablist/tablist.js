Component({
    properties: {
        propName: { // 属性名
            type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
            value: 'val', // 属性初始值（必填）
            observer: function(newVal, oldVal) {
                // 属性被改变时执行的函数（可选）
            },
            tablist:{
                type:Array,
                value:[]
            },
            dongtai:{
                type:Array,
                value:[]
            },
            guanzhu:{
                type:Array,
                value:[]
            },
            show:{
                type:Boolean,
                value:true
            },
            yuepai:{
                type:Array,
                value:[]
            }
        }
    },

    data: {
        Index:0
    }, // 私有数据，可用于模版渲染

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {},

    detached: function () {},

    methods: {
        onTap: function () {
            this.setData({
                // 更新属性和数据的方法与更新页面数据的方法类似
            });
        },

        unguanzhu:function(e){
            this.triggerEvent("unguanzhu",e.target.dataset.user)
        },

    tablist:function(e){
        this.setData({
            Index:e.target.dataset.index
        })
    },
    changelist:function(e){
        this.setData({
            Index:e.detail.current
        })
    },
    lookuser:function(e){
        this.triggerEvent("lookuser",e.currentTarget.dataset.id)
    },
    previewimage:function(e){
        swan.previewImage({
            urls: this.data.yuepai[e.target.dataset.index].photo,
            current:e.target.dataset.imagesrc
        });
    },
    previewimage2:function(e){
        console.log(e)
        swan.previewImage({
            urls: this.data.dongtai[e.target.dataset.index].photo,
            current:e.target.dataset.imagesrc
        });
    }
    }
});