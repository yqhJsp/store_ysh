// pages/user/mineOrder/orderItems.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    member: {},
    navTab: ["质量问题", "卖家发错货", "货物与描述不符", "不喜欢/效果不好", "多拍/拍错/不想要", '其他'],
    currentNavtab: 0,
    hidden: false,
    showModalStatus: false,//隐藏弹窗
    number: 1,
    size: 10,
    status: '',
    orderId: '',
    resonId: '',
    order_des: '',
    list: [],
    subscribelist: [],
    safeguardStatus: 0,
    orderParem: {},
    tips: '', //无数据
    safeguardStatus: 0,
    isPayPattern: 0,
    appid: '',
    maninfo: {},
    member: {},
    hasMoreData: true,
    orders: {},//单条订单信息
    coltHidden: false,
    pay:''
  },
  /*取消订单*/
  cancelOrder: function (e) {
    var that = this;
    var id = e.currentTarget.id;
    var list = that.data.list;
    var orders = {};
    if (list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        if (id == list[i].id) {
          orders = list[i]
        }
      }
    }
    that.setData({
      orders: orders,
      showModalStatus: true,//显示遮罩
    })
  },
  /*隐藏弹窗*/
  hideModal: function (data) {
    var that = this;
    that.setData({
      showModalStatus: false,//隐藏遮罩       
    })
  },
  //选择原因
  chooseReson: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.idx;
    that.setData({
      resonId: id + 1
    })
  },
  /*弹窗确认按钮事件*/
  modalOk: function () {
    var that = this;
    if (that.data.resonId == '') {
      app.toast.warn("请选择原因", 1000);
      return false;
    }
    that.setData({
      showModalStatus: false,//隐藏遮罩       
    })
    var orders = that.data.orders;
    api.order_close(orders.id, '', function success(res) {
      if (res.errcode == 0) {
        that.getData();
        app.toast.success('操作成功', 1500);
        app.globalData.member=res.result;
        console.log(res.result)
        console.log(app.globalData.member)
        if (orders.type == 3) {
          that.deletesponsor(orders.mid);
        }
      } else {
        app.toast.error('操作失败', 1500);
      }
    },
      function fail(res) {
        app.toast.error('操作失败', 1500);
      }
    )
  },

  //取消开团订单
  deletesponsor: function (id) {
    api.deletesponsor(id, '', function success(res) {
      console.log('取消开团成功');
      that.getData();
    }, function fail(res) {
    })
  },
  /*跳转订单详情页*/
  goOrderDetail: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var safeguard = e.currentTarget.dataset.type;
    console.log(safeguard);
    if (safeguard == 1) {
      wx.redirectTo({
        url: '/pages/mall/refundDetail/refundDetail?id=' + id,
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/mall/orderDetail/orderDetail?id=' + id,
      })
    }
  },
  /**
   * 打开快递物流页面
   */
  openExpressage: function (e) {
    var that = this;
    var code = e.currentTarget.dataset.code;
    var number = e.currentTarget.dataset.number;
    wx.navigateTo({
      url: '/pages/mall/expressage/expressage?code=' + code + '&number=' + number,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    var that = this;
    var isPayPattern = app.globalData.isPayPattern
    var tab = options.id;
    var pay = wx.getStorageSync('pay');
    if (pay==null){
      pay = app.globalData.pay;
      console.log(pay)
    }
    that.setData({
      currentNavtab: tab,
      isPayPattern: app.globalData.isPayPattern,
      maninfo: app.globalData.maninfo,
      appid: app.globalData.appid,
      member: app.globalData.member,
      pay: pay
    })
    if (isPayPattern == 1) {
      wx.setNavigationBarTitle({
        title: '我的订单'
      })
      that.getData();
    } else {
      wx.setNavigationBarTitle({
        title: '我的预约'
      })
      that.subscribelist();
    }
  },
  //切换tab刷新数据
  switchTab: function (o) {
    var that = this;
    var idx = o.currentTarget.dataset.idx;
    if (idx != that.data.currentNavtab) {
      that.setData({
        currentNavtab: idx,
        list: [], //数据源清空
        number: 1,
      })
      //刷新数据
      that.getData();
    }
  },
  //更新member
  updateMember: function () {
    var that = this;
    var id = that.data.member.id;
    app.api_util.updateMembers({ id: id }, '', function succes(res) {
      if (res.errcode == 0) {
        app.globalData.member = res.result;
      }
    }, function fail(res) {

    })
  },
  /*获取订单信息*/
  getData: function (msg) {
    var that = this;
    var number = that.data.number;
    var size = that.data.size;
    var status = that.data.status;
    var ordertype = that.data.currentNavtab;
    var orderParem = that.data.orderParem,
      orderParem = {
        size: size,
        number: number,
        memberId: that.data.member.id
      }
    if (ordertype == 1) {
      orderParem.status = 1;
      orderParem.trueStatus = 0;
    } else if (ordertype == 2) {
      orderParem.status = 2;
      orderParem.trueStatus = 0;
    } else if (ordertype == 3) {
      orderParem.status = 3;
      orderParem.trueStatus = 0;
    } else if (ordertype == 6) {
      orderParem.status = 6;
      orderParem.trueStatus = 0;
    } else if (ordertype == 5) {
      orderParem.falseStatus = 1;
    }
    api.order_list(orderParem, "加载中", function sussess(res) {
      var contentlistTem = that.data.list;
      if (res.errcode == 0) {
        if (that.data.number == 1) {
          contentlistTem = []
        }
        var list = res.result.content;
        if (list.length < that.data.size) {
          that.setData({
            list: contentlistTem.concat(list),
            hasMoreData: false,
          })
        } else {
          that.setData({
            list: contentlistTem.concat(list),
            hasMoreData: true,
            number: that.data.number + 1,
          })
        }
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          var item = list[i];  //状态
          item.allNum = 0;
          var p = list[i].orderProducts;
          for (var n = 0; n < p.length; n++) {
            p[n].product.img = p[n].product.imageIds.split(',')[0];
            item.allNum += p[n].number;
          }
          if (item.type == 1) {
            item.ordertype = "默认订单"
          } else if (item.type == 2) {
            item.ordertype = "秒杀订单"
          } else if (item.type == 3) {
            item.ordertype = "拼团订单"
          }
          if (item.safeguardStatus == 0) {
            that.setData({
              safeguardStatus: 0
            })
            if (item.status == 1) {

              item.order_des = "等待付款";

            } else if (item.status == 2) {

              item.order_des = "等待发货";

            } else if (item.status == 3) {

              item.order_des = "已完成";

            } else if (item.status == 6) {

              item.order_des = "已发货";

            }
          } else if (item.safeguardStatus == 1) {
            that.setData({
              safeguardStatus: 1
            })

            item.order_des = "退款中";

          }
          else if (item.safeguardStatus == 2) {
            that.setData({
              safeguardStatus: 2,

            })
            item.order_des = "已退款";
          }
        }
        that.setData({
          list: list
        })
      }

    },
      function fail(res) {

      })
  },

  //插入积分
  insertintegral: function (orderId, integLabel) {
    var that = this;
    var memberId = app.globalData.member.id;
    var appid = app.globalData.appid;
    var integralConvert = app.globalData.maninfo.integralConvert;
    var integral = integLabel * integralConvert;
    console.log(integralConvert)
    var data = {
      'memberId': memberId,
      'appid': appid,
      'orderId': orderId,
      'integral': integral,
      'type': 1,
      'way': 1,
      'source': 2
    }
    api.insertintegrallog(data, '', function success(res) {
      if (res.errcode == 0) {
        that.updateMember();
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    }
    )
  },

  /*去支付*/
  goPay: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var openId = app.globalData.openid;
    var type = e.currentTarget.dataset.type;
    var pay = that.data.pay;
    console.log(pay)
    wx.showLoading({
      title: '结算中',
    })
    api.wechat_pay(pay,'商品支付', id, openId, type);
  },
  /*确认收货*/
  comfirmOrder: function (e) {
    var that = this;
    var oid = e.currentTarget.id;
    var sum = (e.currentTarget.dataset.sum) / 100;
    console.log(sum)
    wx.showModal({
      title: '确认收货',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          api.order_receipt(oid, '', function success(res) {
            if (res.errcode == 0) {
              that.insertintegral(oid, sum);
              setTimeout(() => {
                wx.redirectTo({
                  url: '../mineOrder/orderItems?id=' + 3
                })
              }, 1000)
            }

          }, function fail(res) {
            app.toast.warn("网络异常", 1000);
          }
          )
        }
      }
    })
  },
  /*评价*/
  evluateOrder: function (e) {
    var that = this;
    var pid = e.currentTarget.id;
    var oid = e.currentTarget.dataset.id;
    var orderInfo = that.data.list;
    var orderProductsArr = [];
    for (var i = 0; i < orderInfo.length; i++) {
      var items = orderInfo[i]//状态
      if (items.id == oid) {
        for (var o = 0; o < items.orderProducts.length; o++) {
          orderProductsArr.push(items.orderProducts[o]);
        }
      }
    }
    var procucts = {
      id: pid,
      orderId: oid,
      orderProductsArr: orderProductsArr
    }
    wx.setStorage({
      key: "procuctInfo",
      data: procucts
    })
    wx.redirectTo({
      url: '/pages/mall/evaluate/evaluate?id=' + pid,
    })
  },
  /*退款*/
  refundOrder: function (e) {
    var that = this;
    var oid = e.currentTarget.dataset.id;
    var orderInfo = that.data.list;
    var totalPrices = 0;
    var productId = [];
    for (var i = 0; i < orderInfo.length; i++) {
      var items = orderInfo[i]  //状态
      if (items.id == oid) {
        totalPrices = items.totalPrices;
        for (var o = 0; o < items.orderProducts.length; o++) {
          productId.push(items.orderProducts[o].productId)
        }
      }
    }
    var refunds = {
      id: oid,
      money: totalPrices,
      productId: productId.toString()
    }
    wx.setStorage({
      key: "refundOrder",
      data: refunds
    })
    wx.redirectTo({
      url: '/pages/mall/refund/orderRefund',
    })
  },

  //预约列表
  subscribelist: function () {
    var that = this;
    var memberId = app.globalData.member.id;
    api.subscribelist({ memberId: app.globalData.member.id }, '', function success(res) {
      if (res.errcode == 0) {
        var list = res.result;
        if (res.result.length == 0 && res.result == '') {
          that.setData({
            subscribelist: [],
          })
        }
        else {
          that.setData({
            subscribelist: res.result,
          })
        }
        var list = that.data.subscribelist;
        for (var i = 0; i < list.length; i++) {
          var product = list[i].product;
          var s = product.imageIds.split(",");
          product.imageIds = s[0];
        }
        that.setData({
          subscribelist: list,
        })
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    })
  },

  //取消预约
  cancelSub: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消预约',
      content: '是否取消预约？',
      success: function (res) {
        if (res.confirm) {
          api.updatesubscribe(id, '', function success(res) {
            if (res.errcode == 0) {
              that.subscribelist();
            }

          }, function fail(res) {
            app.toast.warn("网络异常", 1000);
          }
          )
        }
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
    this.data.number = 1
    this.getData('正在刷新数据')
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1500)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getData('加载更多数据');
    } else {
      app.toast.warn("没有更多数据", 1000);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})