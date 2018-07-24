// pages/mall/evaluate/evaluate.js
const app = getApp();
const api = require('../utils/api_util.js');
const static_data = require('../utils/static_data.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    sourceDomain: static_data.source_domain_url,
    productArr: {},
    fi: {},
    cause_desc: '',
    img_arr: [],
    dirs: [],
    stars: [1, 2, 3, 4, 5],
    flag: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pid = options.id;
    wx.setNavigationBarTitle({
      title: '评价'
    })
    wx.getStorage({
      key: 'procuctInfo',
      success: function (res) {
        that.setData({
          productArr: res.data,
        })
        var orderArr = res.data.orderProductsArr;
        for (var i = 0; i < orderArr.length; i++) {
          if (orderArr[i].productId == pid) {
            var info = {
              images: orderArr[i].product.imageIds,
              title: orderArr[i].product.title,
              price: orderArr[i].productRule.price,
              name: orderArr[i].productRule.name,
              numbers: orderArr[i].number,
              integral: orderArr[i].productRule.integral
            }
            that.setData({
              proinfo: info
            })
          }
        }
      }
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
  },
  /*星星打分*/
  changeColor: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var statArr = that.data.stars;
    for (var i = 0; i < statArr.length; i++) {
      if (id == statArr[i]) {
        that.setData({
          flag: statArr[i]
        });
      }
    }
    console.log(that.data.flag)
  },
  /*获取文本框的值*/
  bindKeyInput: function (e) {
    var value = e.detail.value;
    if (value > 0 || value.length > 0) {
      this.setData({
        cause_desc: value,
      })
    }
  },
  //选取图片的方法
  upimg: function () {
    var that = this,
      img_arr = that.data.img_arr;
    var dirs = that.data.dirs;
    if (img_arr.length < 5) {
      wx.chooseImage({
        count: 5 - img_arr.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
        sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
        success: function (res) {
          var imgsrc = res.tempFilePaths;
          app.uploadimg({
            url: that.data.sourceDomain + '/attachment/upload', //这里是你图片上传的接口
            path: imgsrc//这里是选取的图片的地址数组
          }, dirs);
          img_arr = img_arr.concat(imgsrc);
          that.setData({
            img_arr: img_arr
          });
        },
        fail: function () {

        },
        complete: function () {

        }
      })
    } else {
      app.toast.warn("最多上传五张图片", 1000);
    }

  },
  /*评价*/
  save: function () {
    var that = this;
    var productId = that.data.productArr.id;
    var orderId = that.data.productArr.orderId;
    var buyerMessage = that.data.cause_desc;
    var imageIds = [];
    var member = app.globalData.member;
    imageIds = that.data.dirs;
    var level = that.data.flag;
    if (that.data.flag == 0) {
      level = 5
      // app.toast.warn("等级未选", 1000);
      // return false;
    }
    if (buyerMessage.length == 0) {
      app.toast.warn("评价为空", 1000);
      return false;
    }

    var data = {
      productId: parseInt(productId),
      memberId: member.id,
      orderId: orderId,
      buyerMessage: buyerMessage,
      imageIds: imageIds.toString(),
      level: level,
      createUserId: app.globalData.createUserId
    }
    console.log(data);
    api.order_evaluate(data, '提交中', function success(res) {
      if (res.errcode == 0) {
        wx.redirectTo({
          url: '/pages/user/mineOrder/orderItems?id=' + 3,
        })
      } else {
        app.toast.error("评论失败", 1000);
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    }
    )

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