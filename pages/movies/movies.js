// pages/movies/movies.js
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inMovies: [],
    comingMovies: [],
    topMovies: [],
    searchMovies: [],
    containerShow: true,
    searchShow: false,
    searchText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = 'https://api.douban.com/v2/movie/in_theaters?a' +
      'pikey=0b2bdeda43b5688921839c8ecb20399b&start=0&count=3';
    this.getMovieList(url,0);
    url = 'https://api.douban.com/v2/movie/coming_soon?apikey=0b2bdeda43b5688921839c8ecb20399b&start=0&count=3';
    this.getMovieList(url, 1);
    url = 'https://api.douban.com/v2/movie/top250?apikey=0b2bdeda43b5' +
      '688921839c8ecb20399b&&start=0&count=3';
    this.getMovieList(url, 2);  
  },

  getMovieList:function(url,type){
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'get',
      header: {
        "Content-Type": "application/xml; charset=utf-8"
      },
      success: function (res) {
        //console.log(res);
        switch(type){
          case 0:
            that.setData({
              inMovies: res.data.subjects
              //inMovies: that.convertData(res.data.subjects)
            })
            break;
          case 1:
            that.setData({
              comingMovies: res.data.subjects
              //comingMovies: that.convertData(res.data.subjects)
            })
            break;
          case 2:
            that.setData({
              topMovies: res.data.subjects
              //topMovies: that.convertData(res.data.subjects)
            })
            break;
        }
      }
    })
  },

  convertData:function(data){
    for(var index in data){
      var subject = data[index]
      data[index].stars = util.convertToStarsArray(subject.rating.stars)    
    }
    //console.log(data)
    return data;
  },

  onBindFocus: function(){
    this.setData({
      containerShow: false,
      searchShow: true
    })
  },

  onCancelSearch: function(){    
    this.setData({
      containerShow: true,
      searchShow: false,
      searchMovies: [],
      searchText: ''
    })
  },

  /**
   * 搜索框输入内容后查询
   */
  onBindChange: function(e){
    var that = this;
    var url = `https://api.douban.com/v2/movie/search?q=${e.detail.value}&apikey=0b2bdeda43b5688921839c8ecb20399b`
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
           searchMovies: res.data.subjects
         })       
      }
    })
  },

  onMovieTap: function (e) {
    var img = e.currentTarget.dataset.img
    var name = img.substring(img.lastIndexOf('/')+1,img.lastIndexOf('.'))
    wx.navigateTo({
      url: `./movie-detail/movie-detail?id=${e.currentTarget.dataset.id}&img=${name}`,
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

  
  more: function(e){
    wx.navigateTo({
      url: `./movie-list/movie-list?type=${e.target.dataset.type}`,
    })
  }
})