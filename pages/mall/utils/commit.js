/*第三方上传代码*/
const static_data = require('/static_data.js');
const app = getApp();
const request_util = require('/request_util.js');

function getAccessToken(appId) {
       var accessToken = '';

       if (appId=='') {
                return accessToken;
        }
}

function commitCode() {
        var that=this;
        var appId ='';
        var descript = '测试代码指定';
        var version ='V.1.0';
        var templateId =1;
        if (appId=='') {
                app.toast.error('appid不能为空',1500)
                return;
        }

        if (templateId == '' && templateId!= 0) {
                app.toast.error('模板id不能为空', 1500)
                return;
        }

        var accessToken = that.getAccessToken(appId);

        var extJson={
                "extEnable": true,
                "extAppid": "wxa91ed3070240b4c1",
                "directCommit": true,
                "ext": {
                        "name": "广告小程序"
                },
                "extPages": {
                        "pages/mall/index/index": {
                                "navigationBarTitleText": "微商城首页"
                        },
                        "pages/mall/classify/page": {
                                "navigationBarTitleText": "分类"
                        },
                        "pages/mall/scart/page": {
                                "navigationBarTitleText": "购物车"
                        },
                        "pages/user/index/mine": {
                                "navigationBarTitleText": "个人中心"
                        },
                        "pages/mall/message/message": {
                                "navigationBarTitleText": "消息"
                        },
                        "pages/mall/detail/mall_detail": {
                                "navigationBarTitleText": "商品详情"
                        },
                        "pages/user/mineOrder/orderItems": {
                                "navigationBarTitleText": "我的订单"
                        },
                        "pages/mall/list/shopList": {
                                "navigationBarTitleText": "商品列表"
                        },
                        "pages/mall/payment/orderPay": {
                                "navigationBarTitleText": "订单支付"
                        },
                        "pages/mall/address/address": {
                                "navigationBarTitleText": "收货地址"
                        },
                        "pages/mall/paySuccess/success": {
                                "navigationBarTitleText": "支付成功"
                        },
                        "pages/mall/orderDetail/orderDetail": {
                                "navigationBarTitleText": "订单详情"
                        },
                        "pages/mall/waitPay/fail": {
                                "navigationBarTitleText": "支付失败"
                        },
                        "pages/mall/refund/orderRefund": {
                                "navigationBarTitleText": "退款"
                        },
                        "pages/mall/refundDetail/refundDetail": {
                                "navigationBarTitleText": "退款详情"
                        },
                        "pages/mall/evaluate/evaluate": {
                                "navigationBarTitleText": "评价"
                        },
                        "pages/mall/cancelDetail/cancelPage": {
                                "navigationBarTitleText": "取消订单"
                        },
                        "common/common": {
                                "navigationBarTitleText": ""
                        },
                        "pages/mall/notice/noticeList": {
                                "navigationBarTitleText": "店铺公告"
                        }
                },
                "pages": [
                        "pages/mall/index/index",
                        "pages/mall/classify/page",
                        "pages/mall/scart/page",
                        "pages/user/index/mine",
                        "pages/mall/message/message",
                        "pages/mall/detail/mall_detail",
                        "pages/user/mineOrder/orderItems",
                        "pages/mall/list/shopList",
                        "pages/mall/payment/orderPay",
                        "pages/mall/address/address",
                        "pages/mall/paySuccess/success",
                        "pages/mall/orderDetail/orderDetail",
                        "pages/mall/waitPay/fail",
                        "pages/mall/refund/orderRefund",
                        "pages/mall/refundDetail/refundDetail",
                        "pages/mall/evaluate/evaluate",
                        "pages/mall/cancelDetail/cancelPage",
                        "common/common",
                        "pages/mall/notice/noticeList"
                ],
                "window": {
                        "backgroundTextStyle": "white",
                        "navigationBarBackgroundColor": "#000000",
                        "navigationBarTitleText": "微商城",
                        "navigationBarTextStyle": "white"
                },
                "tabBar": {
                        "list": [
                                {
                                        "pagePath": "pages/mall/index/index",
                                        "text": "首页",
                                        "iconPath": "images/tabbar/home.png",
                                        "selectedIconPath": "images/tabbar/home_in.png"
                                },
                                {
                                        "pagePath": "pages/mall/classify/page",
                                        "text": "分类",
                                        "iconPath": "images/tabbar/classify.png",
                                        "selectedIconPath": "images/tabbar/classify_in.png"
                                },
                                {
                                        "pagePath": "pages/mall/scart/page",
                                        "text": "购物车",
                                        "iconPath": "images/tabbar/cart.png",
                                        "selectedIconPath": "images/tabbar/cart_in.png"
                                },
                                {
                                        "pagePath": "pages/user/index/mine",
                                        "text": "我的",
                                        "iconPath": "images/tabbar/user.png",
                                        "selectedIconPath": "images/tabbar/user_in.png"
                                }
                        ]
                },
                "networkTimeout": {
                        "request": 5000,
                        "connectSocket": 5000,
                        "uploadFile": 5000,
                        "downloadFile": 5000
                }
        }
       var params ={
                'template_id' :templateId,
                'user_version':version,
                'user_desc':descript,
                'ext_json': JSON.parse(extJson)
            };
       request_util.post_data('https://api.weixin.qq.com/wxa/commit?access_token=' + accessToken, params, function success(res){
               app.toast.success('代码指定成功', 1500);
               console.log(res)   
       },function fail(res){
               app.toast.error('代码指定错误', 1500)
       })
}
