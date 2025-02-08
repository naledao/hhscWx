// releasegood/pages/releasegood/releasegood.js
Page({
  uploadimage(index)
  {
    wx.uploadFile({
      filePath: this.data.imagelist[index].url,
      name: 'image',
      url: this.data.host+'/upload/image/'+this.data.choice+'/'+this.data.openid+'/'+this.data.key+"?warehouseid="+this.data.warehouseid+'&imageid='+this.data.imageid+'&simageid='+this.data.simageid,
      success:(res)=>{
        if(res.data==0)
        {
          console.log(2);
          wx.showToast({
            title: '发布失败',
            icon:"none"
          })
        }
        if(res.data==1)
        {
          if(index+1<=this.data.imagelist.length-1)
          {
            this.uploadimage(index+1)
          }
          else
          {
            // 所有图片上传成功,开始上传剩余信息
            var stst=0
            if(this.data.goodstatus=='可被求购')
            {
              stst=1
            }
            else
            {
              if(this.data.goodstatus=='不可被求购')
              {
                stst=0;
              }
            }
            // 上传商品剩余信息
            wx.request({
              url: this.data.host+'/upload/message/'+this.data.choice+'/'+this.data.warehouseid+'/'+this.data.key+'/'+this.data.openid+'?imageid='+this.data.imageid+'&simageid='+this.data.simageid,
              method:'POST',
              data:{
                name:this.data.goodname,
                description:this.data.gooddecription,
                price:this.data.goodprice,
                area:this.data.goodarea,
                status:stst
              },
              success:(res)=>{
                if(res.data==1)
                {
                  wx.showToast({
                    title: '发布成功',
                  })
                }
                if(res.data==0)
                {
                  console.log(123);
                  wx.showToast({
                    title: '发布失败',
                    icon:'none'
                  })
                }
                if(res.data==241)
                {
                  wx.showToast({
                    title: '发布失败',
                    icon:"none"
                  })
                }
              },
              fail(){
                console.log(1);
                wx.showToast({
                  title: '发布失败',
                  icon:"none"
                })
              },
              complete:()=>{
                // this.setData({
                //   btnable:false
                // })
              }
            }) 
          }
        }
      },
      fail(){
        wx.showToast({
          title: '上传失败',
          icon:'error'
        })
      },
      complete(){
        
      }
    })
  },
  // 发布商品
  releasegood(){
    // 判断表单是否填完整
    if(this.data.piclist.length==0 || this.data.imagelist.length==0 || this.data.goodname.length==0 || this.data.gooddecription.length==0 || this.data.goodprice==null)
    {
      wx.showToast({
        title: '请将表格填写完整',
        icon:"none"
      })
      return
    }
    else
    {
      this.setData({
        btnable:true
      })
      const id=setInterval(() => {
        if(this.data.timedao==0)
        {
          this.setData({
            btnable:false,
            timedao:12,
            dao:'点击上传'
          })
          clearInterval(id)
        }
        else
        {
          this.setData({
            btnable:true,
            dao:this.data.timedao+'秒后可试',
            timedao:this.data.timedao-1
          }) 
        } 
      }, 1000);
      // 请求用户的仓库id，和商品的图片仓库id
      wx.showLoading({
        title: '上传中',
      })
      wx.request({
        url: this.data.host+'/upload/'+this.data.openid+'/'+this.data.choice+'/'+this.data.key,
        method:"GET",
        success:(res)=>{
          if(res.data.code==0)
          {
            console.log(0);
            wx.showToast({
              title: '发布失败',
              icon:"none"
            })
          }
          if(res.data.code==2)
          {
            wx.showToast({
              title: '发布商品已达上限',
              icon:'none'
            })
          }
          if(res.data.code==1)
          {
            // 获取成功，上传封面
            this.setData({
              warehouseid:res.data.warehouseid,
              imageid:res.data.imageid,
              simageid:res.data.simageid
            })
            wx.uploadFile({
              filePath: this.data.piclist[0].url,
              name: 'Pic',
              url: this.data.host+'/upload/pic/'+this.data.choice+'/'+this.data.openid+'/'+this.data.key+'?warehouseid='+this.data.warehouseid+'&imageid='+this.data.imageid+'&simageid='+this.data.simageid,
              success:(res)=>{
                if(res.data==0)
                {
                  console.log(1);
                  wx.showToast({
                    title: '发布失败',
                    icon:'none'
                  })
                }
                if(res.data==1)
                {
                  this.uploadimage(0)
                  var ji=0
                  // 操作成功,上传图片
                  // for(var i=0;i<=this.data.imagelist.length-1;i++)
                  // {
                  //   wx.uploadFile({
                  //     filePath: this.data.imagelist[i].url,
                  //     name: 'image',
                  //     url: this.data.host+'/upload/image/'+this.data.choice+'/'+this.data.openid+'/'+this.data.key,
                  //     success:(res)=>{
                  //       if(res.data==0)
                  //       {
                  //         console.log(2);
                  //         wx.showToast({
                  //           title: '发布失败',
                  //           icon:"none"
                  //         })
                  //       }
                  //       if(res.data==1)
                  //       {

                  //       }
                  //     },
                  //     fail(){
                  //       wx.showToast({
                  //         title: '上传失败',
                  //         icon:'error'
                  //       })
                  //     },
                  //     complete(){
                  //       console.log(i);
                  //     }
                  //   })
                  // }
                  if(1==2)
                  {
                    // // 所有图片上传成功,开始上传剩余信息
                    // var stst=0
                    // if(this.data.goodstatus=='可被求购')
                    // {
                    //   stst=1
                    // }
                    // else
                    // {
                    //   if(this.data.goodstatus=='不可被求购')
                    //   {
                    //     stst=0;
                    //   }
                    // }
                    // // 上传商品剩余信息
                    // wx.request({
                    //   url: this.data.host+'/upload/message/'+this.data.choice+'/'+this.data.warehouseid+'/'+this.data.imageid+'/'+this.data.key+'/'+this.data.openid,
                    //   method:'POST',
                    //   data:{
                    //     name:this.data.goodname,
                    //     description:this.data.gooddecription,
                    //     price:this.data.goodprice,
                    //     area:this.data.goodarea,
                    //     status:stst
                    //   },
                    //   success:(res)=>{
                    //     if(res.data==1)
                    //     {
                    //       wx.showToast({
                    //         title: '发布成功',
                    //       })
                    //     }
                    //     if(res.data==0)
                    //     {
                    //       console.log(123);
                    //       wx.showToast({
                    //         title: '发布失败',
                    //         icon:'none'
                    //       })
                    //     }
                    //     if(res.data==241)
                    //     {
                    //       wx.showToast({
                    //         title: '发布失败',
                    //         icon:"none"
                    //       })
                    //     }
                    //   },
                    //   fail(){
                    //     console.log(1);
                    //     wx.showToast({
                    //       title: '发布失败',
                    //       icon:"none"
                    //     })
                    //   }
                    // }) 
                  }
                  else
                  {
                    // wx.showToast({
                    //   title: '发布失败',
                    //   icon:"none"
                    // })
                  }
                  if(res.data==241)
                  {
                    wx.showToast({
                      title: '发布失败',
                      icon:"none"
                    })
                  }
                }
                if(res.data==241)
                {
                  wx.showToast({
                    title: '发布失败',
                    icon:"none"
                  })
                }
              },
              fail(){
                wx.showToast({
                  title: '上传失败',
                  icon:'error'
                })
              },
            })
          }
          if(res.data.code==241)
          {
            wx.showToast({
              title: '发布失败',
              icon:"none"
            })
          }
        },
        fail(res){
          wx.showToast({
            title: '发布失败',
            icon:"none"
          })
        },
        complete(){
          // setTimeout(function(){
          //   wx.hideLoading({
          //     success: (res) => {},
          //   })
          // },300)
        }
      })
    }
  },


  // 监测商品求购状态
  onChangegoodstatus(event){
    this.setData({
      goodstatuschecked:event.detail
    })
    if(this.data.goodstatus=='可被求购')
    {
      this.setData({
        goodstatus:'不可被求购'
      })
    }
    else
    {
      if(this.data.goodstatus=='不可被求购')
      {
        this.setData({
          goodstatus:'可被求购'
        })
      }
    }
  },



  // 监测商品校区
  onChangegoodarea(event){
    this.setData({
      goodarea:event.detail
    })
  },


  // 监测商品价格
  onChangegoodprice(event){
    if(event.detail!=0)
    {
      var zan=event.detail+""
      if(zan.charAt(0)=='0')
      {
        zan=zan.substring(1)
        var res=Number(zan)
        if(res>100000000)
        {
          wx.showToast({
            title: '商品价格异常',
            icon:"none"
          })
          this.setData({
            goodprice:0
          })
        }
        else
        {
          this.setData({
            goodprice:res
          })
        }
      }
      else
      {
        if(event.detail>10000000)
        {
          wx.showToast({
            title: '商品价格异常',
            icon:"none"
          })
          this.setData({
            goodprice:0
          })
        }
        else
        {
          this.setData({
            goodprice:event.detail
          })
        }
      }
    }
    else
    {
      this.setData({
        goodprice:0
      })
    }
  },
  // 监测商品描述
  onChangegooddecription(event){
    if(event.detail.length>200)
    {
      wx.showToast({
        title: '字数超限',
        icon:"none"
      })
      return
    }
    this.setData({
      gooddecription:event.detail
    })
  },
  // 监测商品名称
  onChangegoodname(event){
    if(event.detail.length>16)
    {
      wx.showToast({
        title: '字数超限',
        icon:"none"
      })
      return
    }
    this.setData({
      goodname:event.detail
    })
  },



  // 删除商品图片地址
  deleteimage(event){
    let index= event.detail.index
    var list=[]
    var k=-1;
    for(var i in this.data.imagelist)
    {
      if(i!=index)
      {
        k=k+1
        list[k]=this.data.imagelist[i];
      }
    }
    this.setData({
      imagelist:list
    })
  },




  // 获取商品图片地址
  getimageurl(){
    if(this.data.imagelist.length==6)
    {
      return
    }
    var need=6-this.data.imagelist.length
    wx.chooseImage({
      count: need,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        var jish=0;
        var list=[]
        for(var i=0;i<res.tempFilePaths.length;i++)
        {
          jish=jish+1
          if(jish>need)
          {
            break
          }
          else
          {
            list[i]={url:res.tempFilePaths[i]}
          }
        }
        this.setData({
          imagelist:[...this.data.imagelist,...list]
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


  // 获取pic图片地址
  getpicurl(){
    if(this.data.piclist.length==1)
    {
      return
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        this.setData({
          piclist:[{url:res.tempFilePaths[0]}]
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



  // 删除商品封面地址
  deletepic(event){
    let index= event.detail.index
    var list=[]
    var k=-1;
    for(var i in this.data.piclist)
    {
      if(i!=index)
      {
        k=k+1
        list[k]=this.data.piclist[i];
      }
    }
    this.setData({
      piclist:list
    })
  },



  /**
   * 页面的初始数据
   */
  data: {
    timedao:12,
    dao:'上传发布',
    btnable:false,
    simageid:null,
    warehouseid:null,
    imageid:null,
    // 商品状态
    goodstatuschecked:true,
    goodstatus:'可被求购',
    // 商品校区选项
    areaoption:[
      {text:'南区',value:'南区'},
      {text:'北区',value:'北区'},
      {text:'医学院区',value:'医学院区'},
    ],
    // 商品校区
    goodarea:'南区',
    // 商品价格
    goodprice:null,
    // 商品描述
    gooddecription:"",
    // 商品名称
    goodname:'',
    // 商品封面列表
    piclist:[],
    openid:null,
    // 发布密匙
    key:null,
    host:null,
    // 图片列表
    imagelist:[],
    // 最大可发布图片
    maxcount:null,
    choice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad(options) {
    const app=getApp()
    const host1=app.globalData.localhost
    this.setData({
      openid:options.openid,
      host:host1,
      key:options.key
    })
    if(options.choice=='s')
    {
      this.setData({
        maxcount:6,
        choice:'s'
      })
    }
    if(options.choice=='a')
    {
      this.setData({
        maxcount:6,
        choice:'a'
      })
    }
    if(options.choice=='b')
    {
      this.setData({
        maxcount:6,
        choice:'b'
      })
    }
    if(options.choice=='c')
    {
      this.setData({
        maxcount:6,
        choice:'c'
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