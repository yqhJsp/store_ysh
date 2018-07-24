// pages/mall/qrcode/qrcode.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    maninfo: {},//主体信息
    member: {},
    memberId: '',
    appid: '',
    promoCode:'',//二维码
    tone:'',
    sid:'',
    type:0,
    scene:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我要推广'
    })
    var memberId = options.memberId;
    var appid = options.appid;
    var promoCode = options.promoCode;
    console.log("推广")
    var scene = options.scene; //扫码进入有此参数
     var scene = decodeURIComponent(options.scene);
    if (scene !="undefined") {
      that.setData({
        scene: scene
      })
    }
    that.setData({
      memberId: memberId,
      appid: appid,
      promoCode: promoCode
    })
    console.log(memberId)
    console.log(appid)
    console.log(promoCode)
    console.log(scene)
  },
  
  //生成推广码
  promocode: function () {
    var that = this;
    var memberId = that.data.memberId;
    var appid = that.data.appid;
    app.api_util.promocode({memberId: memberId, appid: appid }, '', function success(res) {
      if (res.errcode == 0) {
        app.globalData.member.promoCode = res.msg;
        console.log(app.globalData.member.promoCode);
        that.setData({
          promoCode: res.msg
        })
      }
    }, function fail(res) {

    })
  },
  
  // 图片点击事件
  previewImage: function (e) {
    var that = this;
    var nowImgUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: [nowImgUrl], // 当前显示图片的http链接
      urls: [nowImgUrl] // 需要预览的图片http链接列表
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
  onShow: function (options) {
  
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
      title: '我要推广',
      path: '/pages/store/qrcode/qrcode?memberId=' + that.data.memberId + '&appid=' + that.data.appid + '&promoCode=' + that.data.promoCode +'&scene='+1036,
      success: function (res) {
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})