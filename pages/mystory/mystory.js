// pages/mystory/mystory.js
// var server = "http://localhost:8080"
var server = "https://api.mengqipoet.cn"
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  pageNumber:0,
  customer:{},
  storyList:[]
  },
  viewdetail:function(e){
    var sid=e.currentTarget.dataset.sid;
    wx.navigateTo({
      url: '/pages/mystorydetail/mystorydetail?sid='+sid,
    })
  },
  delmystory:function(e){
    var that=this;
    
    var sindex=e.currentTarget.dataset.sindex;
    var id = that.data.storyList[sindex].id;
    wx.request({
      url: server + '/sleepstory/delbyid',
      method:"GET",
      data:{
        id:id
      }, header: {
        'content-type': 'application/json'
      },
      success:function(res){
        that.data.storyList.splice(sindex, 1);
        that.setData({
          storyList: that.data.storyList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tody = new Date();
    var customer = wx.getStorageSync('customer');
    that.setData({
      customer: customer
    })
    var loginlogs = {};
    loginlogs.userInfo = customer.userInfo;
    loginlogs.dateTime = util.formatTime(tody);
    loginlogs.page = "/pages/mystory/mystory";
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
        url: server + '/sleepstory/getbyauthorid',
        method: 'GET',
        data: {
          authorId:customer.id,
          pageNumber:0
        }
        , header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            storyList:res.data
          })
        }
      });
  },
  getmore:function(){
    var that=this;
    var pageNumber=that.data.pageNumber+1;
    var customer=wx.getStorageSync('customer');
    wx.request({
      url: server + '/sleepstory/getbyauthorid',
      method: 'GET',
      data: {
        authorId: customer.id,
        pageNumber: pageNumber
      }
      , header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        var slist = that.data.storyList;
        slist=slist.concat(res.data);
        that.setData({
          storyList: slist,
          pageNumber: pageNumber
        })
      }
    });
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