// pages/mall/index/index.js
const app = getApp();
const api = require('../utils/api_util.js');
const mall_api = require('../../mall/utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    list: [],
    hidden: false,//隐藏
    dots: false,//swiper指示点
    verticalL: false,//滑动方向是否为纵向
    autoplay: false,
    dot: false,
    maninfo: {},
    infos: [],
    currentab: 2,//附近、热 门门店
    latitude: '',
    longitude: '',
    member: {},
    appid: '',
    dw: '',
    putong: [],//普通会员列表
    gudong: [],//股东会员

  },
  //跳转到详情页
  goStoreIndex: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../storeIndex/storeIndex?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.token == null) {
      app.getSession();
    }
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("latitude:" + latitude)
        console.log("longitude:" + longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    })
    var scene = decodeURIComponent(options.scene);
    var member = app.globalData.member;
    var appid = app.globalData.appid;
    that.setData({
      member: member,
      appid: appid
    })
    app.userInfoReadyCallback = res => {
      that.getmaininfo();
      that.ptServiceList();
      that.gdServiceList();
      //分销关系
      console.log(scene)
      if (scene != "undefined") {
        app.globalData.scene = scene;
        that.brokeragerelation(scene);
        console.log(scene + "结束")
      }

    }
    var pid = options.pid;
    if (pid != undefined) {
      console.log("跳转")
      console.log(pid)
      wx.navigateTo({
        url: '/pages/mall/detail/mall_detail?id=' + pid
      })
    }
  },
  //插入分销关系
  brokeragerelation: function (parentId) {
    var that = this;
    var createUserId = app.globalData.createUserId;
    var childrenId = app.globalData.member.id;
    var appid = app.globalData.appid;
    var data = {
      'createUserId': createUserId,
      'parentId': parentId,
      'childrenId': childrenId,
      'appid': appid
    }
    console.log("发起请求")
    console.log("结束请求")
    //分销关系插入
    mall_api.insertbrokeragerelation(data, '', function success(res) {
      if (res.errcode == 0) {
        var brokerage = res.result;
        console.log(res.result);
        console.log("请求成功")
        wx.setStorage({
          key: 'brokerage',
          data: brokerage,
        })
      }
    }, function fail(res) {

    })
  },
  //服务详情
  goSDetail: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/store/serviceDetail/page?id=' + id + '&type=' + type,
    })
  },

  //联系
  goCall: function (e) {
    var that = this;
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {

    }, function fail(res) {

    })
  },
  //跳转注册
  goRegister: function () {
    wx.navigateTo({
      url: '/pages/user/storeRegister/storeRegister',
    })
  },
  //我要推广
  goTuiguang: function () {
    wx.navigateTo({
      url: '/pages/store/qrcode/qrcode',
    })
  },
  //跳转到单个门店
  goStore: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../storeIndex/storeIndex?id=' + id,
    })
  },
  //切换门店数据
  switchTab: function (o) {
    var that = this;
    var idx = o.currentTarget.dataset.type;
    var currentab = that.data.currentab;
    if (idx != currentab) {
      that.setData({
        currentab: idx,
      })
      console.log(that.data.currentab)
      //刷新数据
      that.childreninfolist();
    }
  },
  //获取门店列表
  childreninfolist: function () {
    var that = this;
    var mainInfoId = that.data.maninfo.id;
    var type = that.data.currentab;
    var longitude = that.data.longitude;
    var latitude = that.data.latitude;
    var data = {
      mainInfoId: mainInfoId,
      type: type
    }
    if (type == 1) {
      data.longitude = longitude;
      data.latitude = latitude
    }
    api.childreninfolist(data, '', function success(res) {
      if (res.errcode == 0) {
        var tag = res.result.tag;
        that.setData({
          infos: res.result,
        })
        var list = that.data.infos;
        var dw = '';
        if (list.length != 0) {
          for (var i = 0; i < list.length; i++) {
            var l = list[i];
            var tag = l.tag.split(",");
            l.tags = tag;
            var s = l.range;
            if (s < 1000) {
              l.distance = s;
              dw = '米'
            }
            else if (s > 1000) {
              l.distance = (Math.round(s / 100) / 10).toFixed(1);
              dw = '公里'
            }

          }
          that.setData({
            infos: list,
            dw: dw

          })
        }
      }
    }, function fail(res) {

    })
  },
  //获取主体信息
  getmaininfo: function () {
    var that = this;
    app.api_util.getmaininfo({}, '加载中..', function success(res) {
      if (res.errcode == 0) {
        that.setData({
          maninfo: res.result,
          hidden: false
        })
        app.globalData.maninfo = res.result;
        app.common_util.setBarColor(app.globalData.maninfo.tone);
        wx.setNavigationBarTitle({
          title: app.globalData.maninfo.navigation
        })
        wx.setStorage({
          key: 'maninfo',
          data: res.result,
        })
        that.childreninfolist();
      }
    }, function fail(res) {

    })
  },
  //获取普通会员服务列表
  ptServiceList: function () {
    var that = this;
    api.serviceList({ type: 1 }, '加载中..', function success(res) {
      if (res.errcode == 0) {
        that.setData({
          putong: res.result,
        })
      }
    }, function fail(res) {

    })
  },
  //获取股东会员服务列表
  gdServiceList: function () {
    var that = this;
    api.serviceList({ type: 2 }, '加载中..', function success(res) {
      if (res.errcode == 0) {
        that.setData({
          gudong: res.result,
        })
      }
    }, function fail(res) {

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.getmaininfo();
    that.ptServiceList();
    that.gdServiceList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getmaininfo();
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
    this.getmaininfo();
    app.refresh();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 2000)
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