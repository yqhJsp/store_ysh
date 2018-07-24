// pages/user/index/page.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({
        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                member: {},
                orderNum: {},
                kfMobile: '',
                maninfo: {},
                isLoad: true,
                showModalStatus: false,
                integralSum: 0,//总积分
                yinIntelall: 0,//银积分
                myBalanceSum: 0,//总余额
                pwd: '',//登录密码,
                ptype: ''
        },
        getSet: function (e) {
                wx.openSetting({
                        success: (res) => {
                                /*
                                 * res.authSetting = {
                                 *   "scope.userInfo": true,
                                 *   "scope.userLocation": true
                                 * }
                                 */
                        }
                })
        },
        //获取登录密码
        passInput: function (e) {
                var that = this;
                that.setData({
                        pwd: e.detail.value
                })

        },
        //确认登录
        confirm: function () {
                var that = this;
                var password = app.globalData.member.pwd;
                var pwd = that.data.pwd;
                var ptype = that.data.ptype;
                if (pwd == '') {
                        app.toast.warn("请输入登录密码", 1500);
                        return false
                } else if (pwd != password) {
                        app.toast.warn("密码不正确", 1500);
                        return false
                }
                else {
                        app.globalData.loginStatus = 1;
                        that.setData({
                                showModalStatus: false
                        })
                        if (ptype == 1) {
                                wx.navigateTo({
                                        url: '/pages/store/balance/balance',
                                })
                        }
                        else {
                                wx.navigateTo({
                                        url: '/pages/user/gudongList/gudongList',
                                })
                        }
                }
        },
        /*全部订单*/
        getOrder: function (e) {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                var id = e.currentTarget.dataset.idx;
                wx.navigateTo({
                        url: '../mineOrder/orderItems?id=' + id
                })
        },
        /*地址跳转*/
        getAddress: function (e) {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                console.log(e)
                wx.navigateTo({
                        url: '../../mall/address/address',
                })
        },
        /*跳转订单界面*/
        toOrder: function (e) {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                var tab = e.currentTarget.id;
                wx.navigateTo({
                        url: '/pages/user/mineOrder/orderItems?id=' + tab,
                })
        },

        //积分中心
        goInteg: function (e) {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                var logType = e.currentTarget.dataset.type;
                wx.navigateTo({
                        url: '/pages/marketing/integral/integral?logType=' + logType,
                })
        },

        //我的购物车
        goCart: function () {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                wx.navigateTo({
                        url: '/pages/mall/scart/page',
                })
        },
        //我邀请的会员
        goMyMembers: function () {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                wx.navigateTo({
                        url: '/pages/user/memberList/memberList',
                })
        },
        //我邀请的股东会员
        goGudong: function (e) {
                var that = this;
                var ptype = e.currentTarget.dataset.item;
                var loginStatus = app.globalData.loginStatus;
                console.log(loginStatus)
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                } else {
                        if (loginStatus == '') {
                                that.setData({
                                        showModalStatus: true,
                                        ptype: ptype
                                })
                        } else {
                                if (ptype == 1) {
                                        wx.navigateTo({
                                                url: '/pages/store/balance/balance',
                                        })
                                }
                                else {
                                        wx.navigateTo({
                                                url: '/pages/user/gudongList/gudongList',
                                        })
                                }
                        }
                }
        },
        //推广余额
        goBalance: function () {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                wx.navigateTo({
                        url: '/pages/store/balance/balance',
                })
        },
        //设置
        goSetting: function () {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                wx.navigateTo({
                        url: '/pages/user/setting/setting',
                })
        },
        //我购买的服务
        goService: function () {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                wx.navigateTo({
                        url: '/pages/user/myService/myService',
                })
        },
        //我的银行卡
        goCard: function () {
                var that = this;
                if (that.data.member.isRegister == 2) {
                        app.toast.warn("您还不是会员，请前往注册！", 2000);
                        setTimeout(() => {
                                wx.navigateTo({
                                        url: '/pages/user/storeRegister/storeRegister',
                                })
                        }, 500)
                        return false;
                }
                wx.navigateTo({
                        url: '/pages/user/myBank/myBank',
                })
        },
        /*订单状态数目*/
        getOrderStuatNum: function () {
                var that = this;
                var memberId = app.globalData.member.id;
                api.order_getOrderStatusCount({ memberId: memberId }, "", function sussess(res) {
                        console.log(JSON.stringify(res.result));
                        if (res.errcode == 0) {
                                that.setData({
                                        orderNum: res.result,
                                })
                        }
                }, function fail(res) {

                })
        },
        /*隐藏 */
        hideModal: function (data) {
                var that = this;
                that.setData({
                        showModalStatus: false,
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
                var that = this;
                wx.setNavigationBarTitle({
                        title: '个人中心'
                })
                that.setData({
                        isPayPattern: app.globalData.isPayPattern,
                        kfMobile: app.globalData.kfMobile,
                })
                app.common_util.setBarColor(app.globalData.maninfo.tone);
                var member = app.globalData.member;
                var integralSum = member.integralSum - member.integralOut;
                var yinIntelall = member.yinSumMonery - member.yinOutMonery;
                var myBalanceSum = (member.distributorSumMonery - member.distributorOutMonery) / 100;
                that.setData({
                        member: member,
                        maninfo: app.globalData.maninfo,
                        integralSum: integralSum,
                        yinIntelall: yinIntelall,
                        myBalanceSum: myBalanceSum
                });
            
        },

        //授权登录
        goUserInfo: function () {
                app.getUserInfo();
        },
        bindGetUserInfo: function (e) {
                var that = this;
                app.synUserInfo(e.detail.userInfo);
                that.setData({
                        member: app.globalData.member
                })
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                var that = this;
                that.setData({
                  isLoad: false,
                })
        },
        getmember:function(){
         var that=this;
         var id = app.globalData.member.id;
         app.api_util.getmember(id,'',function success(res){
           if (res.errcode == 0) {
               var member=res.result;
               console.log(member)
               app.globalData.member=member;
               var integralSum = member.integralSum - member.integralOut;
               var yinIntelall = member.yinSumMonery - member.yinOutMonery;
               var myBalanceSum = (member.distributorSumMonery - member.distributorOutMonery) / 100;
               that.setData({
                 member: member,
                 integralSum: integralSum,
                 yinIntelall: yinIntelall,
                 myBalanceSum: myBalanceSum
               })
           }
         },function fail(res){

         })
        },
        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {
                var that = this;
                that.getOrderStuatNum();
                that.getmember();
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