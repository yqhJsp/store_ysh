// pages/marketing/integral/integral.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    contentlist: [],
    size: 10,
    number: 1,
    member: {},
    hasMoreData: true,
    maninfo: {},
    logType: 1,//积分类型,
    intelall: 0,//可用积分
    yinIntelall: 0,//可用银积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var logType = options.logType;
    if (logType == 1) {
      wx.setNavigationBarTitle({
        title: '我的积分',
      })
    } else if (logType == 3) {
      wx.setNavigationBarTitle({
        title: '我的银积分',
      })
    }
    var member = app.globalData.member;
    var intelall = member.integralSum - member.integralOut;
    var yinIntelall = member.yinSumMonery - member.yinOutMonery;
    var maninfo = app.globalData.maninfo;
    that.setData({
      member: member,
      intelall: intelall,
      yinIntelall: yinIntelall,
      maninfo: maninfo,
      logType: logType
    })
    that.getIntegral('', logType);
  },
  
  //获取数据
  getIntegral: function (message, logType) {
    var that = this;
    var memberId = app.globalData.member.id;
    var data = {
      'memberId': memberId,
      'size': that.data.size,
      'number': that.data.number,
      'logType': logType
    }
    api.integralloglist(data, '加载中...', function success(res) {
      var contentlistTem = that.data.contentlist
      if (res.errcode == 0) {
        if (that.data.number == 1) {
          contentlistTem = []
        }
        var contentlist = res.result.content;
        if (contentlist.length < that.data.size) {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: false
          })
        } else {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: true,
            number: that.data.number + 1
          })
        }
      }
      var list = that.data.contentlist;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        if (item.way == 1) {
          item.forWay = '消费';

        } else if (item.way == 2) {
          item.forWay = '调整';

        } else if (item.way == 3) {
          item.forWay = '返还';

        } else if (item.way == 4) {
          item.forWay = '退款';

        } else if (item.way == 5) {
          item.forWay = '提现';

        } else if (item.way == 6) {
          item.forWay = '提到余额';

        } else if (item.way == 7) {
          item.forWay = '关闭订单退回';
          
        }

      }
      that.setData({
        contentlist: list
      })
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    })
  },
  //提现
  goIntegral: function () {
    wx.navigateTo({
      url: '/pages/store/integralCash/integralCash',
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
    var that = this;
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
    var that = this;
    that.data.number = 1;
    that.getIntegral('正在刷新数据', that.data.logType);
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 2500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.hasMoreData) {
      that.getIntegral('加载更多数据', that.data.logType);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})