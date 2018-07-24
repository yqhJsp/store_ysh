
var dateTimePicker = require('../utils/dateTimePicker.js');
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    storeList: {},//门店信息
    name: '',//姓名
    phone: '',//姓名
    // date:'',//日期
    consult: '',//留言
    member: {},
    date: '2018-03-20',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    dateTimeArray1: null,
    dateTime1: null,
    startYear: 2000,
    endYear: 2050,
    appid:'',
    infos:[],
    maninfo:{},
    showModalStatus:false,//隐藏弹窗
    isSoupon:0,
    store:{},//获取所选门店信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '提交预约',
    })
    var appid = app.globalData.appid;
    var member = app.globalData.member;
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(maninfo.tone);
    that.setData({
      appid: appid,
      member: member,
      maninfo: maninfo
    })
    wx.getStorage({
      key: 'storeList',
      success: function (res) {
        that.setData({
          storeList: res.data,  
        })
      },
    })
    
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    that.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });
  },
  //获取姓名
  nameInput: function (e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      name: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取日期
  changeDateTime1: function (e) {
    this.setData({ dateTime1: e.detail.value });
  },
  //获取时分
  changeDateTimeColumn1: function (e) {
    var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },
  /*日期控件*/
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  consultInput: function (e) {
    this.setData({
      consult: e.detail.value
    })
  },
  //选取门店
  selectStore:function(){
    var that=this;
    that.setData({
      showModalStatus:true,
      isSoupon:1
    })
  },
  goStore:function(e){
  var that=this;
  var id=e.currentTarget.dataset.id;
  var list=that.data.infos;
  var item='';
  if(list.length>0){
    for(var i=0;i<list.length;i++){
      if(id==list[i].id){
        item=list[i]
      }
    }
  }
  that.setData({
    storeList: item,
    showModalStatus:false,
    isSoupon:0
  })
  },
  /*隐藏 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isSoupon: 0
    })
  },
  //获取门店列表
  getStore:function () {
    var that = this;
    var mainInfoId = that.data.maninfo.id;
    var type =2;
    var data = {
      mainInfoId: mainInfoId,
      type: type
    }
    api.childreninfolist(data, '加载中..', function success(res) {
      if (res.errcode == 0) {
        console.log(res.result)
        that.setData({
          infos: res.result,
        })
      }
    }, function fail(res) {

    })
  },
  //提交预约
  save: function () {
    var that = this;
    var childrenInfoId = that.data.storeList.id;
    var appid =that.data.appid;
    var name = that.data.name;
    var phone = that.data.phone;
    console.log(phone.length)
    var data = that.data.dateTimeArray1;
    var dataTime = that.data.dateTime1;
    var time = (data[0][dataTime[0]] + '-' + data[1][dataTime[1]] + '-' + data[2][dataTime[2]]) + ' ' + (data[3][dataTime[3]] + ':' + data[4][dataTime[4]]);
    console.log(time)
    var content = that.data.consult;
    var type = 1;
    var memberId = that.data.member.id;
    var createUserId = app.globalData.createUserId;
    if (name == '') {
      app.toast.warn("请填写姓名", 1500);
      return false
    }
    if (phone.length != 11) {
        app.toast.warn("请填写正确手机号码", 1500);
        return false
    }
    if (time == '') {
      app.toast.warn("请选择日期", 1500);
      return false
    }
    var data = {
      childrenInfoId: childrenInfoId,
      appid: appid,
      name: name,
      phone: phone,
      time: time,
      content: content,
      type: type,
      memberId: memberId,
      createUserId: createUserId
    }
    api.savesubscribe(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("提交成功", 1500);
        setTimeout(() => {
          wx.redirectTo({
            url: '../storeIndex/storeIndex?id=' + childrenInfoId,
          })
        }, 1000)
      }
    }, function fail(res) {
      app.toast.warn("提交失败", 1500);
    })

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.getStore();
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