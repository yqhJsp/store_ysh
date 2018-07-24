// pages/consulting/consulting.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    name: '',
    phone: '',
    consult: '',
    inType: 0,
    productId: 0,
    appid: '',
    maninfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '立即预约'
    })
    var inType = options.inType;
    var productId = options.id;
    that.setData({
      inType: inType,
      productId: productId,
      shopInfo: app.globalData.maninfo
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);

    that.setData({
      appid: app.globalData.maninfo.appid
    })

  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  consultInput: function (e) {
    this.setData({
      consult: e.detail.value
    })
  },
  save: function () {
    var that = this;
    var openid = app.globalData.member.openId;
    var name = that.data.name
    var phone = that.data.phone;
    var content = that.data.consult;
    if (name == '') {
      app.toast.error('请填写姓名', 1500);
      return false
    }
    if (phone.length!=11) {
      app.toast.error('请填写正常电话', 1500);
      return false
    }
    var data = {
      name: name,
      mobile: phone,
      desc: content,
      productId: Number(that.data.productId),
      inType: Number(that.data.inType),
      createUserId: app.globalData.createUserId,
      appid: that.data.appid,
      memberId: app.globalData.member.id
    }
    api.insertsubscribe(data, '提交中', function success(res) {
      if (res.errcode == 0) {
        app.toast.success('提交成功', 1500);
        setTimeout(function(){
                wx.redirectTo({
                        url: '/pages/user/mineOrder/orderItems',
                })
        },500);
      }else{
              app.toast.error('提交失败', 1500);   
      }
    }, function fail(res) {
      app.toast.error('提交失败', 1500);
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
    app.refresh();
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