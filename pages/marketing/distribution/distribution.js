// pages/marketing/distribution/distribution.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                name: '',
                mobile: '',
                content: '',
                hidden: false,
                showstuts: 1
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                wx.setNavigationBarTitle({
                  title: '提交审核',
                })
                app.common_util.setBarColor(app.globalData.maninfo.tone);
        },
        //返回首页
        goHome: function () {
                wx.redirectTo({
                        url: '/pages/user/storeUser/storeUser',
                })
        },

        //获取姓名
        nameInput: function (e) {
                var that = this;
                var value = e.detail.value;
                if (value != 0) {
                        that.setData({
                                name: value
                        })
                }
        },
        //手机号码
        phoneInput: function (e) {
                var that = this;
                var value = e.detail.value;
                if (value != 0) {
                        that.setData({
                                mobile: value
                        })
                }
        },
        //获取描述
        consultInput: function (e) {
                var that = this;
                var value = e.detail.value;
                if (value != 0) {
                        that.setData({
                                content: value
                        })
                }
        },
        //提交审核
        save: function () {
                var that = this;
                var name = that.data.name;
                var mobile = that.data.mobile;
                var content = that.data.content;
                var memberId = app.globalData.member.id;
                var showstuts = that.data.showstuts;
                if (name == '') {
                        app.toast.error('请填写姓名', 1500);
                        return false
                }
                if (mobile.length!=11) {
                        app.toast.error('格式不正确', 1500);
                        return false
                }
                var data = {
                        'name': name,
                        'mobile': mobile,
                        'content': content,
                        'memberId': memberId,
                        'createUserId': app.globalData.createUserId
                }
                if (showstuts==1){
                  that.setData({
                    showstuts: 2
                  })
                  api.insertdistributoraudit(data, "", function success(res) {
                        if (res.errcode == 0) {
                          app.toast.success('提交成功', 1500);
                                that.setData({
                                        hidden: true,                           
                                })
                        } else {
                          app.toast.error('提交失败', 1500);
                        }
                }, function fail(res) {
                        app.toast.warn("网络异常", 1000);
                });
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