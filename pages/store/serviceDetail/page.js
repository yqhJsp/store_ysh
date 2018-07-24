// pages/vote/oneDetail/oneDetail.js
const app=getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    maninfo:{},
    details:{},//子详情
    article:'',
    type:0,
    sid:0,//服务Id
    showModalStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  wx.setNavigationBarTitle({
    title: '服务卡详情',
  })
  var type = options.type;
  var id = options.id;
  var maninfo = app.globalData.maninfo;
  var member = app.globalData.member;
  if (maninfo!=undefined){
    app.common_util.setBarColor(maninfo.tone);
  }
  that.setData({
    maninfo: maninfo,
    member: member,
    type: type,
    sid:id
  })
  that.serviceOne(id);
  console.log("服务")
  console.log(id)
  console.log(type)
  },
  
  //获取服务卡详情
  serviceOne:function(id){
    var that=this;
    api.serviceOne(id, '加载中..', function success(res) {
      if (res.errcode == 0) {
        var article = res.result.detail;
        that.setData({
          details: res.result,
          article: app.WxParse.wxParse('article', 'html', article, that, 0)
        })
      }
    }, function fail(res) {

    })
  },
  //立即订购
  goBuy:function(){
   var that=this;
   if (that.data.member.isRegister == 2) {
     app.toast.warn("您还不是会员，请前往注册！", 2000);
     setTimeout(() => {
       wx.navigateTo({
         url: '/pages/user/storeRegister/storeRegister',
       })
     }, 500)
   } else {
     wx.showModal({
       title: '',
       content: '是否购买服务套餐？',
       success: function (res) {
         if (res.confirm) {
           that.serviceInsert();
         }
       }
     })
   }
  },
  //服务订单录入
  serviceInsert:function(){
   var that=this;
   var type = that.data.type;
   var data={
     memberid:app.globalData.member.id,
     serviceInfoId:Number(that.data.sid),
     type: Number(type)
   }
   api.serviceInsert(data, '加载中..', function success(res) {
     if (res.errcode == 0) {
       var result=res.result;
       var order = res.result.order;
       var pay = res.result.pay;
       app.globalData.pay = pay;
       wx.setStorageSync('pay', pay);
       if (type==1){
         api.wechat_pay(pay,'商品支付', order.id, app.globalData.openid);
       }else{
         that.setData({
           showModalStatus: true
         })
       }
     }
   }, function fail(res) {
     app.toast.warn("操作失败", 2000);
   })
  },
  //我要推广
  interve: function () {
    var that = this;
    var memberId=that.data.member.id;
    var appid=app.globalData.appid;
    if (app.globalData.member.isRegister == 2) {
      wx.redirectTo({
        url: '/pages/user/storeRegister/storeRegister',
      })
    }else{
      wx.navigateTo({
        url: '/pages/store/qrcode/qrcode?memberId=' + memberId + '&appid=' + appid + '&promoCode=' + app.globalData.member.promoCode + '&sid=' + that.data.sid + '&type=' + that.data.type
      })
    }
  },
   //返回个人中心
  goIndex:function(){
   wx.switchTab({
     url: '/pages/store/index/index',
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