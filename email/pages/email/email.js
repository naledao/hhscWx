// email/pages/email/email.js
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({
  // 修改邮箱
  changeemail(){
    this.setData({
      bind:false,
      start:true
    })
  },
  // 是否删除dialog
  getdeldialog(){
    Dialog.confirm({
      title: '请选择',
      message: '是否要删除已绑定的邮箱',
    })
      .then(() => {
        // on confirm
        wx.request({
          url: this.data.host+'/email/'+this.data.openid,
          method:'DELETE',
          success:(res)=>{
            if(res.data==0)
            {
              wx.showToast({
                title: '删除失败',
                icon:'none'
              })
            }
            if(res.data==1)
            {
              wx.showToast({
                title: '删除成功',
              })
              this.setData({
                bind:false,
                check:true
              })
            }
          },
          fail(){
            wx.showToast({
              title: '删除失败',
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
      })
      .catch(() => {
        // on cancel
      });
  },
  // 验证邮箱
  confirmbind(){
    wx.showLoading({
      title: '绑定中',
    })
    wx.request({
      url: this.data.host+'/email/bindemail/'+this.data.sms+'/'+this.data.openid+'?email='+this.data.email,
      method:'POST',
      success:(res)=>{
        if(res.data==0)
        {
          wx.showToast({
            title: '绑定失败',
            icon:'none'
          })
        }
        if(res.data==1)
        {
          wx.showToast({
            title: '绑定成功',
          })
          this.setData({
            start:false,
            bind:true
          })
        }
      },
      fail(){
        wx.showToast({
          title: '绑定失败',
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
  // 倒计时
  onChangetime(e){
    this.setData({
      time:e.detail.seconds
    })
  },
  // 获取邮箱验证码
  getsms(){
    if(this.data.email==null || this.data.email=='')
    {
      wx.showToast({
        title: '请先输入邮箱',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '获取中',
    })
    wx.request({
      url: this.data.host+'/email/getsms?email='+this.data.email,
      method:'POST',
      success:(res)=>{
        if(res.data==1)
        {
          this.setData({
            send:false,
            sectime:60000
          })
          setTimeout(() => {
            this.setData({
              send:true,
              sectime:0
            })
          }, 60000);
          wx.showToast({
            title: '获取成功,请在一分钟内使用',
            icon:'none'
          })
        }
        if(res.data==0)
        {
          wx.showToast({
            title: '获取失败',
            icon:'none'
          })
        }
      },
      fail(){
        wx.showToast({
          title: '获取失败',
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
  // 检测验证码变化
  onChangecode(e)
  {
    this.setData({
      sms:e.detail
    })
  },
  // 检测邮箱变化
  onChangeemail(e){
    this.setData({
      email:e.detail
    })
  },
  // 转到绑定邮箱界面
  starttrue(){
    if(this.data.openid==null)
    {
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
    }
    else
    {
      this.setData({
        start:true,
        check:false
      })
    }
  },
  // 检测是否绑定邮箱
  check(){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/email/check/'+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              check:false,
              bind:true,
              email:res.data.message
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
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {},
            })
          }, 2000);
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    sms:null,
    time:60,
    sectime:0,
    openid:null,
    host:null,
    check:true,
    bind:false,
    start:false,
    email:null,
    send:true
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
      start:false
    })
    this.check()
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