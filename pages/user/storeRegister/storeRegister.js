// pages/site/personalinfo/personalinfo.js
const app = getApp();
const api = require('../../store/utils/api_util.js');
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    member: {},
    userInfo: {},
    name: '',
    mobile: '',
    pwd: '',//密码
    subPhone:'',//推荐人的手机
    maninfo: {},
    time: '获取验证码', //倒计时 
    currentTime: 50,
    smsCode: '',
    iv: '',
    encryptedData: '',
    phoneData:{},
    showModalStatus: false,//隐藏弹窗
    isSoupon: 0,//是否显示弹窗
    showArea:true,//显示文本域
    infos:[],//门店列表
    storeList: {},//门店信息
    scene:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '会员注册',
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      member: app.globalData.member,
      maninfo: app.globalData.maninfo,
      scene: app.globalData.scene
    });
    that.getStore();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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
  passwordInput: function (e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    })
  },
  
   subjectInput: function(e) {
    var that = this;
    that.setData({
      subPhone: e.detail.value
    })
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
  getCode: function (options){
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

  getVerificationCode(){
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
   var openId =app.globalData.openid;
   var data = {
     phone: phone,
     openId: openId,
     type: 1
   }
   app.api_util.sendsms(data, '正在发送...', function success(res) {
  
   }, function fail(res) {

   })
  },
  
  //保存信息
  saveMember: function () {
    var that = this;
    var openId = app.globalData.openid;
    var realName = that.data.name;
    var mobile = that.data.mobile;
    var pwd = that.data.pwd;
    var referrerDesc = that.data.subPhone;
    var smsCode = that.data.smsCode;
    var childrenInfoId = that.data.storeList.id;
    if (realName == '') {
      app.toast.warn("请填写姓名", 1500);
      return false
    }
    if (mobile.length != 11) {
      app.toast.warn("请填写正确手机号码", 1500);
      return false
    }
    if (pwd.length== 0) {
      app.toast.warn("密码不能为空", 1500);
      return false
    }
    if (that.data.member.isRole==2){
      if (smsCode == '') {
        app.toast.warn("验证码不能为空", 1500);
        return false
      }
    }
    var data = {
      id:app.globalData.member.id,
      realName: realName,
      mobile: mobile,
      openId: openId,
      pwd: pwd,
      childrenInfoId: childrenInfoId,
      smsCode: smsCode,
      referrerDesc: referrerDesc,
      referrerId: 0,
      appid:app.globalData.appid
    }
    app.api_util.checkmember(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("提交成功", 1000);
        app.globalData.member = res.result; 
        console.log(app.globalData.member)
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/user/registerSuccess/success'
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
  //选取门店
  selectStore: function () {
    var that = this;
    that.setData({
      showModalStatus: true,
      showArea:false,
      isSoupon: 1
    })
  },
  goStore: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var list = that.data.infos;
    var item = '';
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (id == list[i].id) {
          item = list[i]
        }
      }
    }
    that.setData({
      storeList: item,
      showModalStatus: false,
      isSoupon: 0
    })
  },
  //获取门店列表
  getStore: function () {
    var that = this;
    api.getchildreninfos({},'加载中..', function success(res) {
      if (res.errcode == 0) {
        console.log(res.result)
        that.setData({
          infos: res.result,
        })
        var list=that.data.infos;
        var storeList='';
        for (var i = 0; i < list.length;i++){
          storeList=list[0]
        }
        that.setData({
          storeList: storeList 
        })
      }
    }, function fail(res) {

    })
  },
  /*隐藏 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isSoupon: 0,
      showArea:true,
    })
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