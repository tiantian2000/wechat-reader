// pages/music/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankId: '',
    info: {},
    update: '',
    records: [],
    song: {},
    isPlay: false,
    page: 1,
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      rankId: options.id
    })
    var that = this;
    var url = `http://m.kugou.com/rank/info/?rankid=${options.id}&page=1&json=true`;
    wx.request({
      url: url,
      method: 'get',
      data: {},
      header: {
        "Content-Type": "application/xml"
      },
      success: function(res){
        that.setData({
          info: res.data.info.banner7url.replace('{size}','400'),
          update: res.data.songs.list[0].addtime.slice(0, 10),
          records: that.processData(res.data.songs.list)
        })
        console.log(that.data.info)
        console.log(that.data.records)
      }
    })
    wx.onBackgroundAudioStop(function(){
      that.resetMusic(that.data.index, false)
      wx.setNavigationBarTitle({
        title: '声与乐',
      })
    })
  },

  processData: function(data){
    for(var index in data){
      data[index].isPlay = false;
    }
    return data
  },

  onScrollLower: function(){
    wx.showNavigationBarLoading() 
    var that = this;
    this.setData({
      page: this.data.page+1
    })
    var url = `http://m.kugou.com/rank/info/?rankid=${this.data.rankId}&page=${this.data.page}&json=true`;
    console.log(url)
    wx.request({
      url: url,
      method: 'get',
      data: {},
      header: {
        "Content-Type": "application/xml"
      },
      success: function(res){
        that.setData({
          records: that.data.records.concat(that.processData(res.data.songs.list))
        })
        wx.hideNavigationBarLoading()
      }
    })
  },

  playMusic: function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      index: index
    })
    var that = this;
    var url = `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${e.currentTarget.dataset.hash}`
    wx.request({
      url: url,
      method: 'get',
      data:{},
      header: {
        "Content-Type": "application/xml"
      },
      success:function(res){
        that.setData({
          song: res.data.data,
          isPlay: true
        })
        if(!that.data.records[index].isPlay){
          that.resetMusic(index,true)
          wx.playBackgroundAudio({
            dataUrl: that.data.song.play_url,
            title: that.data.song.song_name,
            coverImage: that.data.song.img
          })
          wx.setNavigationBarTitle({
            title:  `${that.data.song.author_name}-${that.data.song.song_name}`,
          })
        }else{
          that.resetMusic(index,false)
          wx.pauseBackgroundAudio()
          wx.setNavigationBarTitle({
            title: '声与乐',
          })
        }
       
      }
    })
  },

  resetMusic: function(index,flag){
    //console.log(index)
    var array = this.data.records;
    for(var i in array){
      array[i].isPlay = false;
    }
    array[index].isPlay = flag;
    this.setData({
      records: array
    })
  },

  onPlayer: function(e){
    wx.navigateTo({
      url: `../player/player?hash=${e.currentTarget.dataset.hash}`,
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