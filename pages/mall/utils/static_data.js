var API_DOMAIN_URL = "https://ysh12.sefve.net/mall/mini";
var SOURCE_DOMAIN_URL = "https://ysh12.sefve.net/mall/";
module.exports = {
    api_domain_url: API_DOMAIN_URL,
    source_domain_url: SOURCE_DOMAIN_URL,

    decodeinfo_url: API_DOMAIN_URL + '/v1/decodeinfo',     

    unifiedorder_url: SOURCE_DOMAIN_URL +'wxpay/v1/unifiedorder',
    orderquery_url: SOURCE_DOMAIN_URL +'wxpay/v1/orderquery',

    
    //秒杀拼团接口地址
    marketing_seckilllist_url: API_DOMAIN_URL +'/v1/marketing/seckilllist',
    marketing_grouplist_url: API_DOMAIN_URL + '/v1/marketing/grouplist',
    marketing_insertsponsor_url: API_DOMAIN_URL + '/v1/marketing/insertsponsor',
    marketing_sponsorlist_url: API_DOMAIN_URL + '/v1/marketing/sponsorlist',
    marketing_insertgrouporder_url: API_DOMAIN_URL + '/v1/marketing/insertgrouporder',
    //秒杀下单
    marketing_insertseckill_url: API_DOMAIN_URL + '/v1/order/insertseckill',
    //拼团
    marketing_insertgroup_url: API_DOMAIN_URL + '/v1/order/insertgroup',
    //拼团发起信息
    marketing_getsponsor_url: API_DOMAIN_URL + '/v1/marketing/getsponsor', 

    //首页接口地址
    home_data_url: API_DOMAIN_URL + '/v1/home',

    //获取快捷入口
    getquickentry_url: API_DOMAIN_URL + '/v1/getquickentry',

    get_notice_list_url: API_DOMAIN_URL + '/v1/getNoticeList',
    get_message_url: API_DOMAIN_URL + '/v1/getMessage',
    message_read_url: API_DOMAIN_URL + '/v1/MessageRead',
    get_groupid_list_url: API_DOMAIN_URL + '/v1/getGroupIdList',
    get_product_list_url: API_DOMAIN_URL + '/v1/getProductList',
    get_product_info_url: API_DOMAIN_URL + '/v1/getProductInfo',

    //订单接口地址
    order_insert_url: API_DOMAIN_URL + '/v1/order/insert',
    order_close_url: API_DOMAIN_URL + '/v1/order/close',
    order_pendingshipment_url: API_DOMAIN_URL + '/v1/order/pendingshipment',
    order_receipt_url: API_DOMAIN_URL + '/v1/order/receipt',
    order_list_url: API_DOMAIN_URL + '/v1/order/list',
    order_get_one_url: API_DOMAIN_URL + '/v1/order/one',
    order_refund_url: API_DOMAIN_URL + '/v1/order/refund',
    order_update_refund_url: API_DOMAIN_URL + '/v1/order/updateRefund',
    order_evaluate_url: API_DOMAIN_URL + '/v1/order/evaluate',
    order_refund_detail_url: API_DOMAIN_URL + '/v1/order/refundDetail',
    order_close_refund_url: API_DOMAIN_URL + '/v1/order/closeRefund',
    order_get_order_status_count_url: API_DOMAIN_URL + '/v1/order/getOrderStatusCount',

    //购物车
    trolley_list: API_DOMAIN_URL + '/v1/trolley/query/list',
    trolley_insert: API_DOMAIN_URL + '/v1/trolley/insert',
    trolley_update: API_DOMAIN_URL + '/v1/trolley/update',
    trolley_delete: API_DOMAIN_URL + '/v1/trolley/delete/',

    //咨询
    insertsubscribe_url: API_DOMAIN_URL + '/v1/insertsubscribe',
    subscribeliste_url: API_DOMAIN_URL + '/v1/subscribelist',
    updatesubscribe_url: API_DOMAIN_URL + '/v1/updatesubscribe',

    //资讯
    informationlist_url: API_DOMAIN_URL + '/v1/informationlist',
    information_url: API_DOMAIN_URL + '/v1/information',
    
    //优惠券列表
     getcouponlist_url: API_DOMAIN_URL + '/v1/getcouponlist',
     insertcouponuser_url: API_DOMAIN_URL + '/v1/insertcouponuser',
     //修改优惠券为已使用
     updatecouponuser_url: API_DOMAIN_URL + '/v1/updatecouponuser',

     //用户优惠券列表
     getusercouponlist_url: API_DOMAIN_URL + '/v1/getusercouponlist',
     //用户优惠券详情信息
     getusercoupon_url: API_DOMAIN_URL + '/v1/getusercoupon',

     //积分录入
     insertintegrallog_url: API_DOMAIN_URL + '/v1/order/insertintegrallog',
     integralloglist_url: API_DOMAIN_URL + '/v1/order/integralloglist',

     //提交分销商审核
     insertdistributoraudit_url: API_DOMAIN_URL + '/v1/insertdistributoraudit',
     //提交提现
     insertbrokerageapply_url: API_DOMAIN_URL + '/v1/insertbrokerageapply',
     //获取提现列表列表
     brokerageapplylist_url: API_DOMAIN_URL + '/v1/brokerageapplylist',
     //获取收益列表
     brokerageloglist_url: API_DOMAIN_URL + '/v1/brokerageloglist',
     //分销关系插入
     insertbrokeragerelation_url: API_DOMAIN_URL + '/v1/insertbrokeragerelation',
     //获取审核状态
     getdistributoraudit_url: API_DOMAIN_URL + '/v1/getdistributoraudit',
     
     //置顶秒杀
     seckill_url: API_DOMAIN_URL + '/v1/marketing/seckill/stick',
     //置顶团购
     group_url: API_DOMAIN_URL + '/v1/marketing/group/stick',
    
     //取消订单删除开团
     deletesponsor_url: API_DOMAIN_URL + '/v1/marketing/deletesponsor',
     //获取商品数据
     shop_data_url: API_DOMAIN_URL + '/v1/magic/product',
};