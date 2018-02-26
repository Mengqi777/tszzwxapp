// pages/storydetail/storydetail.js
var server = "https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
var util = require("../../utils/util");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hadshowwt: false,
    story: {},
    userInfo:{},
    title:"",
    content:""
  },
  playgame:function(){
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var datt = new Date();
    var that=this;
    wx.getUserInfo({
      success: res => {
        that.setData({
          userInfo:res.userInfo
        })

        var loginlogs = {};
        loginlogs.userInfo =res.userInfo;
        loginlogs.dateTime = util.formatTime(datt);
        loginlogs.page ="/pages/storydetail/storydetail";
       
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
      }});
    var dt = null;
    if (options.datetime === undefined) {  
      dt = util.formatTime(datt).split(" ")[0];
      console.log(dt)
    } else {
      dt = options.datetime;
    }
   
    wx.request({
      url: server + '/sleepstory/getbydatetime',
      method: 'GET',
      data: {
        dateTime: dt
      }, header: {
        'content-type': 'application/json'
      },
      success: function (res) {

        that.setData({
          story:res.data
        })
       
      }
    });
  },
  bindtitle:function(e){
    this.setData({
      title:e.detail.value
    })
  },
  bindcontent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  savestory: function () {
    var datt=new Date();
    var dt=util.formatTime(datt);
    var mystory={}
    var that=this;
    mystory.dateTime=dt;
    mystory.author=that.data.userInfo.nickName;
    mystory.content = that.data.content;
    mystory.title=that.data.title;
    console.log(mystory)
    wx.request({
      url: server + '/sleepstory/add',
      method: 'POST',
      data: mystory, 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.reLaunch({
          url: '/pages/storydetail/storydetail',
        })
      }
    });
  },
  showwriteone: function () {
    var that = this;
    that.setData({
      hadshowwt: that.data.hadshowwt ? false : true
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