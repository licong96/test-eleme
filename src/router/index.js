import Vue from 'vue'
import Router from 'vue-router'
import goods from '@/components/goods/Goods'
import rationgs from '@/components/rationgs/Rationgs'
import seller from '@/components/seller/Seller'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: goods
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/rationgs',
      name: 'rationgs',
      component: rationgs
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})
