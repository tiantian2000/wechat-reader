// pages/movies/movie-detail/movie-detail.js
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      record: {},
      img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      img: options.img
    })
    var url = `http://api.douban.com/v2/movie/subject/${options.id}?apikey=0b2bdeda43b5688921839c8ecb20399b`;
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'get',
      header: {
        "Content-Type": "application/xml; charset=utf-8"
      },
      success: function (res) {
        that.setData({
          record: that.proessMovieData(res.data)
        })
        console.log(that.data.record)        
      }
    })
  },

  proessMovieData: function(data){
    console.log(data)
    if(!data) return;

    var director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large

      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? `https://img3.doubanio.com/view/photo/s_ratio_poster/public/${this.data.img}.jpg` : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary,
      languages: data.languages.join(" / "),
      pubDates: data.pubdates.join(" / "),
      durations: data.durations.join(" / "),
      aka: data.aka.join(" / "),
      popular: data.popular_comments
    }
    return movie
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