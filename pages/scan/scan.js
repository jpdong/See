// pages/scan/scan.js
var util = require("../../utils/util.js");
var CryptoJS = require("../../utils/crypto-js.js");
var scheduleTask;
var pageInstance;
Page({
  data: {
    bluetoothList: [],
    discovering: false,
    opened: false,
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
  btn_test: function () {
    // scheduleTask = setInterval(function() {
    //   console.log("run");
    // },5000)
    wx.openSetting({
      success:function(res){
        console.log(JSON.stringify(res));
      },
      fail:function(res) {
        console.log(JSON.stringify(res));
      }
    })
  },
  onLoad: function (options) {
    pageInstance = this;
  },
  onReady: function () { },
  onShow: function () { 
    console.log("onShow");
    checkBluetoothState();
    scheduleTask = setInterval(checkBluetoothState,10000);
  },
  onHide: function () {
    console.log("onHide");
    stopDiscovering();
    clearInterval(scheduleTask);
   },
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
      //util.toast("open success:" + JSON.stringify(res));
      console.log("open success:" + JSON.stringify(res));
      startScan();
      pageInstance.setData({
        opened: true
      })
    },
    fail: function (res) {
      //util.toast("open fail:" + JSON.stringify(res));
      console.log("open fail:" + JSON.stringify(res));
      if (res.errCode == 10001) {
        wx.showToast({
          title: '蓝牙未开启',
          image:"../../images/image_no_bluetooth.png",
          duration:5000
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
      //util.toast("scan success:" + JSON.stringify(res));
      console.log("scan success:" + JSON.stringify(res));
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
        if (res.devices[i].name == "ESetup") {
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
    if (res.devices[0].name != "ESetup") {
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
          opened: false
        });
        console.log("close bluetooth success");
      },
      fail: function (res) {
        console.log("close bluetooth fail:" + JSON.stringify(res));
      }
    })
  }
}

function checkBluetoothState() {
  console.log("checkBlurtoothState")
  wx.getBluetoothAdapterState({
    success: function (res) {
      console.log("check bluetooth state:discovering:" + res.discovering, "available:" + res.available);
      if (res.available) {
        if (!pageInstance.data.discovering) {
          startScan();
        }
      } else {
        openBluetooth();
      }
      // if (!res.available) {
      //   wx.showModal({
      //     title: '蓝牙未开启',
      //     content: '请手动打开蓝牙',
      //     showCancel: false
      //   })
      // } else {
      //   pageInstance.data.opened = true;
      //   pageInstance.setData({
      //     discovering: res.discovering,
      //   })
      // }

    },
    fail: function (res) {
      console.log("check bluetooth state fail:" + JSON.stringify(res));
      openBluetooth();
    }
  })
}

function testAES() {
  var str = "0630AEA445C76800";
  //var key = "e$Tech1";
  var key = "e$Tech1";
  //var iv = CryptoJS.enc.Utf8.parse("12345678123456781234567812345678")
  var encrypted = CryptoJS.DES.encrypt(str, CryptoJS.enc.Utf8.parse(key), {
    //iv:iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  });
  console.log(encrypted.toString());
  console.log(encrypted.ciphertext.toString());
  var encryptedHexStr = CryptoJS.enc.Hex.parse("877cD140B04A5CBB8C5E1D4B8E0D88FA");
  //var encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString());
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypted = CryptoJS.DES.decrypt(encryptedBase64Str, CryptoJS.enc.Utf8.parse(key), {
    //var decrypted = CryptoJS.DES.decrypt("f560b1b38a8baoa6a05cc7abe2b2e459", "e$Tech1", {
    //iv:iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  });
  console.log(decrypted.toString());
  console.log(CryptoJS.enc.Utf8.stringify(decrypted));
}