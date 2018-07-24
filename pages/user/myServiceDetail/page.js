// pages/user/myService/myService.js
const app=getApp();
const api = require('../../store/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    member: {},
    maninfo: {},
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setNavigationBarTitle({
      title: '详情',
    })
    var id=options.id;
    var member=app.globalData.member;
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(maninfo.tone);
    that.setData({
      member: member,
      maninfo:maninfo
    })
    that.myServiceOne(id);
  },
  //获取服务的列表
  myServiceOne:function(id){
    var that=this;
    api.myServiceOne(id,'加载中..',function success(res){
      if(res.errcode==0){
         that.setData({
           info:res.result
         })
      }
     
    },function fail(res){

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