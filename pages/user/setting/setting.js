// pages/site/personalinfo/personalinfo.js
const app = getApp();
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: {},
    userInfo: {},
    name: '',
    mobile: '',
    maninfo: {},
    time: '获取验证码', //倒计时 
    currentTime: 50,
    smsCode: '',
    iv: '',
    encryptedData: '',
    phoneData:{},
    pwd:'',//登录密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '设置',
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      member: app.globalData.member,
      maninfo: app.globalData.maninfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setMember();
  },
  setMember: function () {
    var that = this;
    var userInfo = app.globalData.member;
    if (userInfo != '') {
      var us = userInfo;
      that.setData({
        name: us.realName,
        mobile: us.mobile,
      })
    }
  },
  //获取姓名
  nameInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      name: e.detail.value
    })
  },
  //手机
  phoneInput: function (e) {
    var that = this;
    var value = e.detail.value;
    if (value!=''){
      that.setData({
        mobile: e.detail.value
      })
    }
  },
  
  codeInput: function (e) {
    var that = this;
    that.setData({
      smsCode: e.detail.value
    })
  },
  //登录密码
  passwordInput: function (e) {
    var that = this;
    var value = e.detail.value;
    if (value != '') {
      that.setData({
        pwd: e.detail.value
      })
    }
  },

  /** 
 * 获取短信验证码 
 */
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime:50,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    var that = this
    var phone = that.data.mobile;
    if (phone == '') {
      app.toast.warn("请填写手机号码", 1500);
      return false
    }
    that.getCode();
    that.sendsms();
    that.setData({
      disabled: true
    })
  },
//获取手机短信
  sendsms:function(){
   var that=this;
   var phone = that.data.mobile;
   var openId = app.globalData.openid;
   var data={
     phone: phone,
     openId: openId,
     type:2
   }
   app.api_util.sendsms(data, '正在发送...', function success(res) {
  
   }, function fail(res) {

   })
  },
  
  //保存信息
  saveMember: function () {
    var that = this;
    var smsCode = that.data.smsCode;
    var pwd = that.data.pwd;
    var openId = app.globalData.openid;
    var memberId = app.globalData.member.id;
    if (pwd == '') {
      app.toast.warn("请填写密码", 1500);
      return false
    }

    if (smsCode == '') {
      app.toast.warn("验证码不能为空", 1500);
      return false
    }
    var data = {
      smsCode: smsCode,
      pwd:pwd,
      openId: openId,
      memberId: memberId
    }
    app.api_util.updatepwd(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("提交成功", 1000);
        app.globalData.member = res.result;   
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/user/storeUser/storeUser'
          })
        }, 1000)
      }
      if (res.errcode == -2) {
        app.toast.warn("验证码不存在", 1000);
      }
      if (res.errcode == -3) {
        app.toast.warn("验证码不一致", 1000);
      }
    }, function fail(res) {

    })
  },

  decodeinfo: function () {
    var that = this;
    var dto = {
      encryptedData: that.data.encryptedData,
      sessionkey: app.globalData.sessionkey,
      iv: that.data.iv
    }
    app.api_util.decodeinfo(dto, "", function success(res) {
      if (res.errcode == 0) {
        that.setData({
          mobile: res.result.phoneNumber
        })
        console.log(res.result)
      }
    }, function fail(res) {

    });
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