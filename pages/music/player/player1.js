// pages/music/player/player.js
var _animation;
var _animationIndex
const _ANIMATION_TIME = 5000;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayer: true,
    song: [],
    currentLyric: [], //歌词
    lineNo: 0, //高亮显示的行号
    currentTime: 0, //当前播放时间
    lineNum: 0, //当前滚动到的行数
    currentTime: '',
    totalTime: '',
    timer: '',
    sliderValue: 0,
    animation: '',
    animationTimer: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var url = `http://www.kugou.com/yy/index.php?r=play/getdata&hash=${options.hash}`
    wx.request({
      url: url,
      method: 'get',
      data: {},
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.setData({
          song: res.data.data
        })
        wx.setNavigationBarTitle({
          title: that.data.song.audio_name,
        })
        that.handleLyric()
        that.play()
        that.startAnimationInterval()
      }
    }),


      wx.onBackgroundAudioStop(function () { //监听是否播放完毕
        that.setData({
          isPlayer: false,
          currentTime: '0:00',
          sliderValue: 0
        })

        clearInterval(that.data.timer)
        clearInterval(that.data.animationTimer)
      })
  },

  //获取歌曲进度
  setDuration: function () {
    var that = this
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        if (res.status === 1 || res.status === 0) { //有播放歌曲或暂停时
          that.setData({
            currentTime: that.formatTime(res.currentPosition),
            totalTime: that.formatTime(res.duration),
            sliderValue: Math.floor(res.currentPosition * 100 / res.duration),
          })
        }
      }
    })
  },

  //处理歌词
  handleLyric() {
    let medisArray = new Array();
    let medises = this.data.song.lyrics.split('\n')
    //console.log(medises)
    for (let item of medises) {
      var t = item.substring(item.indexOf("[") + 1, item.indexOf("]"));
      medisArray.push({
        //把原来的mm:ss的时间格式改为秒
        t: (t.split(":")[0] * 60 + Number.parseFloat(t.split(":")[1])).toFixed(3),
        c: item.substring(item.indexOf("]") + 1, item.length)
      })
    }
    medisArray.pop()
    //console.log(medisArray)
    this.setData({
      currentLyric: medisArray
    })

  },

  //点击控制
  onMusicTap: function () {
    if (this.data.isPlayer) { //如果是播放状态则暂停
      wx.pauseBackgroundAudio();
      //console.log('timer', this.data.timer);
      clearInterval(this.data.timer) //清除定时器
      //console.log('清除定时器')
      clearInterval(this.data.animationTimer);
    } else {
      this.play()
      this.startAnimationInterval()
    }
    this.setData({
      isPlayer: !this.data.isPlayer
    })
  },

  play: function () {
    var that = this
    wx.playBackgroundAudio({
      dataUrl: this.data.song.play_url,
      title: this.data.song.song_name,
      coverImage: this.data.song.img
    })
    let timer = setInterval(function () {
      that.setDuration(that)
    }, 1000)
    this.setData({
      timer: timer
    })
  },

  //格式化时间
  formatTime: function (time) {
    time = Math.floor(time)
    let miniutes = Math.floor(time / 60)
    let seconds = Math.floor(time % 60)

    seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${miniutes}:${seconds}`
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
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear', // "linear","ease","ease-in","ease-in-out","ease-out","step-start","step-end"
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
  },


  /**
   * 实现image旋转动画，每次旋转 120*n度
   */
  rotateAni: function (n) {
    _animation.rotate(180 * (n)).step()
    this.setData({
      animation: _animation.export()
    })
  },

  /**
   * 开始旋转
   */
  startAnimationInterval: function () {
    var that = this;
    var n = 0;
    this.data.animationTimer = setInterval(function () {
      //console.log(n)
      that.rotateAni(++n);
    }, _ANIMATION_TIME); // 没间隔_ANIMATION_TIME进行一次旋转
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