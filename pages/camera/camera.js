// pages/camera.js
var CryptoJS = require("../../utils/crypto-js.js");
var pageInstance;
var appInstance = getApp()
Page({
    data: {
        src: "",
        carlicense: "",
    },
    takePhoto() {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'normal',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath
                })
            }
        })
    },
    ocrClick: function () {
        uploadImage()
    },
    searchClick:function(){
        // wx.navigateTo({
        //     url: '../device/device?key=' + pageInstance.data.carlicense,
        //     success:function(res){
        //         console.log(res)
        //     },
        //     fail:function(res){
        //         console.log(res)
        //     }
        // })
        wx.navigateBack({
        })
    },
    testClick:function(){
        //CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1("hello", "jx49GE01HPNBnFzkT7hEdrupZ9eyJTVN"))
        console.log(CryptoJS.HmacSHA1("hello", "jx49GE01HPNBnFzkT7hEdrupZ9eyJTVN"))
        var wordArray = CryptoJS.HmacSHA1("hello", "jx49GE01HPNBnFzkT7hEdrupZ9eyJTVN")
        //console.log(CryptoJS.enc.Utf8.stringify(wordArray))
        //console.log(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1("hello", "jx49GE01HPNBnFzkT7hEdrupZ9eyJTVN")))

        var res = CryptoJS.HmacSHA1("hello", "jx49GE01HPNBnFzkT7hEdrupZ9eyJTVN");
        console.log(res)
        var data = CryptoJS.enc.Utf8.parse("hello")
        console.log(data)
        var bin = res.concat(data)
        console.log(bin)
        console.log(Date.now())
        console.log(new Date().getTime())
        //console.log(sign)
        wx.showModal({
            title: 'test',
            content: "123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n123456789123456789\n",
        })
    },
    onLoad: function (options) {
        pageInstance = this
    },
    onReady: function () {},
    onShow: function () {},
    onHide: function () {},
    onUnload: function () {},
    onPullDownRefresh: function () {},
    onReachBottom: function () {},
    onShareAppMessage: function () {}
})

function uploadImage() {
    wx.uploadFile({
        url: 'https://api.eeseetech.com/ads/index.php?service=Carsnap.uploadTest',
        filePath: pageInstance.data.src,
        name: 'file',
        success: function (res) {
            console.log(res)
            console.log(JSON.stringify(res))
            console.log(res.data)
            var urlData = JSON.parse(res.data)
            console.log(urlData.data.url)
            getCarLicense(urlData.data.url)
        },
        fail: function (res) {
            console.log(res)
        }
    })
}

function getCarLicense(imageUrl) {
    console.log("ImageUrl:" + imageUrl)
    var url = "https://api.youtu.qq.com/youtu/ocrapi/plateocr"
    var authorization = getAuthorization()
    console.log("authorization " + authorization)
    var data = {
        app_id: "10114649",
        url: imageUrl,
    }
    var header = {
        "Authorization": authorization,
    }
    wx.request({
        url: url,
        data: data,
        method: "POST",
        header: header,
        success: function (res) {
            console.log(res)
            if (res.statusCode == 200){
                console.log("车牌：" + res.data.items[0].itemstring)
                var key = res.data.items[0].itemstring
                appInstance.globalData.searchKey = key
                console.log("appInstance.globalData.searchKey:" + appInstance.globalData.searchKey)
                pageInstance.setData({
                    carlicense: key
                })
            }
        },
        fail: function (res) {
            console.log(res)
        }
    })
}

function getAuthorization() {
    var timestamp = parseInt(Date.now() / 1000);
    var endTimestamp = parseInt((Date.now() + 100000) / 1000);
    var tempString = "u=1031724787&a=10114649&k=AKID6BA1rb3apywjLnpHH6rV2Tl9RZYNwUmA&e=" + endTimestamp + "&t=" + timestamp + "&r=270494647&f="
    var Hmac = CryptoJS.HmacSHA1(CryptoJS.enc.Utf8.parse(tempString), CryptoJS.enc.Utf8.parse("jx49GE01HPNBnFzkT7hEdrupZ9eyJTVN"))
    //console.log("Hmac:" + Hmac)
    var result = CryptoJS.enc.Base64.stringify(Hmac.concat(CryptoJS.enc.Utf8.parse(tempString)))
    //console.log(result)
    return result
}
