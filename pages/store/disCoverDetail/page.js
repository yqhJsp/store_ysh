// pages/vote/oneDetail/oneDetail.js
const app=getApp();
const api = require('../utils/api_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileDomain: app.static_data.file_domain_url,
    detail:{},//子详情
    playIndex: null,
    play: true,//音频播放
    controls: true,//是否显示默认控件,
    id:'',//详情的Id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that=this;
  wx.getSystemInfo({
    success: function (res) {
      that.setData({
        videoHeight: parseInt(res.windowWidth * 0.75),
      });
    },
    fail: function (res) {

    }
  });
  if(app.globalData.token==null){
    app.getSession();
  }
  wx.setNavigationBarTitle({
    title: '详情',
  })
  var id = options.id;
  var tone=options.tone;
  that.setData({
    id: id
  })
  app.common_util.setBarColor(tone);
  that.getData(id);
  },

  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var that = this;
    var id = e.currentTarget.id
    console.log(that.data.playIndex, id) // 当前播放与当前点击
    if (!that.data.playIndex) { // 没有播放时播放视频
      that.setData({
        playIndex: id
      })
      var videoContext = wx.createVideoContext('index' + id)
      videoContext.play()
    } else {                    // 有播放时先将prev暂停到0s，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('index' + that.data.playIndex)
      videoContextPrev.seek(0)
      videoContextPrev.pause()
      that.setData({
        playIndex: id
      })
      var videoContextCurrent = wx.createVideoContext('index' + that.data.playIndex)
      videoContextCurrent.play()
    }
  },
  //获取详情
  getData: function (id) {
    var that = this;
   api.getinformation({ id: id }, '加载中..', function success(res) {
      if (res.errcode == 0) {
        if (res.result != '') {
          var data = res.result;
          var article = data.detail;
          var title = data.title;
          title = title.length > 20 ? title.substring(0, 20) + '...' : title;
          data.title = title;
          that.setData({
            detail: data,
            article: app.WxParse.wxParse('article', 'html', article, that, 0)
          })
        }
      }
    }, function fail(res) {

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  var that=this;
  that.getData(that.data.id);
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
    }
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res)
    }
    return {
      title:that.data.detail.titie,
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
  }
})