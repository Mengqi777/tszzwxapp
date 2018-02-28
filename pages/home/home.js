// pages/home/home.js
var server = "https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
const appIns=getApp()
var util = require("../../utils/util");
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
    if(customer===""){
      // 登录
      wx.login({
        success: res => {
          var code = res.code;
          if (code) {
            // 获取用户信息
            wx.getSetting({
              success: res => {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    // this.globalData.userInfo = res.userInfo
                    console.log(res)
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                      url: server + '/customer/login',
                      method: 'POST',
                      data: {
                        userInfo: res.rawData,
                        code: code
                      }, header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        var customer = res.data.customer;
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
                        if (customer.pets == null || customer.pets.length == 0) {
                          wx.reLaunch({
                            url: '/pages/index/index',
                          })
                        } else {
                          // wx.reLaunch({
                          //   url: '/pages/home/home',
                          // })
                          var pets = customer.pets;
                          for (var i = 0; i < pets.length; i++) {
                            if (pets[i].type == 0) {
                              that.setData({
                                px: pets[i],
                                pxname: pets[i].name
                              })
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
                              that.setData({
                                dog: pets[i],
                                dogname: pets[i].name
                              })
                              wx.setStorageSync('dog', pets[i])
                            }
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
                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                  }
                })

              }
            })


          }
        }
      })
    }else{

  
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
            that.setData({
              px: pets[i],
              pxname: pets[i].name
            })
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
            that.setData({
              dog: pets[i],
              dogname: pets[i].name
            })
            wx.setStorageSync('dog', pets[i])
          }
        }
        that.setData({
          userInfo: customer.userInfo,
          fishnumber: wx.getStorageSync('fishnumber') || 0,
          starnumber: wx.getStorageSync('starnumber') || 0,
          foodnumber: wx.getStorageSync('foodnumber') || 0,
        })
      }
    })
    }

    
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
    var innerac = appIns.globalData.innerac;
    innerac.play();
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