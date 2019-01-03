// pages/music/music.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    src: '',
    rankList: [],
    containerShow: true,
    searchShow: false,
    searchText: '',
    searchSongs: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://m.kugou.com/rank/list&json=true',
      data:{},
      method:'get',
      header: {
        "Content-Type": "application/xml"
      },
      success: function(res){
        that.setData({
          rankList: res.data.rank.list
        })
      }
    })
    //监听播放完毕
    wx.onBackgroundAudioStop(function () {
      that.resetMusic(that.data.index, false)
      wx.setNavigationBarTitle({
        title: '声与乐',
      })
    })
  },

  onTap: function(e){
    wx.navigateTo({
      url: `./rank/rank?id=${e.currentTarget.dataset.id}`,
    })
  },

  onBindFocus: function () {
    this.setData({
      containerShow: false,
      searchShow: true
    })
  },

  onCancelSearch: function () {
    this.setData({
      containerShow: true,
      searchShow: false,
      searchSongs: [],
      searchText: '',
      page: 1,
    })
  },

  /**
   * 搜索框输入内容后查询
   */
  onBindChange: function (e) {
    this.setData({
      page: 1,
      searchText: e.detail.value
    })
    var that = this;
    var url = `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${e.detail.value}&page=${this.data.page}&pagesize=10&showtype=1`    
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
          searchSongs: that.processData(res.data.data.info)
        })
        console.log(that.data.searchSongs)
      }
    })
    
  },

  processData: function (data) {
    for (var index in data) {
      data[index].isPlay = false;
    }
    return data
  },

  playMusic: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
    var that = this;
    var url = `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${e.currentTarget.dataset.hash}`
    wx.request({
      url: url,
      method: 'get',
      data: {},
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.setData({
          song: res.data.data,
          isPlay: true
        })
        if (!that.data.searchSongs[index].isPlay) {
          that.resetMusic(index, true)
          wx.playBackgroundAudio({
            dataUrl: that.data.song.play_url,
            title: that.data.song.song_name,
            coverImage: that.data.song.img
          })
          wx.setNavigationBarTitle({
            title: `${that.data.song.author_name}-${that.data.song.song_name}`,
          })
        } else {
          that.resetMusic(index, false)
          wx.pauseBackgroundAudio()
          wx.setNavigationBarTitle({
            title: '声与乐',
          })
        }

      }
    })
  },

  resetMusic: function (index, flag) {
    //console.log(index)
    var array = this.data.searchSongs;
    for (var i in array) {
      array[i].isPlay = false;
    }
    array[index].isPlay = flag;
    this.setData({
      searchSongs: array
    })
  },

  onScrollLower: function () {
    wx.showNavigationBarLoading()
    var that = this;
    this.setData({
      page: this.data.page + 1
    })
    var url = `http://mobilecdn.kugou.com/api/v3/search/song?format=json&keyword=${this.data.searchText}&page=${this.data.page}&pagesize=10&showtype=1` 
    console.log(url)
    wx.request({
      url: url,
      method: 'get',
      data: {},
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.setData({
          searchSongs: that.data.searchSongs.concat(that.processData(res.data.data.info))
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  onPlayer: function (e) {
    wx.navigateTo({
      url: `./player/player?hash=${e.currentTarget.dataset.hash}`,
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