//index.js
//获取应用实例
const app = getApp()
// var server = "https://api.mengqipoet.cn"
var server = "http://localhost:8080"
var base64 = require("../../utils/base64");
Page({
  data: {
    bgi: "",
    pxname: "",
    pxicon: "",
    dogicon: "",
    dogname: "",
    index: 0,
    hiddendog: true,
    hiddenpx: true
  },
  confirmdog: function () {
    this.setData({
      hiddendog: true
    })
  },
  confirmpx: function (e) {
    this.setData({
        hiddenpx: true
      })
  },
  binddogname: function (e) {
    this.setData({
      dogname: e.detail.value
    })
  },
  bindpxname: function (e) {
    this.setData({
      pxname: e.detail.value
    })
  },
  namepx: function () {
    this.setData({
        hiddenpx: false
      })
  },
  namedog: function () {
    this.setData({
      hiddendog: false
    })
  },
  startgame:function(){
    var dog={}
    var px={}
    var that=this;
    var customer = wx.getStorageSync('customer')
    dog.name=that.data.dogname;
    px.name=that.data.pxname;
    px.userId = customer.id;
    dog.userId = customer.id;
    px.type=0;
    dog.type=1;
    var petIdList=[];
    wx.request({
      method:"POST",
      url: server +"/pet/add",
      data: dog, 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        petIdList.push(res.data.id)
        wx.request({
          method: "POST",
          url: server + "/pet/add",
          data: px,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data);
            petIdList.push(res.data.id)
            customer.petIdList = petIdList;
            console.log(customer)
            wx.request({
              method: "GET",
              url: server + "/customer/get",
              data: {id:customer.id},
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                wx.setStorageSync('customer', res.data)
                wx.reLaunch({
                  url: '/pages/home/home',
                })
              }
            })
          }
        })
      }
    })
    
    
  },
  onLoad: function () {
    this.setData({
      bgi: base64.luckycatbgi
    })
  },
  changeIndex: function () {
    this.setData({
      index: this.data.index + 1
    })
  },
  onShow: function () {
    this.setData({
      index: 0
    })
  }
})
