module.exports = {
        /**
         * title:标题
         * duration:提示的延迟时间，单位毫秒，默认：1500
         */
        success: function (title, duration){
             wx.showToast({
                     title: title,
                     icon: '',
                     image:'/images/sys/toast/succ.png',
                     duration: duration
             })    
        },
        error: function (title, duration){
                wx.showToast({
                        title: title,
                        icon: '',
                        image: '/images/sys/toast/error.png',
                        duration: duration
                })  
        },
        warn: function (title, duration) {
                wx.showToast({
                        title: title,
                        icon: '',
                        image: '/images/sys/toast/warn.png',
                        duration: duration
                })
        },
        load:function(title){
                wx.showLoading({
                        title: title,
                })
        },
        hide:function(){
                wx.hideLoading();  
        }      
};