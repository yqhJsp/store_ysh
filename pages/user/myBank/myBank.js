const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    member: {},
    userInfo: {},
    maninfo: {},
    name: '',//姓名
    card: '',//身份证
    bank: '',//银行卡
    img_arr:[],//身份证凭证
    dirs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的银行卡',
    })
    app.common_util.setBarColor(app.globalData.maninfo.tone);
    that.setData({
      member: app.globalData.member,
      maninfo: app.globalData.maninfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.setMember();
  },
  setMember: function () {
    var that = this;
    if (app.globalData.member != '') {
      var us = app.globalData.member;
      var cardImg=[];
      var dirs=[];
      console.log(p)
      if (us.identityCardId!=''){
        var p = us.identityCardId.split(",");
        for(var i=0;i<p.length;i++){
          var img = that.data.fileDomain+p[i];
          cardImg.push(img);
          dirs.push(p[i])
        }
        that.setData({
          img_arr: cardImg,
          dirs: dirs
        })
      }

      var c = us.identityCard
      var b = us.bankCard;
      that.setData({
        name: us.realName,
        card: c,
        bank:b
      })
    }
  },
  //对身份证或银行卡进行*隐藏
  plusXing:function(str, frontLen, endLen){
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },
  //获取姓名
  nameInput: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value
    })
  },
  //获取身份证
  cardInput: function (e) {
    var that = this;
    that.setData({
      card: e.detail.value
    })
  },
  //获取姓名
  bankInput: function (e) {
    var that = this;
    that.setData({
      bank: e.detail.value
    })
  },
  //选取图片的方法
  upimg: function () {
    var that = this;
    var  img_arr = that.data.img_arr;
    var dirs = that.data.dirs;
    if (img_arr.length <1) {
      wx.chooseImage({
        // 最多可以选择的图片张数，默认9
        count: 1 - img_arr.length,
        // original 原图，compressed 压缩图，默认二者都有
        sizeType: ['original', 'compressed'],
        // album 从相册选图，camera 使用相机，默认二者都有
        sourceType: ['album', 'camera'],
        success: function (res) {
          var imgsrc = res.tempFilePaths;
          app.uploadimg({
            //这里是你图片上传的接口
            url: app.static_data.source_domain_url + '/attachment/upload',
            //这里是选取的图片的地址数组
            path: imgsrc
          }, dirs);
          img_arr = img_arr.concat(imgsrc);
          console.log(img_arr)
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
      app.toast.warn("最多上传一张图片", 1000);
    }

  },
  
  //保存信息
  saveMember: function () {
    var that = this;
    var identityCard=that.data.card;
    var identityCardId = that.data.dirs;
    var bankCard= that.data.bank;
    var realName = that.data.name;
    var id=app.globalData.member.id;
    var us = app.globalData.member;
    if (realName == '') {
      app.toast.warn("请填写姓名", 1500);
      return false
    }
    if (identityCard == '') {
      app.toast.warn("请填写身份证号", 1500);
      return false
    }
    if (bankCard=='') {
      app.toast.warn("请填写银行卡号", 1500);
      return false
    }
    if (identityCardId.length==0) {
      app.toast.warn("请上传身份证凭证", 1500);
      return false
    }
  
    var data = {
      id:id,
      bankCard: bankCard,
      realName: realName,
      identityCard: identityCard,
      identityCardId: identityCardId.toString()
    }
    app.api_util.updata_members(data, '', function success(res) {
      if (res.errcode == 0) {
        app.toast.success("提交成功", 1000);
        app.globalData.member = res.result;   
        that.setData({
          member: res.result
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/user/storeUser/storeUser'
          })
        }, 1000)
      }
    }, function fail(res) {

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
  onShareAppMessage: function () {

  }
})