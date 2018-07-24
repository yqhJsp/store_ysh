const static_data = require('/static_data.js');
const app = getApp();
const request_util = require('../../../utils/request_util.js');
const toast = require('../../../utils/toast_util.js');
module.exports = {
        //微信业务下单接口
        //body 业务头部描述
        /**
         * outTradeNo 订单编号
         * totalFee：总金额
         * 
         */
        wechat_pay_old: function (body, outTradeNo, totalFee, openid) {
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
                                                                                if (res.result.code == 'SUCCESS') {
                                                                                        app.globalData.member = res.result.member;
                                                                                        console.log("成功")
                                                                                        console.log(app.globalData.member)
                                                                                        setTimeout(() => {
                                                                                                wx.redirectTo({
                                                                                                        url: '/pages/user/myService/myService',
                                                                                                })
                                                                                        }, 1500)
                                                                                } else {
                                                                                        toast.error('支付失败', 1500);
                                                                                }
                                                                        } else {
                                                                                toast.error('支付失败', 1500);
                                                                        }

                                                                }, function fail(res) {

                                                                        toast.error('支付失败', 1500);
                                                                });
                                                        },
                                                        'fail': function (res) {
                                                                console.log(res);
                                                                toast.error('支付失败', 1500);
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

        //购买服务支付
        wechat_pay: function (r, body, outTradeNo, openid) {
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
                                                                if (res.result.code == 'SUCCESS') {
                                                                        app.globalData.member = res.result.member;
                                                                        console.log("成功")
                                                                        console.log(app.globalData.member)
                                                                        setTimeout(() => {
                                                                                wx.redirectTo({
                                                                                        url: '/pages/user/myService/myService'
                                                                                })
                                                                        }, 1500)
                                                                } else {
                                                                        toast.error('支付失败', 1500);
                                                                }
                                                        } else {
                                                                toast.error('支付失败', 1500);
                                                        }

                                                }, function fail(res) {

                                                });

                                        },
                                        'fail': function (res) {
                                                console.log(res);
                                                wx.redirectTo({
                                                        url: '/pages/user/myService/myService'
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
         * 获取话题列表
        */
        gettopics: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.get_topics_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },

        /**
         * 获取话题咨询列表
        */
        getinformations: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.get_informations_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },

        /**
         * 获取话题咨询详情
        */
        getinformation: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.get_information_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
        * 获取话题咨询评论列表
        */
        commentlist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.commentlist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 评论插入
        */
        insertcomment: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.insert_comment_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },

        /**
         * 添加点赞数量
        */
        addlikenum: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.add_likenum_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 取消点赞
        */
        deletelikenum: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.delete_likenum_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },

        /**
         * 获取用户收藏列表接口
        */
        reinformationmemberlist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.reinformationmemberlist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 插入用户收藏
        */
        insertreinformationmember: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.insertreinformationmember_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 删除用户收藏
        */
        deletereinformationmember: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.deletereinformationmember_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 批量删除用户收藏
        */
        deletereinformationmembers: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.deletereinformationmembers_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 获取门店列表
        */
        childreninfolist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.childreninfolist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 获取单个门店数据
        */
        childrenbyid: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.childrenbyid_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 预约信息插入
        */
        savesubscribe: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.savesubscribe_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 用户预约列表
        */
        subscribelist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.subscribelist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 取消预约
        */
        delscribelist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.delscribelist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 优惠买单下单
        */
        insertdiscountsorder: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.insertdiscountsorder_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 优惠买单列表
        */
        discountsorderlist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.discountsorderlist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
       * 单条优惠买单
      */
        discountsorderid: function (id, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.discountsorderid_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
                        }
                })
        },
        /**
         * 优惠券列表
        */
        couponlist: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.couponlist_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 领取优惠券
        */
        addcoupon: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.addcoupon_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
         * 用户优惠券列表
        */
        couponlistbymember: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.couponlistbymember_url + '?token=' + token, params, message, success, fail);
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
         * 领取会员信息
        */
        getmember: function (id, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.getmember_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
                        }
                })
        },
        /**
         * 用户积分列表
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
        * 在线门店列表
       */
        getchildreninfos: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.getchildreninfos_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
      * 服务列表
      */
        serviceList: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.serviceList_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
      * 服务详情
      */
        serviceOne: function (id, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.serviceOne_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
                        }
                })
        },
        /**
      * 服务订单录入
      */
        serviceInsert: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.post_data(static_data.serviceInsert_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
      * 我购买的服务列表
      */
        myService: function (params, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.myService_url + '?token=' + token, params, message, success, fail);
                        }
                })
        },
        /**
      * 我购买的服务列表
      */
        myServiceOne: function (id, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.get_data(static_data.myServiceOne_url + '?token=' + token + '&id=' + id, {}, message, success, fail);
                        }
                })
        },
        /**
      * 取消服务订单
      */
        deleteService: function (id, message, success, fail) {
                wx.getStorage({
                        key: 'token',
                        success: function (res) {
                                var token = res.data;
                                request_util.delete_data(static_data.delete_url + id + '?token=' + token, {}, message, success, fail);
                        }
                })
        },
}