// pages/home/home.js
var server = "https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    px: {},
    dog: {},
    bgimg: "",
    pxname: "",
    dogname: "",
    userInfo: {},
    fishnumber: wx.getStorageSync('fishnumber') || 0,
    starnumber: wx.getStorageSync('starnumber') || 0,
    foodnumber: wx.getStorageSync('foodnumber') || 0,
    operationHidden: true,
    status: "在家中",
    statusCode: 0,
    selected:{}
  },
  touchcat: function () {
    wx.navigateTo({
      url: '/pages/luckycat/luckycat',
    })
  },
  viewtlogs:function(){
    wx.navigateTo({
      url: '/pages/tlogs/tlogs',
    })
  },
  viewtreasure:function(){
    wx.navigateTo({
      url: '/pages/treasure/treasure',
    })
  },
  gobacktravel: function () {
    var that = this;
    var fishnumber=that.data.fishnumber;
    var starnumber=that.data.starnumber;
    var foodnumber=that.data.foodnumber;
    if(fishnumber<=0) {
      wx.showToast({
        title: '小鱼干不足',
        icon:"loading",
        duration: 2000
      })
      return;
    }
    var travel={}
    travel.fishNumber=fishnumber;
    travel.starNumber=starnumber;
    travel.foodNumber=foodnumber;
    travel.petId = that.data.selected.id;
    travel.userId=wx.getStorageSync('customer').id
    travel.petName = that.data.selected.name;
    
    wx.request({
      method: "POST",
      url: server + "/travel/add",
      data: travel,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          fishnumber: 0,
          starnumber: 0,
          foodnumber: 0,
          statusCode: 1,
          status: "在过去"
        })
        wx.setStorageSync('fishnumber', 0);
        wx.setStorageSync('starnumber', 0);
        wx.setStorageSync('foodnumber', 0);
        wx.setStorageSync('travel', res.data)
        wx.reLaunch({
          url: '/pages/travel/travel?id='+res.data.id,
        })
      }
    })

  },
  viewtravel:function(){
    wx.reLaunch({
      url: '/pages/travel/travel?id=' + wx.getStorageSync('px').travelingId,
    })
  },
  showdoginfo: function () {
    wx.showToast({
      title: '未达成条件',
      icon: 'loading',
      duration: 2000
    });
  },
  showpxop: function () {
    this.setData({
      selected:this.data.px,
      operationHidden: !this.data.operationHidden
    })
  },
  closeOp: function () {
    this.setData({
      operationHidden: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var customer = wx.getStorageSync('customer');
    wx.request({
      method: "GET",
      url: server + "/customer/get",
      data: { id: customer.id },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        wx.setStorageSync('customer', res.data)
        customer = wx.getStorageSync('customer');
        var pets = customer.pets;
        for (var i = 0; i < pets.length; i++) {
          if (pets[i].type == 0) {
            wx.setStorageSync('px', pets[i])
            var status = "";
            if (pets[i].statusCode == 0) { status = "在家中" }
            if (pets[i].statusCode == 1) { status = "在过去" }
            if (pets[i].statusCode == 2) { status = "在路上" }
            that.setData({
              statusCode: pets[i].statusCode,
              status: status
            })
          } else {
            wx.setStorageSync('dog', pets[i])
          }
          that.setData({
            userInfo: customer.userInfo,
            fishnumber: wx.getStorageSync('fishnumber') || 0,
            starnumber: wx.getStorageSync('starnumber') || 0,
            foodnumber: wx.getStorageSync('foodnumber') || 0,
          })
        }
      }
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
    var that = this;
    var pets = wx.getStorageSync('customer').pets || [];
    for (var i = 0; i < pets.length; i++) {
      if (pets[i].type == 0) {
        that.setData({
          px: pets[i],
          pxname: pets[i].name
        })
      } if (pets[i].type == 1) {
        that.setData({
          dog: pets[i],
          dogname: pets[i].name
        })
      }
    }
    that.setData({
      userInfo: wx.getStorageSync('customer').userInfo || {},
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