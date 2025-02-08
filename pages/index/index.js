// pages/index/index.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../store/store";
Page({
  // 自定义搜索
  freesearch(text){
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      rate:'c',
      area:'all'
    })
    this.setData({
      all_btn:"background-color:#00917D;",
      south_btn:"background-color:#7FD1AE;",
      north_btn:"background-color:#7FD1AE;",
      hospital_btn:"background-color:#7FD1AE;",
    })
    if(this.data.searchpage==0)
    {
      this.setData({
        searchsend:true,
        searchpage:1,
        guanjianci:this.data.searchvalue,
        searchvalue:''
      })
      wx.request({
        url: this.data.host+'/selector/search/1?text='+text,
        method:'GET',
        success:(res)=>{
          if(res.data.code==0)
          {
            this.setData({
              goodslist:[]
            })
          }
          if(res.data.code==1)
          {
            this.setData({
              goodslist:res.data.goodlist[0]
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
          setTimeout(function(){
            wx.hideLoading({
              success: (res) => {
              },
            })
          },1000)
        }
      })
    }
    else
    {
      var len=this.data.goodslist.length
      wx.request({
        url: this.data.host+'/selector/search/'+this.data.searchpage+'?text='+this.data.guanjianci,
        method:'GET',
        success:(res)=>{
          if(res.data.code==1)
          {
            this.setData({
              goodslist:[...this.data.goodslist,...res.data.goodlist[0]]
            })
          }
        },
        fail(){
          wx.showToast({
            title: '加载失败',
          })
        },
        complete:()=>{
          setTimeout(()=>{
            wx.hideLoading({
              success: (res) => {
                if(this.data.goodslist.length==len)
                {
                  this.setData({
                    searchsend:false
                  })
                  wx.showToast({
                    title: '已加载完全部搜索商品',
                    icon:'none'
                  })
                }
              },
            })
          },1000)
        }
      })
    }
  },
  // 重置
  reset(){
    this.setData({
      'PageList[0].send':true,
      'PageList[0].page':1
    })
    this.setData({
      'PageList[1].send':true,
      'PageList[1].page':1
    })
    this.setData({
      'PageList[2].send':true,
      'PageList[2].page':1
    })
    this.setData({
      'PageList[3].send':true,
      'PageList[3].page':1
    })
  },
  // 添加goodslist
  addselectorgoods(rate,area,page){
    var len=this.data.goodslist.length
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/selector/'+rate+'/'+area+'/'+page,
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            goodslist:[...this.data.goodslist,...res.data.goodlist[0]]
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
        setTimeout(() => {
          wx.hideLoading({
            success: (res) => {
              if(this.data.goodslist.length==len)
              {
                for(var index in this.data.PageList)
                {
                  if(this.data.PageList[index].area==this.data.area)
                  {
                    if(index==0)
                    {
                      this.setData({
                        'PageList[0].send':false
                      })
                    }
                    if(index==1)
                    {
                      this.setData({
                        'PageList[1].send':false
                      })
                    }
                    if(index==2)
                    {
                      this.setData({
                        'PageList[2].send':false
                      })
                    }
                    if(index==3)
                    {
                      this.setData({
                        'PageList[3].send':false
                      })
                    }
                    break
                  }
                }
                wx.showToast({
                  title: '已加载完该类的全部商品',
                  icon:'none'
                })
              }
            },
          })
        }, 1000);
      }
    })
  },
  // 跳转详情页面
  togoods(e){
    var index=parseInt(e.target.dataset.index)
    this.updategoods(this.data.goodslist[index])
    wx.navigateTo({
      url: '../../goods/pages/goods/goods?openid='+this.data.goodslist[index].openid+'&rate='+this.data.rate,
    })
  },
  // 确认搜索
  confirms(){
    if(this.data.searchvalue.length>16)
    {
      wx.showToast({
        title: '最多16字',
        icon:'none'
      })
    }
    else
    {
      if(this.data.searchvalue.length==0)
      {
        wx.showToast({
          title: '请输入搜索内容',
          icon:'none'
        })
      }
      else
      {
        if(this.data.searchpage!=0)
        {
          this.setData({
            searchpage:0
          })
        }
        this.freesearch(this.data.searchvalue)
      }
    }
  },
  // 搜索
  onSearch(e){
    var searchword=e.detail.value
    this.setData({
      searchvalue:searchword,
    })
  },
  // 获取选择器商品
  getselectorgoods(rate,area,page){
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: this.data.host+'/selector/'+rate+'/'+area+'/'+page,
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            goodslist:res.data.goodlist[0]
          })
        }
        if(res.data.code==0)
        {
          this.setData({
            goodslist:[]
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
  },
  // 改变商品区域
  changearea(e){
    this.reset()
    this.setData({
      area:e.target.dataset.area,
      searchpage:0
    })
    if(e.target.dataset.area=="all")
    {
      this.setData({
        all_btn:"background-color:#00917D;",
        south_btn:"#7FD1AE",
        north_btn:"#7FD1AE",
        hospital_btn:"#7FD1AE",
      })
    }
    else if(e.target.dataset.area=="south")
    {
      this.setData({
        all_btn:"background-color:#7FD1AE;",
        south_btn:"background-color:#00917D;",
        north_btn:"background-color:#7FD1AE;",
        hospital_btn:"background-color:#7FD1AE;",
      })
    }
    else if(e.target.dataset.area=="north")
    {
      this.setData({
        all_btn:"background-color:#7FD1AE;",
        south_btn:"background-color:#7FD1AE;",
        north_btn:"background-color:#00917D;",
        hospital_btn:"background-color:#7FD1AE;",
      })
    }
    else if(e.target.dataset.area=="hospital")
    {
      this.setData({
        all_btn:"background-color:#7FD1AE;",
        south_btn:"background-color:#7FD1AE;",
        north_btn:"background-color:#7FD1AE;",
        hospital_btn:"background-color:#00917D;",
      })
    }
    this.getselectorgoods(this.data.rate,this.data.area,1)
  },
  // 改变商品等级
  changerate(e){
    this.reset()
    this.setData({
      rate:e.detail,
      searchpage:0
    })
    this.getselectorgoods(this.data.rate,this.data.area,1)
  },
  // 跳转到a级商品详细页面
  toagood(){
    this.updategoods(this.data.rollgood)
    wx.navigateTo({
      url: '../../goods/pages/goods/goods?openid='+this.data.rollgood.openid+'&rate=a',
    })
  },

  // 跳转到b级商品页面
  tobgood(e){
    this.updategoods(e.target.dataset.good)
    wx.navigateTo({
      url: '../../goods/pages/goods/goods?openid='+e.target.dataset.good.openid+'&rate=b',
    })
  },


  // 跳转到s级商品页面
  tosgood()
  {
    this.updategoods(this.data.sgoodsonly)
    wx.navigateTo({
      url: '../../goods/pages/goods/goods?openid='+this.data.sgoodsonly.openid+'&rate=s',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    // 按钮颜色
    // all_btn:"background-image: linear-gradient(to top, #e6b980 0%, #eacda3 100%);",
    // south_btn:"background-image: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);",
    // north_btn:"background-image: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);",
    // hospital_btn:"background-image: linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%);",
    all_btn:"background-color:#00917D ;",
    south_btn:"background-color:#7FD1AE;",
    north_btn:"background-color: #7FD1AE;",
    hospital_btn:"background-color: #7FD1AE;",
    // 左边索引
    leftindex:null,
    rightindex:null,
    sgoodsonly:null,
    guanjianci:'请输入关键词',
    searchsend:true,
    searchpage:0,
    PageList:[
      {area:'south',page:1,send:true},
      {area:'north',page:1,send:true},
      {area:'hospital',page:1,send:true},
      {area:'all',page:0,send:true},
    ],
    searchvalue:'',
    searchpell:'',
    goodslist:[],
    nowpage:0,
    rate:'c',
    ratelist: [
      { text: '启动页商品', value: 's' },
      { text: '滚动商品', value: 'a' },
      { text: '轮播商品', value: 'b' },
      { text: '普通商品', value: 'c' },
    ],
    area:'all',
    arealist:[
      { text: '南区', value: 'south' },
      { text: '北区', value: 'north' },
      { text: '医学院区', value: 'hospital' },
      { text: '全部', value: 'all' },
    ],
    show:false,
    // 滚动商品
    rollgood:null,
    // 服务器地址
    host:null,
    // 用户id
    openid:null,
    // slide商品列表
    slidegoodslist:[]
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
    wx.showLoading({
      title: '加载中',
    })
    // 获取启动页商品信息
    wx.request({
      url: this.data.host+'/store/sstore/0',
      method:'GET',
      success:(res)=>{
        this.setData({
          sgoodsonly:res.data
        })
      },
      fail(){
        wx.showToast({
          title: '请重试',
          icon:"error"
        })
      },
    })
    // 获取滚动商品信息
    wx.request({
      url: this.data.host+'/astore',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            rollgood:res.data.object
          })
        }
        if(res.data.code==241)
        {
          wx.showToast({
            title: '网络错误',
            icon:'error'
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

    // 获取slide商品信息
    wx.request({
      url: this.data.host+'/bstore',
      method:"GET",
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            slidegoodslist:res.data.goodlist
          })
        }
      },
      fail()
      {
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

    // 加载普通商品
    var page=this.data.PageList[3].page+1
    this.setData({
      'PageList[3].page':page
    })
    this.getselectorgoods(this.data.rate,this.data.area,page)
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
    wx.showLoading({
      title: '加载中',
    })
        // 获取启动页商品信息
        wx.request({
          url: this.data.host+'/store/sstore/0',
          method:'GET',
          success:(res)=>{
            this.setData({
              sgoodsonly:res.data
            })
          },
          fail(){
            wx.showToast({
              title: '请重试',
              icon:"error"
            })
          },
        })
        // 获取滚动商品信息
    wx.request({
      url: this.data.host+'/astore',
      method:'GET',
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            rollgood:res.data.object
          })
        }
        if(res.data.code==241)
        {
          wx.showToast({
            title: '网络错误',
            icon:'error'
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

        // 获取slide商品信息
        wx.showLoading({
          title: '加载中',
        })
    wx.request({
      url: this.data.host+'/bstore',
      method:"GET",
      success:(res)=>{
        if(res.data.code==1)
        {
          this.setData({
            slidegoodslist:res.data.goodlist
          })
        }
      },
      fail()
      {
        wx.showToast({
          title: '加载失败',
          icon:"error"
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
    if(this.data.rate=='c')
    {
      if(this.data.PageList[0].area==this.data.area)
      {
        this.setData({
          'PageList[0].send':true,
          'PageList[0].page':1
        })
      }
      if(this.data.PageList[1].area==this.data.area)
      {
        this.setData({
          'PageList[1].send':true,
          'PageList[1].page':1
        })
      }
      if(this.data.PageList[2].area==this.data.area)
      {
        this.setData({
          'PageList[2].send':true,
          'PageList[2].page':1
        })
      }
      if(this.data.PageList[3].area==this.data.area)
      {
        this.setData({
          'PageList[3].send':true,
          'PageList[3].page':1
        })
      }
    }
    this.setData({
      searchpage:0
    })
    this.getselectorgoods(this.data.rate,this.data.area,1)
 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.rate=='c' && this.data.searchpage==0)
    {
      for(var i in this.data.PageList)
      {
        if(this.data.PageList[i].area==this.data.area && this.data.PageList[i].send==true)
        {
          var page=this.data.PageList[i].page+1;
          if(i==0)
          {
            this.setData({
              'PageList[0].page':page
            })
          }
          if(i==1)
          {
            this.setData({
              'PageList[1].page':page
            })
          }
          if(i==2)
          {
            this.setData({
              'PageList[2].page':page
            })
          }
          if(i==3)
          {
            this.setData({
              'PageList[3].page':page
            })
          }
          this.addselectorgoods('c',this.data.area,page)
          break
        }
      }
    }
    if(this.data.searchpage!=0 && this.data.searchsend==true)
    {
      var page=this.data.searchpage+1
      this.setData({
        searchpage:page
      })
      this.freesearch("")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})