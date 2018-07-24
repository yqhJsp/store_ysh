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
    list:[],
    size:10,
    number:1,
    hasMoreData:false,
    pay:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setNavigationBarTitle({
      title: '我购买的服务',
    })
    var member=app.globalData.member;
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(maninfo.tone);
    var pay=wx.getStorageSync('pay')
    that.setData({
      member: member,
      maninfo:maninfo,
      pay: pay
    })
    that.getService();
  },
  //获取服务的列表
  getService:function(msg){
    var that=this;
    var number = that.data.number;
    var size = that.data.size;
    var data={
      memberId:app.globalData.member.id,
      size:size,
      number:number
    }
    api.myService(data,'加载中..',function success(res){
      if(res.errcode==0){
        var slist=that.data.list;
        if (number==1){
          slist=[]
        }
        var list = res.result.content;
        if (list.length > 0) {
          if (list.length < size) {
            that.setData({
              list: slist.concat(list),
              hasMoreData: false,
            })
          } else {
            that.setData({
              list: slist.concat(list),
              hasMoreData: true,
              number:number + 1,
            })
          }
        } else {
          that.setData({
            list: []
          })
        }
      }
     
    },function fail(res){

    })
  },
  //跳转详情
  goDetail:function(e){
   var id=e.currentTarget.dataset.id;
   wx.navigateTo({
     url: '/pages/user/myServiceDetail/page?id='+id,
   })
  },
  delete:function(e){
    var that=this;
    var id=e.currentTarget.dataset.id;
    wx.showModal({
      title: '',
      content: '是否取消该服务订单？',
      success: function (res) {
        if (res.confirm) {
          that.deleteService(id);
        }
      }
    })

  } ,
  deleteService:function(id){
    var that=this;
    api.deleteService(id, '加载中..', function success(res) {
      if (res.errcode == 0) {
        that.getService();
      }
    },function fail(res){

    })
  },
  /*去支付*/
  goPay: function (e) {
    var that = this;
    var openId = app.globalData.openid;
    var id=e.currentTarget.dataset.id;
    var pay =that.data.pay;
    wx.showLoading({
      title: '结算中',
    })
    api.wechat_pay(pay, '商品支付',id, openId);

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
    var that=this;
    that.data.number = 1
    that.getService('正在刷新数据')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    if (that.data.hasMoreData) {
      that.getService('加载更多数据');
    } else {
      app.toast.warn("没有更多数据", 1000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})