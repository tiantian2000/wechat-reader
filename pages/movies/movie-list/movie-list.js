// pages/movies/movie-list/movie-list.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    records: [],
    url: '',
    totalCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = '';
    var url = '';
    switch (options.type){
      case '0':
        category = '正在热映';
        url = 'https://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b'
        this.setData({
          url: url
        })  
        break;
      case '1':
        category = '即将上映';
        url = 'https://api.douban.com/v2/movie/coming_soon?apikey=0b2bdeda43b5688921839c8ecb20399b';
        this.setData({
          url: url
        })  
        break;
      case '2':
        category = 'Top200';
        url = 'https://api.douban.com/v2/movie/top250?apikey=0b2bdeda43b5688921839c8ecb20399b';  
        this.setData({
          url: url
        })  
    }
    //console.log(options.type)
    wx.setNavigationBarTitle({
      title: category,
    })

    this.getMovieList(url)
  },

  getMovieList: function (url, type) {
    var that = this;
    wx.request({
      url: url +'&start=0&count=18',
      data: {},
      method: 'get',
      header: {
        "Content-Type": "application/xml; charset=utf-8"
      },
      success: function (res) {
        that.setData({
          records: res.data.subjects,
          totalCount: that.data.totalCount+18
        })
      }
    })
  },

  /**
   * 上拉加载滚动回调函数
   */
  onScrollLower: function(event){  
    wx.showNavigationBarLoading() 
    var that = this;
    var url = `${this.data.url}&start=${this.data.totalCount}&count=18`
    console.log(url)
    wx.request({
      url: url,
      data: {},
      method: 'get',
      header: {
        "Content-Type": "application/xml; charset=utf-8"
      },
      success: function (res) {
        that.setData({
          records: that.data.records.concat(res.data.subjects),
          totalCount: that.data.totalCount + 18
        })
        console.log(that.data.records)
        wx.hideNavigationBarLoading()
      }
    })
  },
  
  /**
   * 下拉刷新
   */
  refresh:function(){
    var that = this;
    wx.showNavigationBarLoading() 
    var url = `${this.data.url}&start=0&count=18`
    wx.request({
      url: url,
      data: {},
      method: 'get',
      header: {
        "Content-Type": "application/xml; charset=utf-8"
      },
      success: function (res) {
        that.setData({
          records: res.data.subjects,
          totalCount: 18
        })
        console.log(that.data.records)
        wx.hideNavigationBarLoading()
      }
    })
  },

  onMovieTap: function(e){
    console.log(e)
    var img = e.currentTarget.dataset.img
    var name = img.substring(img.lastIndexOf('/') + 1, img.lastIndexOf('.'))
    console.log(name)
    wx.navigateTo({
      url: `../movie-detail/movie-detail?id=${e.currentTarget.dataset.id}&img=${name}`,
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