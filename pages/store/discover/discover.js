// pages/store/discover/discover.js
const app = getApp();
const api = require('../utils/api_util.js');
Page({ 

        /**
         * 页面的初始数据
         */
        data: {
                fileDomain: app.static_data.file_domain_url,
                topics: [],
                infos: [],
                noData:false

        },
        openInfo: function (e) {
                var id = e.currentTarget.dataset.id;
                console.log(id);
                wx.navigateTo({
                  url: '/pages/store/disCoverDetail/page?id=' + id + '&tone=' + app.globalData.maninfo.tone,
                })
        },
        
        clickInfos: function (e) {
                var that = this;
                var tid = e.currentTarget.dataset.tid;
                var topics = that.data.topics;
                for (var i = 0; i < topics.length; i++) {
                        var r = topics[i];
                        if (tid == r.id) {
                                r.active = true;
                        } else {
                                r.active = false
                        }
                }
                that.setData({
                        topics: topics
                });
                this.getInfos(tid);
        },
        //获取数据
        getInfos: function (tid) {
                var that = this;
                var data={
                  topicId:tid
                };
                api.getinformations(data, '', function (res) {
                        if (res.errcode == 0) {
                                var r = res.result;
                                if (r.length > 0) {
                                        that.setData({
                                          infos: r
                                        });
                                } else {
                                        that.setData({
                                                infos: [],
                                        });
                                }

                        }
                }, function (res) {

                });
        },
        gettopics: function () {
                var that = this;
                api.gettopics({}, '', function (res) {
                        console.log(res);
                        if (res.errcode == 0) {
                                var topics = res.result;
                                for (var i = 0; i < topics.length; i++) {
                                        var t = topics[i];
                                        if (i ==0) {
                                                t.active = true
                                                that.getInfos(t.id);
                                        } else {
                                                t.active = false
                                        }
                                }
                                that.setData({
                                        topics: topics
                                });
                        }
                }, function (res) {

                });
        },
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {
          wx.setNavigationBarTitle({
            title: '网络课程',
          })
          app.common_util.setBarColor(app.globalData.maninfo.tone);
        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {
                var that = this;
                this.gettopics();
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
        onShareAppMessage: function () {

        }
})