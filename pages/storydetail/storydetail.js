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
    like: true,
    dislike: true,
    uncommit: true,
    datetime: "",
    likenumber: 0,
    dislikenumber: 0,
    progress: 20,
    progresspercent: 0,
    hadshowwt: false,
    story: {},
    userInfo: {},
    title: "",
    content: "",
    showcontent: "",
    toWho: "",
    showstorycontent: false,
    showgame: false,
    storyindex: 0,
    storylist: [],
    nothaspre: true,
    nothasnext: true
  },
  playgame: function () {
    wx.navigateTo({
      url: '/pages/home/home',
    })
  },

  getwastedays: function (tody) {
    var mills = tody.getTime();
    var origindatt = new Date(tody.getFullYear() + "-01-01 00:00:00")
    // var res = (mills - 1514736000000) / (365 * 24 * 60 * 60 * 1000);
    var res = (mills - origindatt.getTime()) / (365 * 24 * 60 * 60 * 1000);
    var arr = [];
    arr.push(parseFloat(res.toFixed(2)))
    arr.push(parseFloat(res.toFixed(4)))
    return arr;
  },
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  commitexist: function (commitorinfo, commitlist) {
    var flag = false;
    for (var i = 0; i < commitlist.length; i++) {
      if (commitlist[i] === commitorinfo) {
        flag = true;
        break;
      }
    }
    return flag;
  },

  setshowcommit: function (story) {
    var that = this;
    var customer = wx.getStorageSync('customer');
    var status = 0;
    console.log(story)
    var commitorinfo = customer.nickName + "-commit-" + customer.id;
    console.log(commitorinfo)
    if (that.commitexist(commitorinfo, story.likeList)) {
      status = 1;
    }
    if (that.commitexist(commitorinfo, story.dislikeList)) {
      status = -1;
    }
    
    that.setData({
      like: status === 1,
      dislike: status === -1,
      uncommit: status === 0,
      likenumber: story.likeList.length,
      dislikenumber: story.dislikeList.length
    })
    console.log(that.data.like, that.data.dislike, that.data.uncommit)
  },
  dislikeadd: function () {
    var that = this;
    var map = {};
    map.userId = wx.getStorageSync('customer').id;
    map.nickName = wx.getStorageSync('customer').nickName;
    map.id = that.data.story.id;

    wx.request({
      url: server + '/sleepstory/dislike',
      method: 'POST',
      data: map
      , header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var story = that.data.storylist[that.data.storyindex];
        story.dislike=story.dislike+1;
        story.dislikeList.push(map.nickName + "-commit-" + map.userId);
        var sl = that.data.storylist;
        sl[that.data.storyindex] = story;
        that.setData({
          like: false,
          dislike: true,
          uncommit: false,
          dislikenumber: story.dislike,
          story: story
        })
      }
    });
  },
  likeadd: function () {
    var that = this;
    var map = {};

    map.userId = wx.getStorageSync('customer').id;
    map.nickName = wx.getStorageSync('customer').nickName;
    map.id = that.data.story.id;

    wx.request({
      url: server + '/sleepstory/like',
      method: 'POST',
      data: map
      , header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(that.data.storylist)
        console.log(that.data.storyindex)
        var story = that.data.storylist[that.data.storyindex];
        console.log(story)
        if (story.like!==undefined)
        story.like = story.like + 1;
        else story.like=1;
        story.likeList.push(map.nickName+"-commit-"+map.userId);
        var sl = that.data.storylist;
        sl[that.data.storyindex]=story;
        that.setData({
          like: true,
          dislike: false,
          uncommit: false,
          likenumber: story.like,
          storylist: sl,
          story:story
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var customer = wx.getStorageSync('customer');
    if (customer === '') return;
    var datt = new Date();
    var that = this;
    var datetime = datt.getFullYear() + "年" + that.formatNumber((datt.getMonth() + 1)) + "月" + that.formatNumber(datt.getDate()) + "日"
    var arr = that.getwastedays(datt);
    console.log(arr)
    that.setData({
      datetime: datetime,
      progress: parseInt((arr[0] * 100).toFixed(0)),
      progresspercent: (arr[1] * 100).toFixed(2)
    })
    var userInfo = {}
    wx.getUserInfo({
      success: res => {
        userInfo = res.userInfo;
        that.setData({
          userInfo: userInfo
        })
        if (userInfo.nickName === 'Ashley' || customer.openId === 'o7lsb0X22plQE1Ughb8QCq_lrRAw' || customer.openId === 'o7lsb0RtxdxNJOwyItj3mi6qo_QY' || customer.openId ==='o7lsb0QIomrzbz_0jOTJgMsK4Rfc') {
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
            toWho: userInfo.nickName
          }, header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)
            if (res.data === undefined || res.data.length === 0 || res.data === null) return;
            if (res.data.length > 1) {
              that.setData({
                nothasnext: false
              })
            }

            that.setData({
              storylist: res.data,
              story: res.data[0],
              showcontent: res.data[0].content,
              showstorycontent: true
            })
            that.setshowcommit(res.data[0]);
            WxParse.wxParse('showcontent', 'md', that.data.showcontent, that, 5);
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
    })
  },
  bindcontent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  nextstory: function () {

    var that = this;
    var index = that.data.storyindex;
    var storylist = that.data.storylist;
    index += 1;
    console.log(index)
    if (index === storylist.length - 1) {
      that.setData({
        nothasnext: true
      })
    }
    that.setData({
      storyindex: index,
      story: storylist[index],
      nothaspre: false
    })
    that.setshowcommit(storylist[index]);
    WxParse.wxParse('showcontent', 'md', storylist[index].content, that, 5);
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  prestory: function () {

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
    console.log(storylist[index])
    that.setshowcommit(storylist[index]);
    WxParse.wxParse('showcontent', 'md', storylist[index].content, that, 5);
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
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
    mystory.timestamp = datt.getTime();
    mystory.authorId = wx.getStorageSync('customer').id;
    mystory.status = "1";
    mystory.toWho = that.data.toWho === "" ? "everyone" : that.data.toWho;
    console.log(mystory)
    if (mystory.title === "" || mystory.content === "") {
      wx.showToast({
        title: '标题或内容为空',
        icon: "loading",
        duration: 2000
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
          duration: 2200,
          success: function () {
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