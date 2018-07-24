// pages/marketing/deposit/deposit.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    monery: 0,
    member: {},
    maninfo:{},
    tip: '',
    way: 1,//提现方式
    myBalanceSum:0,//可用的余额
    showModalStatus:false,
    isBank:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '提现金额',
    })
    var that = this;
    var member = app.globalData.member;
    var maninfo = app.globalData.maninfo;
   var myBalanceSum = (member.distributorSumMonery - member.distributorOutMonery)/100;
    app.common_util.setBarColor(maninfo.tone);
    that.setData({
      member: member,
      maninfo: maninfo,
      myBalanceSum: myBalanceSum
    })
  },
  //单选
  checked: function (e) {
    var that = this;
    var selected = e.target.dataset.id;
    that.setData({
      way: selected
    })
  },
  //获取金额
  prefInput: function (e) {
    var that = this;
    var value = e.detail.value;
    var balanceSum = (that.data.member.distributorSumMonery - that.data.member.distributorOutMonery)/100;
    if (value != 0) {
      if (value > balanceSum){
        app.toast.error('超过可提现金额', 1500);
        return;
      }else{
        that.setData({
          monery: value * 100,
          myBalanceSum: (balanceSum - value).toFixed(2)
        })
      }
    
      console.log(that.data.monery) 
    }else{
      that.setData({
        monery:0,
        myBalanceSum: balanceSum
      })  
    }
  },
  //提交
  goSave: function () {
    var that = this;
    var monery = that.data.monery;
    var memberId = app.globalData.member.id;
    var type = Number(that.data.way);
    var bankCard = app.globalData.member.bankCard;
    if (monery == 0) {
      app.toast.error('请填写提现金额', 1500);
      return false
    }
    else if (monery / 100 > that.data.member.distributorSumMonery / 100) {
      app.toast.error('超过可提现金额', 1500);
      return false
    }
    if (bankCard==''){
      that.setData({
        isBank: true
      })
      return false
    }
    var data = {
      'monery': monery,
      'memberId': memberId,
      'type': type,
      'applyType':1
    }
    api.insertbrokerageapply(data, "", function success(res) {
      if (res.errcode == 0) {
        app.globalData.member = res.result;
        setTimeout(()=>{
          that.setData({
            showModalStatus: true
          })
        },1000)
      
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    });
  },
  //清除
  clear: function () {
    this.setData({
      monery: ''
    });
  },
  //绑定银行卡
  goBank:function(){
   wx.redirectTo({
     url: '/pages/user/myBank/myBank',
   })
  }  ,
//返回个人中心
  goMember: function () {
    wx.switchTab({
      url: '/pages/user/storeUser/storeUser',
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