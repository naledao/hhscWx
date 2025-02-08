// app.js
//1.在小程序入口文件中调用一次 promisifyAll()方法
import { promisifyAll } from 'miniprogram-api-promise'
//2.声明一个常量，为一个空对象
const wxp = wx.p = {}
//3.调用 promisifyAll()方法
promisifyAll(wx, wxp)
App({
  onLaunch() {
    if(wx.getStorageSync('sessionkey'))
    {
      // 有key
      const key=wx.getStorageSync('sessionkey')
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: this.globalData.localhost+'/user/login?key='+key,
        method:"GET",
        success:(res)=>{
          if(res.data.code==0){
            // key无效
            wx.removeStorageSync('sessionkey')
          }
          if(res.data.code==1){
            // key有效，进行登录授权
            this.globalData.mineid=res.data.message
          }
        },
        fail(){
          wx.showToast({
            title: '请重试',
            icon:"error"
          })
        },
        complete(){
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    }
  },
  globalData: {
    localhost:"https://hhsc.kangnasi.xyz:9630",
    // localhost:"http://192.168.52.159:9630",
    mineid:null
  }
})