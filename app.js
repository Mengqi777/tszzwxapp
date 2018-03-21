//app.js
var server="https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
// const innerAudioContext = wx.createInnerAudioContext()
var util = require("/utils/util");
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that=this;
    var innerac = that.globalData.innerac;
    innerac = wx.createInnerAudioContext();
    innerac.loop=true;
    innerac.src="/music/ROS.mp3";
    innerac.play();
    that.globalData.innerac=innerac;
    // 登录
    wx.login({
      success: res => {
        var code=res.code;
        if(code){
          // 获取用户信息
          wx.getSetting({
            success: res => {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    that.globalData.userInfo = res.userInfo
                    console.log(res)
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    wx.request({
                      url: server+'/customer/login',
                      method: 'POST',
                      data: {
                        userInfo: res.rawData,
                        code: code
                      }, header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        var customer=res.data.customer;
                        wx.setStorageSync('customer', customer);
                        
                        var pets=customer.pets||[];
                        for(var i=0;i<pets.length;i++){
                          if(pets[i].type==0){
                            wx.setStorageSync('px', pets[i])
                          }
                          if(pets[i].type==1){
                            wx.setStorageSync('dog', pets[i])
                          }
                        }
                        wx.setStorageSync('status', 'exist')
                        var datt = new Date();
                        var loginlogs = {};
                        loginlogs.userInfo = customer.userInfo;
                        loginlogs.dateTime = util.formatTime(datt);
                        loginlogs.page = "/pages/storydetail/storydetail";

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
                        wx.reLaunch({
                          url: '/pages/storydetail/storydetail',
                        })
                        // if (customer.pets == null || customer.pets.length==0){
                        //   wx.reLaunch({
                        //     url: '/pages/index/index',
                        //   })
                        // }else{
                        //   wx.reLaunch({
                        //     url: '/pages/home/home',
                        //   })
                        // }
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
    
  },
  globalData: {
    userInfo: null,
    innerac:null,
    info:"123"
  },
  playinnerac:function(){
    this.globalData.innerac.play()
  },
  pauseinnerac:function(){
    this.globalData.innerac.pause()
  }
})