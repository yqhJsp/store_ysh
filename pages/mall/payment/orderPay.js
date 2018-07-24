// pages/mall/payment/orderPay.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    products: [],
    orderSum: 0,
    freight: 0,
    total: 0,
    piece: 0,
    address: {},
    isAddress: 1,
    notes: '',
    animationData: {},//选择动画
    showModalStatus: false,//显示遮罩 
    isCoupon: 0,//隐藏优惠卷弹窗  
    pageNo: 1,
    size: 20,
    status: '',
    maninfo: {},
    isDefault: 0,
    couponDes: '选择优惠券',
    limit: 0,
    facevalue: 0,
    member: {},
    couponList: [],
    isCouponStatus: 2,
    couponId: '',
    reCouponId: '',
    stype: 1,//商城类型 1、普通；2、秒杀；3、拼团
    skArr: {},//秒杀信息、拼团信息
    sponsor: '',//开团信息
    allSum: 0,
    tag: false,
    //积分
    integSum: 0,//剩余的总积分
    integralKy: 0,
    integLabel: 0,//抵扣的积分
    integral:0,//消耗的总积分
    myBalance:0,//支付的余额
    myBalanceSum:0,//总余额
  },
  openAddress: function () {
    wx.navigateTo({
      url: '../address/address'
    })
  },

  getAddress: function () {
    var that = this;
    var address=app.globalData.address;
    console.log(address)
    if (address!=null){
      that.setData({
        address: address,
        isAddress: 0
      })
    }
  },
  /**
   * 渲染面板
   */
  renderProduct: function () {
    var that = this;
    var freight = 0;
    var orderSum = 0;
    var allSum = 0;
    var piece = 0;
    var products = that.data.products;
    var integral=0;
    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      piece += p.goodNum;
      p.imageIds = p.imageIds.split(',')[0];
      if (p.isPackage == 0) {
        if (freight < p.postage){
          freight = p.postage;
        }
      }
      //普通版
      if (that.data.stype == 1) {
        orderSum += (p.goodNum * p.selectRule.price);
        integral += (p.goodNum * p.selectRule.integral);
        if (p.isPackage ==0){
          p.sum = (p.goodNum * p.selectRule.price) / 100 + (p.postage) / 100; 
        }else{
          p.sum = (p.goodNum * p.selectRule.price) / 100;
        }
      }
      //秒杀
      else if (that.data.stype == 2) {
        orderSum += (p.goodNum * p.selectRule.price);
      }
      else if (that.data.stype == 3) {
        orderSum += (p.goodNum * p.selectRule.price);
      }
    
    }
    var total = orderSum + freight - that.data.facevalue;
    if (total < 0) {
      total = 0;
    }
    console.log(products)
    that.setData({
      freight: freight,
      orderSum: orderSum,
      total: total,
      piece: piece,
      allSum: orderSum + freight,
      integral: integral,
      products: products
    })
  },

  goodRefund: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var products = that.data.products;
    for (var i = 0; i < products.length; i++) {
      if (id == products[i].id) {
        if (products[i].goodNum == 1) {
          return;
        }
        products[i].goodNum = products[i].goodNum - 1;
        break;
      }
    }
    app.globalData.saveOrder = products;
    that.setData({
      products: products
    })
    that.renderProduct();
  },
  goodAdd: function (e) {
    console.log(e)
    var that = this;
    var id = e.currentTarget.dataset.id;
    var products = that.data.products;
    var limitation = e.currentTarget.dataset.num;
    for (var i = 0; i < products.length; i++) {
      if (id == products[i].id) {
        if (limitation != 0) {
          if (limitation <= products[i].goodNum) {
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
            return false;
          }
          else {
            products[i].goodNum = products[i].goodNum + 1
          }
        }
      }
    }
    app.globalData.saveOrder = products;
    that.setData({
      products: products
    })
    that.renderProduct();
  },
  notesInput: function (e) {
    this.setData({
      notes: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '订单支付'
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    var member = app.globalData.member;
    var intelsum =member.integralSum -member.integralOut;
    var myBalanceSum = (member.distributorSumMonery - member.distributorOutMonery)/100;
    var products = app.globalData.saveOrder;
    that.setData({
      maninfo: app.globalData.maninfo,
      member: member,
      integSum: intelsum,
      products: products,
      myBalanceSum: myBalanceSum
    });
    var stype = options.stype;
    if (stype != undefined) {
      stype = options.stype;
    } else {
      stype = 1
    }
    that.setData({
      stype: stype
    })
    if (stype == 1) {
      that.getData();
    }
    //秒杀活动
    wx.getStorage({
      key: 'skArr',
      success: function (res) {
        that.setData({
          skArr: res.data
        });
      }
    })
    //开团的信息
    wx.getStorage({
      key: 'sponresult',
      success: function (res) {
        that.setData({
          sponsor: res.data
        })
      }
    })
    //秒杀活动
    that.setData({
      products: app.globalData.saveOrder
    })
    that.renderProduct();
  },
  //优惠卷
  getCoupon: function (data) {
    var that = this;
    if (that.data.member.isRole == 1) {
      that.setData({
        showModalStatus: true,//显示遮罩       
        isCoupon: 1,
      })
    } else {
      app.toast.warn('非会员不可用', 1500);
    }
  },

  /**隐藏选择花色区块 */
  hideModal: function (data) {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isCoupon: 0
    })
  },
  /*获取优惠卷信息*/
  getData: function () {
    var that = this;
    var member = app.globalData.member;
    var data = {
      'memberId': member.id,
      'status': 1
    }
    api.getusercouponlist(data, "加载中..", function sussess(res) {
      if (res.errcode == 0) {
        if (res.result.length == 0 && res.result == '') {
          that.setData({
            hidden: true
          })
        } else {
          that.setData({
            hidden: false,
            list: res.result
          })
          var list = that.data.list;
          for (var i = 0; i < list.length; i++) {
            var item = list[i]  //状态
            item.coupon.isDefault = 0;
            if (item.status == 1) {
              that.setData({
                des: "立即使用",
              })
            } else if (item.status == 2) {
              that.setData({
                des: "已使用",
              })
            } else if (item.status == 3) {
              that.setData({
                des: "已过期",
              })
            }
          }
          that.setData({
            hidden: false,
            couponList: list
          })
          console.log(that.data.couponList);
        }
      }

    },
      function fail(res) {

      })
  },
  //优惠券主要处理逻辑
  couponDetail: function (e) {
    var status = false;
    var that = this;
    var selected = e.target.dataset.select;
    var id = e.target.dataset.id;
    var cid = e.target.dataset.cid;
    var scope = e.currentTarget.dataset.scope;
    var facevalue = e.currentTarget.dataset.facevalue;
    var name = e.currentTarget.dataset.name;
    var limit = e.currentTarget.dataset.limit;
    var sum = that.data.orderSum + that.data.freight;
    var clist = that.data.couponList;
    for (var i = 0; i < clist.length; i++) {
      var c = clist[i];
      if (c.id == id) {
        if (selected == clist[i].coupon.isDefault && selected == 1) {
          clist[i].coupon.isDefault = 0;
        } else {
          clist[i].coupon.isDefault = 1;
          status = true;
        }
      } else {
        c.coupon.isDefault = 0;
      }
    }
    //选中情况下
    if (status) {
      var total = sum - facevalue;
      if (total < 0) {
        total = 0;
      }
      that.setData({
        couponId: cid,
        couponDes: name,
        facevalue: facevalue,
        total: total,
        couponList: clist,
        isCouponStatus: 1,
        reCouponId: id
      })
      // app.toast.success('已抵扣', 1500);

    } else {
      var total = sum;
      that.setData({
        couponId: 0,
        couponDes: '选择优惠券',
        facevalue: 0,
        total: total,
        couponList: clist,
        isCouponStatus: 2,
        reCouponId: 0
      })
      // app.toast.success('已取消', 1500);
    }
  },
  //优惠券点击事件：复选框
  checkedChange: function (e) {
    var that = this;
    var scope = e.currentTarget.dataset.scope;
    var sum = that.data.orderSum + that.data.freight;
    var limit = e.currentTarget.dataset.limit;
    if (scope == 2) {
      if (sum >= limit) {
        that.couponDetail(e);
      } else {
        app.toast.warn('不可用', 1500);
      }
    }
    else {
      that.couponDetail(e);
    }
  },

  //取消使用优惠卷
  cancelCoupon: function () {
    var that = this;
    var sum = that.data.orderSum + that.data.freight;
    var clist = that.data.couponList;
    var total = sum;
    that.setData({
      couponId: 0,
      couponDes: '选择优惠卷',
      facevalue: 0,
      total: total,
      couponList: clist,
      isCouponStatus: 2,
      reCouponId: 0
    })
  },
  //获取积分
  integLabel: function (e) {
    var that = this;
    var value = Number(e.detail.value);
    var nj = that.data.member.integralSum - that.data.member.integralOut;
    var facevalue = that.data.facevalue;
    var sum = (that.data.orderSum + that.data.freight) - facevalue;
    if (value > nj) {
      app.toast.warn("积分余额不足", 1000);
      return 0;
    }
    if (value != 0) {
      var money = (value / Number(that.data.maninfo.integralDeDuction)) * 100;
      var total = (sum - money);
      if (total < 0) {
        total = 0
      }
      console.log(total)
      that.setData({
        integLabel: money,
        integSum: nj - value,
        total: total,
        integralKy: value
      })
    } else {
      var total = sum;
      that.setData({
        integLabel: 0,
        integSum: nj,
        total: total,
        integralKy: 0
      })
    }
  },
  //获取余额
  balanceInput: function (e) {
    var that = this;
    var value = e.detail.value;
    var balanceSum = (that.data.member.distributorSumMonery - that.data.member.distributorOutMonery)/100;
    var facevalue = that.data.facevalue;
    var sum = (that.data.orderSum + that.data.freight) - facevalue;
    if (value > balanceSum) {
      app.toast.warn("余额不足", 1000);
      return 0;
    }
    if (value != 0) {
      var total = (sum - value*100);
      if (total < 0) {
        total = 0
      }
      console.log(total)
      that.setData({
        myBalanceSum: (balanceSum -value).toFixed(2) ,
        total: total,
        myBalance: value
      })
      console.log(value)
      console.log(total)
    } else {
      var total = sum;
      that.setData({
        myBalanceSum:balanceSum,
        total: total,
        myBalance: 0
      })
    }
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
    this.getAddress();
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
      title: that.data.maninfo.name,
      path: '',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  //立即购买
  toBuy: function (e) {
    var that = this;
    var products = that.data.products;
    var stype = that.data.stype;
    var sumPrice = 0;
    var onePrice = 0;
    var member = app.globalData.member;
    var myBalance = (that.data.myBalance)*100;
    var integral = that.data.integral;
    var integSum = that.data.member.integralSum - that.data.member.integralOut;
    if (that.data.isAddress == 1) {
      app.toast.warn('请选择地址', 1500);
      return false;
    }
    if (integSum-integral<0) {
      app.toast.warn('您的积分不足', 1500);
      return false;
    }
    var facevalue = 0;
    //isPromotion
    var orderProducts = [];
    for (var i = 0; i < products.length; i++) {
      var pp = products[i];
      console.log(pp.selectRule.isPromotion)
      if (stype == 1) {
        sumPrice = (pp.goodNum * pp.selectRule.price);
        onePrice = pp.selectRule.price;
      } else if (stype == 2 || stype == 3) {
        sumPrice = (pp.goodNum * that.data.skArr.skProduct.price);
        onePrice = that.data.skArr.skProduct.price;
      }
      var orders = {
        "memberId": member.id,
        "productId": pp.id,
        "number": pp.goodNum,
        "sumPrice": sumPrice,
        "productRuleId": pp.selectRule.id,
        "onePrice": onePrice,
        isPromotion: pp.selectRule.isPromotion
      }
      orderProducts.push(orders);
    }

    var data = {
      "memberId": member.id,
      "totalPrices": Number(that.data.total),
      "trolleyStatus": 0,
      "notes": that.data.notes,
      "addressId": that.data.address.id,
      "orderProducts": orderProducts,
      "isCoupon": 0,
      "createUserId": app.globalData.createUserId,
      "myBalance": myBalance,
      "integral": integral
    };
    data.couponValue = 0;
    if (that.data.maninfo.type == 1006) {
      data.couponId = Number(that.data.couponId);
      data.couponValue = that.data.facevalue;
    }
    wx.showLoading({
      title: '结算中',
    })

    if (stype == 1) {
      that.comPay(data)
    }
    else if (stype == 2) {
      that.skecPay(data)
    }
    else if (stype == 3) {
      that.sponPay(data)
    }
  },
  //更新member
  updateMember: function () {
    var that = this;
    var id = app.globalData.member.id;
    app.api_util.updateMembers({ id: id }, '', function succes(res) {
      if (res.errcode == 0) {
        app.globalData.member = res.result;
      }
    }, function fail(res) {

    })
  },
  //普通版
  comPay: function (data) {
    var that = this;
    var openId = app.globalData.openid;
    api.order_insert(data, "", function success(res) {
      if (res.errcode == 0) {
        var order= res.result.order;
        var pay = res.result.pay;
        app.globalData.pay=pay;
        wx.setStorageSync('pay',pay);
        console.log(app.globalData.pay)
        app.globalData.member = order.member;
        if (order.totalPrices != 0) {
          api.wechat_pay(pay, '商品支付', order.id, openId, 1);
        } else {
          api.order_pendingshipment(order.id, '正在提交中', function success(res) {
            if (res.errcode == 0) {
              wx.redirectTo({
                url: '/pages/mall/paySuccess/success?id=' + order.id
              })
            } else {
              wx.redirectTo({
                url: '/pages/mall/waitPay/fail?id=' + order.id
              })
            }

          }, function fail(res) {

          });
        }
      }
      else if (res.errcode == 2) {
        app.toast.error('库存不足', 1500);
      } else if (res.errcode == 3) {
        app.toast.error('积分不足', 1500);
      } else if (res.errcode == 4) {
        app.toast.error('提成金额不足', 1500);
      } else if (res.errcode == 5){
        app.toast.error('价格异常', 1500);
      }
    }, function fail(res) {
      wx.hideLoading();
      app.toast.error('结算失败', 1500);
    });
  },
  //秒杀下单
  skecPay: function (data) {
    var that = this;
    var id = that.data.skArr.skProduct.id;
    var openId = app.globalData.openid;
    api.insertseckill(id, data, "", function success(res) {
      if (res.errcode == 0) {
        console.log(res.result)
        var outTradeNo = res.result.id;
        api.wechat_pay('商品支付', res.result.id, res.result.totalPrices, openId, 2);

      } else if (res.errcode == 2) {
        app.toast.error('库存不足', 1500);
      } else if (res.errcode == 3) {
        app.toast.error('积分不足', 1500);
      } else if (res.errcode == 4) {
        app.toast.error('提成金额不足', 1500);
      } else if (res.errcode == 5) {
        app.toast.error('价格异常', 1500);
      }
    }, function fail(res) {
      console.log('order_insert error')
      wx.hideLoading();
      app.toast.error('结算失败', 1500);
    });
  },
  //团付
  sponPay: function (data) {
    var that = this;
    var id = that.data.sponsor.id;
    var openId = app.globalData.openid;
    console.log(id + "kklll")
    if (that.data.sponsor == '') {
      var memberId = app.globalData.member.id;
      var activityId = that.data.skArr.activityId;
      var reGroupId = that.data.skArr.skProduct.id;
      var createUserId = app.globalData.createUserId;
      var appid = app.globalData.appid;
      var sponData = {
        'memberId': memberId,
        'activityId': activityId,
        'reGroupId': reGroupId,
        'createUserId': createUserId,
        'appid': appid
      }
      api.insertsponsor(sponData, '', function success(res) {
        if (res.errcode == 0) {
          that.insertgroup(res.result.id, data, openId);
        }
      }, function fail(res) {
        app.toast.warn("网络异常", 1500);
      })
    } else {
      that.insertgroup(id, data, openId)
    }

  },

  //拼团支付 todo
  insertgroup: function (sponid, data, openId) {
    var that = this;
    api.insertgroup(sponid, data, "", function success(res) {
      if (res.errcode == 0) {
        if (res.result != '') {
          var outTradeNo = res.result.result.id;
          console.log(res.result)
          api.wechat_pay('商品支付', outTradeNo, res.result.result.totalPrices, openId, 3);
          wx.setStorage({
            key: 'grouporder',
            data: res.result,
          })
          // that.insertgrouporder(outTradeNo, sponid);
        }
      } else if (res.errcode == 2) {
        app.toast.warn("该团已满人", 1500);
      }
    }, function fail(res) {
      console.log('order_insert error')
      wx.hideLoading();
      app.toast.error('结算失败', 1500);
    });
  },
  //会员中心
  goMember: function () {
    wx.redirectTo({
      url: '/pages/user/storeRegister/storeRegister',
    })
  }
})