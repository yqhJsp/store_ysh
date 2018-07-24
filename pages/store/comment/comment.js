
const app = getApp();
const api = require('../utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                id: 0,
                type:0,
                member: {},
                content:'',
                maninfo: {}
        },
        comInput:function(e){
                var content = e.detail.value;
                this.setData({
                        content: content  
                });
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                wx.setNavigationBarTitle({
                  title: '填写评论',
                })
                var id = options.id;
                var type = options.type;
                that.setData({
                        id: id,
                        type:type
                }) 
                var member = app.globalData.member;
                var maninfo = app.globalData.maninfo;
                that.setData({
                        member: member,
                        maninfo: maninfo
                })
                app.common_util.setBarColor(maninfo.tone);
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },
        //校验是否报名活动
        insertcomment: function () {
                var that = this;
                var member = that.data.member;
                var id = that.data.id;
                var type=that.data.type;
                var content = that.data.content;
                if(content.length==0){
                   app.toast.warn("评论内容为空", 2500);
                   return false;
                }
                var data = {
                        "appid": member.appid,//分销商id
                        "informationId": id,//咨询id
                        "type":type,//1.用户 2.管理员
                        "memberId": member.id,//用户id
                        "content": content,//内容
                        "createUserId": member.createUserId,//创建人id
                }
               api.insertcomment(data, '加载中..', function success(res) {
                        if (res.errcode == 0) {
                                app.toast.success("评论成功", 2500);
                                setTimeout(function(){
                                        wx.redirectTo({
                                                url: '../discDetail/discDetail?id=' + id,
                                        })
                                },1000);
                        }else{
                                app.toast.error("评论失败", 2500);
                        }
                }, function fail(res) {

                })
        },
        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        }
})