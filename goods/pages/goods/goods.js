// goods/pages/goods/goods.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import {store} from "../../../store/store"
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog'
Page({
  // 复制评论
  fuzhicom(e)
  {
    var index=e.target.dataset.com
    wx.setClipboardData({
      data: index,
      success (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 复制描述
  fuzhides(e)
  {
    var index=e.target.dataset.des
    wx.setClipboardData({
      data: index,
      success (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 复制名字
  fuzhiname(e)
  {
    var index=e.target.dataset.name
    wx.setClipboardData({
      data: index,
      success (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 赋值留言
  setcomment(e)
  {
    this.setData({
      comments:e.detail.value
    })
  },
  // 获取留言
  getcomments()
  {
    var goodid="";
    if(this.data.rate=='c')
    {
      goodid=this.data.chul
    }
    else if(this.data.rate=='b')
    {
      goodid=this.data.chul2;
    }
    else if(this.data.rate=='a')
    {
      goodid=this.data.user.openid
    }
    else if(this.data.rate=='s')
    {
      goodid=this.data.user.openid
    }
    wx.request({
      url: this.data.localhost+"/comments/get/"+this.data.rate+"?goodid="+goodid,
      method:'GET',
      success:(res)=>{
        this.setData({
          comlist:res.data
        })
      }
    })
  },
  // 发送留言
  sendcomments()
  {
    if(this.data.mineopenid!=null)
    {
      if(this.data.comments.length==null || this.data.comments.length.length==0 || this.data.comments.length>1000)
      {
        wx.showToast({
          title: '字数在1-1000之间',
          icon:'none'
        })
        return
      }
      var goodid="";
      if(this.data.rate=='c')
      {
        goodid=this.data.chul
      }
      else if(this.data.rate=='b')
      {
        goodid=this.data.chul2;
      }
      else if(this.data.rate=='a')
      {
        goodid=this.data.user.openid
      }
      else if(this.data.rate=='s')
      {
        goodid=this.data.user.openid
      }
      wx.showLoading({
        title: '留言中...',
      })
      wx.request({
        url: this.data.localhost+"/comments/send/"+this.data.rate+"?goodid="+goodid+"&people="+this.data.mineopenid+"&str="+this.data.comments+"&buyer="+this.data.user.openid,
        method:'POST',
        success:(res)=>{
          if(res.data==0)
          {
            wx.showToast({
              title: '留言失败',
              icon:'none'
            })
          }
          else if(res.data==1)
          {
            wx.showToast({
              title: '留言成功',
            })
            this.getcomments()
            this.setData({
              comments:""
            })
          }
        },
        fail:()=>{
          wx.showToast({
            title: '留言失败',
            icon:'error'
          })
        },
        complete:()=>{
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {},
            })
          }, 2000);
        }
      })
    }
    else
    {
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
    }
  },
  // 复制链接
  fucklian(){
    wx.setClipboardData({
      data: 'http://47.100.9.232:9090/payPage/pay.html?orderId='+this.data.payid,
      success (res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },
  // 店铺
  topersonalshop(){
    wx.navigateTo({
      url: '../../../personalshop/pages/personalshop/personalshop?sellerid='+this.getgood().openid,
    })
  },
  // 收藏
  ToCollection(){
    if(this.data.rate=='c')
    {
      wx.request({
        url: this.data.localhost+'/collect/'+this.data.mineopenid+'/'+this.getgood().id,
        method:'POST',
        success:(res)=>{
          if(res.data==4)
          {
            wx.showToast({
              title: '你已收藏该商品',
              icon:'none'
            })
          }
          if(res.data==0)
          {
            wx.showToast({
              title: '收藏失败',
              icon:'none'
            })
          }
          if(res.data==1)
          {
            wx.showToast({
              title: '收藏成功',
              icon:'none'
            })
          }
          if(res.data==2)
          {
            wx.showToast({
              title: '收藏数量达到上限',
              icon:'none'
            })
          }
        },
        fail(){
          wx.showToast({
            title: '收藏失败',
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
    else
    {
      wx.showToast({
        title: '只可对普通商品进行收藏',
        icon:'none'
      })
    }
  },
  // 请求创建订单
  getpayorder(){
    var price=3.0
    var url=''
    if(this.data.rate=='s')
    {
      price=3.0*this.data.day
      url=this.data.localhost+'/start/'+this.data.mineopenid+'/'+price
    }
    if(this.data.rate=='a')
    {
      price=2.0*this.data.day
      url=this.data.localhost+'/roll/'+this.data.mineopenid+'/'+price
    }
    if(this.data.rate=='b')
    {
      price=1.0*this.data.day
      url=this.data.localhost+'/slide/'+this.data.mineopenid+'/'+price
    }
    wx.request({
      url: url,
      method:"POST",
      success:(res)=>{
        if(res.data.code==10)
        {
          wx.showToast({
            title: '操作超时',
            icon:'none'
          })
        }
        if(res.data.code==11)
        {
          wx.showToast({
            title: '创建订单失败',
            icon:'none'
          })
        }
        if(res.data.code==12)
        {
          this.setData({
            start1:true,
            start:false,
            payid:res.data.message
          })
        }
        if(res.data.code==0)
        {
          wx.showToast({
            title: '创建订单失败',
            icon:"none"
          })
        }
        if(res.data.code==1)
        {
          // 获取订单成功
          this.setData({
            start1:true,
            start:false,
            payid:res.data.message
          })
        }
        if(res.data.code==241)
        {
          wx.showToast({
            title: '创建订单失败',
            icon:"none"
          })
        }
      },
      fail(){
        wx.showToast({
          title: '创建订单失败',
          icon:"none"
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
  // 商品存在天数
  onChangeday(event) {
    this.setData({
      day:event.detail
    })
  },

  // 确认求购
  confirmqiu(){
    // 检查是否登录
    if(this.data.mineopenid==null)
    {
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
      return
    }
    wx.showLoading({
      title: '求购中',
    })
    var path=''
    if(this.data.rate=='s')
    {
      path=this.data.localhost+"/purchase/purchaseS/"+this.data.mineopenid
    }
    if(this.data.rate=='a')
    {
      path=this.data.localhost+"/purchase/purchaseA/"+this.data.mineopenid
    }
    if(this.data.rate=='b')
    {
      path=this.data.localhost+"/purchase/purchaseB/"+this.data.mineopenid+"/"+this.getgood().id
    }
    if(this.data.rate=='c')
    {
      path=this.data.localhost+"/purchase/purchaseC/"+this.data.mineopenid+"/"+this.getgood().id
    }
    wx.request({
      url: path,
      method:"POST",
      success:(res)=>{
        console.log(res.data);
        if(res.data==0 || res.data==31){
          wx.showToast({
            title: '求购超时,请重新发起求购',
            icon:"none"
          })
        }
        if(res.data==1 || res.data==32){
          // wx.showToast({
          //   title: '求购成功',
          //   icon:"success"
          // })
          this.setData({
            purchase:false
          })
          Dialog.alert({
            title: '求购成功',
            message: '求购成功后，待发布者终止求购后，将开启你与发布者的消息通道，你可在底部消息栏中查看，在消息通道中你可与发布者约定线下交易地点或时间等等。注意，在发布者终止求购之前，任何用户都可出更高的求购价来抢夺与发布者的交易机会。你可在底部求购区中查看正在求购的商品。',
          }).then(() => {
            // on close
          });
        }
        if(res.data==2 || res.data==30){
          wx.showToast({
            title: '求购失败',
            icon:'error'
          })
        }
        if(res.data==241){
          wx.showToast({
            title: '求购失败，请重试',
            icon:"error"
          })
        }
      },
      complete(){
        setTimeout(()=>{
          wx.hideLoading({
            success: (res) => {},
          })
        },600)
      },
      fail(){
        wx.showToast({
          title: '求购失败，请重试',
          icon:"error"
        })
      }
    })
  },


  // 取消求购
  cancelgou(){
    this.setData({
      purchase:false,
    })
  },
  comment:function(){
    this.setData({comment_left:"0"});
   this.setData({i:"end"});

  },
  commentcancel:function(){
    this.setData({comment_left:"-100%"});
  },



  // 检查是否可以求购
  nowpurchase(){
    // 检查是否登录
    if(this.data.mineopenid==null)
    {
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
      this.setData({
        purchase:false
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    var path=''
    if(this.data.rate=='s')
    {
      path=this.data.localhost+"/purchase/purchaseS/"+this.data.mineopenid
    }
    if(this.data.rate=='a')
    {
      path=this.data.localhost+"/purchase/purchaseA/"+this.data.mineopenid
    }
    if(this.data.rate=='b')
    {
      path=this.data.localhost+"/purchase/purchaseB/"+this.data.mineopenid+'/'+this.getgood().id
    }
    if(this.data.rate=='c')
    {
      path=this.data.localhost+"/purchase/purchaseC/"+this.data.mineopenid+'/'+this.getgood().id
    }
    wx.request({
      url: path,
      method:"GET",
      success:(res)=>{
        // 当前商品不可求购
        if(res.data.code==0 || res.data.code==34){
          wx.showToast({
            title: '当前商品不可求购',
            icon:"none"
          })
          this.setData({
            purchase:false,
          })
        }
        // 当前商品可以求购
        if(res.data.code==1 || res.data.code==32){
          this.setData({
            purchaseprice:res.data.message,
            purchase:true,
          })
        }
        // 已经有人操作
        if(res.data.code==2 || res.data.code==33){
          wx.showToast({
            title: '请等待当前用户求完成在操作',
            icon:"none",
          })
          this.setData({
            purchase:false,
          })
        }
        // 卖家无法购买自己的商品
        if(res.data.code==3 || res.data.code==31){
          wx.showToast({
            title: '无法求购自己发布的商品',
            icon:"none",
          })
          this.setData({
            purchase:false,
          })
        }
        if(res.data.code==241 || res.data.code==30){
          wx.showToast({
            title: '求购失败，请重试',
            icon:'none'
          })
        }
      },
      fail(){
        wx.showToast({
          title: '请重试',
          icon:"none"
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



  // 抢占首页/滚动
  graphonepage(){
    if(this.data.mineopenid==null)
    {
      wx.showToast({
        title: '请先登录',
        icon:"error"
      })
      return
    }
    // 抢占首页
    if(this.data.rate=='s')
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.localhost+'/start/'+this.data.mineopenid,
        method:"GET",
        success:(res)=>{
          if(res.data.code==1){
            wx.showToast({
              title: '已被人抢占',
              icon:"none"
            })
            this.setData({
              start:false
            })
          }
          if(res.data.code==2){
            wx.showToast({
              title: '你已抢占首页',
              icon:"none"
            })
            this.setData({
              start:false
            })
          }
          // 可以抢占
          if(res.data.code==0){
            this.setData({
              start:true
            })
          }
          // 有人正在操作
          if(res.data.code==3){
            wx.showToast({
              title: '请等待当前用户操作完成',
              icon:"none"
            })
          }
          // 操作超时
          if(res.data.code==4)
          {
            this.setData({
              start:false
            })
            wx.showToast({
              title: '操作超时',
              icon:"none"
            })
          }
          // 返回订单
          if(res.data.code==5)
          {
            this.setData({
              start1:true,
              start:false,
              payid:res.data.message
            })
          }
          // 尽快使用密匙
          if(res.data.code==10)
          {
            wx.showToast({
              title: '请尽快使用密匙',
              icon:"none"
            })
          }
          if(res.data==241){
            wx.showToast({
              title: '抢占失败,请重试',
              icon:"error"
            })
          }
        },
        fail(){
          wx.showToast({
            title: '请重试',
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


    // 抢占滚动
    if(this.data.rate=='a')
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.localhost+'/roll/'+this.data.mineopenid,
        method:"GET",
        success:(res)=>{
          if(res.data.code==1){
            wx.showToast({
              title: '已被人抢占',
              icon:"none"
            })
            this.setData({
              start:false
            })
          }
          if(res.data.code==2){
            wx.showToast({
              title: '你已抢占首页',
              icon:"none"
            })
            this.setData({
              start:false
            })
          }
                    // 可以抢占
          if(res.data.code==0){
            this.setData({
              start:true
            })
          }
                    // 有人正在操作
          if(res.data.code==3){
            wx.showToast({
              title: '请等待当前用户操作完成',
              icon:"none"
            })
          }
                    // 操作超时
          if(res.data.code==4)
          {
            this.setData({
              start:false
            })
            wx.showToast({
              title: '操作超时',
              icon:"none"
            })
          }
                    // 返回订单
          if(res.data.code==5)
          {
            this.setData({
              start1:true,
              start:false,
              payid:res.data.message
            })
          }
                    // 尽快使用密匙
          if(res.data.code==10)
          {
            wx.showToast({
              title: '请尽快使用密匙',
              icon:"none"
            })
          }
          if(res.data==241){
            wx.showToast({
              title: '抢占失败,请重试',
              icon:"error"
            })
          }
        },
        fail(){
          wx.showToast({
            title: '请重试',
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

    // 抢占轮播
    if(this.data.rate=='b')
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.localhost+'/slide/'+this.data.mineopenid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==0)
          {
            // 返回该用户未完成的订单
            this.setData({
              start1:true,
              start:false,
              payid:res.data.message
            })
          }
          if(res.data.code==1)
          {
            // 可以抢占
            this.setData({
              start:true
            })
          }
          if(res.data.code==2)
          {
            wx.showToast({
              title: '已全部被人抢占',
              icon:'none'
            })
          }
          if(res.data.code==3)
          {
            wx.showToast({
              title: '操作人数达到上限',
              icon:'none'
            })
          }
          if(this.data.code==241)
          {
            wx.showToast({
              title: '抢占失败',
              icon:'none'
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
          setTimeout(function(){
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        }
      })
    }

    // 发布商品
    if(this.data.rate=='c')
    {
      wx.navigateTo({
        url: '../../../releasegood/pages/releasegood/releasegood?openid='+this.data.mineopenid+'&key=1'+'&choice=c'
      })
    }
  },
  onChange(event){
    this.setData({ active: event.detail });
  },
  onClose3(){
    this.setData({ purchase: false });
  },
  onClose2(){
    this.setData({ start: false , start1:false});
  },
  onClose(){
    this.setData({ show: false });
  },
  showPopup(url){
    // this.setData({
    //   top:url.currentTarget.dataset.url
    // })
    // this.setData({ show: true });
    var sc=[]
    var index=-1
    for(var i in this.data.images)
    {
      if(i!='id' && this.data.images[i]!=null && i!="keynm")
      {
        index=index+1;
        sc[index]=this.data.images[i]
      }
    }
    wx.previewImage({
      current: url.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: sc // 需要预览的图片http链接列表
  })
  },
  hj(){
    for(var i in this.data.images)
    {
      console.log(this.data.images[i]);
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    com_id:0,
    // 留言
    comments:"",
    // 支付订单id
    i:"begin",
    comment_left:"-100%",
    payid:null,
    start1:false,
    // 商品存在天数
    day:1,
    mineopenid:null,
    purchaseprice:0,
    purchase:false,
    start:false,
    active: 0,
    user:null,
    openid:"",
    show: false,
    top:"",
    images:null,
    localhost:"",
    chul:0,
    chul2:"",
    // 商品等级
    rate:null,
    // 留言列表
    comlist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const app=getApp()
    const host=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      localhost:host,
      openid:options.openid,
      mineopenid:id,
      rate:options.rate
    })
    wx.showLoading({
      title: '加载中',
    })
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["goods"],
      actions: ["updategoods","getgood"],
    });
    var comid=setInterval(() => {
      this.getcomments()
    }, 3000);
    this.setData({
      com_id:comid
    })
    // 添加商品浏览记录
    if(this.data.mineopenid!=null)
    {
      // 添加s级商品浏览记录
      if(this.data.rate=='s')
      {
        wx.request({
          url: this.data.localhost+'/store/sstore/'+this.data.mineopenid,
          method:"GET",
          complete(){
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
      // 添加a商品浏览记录
      if(this.data.rate=='a')
      {
        wx.request({
          url: this.data.localhost+'/astore/'+this.data.mineopenid,
          method:"POST",
          complete(){
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
            // 添加b商品浏览记录
      if(this.data.rate=='b')
      {
        var idq=this.getgood().id
        wx.request({
          url: this.data.localhost+'/bstore/'+this.data.mineopenid+"/"+idq,
          method:"POST",
          complete(){
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
      // 添加c级商品浏览记录
      if(this.data.rate=='c')
      {
        wx.request({
          url: this.data.localhost+'/cstore/history/'+this.data.mineopenid+'/'+this.getgood().id,
          method:'POST',
        })
      }
    }

    // 请求s级商品图片
    if(this.data.rate=='s')
    {
        wx.request({
          url: this.data.localhost+'/image/imageS',
          method:"GET",
          success:(res)=>{
            this.setData({
              images:res.data,
              top:res.data.img1,
              chul:res.data.id
            })
          
          },
          complete(){
            setTimeout(()=>{
              wx.hideLoading({
                success: (res) => {},
              })
            },2000)
          },
          fail(){
            wx.showToast({
              title: '请重试',
              icon:"error"
            })
          }
        })
    }

   // 请求a级商品图片
    if(this.data.rate=='a')
    {
      wx.request({
        url: this.data.localhost+'/astore/image',
        method:"GET",
        success:(res)=>{
          this.setData({
            images:res.data,
            top:res.data.img1,
            chul:res.data.id
          })
        },
        complete(){
          setTimeout(()=>{
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        },
        fail(){
          wx.showToast({
            title: '请重试',
            icon:"error"
          })
        }
      })
    }

    // 请求c级商品图片
    if(this.data.rate=='c')
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.localhost+'/cstore/image?id='+this.getgood().id,
        method:"GET",
        success:(res)=>{
          this.setData({
            images:res.data,
            top:res.data.img1,
            chul:res.data.id
          })
          this.getcomments()
        },
        fail(){
          wx.showToast({
            title: '加载失败',
            icon:'error'
          })
        },
        complete(){
          setTimeout(function(){
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        }
      })
    }


    // 请求b商品的图片
    if(this.data.rate=='b')
    {
      wx.showLoading({
        title: '加载中',
      })
      var idq=this.getgood().id
      wx.request({
        url: this.data.localhost+'/bstore/image/'+this.getgood().id,
        method:"GET",
        success:(res)=>{
          console.log(res.data);
          this.setData({
            images:res.data,
            top:res.data.img1,
            chul:res.data.id,
            chul2:res.data.keynm
          })
          this.getcomments()
        },
        fail(){
          wx.showToast({
            title: '请重试',
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

    // 请求卖家信息
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.localhost+'/user/'+this.data.openid,
      method:"GET",
      success:(res)=>{
        this.setData({
          user:res.data
        })
        this.getcomments()
      },
      fail(){
        wx.showToast({
          title: '请重试',
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
    // 获取留言
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
    clearInterval(this.data.com_id)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.storeBindings.destroyStoreBindings();
    clearInterval(this.data.com_id)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showLoading({
      title: '加载中',
    })
    // 请求s商品图片
    if(this.data.rate=='s')
    {
      wx.request({
        url: this.data.localhost+'/image/imageS',
        method:"GET",
        success:(res)=>{
          this.setData({
            images:res.data,
            top:res.data.img1
          })
        },
        fail(){
          wx.showToast({
            title: '请重试',
            icon:"error"
          })
        },
        complete(){
          setTimeout(()=>{
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
          wx.stopPullDownRefresh({
            success: (res) => {},
          })
        }
      })
    }

    // 请求a商品图片
    if(this.data.rate=='a')
    {
      wx.request({
        url: this.data.localhost+'/astore/image',
        method:"GET",
        success:(res)=>{
          this.setData({
            images:res.data,
            top:res.data.img1,
            chul:res.data.id
          })
        },
        complete(){
          setTimeout(()=>{
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        },
        fail(){
          wx.showToast({
            title: '请重试',
            icon:"error"
          })
        }
      })
    }

        // 请求b商品的图片
        if(this.data.rate=='b')
        {
          wx.showLoading({
            title: '加载中',
          })
          var idq=this.getgood().id
          wx.request({
            url: this.data.localhost+'/bstore/image/'+idq,
            method:"GET",
            success:(res)=>{
              this.setData({
                images:res.data,
                top:res.data.img1,
                chul:res.data.id,
                chul2:res.data.keynm
              })
            },
            fail(){
              wx.showToast({
                title: '请重试',
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

        // 请求c级商品图片
    if(this.data.rate=='c')
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.localhost+'/cstore/image?id='+this.getgood().id,
        method:"GET",
        success:(res)=>{
          this.setData({
            images:res.data,
            top:res.data.img1,
            chul:res.data.id
          })
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
          setTimeout(function(){
            wx.hideLoading({
              success: (res) => {},
            })
          },2000)
        }
      })
    }   
    
    

    // 请求卖家信息
    wx.request({
      url: this.data.localhost+'/user/'+this.data.openid,
      method:"GET",
      success:(res)=>{
        this.setData({
          user:res.data
        })
      },
      fail(){
        wx.showToast({
          title: '请重试',
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