const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    maninfo: {},
    rankList:[],
    size:10,
    number:1,
    hasMoreData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  wx.setNavigationBarTitle({
    title: '我邀请的会员',
  })
  var maninfo = app.globalData.maninfo;
  var pid=options.pid;
  app.common_util.setBarColor(maninfo.tone);
  that.setData({
    maninfo: maninfo,
  })
  that.relationmember();
  },
  
  //获取数据
  relationmember:function(msg){
   var that=this;
   var size=that.data.size;
   var number=that.data.number;
   var memberId=app.globalData.member.id;
   var data={
     size: size,
     number: number,
     memberId: memberId,
     type:1
        }
   app.api_util.relationmember(data,'加载中...',function success(res){
     if (res.errcode == 0) {
       var list = that.data.rankList;
       if (number == 1) {
         list = []
       }
       var rankList = res.result.content;
       if (rankList.length > 0) {
         if (rankList.length < size) {
           that.setData({
             rankList: list.concat(rankList),
             hasMoreData: false,
           })
         } else {
           that.setData({
             rankList: list.concat(rankList),
             hasMoreData: true,
             number: number + 1,
           })
         }
       } else {
         that.setData({
           rankList: []
         })
       }

     }
   },function fail(res){

   })
  },
  //我要推广
  interve: function () {
    var that = this;
    if (app.globalData.member.isRegister == 2) {
      app.toast.warn("您还不是会员，请前往注册！", 2000);
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/user/storeRegister/storeRegister',
        })
      }, 500)
    } else {
      var memberId = app.globalData.member.id;
      var appid = app.globalData.appid;
      var tone = that.data.maninfo.tone;
      wx.navigateTo({
        url: '/pages/store/qrcode/qrcode?memberId=' + memberId + '&appid=' + appid + '&promoCode=' + app.globalData.member.promoCode + '&tone=' + tone
      })
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
    var that = this;
    that.data.number = 1
    that.relationmember('正在刷新数据')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.hasMoreData) {
      that.relationmember('加载更多数据');
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