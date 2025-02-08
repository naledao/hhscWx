// Feedback/pages/Feedback/Feedback.js
Page({
  postfeedback(){
    if(this.data.message.length==0)
    {
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
      return
    }
    if(this.data.message.length>200)
    {
      wx.showToast({
        title: '超过上限200',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '提交中',
    })
    wx.request({
      url: this.data.host+'/feedback?feedback='+this.data.message,
      method:'POST',
      success:(res)=>{
        if(res.data==0)
        {
          wx.showToast({
            title: '提交失败',
            icon:'none'
          })
        }
        if(res.data==1)
        {
          wx.showToast({
            title: '提交成功',
            icon:'none'
          })
        }
      },
      fail(){
        wx.showToast({
          title: '提交失败',
          icon:'error'
        })
      },
      complete(){
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {},
          })
        }, 2000);
      }
    })
  },
  changemsg(e){
    if(e.detail.length>200)
    {
      return
    }
    this.setData({
      message:e.detail
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    host:null
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