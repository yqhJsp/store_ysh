// pages/marketing/myCoupon/myCoupon.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                currentNavtab:1,
                pageNo: 1,
                size: 10,
                list: [],
                member: {},
                des: '立即使用',
                hidden: false
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          wx.setNavigationBarTitle({
            title: '我的优惠券',
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
                var that = this;
                that.getData();
        },
        //切换tab刷新数据
        switchTab: function (o) {
                var that = this;
                var idx = o.currentTarget.dataset.idx;
                if (idx != that.data.currentNavtab) {
                        that.setData({
                                currentNavtab: idx,
                                list: [], //数据源清空
                                pageNo: 1,
                        })
                        //刷新数据
                        that.getData();
                }
        },

        /*获取优惠卷信息*/
        getData: function () {
                var that = this;
                var ctype = that.data.currentNavtab;
                var member = app.globalData.member;
                var data = {
                        'memberId': member.id,
                        'status': ctype
                }
            
                api.getusercouponlist(data, "加载中..", function sussess(res) {
                        if (res.errcode == 0) {
                                if (res.result.length == 0 && res.result == '') {

                                } else {
                                        var list = res.result;
                                        for (var i = 0; i < list.length; i++) {
                                                var item = list[i]  //状态
                                                var endTime = (item.coupon.endTime).split(' ');
                                                var startTime = (item.coupon.startTime).split(' ');
                                                item.coupon.end = endTime[0];
                                                item.coupon.start = startTime[0];
                                                if (item.status == 1) {
                                                        item.des = "立即使用";
                                                } else if (item.status == 2) {
                                                        item.des = "已使用";
                                                } else if (item.status == 3) {
                                                        item.des = "已过期";
                                                }
                                        }
                                        that.setData({
                                                list: list
                                        })
                                }
                        }
                },
                        function fail(res) {

                        })
        },
        /*去领卷中心*/
        goCoupon: function () {
                wx.navigateTo({
                        url: "../coupon/coupon",
                })
        },
        /*立即使用*/
        couponuser: function (e) {
                var that = this;
                var status = e.currentTarget.dataset.status;
                if (status == 1) {
                        console.log(status)
                        wx.switchTab({
                                url: '/pages/mall/index/index',
                        })
                }
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