// pages/mall/orderDetail/orderDetail.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                orders: {},
                orderStatus: '',
                orderProducts:[],
                address:{},
                addressId:''
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          app.common_util.setBarColor(app.globalData.maninfo.tone);
                var that = this;
                wx.setNavigationBarTitle({
                        title: '订单详情'
                })
                var id = options.id;
                /*获取订单信息*/
                api.order_one(id, '加载中', function success(res) {
                        if (res.errcode == 0) {
                                that.setData({
                                        orders: res.result,
                                        addressId: res.result.addressId,
                                        orderProducts: res.result.orderProducts
                                })
                                that.getAddress();
                                var orderList = that.data.orders;
                                if (orderList.safeguardStatus == 0) {
                                        if (orderList.status == 1) {
                                                that.setData({
                                                        orderStatus: "待付款"
                                                })
                                        } else if (orderList.status == 2) {
                                                that.setData({
                                                        orderStatus: "待发货"
                                                })
                                        } else if (orderList.status == 6) {
                                                that.setData({
                                                        orderStatus: "待收货"
                                                })
                                        } else if (orderList.status == 3) {
                                                that.setData({
                                                        orderStatus: "已完成"
                                                })
                                        }
                                } else if (orderList.safeguardStatus == 1) {
                                        that.setData({
                                                orderStatus: "退款进行中"
                                        })
                                } else {
                                        that.setData({
                                                orderStatus: "已退款"
                                        })
                                }
                        }

                },
                        function fail(fail) {

                        }
                )
        },
       /*查询地址信息*/
       getAddress:function(){
        var that=this;
        var id = that.data.addressId;
        app.api_util.addressQueryOne(id, '', function success(res){
                if (res.errcode == 0) {
                  that.setData({
                          address: res.result     
                  })
                }     

        },function fail(res){

        })
       },
       /*跳转订单详情页*/
       goDetail: function (options) {
               var that = this;
               var id = options.currentTarget.dataset.id;
               wx.navigateTo({
                       url: '/pages/mall/detail/mall_detail?id=' + id,
               })
       },

       /*返回店铺*/
       goHome:function(){
               wx.switchTab({
                       url: '/pages/mall/index/index'
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