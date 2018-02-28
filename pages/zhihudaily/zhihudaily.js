// pages/zhihudaily/zhihudaily.js
var WxParse = require('../../wxParse/wxParse.js');
var util = require("../../utils/util");
var zhihuserver ="https://news-at.zhihu.com/api/4/news/"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article:"",
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }]
  },

  tap() {
    console.log('tap')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tody = new Date();
    var customer = wx.getStorageSync('customer');
    var loginlogs = {};
    loginlogs.userInfo = customer.userInfo;
    loginlogs.dateTime = util.formatTime(tody);
    loginlogs.page = "/pages/dailylist/dailylist";
    wx.request({
      url: server + '/loginlogs/add',
      method: 'POST',
      data: loginlogs
      , header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
      }
    });
    var zid=options.zid;
    wx.request({
      url: zhihuserver+zid,
      method:'GET',
      success:function(res){
        console.log(res.data.body)
       var resdata=res.data;
       var articlebody=resdata.body;
       var repstr ='<div class="img-place-holder"><img class="headline img" src="'+resdata.image+'"></div>'
       articlebody = articlebody.replace('<div class="img-place-holder"></div>',repstr);
       articlebody = articlebody.replace('<script type=“text/javascript”>window.daily=true</script>','');
       WxParse.wxParse('article', 'html', articlebody, that, 5);
      }
    })
    // WxParse.wxParse('article', 'html', article, that, 5);
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