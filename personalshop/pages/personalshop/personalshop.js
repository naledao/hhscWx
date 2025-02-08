// personalshop/pages/personalshop/personalshop.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../store/store";
Page({
  togood(e)
  {
    var rate=e.target.dataset.rate
    if(rate=='s')
    {
      this.updategoods(this.data.slist[0])
      wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.sellerid+'&rate=s',
    })
    }
    if(rate=='a')
    {
      this.updategoods(this.data.alist[0])
      wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.sellerid+'&rate=a',
    })
    }
    if(rate=='b')
    {
      var index=e.target.dataset.index
      this.updategoods(this.data.blist[index])
      wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.sellerid+'&rate=b',
    })
    }
    if(rate=='c')
    {
      var index=e.target.dataset.index
      this.updategoods(this.data.clist[index])
      wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.sellerid+'&rate=c',
    })
    }
  },
  gets(){
    if(this.data.sellerid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/warehouse/'+this.data.sellerid+'/s',
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              slist:res.data.goodlist[0]
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
  geta(){
    if(this.data.sellerid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/warehouse/'+this.data.sellerid+'/a',
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              alist:res.data.goodlist[0]
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
  getb(){
    if(this.data.sellerid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/warehouse/'+this.data.sellerid+'/b',
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              blist:res.data.goodlist[0]
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
  getc(){
    if(this.data.sellerid!=null)
    {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/warehouse/'+this.data.sellerid+'/c',
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              clist:res.data.goodlist[0]
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
    host:null,
    openid:null,
    sellerid:null,
    slist:[],
    alist:[],
    blist:[],
    clist:[]
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
      openid:id,
      host:host1,
      sellerid:options.sellerid
    })
    this.gets()
    this.geta()
    this.getb()
    this.getc()
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