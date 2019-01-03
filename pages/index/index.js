//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    imageUrl: '/images/background.jpg',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //var url = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1";
    //this.getBiYingPhoto(url);
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  /**
   * 获取必应首图
   */
  getBiYingPhoto: function (url) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        that.processBiYingPhoto(res.data.images[0].url);
      },
      fail: function (error) {
        console.log('错误信息是：' + error);
      }
    })
  },
  /**
    * 处理必应的图片
    **/
  processBiYingPhoto: function (photoImageUrl) {
    var imageurl = 'http://www.bing.com' + photoImageUrl;
    console.log(imageurl);
    this.setData({
      imageUrl: imageurl
    });
  },
  /**
   * 点击开启干货
   */
  onBindTap: function () {
    wx.switchTab({
      url: '../posts/posts',
    })
  },
})

