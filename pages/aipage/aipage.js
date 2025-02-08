// pages/aipage/aipage.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  //查看服务有无开启
  getrequest(){
    if(this.data.openid!=null && this.data.host!=null)
    {
      wx.request({
        url: this.data.host+'/chatgpt/yon',
        method:'POST',
        success:(res)=>{
          console.log(res.data);
          if(res.data==0)
          {
            this.setData({
              judges:false,
              
            })
          }
          if(res.data==1)
          {
            this.setData({
              judges:true,
              waitCode:1,
            })
            this.checkMsg()
          }
        },

      })
    }
  },
  //邮箱检查
  emailCheck(code){
    this.setData({
      waitJudges:false,
    })
    if(code==1)
    {
      wx.request({
        url: this.data.host+'/chatgpt/emailyon?openid='+this.data.openid,
        method:'POST',
        success:(res)=>{
          if(res.data==0)
          {
            setTimeout(()=>{
              Dialog.confirm({
                title: '建议绑定邮箱',
                message: '绑定邮箱后ChatGPT发送给你的消息，将会通过邮箱对你进行通知',
              })
              .then(()=>{
                wx.navigateTo({
                  url: '../../email/pages/email/email',
                })
              }
              )
              .catch(() => {
                // on cancel
              });
            },1000)
          }
        },
      })
    }
  },
  //会话检查
  checkMsg(){
    if(this.data.openid!=null && this.data.host!=null)
    {
      wx.request({
        url: this.data.host+'/chatgpt/getallhuihua?openid='+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data==0)
          {
            setTimeout(()=>{
              Dialog.confirm({
                title: '会话过多',
                message: '请删除会话后再使用',
              })
              .then(()=>{
                this.resetConversation()
                this.setData({
                  waitJudges:true
                })
              }
              )
              .catch(() => {
                this.setData({
                  waitJudges:true,
                })
              });
            },1000)
          }
          else{
            this.setData({
              waitJudges:true,
            })
          }
        },
      })
    }
    
  },
  //会话重置
  resetConversation(){
    Dialog.confirm({
      title: '请选择',
      message: '是否要重置会话，重置后历史消息记录会被删除',
    })
    .then(()=>{
      wx.showLoading({
        title: '重置中',
      })
      if(this.data.openid!=null && this.data.host!=null)
      {
        wx.request({
          url: this.data.host+'/chatgpt/reset?openid='+this.data.openid,
          method:'GET',
          success:(res)=>{
            if(res.data==1){
              wx.showToast({
                title: '重置成功',
                icon:'success'
              })
              this.setData({
                message:'',
              })
            }
            else{
              wx.showToast({
                title: '重置失败',
                icon:"none"
              })
            }
          },
          complete:(res)=>{
            setTimeout(() => {
              wx.hideLoading()         
            }, 500);
          }
        })
      }
    }
    )
    .catch(() => {
      // on cancel
    });

  },
  //获取所有消息
  getAllMessage(){
    if(this.data.openid!=null && this.data.host!=null)
    {
      wx.request({
        url: this.data.host+'/chatgpt/getallmessge?openid='+this.data.openid,
        method:'GET',
        success:(res)=>{
          var len=res.data.length
          for(var i=0;i<len;i++)
          {
            if(i+1==len)
            {
              res.data[i].id='i'
            }
            else
            {
              res.data[i].id='m'
            }
          }
          this.setData({
            message:res.data
          })       
        },
      })
    }
  },
  //发送问题呢
  sendQuestion(){
    if(this.data.question==='')
    {
      wx.showToast({
        title: '请输入消息',
        icon:'none'
      })
      return;
    }
    if(this.data.openid!=null && this.data.host!=null)
    {
      wx.request({
        url: this.data.host+'/chatgpt/setusermessage?openid='+this.data.openid+"&message="+this.data.question,
        method:'POST',
        success:(res)=>{
          if(res.data.code==-1){
            wx.showToast({
              title: '服务未开启',
              icon:'none',
            })
          }
          else if(res.data.code==1){
            wx.showToast({
              title: '消息不合法',
              icon:'none',
            })
          }
          else if(res.data.code==2||res.data.code==4){
            wx.showToast({
              title: '发送失败',
              icon:'none',
            })
          }
          else if(res.data.code==3){
            wx.showToast({
              title: '发送成功',
              icon:'none',
            })
            this.getAllMessage()
            this.settine()
            wx.hideKeyboard({
              success: (res) => {
                Notify({ type: 'success', message: this.data.wait ,duration: 6000,});
              },
            })
          }
          else if(res.data.code==5){
            wx.showToast({
              title: '历史会话过长，请重置会话',
              icon:'none',
            })
            Dialog.confirm({
              title: '请选择',
              message: '是否要重置会话，重置后历史消息记录会被删除',
            }).then(()=>{
              this.resetConversation()
            }).catch(()=>{})

          }
        },
        complete:(res)=>{
          setTimeout(() => {
            wx.hideLoading()
          }, 500);
          this.setData({
            question:''
          })
        }
      })
    }
  },
  //获取问题
  getquestion(e){
    if(e.detail.value.length<=300){
      this.setData({
        question:e.detail.value
      })
    }
    else{
      wx.showToast({
        title: '字数上限300',
        icon:'none'
      })
    }
  },

  // 自动刷新
  settine()
  {
    setTimeout(()=>{
      this.getAllMessage()
    },120000)
  },

  // 获取等待消息数
  getwait()
  {
    if(this.data.openid!=null && this.data.host!=null)
    {
      wx.showLoading({
        title: '发送中',
      })
      wx.request({
        url: this.data.host+'/chatgpt/getwait',
        method:'GET',
        success:(res)=>{
          var min=res.data==0?1:res.data+1
          this.setData({
            wait:"您前面还有"+res.data+"条消息需要处理，预计耗费"+min+"分钟"
          })
          this.sendQuestion()
        },
        fail:()=>{
          wx.showToast({
            title: '发送失败',
            icon:'error'
          })
        },
        complete:()=>{
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    }
  },
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

  

  data: {
    top:0,
    kl:null,
    top:0,
    host:null,
    openid:null,
    judges:false,
    waitJudges:false,
    waitCode:0,
    message:[],
    question:'',
    pic:'',
    show:true,
    wait:'cbfhbdf',
    topNum:3019

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
      pic:options.pic
    })
    this.getrequest()
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          top:result.windowHeight
        })
      },
    })
    setInterval(()=>{
      if(this.data.waitJudges){
        this.emailCheck(this.data.waitCode);
      }
    },3000)
    this.getAllMessage()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          top:result.windowHeight
        })
      },
    })
    this.setData({
      kl:'i'
    })
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