// pages/bluetooth_device/bluetoothdevice.js
var util = require("../../utils/util.js");
var CryptoJS = require("../../utils/crypto-js.js");
var HttpClient = require("../http/httpclient.js");
var Request = require("../http/request.js");
var httpclient;
var key = "e$Tech1";
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
    underSetting: false,
    name: "",
    phone: "",
    address: "",
    longitude: "",
    latitude: "",
    submitting: false,
    deviceModeChange: false
  },
  btn_connect: function () {
    console.log("connect " + this.data.connecting);
    if (!this.data.connecting) {
      wx.showLoading({
        title: '操作中',
      })
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
          wx.hideLoading();
          console.log("connect fail:" + JSON.stringify(res));
          util.toast("连接失败");
        }
      })
      wx.onBLEConnectionStateChange(function (res) {
        console.log("state:" + JSON.stringify(res));
      })
    } else {
      console.log("connect already connecting");
      util.toast("已连接");
    }
  },
  btn_disconnect: function (event) {
    disconnectBLE();
  },
  scan_click: function (event) {
    scanSN();
  },
  btn_test: function () {

  },
  input_name: function (event) {
    console.log("name:" + event.detail.value);
    pageInstance.data.name = event.detail.value;
  },
  input_phone: function (event) {
    console.log("phone:" + event.detail.value);
    pageInstance.data.phone = event.detail.value;
  },
  input_address: function (event) {
    console.log("address:" + event.detail.value);
    pageInstance.data.address = event.detail.value;
  },
  btn_submit: function () {
    console.log("submit click");
    pageInstance.setData({
      submitting: true
    })
    if (checkInput()) {
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          pageInstance.data.latitude = res.latitude;
          pageInstance.data.longitude = res.longitude;
          wx.showLoading({
            title: '操作中',
          })
          registerDevice();
        },
        fail: function (res) {
          //util.toast(JSON.stringify(res));
          pageInstance.setData({
            submitting: false
          })
          wx.showModal({
            title: '权限限制',
            content: '请允许小程序获得地理位置信息',
            confirmText: "设置",
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({});
              }
            },
            fail: function (res) {
              console.log(JSON.stringify(res));
            }

          })
        }
      })
    } else {
      pageInstance.setData({
        submitting: false
      })
      wx.showModal({
        title: '失败',
        content: '缺少必要信息',
        showCancel: false
      })
    }

  },
  onLoad: function (options) {
    pageInstance = this;
    getApp().globalData.bluetoothPage = this;
    console.log("bluetooth onLoad:" + JSON.stringify(this));
    httpclient = new HttpClient.HttpClient();
    mBluetoothdevice = JSON.parse(options.bluetoothdevice);
    this.setData({
      bluetoothdevice: JSON.parse(options.bluetoothdevice)
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () {
    console.log("bluetoothdevice onHide");
    //disconnectBLE();
  },
  onUnload: function () {
    console.log("bluetoothdevice onUnload");
    disconnectBLE();
  },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});

function scanSN() {
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
      console.log(JSON.stringify(error));
      util.toast("无数据");
    }
  })
}

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
      wx.hideLoading();
      pageInstance.setData({
        connecting: false
      })
      console.log("get service fail:" + JSON.stringify(res));
    }
  })
}

function getCharacteristics(serviceId) {
  wx.getBLEDeviceCharacteristics({
    deviceId: mBluetoothdevice.deviceId,
    serviceId: serviceId,
    success: function (res) {
      console.log("getCharacteristics:" + JSON.stringify(res.characteristics));
      writeDataToC3("1");
      pageInstance.setData({
        characteristicList: res.characteristics
      })
    },
    fail: function (res) {
      wx.hideLoading();
      pageInstance.setData({
        connecting: false
      })
      console.log("get characteristic fail:" + JSON.stringify(res));
    }
  })
}

function disconnectBLE() {
  console.log("disconnect BLE:underSetting = " + pageInstance.data.underSetting);
  // if (pageInstance.data.underSetting && !pageInstance.data.deviceModeChange) {
  //   writeDataToC3("3");
  //   pageInstance.data.underSetting = false;
  //   pageInstance.setData({
  //     connecting: false,
  //     underSetting: false
  //   })
  //   return;
  // }
  wx.closeBLEConnection({
    deviceId: mBluetoothdevice.deviceId,
    success: function (res) {
      pageInstance.setData({
        connecting: false,
      })
      console.log("close connect success");
    },
    fail: function (res) {
      console.log("close connect fail");
    }
  })

}

function writeDataToC3(str) {
  var data = encryptData(str);
  console.log("after encrypt:" + data);
  var arrayBuffer = new ArrayBuffer(data.length / 2);
  var intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < data.length / 2; i++) {
    intArray[i] = parseInt(data.substring(2 * i, 2 * i + 2), 16);
  }
  // let buffer = new ArrayBuffer(1)
  // let intArray = new Uint8Array(buffer);
  // intArray[0] = data;
  wx.writeBLECharacteristicValue({
    deviceId: mBluetoothdevice.deviceId,
    serviceId: "0000EE00-0000-1000-8000-00805F9B34FB",
    characteristicId: '0000EE03-0000-1000-8000-00805F9B34FB',
    value: arrayBuffer,
    success: function (res) {
      pageInstance.data.deviceModeChange = true;
      console.log("write to 3 success");
      if (str == "1") {
        //pageInstance.data.underSetting = true;
        pageInstance.setData({
          underSetting: true
        })
        readDataFromC1();
      } else if (str == "2") {
        wx.hideLoading();
        wx.showModal({
          title: '注册成功',
          content: '注册成功',
          showCancel:false,
          success:function(res) {
            if (res.confirm) {
              wx.navigateBack({});
            }
          }
        }); 
      }
    },
    fail: function (res) {
      wx.hideLoading();
      console.log("write to 3 fail:" + JSON.stringify(res));
      if (str == "1") {
        pageInstance.setData({
          connecting: false
        })
        util.toast("连接失败");
      } else if (str == "2") {
        util.toast("切换模式失败");
        pageInstance.setData({
          submitting: false
        })
      }

    }
  })
}

function writeDataToC2(str) {
  //let someString = "fffe1234abcdabcdabcdabcd1234567812345678";
  //let s2 = "1234";
  var data = encryptData(str);
  console.log("after encrypt:" + data);
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
      // //test
      // wx.hideLoading();
      writeDataToC3("2");
    },
    fail: function (res) {
      pageInstance.setData({
        submitting: false
      })
      console.log("write to C2 fail:" + JSON.stringify(res));
      util.toast("写入序列号失败")
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
      var chars = intArray[i].toString(16);
      if (chars.length < 2) {
        s = s.concat("0");
        s = s.concat(chars);
      } else {
        s = s.concat(chars);
      }
    }
    console.log(s);
    var mac = decryptData(s);
    console.log("mac:" + mac);
    wx.hideLoading();
    pageInstance.setData({
      dataFromDevice: mac
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
      wx.hideLoading();
    }
  })
}

function decryptData(data) {
  console.log("decryptData:" + data);
  var encryptedHexStr = CryptoJS.enc.Hex.parse(data);
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  var decrypted = CryptoJS.DES.decrypt(encryptedBase64Str, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  });
  console.log(decrypted.toString());
  console.log(CryptoJS.enc.Utf8.stringify(decrypted));
  var result = CryptoJS.enc.Utf8.stringify(decrypted);
  return result.substring(2, parseInt(result.substring(0, 2), 16) + 2);
}

function encryptData(data) {
  var length = data.length;
  var s = "";
  var charNum = length.toString(16);
  if (charNum.length < 2) {
    s = s.concat("0");
    s = s.concat(charNum);
  } else {
    s = s.concat(length.toString(16));
  }
  s = s.concat(data);
  for (let i = 0; i < s.length > 16 ? (32 - s.length) : (16 - s.length); i++) {
    s = s.concat("0");
  }
  console.log("before encrypt:" + s);
  var encrypted = CryptoJS.DES.encrypt(s, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  });
  console.log(encrypted.ciphertext.toString());
  return encrypted.ciphertext.toString();
}

function registerDevice() {
  var pageData = pageInstance.data;
  var urlBuilder = new Request.Request()
    .setBaseUrl("https://api.eeseetech.com/")
    .setData(JSON.stringify(new RegisterData(pageData.dataFromDevice, pageData.dataFromBarcode, pageData.name, pageData.address, pageData.phone, pageData.longitude, pageData.latitude)))
    //.setData(JSON.stringify(new RegisterData("111111111111", "0220171100001", "dong", "上海","123456123456", "120","31")))
    .setService("Bluetooth.proregister")
    .setSite("router");
  var url = urlBuilder.buildUrlWithoutSid();
  console.log(url);
  httpclient.request(url, function success(responseData) {
    if (responseData.code == 0) {
      writeDataToC2(pageInstance.data.dataFromBarcode);
    } else {
      wx.hideLoading();
      wx.showModal({
        title: '注册失败',
        content: responseData.msg,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            disconnectBLE();
            wx.navigateBack({});
          }
        }
      });
    }
  }, function fail(error) {
    console.log(error);
    pageInstance.setData({
      submitting: false
    })
    wx.showModal({
      title: '请求失败',
      content: error,
      showCancel: false,
    });
  });
}

function checkInput() {
  if (equalWithNull(pageInstance.data.dataFromDevice) || equalWithNull(pageInstance.data.dataFromBarcode) || equalWithNull(pageInstance.data.name) || equalWithNull(pageInstance.data.phone) || equalWithNull(pageInstance.data.address)) {
    return false;
  } else {
    return true;
  }
}

function equalWithNull(data) {
  return data == "";
}

function onAppHide() {
  console.log("onAppHide");
  disconnectBLE();
}

class RegisterData {
  mac_address = "";
  sn = "";
  username = "";
  address = "";
  phone = "";
  longitude = "";
  latitude = ""

  constructor(mac, sn, name, address, phone, longitude, latitude) {
    this.mac_address = mac;
    this.sn = sn;
    this.username = name;
    this.address = address;
    this.phone = phone;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}

module.exports = { onAppHide: onAppHide }