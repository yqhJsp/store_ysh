// pages/marketing/deposit/deposit.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                monery: 0,
                member: {},
                tip: ''
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          var that = this;
          wx.setNavigationBarTitle({
            title: '提现金额',
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
                that.setData({
                        member: app.globalData.member
                })

        },
        prefInput: function (e) {
                var that = this;
                var value = e.detail.value;
                if (value.indexOf(".") != -1) {
                        if (value.length <= 2) {
                                return;
                        }
                        var s = value.split(".")[1];
                        console.log(s);
                        if (s.length > 2) {
                                app.toast.error('格式不正确', 1500);
                                return;
                        }
                }
                console.log("ss:" + value)
                if (value != 0) {
                        that.setData({
                                monery: value * 100
                        })
                }
        },

        //提交
        goSave: function () {
                var that = this;
                var monery = that.data.monery;
                var memberId = app.globalData.member.id;
                if (monery == 0) {
                        app.toast.error('请填写提现金额', 1500);
                        return false
                }
                else if (monery / 100 > that.data.member.distributorSumMonery / 100) {
                        app.toast.error('超过可提现金额', 1500);
                        return false
                }
                var data = {
                        'monery': monery,
                        'memberId': memberId,
                        'createUserId': app.globalData.createUserId
                }
                api.insertbrokerageapply(data, "", function success(res) {
                        if (res.errcode == 0) {
                                app.globalData.member=res.result;
                                wx.navigateTo({
                                        url: '/pages/marketing/myCampaign/myCampaign',
                                })
                        }
                }, function fail(res) {
                        app.toast.warn("网络异常", 1000);
                });
        },
        //清除
        clear: function () {
          var that=this;
                that.setData({
                        monery: ''
                });
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