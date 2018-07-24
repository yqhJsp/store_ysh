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
    maninfo:{},
    myBalanceSum:0,//剩余余额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '推广余额',
    })
    var that = this;
    var member = app.globalData.member;
    var myBalanceSum = (member.distributorSumMonery - member.distributorOutMonery)/100;
    that.setData({
      member: member,
      myBalanceSum: myBalanceSum,
      maninfo: app.globalData.maninfo
    })
    that.getBalance()
  },
   //提现
  goPoularize:function(){
    wx.navigateTo({
      url: '/pages/store/popularize/popularize',
    })
  },
  //获取数据
  getBalance: function (message) {
    var that = this;
    var memberId = app.globalData.member.id;
    var data = {
      'memberId': memberId,
      'size': that.data.size,
      'number': that.data.number,
      'logType': 2
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

        } else if (item.way ==8) {
          item.forWay = '撤销提现';

        } else if (item.way == 9) {
          item.forWay = '推广提成';
        }

      }
      that.setData({
        contentlist: list
      })
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
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
    var that=this;
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
    that.getBalance('正在刷新数据')
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
      that.getBalance('加载更多数据')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})