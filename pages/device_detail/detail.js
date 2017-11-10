// pages/device_detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{},
    //detailList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("page_detail:" + options.item);
    // var propertyList = new Array();
    // var data = options.item;
    // var propertyArray = data.substring(1,data.length).split(","); 
    // for (let i=0;i< propertyArray.length;i++) {
    //     var array = propertyArray[i].split(":");
    //     propertyList.push(new Property(array[0],array[1]));
    // }
    //item = JSON.parse(options.item);
    this.setData({
      item: JSON.parse(options.item),
      //detailList:propertyList,
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
class Property{
  key="";
  value="";
  constructor(key,value) {
    this.key = key;
    this.value = value;
  }
}