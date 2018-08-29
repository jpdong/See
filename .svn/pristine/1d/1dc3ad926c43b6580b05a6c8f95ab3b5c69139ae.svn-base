// pages/login/login.js
var md5 = require("../../utils/md5.js");
var HttpClient = require("../http/httpclient.js");
var Request = require("../http/request.js");
var appInstance = getApp();
var globalData = appInstance.globalData;
var httpclient;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rememberPassword: false,
    account:"",
    password:"",
    passwordMd5:"",
  },
  btn_login: function () {
    loginEesee(this.account, this.passwordMd5);
  },
  input_account: function (event) {
    this.account = event.detail.value;
    appInstance.globalData.userInfo.username = this.account;
  },
  input_password: function (event) {
    this.password = event.detail.value;
    this.passwordMd5 = md5.hex_md5(this.password);
  },
  switch_change: function (event) {
    this.rememberPassword = event.detail.value;
    if (this.rememberPassword) {
      rememberPassword(this.passwordMd5);
    } else {
      clearPassword();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    httpclient = new HttpClient.HttpClient();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      account: globalData.userInfo.username,
      passwordMd5: globalData.userInfo.passwordMd5,
    })
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
});
function loginEesee(account, passwordMd5) {
  var urlBuilder = new Request.Request()
    .setBaseUrl("https://api.eeseetech.com/")
    .setData("{\"username\":\"eesee\",\"password\":\"98813dc2c0dd3681eac32819a6d730ff\",\"production\":\"router\"}")
    //.setData("{\"username\":\"" + account + "\",\"password\":\"" + passwordMd5 + "\",\"production\":\"router\"}")
    .setService("User.Login")
    .setSite("eesee");
  var url = urlBuilder.buildUrlWithSid();
  console.log(url);
  httpclient.request(url, function success(responseData) {
    if (responseData.code == 0) {
      wx.showToast({
        title: '登录成功',
        icon: "success",
        duration: 1000
      })
      appInstance.globalData.sid = responseData.data.sid;
      // wx.navigateTo({
      //   url: '../user/user',
      // })
      wx.navigateBack({});
    } else {
      wx.showModal({
        title: '登录失败',
        content: responseData.msg,
        showCancel: false,
      });
    }
  }, function fail(error) {
    console.log(error);
    wx.showModal({
      title: '登录失败',
      content: error,
      showCancel: false,
    });
  });
}
function rememberPassword(passwordMd5) {
  appInstance.globalData.userInfo.passwordMd5 = passwordMd5;
}
function clearPassword() {
  this.password = "";
  this.passwordMd5 = "";
  globalData.passwordMd5 = "";
}
