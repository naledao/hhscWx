
// browsehis/pages/browsehis/browsehis.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../store/store";
Page({
  // 跳转到s级商品页面
  tosgood(e){
    var index=parseInt(e.target.dataset.index)
    this.updategoods(this.data.sgoods[0][index])
    wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.sgoods[0][index].openid+'&rate=s',
    })
  },


  // 跳转到a级商品页面
  toagood(e){
    var index=parseInt(e.target.dataset.index)
    this.updategoods(this.data.agoods[0][index])
    wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.agoods[0][index].openid+'&rate=a',
    })
  },


  // 跳转到b级商品页面
  tobgood(e){
    var index=parseInt(e.target.dataset.index)
    this.updategoods(this.data.bgoods[0][index])
    wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.bgoods[0][index].openid+'&rate=b',
    })
  },


  // 跳转到c级商品页面
  tocgood(e){
    var index=parseInt(e.target.dataset.index)
    this.updategoods(this.data.cgoods[0][index])
    wx.navigateTo({
      url: '../../../goods/pages/goods/goods?openid='+this.data.cgoods[0][index].openid+'&rate=c',
    })
  },



  // 请求c级商品浏览记录
  getC(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/browsehistory/'+this.data.openid+'/c',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            cgoods:res.data.goodlist
          })
        }
        if(res.data.code==241)
        {
          wx.showToast({
            title: '加载失败',
            icon:"error"
          })
        }
      },
      fail(){
        wx.showToast({
          title: '查询失败',
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
  },

  // 请求b级商品浏览记录
  getB(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/browsehistory/'+this.data.openid+'/b',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            bgoods:res.data.goodlist
          })
        }
        if(res.data.code==241)
        {
          wx.showToast({
            title: '加载失败',
            icon:"error"
          })
        }
      },
      fail(){
        wx.showToast({
          title: '查询失败',
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
  },





    // 请求a级商品浏览记录
    getA(){
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.data.host+'/browsehistory/'+this.data.openid+'/a',
        method:'GET',
        success:(res)=>{
          if(res.data.code==0){
          //  s级商品浏览记录为空
          }
          if(res.data.code==1){
            // 为s商品浏览记录赋值
            this.setData({
              agoods:res.data.goodlist
  
            })
          }
          if(res.data.code==241){
            wx.showToast({
              title: '查询失败',
              icon:"error"
            })
          }
        },
        fail(){
          wx.showToast({
            title: '查询失败',
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
    },




  // 请求s级商品浏览记录
  getS(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/browsehistory/'+this.data.openid+'/s',
      method:'GET',
      success:(res)=>{
        if(res.data.code==0){
        //  s级商品浏览记录为空
        }
        if(res.data.code==1){
          // 为s商品浏览记录赋值
          this.setData({
            sgoods:res.data.goodlist

          })
        }
        if(res.data.code==241){
          wx.showToast({
            title: '查询失败',
            icon:"error"
          })
        }
      },
      fail(){
        wx.showToast({
          title: '查询失败',
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
  },
  /**
   * 页面的初始数据
   */
  data: {
    sgoods:null,
    agoods:null,
    bgoods:null,
    cgoods:null,
    host:null,
    openid:null
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
    // 绑定主机和openid
    const app=getApp()
    const host1=app.globalData.localhost
    this.setData({
      host:host1,
      openid:options.openid
    })
    this.getS()
    this.getA()
    this.getB()
    this.getC()
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