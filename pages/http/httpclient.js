class HttpClient {

  constructor() {

  }

  request(urlString,successCallback,failCallback) {
    console.log(this.value);
    wx.request({
      //url: "http://gank.io/api/data/福利/5/1",
      url:urlString,
      success:function(response) {
        console.log(response);
        if (response.statusCode == 200) {
          successCallback(response.data);
        } else {
          failCallback(response);
        }
      },
      fail:function(error) {
        console.log(error.data);
        failCallback(error.data);
      }
    })
  }
}
module.exports = {HttpClient:HttpClient}
