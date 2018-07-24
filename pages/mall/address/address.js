// pages/mall/address/address.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    id: 0,
    multiIndex: [0, 0, 0],
    date: '2016-09-01',
    time: '12:01',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    address_s: [],
    isList: 0,
    consignee: '',
    phone: '',
    address: '',
    isDefault: 0,
    isEdit: 0,
    member: {},
    hidden: false
  },
  consigneeInput: function(e) {
    this.setData({
      consignee: e.detail.value
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  editAddress: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var address_s = that.data.address_s;
    for (var i = 0; i < address_s.length; i++) {
      var ad = address_s[i];
      if (id == ad.id) {
        if (ad.isDefault == 1) {
          that.setData({
            isDefault: ad.isDefault
          })
        }
        that.setData({
          consignee: ad.consignee,
          phone: ad.phone,
          address: ad.address,
          region: [ad.province, ad.city, ad.county],
          id: id,
          isList: 1,
          isEdit: 1,
          address: ad.address
        })
        break;
      }
    }
  },
  deleteAddress: function(e) {
    console.log(e);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '要删除该地址吗？',
      success: function(res) {
        if (res.confirm) {
          var id = e.currentTarget.dataset.id;
          console.log(id);
          app.api_util.addressDelete(id, '', function success(res) {
            console.log(res);
            if (res.errcode == 0) {
              app.toast.success('删除成功', 1500);
              that.getAddress();
            } else {
              app.toast.error('删除失败', 1500);
            }
          }, function fail(res) {
            app.toast.error('删除失败', 1500);
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  addressInput: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  checkedChange: function(e) {
    var selected = e.target.dataset.checks;
    if (selected == 0) {
      this.setData({
        isDefault: 1
      })
    } else {
      this.setData({
        isDefault: 0
      })
    }

  },
  /*默认地址点击事件*/
  radioChange: function(e) {
    var that = this;
    for (var i = 0; i < that.data.address_s.length; i++) {
      if (e.currentTarget.id == i) {
        that.data.address_s[i].isDefault = 1
      } else {
        that.data.address_s[i].isDefault = 0
      }
      that.setData(that.data)

    }
  },
  /**
   * 保存数据按钮
   */
  saveAddress: function() {
    var that = this;
    var region = that.data.region;
    var consignee = that.data.consignee;
    var phone = that.data.phone;
    var address = that.data.address;
    var isDefault = that.data.isDefault;
    if (consignee == '') {
      app.toast.error('请填写收货人！',
        2000
      )
      return false
    }

    if (phone.length != 11) {
      app.toast.error('请填写正确手机号码',
        2000
      )
      return false
    }
    if (address == '') {
      app.toast.error('请填写详细地址！',
        2000
      )
      return false
    }


    var member = that.data.member;
    var data = {
      "memberId": member.id,
      "consignee": consignee,
      "phone": phone,
      "province": region[0],
      "city": region[1],
      "county": region[2],
      "street": "",
      "address": address,
      "isDefault": isDefault,
      "createUserId": member.createUserId
    };
    if (that.data.id == 0) {
      app.api_util.addressInsert(data, "", function success(res) {
        if (res.errcode == 0) {
          wx.showToast({
            title: '新增地址成功',
            icon: 'success',
            duration: 2000
          })
          that.getAddress();
          that.setData({
            isList: 0
          })
        }
      }, function fail(res) {

      });
    } else {
      data.id = that.data.id;
      app.api_util.addressUpdate(data, "", function success(res) {
        if (res.errcode == 0) {
          app.toast.success('更新地址成功', 2000)
          that.getAddress();
          that.setData({
            isList: 0
          })
        }
      }, function fail(res) {
        app.toast.error('更新地址失败',
          2000
        )
      });
    }


  },
  setAddress: function(e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var list = this.data.address_s;
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.id == id) {
        app.globalData.address = el;
        // wx.setStorage({
        //   key: "getAddress",
        //   data: el
        // })
        break;
      }
    }
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 添加按钮
   */
  addAddress: function() {
    var that = this;
    that.setData({
      consignee: '',
      phone: '',
      address: '',
      region: ['广东省', '广州市', '海珠区'],
      id: 0,
      isList: 1,
      isEdit: 0,
      hidden: false
    })
  },
  /*省市区选择器*/
  bindRegionChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  getAddress: function() {
    var that = this;
    var memberId = app.globalData.member.id
    app.api_util.addressQueryList({
      memberId,
      memberId
    }, "", function success(res) {
      console.log(res);
      if (res.errcode == 0) {
        var l = res.result;
        if (l.length > 0) {
          that.setData({
            address_s: res.result,
            hidden: false
          })
        } else {
          that.setData({
            address_s: [],
            hidden: true
          })
        }

      }
    }, function fail(res) {

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '收货地址'
    })
    that.setData({
      member: app.globalData.member
    });
    that.getAddress();
    app.common_util.setBarColor(app.globalData.maninfo.tone);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})