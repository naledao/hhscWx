// pages/purchase/purchase.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/store";
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  // 跳转到消息通道
  tochannel(e){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '跳转中',
      })
      var id=e.target.dataset.id
      var title=e.target.dataset.name
      wx.request({
        url: this.data.host+'/msg/yn/'+id+'/'+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data==0)
          {
            wx.showToast({
              title: '通道已关闭',
              icon:'none'
            })
          }
          if(res.data==1)
          {
            wx.navigateTo({
              url: '../../msgchannel/pages/msgchannel/msgchannel?id='+id+'&title='+title,
            })
          }
        },
        fail(){
          wx.showToast({
            title: '跳转失败',
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
  // 询问是否执行交易完成
  confirmfinish(e)
  {
    var rate=e.target.dataset.rate
    var id=e.target.dataset.id
    Dialog.confirm({
      title: '请选择',
      message: '是否确定交易完成',
    })
      .then(() => {
        wx.showLoading({
          title: '请稍等',
        })
        wx.request({
          url: this.data.host+'/purchase/finish/'+rate+'/'+id+'/'+this.data.openid,
          method:'POST',
          success:(res)=>{
            if(res.data==0)
            {
              wx.showToast({
                title: '操作失败',
                icon:'none'
              })
            }
            if(res.data==1)
            {
              wx.showToast({
                title: '操作成功,等待与你交易的对方确认交易',
                icon:'none'
              })
            }
            if(res.data==2)
            {
              wx.showToast({
                title: '正在等待与你交易的对方确认交易完成',
                icon:'none'
              })
            }
            if(res.data==3)
            {
              wx.showToast({
                title: '交易已完成',
              })
              setTimeout(() => {
                this.gets()
                this.geta()
                this.getb()
                this.getc()
              }, 400);
            }
          },
          fail(){
            wx.showToast({
              title: '操作失败',
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
  giveupget(rate,goodid,name){
    console.log(rate);
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '放弃求购中',
      })
      wx.request({
        url: this.data.host+'/purchase/'+goodid+'/'+this.data.openid+'/'+rate+'?name='+name,
        method:'DELETE',
        success:(res)=>{
          if(res.data==1)
          {
            wx.showToast({
              title: '操作成功',
            })
            setTimeout(() => {
              this.gets()
              this.geta()
              this.getb()
              this.getc()
            }, 400);
          }
          if(res.data==0)
          {
            wx.showToast({
              title: '放弃失败',
              icon:'none'
            })
          }
        },
        fail(){
          wx.showToast({
            title: '放弃失败',
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
        title: '请先登录',
        icon:'error'
      })
    }
  },
  // 放弃求购
  giveup(e){
    var index=e.target.dataset.index
    var rate=e.target.dataset.rate
    var status=e.target.dataset.status
    Dialog.confirm({
      title: '请选择',
      message: '是否要删除该求购商品',
    })
      .then(() => {
        if(rate=='s')
        {
          if(status==0)
          {
            this.giveupget('s','s'+this.data.sgoodlist_ing[index].id,this.data.sgoodlist_ing[index].name)
          }
          if(status==1)
          {
            this.giveupget('s','s'+this.data.sgoodlist_end[index].id,this.data.sgoodlist_end[index].name)
          }
        }
        if(rate=='a')
        {
          if(status==0)
          {
            this.giveupget('a','a'+this.data.agoodlist_ing[index].id,this.data.agoodlist_ing[index].name)
          }
          if(status==1)
          {
            this.giveupget('a','a'+this.data.agoodlist_end[index].id,this.data.agoodlist_end[index].name)
          }
        }
        if(rate=='b')
        {
          if(status==0)
          {
            this.giveupget('b','b'+this.data.bgoodlist_ing[index].id,this.data.bgoodlist_ing[index].name)
          }
          if(status==1)
          {
            this.giveupget('b','b'+this.data.bgoodlist_end[index].id,this.data.bgoodlist_end[index].name)
          }
        }
        if(rate=='c')
        {
          if(status==0)
          {
            this.giveupget('c',this.data.cgoodlist_ing[index].id,this.data.cgoodlist_ing[index].name)
          }
          if(status==1)
          {
            this.giveupget('c',this.data.cgoodlist_end[index].id,this.data.cgoodlist_end[index].name)
          }
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  // 转到详情页面
  togood(e)
  {
    var index=e.target.dataset.index
    var rate=e.target.dataset.rate
    var status=e.target.dataset.status
    if(rate=='s')
    {
      if(status==0)
      {
        this.updategoods(this.data.sgoodlist_ing[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.sgoodlist_ing[index].openid+'&rate=s',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.sgoodlist_end[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.sgoodlist_end[index].openid+'&rate=s',
        })
      }
    }
    if(rate=='a')
    {
      if(status==0)
      {
        this.updategoods(this.data.agoodlist_ing[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.agoodlist_ing[index].openid+'&rate=a',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.agoodlist_end[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.agoodlist_end[index].openid+'&rate=a',
        })
      }
    }
    if(rate=='b')
    {
      if(status==0)
      {
        this.updategoods(this.data.bgoodlist_ing[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.bgoodlist_ing[index].openid+'&rate=b',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.bgoodlist_end[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.bgoodlist_end[index].openid+'&rate=b',
        })
      }
    }
    if(rate=='c')
    {
      if(status==0)
      {
        this.updategoods(this.data.cgoodlist_ing[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.cgoodlist_ing[index].openid+'&rate=c',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.cgoodlist_end[index])
        wx.navigateTo({
          url: '../../goods/pages/goods/goods?openid='+this.data.cgoodlist_end[index].openid+'&rate=c',
        })
      }
    }
  },
  // 求购c
  getc(){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/purchase/purChis/'+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              cgoodlist_ing:res.data.goodlist[0],
              cgoodlist_end:res.data.goodlist_end[0]
            })
          }
          if(res.data.code==0)
          {
            this.setData({
              cgoodlist_ing:[],
              cgoodlist_end:[]
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
    }
  },
  // 求购b
  getb(){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/purchase/purBhis/'+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              bgoodlist_ing:res.data.goodlist[0],
              bgoodlist_end:res.data.goodlist_end[0]
            })
          }
          if(res.data.code==0)
          {
            this.setData({
              bgoodlist_ing:[],
              bgoodlist_end:[]
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
    }
  },
  // 求购a
  geta(){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/purchase/purAhis/'+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              agoodlist_ing:res.data.goodlist[0],
              agoodlist_end:res.data.goodlist_end[0]
            })
          }
          if(res.data.code==0)
          {
            this.setData({
              agoodlist_ing:[],
              agoodlist_end:[]
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
    }
  },
  // 求购s
  gets(){
    if(this.data.openid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/purchase/purShis/'+this.data.openid,
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              sgoodlist_ing:res.data.goodlist[0],
              sgoodlist_end:res.data.goodlist_end[0]
            })
          }
          if(res.data.code==0)
          {
            this.setData({
              sgoodlist_ing:[],
              sgoodlist_end:[],
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
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    host:null,
    openid:null,
    sgoodlist_ing:[],
    agoodlist_ing:[],
    bgoodlist_ing:[],
    cgoodlist_ing:[],
    sgoodlist_end:[],
    agoodlist_end:[],
    bgoodlist_end:[],
    cgoodlist_end:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["goods"],
      actions: ["updategoods"],
    });
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      host:host1,
      openid:id,
    })
    if(this.data.openid!=null)
    {
      this.gets()
      this.geta()
      this.getb()
      this.getc()
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
      host:host1,
      openid:id,
    })
    if(this.data.openid==null)
    {
      this.setData({
        agoodlist_end:[],
        agoodlist_ing:[],
        bgoodlist_end:[],
        bgoodlist_ing:[],
        cgoodlist_end:[],
        cgoodlist_ing:[],
        sgoodlist_end:[],
        sgoodlist_ing:[]
      })
    }
    else
    {
      this.gets()
      this.geta()
      this.getb()
      this.getc()
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
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      host:host1,
      openid:id,
    })
    if(this.data.openid!=null)
    {
      this.gets()
      this.geta()
      this.getb()
      this.getc()
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