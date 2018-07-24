// pages/store/integralCash/integralCash.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    monery: 0,
    member: {},
    maninfo: {},
    tip: '',
    way:0,//提现方式
    myYinSum: 0,//可用的余额
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '积分提现',
    })
    var that = this;
    var member = app.globalData.member;
    var maninfo = app.globalData.maninfo;
    var myYinSum = (member.yinSumMonery - member.yinOutMonery);
    app.common_util.setBarColor(maninfo.tone);
    that.setData({
      member: member,
      maninfo: maninfo,
      myYinSum: myYinSum
    })
  },

  //获取金额
  prefInput: function (e) {
    var that = this;
    var value = e.detail.value;
    var intelSum = that.data.member.yinSumMonery - that.data.member.yinOutMonery;
    if (value != '') {
      if (value > intelSum){
        that.setData({
          monery: value,
          myYinSum:0
        })
      }
      else{
        that.setData({
          monery: value,
          myYinSum: intelSum - value
        })
      }
      console.log(that.data.monery)
    } else {
      that.setData({
        monery: 0,
        myYinSum: intelSum
      })
    }
  },
  //提交
  goSave: function () {
    var that = this;
    var monery = that.data.monery;
    var memberId = app.globalData.member.id;
    var type = Number(that.data.way);
    var bankCard = app.globalData.member.bankCard;;
    if (monery =='') {
      app.toast.error('请填写提现积分', 1500);
      return false
    }
    else if (monery > that.data.myYinSum) {
      app.toast.error('超过可提现积分', 1500);
      return false
    }
    var data = {
      'monery': monery,
      'memberId': memberId,
      'type': type,
      'applyType':2
    }
    api.insertbrokerageapply(data, "", function success(res) {
      if (res.errcode == 0) {
       app.getSession();
          that.setData({
            showModalStatus: true
          })
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    });
  },
  //清除
  clear: function () {
    this.setData({
      monery: ''
    });
  },

  //返回个人中心
  goMember: function () {
    wx.switchTab({
      url: '/pages/user/storeUser/storeUser',
    })
  },
  /*隐藏弹窗*/
  hideModal: function () {
    var that = this;
    that.setData({
      showModalStatus: false
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