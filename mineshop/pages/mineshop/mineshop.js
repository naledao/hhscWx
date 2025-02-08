// mineshop/pages/mineshop/mineshop.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../store/store";
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  // 前往消息通道
  tochannel(e){
    if(this.data.openid!=null)
    {
      var id=e.target.dataset.id
      var title=e.target.dataset.name
      wx.showLoading({
        title: '跳转中',
      })
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
              url: '../../../msgchannel/pages/msgchannel/msgchannel?id='+id+'&title='+title,
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
                this.getsmine()
                this.getamine()
                this.getbmine()
                this.getcmine()
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
  // 确认终止求购
  confirmend(rate,goodid,openid,purid){
    wx.showLoading({
      title: '请稍等',
    })
    wx.request({
      url: this.data.host+'/user/end/'+rate+'/'+goodid+'/'+openid+'/'+purid,
      method:'POST',
      success:(res)=>{
        if(res.data==0)
        {
          wx.showToast({
            title: '终止求购失败',
            icon:'none'
          })
        }
        if(res.data==1)
        {
          setTimeout(()=>{
            this.getsmine()
            this.getamine()
            this.getbmine()
            this.getcmine()
          },400)
          setTimeout(()=>{
            wx.showToast({
              title: '操作成功',
            })
          },600)
        }
      },
      fail(){
        wx.showToast({
          title: '终止失败',
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
  // 终止求购
  endpur(e){
    var rate=e.target.dataset.rate
    var index=e.target.dataset.index
    Dialog.confirm({
      title: '确定要终止求购吗',
      message: '终止求购后将开启与买家的消息通道',
    })
      .then(() => {
        if(rate=='s')
        {
          this.confirmend('s',this.data.slist_ing[index].id,this.data.openid,this.data.slist_ing[index].purchase_people)
        }
        if(rate=='a')
        {
          this.confirmend('a',this.data.alist_ing[index].id,this.data.openid,this.data.alist_ing[index].purchase_people)
        }
        if(rate=='b')
        {
          this.confirmend('b',this.data.blist_ing[index].id,this.data.openid,this.data.blist_ing[index].purchase_people)
        }
        if(rate=='c')
        {
          this.confirmend('c',this.data.clist_ing[index].id,this.data.openid,this.data.clist_ing[index].purchase_people)
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  // 确认删除商品
  confirmdel(rate,goodid,openid){
    wx.request({
      url: this.data.host+'/user/'+rate+'/'+goodid+'/'+openid,
      method:'DELETE',
      success:(res)=>{
        if(res.data==0)
        {
          wx.showToast({
            title: '删除失败',
            icon:'error'
          })
        }
        if(res.data==1)
        {
          wx.showToast({
            title: '交易中的商品不可删除',
            icon:'none'
          })
        }
        if(res.data==2)
        {
          setTimeout(()=>{
            this.getsmine()
            this.getamine()
            this.getbmine()
            this.getcmine()
          },400)
          setTimeout(()=>{
            wx.showToast({
              title: '删除成功',
            })
          },600)
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
  },
  // 删除商品
  deletegood(e){
    var rate=e.target.dataset.rate
    var index=e.target.dataset.index
    var status=e.target.dataset.status
    Dialog.confirm({
      title: '请选择',
      message: '是否要删除该发布的商品',
    })
      .then(() => {
        if(rate=='s')
        {
          if(status=='all')
          {
            this.confirmdel(rate,this.data.slist_all[index].id,this.data.openid)
          }
          if(status=='ing')
          {
            this.confirmdel(rate,this.data.slist_ing[index].id,this.data.openid)
          }
        }
        if(rate=='a')
        {
          if(status=='all')
          {
            this.confirmdel(rate,this.data.alist_all[index].id,this.data.openid)
          }
          if(status=='ing')
          {
            this.confirmdel(rate,this.data.alist_ing[index].id,this.data.openid)
          }
        }
        if(rate=='b')
        {
          if(status=='all')
          {
            this.confirmdel(rate,this.data.blist_all[index].id,this.data.openid)
          }
          if(status=='ing')
          {
            this.confirmdel(rate,this.data.blist_ing[index].id,this.data.openid)
          }
        }
        if(rate=='c')
        {
          if(status=='all')
          {
            this.confirmdel(rate,this.data.clist_all[index].id,this.data.openid)
          }
          if(status=='ing')
          {
            this.confirmdel(rate,this.data.clist_ing[index].id,this.data.openid)
          }
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  // 转到商品详细面
  togood(e){
    var rate=e.target.dataset.rate
    var index=e.target.dataset.index
    var status=e.target.dataset.status
    if(rate=='s')
    {
      if(status==0)
      {
        this.updategoods(this.data.slist_all[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.slist_all[index].openid+'&rate=s',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.slist_ing[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.slist_ing[index].openid+'&rate=s',
        })
      }
      if(status==2)
      {
        this.updategoods(this.data.slist_end[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.slist_end[index].openid+'&rate=s',
        })
      }
    }
    if(rate=='a')
    {
      if(status==0)
      {
        this.updategoods(this.data.alist_all[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.alist_all[index].openid+'&rate=a',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.alist_ing[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.alist_ing[index].openid+'&rate=a',
        })
      }
      if(status==2)
      {
        this.updategoods(this.data.alist_end[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.alist_end[index].openid+'&rate=a',
        })
      }
    }
    if(rate=='b')
    {
      if(status==0)
      {
        this.updategoods(this.data.blist_all[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.blist_all[index].openid+'&rate=b',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.blist_ing[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.blist_ing[index].openid+'&rate=b',
        })
      }
      if(status==2)
      {
        this.updategoods(this.data.blist_end[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.blist_end[index].openid+'&rate=b',
        })
      }
    }
    if(rate=='c')
    {
      if(status==0)
      {
        this.updategoods(this.data.clist_all[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.clist_all[index].openid+'&rate=c',
        })
      }
      if(status==1)
      {
        this.updategoods(this.data.clist_ing[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.clist_ing[index].openid+'&rate=c',
        })
      }
      if(status==2)
      {
        this.updategoods(this.data.clist_end[index])
        wx.navigateTo({
          url: '../../../goods/pages/goods/goods?openid='+this.data.clist_end[index].openid+'&rate=c',
        })
      }
    }
  },
  // 获取全部c商品
  getcmine(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/user/getallminegoods/'+this.data.openid+'/c',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            clist_all:res.data.all,
            clist_ing:res.data.ing,
            clist_end:res.data.end
          })
        }
        if(res.data.code==0)
        {
          this.setData({
            clist_all:[],
            clist_ing:[],
            clist_end:[]
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
  },




  // 获取全部b商品
  getbmine(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/user/getallminegoods/'+this.data.openid+'/b',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            blist_all:res.data.all,
            blist_ing:res.data.ing,
            blist_end:res.data.end
          })
        }
        if(res.data.code==0)
        {
          this.setData({
            blist_all:[],
            blist_ing:[],
            blist_end:[]
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
  },



  // 获取全部a商品
  getamine(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/user/getallminegoods/'+this.data.openid+'/a',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            alist_all:res.data.all,
            alist_ing:res.data.ing,
            alist_end:res.data.end
          })
        }
        if(res.data.code==0)
        {
          this.setData({
            alist_all:[],
            alist_ing:[],
            alist_end:[]
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
  },



  // 获取s全部商品
  getsmine(){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/user/getallminegoods/'+this.data.openid+'/s',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            slist_all:res.data.all,
            slist_ing:res.data.ing,
            slist_end:res.data.end
          })
        }
        if(res.data.code==0)
        {
          this.setData({
            slist_all:[],
            slist_ing:[],
            slist_end:[]
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
  },
  /**
   * 页面的初始数据
   */
  data: {
    shan:false,
    openid:null,
    host:null,
    slist_all:[],
    slist_ing:[],
    slist_end:[],
    alist_all:[],
    alist_ing:[],
    alist_end:[],
    blist_all:[],
    blist_ing:[],
    blist_end:[],
    clist_all:[],
    clist_ing:[],
    clist_end:[]
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
      host:host1
    })
    if(this.data.openid!=null)
    {
      this.getsmine()
      this.getamine()
      this.getbmine()
      this.getcmine()
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
      this.getsmine()
      this.getamine()
      this.getbmine()
      this.getcmine()
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