// pages/mall/waitPay/fail.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    list: ["质量问题", "卖家发错货", "货物与描述不符", "不喜欢/效果不好", "多拍/拍错/不想要", '其他'],
    isHidden: 0,
    showModalStatus: false,//显示遮罩,
    order: {},
    address: {},
    resonId:'',
    addressId: 0,
    orderId: 0,
    type: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '支付失败',
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    var id = options.id;
    var that = this;
    var type = options.type;
    that.setData({
      type: type
    })
    api.order_one(id, '', function success(res) {
      console.log(res);
      if (res.errcode == 0) {
        var list = res.result;
        if (list != '') {
          var p = list.orderProducts;
          for (var i = 0; i < p.length; i++) {
            p[i].product.imageIds = p[i].product.imageIds.split(',')[0];
            console.log(p[i].product.imageIds.split(',')[0])
          }
        }
        that.setData({
          order: list,
          addressId: res.result.addressId
        })
        that.getAddress();
      }
    }, function fail(res) {

    });
  },
  /*查询地址信息*/
  getAddress: function () {
    var that = this;
    var id = that.data.addressId;
    app.api_util.addressQueryOne(id, '', function success(res) {
      if (res.errcode == 0) {
        that.setData({
          address: res.result
        })
      }

    }, function fail(res) {

    })
  },
  /*取消订单*/
  cancelItem: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    that.setData({
      orderId: id,
      showModalStatus: true
    })
  },
  /*隐藏弹窗*/
  hideModal: function () {
    var that = this;
    that.setData({
      showModalStatus: false
    })
  },
  //选择原因
  chooseReson: function (options) {
    var that = this;
    var id = options.currentTarget.dataset.idx;
      that.setData({
        resonId: id + 1,
      })
    console.log(that.data.resonId)
  },
  //确认
  modalOk: function () {
    var that = this;
    if (that.data.resonId == '') {
      app.toast.warn("请选择原因", 1500);
      return
    }
    var oid = that.data.orderId;
    var order = that.data.order;
    var createTime = that.data.order.createTime;
    var obj = {
      cancelId: oid,
      createTime: createTime
    }
    api.order_close(oid, '', function success(res) {
      if (res.errcode == 0) {
        app.globalData.member = res.result;
        console.log(res.result)
        console.log(app.globalData.member)
        if (order.type == 3) {
          that.deletesponsor();
        }
        app.toast.success("操作成功", 1500);
        that.setData({
          showModalStatus: false,
        })
        wx.navigateTo({
          url: '../cancelDetail/cancelPage'
        })
        wx.setStorage({
          key: 'obj',
          data: obj,
        })
        console.log(oid)
      } else {
        app.toast.success("操作失败", 1500);
      }
    },
      function fail(res) {

      })
  },

  /*去支付*/
  goPay: function () {
    var that = this;
    var openId = app.globalData.openid;
    var order = that.data.order;
    var type = that.data.type;
    var pay = app.globalData.pay;
    wx.showLoading({
      title: '结算中',
    })
    api.wechat_pay(pay, '商品支付', order.id, openId,type);

  },
  /*商品详情*/
  goDetail: function (e) {
    var shopId = e.currentTarget.id;
    wx.redirectTo({
      url: '../detail/mall_detail?id=' + shopId
    })
  },
  //取消开团订单
  deletesponsor: function () {
    var that = this;
    var id = that.data.order.mid;
    api.deletesponsor(id, '', function success(res) {

    }, function fail(res) {

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