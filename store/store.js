import {observable,action} from 'mobx-miniprogram'
export const store=observable({
  active:0,
  goods:{},
  getgood:action(function(){
    return this.goods
  }),
  updategoods:action(function(step){
    this.goods=step
  }),
  xiuac:action(function(jk){
    this.active=jk
  })
})