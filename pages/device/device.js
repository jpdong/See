// pages/test.js
var HttpClient = require("../http/httpclient.js");
var Request = require("../http/request.js");
var httpclient;
var appInstance = getApp();
var pageInstance;
var memoryCacheList;
Page({
  data: {
    deviceList: [],
    inputShowed: false,
    inputValue: ""
  },
  btn_request: function () {
    console.log("sid=" + appInstance.globalData.sid);
    loginEesee();
  },
  btn_search: function () {
    search();
  },
  input_car: function (e) {
    console.log("input finish")
    this.setData({
      inputValue: e.detail.value
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  input_searchKey: function (e) {
    searchKey(e.detail.value);
  },
  listItem_click:function(e) {
    //showDeviceDetail(e.currentTarget.dataset.item);
    console.log(e);
    console.log(e.currentTarget.dataset.item);
    var json = JSON.stringify(e.currentTarget.dataset.item);
    console.log(json);

    console.log('../device_detail/detail?item=' + json);
    wx.navigateTo({
      url: '../device_detail/detail?item=' + json,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("page_device:" + options);
    console.log("page_device:" + options.query);
    httpclient = new HttpClient.HttpClient();
    pageInstance = this;
    console.log("onLoad" + httpclient.value);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    search();
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {
    httpclient = null;
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
});

function loginEesee() {
  var urlBuilder = new Request.Request()
    .setBaseUrl("https://api.eeseetech.com/")
    .setData("{\"username\":\"eesee\",\"password\":\"98813dc2c0dd3681eac32819a6d730ff\",\"production\":\"router\"}")
    .setService("User.Login")
    .setSite("eesee");
  var url = urlBuilder.buildUrl();
  console.log(url);
  httpclient.request(url, function success(responseData) {
    if (responseData.data.sid != null) {
      appInstance.globalData.sid = responseData.data.sid;
    }
  }, function fail(error) {
    console.log(error);
  });
}

function search() {
  var urlBuilder = new Request.Request()
    .setBaseUrl("https://api.eeseetech.com/")
    .setData("{\"startno\":\"100\",\"counter\":\"100\"}")
    .setService("Router.Lists")
    .setSite("router");
  var url = urlBuilder.buildUrl();
  console.log(url);
  wx.showLoading({
    title: '加载中',
  })
  httpclient.request(url, function success(responseData) {
    wx.hideLoading()
    if (responseData.data != null) {
      memoryCacheList = responseData.data;
      appInstance.globalData.memoryCacheList = memoryCacheList;
      pageInstance.setData({
        //deviceList: [responseData.data[0], responseData.data[1]]
        deviceList: memoryCacheList.slice(3200)
      })
    }
  }, function fail(error) {
    wx.hideLoading()
    console.log(error);
  });
}

function searchKey(key) {
  if (key == "") {
    return;
  }
  var resultList = [];
  for(let i = 0;i< memoryCacheList.length;i++) {
    if (memoryCacheList[i].routename != null && memoryCacheList[i].routename.indexOf(key) != -1) {
      resultList.push(memoryCacheList[i]);
      console.log(memoryCacheList[i]);
    }
  }
  pageInstance.setData({
    deviceList:resultList
  })
}
