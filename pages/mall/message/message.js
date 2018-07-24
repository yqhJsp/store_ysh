// pages/mall/message/message.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    stuats: 0,
    msg: '点击展开'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    var that = this;
    wx.setNavigationBarTitle({
      title: '消息列表'
    })

    api.getMessage("加载中", function success(res) {
      if (res.errcode == 0) {
        that.setData({
          list: res.result
        })
        var list = that.data.list;
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            var l = list[i];
            var startTime = (l.createTime).split(' ');
            l.startTime = startTime[0];
            l.check = 0;
            l.msg = '点击展开'
          }
        }
        that.setData({
          list: list
        })
      } else {

      }
    }, function fail(res) {

    });


  },
  /*展开*/
  open: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var select = e.currentTarget.dataset.select;
    var list = that.data.list;
    for (var i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if (select == 0) {
          list[i].check = 1;
          list[i].msg = "点击收起"
        } else {
          list[i].check = 0;
          list[i].msg = "点击展开"
        }
        that.setData({
          list: list,
        })
      }
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