const static_data = require('/static_data.js');
const app = getApp();
const request_util = require('../../../utils/request_util.js');
const app_static = require('../../../utils/static_data.js');
const toast = require('../../../utils/toast_util.js');
module.exports = {
  //微信业务下单接口
  //body 业务头部描述
  /**
   * outTradeNo 订单编号
   * totalFee：总金额
   * 
   */
  wechat_pay_old: function (body, outTradeNo, totalFee, openid, type) {
    var that = this;
    var appid = app.static_data.appid;
    wx.getExtConfig({
      success: function (res) {
        if (res.extConfig.appid != undefined) {
          appid = res.extConfig.appid;
        }
        that.unifiedorder({
          body: body,
          outTradeNo: outTradeNo,
          totalFee: totalFee,
          openid: openid,
          appid: appid
        }, "", function success(res) {
          console.log(res)
          wx.hideLoading();
          if (res.errcode == 0) {
            var r = res.result;
            console.log(r.package + "r.package")
            wx.requestPayment({
              'appId': appid,
              'timeStamp': r.timeStamp + '',
              'nonceStr': r.nonceStr,
              'package': r.package,
              'signType': 'MD5',
              'paySign': r.paySign,
              'success': function (data) {
                that.orderquery({ outTradeNo: outTradeNo, appid: appid }, "正在核对中", function success(res) {

                  if (res.errcode == 0) {
                    if (res.msg == 'SUCCESS') {
                      that.order_pendingshipment(outTradeNo, '正在提交中', function success(res) {
                        if (res.errcode == 0) {

                          wx.redirectTo({
                            url: '/pages/mall/paySuccess/success?id=' + outTradeNo + '&type=' + type
                          })
                        } else {

                        }

                      }, function fail(res) {

                      });

                    } else {
                      wx.redirectTo({
                        url: '/pages/mall/waitPay/fail?id=' + outTradeNo + '&type=' + type
                      })
                    }

                  } else {

                  }

                }, function fail(res) {
                  wx.redirectTo({
                    url: '/pages/mall/waitPay/fail?id=' + outTradeNo + '&type=' + type
                  })
                  toast.error('支付失败', 1500);
                });
              },
              'fail': function (res) {
                console.log(res);
                wx.redirectTo({
                  url: '/pages/mall/waitPay/fail?id=' + outTradeNo + '&type=' + type
                })
              }
            })
          } else {
            toast.error('调起微信支付失败', 1500);
          }
        }, function fail(res) {
          toast.error('调起微信支付失败', 1500);
        });
      }
    })

  },

  //微信支付
  wechat_pay: function (r, body, outTradeNo, openid,type) {
    var that = this;
    var appid = app.static_data.appid;
    wx.getExtConfig({
      success: function (res) {
        if (res.extConfig.appid != undefined) {
          appid = res.extConfig.appid;
        }
        wx.requestPayment({
          'appId': appid,
          'timeStamp': r.timeStamp + '',
          'nonceStr': r.nonceStr,
          'package': r.package,
          'signType': 'MD5',
          'paySign': r.paySign,
          'success': function (data) {
            that.order_pendingshipment(outTradeNo, '正在提交中', function success(res) {
              if (res.errcode == 0) {           
                  wx.redirectTo({
                    url: '/pages/mall/paySuccess/success?id=' + outTradeNo + '&type=' + type
                  })
              } else {

              }

            }, function fail(res) {

            });

          },
          'fail': function (res) {
            console.log(res);
            wx.redirectTo({
              url: '/pages/mall/waitPay/fail?id=' + outTradeNo + '&type=' + type
            })
          }
        })
      }
    })
  },
  //微信统一下单接口
  unifiedorder: function (params, message, success, fail) {
    request_util.get_data(static_data.unifiedorder_url, params, message, success, fail);
  },
  //微信订单查询接口
  orderquery: function (params, message, success, fail) {
    request_util.get_data(static_data.orderquery_url, params, message, success, fail);
  },

  /**
   * 获取首页数据
   */
  homeData: function (message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.home_data_url + '?token=' + token, {}, message, success, fail);
      }
    })
  },
  /**
   * 获取公告列表
   */
  getNoticeList: function (message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_notice_list_url + '?token=' + token, {}, message, success, fail);
      }
    })
  },
  /**
   * 获取用户未读消息列表
   */
  getMessage: function (message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_message_url + '?token=' + token, {}, message, success, fail);
      }
    })


  },
  /**
   * 保存已读消息
   */
  messageRead: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.message_read_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
   * 获取分组列表
   */
  getGroupIdList: function (message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_groupid_list_url + '?token=' + token, {}, message, success, fail);
      }
    })

  },
  /**
   * 获取商品列表
   params:{
           size:size,
           number:number,
           likeTitle:likeTitle,
           groupId:groupId
      }
   */
  getProductList: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_product_list_url + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
   * 获取商品信息
   */
  getProductInfo: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.get_product_info_url + '?token=' + token, { id: id }, message, success, fail);
      }
    })


  },

  /**
   * 统一下单接口
   */
  order_insert: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_insert_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 关闭订单
   */
  order_close: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_close_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })
  },
  /**
   * 待发货
   */
  order_pendingshipment: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_pendingshipment_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })
  },

  /**
   * 确认收货接口
   */
  order_receipt: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_receipt_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })


  },
  /**
   * 获取订单列表
   params:{
           size:size,
           number:number,
           trueStatus:trueStatus,
           falseStatus:falseStatus
      }
   */
  order_list: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.order_list_url + '?token=' + token, params, message, success, fail);
      }
    })


  },
  /**
   * 获取订单详情
   */
  order_one: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.order_get_one_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })


  },
  /**
   * 申请退款退货
   */
  order_refund: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_refund_url + '?token=' + token, params, message, success, fail);
      }
    })


  },
  /**
   * 修改申请退款退货
   */
  order_updaterefund: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_update_refund_url + '?token=' + token, params, message, success, fail);
      }
    })


  },
  /**
   * 评价
   */
  order_evaluate: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.order_evaluate_url + '?token=' + token, params, message, success, fail);
      }
    })


  },
  /**
   * 获取退货详情
   */
  order_refund_detail: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.order_refund_detail_url + '?token=' + token, { id: id }, message, success, fail);
      }
    })


  },
  /**
   * 撤销退款退货
   */
  order_close_refund: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.order_close_refund_url + '?token=' + token, { id: id }, message, success, fail);
      }
    })

  },
  /**
   * 获取订单状态数量
   */
  order_getOrderStatusCount: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.order_get_order_status_count_url + '?token=' + token, params, message, success, fail);
      }
    })

  },


  /**
   * 获取购物车列表
   */
  trolley_list: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.trolley_list + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 保存购物车数据
   */
  trolley_insert: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.trolley_insert + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 更新购物车数据
   */
  trolley_update: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.put_data(static_data.trolley_update + '?token=' + token, params, message, success, fail);
      }
    })

  },
  /**
   * 根据 购物车id 指定删除
   */
  trolley_delete: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.delete_data(static_data.trolley_delete + id + '?token=' + token, {}, message, success, fail);
      }
    })
  },

  /**
  * 咨询录入
  */
  insertsubscribe: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.insertsubscribe_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 获取咨询列表
   */
  subscribelist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.subscribeliste_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 取消预约
  */
  updatesubscribe: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.updatesubscribe_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })
  },
  /**
  * 获取资讯列表
  */
  informationlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.informationlist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 获取资讯详情
  */
  information: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.information_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
      }
    })
  },
  /**
  * 优惠券列表
     memerId:memerId
  */
  getcouponlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.getcouponlist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 领取优惠券
  *
      "couponId" : 4,//名字
      "memberId" : 3,//电话
      }
  */
  insertcouponuser: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.insertcouponuser_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 修改优惠券为已使用
  * id:id
  */
  updatecouponuser: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.updatecouponuser_url + '?token=' + token + '&id=' + id, message, success, fail);
      }
    })
  },
  /**
  * 用户优惠券列表
    memberId :用户id
    status 状态 1是未只用，2是已使用，3是过期， 不传就是查全部
  */
  getusercouponlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.getusercouponlist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 用户优惠券详情信息
 * id:id
 */
  getusercoupon: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.getusercoupon_url + '?token=' + token + '&id=' + id, message, success, fail);
      }
    })
  },
  /**
  * 插入积分
   {
        "appid" : "", //微信id
        "memberId":123,//会员id
        "orderId":1,//订单id
        "integral":"积分"
        "type":1 //类型  1.加 2.减
        "way":1 //变动方式 1.购物 2.兑换 3.退货返还
        }
  */
  insertintegrallog: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.insertintegrallog_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 分页查询积分记录
     size 长度
     {int} page 页码
  */
  integralloglist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.integralloglist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 秒杀活动列表
   * type  1是正在进行，2是还没开始
   */
  seckilllist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.marketing_seckilllist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 团购列表
   * {int} type  1是正在进行，2是还没开始
   */
  grouplist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.marketing_grouplist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
 * 开团
 */
  insertsponsor: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.marketing_insertsponsor_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 拼团发起信息
   * type  1是正在进行，2是还没开始
   */
  sponsorlist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.marketing_sponsorlist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 参团
   */
  insertgrouporder: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.marketing_insertgrouporder_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
  * 秒杀下单
  */
  insertseckill: function (id, params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.marketing_insertseckill_url + '?token=' + token + '&id=' + id, params, message, success, fail);
      }
    })
  },
  /**
    * 拼团下单
    */
  insertgroup: function (id, params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.marketing_insertgroup_url + '?token=' + token + '&id=' + id, params, message, success, fail);
      }
    })
  },
  /**
      * 查询拼团信息
      */
  getsponsor: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.marketing_getsponsor_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 提交分销商审核
   *
        {"memberId" : 4,//用户id
        "name" : 3,//电话
        "mobile":电话
        "desc":描述
        }
   */
  insertdistributoraudit: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.insertdistributoraudit_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
   * 提交提现
   *
       {
        "memberId" : 4,//用户id
        "monery" : 3,//电话
        }
   */
  insertbrokerageapply: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.insertbrokerageapply_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 获取提现列表
   *
       {
       size 长度
       number 页码
        }
   */
  brokerageapplylist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.brokerageapplylist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 获取收益列表
   *
       {
       size 长度
       number 页码
        }
   */
  brokerageloglist: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.brokerageloglist_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
  * 分销关系插入
  */
  insertbrokeragerelation: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.insertbrokeragerelation_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
 * 获取审核状态
 */
  getdistributoraudit: function (data, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.getdistributoraudit_url + '?token=' + token, data, '', success, fail);
      }
    })
  },

  /**
   * 置顶秒杀
  */
  seckill: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.seckill_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
  /**
   * 置顶团购
  */
  group: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.group_url + '?token=' + token, params, message, success, fail);
      }
    })
  },

  /**
 * 取消订单删除开团
*/
  deletesponsor: function (id, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.deletesponsor_url + '?token=' + token + '&id=' + id, message, success, fail);
      }
    })
  },

  /**
 * 获取快捷入口
*/
  getquickentry: function (message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.get_data(static_data.getquickentry_url + '?token=' + token, {}, message, success, fail);
      }
    })
  },

  /**
* 获取快捷入口
*/
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
* 获取商品数据
*/
  shopData: function (params, message, success, fail) {
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        request_util.post_data(static_data.shop_data_url + '?token=' + token, params, message, success, fail);
      }
    })
  },
}