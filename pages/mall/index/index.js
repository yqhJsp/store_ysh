// pages/mall/index/index.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    swiper: [],
    indexColumns: [],
    searchName: '',
    variable: 0,
    focus: false,
    member: {},
    isPayPattern: 0,
    appid: 0,
    maninfo: {},
    isLoad: true,
  },
  /*消息通知*/
  openMessage: function () {
    wx.navigateTo({
      url: '../message/message'
    })
  },
  /*搜索*/
  goSearch: function () {
    var title = this.data.searchName;
    if (title != '') {
      wx.navigateTo({
        url: '../list/shopList?likeTitle=' + title + '&stuats=2',
      })
    } else {
      app.toast.warn("请输入搜索的商品名", 1000);
    }
  },
  /*获取搜索框的内容*/
  bindSearch: function (e) {
    var value = e.detail.value;
    if (value > 0 || value.length > 0) {
      this.setData({
        searchName: value,
      })
    }
  },
  //滚动监听  
  scroll: function (e) {
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  /**
   * 加载首页数据
   */
  get_home: function () {
    var that = this;
    api.homeData("", function sussess(res) {
      if (res.errcode == 0) {
        var data = res.result;
        var indexColumns = data.indexColumns;
        app.globalData.maninfo.type =1006;
        if (indexColumns.length > 0) {
          for (var i = 0; i < indexColumns.length; i++) {
            var products = indexColumns[i].products;
            for (var j = 0; j < products.length; j++) {
              var p = products[j];
              var s = p.imageIds.split(",");
              p.imageIds = s[0];

              var outnum = (p.outNumber / p.total)*100;
              var innum = 100 - outnum;
              p.outnum = outnum;
              p.innum = innum;
            }
          }
        }
        // console.log(indexColumns); 
        that.setData({
          swiper: data.reAttachShopList,
          indexColumns: indexColumns,
          isLoad: false
        })
        // 在这里停止加载的提示框  
        wx.hideLoading();
        wx.hideNavigationBarLoading();
      }
    }, function fail(res) {

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var type = options.type;
    if (type == 1) {
      var id = options.id;
      wx.navigateTo({
        url: '../detail/mall_detail?id=' + id
      })
    }
    wx.setNavigationBarTitle({
      title:"积分商城"
    })
    var maninfo = app.globalData.maninfo;
    app.common_util.setBarColor(maninfo.tone);
    that.setData({
      isPayPattern: app.globalData.isPayPattern,
      maninfo: maninfo
    })
    that.get_home();
  },
  //跳转商品
  goDetail: function (options) {
    var id = options.currentTarget.id;
    wx.navigateTo({
      url: '../detail/mall_detail?id=' + id
    })
  },
  toCar: function () {
    wx.navigateTo({
      url: '/pages/mall/scart/page',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
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
  onShow: function (ops) {

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
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  /*
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.get_home();
    wx.stopPullDownRefresh()
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
      title:'',
      path: '/pages/mall/index/index',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  }
})