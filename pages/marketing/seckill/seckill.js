// pages/marketing/seckill/seckill.js
const app = getApp();
const api = require('../../mall/utils/api_util.js');
Page({

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                select: 1, //切换参数
                list: [],
                stype: 0,
                tag: 35,
                iTime: {},
                hidden: false
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          wx.setNavigationBarTitle({
            title: '秒杀',
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
                var that = this;
                var stype = options.stype;
                that.setData({
                        stype: stype
                })
                that.getseckill();
        },
        /**参数切换 */
        changeArea: function (data) {
                var that = this;
                var area = data.currentTarget.dataset.area;
                that.setData({ 
                  select: area 
                  });
                that.getseckill();
        },

        //获取秒杀数据
        getseckill: function () {
                var that = this;
                var type = that.data.select;
                api.seckilllist({ type: type }, '加载中...', function success(res) {
                        if (res.errcode == 0) {
                          console.log(res.result)
                                if (res.result.length != 0 && res.result != '') {
                                        that.setData({
                                                hidden: false,
                                                list: res.result
                                        });
                                        that.countTime();
                                } else {
                                        that.setData({
                                                list: [],
                                                hidden: true,
                                        })
                                }
                        }
                }, function fail(res) {

                })
        },
        countTime: function () {
                var data = this.data.list;
                var that = this;
                if (data.length == 0) {
                        return false;
                }
                for (var i = 0; i < data.length; i++) {
                        var res = data[i];

                        var date = new Date();
                        var now = date.getTime();
                        //设置截止时间  

                        var endDate = new Date(res.endTime);
                        var end = endDate.getTime();

                        //时间差  
                        var times = (end - now) / 1000;

                        var day = 0,
                                hour = 0,
                                minute = 0,
                                second = 0;//时间默认值
                        if (times >= 0) {
                                res.start = true;
                                day = Math.floor(times / (60 * 60 * 24));
                                hour = Math.floor(times / (60 * 60)) - (day * 24);
                                minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
                                second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                                //   console.log("day:" + day + ",hour:" + hour + ",minute:" + minute + ",second:" + second);
                                res.d = that.checkTime(day);
                                res.h = that.checkTime(hour);
                                res.m = that.checkTime(minute);
                                res.s = that.checkTime(second);
                        } else {
                                res.start = false;
                        }
                }
                var that = this;
                that.setData({
                        list: data
                })
                setTimeout(function () {
                        that.data.iTime = that.countTime()
                }, 1000);
        },
        checkTime: function (i) { //将0-9的数字前面加上0，例1变为01 
                if (i < 10) {
                        i = "0" + i;
                }
                return i;
        },
        //去秒杀
        goDetail: function (e) {
                var that = this;
                var stype = that.data.stype;
                var id = e.currentTarget.dataset.id;
                var skid = e.currentTarget.dataset.skid;//秒杀id
                var isStart = e.currentTarget.dataset.start;//是否开始  1、开始 2、预告
                var sklist = {};
                var list = that.data.list;
                for (var i = 0; i < list.length; i++) {
                        if (list[i].id == skid) {
                                sklist = list[i];
                                console.log(sklist + "sk")
                        }
                }
                wx.setStorageSync('sklist', sklist);
                clearTimeout(that.data.iTime);
                wx.redirectTo({
                        url: '/pages/mall/detail/mall_detail?stype=' + stype + '&id=' + id + '&skid=' + skid + '&isStart=' + isStart,
                })
        },
        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

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
                this.getseckill();
                setTimeout(() => {
                        wx.stopPullDownRefresh()
                }, 2000)
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