// pages/home/home.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
  bgimg:"",
  pxname:"!23",
  dogname:"213",
  fishnumber:wx.getStorageSync('fishnumber')||0,
  starnumber: wx.getStorageSync('starnumber') || 0,
  foodnumber: wx.getStorageSync('foodnumber') || 0,
  operationHidden:true,
  status:"在家闲着无聊",
  statusCode:0
  },
  touchcat:function(){
    wx.navigateTo({
      url: '/pages/luckycat/luckycat',
    })
  },
  showdoginfo:function(){
    wx.showToast({
      title: '未达成条件',
      icon: 'loading',
      duration: 2000
    });
  },
  showpxop:function(){
this.setData({
  operationHidden: !this.data.operationHidden
})
  },
  closeOp:function(){
    this.setData({
      operationHidden: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    fishnumber: wx.getStorageSync('fishnumber') || 0,
    starnumber: wx.getStorageSync('starnumber') || 0,
    foodnumber: wx.getStorageSync('foodnumber') || 0,
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
    this.setData({
      fishnumber: wx.getStorageSync('fishnumber') || 0,
      starnumber: wx.getStorageSync('starnumber') || 0,
      foodnumber: wx.getStorageSync('foodnumber') || 0,
    })
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