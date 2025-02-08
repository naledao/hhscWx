// about/pages/about/about.js
Page({
  getabout(){
    wx.request({
      url: this.data.host+'/about',
      method:'GET',
      success:(res)=>{
        this.setData({
          about:res.data
        })
      },
      fail(){
        wx.showToast({
          title: '获取内容失败',
        })
      }
    })
  },
  flag(){
    this.setData({
      flag:1
    })
  },
  onChange(event){
    if(this.data.flag==0)
    {
      return
    }
    this.setData({
      activeNames: event.detail
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [0],
    flag:0,
    host:null,
    about:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app=getApp()
    const host1=app.globalData.localhost
    this.setData({
      host:host1
    })
    this.getabout()
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