import Vue from 'vue'
import App from './App.vue'
import less from 'less'
import Vant from 'vant'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import "swiper/dist/css/swiper.css"

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;



Vue.prototype.$base64Img = (path) => {            //图片转换base64  , 异步处理
  function getBase64Image(img) {               		//转码格式方法
     var canvas = document.createElement("canvas"); 	// 创建一个canvas
      canvas.width = img.width;               		// 设置对应的宽高
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");      		// 二维绘图环境
      ctx.drawImage(img, 0, 0, img.width, img.height);                            // 将图片画在画布上
      var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();    // 获取到图片的格式
      var dataURL = canvas.toDataURL("image/" + ext);                             // 得到base64 编码的 dataURL 
      return dataURL; 
  }
  return new Promise(function(resolve, reject) {      //使用Promise进行异步处理
      let image = new Image();
           //解决图片跨域问题
      image.crossOrigin = '';
          //获取传入的图片路径
      image.src = path;
          //图片加载完后的回调函数,调用转码函数
      image.onload = function(){ 
          resolve(getBase64Image(image))   	//回调函数返回base64值
      }    
  })  
}





import html2canvas from 'html2canvas'
Vue.prototype.$html2canvas = html2canvas;

import '../src/utils/reset.css'
import '../src/utils/rem.js'
import '../src/utils/jssdk.js'
import 'vant/lib/index.css'
import router from './router'
import store from './store'

import Loading from './components/loading'
Vue.use(Loading)
Vue.use(less)
Vue.use(Vant)
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false


Vue.use(less);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
