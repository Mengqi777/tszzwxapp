// pages/travel/travel.js
// var server = "https://api.mengqipoet.cn"
var server = "http://localhost:8080"
var base64 = require("../../utils/base64");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "",
    px:"",
    cat:"",
    x:0,
    y:0,
    travel:{}
  },
  backhome:function(){
wx.reLaunch({
  url: '/pages/home/home',
})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var id=options.id;
  wx.request({
    method: "GET",
    url: server + "/travel/get",
    data: { id:id },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data);
      wx.setStorageSync('travel', res.data)

    }
  })
  var that=this;
  that.setData({
    time: base64.time,
    px:base64.px,
    cat: base64.luckycatbgi
  })
  that.cartoon();
  },
  rnd:function(n, m){
    var random = Math.floor(Math.random() * (m - n + 1) + n);
    return random;
  },
  cartoon:function(){
    var that=this;
    setInterval(function(){
      var x=that.rnd(10,450);
      var y = that.rnd(10, 250);
      that.setData({
        x:x,
        y:y
      })
    },1000)
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