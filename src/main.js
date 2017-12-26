// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { Button, Select, Input, Option } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'

Vue.config.productionTip = false
// Vue.use(ElementUI)
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
Vue.component(Input.name, Input)
Vue.component(Option.name, Option)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
