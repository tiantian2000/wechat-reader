// pages/music/player/player.js
var _animation;
var _animationIndex
const _ANIMATION_TIME = 5000;
const innerAudioContext = wx.createInnerAudioContext();//创建音频容器

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayer: false,
    song: {},
    currentLyric: [], //歌词
    lineNo: 0, //高亮显示的行号
    currentTime: 0, //当前播放时间
    lineNum: 0, //当前滚动到的行数
    currentTime: '',
    totalTime: '',
    timer: '',
    sliderValue: 0,
    animation: '',
    animationTimer: '',
    slider_value: 0 ,//设置初始滑块位置为0
    now_time:'0:00'//获得的值是秒，需要转换成分钟
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      slider_value: 0,
      now_time: 0
    });
    innerAudioContext.seek(0);//设置音频初始位置为0

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
        console.log(that.data.song)
        wx.setNavigationBarTitle({
          title: that.data.song.audio_name,
        })
        that.handleLyric()
        that.play()
        that.audioListen()
        that.startAnimationInterval()
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
      innerAudioContext.pause()
      //console.log('timer', this.data.timer);
      clearInterval(this.data.timer) //清除定时器
      //console.log('清除定时器')
      clearInterval(this.data.animationTimer);
    } else {
      innerAudioContext.play()
      this.startAnimationInterval()
    }
    this.setData({
      isPlayer: !this.data.isPlayer
    })
  },

  play: function () {
    innerAudioContext.src = this.data.song.play_url;
    innerAudioContext.autoplay = true;
    innerAudioContext.play();
  },

  /**
  * 监听slider
  */
  listenerSlider: function (e) {
    //获取滑动后的值
    console.log(e.detail.value, innerAudioContext.duration);
    var per = e.detail.value / 100;
    var long = per * innerAudioContext.duration;
    this.setData({
      now_time: this.formatTime(long)
    })
    innerAudioContext.seek(long);//通过滑块控制音频进度
  },


  /**
* 监控音频进度
*/
  audioListen: function () {
    var that = this;
    innerAudioContext.onPlay(() => {
      that.setData({
        isPlayer: true,
      })
    })
    innerAudioContext.onEnded(() => {
      console.log("音频自然播放结束")
      that.setData({
        isPlayer: false,
      })
      clearInterval(that.data.timer)
      clearInterval(that.data.animationTimer)
    })
    //必须先执行onPlay方法，才能继续执行onTimeUpdate方法
    innerAudioContext.onTimeUpdate(function (res) {
      //console.log(innerAudioContext.currentTime)
      //console.log(innerAudioContext.duration)
      var per = (innerAudioContext.currentTime / innerAudioContext.duration) * 100;//获取当前播放时间所对应的slider位置
      //console.log(innerAudioContext.duration)
      that.setData({
        slider_value: per,//设置slider滑块所在位置
        now_time: that.formatTime(innerAudioContext.currentTime),//获得的值是秒，需要转换成分钟
        totalTime: that.formatTime(innerAudioContext.duration)
      })
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