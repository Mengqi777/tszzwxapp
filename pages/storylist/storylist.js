// pages/storylist/storylist.js
var util = require("../../utils/util");
var server = "https://api.mengqipoet.cn"
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    loginlogs.page = "/pages/storylist/storylist";
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