// pages/collection/collection.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/store";
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  delete(openid,id){
    wx.showLoading({
      title: '删除中',
    })
    wx.request({
      url: this.data.host+'/collect/'+openid+'/'+id,
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
          var shuzu=[]
          var index=0
          for(var i in this.data.likelist)
          {
            if(this.data.likelist[i].id!=id)
            {
              shuzu[index]=this.data.likelist[i]
              index=index+1
            }
          }
          this.setData({
            likelist:shuzu
          })
          wx.showToast({
            title: '删除成功',
          })
        }
      },
      fail(){
        wx.showToast({
          title: '删除失败',
          icon:'error'
        })
      },
      complete:()=>{
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {
            },
          })
        }, 2000);
      }
    })
  },
  OnDelete(event) {
    var index=event.target.dataset.index
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        Dialog.confirm({
          title: '请选择',
          message: '是否要删除该收藏商品',
        })
          .then(() => {
            // on confirm
            this.delete(this.data.openid,this.data.likelist[index].id)
          })
          .catch(() => {
            // on cancel
          });
        break;
      case 'right':
        instance.close();
        Dialog.confirm({
          title: '请选择',
          message: '是否要删除该收藏商品',
        })
          .then(() => {
            // on confirm
            this.delete(this.data.openid,this.data.likelist[index].id)
          })
          .catch(() => {
            // on cancel
          });
        break;
    }
  },
  togoods(e){
    var index=parseInt(e.target.dataset.index)
    this.updategoods(this.data.likelist[index])
    wx.navigateTo({
      url: '../../goods/pages/goods/goods?openid='+this.data.likelist[index].openid+'&rate=c',
    })
  },
  getlikegoods(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/collect/'+this.data.openid,
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            likelist:res.data.goodlist[0]
          })
        }
      },
      fail(){
        wx.showToast({
          title: '加载失败',
          icon:'error'
        })
      },
      complete:()=>{
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
  },
  /**
   * 页面的初始数据
   */
  data: {
    likelist:[],
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
    const app=getApp()
    const host1=app.globalData.localhost
    const id=app.globalData.mineid
    this.setData({
      openid:id,
      host:host1,
    })
    if(this.data.openid!=null)
    {
      this.getlikegoods()
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
      openid:id,
      host:host1,
    })
    if(this.data.openid!=null)
    {
      this.getlikegoods()
    }
    else
    {
      this.setData({
        likelist:[]
      })
      wx.showToast({
        title: '请先登录',
        icon:'error'
      })
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
    if(this.data.openid!=null)
    {
      this.getlikegoods()
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