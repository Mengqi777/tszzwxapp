// pages/luckycat/luckycat.js
var context = null;// 使用 wx.createContext 获取绘图上下文 context  
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
var base64 = require("../../utils/base64");
//获取系统信息  
wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth;//设备宽度  
    canvash = res.windowHeight;
  }
});  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgi:"",
    drawinfo:"",
    fishnumber: wx.getStorageSync('fishnumber')||0,
    starnumber: wx.getStorageSync('starnumber') || 0
  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  canvasStart: function (event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
    //context.moveTo(event.changedTouches[0].x, event.changedTouches[0].y);  
  },
  canvasMove: function (event) {
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
      // context.lineTo(event.changedTouches[0].x, event.changedTouches[0].y);  
      // context.stroke();  
      // context.draw()  
    };
    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };
    };
    context.clearRect(0, 0, canvasw, canvash);
    context.stroke();
    context.draw(true);
  },
  canvasEnd: function (event) {
    isButtonDown = false;
    var that=this;
    setTimeout(function(){
      that.cleardraw()
    },500)
    var n = that.randomNum(0, 100);
    if(n%20==0){
      that.setData({
        drawinfo:"幸运星+1",
        starnumber: that.data.starnumber + 1
      })
    }else{
      that.setData({
        drawinfo: "小鱼干+1",
        fishnumber:that.data.fishnumber+1
      })
      
    }
    setTimeout(function () {
      that.setData({
        drawinfo: ""
      })

    },200)
    wx.setStorageSync('fishnumber', that.data.fishnumber);
    wx.setStorageSync('starnumber', that.data.starnumber);
    
  },
  cleardraw: function () {
    //清除画布  
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
  }, 

   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bgi: base64.luckycatbgi
    })
    // 使用 wx.createContext 获取绘图上下文 context  
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#ffff00');
    context.setLineWidth(10);
    context.setLineCap('round');
    context.setLineJoin('round');  
  },

  //生成从minNum到maxNum的随机数
  randomNum: function(minNum, maxNum){ 
  
    return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10); 
  
   
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
      // foodnumber: wx.getStorageSync('foodnumber') || 0,
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