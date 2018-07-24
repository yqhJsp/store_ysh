const static_data = require('/static_data.js');
const app = getApp();
const request_util = require('/request_util.js');
module.exports = {
  //用户登录
  get_login: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.login_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
    * 获取首页数据
   */
  getmaininfo: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_maininfo_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
  * 更新member
 */
  updateMembers: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.updateMembers_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 我的银行卡
 */
  updata_members: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.updata_member_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  //解密encryptedData接口
  decodeinfo: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.decodeinfo_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
  * 领取会员信息
 */
  getmember: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.getmember_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })
  },

  /**
* 领取会员卡
*/
  addmember: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.addmember_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
  * 获取用户信息
  */
  getMemBerInfo: function (userId, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_member_info_url + '?token=' + token, { id: userId }, message, success, fail);
      }
    })
  },

  /**
  * 获取短信
 */
  sendsms: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.sendsms_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
    * 注会员
    */
  checkmember: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.checkmember_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
 * 单一查询查询地址
 */
  addressQueryOne: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.address_queryone_url + id + '?token=' + token, {}, message, success, fail);
      }
    })
  },

  /**
   * 列表查询地址
   params:参数对象
   */
  addressQueryList: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.address_querylist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 保存用户地址数据
   params:对象dto
   */
  addressInsert: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.address_insert_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 更新用户地址数据
   params:对象dto
   */
  addressUpdate: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.put_data(static_data.address_update_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 根据 id 指定删除地址
   */
  addressDelete: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.delete_data(static_data.address_delete_url + id + '?token=' + token, {}, message, success, fail);
      }
    })
  },
  /**
   * 获取主体细心
   */
  mainInfo: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.mainfo_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 获取魔法页数据
  * mid:mid
  */
  magicPage: function (mid, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.magic_page_url + '?token=' + token + '&mid=' + mid, {}, message, success, fail);
      }
    })
  },
  /**
  * 自定义表单
  * ids
  */
  formsData: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.forms_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
* 保存表单
* {
id:0,
name:'',
value:''
}
*/
  SaveFormsData: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.save_forms_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 获取推广码
  {memberId:memberId}
  */
  promocode: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.promocode_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 邀请的会员或股东
  */
  relationmember: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.relationmember_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
 * 修改密码
 */
  updatepwd: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.updatepwd_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  
}