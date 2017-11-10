// pages/user/user.js
var appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_name: "",
    isLogin:false
  },
  btn_toLogin:function(event) {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("user page onLoad");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("user page onReady");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("user page onShow");
    if (appInstance.globalData.sid == "") {
      this.setData({
        isLogin: false
      })
    } else {
      this.setData({
        isLogin: true,
        user_name: appInstance.globalData.userInfo.username,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("user page onHide");
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("user page onUnload");
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