// keyhis/pages/keyhis/keyhis.js
Page({
  // 复制key
  copy(e){
    var character=e.target.dataset.character
    wx.setClipboardData({
      data: character,
      success (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 改变时间
  onChange(e) {
    var n=e.target.dataset.n
    var shuzu='timeer[' + n + ']'
    this.setData({
      [shuzu]: e.detail
    });
  },
  // 请求密匙记录
  getkeyhis(){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/checkkey/getallkey/'+this.data.openid,
        method:"GET",
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              keylist:res.data.goodlist
            })
          }
        },
        fail(){
          wx.showToast({
            title: '加载失败',
            icon:"error"
          })
        },
        complete(){
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
          setTimeout(function(){
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    host:null,
    openid:null,
    time:24002000,
    keylist:null,
    timeer:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      host:host1,
      openid:id,
    })
    this.getkeyhis()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getkeyhis()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})