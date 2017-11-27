// pages/bluetooth_device/bluetoothdevice.js
var util = require("../../utils/util.js");
var mBluetoothdevice;
var pageInstance;
Page({
  data: {
    bluetoothdevice: {},
    serviceList: [],
    characteristicList: [],
    connecting: false,
    dataFromBarcode: "",
    dataFromDevice: "",
    underSetting:false
  },
  btn_connect: function () {
    if (!this.data.connecting) {
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
    } else {
      console.log("connect already connecting");
    }
  },
  service_click: function (event) {
    //util.toast("service:");
    //util.toast("service:" + JSON.stringify(event.currentTarget.dataset.service));
    getCharacteristics(event.currentTarget.dataset.service.uuid);
  },
  btn_read: function (event) {
    readDataFromC1();
  },
  btn_write2: function (event) {
    writeDataToC2(data);
  },
  btn_write3: function () {
    writeDataToC3(1);
  },
  btn_disconnect: function (event) {
    disconnectBLE();
  },
  scan_click: function (event) {
    wx.scanCode({
      success: function (result) {
        console.log(result);
        wx.showModal({
          title: result.scanType,
          content: result.result,
          success: function (event) {
            if (event.confirm) {
              pageInstance.setData({
                dataFromBarcode: result.result
              });
            }
          }
        })
      }, fail: function (error) {
        console.log(error);
        wx.showModal({
          title: "fail",
          content: error.errMsg,
          showCancel: false
        })
      }
    })
  },
  onLoad: function (options) {
    pageInstance = this;
    mBluetoothdevice = JSON.parse(options.bluetoothdevice);
    this.setData({
      bluetoothdevice: JSON.parse(options.bluetoothdevice)
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () {
    disconnectBLE();
  },
  onUnload: function () {
    disconnectBLE();
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});

function getDeviceServices(deviceId) {
  //util.toast("getDevice:" + deviceId);
  wx.getBLEDeviceServices({
    deviceId: deviceId,
    success: function (res) {
      getCharacteristics("0000EE00-0000-1000-8000-00805F9B34FB");
      console.log("getDeviceServices:" + JSON.stringify(res.services));
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
      console.log("getCharacteristics:" + JSON.stringify(res.characteristics));
      writeDataToC3(1);
      pageInstance.setData({
        characteristicList: res.characteristics
      })
    },
    fail: function (res) {
      util.toast("get characteristic fail:" + JSON.stringify(res));
    }
  })
}

function disconnectBLE() {
  console.log("disconnect BLE:underSetting = " + pageInstance.data.underSetting);
  console.log("disconnect BLE:mUnderSetting = " + mUnderSetting);
  if (mUnderSetting) {
    writeDataToC3(3);
    pageInstance.data.underSetting = false;
    return;
  }
  if (pageInstance.data.connecting) {
    wx.closeBLEConnection({
      deviceId: mBluetoothdevice.deviceId,
      success: function (res) {
        pageInstance.setData({
          connecting: false
        })
        console.log("close connect success");
      },
      fail: function (res) {
        console.log("close connect fail");
      }
    })
  }
}

function writeDataToC3(data) {
  let buffer = new ArrayBuffer(1)
  let intArray = new Uint8Array(buffer);
  intArray[0] = data;
  wx.writeBLECharacteristicValue({
    deviceId: mBluetoothdevice.deviceId,
    serviceId: "0000EE00-0000-1000-8000-00805F9B34FB",
    characteristicId: '0000EE03-0000-1000-8000-00805F9B34FB',
    value: buffer,
    success: function (res) {
      console.log("write to 3 success");
      if (data == 1) {
        pageInstance.data.underSetting = true;
        readDataFromC1();
      } else if (data == 2) {
      
      }
    },
    fail: function (res) {
      console.log("write to 3 fail:" + JSON.stringify(res));
    }
  })
}

function writeDataToC2(data) {
  //let someString = "fffe1234abcdabcdabcdabcd1234567812345678";
  //let s2 = "1234";
  var arrayBuffer = new ArrayBuffer(data.length / 2);
  var intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < data.length / 2; i++) {
    intArray[i] = parseInt(data.substring(2 * i, 2 * i + 2), 16);
  }
  console.log(intArray);
  wx.writeBLECharacteristicValue({
    deviceId: mBluetoothdevice.deviceId,
    serviceId: "0000EE00-0000-1000-8000-00805F9B34FB",
    characteristicId: "0000EE02-0000-1000-8000-00805F9B34FB",
    value: arrayBuffer,
    success: function (res) {
      console.log('write to C2 success', res.errMsg);
    },
    fail: function (res) {
      console.log("write to C2 fail:" + JSON.stringify(res));
    }
  })
}

function readDataFromC1() {
  wx.onBLECharacteristicValueChange(function (characteristic) {
    console.log('characteristic value:', JSON.stringify(characteristic));
    //console.log('characteristic value :', ab2str(characteristic.value));
    var intArray = new Uint8Array(characteristic.value);
    console.log(intArray.toString(16));
    var s = "";
    for (let i = 0; i < intArray.length; i++) {
      s = s.concat(intArray[i].toString(16));
    }
    console.log(s);
    pageInstance.setData({
      dataFromDevice:s
    })
  })
  wx.readBLECharacteristicValue({
    deviceId: mBluetoothdevice.deviceId,
    serviceId: "0000EE00-0000-1000-8000-00805F9B34FB",
    characteristicId: '0000EE01-0000-1000-8000-00805F9B34FB',
    success: function (res) {
      console.log("read value success:" + JSON.stringify(res));
    },
    fail: function (res) {
      util.toast("read value fail:" + JSON.stringify(res));
    }
  })
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  console.log("str2ab:" + str.length);
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}