// pages/posts/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
     //取传入的参数id:options.id
    var url = `http://news-at.zhihu.com/api/2/news/${options.id}`
    wx.request({
      url: url,
      data:{},
      method:'GET',
      success: function(res){
        that.setData(
          {
            record: res.data
          }
        )
        var body = 'record.body'
        that.setData({
          [body]: res.data.body.slice(0, res.data.body.indexOf('<script'))
          })
        console.log(that.data.record)  
      }
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
})