// pages/scan/scan.js
var util = require("../../utils/util.js");
var pageInstance;
Page({
  data: {
    bluetoothList: [],
    discovering:false
  },
  btn_open_bluetooth: function () {
    openBluetooth();
  },
  bluetoothdevice_click: function (event) {
    //util.toast(JSON.stringify(event.currentTarget.dataset.bluetoothdevice));
    stopDiscovering(this.discovering);
    wx.navigateTo({
      url: '../bluetooth_device/bluetoothdevice?bluetoothdevice=' + JSON.stringify(event.currentTarget.dataset.bluetoothdevice),
    })
  },
  onLoad: function (options) { pageInstance = this },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () {
    stopDiscovering();
    wx.closeBluetoothAdapter({
      success: function (res) {
      },
      fail: function (res) {
        util.toast("close bluetooth adapter fail:" + JSON.stringify(res));
      }
    })
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});

function openBluetooth() {
  wx.openBluetoothAdapter({
    success: function (res) {
      //util.toast("open success:" + JSON.stringify(res));
      startScan();
    },
    fail: function (res) {
      //util.toast("open fail:" + JSON.stringify(res));
      if (res.errCode == 10001) {
        wx.showModal({
          title: '蓝牙未开启',
          content: '请手动打开蓝牙',
          showCancel: false,
        })
      }
    }
  });
}

function startScan() {
  pageInstance.setData({
    discovering: true
  })
  wx.startBluetoothDevicesDiscovery({
    success: function (res) {
      util.toast("scan success:" + JSON.stringify(res));
      getDevices();
    },
    fail: function (res) {
      util.toast("scan fail:" + JSON.stringify(res));
    }
  })
}

function getDevices() {
  wx.getBluetoothDevices({
    success: function (res) {
      var eeseeDevice = [];
      for (let i = 0; i < res.devices.length; i++) {
        if (res.devices[i].name.indexOf("ESetup") != -1) {
          eeseeDevice.push(res.devices[i]);
        }
      }
      pageInstance.setData({
        bluetoothList: eeseeDevice
      })
    },
    fail: function (res) {
      util.toast("get devices fail:" + JSON.stringify(res));
    }
  });
  // wx.onBluetoothDeviceFound(function(res){
  //   var eeseeDevice = [];
  //   for (let i = 0; i < res.devices.length; i++) {
  //     if (res.devices[i].name.indexOf("ESetup") != -1) {
  //       eeseeDevice.push(res.devices[i]);
  //     }
  //   }
  //   pageInstance.setData({
  //     bluetoothList: eeseeDevice
  //   })
  // })

}
function stopDiscovering() {
  if (pageInstance.discovering) {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        pageInstance.setData({
          discovering: false,
        })
      },
      fail: function (res) {
        util.toast("stop scan fail:" + JSON.stringify(res));
      }
    })
  }
}