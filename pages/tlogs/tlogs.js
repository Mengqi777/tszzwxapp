// pages/tlogs/tlogs.js
var server = "https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tlogs:[],
    pageNum:0,
    preuri:"",
    showmodal:true,
    tex:""
  },
  hiddenmodal:function(){
    this.setData({
      showmodal: true,
    })
  },
  preview:function(e){
   var findex=e.target.dataset.findex;
   var sindex = e.target.dataset.sindex;
   var that=this;
   that.setData({
     showmodal: false,
     preuri: server +'/static'+ that.data.tlogs[findex].treasures[sindex].imgUri,
     tex: that.data.tlogs[findex].treasures[sindex].typeName
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
    loginlogs.page = "/pages/tlogs/tlogs";
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
    wx.request({
      method: "GET",
      url: server + "/travel/getbyusrid",
      data: { userId: wx.getStorageSync('customer').id,pageNum:0 },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          pageNum:0,
          tlogs: res.data
        })
      }
    })
  },
  getmore:function(){
    var that = this;
    var pn=that.data.pageNum+1;
    wx.request({
      method: "GET",
      url: server + "/travel/getbyusrid",
      data: { userId: wx.getStorageSync('customer').id, pageNum:pn },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var resdata=res.data;
        var tlogs=that.data.tlogs;
        for(var i=0;i<resdata;i++){
          tlogs.push(resdata[i])
        }
        that.setData({
          pageNum:pn,
          tlogs: tlogs
        })
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