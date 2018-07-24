var FILE_DOMAIN_URL = "https://file.sefve.net/";
var source_domain_url = "https://ysh12.sefve.net/mall/";
var MEMBER_DOMAIN_URL = "https://ysh12.sefve.net/store/mini";
module.exports = {
    file_domain_url: FILE_DOMAIN_URL,
    source_domain_url: source_domain_url,
    config_version: 1.0,
    appid: 'wxa5375b06f7f44750',
    createUserId:0,

    //用户登录
    login_url: MEMBER_DOMAIN_URL + '/v2/session/login',
    //非第三方平台
    jscode2Common_url: MEMBER_DOMAIN_URL + '/v2/session/jscode/custom',
    //第三方平台
    jscode2session_url: MEMBER_DOMAIN_URL + '/v2/session/jscode2session',
    //获取推广码
    promocode_url: MEMBER_DOMAIN_URL + '/v2/session/promocode',  
    //获取首页数据
    get_maininfo_url: MEMBER_DOMAIN_URL + '/v1/getmaininfo',


    //更新member
    updateMembers_url: MEMBER_DOMAIN_URL + '/v2/session/getmember',
    //领取会员信息
    getmember_url: MEMBER_DOMAIN_URL + '/v2/session/getmember',
    //领取会员卡
    addmember_url: MEMBER_DOMAIN_URL + '/v2/session/addmember',
    //获取用户信息
    get_member_info_url: MEMBER_DOMAIN_URL + '/v2/session/getmember',
    //获取手机短信
    sendsms_url: MEMBER_DOMAIN_URL + '/v2/session/sendsms',
    //获取手机号码
    decodeinfo_url: MEMBER_DOMAIN_URL + '/v2/session/decodeinfo',
    //注册会员
    checkmember_url: MEMBER_DOMAIN_URL + '/v2/session/checkmember',
    updata_member_url: MEMBER_DOMAIN_URL + '/v2/session/updatemember',
    //邀请的会员/股东
    relationmember_url: MEMBER_DOMAIN_URL + '/v1/relationmember',
    //修改密码
    updatepwd_url: MEMBER_DOMAIN_URL + '/v2/session/updatepwd',

    //地址详情
    address_queryone_url: MEMBER_DOMAIN_URL + '/v2/address/query/one/',
    //地址列表
    address_querylist_url: MEMBER_DOMAIN_URL + '/v2/address/query/list',
    //录入地址
    address_insert_url: MEMBER_DOMAIN_URL + '/v2/address/insert',
     //更新地址
    address_update_url: MEMBER_DOMAIN_URL + '/v2/address/update',
     //删除地址
    address_delete_url: MEMBER_DOMAIN_URL + '/v2/address/delete/',
    //自定义表单
    forms_url: MEMBER_DOMAIN_URL + '/v2/forms',
    //保存表单
    save_forms_url: MEMBER_DOMAIN_URL + '/v2/form/content'
};