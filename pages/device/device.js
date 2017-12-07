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
    console.log("sid=" + appInstance.globalData. sid);
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
  listItem_click: function (e) {
    //showDeviceDetail(e.currentTarget.dataset.item);
    //console.log(e);
    var json = JSON.stringify(e.currentTarget.dataset.item);
    //console.log('../device_detail/detail?item=' + json);
    wx.navigateTo({
      url: '../device_detail/detail?item=' + json,
    })
  },
  scan_click:function(event) {
    wx.scanCode({
      success:function(result) {
        console.log(result);
        wx.showModal({
          title: result.scanType,
          content: result.result,
          confirmText:"搜索",
          success:function(event) {
            if (event.confirm) {
              pageInstance.setData({
                inputValue:result.result
              });
              searchKey(result.result);
            }
          }
        })
      },fail:function(error) {
        console.log(error);
        wx.showModal({
          title: "fail",
          content: error.errMsg,
          showCancel:false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("page_device:" + options);
    // console.log("page_device:" + options.query);
    httpclient = new HttpClient.HttpClient();
    pageInstance = this;
    console.log("device page onLoad");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("device page onReady");
  },
  onShow: function () {
    console.log("device page onShow");
    if (memoryCacheList == null || memoryCacheList.length == 0) {
      search();
    }
  },
  onHide: function () {
    console.log("device page onHide");
  },
  onUnload: function () {
    console.log("device page onUnload");
    httpclient = null;
  },
  onPullDownRefresh: function () {
    console.log("device page onPullDownRefresh");
  },
  onReachBottom: function () {
    console.log("device page onReachBottom");
  },
  onShareAppMessage: function () {
    console.log("device page onShareAppMessage");
  }
});

function loginEesee() {
  var urlBuilder = new Request.Request()
    .setBaseUrl("https://api.eeseetech.com/")
    .setData("{\"username\":\"eesee\",\"password\":\"98813dc2c0dd3681eac32819a6d730ff\",\"production\":\"router\"}")
    .setService("User.Login")
    .setSite("eesee");
  var url = urlBuilder.buildUrlWithSid();
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
  var url = urlBuilder.buildUrlWithSid();
  console.log(url);
  wx.showLoading({
    title: '加载中',
  })
  httpclient.request(url, function success(responseData) {
    wx.hideLoading()
    if (responseData.code == 0 && responseData.data != null) {
      memoryCacheList = responseData.data;
      pageInstance.setData({
        //deviceList: [responseData.data[0], responseData.data[1]]
        deviceList: memoryCacheList.slice(3200)
      })
    } else if (responseData.code == 255) {
      wx.showModal({
        title: '未登录',
        content: '请先登录',
        showCancel:false,
        success: function (result) {
          if (result.confirm) {
            appInstance.globalData.sid="";
            wx.switchTab({
              url: '../user/user',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '失败',
        content: responseData.msg,
        showCancel: false,
      })
    }
  }, function fail(error) {
    wx.hideLoading();
    console.log(error);
    wx.showModal({
      title: '失败',
      content: "" + error,
      showCancel: false,
    })
  });
}

function searchKey(key) {
  if (key == "") {
    return;
  }
  var resultList = [];
  for (let i = 0; i < memoryCacheList.length; i++) {
    if (memoryCacheList[i].routename != null && (memoryCacheList[i].routename.indexOf(key) != -1 || memoryCacheList[i].mac_address.indexOf(key) != -1)) {
      resultList.push(memoryCacheList[i]);
      console.log(memoryCacheList[i]);
    }
  }
  wx.showModal({
    title: '结果',
    content: '查询到' + resultList.length + "条记录",
    showCancel:false
  })
  pageInstance.setData({
    deviceList: resultList
  })
}
