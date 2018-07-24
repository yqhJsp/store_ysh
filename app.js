//app.js
const static_data = require('./utils/static_data.js');
const request_util = require('./utils/request_util.js');
const api_util = require('./utils/api_util.js');
const toast = require('./utils/toast_util.js');
const common_util = require('./utils/util.js');
const WxParse = require('./plugin/wxParse/wxParse.js');
var loginStatus = true;
App({
  token: '',
  static_data: static_data,
  request_util: request_util,
  api_util: api_util,
  WxParse: WxParse,
  common_util: common_util,
  toast: toast,
  //获取会话失败的弹窗提醒
  getSessionError: function () {
    wx.showModal({
      title: '提示',
      content: '获取用户会话失败,请重新进入',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    })
  },
  onShow: function () {
    console.log("onShow")

  },
  /**
   * 同步服务器用户信息
   */
  synUserInfo: function (userInfo) {
    var that = this;
    var member = that.globalData.member;
    var memberData = {
      id: member.userInfo.id,
      avatarUrl: userInfo.avatarUrl,
      nickName: userInfo.nickName,
      appid: member.appid,
      version: member.version,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      language: userInfo.language,
      openId: member.openId,
      createUserId: member.createUserId
    }
    that.globalData.member.userInfo = memberData;
    api_util.get_login(memberData, "", function success(data) {
      that.globalData.member.userInfo = memberData;
    }, function (data) {

    });
  },
  getUserInfo: function () {
    var that = this;
    var member = that.globalData.member;
    console.log("member");
    console.log(member);
    if (member.avatarUrl == '') {
      //获取用户信息
      wx.getUserInfo({
        success: function (res) {
          var userInfo = res.userInfo;
          that.globalData.userInfo = res.userInfo;
          that.synUserInfo(userInfo);
        },
        fail: function (res) {

        }
      })
    }
  },
  /**
  * 获取转发票据
  */
  getShareTicket: function (ops) {
    var that = this;
    if (ops.scene == 1044) {
      console.log("shareTicket:" + ops.shareTicket);
      if (ops.shareTicket) {
        // 获取转发详细信息
        wx.getShareInfo({
          shareTicket: ops.shareTicket,
          success(res) {
            var errMsg = res.errMsg;
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            var sessionkey = that.globalData.sessionkey;
            var token = that.globalData.token;
            console.log(encryptedData);
            console.log(iv);
            console.log(sessionkey);
            api_util.decodeinfo({
              sessionkey: sessionkey,
              encryptedData: encryptedData,
              iv: iv
            }, "", function success(r) {
              if (r.errcode == 0) {

              }
              console.log(r)
            }, function fail(r) {

            });
          },
          fail() { },
          complete() { }
        });
      }
    }
  },
  onShow: function (ops) {

  },
  /**
   * 强制授权操作
   */
  getPromission: function () {
    var that = this;
    if (!loginStatus) {
      wx.openSetting({
        success: function (data) {
          if (data) {
            if (data.authSetting["scope.userInfo"] == true) {
              loginStatus = true;
              wx.getUserInfo({
                withCredentials: false,
                success: function (data) {
                  console.info("2成功获取用户返回数据");
                  console.info(data.userInfo);
                  that.synUserInfo(data.userInfo);
                },
                fail: function () {
                  console.info("2授权失败返回数据");
                }
              });
            }
          }
        },
        fail: function () {
          console.info("设置失败返回数据");
        }
      });
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              withCredentials: false,
              success: function (data) {
                console.info("1成功获取用户返回数据");
                console.info(data.userInfo);
                that.synUserInfo(data.userInfo);
              },
              fail: function () {
                console.info("1授权失败返回数据");
                loginStatus = false;
                // 显示提示弹窗
                wx.showModal({
                  title: '温馨提示',
                  content: '为了更好的体验，请允许授权',
                  showCancel: false,
                  success: function (res) {
                    wx.openSetting({
                      success: function (data) {
                        if (data) {
                          if (data.authSetting["scope.userInfo"] == true) {
                            loginStatus = true;
                            wx.getUserInfo({
                              withCredentials: false,
                              success: function (data) {
                                console.info("3成功获取用户返回数据");
                                console.info(data.userInfo);
                                that.synUserInfo(data.userInfo);
                              },
                              fail: function () {
                                console.info("3授权失败返回数据");
                              }
                            });
                          }
                        }
                      },
                      fail: function () {
                        console.info("设置失败返回数据");
                      }
                    });
                  }
                });
              }
            });
          }
        },
        fail: function () {
          console.info("登录失败返回数据");
        }
      });
    }
  },
  /**
   * 获取登录接口
   * */
  getSession: function (callback){
    console.log("getSession")
    var that = this;
    var appid = static_data.appid;
    var createUserId = static_data.createUserId;
    var isExtConfig=true;
    wx.getExtConfig({
      success: function (res) {
        if (res.extConfig.appid !=undefined){
          appid = res.extConfig.appid;
          createUserId = res.extConfig.createUserId;
          that.globalData.appid = appid;
          isExtConfig =false;
        }
        console.log(res.extConfig.appid + "wx.getExtConfig" + isExtConfig+"kk")
      }
    })
    wx.login({
      success: function (res) {
        var data = {
          appid: appid,
          js_code: res.code,
          createUserId: createUserId
        }
        if (isExtConfig) {
          request_util.jscode2_common(data, function success(result) {
            if (result.errcode == 0) {
              var openid = result.result.openid;
              var sessionkey = result.result.session_key;
              var token = result.result.token;
              var member = result.result.member;
              wx.setStorageSync('openid', openid);
              wx.setStorageSync('sessionkey', sessionkey);
              wx.setStorageSync('member', member);
              wx.setStorageSync('appid', appid);
              wx.setStorage({
                key: "token",
                data: token
              })
              console.log(token + "token")
              that.globalData.openid = openid;
              that.globalData.appid = appid;
              that.globalData.token = token;
              that.globalData.member = member;
              that.globalData.createUserId = createUserId;
              that.globalData.sessionkey = sessionkey
            
            } else {
              that.getSessionError();

            }
            if (that.userInfoReadyCallback) {
              that.userInfoReadyCallback(res)
            }

          }, function fail(result) {
            that.getSessionError();
          });
        }else{
        request_util.jscode2_session(data, function success(result) {
          if (result.errcode == 0) {
            var openid = result.result.openid;
            var sessionkey = result.result.session_key;
            var token = result.result.token;
            var member = result.result.member;
            wx.setStorageSync('openid', openid);
            wx.setStorageSync('sessionkey', sessionkey);
            wx.setStorageSync('member', member);
            wx.setStorageSync('appid', appid);
            wx.setStorage({
              key: "token",
              data: token
            })
            console.log(token + "token")
            that.globalData.openid = openid;
            that.globalData.appid = appid;
            that.globalData.member = member;
            that.globalData.sessionkey = sessionkey;
            that.globalData.createUserId = createUserId;
            that.globalData.token = token;
           //that.getPromission();
          } else {
            that.getSessionError();

          }
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res)
          }

        }, function fail(result) {
          that.getSessionError();

        });
        
      }
      }
   
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getSession();
  },

  globalData: {
    token: null,
    userInfo: null,
    createUserId: 0,
    member: {},
    appid: null,
    openid: null,
    maninfo: null,
    isPayPattern:1,
    kfMobile: '',
    sessionkey: '',
    saveOrder: [],//下单的数据
    pay:null,//微信支付凭证
    loginStatus:'',//登录状态
    scene:'',
    address:null
  },
  
  //下拉刷新
  refresh: function () {
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  
  //多张图片上传
  uploadimg: function (data, dirs) {
    var that = this;
    var paths = '';
    for (var i = 0; i < data.path.length; i++) {
      paths = data.path[i]
    }
    wx.uploadFile({
      url: data.url,
      filePath: paths,
      name: 'image', 
      formData: data,
      success: function (res) {
        var data = JSON.parse(res.data);
        var imgs = dirs;
        for (var i = 0; i < data.files.length; i++) {
          imgs.push(data.files[i].dir)
        }
        console.log(data)
      }
    })
  },
})