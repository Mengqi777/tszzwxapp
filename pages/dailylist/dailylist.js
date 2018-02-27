// pages/dailylist/dailylist.js
var zhihuserver = "https://news-at.zhihu.com/api/4/news/latest"
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},
    stories:[],
    currentdate:null,
    currentnumber:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tody=new Date();
    wx.request({
      url: zhihuserver,
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          content: res.data,
          stories:res.data.stories,
          currentdate:tody
        })
      }
    })
  },
  getdistancedate:function(distance){
    return new Date(new Date()-distance);
  },
  formattime:function(datestr){
    return datestr.split(" ")[0].split("-").join("")
  },
  predaily:function(){
    var that=this;
    var distancenumber=that.data.currentnumber+1;
    that.setData({
      currentnumber:distancenumber
    })
    var tempdate = that.getdistancedate(distancenumber* 24 * 60 * 60 * 1000)
    var datepre = that.formattime(util.formatTime(tempdate))
    that.getotherdaily(datepre);
  },
  getotherdaily:function(formatteddate){
    var that=this;
    wx.request({
      url: "https://news-at.zhihu.com/api/4/news/before/"+formatteddate,
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          content: res.data,
          stories: res.data.stories,
        })
      }
    })
  },
  nextdaily:function(){
    var that = this;
    var distancenumber = that.data.currentnumber - 1;
    that.setData({
      currentnumber: distancenumber
    })
    var tempdate = that.getdistancedate(distancenumber * 24 * 60 * 60 * 1000)
    var datenext = that.formattime(util.formatTime(tempdate))
    that.getotherdaily(datenext);
  },
  viewdetail:function(e){
    console.log(e.currentTarget.dataset.zid)
    var zid = e.currentTarget.dataset.zid;
    wx.navigateTo({
      url: '/pages/zhihudaily/zhihudaily?zid='+zid,
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