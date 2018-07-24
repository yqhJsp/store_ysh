// pages/marketing/myCampaign/myCampaign.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    brokerage: {},
    select: 0,
    size: 10,
    number: 1,
    brokeList: [],
    loglist: [],
    statusDes: '',
    name: '',
    typeDes: '',
    headUrl: '',
    member: {},
    sum: 0,//总的提现额
    distrib: '', //审核状态
    maninfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的分销',
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    var that = this;
    var member = app.globalData.member;
    var distributorSumMonery = member.distributorSumMonery;
    var distributorOutMonery = member.distributorOutMonery;
    var sum = (distributorSumMonery / 100) - (distributorOutMonery / 100)
    that.setData({
      member: member,
      sum: sum,
      maninfo: app.globalData.maninfo
    })
    that.getdistributoraudit();
    that.getBrokeraloglist();
  },
  //获取审核状态
  getdistributoraudit: function () {
    var that = this;
    var member = app.globalData.member;
    api.getdistributoraudit({ memberId: member.id }, '', function success(res) {
      if (res.errcode == 0) {
        if (res.result == undefined) {
          that.setData({
            distrib: ''
          })
        }
        that.setData({
          distrib: res.result
        })
        console.log(that.data.distrib +"distrib")
      }
    }, function fail(res) {

    });
  },
  //分销申请
  getDistribution: function () {
    var that = this;
    var distrib = that.data.distrib;
    console.log(distrib);
    if (distrib != undefined) {
      app.toast.error('您已提交审核', 1500);
      return false
    }
    wx.navigateTo({
      url: '/pages/marketing/distribution/distribution',
    })
  },

  //去提现
  goDeposit: function () {
    wx.navigateTo({
      url: '/pages/marketing/deposit/deposit',
    })
  },

  //切换列表
  changeArea: function (data) {
    var that = this;
    var area = data.currentTarget.dataset.area;
    if (area == 0) {
      that.setData({
        select: area
      });
      that.getBrokeraloglist();
    }
    else if (area == 1) {
      that.setData({
        select: area
      });
      that.getBrokeraGeapplylist();

    }
  },
  //获取提现数据
  getBrokeraGeapplylist: function () {
    var that = this;
    var size = that.data.size;
    var number = that.data.number;
    var member = app.globalData.member;
    api.brokerageapplylist({ size: size, number: number }, "", function success(res) {
      if (res.errcode == 0) {
        if (res.result.content.length != 0 && res.result.content != '') {
          that.setData({
            brokeList: res.result.content,
          })
          var list = that.data.brokeList;
          for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.status == 0) {
              that.setData({
                statusDes: '待审核',
              })
            }
            else if (item.status == 1) {
              that.setData({
                statusDes: '审核中',
              })
            }
            else if (item.status == 2) {
              that.setData({
                statusDes: '成功',
              })
            }
            else if (item.status == 3) {
              that.setData({
                statusDes: '撤回',
              })
            }
            else if (item.status == 4) {
              that.setData({
                statusDes: '提款失败',
              })
            }
          }
        }
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
    })
  },

  //获取收益列表
  getBrokeraloglist: function () {
    var that = this;
    var size = that.data.size;
    var number = that.data.number;
    api.brokerageloglist({ size: size, number: number }, "", function success(res) {
      if (res.errcode == 0) {
        if (res.result.content.length != 0 && res.result.content != '') {
          that.setData({
            loglist: res.result.content,
          })
          var list = that.data.loglist;
          if (list.length != 0) {
            for (var i = 0; i < list.lenght; i++) {
              var type = list[i].type;
              if (type == 1) {
                that.setData({
                  typeDes: '收益'
                })
              }
              else if (type == 2) {
                that.setData({
                  typeDes: '提现'
                })
              }
              else if (type == 3) {
                that.setData({
                  typeDes: '提现退款'
                })
              }
            }
          }
        }
      }
    }, function fail(res) {
      app.toast.warn("网络异常", 1000);
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
    // that.getdistributoraudit();
    // that.getBrokeraloglist();
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