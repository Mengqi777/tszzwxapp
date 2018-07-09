// pages/auth/auth.js
const app = getApp();
//app.js
var server="https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
// const innerAudioContext = wx.createInnerAudioContext()
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onGotUserInfo: function(res) {
    console.log(res);

    if (res.detail.userInfo) {
      let detail = res.detail;
      let userInfo = res.detail.userInfo;
      app.globalData.userInfo = userInfo;
      wx.login({
        success: res => {
          var code = res.code;
          console.log(code)
          wx.request({
            url: server + '/customer/login',
            method: 'POST',
            data: {
              userInfo: detail.rawData,
              code: code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              var customer = res.data.customer;
              console.log(customer);
              wx.setStorageSync('customer', customer);
              var pets = customer.pets || [];
              for (var i = 0; i < pets.length; i++) {
                if (pets[i].type == 0) {
                  wx.setStorageSync('px', pets[i])
                }
                if (pets[i].type == 1) {
                  wx.setStorageSync('dog', pets[i])
                }
              }
              wx.setStorageSync('status', 'exist')
              wx.reLaunch({
                url: '/pages/storydetail/storydetail',
              })
            }
          })
        }
      })
    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})