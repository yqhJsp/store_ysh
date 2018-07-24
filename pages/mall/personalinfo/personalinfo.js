// pages/site/personalinfo/personalinfo.js
const app = getApp();
const api = require('../utils/api_util.js');
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
    sex: 1,
    date: ['2018', '04'],//日期
    bornYear: '',//年份
    bornMonth: '',//月份
    address: '',//住址
    maninfo: {},
    time: '获取验证码', //倒计时 
    currentTime: 50,
    smsCode: '',
    iv: '',
    encryptedData: '',
    phoneData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '个人信息',
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
      var date = [us.bornYear, us.bornMonth];
      that.setData({
        sex: us.userInfo.gender,
        name: us.realName,
        mobile: us.mobile,
        address: us.address,
        date: date
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
  addressInput: function (e) {
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },
  //性别
  checked: function (e) {
    var that = this;
    var selected = e.target.dataset.id;
    that.setData({
      sex: selected
    })
  },
  /*日期控件*/
  bindDateChange: function (e) {
    var that = this;
    var value = e.detail.value;
    if (value != '') {
      var date = value.split('-');
      that.setData({
        date: date
      })
    }
  },
  codeInput: function (e) {
    var that = this;
    that.setData({
      smsCode: e.detail.value
    })
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
   var memberId =that.data.member.id;
   app.api_util.sendsms({memberId: memberId, phone: phone}, '正在发送...', function success(res) {
  
   }, function fail(res) {

   })
  },
  
  //保存信息
  saveMember: function () {
    var that = this;
    var appid =  app.globalData.appid;
    var createUserId = app.globalData.createUserId;
    var id = that.data.member.id;
    var realName = that.data.name;
    var mobile = that.data.mobile;
    var gender = Number(that.data.sex);
    var smsCode = that.data.smsCode;
    if (that.data.sex == null) {
      gender = 1
    }
    var address = that.data.address;
    var date = that.data.date;
    var bornYear = date[0];
    var bornMonth = date[1];

    if (realName == '') {
      app.toast.warn("请填写姓名", 1500);
      return false
    }
    if (mobile.length != 11) {
      app.toast.warn("请填写正确手机号码", 1500);
      return false
    }
    if (that.data.member.isRole==2){
      if (smsCode == '') {
        app.toast.warn("验证码不能为空", 1500);
        return false
      }
    }
  
    var data = {
      id: id,
      realName: realName,
      mobile: mobile,
      address: address,
      bornYear: bornYear,
      bornMonth: bornMonth,
      gender: gender,
      appid: appid,
      createUserId: createUserId,
      smsCode: smsCode
    }
    app.api_util.addmember(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("提交成功", 1000);
        app.globalData.member = res.result;   
        setTimeout(() => {
          wx.redirectTo({
            url: '../member/member'
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
  getPhoneNumber: function (e) {
    var that=this;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    that.setData({
      iv: iv,
      encryptedData: encryptedData
    })
    that.decodeinfo();
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