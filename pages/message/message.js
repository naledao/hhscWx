// pages/message/message.js
Page({
  // 跳转到消息通道
  tochannel(e){
    if(this.data.openid!=null)
    {
      var id=e.target.dataset.id
      var title=e.target.dataset.name
      wx.navigateTo({
        url: '../../msgchannel/pages/msgchannel/msgchannel?id='+id+'&title='+title,
      })
    }
  },
  // 标记在通道内
  flagN(){

  },
  // 获取消息通道
  gtemsgchannel()
  {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/msg/channel/'+this.data.openid,
      method:'GET',
      success:(res)=>{
        if(res.data.code==0)
        {
          this.setData({
            msgchannel:[]
          })
        }
        if(res.data.code==1)
        {
          this.setData({
            msgchannel:res.data.goodlist[0]
          })
        }
      },
      fail(){
        wx.showToast({
          title: '加载失败',
          icon:'error'
        })
      },
      complete(){
        wx.stopPullDownRefresh({
          success: (res) => {},
        })
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {},
          })
        }, 2000);
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    host:null,
    msgchannel:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      openid:id,
      host:host1,
    })
    if(this.data.openid!=null)
    {
      this.gtemsgchannel()
    }
    else
    {
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
    }
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
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      openid:id,
      host:host1,
    })
    if(this.data.openid!=null)
    {
      this.gtemsgchannel()
    }
    else
    {
      this.setData({
        msgchannel:[]
      })
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
    }
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
    if(this.data.openid!=null)
    {
      this.gtemsgchannel()
    }
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