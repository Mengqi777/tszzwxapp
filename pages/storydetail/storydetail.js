// pages/storydetail/storydetail.js
var server = "https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
var util = require("../../utils/util");
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress:20,
    progresspercent:0,
    hadshowwt: false,
    story: {},
    userInfo: {},
    title: "",
    content: "",
    showcontent:"",
    toWho: "",
    showstorycontent:false,
    showgame: false,
    storyindex:0,
    storylist:[],
    nothaspre:true,
    nothasnext: true
  },
  playgame: function () {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },
  
getwastedays:function(tody){
   var mills= tody.getTime();
   var res = (mills - 1514736000000) / (365 * 24 * 60 * 60 * 1000);
   var arr=[];
   arr.push(parseFloat(res.toFixed(2)))
   arr.push(parseFloat(res.toFixed(4)))
   return arr;
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var customer = wx.getStorageSync('customer');
    if (customer === '') return;
    var datt = new Date();
    var that = this;
    var arr=that.getwastedays(datt);
    console.log(arr)
    that.setData({
      progress: arr[0]*100,
      progresspercent:arr[1]*100
    })
    var userInfo={}
    wx.getUserInfo({
      success: res => {
        userInfo = res.userInfo;
        that.setData({
          userInfo: userInfo
        })
        if (userInfo.nickName === 'Ashley' || customer.id === '5a82819ee4a6be01107708fc') {
          that.setData({
            showgame: true
          })
        }
        var loginlogs = {};
        loginlogs.userInfo = res.userInfo;
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
        

        wx.request({
          url: server + '/sleepstory/getbytimestamp',
          method: 'GET',
          data: {
            timestamp: datt.getTime(),
            toWho:userInfo.nickName
          }, header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data ===undefined||res.data.length===0||res.data===null)return;
            if(res.data.length>1){
              that.setData({
                nothasnext:false
              })
            }
            that.setData({
              storylist: res.data,
              story:res.data[0],
              showcontent: res.data[0].content,
              showstorycontent:true
            })
            WxParse.wxParse('showcontent', 'md', that.data.showcontent , that, 5);
          }
        });
      }
    });
  },
  bindtitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindwho: function (e) {
    this.setData({
      toWho: e.detail.value
    })},
  bindcontent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  nextstory :function(){
   
  var that=this;
  var index = that.data.storyindex;
  var storylist = that.data.storylist;
  index+=1;
  console.log(index)
  if(index===storylist.length-1){
    that.setData({
      nothasnext:true
    })
  }
  that.setData({
    storyindex: index,
    story: storylist[index],
    nothaspre: false
  })
  WxParse.wxParse('showcontent', 'md', storylist[index].content, that, 5);
  },
  prestory:function(){

    var that = this;
    var index = that.data.storyindex;
    var storylist = that.data.storylist;
    index -= 1;
    console.log(index)
    if (index === 0) {
      that.setData({
        nothaspre: true
      })
    }
    that.setData({
      storyindex: index,
      story: storylist[index],
      nothasnext: false
    })
    WxParse.wxParse('showcontent', 'md', storylist[index].content, that, 5);
  },
  savestory: function () {
    var datt = new Date();
    var dt = util.formatTime(datt);
    var mystory = {}
    var that = this;
    mystory.dateTime = dt;
    mystory.author = that.data.userInfo.nickName;
    mystory.content = that.data.content;
    mystory.title = that.data.title;
    mystory.timestamp=datt.getTime();
    mystory.authorId=wx.getStorageSync('customer').id;
    mystory.status="1";
    mystory.toWho = that.data.toWho === "" ? "everyone" : that.data.toWho;
    console.log(mystory)
    if(mystory.title===""||mystory.content===""){
      wx.showToast({
        title: '标题或内容为空',
        icon:"loading",
        duration:2000
      })
      return;
    }
    wx.request({
      url: server + '/sleepstory/add',
      method: 'POST',
      data: mystory,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.showToast({
          title: '成功',
          duration:2200,
          success:function(){
            wx.reLaunch({
              url: '/pages/storydetail/storydetail',
            })
          }
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