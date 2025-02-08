// pages/start/start.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/store";
Page({
  // 跳过
  jump(){
    clearTimeout(this.data.timeid)
    this.setData({
      jumpflag:0
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 转到启动商品详细面
  togoods(){
    clearTimeout(this.data.timeid)
    if(this.data.openid!=null){
      // 添加浏览商品记录
      wx.showLoading({
        title: '加载中',
      })
    }
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["goods"],
      actions: ["updategoods"],
    });
    this.updategoods(this.data.goods)
    wx.redirectTo({
      url: '../../goods/pages/goods/goods?openid='+this.data.goods.openid+'&rate=s',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    time:2000,
    jumpflag:0,
    openid:null,
    pic:"",
    goods:{},
    localhost:"http://localhost:9630",
    id:1,
    timeid:null
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
      openid:id
    })
    wx.showLoading({
      title: '加载中',
    })
    // 请求商品信息
    wx.request({
      url: this.data.localhost+'/store/sstore/0',
      method:'GET',
      success:(res)=>{
        this.setData({
          goods:res.data,
          pic:res.data.pic
        })
      },
      fail(){
        wx.showToast({
          title: '请重试',
          icon:"error"
        })
      },
      complete:()=>{
        wx.hideLoading({
          success: (res) => {},
        })
        const z=setTimeout(function(){
          wx.switchTab({
            url: '/pages/index/index',
          })
        },6000)
        this.setData({
          timeid:z
        })
        setTimeout(()=>{
          this.setData({
            jumpflag:1
          })
        },2000)
      }
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
    this.storeBindings.destroyStoreBindings();
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
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.localhost+'/store/sstore',
      method:'GET',
      success:(res)=>{
        this.setData({
          goods:res.data,
          pic:res.data.pic
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
        wx.hideLoading({
          success: (res) => {},
        })
        // setTimeout(function(){
        //   wx.redirectTo({
        //     url: '../index/index',
        //   })
        // },6000)
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