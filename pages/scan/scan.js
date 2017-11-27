// pages/scan/scan.js
var util = require("../../utils/util.js");
var pageInstance;
Page({
  data: {
    bluetoothList: [],
    discovering: false,
    opened: false
  },
  btn_open: function (event) {
    openBluetooth();
  },
  btn_discovering_bluetooth: function () {
    startScan();
  },
  bluetoothdevice_click: function (event) {
    //util.toast(JSON.stringify(event.currentTarget.dataset.bluetoothdevice));
    //stopDiscovering();
    wx.navigateTo({
      url: '../bluetooth_device/bluetoothdevice?bluetoothdevice=' + JSON.stringify(event.currentTarget.dataset.bluetoothdevice),
    })
  },
  btn_stop: function (event) {
    stopDiscovering();
  },
  btn_close: function (event) {
    console.log("btn_close:" + this.data.opened);
    if (this.data.opened) {
      closeBluetooth();
    }
  },
  btn_test:function(){
    var s = "fe";
    var arrayBuffer = new ArrayBuffer(20);
    //var dataView = new DataView(arrayBuffer);
    var x2 = new Uint8Array(arrayBuffer);
    x2[0] = 0xff;
    x2[1] = 0xfe;
    console.log(x2[0]);
    console.log(x2[0].toString(16));
    console.log(parseInt(s,16));
    console.log(x2.toString(16));
    let someString = "fffe1234abcdabcdabcdabcd1234567812345678";
    var arrayBuffer = new ArrayBuffer(20);
    var intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < someString.length / 2; i++) {
      intArray[i] = parseInt(someString.substring(2 * i, 2 * i + 2), 16);
    }
    console.log(intArray);
    //console.log(parseInt(someString, 16));
    console.log(arrayBuffer);
  },
  onLoad: function (options) {
    pageInstance = this;
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () {
    //stopDiscovering();
    closeBluetooth();

  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});

function openBluetooth() {
  wx.openBluetoothAdapter({
    success: function (res) {
      util.toast("open success:" + JSON.stringify(res));
      pageInstance.setData({
        opened: true
      })
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
    discovering: true,
    bluetoothList: []
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
      console.log("get devices:" + JSON.stringify(res));
      var eeseeDevice = [];
      for (let i = 0; i < res.devices.length; i++) {
        if (res.devices[i].name != "") {
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
  wx.onBluetoothDeviceFound(function (res) {
    console.log("on found:" + JSON.stringify(res));
    if (res.devices[0].name == "") {
      return;
    }
    var eeseeDevice = pageInstance.data.bluetoothList;
    eeseeDevice.push(res.devices[0]);
    //pageInstance.data.bluetoothList.push(res.devices[0]);
    //eeseeDevice = pageInstance.bluetoothList;
    pageInstance.setData({
      bluetoothList: eeseeDevice
    })
  })

}
function stopDiscovering(discovering) {
  console.log("stop scan:" + pageInstance.data.discovering);
  if (pageInstance.data.discovering) {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log("stop scan:success:" + JSON.stringify(res));
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

function closeBluetooth() {
  if (pageInstance.data.opened) {
    wx.closeBluetoothAdapter({
      success: function (res) {
        pageInstance.setData({
          opened:false
        });
        console.log("close bluetooth success");
      },
      fail:function(res) {
        console.log("close bluetooth fail:" + JSON.stringify(res));
      }
    })
  }
}

function checkBluetoothState() {
  wx.getBluetoothAdapterState({
    success: function(res) {
      console.log("check bluetooth state:discovering:" + res.discovering,"available:" + res.available);
      if (!res.available) {
        wx.showModal({
          title: '蓝牙未开启',
          content: '请手动打开蓝牙',
          showCancel:false
        })
      } else {
        pageInstance.data.opened = true;
        pageInstance.setData({
          discovering:res.discovering,
        })
      }

    },
    fail:function (res) {
      console.log("check bluetooth state:" + res);
    }
  })
}