// pages/posts/posts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list: [],
    date: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log('新闻')
      var that = this;
      wx.request({
        url: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=5',
        data: {},
        method: 'get',
        header: {
          "Content-Type": "application/xml"
        },
        success: function(res){
          that.setData({
            banner: that.processBiYingPhoto(res.data.images)
          })
        }
      })

      wx.request({
        url: 'https://news-at.zhihu.com/api/2/news/latest',
        method: 'get',
        data: {},
        header: {
          "Content-Type": "application/xml"
        },
        success: function(res){
          console.log(res)
          var date = res.data.date;
          date = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}`
          that.setData({
            list: res.data.top_stories,
            date
          })
          
        }
      })
  },

  /**
     * 处理必应的图片
     **/
  processBiYingPhoto: function (data) {
    for(var index in data){
      data[index].newImg = 'http://www.bing.com' + data[index].url
    }
    return data;    
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

  },

  detail:function(e){
    var url = `./detail/detail?id=${e.target.dataset.id}`
    //var url = `./static-detail/static-detail?id=${e.target.dataset.id}`
    wx.navigateTo({
      url: url
     })
  }
})