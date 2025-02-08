// custom-tab-bar/contro/contro.js
import { storeBindingsBehavior } from "mobx-miniprogram-bindings"
import { store } from '../store/store'
Component({
  behaviors:[storeBindingsBehavior],
  storeBindings:{
    store,
    fields:{
      active:'active'
    },
    actions:{
      updateactive:'xiuac'
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    "list":[
      {
        "index":0,
        "pagePath": "/pages/index/index",
        "text": "首页",
        "icon": "wap-home-o"
      },
      {
        "index":1,
        "pagePath": "/pages/purchase/purchase",
        "text": "求购区",
        "icon": "eye-o"
      },
      {
        "index":2,
        "pagePath": "/pages/message/message",
        "text": "消息",
        "icon" :"chat-o"
      },
      {
        "index":3,
        "pagePath": "/pages/collection/collection",
        "text": "收藏",
        "icon" :"star-o"
      },
      {
        "index":4,
        "pagePath": "/pages/mine/mine",
        "text": "我的",
        "icon" :"user-o"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event){
      this.updateactive(event.detail)
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      })
    },
  }
})