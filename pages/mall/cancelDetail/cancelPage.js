// pages/mall/cancelDetail/cancelPage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderStatus: '订单已取消',
    cancel: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '取消订单'
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    wx.getStorage({
      key: 'obj',
      success: function (res) {
        that.setData({
          cancel: res.data
        })
      },
    })
  },
  /*返回首页*/
  goHome: function () {
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