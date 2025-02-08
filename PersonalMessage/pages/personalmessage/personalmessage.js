// PersonalMessage/pages/personalmessage/personalmessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    iphost:null,
    user:null,
    head:null,
    name:null,
    show:false,
    temname:'',
    showhead:false
  },
  // 选择头像
  choosehead()
  {
    wx.chooseMedia({
      count:1,
      mediaType:['image'],
      sizeType:['compressed'],
      success:(res)=>{
        wx.showLoading({
          title: '上传中',
        })
        var url=res.tempFiles[0].tempFilePath
        wx.uploadFile({
          filePath: url,
          name: 'head',
          url: this.data.iphost+'/user/changehead?openid='+this.data.openid,
          success:(res)=>{
            if(res.data==0)
            {
              wx.showToast({
                title: '上传头像失败',
                icon:'none'
              })
            }
            if(res.data==1)
            {
              wx.showToast({
                title: '上传修改成功',
                icon:'none'
              })
              this.setData({
                showhead:false
              })
              this.getusermessage()
            }
          },
          fail:(res)=>{
            wx.showToast({
              title: '上传头像失败',
              icon:'none'
            })
          },
          complete:(res)=>{
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
    })
  },
  // 头像弹出框开
  showchangehead()
  {
    this.setData({
      showhead:true
    })
  },
  // 确认修改昵称
  confirmname()
  {
    wx.request({
      url: this.data.iphost+'/user/changename?name='+this.data.temname+'&openid='+this.data.openid,
      method:'POST',
      success:(res)=>{
        if(res.data==0)
        {
          console.log(111);
          wx.showToast({
            title: '修改失败',
            icon:'none'
          })
        }
        if(res.data==2)
        {
          wx.showToast({
            title: '昵称不能包含空格',
            icon:'none'
          })
        }
        if(res.data==3)
        {
          wx.showToast({
            title: '昵称长度最多16',
            icon:'none'
          })
        }
        if(res.data==1)
        {
          wx.showToast({
            title: '修改成功',
            icon:'success'
          })
          this.setData({
            show:false
          })
          this.getusermessage()
        }
      },
      fail:(res)=>{
        wx.showToast({
          title: '修改失败',
          icon:'none'
        })
      }
    })
  },
  // 名称弹出框关
  onClose()
  {
    this.setData({
      show:false,
      showhead:false
    })
  },
  // 名称弹出框开
  showPopup()
  {
    this.setData({ show: true });
  },
  // 修改昵称
  onChangename(e)
  {
    this.setData({
      temname:e.detail
    })
  },
  // 获取头像信息、名称信息
  getusermessage()
  {
    if(this.data.openid==null)
    {
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
    }
    else
    {
      wx.request({
        url: this.data.iphost+'/user/getmessage?openid='+this.data.openid,
        success:(res)=>{
          this.setData({
            head:res.data.object.head,
            name:res.data.object.name
          })
        },
        fail:(res)=>{
          wx.showToast({
            title: '获取信息失败',
            icon:'none'
          })
        }
      })
    }
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
      iphost:host1
    })
    this.getusermessage()
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