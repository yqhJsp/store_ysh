// pages/mall/detail/mall_detail.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    isHidden: 0,
    animationData: {},//选择动画
    showModalStatus: false,//显示遮罩
    goodNum: 1,//商品数量
    select: 0,//商品详情、参数切换,
    product: {},
    swiper: [],
    article: '',
    selectRule: {},
    evaluates: [],
    level: 5,
    isPayPattern: 0,//1.购物车 2.收藏
    kfMobile: '',
    isCoupon: 0,//隐藏优惠卷弹窗
    list: [],
    member: {},
    des: '立即领取',
    maninfo: {},
    stype: 1,//类型
    skList: {},//秒杀的数据
    skid: 0,
    skProduct: {},//秒杀的商品信息
    sponList: [],//拼团信息
    dots: false,//swiper指示点
    sponsor: '',//是否开团
    iTime: '',
    id: '',
    dtype: 0,//用于判断是秒杀还是普通版
    isStart: 0, //活动是否开始 1、开始 2、预告,
    isLoad: true,
    scrollTop: 0,//滚动的高度
  },
  /**
   * 保存订单
   */
  saveOrder: function (e) {
    var that = this;
    var product = {};
    var selectRule = that.data.selectRule;
    var stype = that.data.stype;
    var num = e.currentTarget.dataset.num;
    if (num == 0) {
      app.toast.warn("已售完", 1500);
      that.hideModal();
      return false;
    }
    //普通版
    product = that.data.product;
    if (selectRule.isPromotion == 1) {
      selectRule.price = selectRule.formerPrice;
    }
    //秒杀版
    if (stype != 1) {
      product = that.data.skProduct.product;
      if (that.data.dtype == 1) {
        selectRule.price = that.data.skProduct.price;
      } else {
        selectRule.price = that.data.skProduct.productRule.price;
      }
      var skArr = {
        'skProduct': that.data.skProduct,
      }
      wx.setStorage({
        key: "skArr",
        data: skArr
      })
    }
    product.selectRule = selectRule;
    product.goodNum = that.data.goodNum;
    var products = [];
    products.push(product);
    app.globalData.saveOrder = products;
    wx.navigateTo({
      url: '../payment/orderPay?stype=' + stype
    })
    that.hideModal();
    console.log("保存数据");
    console.log(products)
  },
  /**
   * 保存购物车
   */
  saveCart: function () {
    var that = this;
    wx.getStorage({
      key: 'member',
      success: function (res) {
        var member = res.data;
        var data = {
          "memberId": member.id,
          "productId": that.data.product.id,
          "productRuleId": that.data.selectRule.id,
          "number": that.data.goodNum,
          "createUserId": app.globalData.createUserId,
          "type": that.data.isPayPattern
        }
        api.trolley_insert(data, "正在操作", function success(res) {
          that.hideModal();
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })

        }, function fail(res) {

        });
      }
    })
  },
  addCart: function (options) {
    this.saveCart();

  },
  //分销界面
  getMyCampaign: function () {
    wx.navigateTo({
      url: '/pages/marketing/myCampaign/myCampaign',
    })
  },
  //联系客服
  call: function () {
    var that = this;
    var phone = that.data.kfMobile;
    wx.makePhoneCall({
      phoneNumber: phone
    }, function sussess(res) {

    }, function fail(res) {

    })
  },
  //立即预约
  subscribe: function (e) {
    var that = this;
    var productId = e.currentTarget.dataset.id;
    var inType = 1;
    wx.navigateTo({
      url: '../consulting/consulting?id=' + productId + '&inType=' + inType
    })
  },
  /*获取当前页带参数的url*/
  getCurrentPageUrlWithArgs: function () {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options
    //拼接url的参数
    var urlWithArgs = url + '?'
    for (var key in options) {
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '商品详情'
    })
    var that = this;
    var id = options.id;
    that.setData({
      id: id
    })
    var stype = options.stype;
    console.log(stype + "stype")
    var isStart = options.isStart;
    if (stype != undefined) {
      stype = options.stype;
    } else {
      stype = 1
    }
    console.log(stype + "分享")
    if (isStart != undefined) {
      that.setData({
        isStart: isStart
      })
    }
    var maninfo = app.globalData.maninfo;
    that.setData({
      maninfo: maninfo,
      member: app.globalData.member
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    wx.getStorage({
      key: 'sklist',
      success: function (res) {
        var data = res.data;
        that.setData({
          skList: data
        })
      }
    })
    that.setData({
      stype: stype,
      isPayPattern: app.globalData.isPayPattern,
      kfMobile: app.globalData.kfMobile,
      pid: id
    })
    that.getProducts(id);
    that.getSklist(id);
    clearTimeout(that.data.iTime);
  },
  //营销秒杀活动
  getSklist: function (id) {
    var that = this;
    var product = {};
    wx.getStorage({
      key: 'sklist',
      success: function (res) {
        var data = res.data;
        var products = data.products;
        if (products.length > 0) {
          for (var i = 0; i < products.length; i++) {
            if (id == products[i].productId) {
              product = products[i];
            }
          }
          that.setData({
            skList: data,
            skProduct: product,
            selectRule: product.productRule
          })

          if (that.data.maninfo.type == 1006 && that.data.stype == 3) {
            that.getsponsor();
            that.sponsorlist();
          }
        }
        that.countTime();
      }

    })
  },
  //秒杀立即购买  
  goviewSkec: function (e) {
    var that = this;
    if (that.data.isStart == 1) {
      var dtype = e.currentTarget.dataset.type;
      that.setData({
        dtype: dtype
      })
      that.viewFlowerArea();
      clearTimeout(that.data.iTime);
    }
  },
  //单独购买
  goviewzc: function (e) {
    var that = this;
    var dtype = e.currentTarget.dataset.type;
    that.setData({
      dtype: dtype,
      stype: 3
    })
    that.viewFlowerArea();
  },
  countTime: function () {
    var that = this;
    var res = that.data.skList;
    var date = new Date();
    var now = date.getTime();
    //设置截止时间  
    var endDate = new Date(res.endTime);
    var end = endDate.getTime();
    //时间差  
    var times = (end - now) / 1000;
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0;//时间默认值
    if (times >= 0) {
      res.start = true;
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - (day * 24);
      minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      res.d = that.checkTime(day);
      res.h = that.checkTime(hour);
      res.m = that.checkTime(minute);
      res.s = that.checkTime(second);
    } else {
      res.start = false;
    }

    that.setData({
      skList: res
    })
    that.data.iTime = setTimeout(() => {
      that.countTime()
    }, 10)
  },
  checkTime: function (i) { //将0-9的数字前面加上0，例1变为01 
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  },
  //获取商品数据
  getProducts: function (id) {
    var that = this;
    api.getProductInfo(id, "", function success(res) {
      if (res.errcode == 0) {
        if (res.result.imageIds.length > 0) {
          var imageIds = res.result.imageIds.split(",");
          that.setData({
            swiper: imageIds
          })
        }
        var els = res.result.evaluates;
        for (var i = 0; i < els.length; i++) {
          //重声明评价的图片变量
          els[i].imags = els[i].imageIds.split(",");
          if (els[i].sellerMessage == '') {
            els[i].Message = 1;
          } else {
            els[i].Message = 0;
          }
        }
        console.log("详情")
        console.log(app.WxParse.wxParse('article', 'html', res.result.details, that, 0))
        that.setData({
          evaluates: els,
          product: res.result,
          article: app.WxParse.wxParse('article', 'html', res.result.details, that, 0),
          selectRule: res.result.rules[0],
          isLoad: false
        })
      } else {
        app.toast.warn("网络异常", 1000);
      }
    }, function fail(res) {

    });
  },
  //获取优惠卷列表
  getcouponList: function () {
    var that = this;
    var memerId = app.globalData.member.id;
    api.getcouponlist({ memberId: memerId }, '', function success(res) {
      if (res.errcode == 0) {
        that.setData({
          list: res.result
        })
        var list = that.data.list;
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var endTime = (item.endTime).split(' ');
          var startTime = (item.startTime).split(' ');
          item.end = endTime[0];
          item.start = startTime[0];
          if (item.inNumber == item.outNumber) {
            item.des = '已领完';
          } else {
            item.des = '待领取'
          }
        }
        that.setData({
          list: list
        })
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    })
  },

  //领取优惠卷
  insertcouponuser: function (e) {
    var that = this;
    var couponId = e.currentTarget.dataset.id;
    var inNumber = e.currentTarget.dataset.inNumber;
    var outNumber = e.currentTarget.dataset.outNumber;
    var memberId = that.data.member.id;
    var data = {
      'couponId': couponId,
      'memberId': memberId,
      'appid': app.globalData.appid
    }

    api.insertcouponuser(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("领取成功", 1500);
        setTimeout(function () {
          that.getcouponList();
        }, 1500);

      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1500);
    })
  },

  //查询拼团
  getsponsor: function () {
    var that = this;
    var memberId = app.globalData.member.id;
    var activityId = that.data.skList.id;
    var reGroupId = that.data.skProduct.id;
    var sponData = {
      'memberId': memberId,
      'activityId': activityId,
      'reGroupId': reGroupId,
      status: 1
    }
    api.getsponsor(sponData, '', function success(res) {
      that.setData({
        sponsor: res
      })
    }, function fail(res) {
      app.toast.warn("网络异常", 1500);
    })
  },

  //开团
  insertsponsor: function (e) {
    var that = this;
    console.log(that.data.isStart)
    if (that.data.isStart == 1) {
      var dtype = e.currentTarget.dataset.type;
      if (that.data.sponsor.errcode == 2) {
        that.setData({
          dtype: dtype
        })
        that.viewFlowerArea();
      }
      else {
        app.toast.warn("您已开团", 2000);
        if (that.data.sponsor.result) {
          app.toast.warn("您已开团,前往支付", 2000);
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/user/mineOrder/orderItems?id=' + 1
            })
          }, 1000)
        }
      }
    } else {
      app.toast.warn("活动还没开始", 1500);
    }
  },

  //一拼团的列表
  sponsorlist: function () {
    var that = this;
    var reGroupId = that.data.skProduct.id;
    api.sponsorlist({ id: reGroupId, status: 1 }, '', function success(res) {
      if (res.errcode == 0) {
        var sp = [];
        var spList = res.result;
        that.setData({
          sponList: spList
        })
        for (var i = 0; i < spList.length; i++) {
          var s = spList[i];
          sp.push(s);
        }
        var sks = [];
        var s = new Array;
        for (var n = 0; n < sp.length; n++) {
          s.push(sp[n]);
          if (s.length == 2) {
            sks.push(s);
            s = new Array;
          }
        }
        var k = sp.length % 2;
        console.log(k);
        if (k > 0) {
          for (var m = 1; m < k; m++) {
            s.push(sp[sp.length - m]);
          }
          sks.push(s);
        }
        console.log(sks);
        that.setData({
          sponList: sks
        })
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1500);
    })
  },

  //去参团
  grouporder: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var splist = that.data.sponList;
    var dtype = e.currentTarget.dataset.type;
    that.setData({
      dtype: dtype
    })
    for (var i = 0; i < splist.length; i++) {
      if (id == splist[i].id) {
        if (that.data.sponsor.errcode == 2) {
          that.viewFlowerArea();
          wx.setStorage({
            key: 'sponresult',
            data: splist[i]
          })
        }
        else {
          app.toast.warn("您已参团", 2000);
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.showShareMenu({
      withShareTicket: true
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
  onShareAppMessage: function (res) {
    var that = this;
    var stype = that.data.stype;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
    }
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res)
    }
    return {
      title: that.data.product.title,
      path: "/pages/store/index/index?pid=" + that.data.id,
      success: function (res) {
        var tickets = res.shareTickets[0];
        console.log(tickets);
        wx.getShareInfo(tickets, function success(res) {
          console.log(res)
        });
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },
  /**点击选择花色按钮显示页面 ***/
  viewFlowerArea: function () {
    var that = this;
    that.setData({
      showModalStatus: true,//显示遮罩
      isHidden: 1,
    })
  },
  getCoupon: function (data) {
    var that = this;
    that.setData({
      showModalStatus: true,//显示遮罩   
      isCoupon: 1,
    })
  },
  /**隐藏选择花色区块 */
  hideModal: function () {
    var that = this;
    that.setData({//把选中值，放入判断值中
      showModalStatus: false,//显示遮罩       
      isHidden: 0,
      isCoupon: 0
    })

  },
  goodAdd: function (data) {
    var that = this;
    var oldNum = that.data.goodNum;
    var rule = that.data.selectRule;
    var limitation = 0;
    //普通版
    if (that.data.stype == 1) {
      limitation = rule.limitation;
    }
    //秒杀版
    else if (that.data.stype == 2) {
      limitation = that.data.skProduct.limitation;
    }
    //开团
    else if (that.data.stype == 3) {
      limitation = that.data.skList.limitation;
    }
    if (limitation != 0) {
      if (limitation <= oldNum) {
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
    var that = this;
    var goodCount = that.data.goodNum + 1;
    that.setData({//商品数量+1
      goodNum: goodCount
    })
  },
  goodReduce: function (data) {
    var that = this;
    var goodCount = that.data.goodNum - 1;
    that.setData({//商品数量-1
      goodNum: goodCount
    })
  },
  /**商品详情、参数切换 */
  changeArea: function (data) {
    var that = this;
    var area = data.currentTarget.dataset.area;
    that.setData({ "select": area });
  },
  /**
   * 切换规则
   */
  chooseFlower: function (options) {
    var that = this;
    var id = options.currentTarget.id;
    var rules = that.data.product.rules;

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i]
      if (id == rule.id) {
        that.setData({ selectRule: rule });
        break;
      }

    }

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
  goTop: function (e) {
    this.setData({
      scrollTop: 0,
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  // 图片点击事件
  previewImage: function (e) {
    var that = this;
    var srcList = [];
    var nowImgUrl = e.currentTarget.dataset.src;
    var tagFrom = e.currentTarget.dataset.idx;
    console.log(nowImgUrl + "..." + tagFrom)
    wx.previewImage({
      current: [nowImgUrl], // 当前显示图片的http链接
      urls: [nowImgUrl] // 需要预览的图片http链接列表
    })
  },
  //评价图片预览
  preview: function (e) {
    var that = this;
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //数据源
    var evaluates = that.data.evaluates;
    var id = e.currentTarget.dataset.id;
    var pictures = [];
    for (var i = 0; i < evaluates.length; i++) {
      var item = evaluates[i];
      if (id == item.id) {
        var pic = item.imags;
        for (var n = 0; n < pic.length; n++) {
          var img = that.data.fileDomain + pic[n];
          pictures.push(img);
        }

        console.log(pictures)
      }
    }

    wx.previewImage({
      //当前显示下表
      current: pictures[index],
      //数据源
      urls: pictures
    })
  }
})
