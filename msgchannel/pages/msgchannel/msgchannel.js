// msgchannel/pages/msgchannel/msgchannel.js
Page({
  // 复制消息
  fuzhi(e){
    var index=e.target.dataset.index
    wx.setClipboardData({
      data: index,
      success (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 获取消息
  getmsg(){
    if(this.data.channelid!=null)
    {
      wx.request({
        url: this.data.host+'/msg/'+this.data.channelid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==0)
          {
            this.setData({
              message:[]
            })
          }
          if(res.data.code==1)
          {
            if(res.data.goodlist[0].length!=this.data.message.length)
            {
              var index=res.data.goodlist[0].length-1
              var x="message["+index+"].id"
              this.setData({
                message:res.data.goodlist[0],
                [x]:'i',
                i:'i'
              })
            }
          }
        },
        complete(){
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
        }
      })
    }
  },
  // 发送信息
  tosms(){
    if(this.data.openid!=null && this.data.channelid!=null && this.data.sms!=null)
    {
      if(this.data.sms.length>200)
      {
        wx.showToast({
          title: '最多一次两百字',
          icon:'none'
        })
      }
      if(this.data.sms.length==0)
      {
        wx.showToast({
          title: '消息不能为空',
          icon:'none'
        })
        icon:'none'
      }
      else
      {
        var time_id=setTimeout(() => {
          wx.showLoading({
            title: '发送中',
          })
        }, 300);
        this.setData({
          timeid:time_id
        })
        wx.request({
          url: this.data.host+'/msg/channel/'+this.data.channelid+'/'+this.data.openid+'?msg='+this.data.sms,
          method:'POST',
          success:(res)=>{
            if(res.data==0)
            {
              wx.showToast({
                title: '发送失败',
                icon:'none'
              })
            }
            if(res.data==1)
            {
              this.setData({
                sms:''
              })
              this.getmsg()
            }
            if(res.data==2)
            {
              wx.showToast({
                title: '两个人聊天记录最多为120条',
                icon:'none'
              })
            }
          },
          fail(){
            wx.showToast({
              title: '发送失败',
              icon:'error'
            })
          },
          complete:()=>{
            if(this.data.timeid!=null)
            {
              clearTimeout(this.data.timeid)
            }
            setTimeout(() => {
              wx.hideLoading({
                success: (res) => {
                },
              })
            }, 300);
          }
        })
      }
    }
    else
    {
      wx.showToast({
        title: '发送失败',
        icon:'error'
      })
    }
  },
  // 获取textarea信息
  changesms(e){
    this.setData({
      sms:e.detail.value
    })
  },
  // 标记不在通道内
  flagN(){
    wx.request({
      url: this.data.host+'/msg/channel/n/'+this.data.channelid+'/'+this.data.openid,
      method:'POST'
    })
  },
  // 标记在通道内
  flagY(){
    wx.request({
      url: this.data.host+'/msg/channel/y/'+this.data.channelid+'/'+this.data.openid,
      method:'POST'
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    host:null,
    channelid:null,
    message:[],
    sms:'',
    timeid:null,
    i:'k',
    get:null,
    top:0
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
      channelid:options.id
    })
    if(this.data.openid!=null && this.data.channelid!=null)
    {
      wx.getSystemInfo({
        success: (result) => {
          this.setData({
            top:result.windowHeight
          })
        },
      })
      this.flagY()
      this.getmsg()
      var get1=setInterval(()=>{
        this.getmsg()
      },3000)
      this.setData({
        get:get1
      })
    }
    wx.setNavigationBarTitle({
      title: options.title
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
    if(this.data.openid!=null && this.data.channelid!=null)
    {
      this.flagY()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if(this.data.openid!=null && this.data.channelid!=null)
    {
      this.flagN()
    }
    if(this.data.get!=null)
    {
      clearInterval(this.data.get)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    if(this.data.openid!=null && this.data.channelid!=null)
    {
      this.flagN()
    }
    if(this.data.get!=null)
    {
      clearInterval(this.data.get)
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    if(this.data.channelid!=null)
    {
      this.getmsg();
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