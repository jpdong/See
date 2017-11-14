// pages/bluetooth_device/bluetoothdevice.js
var util = require("../../utils/util.js");
var mBluetoothdevice;
var pageInstance;
Page({
  data: {
    bluetoothdevice: {},
    serviceList: [],
    characteristicList: [],
    connecting: false
  },
  btn_connect: function () {
    //util.toast("test:" + JSON.stringify(this.bluetoothdevice));
    //util.toast("test:" + JSON.stringify(mBluetoothdevice));
    //util.toast(""+mBluetoothdevice.deviceId);
    wx.createBLEConnection({
      deviceId: mBluetoothdevice.deviceId,
      success: function (res) {
        //util.toast("connect success:" + JSON.stringify(res));
        pageInstance.setData({
          connecting: true
        })
        getDeviceServices(mBluetoothdevice.deviceId);
      },
      fail: function (res) {
        util.toast("connect fail:" + JSON.stringify(res));
      }
    })
  },
  service_click: function (event) {
    //util.toast("service:");
    //util.toast("service:" + JSON.stringify(event.currentTarget.dataset.service));
    getCharacteristics(event.currentTarget.dataset.service.uuid);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageInstance = this;
    mBluetoothdevice = JSON.parse(options.bluetoothdevice);
    this.setData({
      bluetoothdevice: JSON.parse(options.bluetoothdevice)
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
    if (pageInstance.connecting) {
      wx.closeBLEConnection({
        deviceId: mBluetoothdevice.deviceId,
        success: function (res) { },
        fail: function (res) {
        }
      })
    }
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
function getDeviceServices(deviceId) {
  //util.toast("getDevice:" + deviceId);
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function (res) {
      pageInstance.setData({
        serviceList: res.services
      })
    },
    fail: function (res) {
      util.toast("get service fail:" + JSON.stringify(res));
    }
  })
}

function getCharacteristics(serviceId) {
  wx.getBLEDeviceCharacteristics({
    deviceId: mBluetoothdevice.deviceId,
    serviceId: serviceId,
    success: function (res) {
      pageInstance.setData({
        characteristicList: res.characteristics
      })
    },
    fail: function (res) {
      util.toast("get characteristic fail:" + JSON.stringify(res));
    }
  })
}