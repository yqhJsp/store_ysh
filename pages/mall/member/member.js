// pages/site/member/member.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    getMember:{},
    member:{},
    intelTatol:0,//积分总数
    maninfo: {}
  },
 //积分
  goIntel:function(){
  wx.navigateTo({
    url: '/pages/marketing/integral/integral',
  })
  },
  //个人信息
  goMembers: function () {
    wx.navigateTo({
      url: '../personalinfo/personalinfo',
    })
  },
  //会员卡详情
  goMemberDetail: function () {
    wx.navigateTo({
      url: '../memberDetail/memberDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this;
   wx.setNavigationBarTitle({
     title: '我的会员'
   })
   var member = app.globalData.member;
   app.common_util.setBarColor(app.globalData.maninfo.tone);
   that.setData({
     member: member,
     maninfo: app.globalData.maninfo
   });
  },
  //获取会员信息
  getMember: function () {
    var that = this;
    var id = app.globalData.member.id;
    app.api_util.getmember(id, '加载中...', function success(res) {
      if (res.errcode == 0) {
        var data = res.result;
        if (data.length != 0 && data != '') {
          var intelTatol = data.integralSum;
          app.globalData.member = res.result;
          that.setData({
            getMember: app.globalData.member,
            intelTatol: intelTatol
          })
        }
      }
    }, function fail(res) {

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getMember();
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