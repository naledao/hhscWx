// pages/mine/mine.js
Page({
  // 前往关于界面
  Toabout(){
    wx.navigateTo({
      url: '../../about/pages/about/about',
    })
  },
  // 前往修改个人信息页面
  TopersonalMessage()
  {
    wx.navigateTo({
      url: '../../PersonalMessage/pages/personalmessage/personalmessage',
    })
  },
  // 前往使用说明页面
  Toinstructions(){
    wx.navigateTo({
      url: '../../instructions/pages/instructions/instructions',
    })
  },
  // 前往反馈建议页面
  togeedback(){
    wx.navigateTo({
      url: '../../Feedback/pages/Feedback/Feedback',
    })
  },
  // 转到我的商品页面
  tominegoods(){
    wx.navigateTo({
      url: '../../mineshop/pages/mineshop/mineshop',
    })
  },
  Toai(){
    if(this.data.openid!=null)
    {
      wx.navigateTo({
        url: '../aipage/aipage?pic='+this.data.user.head,
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
    }
  },
  // 前往绑定邮箱界面
  toemail(){
    wx.navigateTo({
      url: '../../email/pages/email/email',
    })
  },
  // 前往密匙历史界面
  tokeyhis(){
    if(this.data.openid!=null)
    {
      wx.navigateTo({
        url: '/keyhis/pages/keyhis/keyhis',
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
    }
  },
  // 验证密匙的正确性
  checksms(){
    wx.showLoading({
      title: '验证中',
    })
     wx.request({
       url: this.data.host+'/checkkey?key='+this.data.sms+'&choice='+this.data.presentstore,
       method:"GET",
       success:(res)=>{
         if(res.data.code==0)
         {
           wx.showToast({
             title: '密匙不匹配',
             icon:"error"
           })
         }
         if(res.data.code==1)
         {
           //密匙匹配成功跳转到发布页面
           wx.navigateTo({
             url: '/releasegood/pages/releasegood/releasegood?openid='+this.data.openid+'&key='+this.data.sms+'&choice='+this.data.presentstore,
           })
         }
         if(res.data.code==241)
         {
            wx.showToast({
              title: '验证失败',
              icon:"error"
            })
         }
       },
       fail(){
         wx.showToast({
           title: '验证失败',
           icon:"error"
         })
       },
       complete(){
         setTimeout(function(){
           wx.hideLoading({
             success: (res) => {},
           },2000)
         })
       }
     })
  },



  // 获取密匙内容
  onChange(event){
    this.setData({
      sms:event.detail
    })
  },




  // 关闭获取密匙页面
  onClosekey(){
    this.setData({
      showkey:false,
      presentstore:null
    })
  },




  // 出现商品发布窗口
  showPopup(){
    if(this.data.openid==null){
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      return
    }
    this.setData({
      show:true
    })
  },



  // 确认选择发布商品类型
  onSelect(event) {
     // s商品发布页面
    if(event.detail.flag=='s')
    {
      // 标记当前产品类型
      this.setData({
        presentstore:'s',
        showkey:true
      })
    }
    if(event.detail.flag=='a')
    {
      this.setData({
        presentstore:'a',
        showkey:true
      })
    }
    if(event.detail.flag=='b')
    {
      this.setData({
        presentstore:'b',
        showkey:true
      })
    }

    if(event.detail.flag=='c')
    {
      wx.navigateTo({
        url: '/releasegood/pages/releasegood/releasegood?openid='+this.data.openid+'&key=1'+'&choice=c',
      })
    }
  },

  // 关闭商品发布窗口
  onClose() {
    this.setData({ show: false });
  },
  // 跳转到浏览记录页面
  tobrowsehis(){
    if(this.data.openid==null){
      wx.showToast({
        title: '请先登录',
        icon:"none"
      })
      return
    }
    wx.navigateTo({
      url: '/browsehis/pages/browsehis/browsehis?openid='+this.data.openid,
    })
  },


  // 用户退出登录
  loginout(){
    wx.showLoading({
      title: '请稍等',
    })
    const app1=getApp()
    app1.globalData.mineid=null
    const key=wx.getStorageSync('sessionkey')
    // 请求服务器删除key
    wx.request({
      url: this.data.host+'/user/loginout?key='+key,
      method:"POST",
      complete:(res)=>{
        const app1=getApp()
        app1.globalData.mineid=null
        wx.removeStorageSync('sessionkey')
        this.setData({
          openid:null,
          user:null
        })
        setTimeout(()=>{
          wx.hideLoading({
            success: (res) => {},
          })
        },2000)
      }
    })
  },


  // 用户请求登录
  login(){
    wx.getUserProfile({
      desc: 'desc',
      success:(res)=>{
        const name1=res.userInfo.nickName
        const head1=res.userInfo.avatarUrl
        wx.login({
          success:(res)=>{
            this.setData({
              loginyn:res.errMsg,
              code:res.code
            })
        // 提交用户授权信息
        wx.showLoading({
          title: '请稍等',
        })
        wx.request({
          url: this.data.host+'/user/login',
          data:{
            code:this.data.code,
            name:name1,
            head:head1
          },
          method:"POST",
          success:(res)=>{
            if(res.data.code==0){
              wx.showLoading({
                title: '请稍等',
              })
              // 获取用户成功
              const app1=getApp()
              app1.globalData.mineid=res.data.wxReturn.openid
              this.setData({
                openid:res.data.wxReturn.openid
              })
              wx.setStorageSync('sessionkey', res.data.wxReturn.session_key)
              // 渲染用户信息
              this.setData({
                user: res.data.user
              })
              wx.hideLoading({
                success: (res) => {},
              })
              wx.showToast({
                title: '登录成功',
              })
            }
            if(res.data.code==1){
              console.log(111);
              // 获取用户失败
              wx.showToast({
                title: '登录失败',
                icon:"error"
              })
            }
          },
          fail(){
            console.log(222);
            wx.showToast({
              title: '登录失败',
              icon:"error"
            })
          },
          complete(){
            setTimeout(()=>{
              wx.hideLoading({
                success: (res) => {},
              })
            },2000)
          }
        })
          },
          fail(res){
            console.log(res);
            wx.showToast({
              title: '登录失败',
              icon:"error"
            })
          },
          complete(){
          }
        })
      },
      fail:(res)=>{
        console.log(res);
        wx.showToast({
          title: '登录失败',
          icon:"error"
        })
      },
      complete(){
        setTimeout(()=>{
          wx.hideLoading({
            success: (res) => {},
          })
        },2000)
      }
    })
    setTimeout(() => {
      wx.startPullDownRefresh({
        success: (res) => {wx.stopPullDownRefresh({
          success: (res) => {},
        })},
      })
    }, 2000);
  },
  /**
   * 页面的初始数据
   */
  data: {
    sms:'',
    showkey:false,
    presentstore:null,
    actions:[
      {
        name: '普通商品',
        flag:'c',
        subname:'免费'
      },
      {
        name: '启动页商品',
        flag:'s',
        subname: '需要密匙'
      },
      {
        name: '滚动播放商品',
        flag:'a',
        subname:'需要密匙'
      },
      {
        name: '滑动窗口商品',
        flag:'b',
        subname:'需要密匙'
      }
    ],
    show: false,
    // 用户id
    openid:null,
    // 服务器地址
    host:null,
    // 用户对象
    user:null,
    // 是否授权登录成功
    loginyn:"",
    // 登录code
    code:"2419646091"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取openid
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      openid:id,
      host:host1
    })
    // 请求用户信息
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/user/'+this.data.openid,
        method:"GET",
        success:(res)=>{
          this.setData({
            user:res.data
          })
        },
        fail(){
          wx.showToast({
            title: '登录失败',
            icon:"error"
          })
        },
        complete(){
          setTimeout(()=>{
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        }
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
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/user/'+this.data.openid,
        method:"GET",
        success:(res)=>{
          this.setData({
            user:res.data
          })
        },
        fail(){
          wx.showToast({
            title: '登录失败',
            icon:"error"
          })
        },
        complete(){
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
          setTimeout(()=>{
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        }
      })
    }
    else{
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
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