//app.js
var server="https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
// const innerAudioContext = wx.createInnerAudioContext()
var util = require("/utils/util");
App({

 

  onLaunch: function() {
    // 展示本地存储能力
    var that = this;
    wx.getSetting({
      success: function (res) {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          console.log('not auth')
          wx.reLaunch({
            url: '/pages/auth/auth',
          })
        }
      }
    })
  },
  getCustomerInfo: function () {
    var that = this;
    var innerac = that.globalData.innerac;
    innerac = wx.createInnerAudioContext();
    innerac.loop = true;
    innerac.src = "/music/ROS.mp3";
    innerac.play();
    that.globalData.innerac = innerac;
    return new Promise(function (resolve, reject) {
      wx.getSetting({
        success: function (res) {
          console.log(res)
          if (!res.authSetting['scope.userInfo']) {
            console.log('not auth')
            wx.reLaunch({
              url: '/pages/auth/auth',
            })
          } else {
            // 登录
            wx.login({
              success: res => {
                var code = res.code;
                if (code) {
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      that.globalData.userInfo = res.userInfo
                      console.log(res)
                      // 发送 res.code 到后台换取 openId, sessionKey, unionId
                      wx.request({
                        url: server + '/customer/login',
                        method: 'POST',
                        data: {
                          userInfo: res.rawData,
                          code: code
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                          var customer = res.data.customer;
                          that.globalData.customer = customer;
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
                          resolve(res)
                        }
                      })
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (this.userInfoReadyCallback) {
                        this.userInfoReadyCallback(res)
                      }
                    }
                  })
                } else {
                  console.log('获取用户登录态失败！' + res.errMsg);
                  var res = {
                    status: 300,
                    data: '错误'
                  }
                  reject('error');
                }
              }
            })
          }
        }
      })
    });
  },
  globalData: {
    userInfo: null,
    innerac: null,
    info: "123"
  },
  playinnerac: function() {
    this.globalData.innerac.play()
  },
  pauseinnerac: function() {
    this.globalData.innerac.pause()
  }
})