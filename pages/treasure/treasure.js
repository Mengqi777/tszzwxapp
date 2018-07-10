// pages/treasure/treasure.js
var server = "https://api.mengqipoet.cn"
// var server = "http://localhost:8080"
const appIns=getApp()
var util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titles: [],
    temps: [],
    shows: [],
    treasures: [],
    
  },
  playaudio:function(e){

    var innerac = appIns.globalData.innerac;
    innerac.pause();

    if(this.audioCtx){
      if (this.audioCtx.audioId === e.target.dataset.aid){
      this.audioCtx.play();
      return;
      }else{
        this.audioCtx.setSrc(e.target.dataset.aid);
      }
    }
    this.audioCtx = wx.createAudioContext('myaudio');
    this.audioCtx.setSrc(e.target.dataset.aid)
    this.audioCtx.play()
   
  },
  pauseaudio:function(e){
    this.audioCtx.pause();
    var innerac = appIns.globalData.innerac;
    innerac.play();
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
    loginlogs.page = "/pages/treasure/treasure";
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
    var treasures = wx.getStorageSync('customer').treasures || [];
    var temps = [];
    for (var i = 0; i < 10; i++) {
      if (i === treasures.length) break;
      temps.push(treasures[i])
    }
  
    // console.log(temps);
    var titles = that.getTitles(temps);
    console.log(titles)
    var sortedbytitle = that.sortbytitle(titles, temps);
    console.log(sortedbytitle);
    var sortedlist = that.sortbysequence(sortedbytitle);
    sortedlist = that.sorttext(sortedlist)
    console.log(sortedlist);
    that.setData({
      treasures: treasures,
      temps: temps,
      shows: sortedlist
    })
  
  },
  getmore: function () {
    var that = this;
    var lenth = that.data.temps.length + 10;
    var temps = [];
    for (var i = 0; i < lenth; i++) {
      if (i === that.data.treasures.length) break;
      temps.push(that.data.treasures[i])
    }
    var titles = that.getTitles(temps);
    var sortedbytitle = that.sortbytitle(titles, temps);
    var sortedlist = that.sortbysequence(sortedbytitle);
    sortedlist = that.sorttext(sortedlist)
    that.setData({
      temps: temps,
      shows: sortedlist
    })
  },
  getTitles: function (arr) {
    var that=this;
    var t = [];
    for (var i = 0; i < arr.length; i++) {
      if (!that.contains(t,arr[i].title)){
        t.push(arr[i].title)
      }
    }
    return t;
  },
  contains:function(arr,obj){
    var containsflag=false;
    for(var i=0;i<arr.length;i++){
      if(arr[i]==obj){
        containsflag=true;
        break;
      }
    }
    return containsflag;
  },


  sortbysequence: function (arr) {
    // console.log(typeof(arr))
    // console.log(arr)
    for (var i = 0; i < arr.length; i++) {
      arr[i].imgurilist.sort()
    }
    return arr;
  },

  sorttext:function(arr){
    for (var i = 0; i < arr.length; i++) {
      arr[i].textlist.sort()
    }
    for (var i = 0; i < arr.length; i++) {
      for(var j=0;j<arr[i].textlist.length;j++){
        if (arr[i].textlist[j]!==""){
          arr[i].textlist[j] = arr[i].textlist[j].split(".")[1]
        }
      }
    }
    return arr;
  },

  sortbytitle: function (titles, temps) {
    var typelist = []
    var sortedbytitle = [];
    for (var i = 0; i < titles.length; i++) {
      var treasure = {
        title: "",
        textlist: [],
        imgurilist:[],
        texts:"",
        audioUri:"",
        videoUri:"",
        typeCode:-1
      }
      treasure.title = titles[i];
      for (var j = 0; j < temps.length; j++) {
        if (temps[j].title === titles[i]) {
          treasure.textlist.push(temps[j].text);
          treasure.imgurilist.push(server + '/static'+temps[j].imgUri);
          treasure.audioUri = server + '/static' +temps[j].audioUri;
          treasure.videoUri = server + '/static' + temps[j].videoUri;
          treasure.typeCode = temps[j].type;
        }
      }
      sortedbytitle.push(treasure);
    }
    return sortedbytitle;
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