const static_data = require('/static_data.js');
module.exports = {
  jscode2_common: function (params, success, fail) {
    this.get_data(static_data.jscode2Common_url, params, "", success, fail);
  },
  jscode2_session: function (params, success, fail) {
    this.get_data(static_data.jscode2session_url, params, "", success, fail);
  },
  post_data: function (url, params, message, success, fail) {
    this.custom_send(url, 'POST', {
      "Content-Type": "application/json"
    }, params, message, success, fail);
  },
  get_data: function (url, params, message, success, fail) {
    this.custom_send(url, 'GET', {
      "Content-Type": "application/x-www-form-urlencoded"
    }, params, message, success, fail);
  },
  put_data: function (url, params, message, success, fail) {
    this.custom_send(url, 'PUT', {
      "Content-Type": "application/json"
    }, params, message, success, fail);
  },
  delete_data: function (url, params, message, success, fail) {
    this.custom_send(url, 'DELETE', {
      "Content-Type": "application/x-www-form-urlencoded"
    }, params, message, success, fail);
  },
  /**
   * url:开发者服务器接口地址
   * method:有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
   * header:设置请求的 header，header 中不能设置 Referer
   * params:输入参数json
   * message:加载信息
   * success:收到开发者服务成功返回的回调函数
   * fail:接口调用失败的回调函数
   */
  custom_send: function (url, method, header, params, message, success, fail) {
    if (message != "") {
      wx.showLoading({
        title: message,
      })
    }
    wx.request({
      url: url,
      data: params,
      method: method,
      header: header,
      success: function (res) {
        if (message != "") {
          wx.hideLoading()
        }
        success(res.data)
      },
      fail: function (res) {
        if (message != "") {
          wx.hideLoading();
        }
        fail(res.data);
      },
    })
  }
};