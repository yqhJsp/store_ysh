// pages/site/storeIndex/storeIndex.js
const app=getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    store:{},//门店信息
    sid:0,//门店ID
    tag:[],//标签
    images:[],
    article: {},//详情
    couponlist: [],//优惠卷
    animationData: {},//选择动画
    isCoupon: 0,//隐藏优惠卷弹窗
    showModalStatus: false,//显示遮罩
    member:{},
    maninfo:{},
    appid:'',
    showModalStatus: false,//显示遮罩
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  var id=options.id;
  that.setData({
    sid:id
  })
  var maninfo = app.globalData.maninfo;
  var member = app.globalData.member;
  var appid = app.globalData.appid;
  app.common_util.setBarColor(app.globalData.maninfo.tone);
  that.setData({
    maninfo: maninfo,
    member: member,
    appid:appid,
    sid: id
  });
  that.getStoreData(id);
  },
  //获取数据
  getStoreData:function(id){
    var that=this;
    api.childrenbyid({ id: id }, '加载中...', function success(res){
      if (res.errcode==0){
        var data=res.result;
        wx.setNavigationBarTitle({
          title: data.name
        })
        wx.setStorage({
          key: 'storeList',
          data: res.result,
        })
        var tag = (res.result.tag).split(",");
        var article = res.result.brief;
          that.setData({
            store: data,
            tag: tag,
            article: app.WxParse.wxParse('article', 'html', article, that, 0)          
          })
        
      }
    },function fail(res){
      
    })
  },

  /*联系*/
  goCall: function (e) {
    var that = this;
    var phone = that.data.store.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {
        
    }, function fail(res) {
       
    })
  },
  //商城
  goShop:function(){
    var that=this;
    wx.switchTab({
      url: '/pages/mall/index/index',
    })
  },
  //邀请会员
  interve:function(){
   var that=this;
   if (that.data.member.isRegister == 2){
     app.toast.warn("您还不是会员，请前往注册！",2000);
     setTimeout(() => {
      wx.navigateTo({
        url: '/pages/user/storeRegister/storeRegister',
      })
     },500)
   } else {
     var memberId = that.data.member.id;
     var appid = app.globalData.appid;
     var tone = that.data.maninfo.tone;
     wx.navigateTo({
       url: '/pages/store/qrcode/qrcode?memberId=' + memberId + '&appid=' + appid + '&promoCode=' + app.globalData.member.promoCode + '&tone=' + tone
     })
   }
  },
  /*获取当前坐标地理位置*/
  getlocation: function () {
    var that = this;
    var latitude = that.data.store.latitude;
    var longitude = that.data.store.longitude;
    var address = that.data.store.address;
    var name = that.data.store.name;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var speed = res.speed;
        var accuracy = res.accuracy;
        wx.openLocation({
          latitude: Number(latitude),
          longitude: Number(longitude),
          scale: 23,
          address: '' + address + '',
          name: name
        })
      }
    })
  },
  //评价图片预览
  preview: function (e) {
    var that = this;
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    var file = that.data.fileDomain;
    //数据源
    var img = that.data.store.imagesIds;
    console.log(img)
    var pictures = [];
    for (var i = 0; i < img.length; i++) {
      var item = file+img[i];
      pictures.push(item)
    }
    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
    }
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res)
    }
    return {
      title: that.data.store.name,
      success: function (res) {

        var tickets = res.shareTickets[0];
        console.log(tickets);
        wx.getShareInfo(tickets, function success(res) {
          console.log(res)
        });
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})