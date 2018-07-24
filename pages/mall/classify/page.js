// pages/mall/classify/page.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    leftData: [],
    rightData: [],
    fristId: '',
    fileDomain: app.static_data.file_domain_url,
    likeTitle: '',
    sort: 0,
    searchName: '',
    focus: false,
    isLoad:true
  },
  getSort: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.set;
    var that = this;
    that.setData({
      sort: id
    })
    that.loadProducts(that.data.fristId, that.data.likeTitle, that.data.sort);
  },
  loadProducts: function (classid, likeTitle, types) {
    var that = this;
    var data={
      'groupId': classid,
       'size':10,
       'number': 1,
       'likeTitle': likeTitle,
       'type': types
    }
    api.getProductList(data, "", function sussess(res) {
      console.log(res);
      if (res.errcode == 0) {
        app.globalData.groupId = ""
        var products = res.result.content;
        for (var j = 0; j < products.length; j++) {
          var p = products[j];
          var s = p.imageIds.split(",");
          p.imageIds = s[0];
        }
        that.setData({
          rightData: products

        })
      }
    }, function fail(res) {

    });

  },
  openMessage: function () {
    wx.navigateTo({
      url: '../message/message'
    })
  },
  /**
   * 切换分类
   */
  cutClass: function (options) {
    var id = options.currentTarget.dataset.id;
    var that = this;
    that.setData({
      fristId: id
    })
    that.loadProducts(that.data.fristId, that.data.likeTitle, that.data.sort);
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
  bindSearch: function (e) {
    var value = e.detail.value;
    if (value > 0 || value.length > 0) {
      this.setData({
        searchName: value,
      })
    } else {
      that.setData({
        searchName: ''
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    wx.setNavigationBarTitle({
      title: '商城'
    })
    that.getGroup();
    app.common_util.setBarColor(app.globalData.maninfo.tone);
  },
  //获取分组
  getGroup:function(){
    var that=this;
    api.getGroupIdList("", function sussess(res) {
      if (res.errcode == 0) {
        if (res.result.length > 0) {
          that.setData({
            fristId:res.result[0].id,
            leftData: res.result,
            isLoad:false
          })
          that.loadProducts(res.result[0].id, that.data.likeTitle, that.data.sort);
        }
      }
    }, function fail(res) {

    });
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
   this.getGroup();
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

  },
  goDetail: function (options) {
    var id = options.currentTarget.id;
    wx.navigateTo({
      url: '../detail/mall_detail?id=' + id
    })
  },
})