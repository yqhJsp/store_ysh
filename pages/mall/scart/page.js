// pages/mall/scart/page.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    fileDomain: app.static_data.file_domain_url,
    allSelectStatus: 0,
    member: {},
    maninfo:{},
    total: 0,
    counts: 0,
    indexs: '',
    startX: 0, //开始坐标
    startY: 0,
    selectRule: {},
    goodNum: 0,//商品数量
    isPayPattern: 0,
    isLoad: true,//预加载
  },
  goDetail: function (options) {
    var id = options.currentTarget.id;
    wx.navigateTo({
      url: '../detail/mall_detail?id=' + id
    })
  },
  goIndex: function () {
    wx.switchTab({
      url: '/pages/mall/index/index',
    })
  },
  toBuy: function () {
    var that = this;
    var list = that.data.list;
    var selectProduct = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].check == 1) {
        list[i].product.selectRule = list[i].productRule;
        list[i].product.goodNum = list[i].number;
        selectProduct.push(list[i].product);
      }
    }
    if (selectProduct.length > 0) {
      app.globalData.saveOrder = selectProduct;
      wx.navigateTo({
        url: '../payment/orderPay?stype=1'
      })
    } else {
      app.toast.warn('请选中商品', 1500);
    }
  },
  addProduct: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var select = e.currentTarget.dataset.select;
    var list = that.data.list;
    var counts = that.data.counts;
    var total = that.data.total;
    for (var i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if (select == 0) {
          list[i].check = 1;
          counts += list[i].number;
          total += (list[i].number * list[i].productRule.price)
        } else {
          list[i].check = 0;
          counts -= list[i].number;
          total -= (list[i].number * list[i].productRule.price)
        }
        that.setData({
          list: list,
          total: total,
          counts: counts

        })
        break;
      }
    }
  },
  //全选
  allSelect: function (e) {
    var that = this;
    var ass = that.data.list;
    var allSelectStatus = that.data.allSelectStatus;
    if (allSelectStatus == 0) {
      var counts = 0;
      var total = 0;

      for (var i = 0; i < ass.length; i++) {
        console.log(ass[i]);
        ass[i].check = 1;
        counts += ass[i].number;
        total += (ass[i].number * ass[i].productRule.price)

      }
      that.setData({
        allSelectStatus: 1,
        list: ass,
        counts: counts,
        total: total
      })
    } else {
      for (var i = 0; i < ass.length; i++) {
        ass[i].check = 0;
      }

      that.setData({
        allSelectStatus: 0,
        list: ass,
        total: 0,
        counts: 0
      })
    }
  },
  goDetail: function (options) {
    var id = options.currentTarget.id;
    wx.navigateTo({
      url: '../detail/mall_detail?id=' + id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isPayPattern = app.globalData.isPayPattern
      wx.setNavigationBarTitle({
        title: '我的购物车'
      })
    that.getCartData();
    that.setData({
      member: app.globalData.member,
      maninfo: app.globalData.maninfo,
      isPayPattern: isPayPattern
    });
    app.common_util.setBarColor(app.globalData.maninfo.tone);
  },
  /*购物车数据*/
  getCartData: function () {
    var that = this;
    api.trolley_list({}, "", function sussess(res) {
      if (res.errcode == 0) {
        var ass = res.result;
        for (var i = 0; i < ass.length; i++) {
          ass[i].check = 0;
          ass[i].isTouchMove = false;
        }
        for (var j = 0; j < ass.length; j++) {
          var p = ass[j].product;
          var s = p.imageIds.split(",");
          p.imageIds = s[0];
        }
        that.setData({
          list: ass,
          isLoad: false

        });
        if (ass.length > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: '' + ass.length + ''
          })
        } else {
          wx.removeTabBarBadge({ index: 2 });
        }
      }
    }, function fail(res) {

    });
  },
  /*删除*/
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    var that = this;
    that.data.list.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    that.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: that.data.list
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.list.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      list: that.data.list
    })
    console.log(that.data.list + "");
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    if (that.data.isPayPattern == 1) {
      wx.showModal({
        title: '删除',
        content: '是否删除？',
        success: function (res) {
          if (res.confirm) {
            var id = e.currentTarget.dataset.index;
            that.deletCar(id);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showModal({
        title: '取消收藏',
        content: '是否取消？',
        success: function (res) {
          if (res.confirm) {
            var id = e.currentTarget.dataset.index;
            that.deletCar(id);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }

  },

  deletCar: function (id) {
    var that = this;
    api.trolley_delete(id, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("删除成功", 1500);
        console.log(res.data);
        that.getCartData();
      }
      else {
        app.toast.error('删除失败', 1500);
      }

    }, function fail(res) {
      app.toast.error("删除失败", 1000);
    }
    )
  },
  goodRefund: function (e) {
    var that = this;
    var select = e.currentTarget.dataset.select;
    var id = e.currentTarget.dataset.id;
    var list = that.data.list;
    var numbers = that.data.goodNum;
    var productId = '';
    var productRuleId = '';
    var counts = that.data.counts;
    var total = that.data.total;
    var sum = 0;
    if (select==1){
    for (var i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if (list[i].number == 1) {
          app.toast.warn('该商品不能减少了哟', 2000);
          return false
        } else {
          list[i].number = list[i].number - 1;
          counts = list[i].number;
          sum = total - list[i].productRule.price;
          numbers = list[i].number;
          productId = list[i].productId;
          productRuleId = list[i].productRuleId;
          break;
        }
      }

    }
    that.setData({
      list: list,
      counts: counts,
      total: sum
    })

    var data = {
      'id': id,
      'productId': productId,
      'productRuleId': productRuleId,
      'number': numbers
    }
    console.log(data);
    that.updataCart(data);
    }else{
      app.toast.warn('请勾选商品', 1000); 
    }
  },
  goodAdd: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var select = e.currentTarget.dataset.select;
    var list = that.data.list;
    var numbers = that.data.goodNum;
    var productId = '';
    var productRuleId = '';
    var counts = that.data.counts;
    var total = that.data.total;
    var sum = 0;
    if (select == 1) {
    for (var i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if (list[i].productRule.limitation != 0) {
          if (list[i].productRule.limitation < list[i].number) {
            wx.showModal({
              title: '提示',
              content: '不能超出限购数量',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            return;
          }

        }
        list[i].number = list[i].number + 1;
        counts = list[i].number;
        sum = total + list[i].productRule.price;
        numbers = list[i].number + 1;
        productId = list[i].productId;
        productRuleId = list[i].productRuleId;
        break;
      }

    }
    that.setData({
      list: list,
      counts: counts,
      total: sum
    })

    var data = {
      'id': id,
      'productId': productId,
      'productRuleId': productRuleId,
      'number': numbers
    }
    console.log(data);
    that.updataCart(data);
    } else {
      app.toast.warn('请勾选商品', 1000);
    }
  },


  /*更新购物车*/
  updataCart: function (data) {
    var that = this;
    api.trolley_update(data, '', function success(res) {
      if (res.errcode == 0) {

      }
    },
      function fail(res) {

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
    var that = this;
    that.getCartData();
    that.setData({
      allSelectStatus: 0,
      total: 0,
      counts: 0
    })
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
    this.getCartData();
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