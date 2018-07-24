// pages/mall/paySuccess/success.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                orderId: '',
                products: [],
                fileDomain: app.static_data.file_domain_url,
                pageNo: 1,
                size: 10,
                grouporder:{}
        },
        openOrder: function () {
                var orderId = this.data.orderId;
                wx.navigateTo({
                        url: '/pages/mall/orderDetail/orderDetail?id=' + orderId,
                })
        },
        returnIndex: function () {
                wx.switchTab({
                        url: '/pages/mall/index/index'
                })
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          var that = this;
          wx.setNavigationBarTitle({
            title: '支付成功'
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
                var id = options.id;
                var type = options.type;
                that.setData({
                        orderId: id
                })
                that.getshop();
                if(type==3){
                  that.insertgrouporder();
                }
          
            
        },
        /*商品详情*/
        godetail: function (e) {
                var that = this;
                var id = e.currentTarget.id
                wx.navigateTo({
                        url: '../detail/mall_detail?id=' + id,
                })
        },
  
        getshop: function () {
                var that = this;
                var types = 1;
                var pageNo = that.data.pageNo;
                var shopList = {
                        size: that.data.size,
                        number: pageNo,
                        type: types
                }
                if (pageNo == 1) {
                        that.setData({ list: [] });
                }
                api.getProductList(shopList, "加载中", function sussess(res) {
                        console.log(res)
                        if (res.errcode == 0) {
                                if (res.result.content.length != 0 && res.result.content != '') {
                                  var list = res.result.content;
                                  if (list.length > 0) {
                                    for (var i = 0; i < list.length; i++) {
                                      var l = list[i];
                                      var s = l.imageIds.split(",");
                                      l.imageIds = s[0];
                                    }
                                  }
                                  that.setData({
                                    products: list
                                  })

                                } 

                        }
                }, function fail(res) {

                });
        },
        //参团
        insertgrouporder: function () {
          var that = this;
          wx.getStorage({
            key: 'grouporder',
            success: function (res) {
              var data = res.data.result;
          var memberId = app.globalData.member.id;
          var createUserId = app.globalData.createUserId;
          var appid = app.globalData.appid;
              var sponData = {
                'memberId': memberId,
                'orderId':data.id,
                'groupSponsorId':data.mid,
                'createUserId': createUserId,
                'appid': appid
              }
              api.insertgrouporder(sponData, '', function success(res) {
                if (res.errcode == 0) {

                }

              }, function fail(res) {
                app.toast.warn("网络异常", 1500);
              })
            }
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