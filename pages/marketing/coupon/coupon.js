// pages/marketing/coupon/coupon.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                list: [],
                member: {},
                des: '立即领取',
                staust: 0
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          var that = this;
          wx.setNavigationBarTitle({
            title: '优惠券',
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
                that.setData({
                        member: app.globalData.member
                })
                that.getcouponList();

        },

        //获取优惠卷列表
        getcouponList: function () {
                var that = this;
                var memberId = that.data.member.id;
                api.getcouponlist({ memberId: memberId }, '加载中...', function success(res) {
                        if (res.errcode == 0) {
                                var list = res.result;
                                for (var i = 0; i < list.length; i++) {
                                        var item = list[i];
                                        var endTime = (item.endTime).split(' ');
                                        var startTime = (item.startTime).split(' ');
                                        item.end = endTime[0];
                                        item.start = startTime[0];
                                        item.des = '立即领取';
                                        item.disabled = false;
                                }
                                that.setData({
                                        list: list
                                })
                        }
                }, function fail(res) {
                        app.toast.warn("网络异常", 1000);
                })
        },

        //领取优惠卷
        insertcouponuser: function (e) {
                var that = this;
                var couponId = e.currentTarget.dataset.id;
                var inNumber = e.currentTarget.dataset.inNumber;
                var outNumber = e.currentTarget.dataset.outNumber;
                var memberId = that.data.member.id;
                var data = {
                        'couponId': couponId,
                        'memberId': memberId,
                        'appid': that.data.member.appid
                }
                api.insertcouponuser(data, '', function success(res) {
                        if (res.errcode == 0) {
                                app.toast.success("领取成功", 1500);
                                var list = that.data.list;
                                for (var i = 0; i < list.length; i++) {
                                        var item = list[i];
                                        item.disabled = true;
                                }
                                that.setData({
                                        list: list
                                });
                                setTimeout(function () {
                                        that.getcouponList();
                                }, 1000);

                        } else {
                                app.toast.error("领取失败", 1500);
                        }
                }, function fail(res) {
                        app.toast.warn("网络异常", 1500);
                })

        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

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