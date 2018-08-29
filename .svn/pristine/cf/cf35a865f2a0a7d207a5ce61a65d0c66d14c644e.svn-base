var md5 = require("../../utils/md5.js");
var appInstance = getApp();
class Request {
  baseUrl="http://api.eeseetech.com/"
  //site: "router";
  site= "eesee";
  //service: "Router.Lists";
  service= "User.Login";
  version = "v1.0";
  data = "";

  constructor() {
  }

  setBaseUrl(url) {
    this.baseUrl = url;
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setService(service) {
    this.service = service;
    return this;
  }

  setSite(site) {
    this.site = site;
    return this;
  }

  buildUrlWithSid() {
    var time = new Date().getTime();
    var timestamp = time.toString().substring(0, time.toString().length - 3);
    var signTemp = "eeseeTech"
      + "data" + this.data
      + "service" + this.service
      + "sid" + appInstance.globalData.sid
      + "t" + timestamp
      + "v" + this.version;
    var sign = this.getSign(signTemp);
    return this.baseUrl + this.site + "/index.php?service=" + this.service
      + "&v=" + this.version
      + "&t=" + timestamp
      + "&data=" + this.data
      + "&sign=" + sign
      + "&sid=" + appInstance.globalData.sid;
  }

  buildUrlWithoutSid() {
    var time = new Date().getTime();
    var timestamp = time.toString().substring(0,time.toString().length - 3);
    console.log("timestamp:" + timestamp);
    var signTemp = "eeseeTech"
      + "data" + this.data
      + "service" + this.service
      + "t" + timestamp
      + "v" + this.version;
    var sign = this.getSign(signTemp);
    return this.baseUrl + this.site + "/index.php?service=" + this.service
      + "&v=" + this.version
      + "&t=" + timestamp
      + "&data=" + this.data
      + "&sign=" + sign;
  }

  getSign(signTemp) {
    return md5.hex_md5(signTemp);
  }
}
module.exports={Request:Request}