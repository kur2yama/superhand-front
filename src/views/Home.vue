<template>
  <div class="home">
    <Header />
    <div class="header">
      <div class="notice-bar">
        本周新增项目<span>{{notice.all}}</span>项，已完成项目<span>{{notice.finish}}</span>项，已超时<span>{{notice.timeout}}</span>项
      </div>
      <div class="banner">
        <van-image :src="banner"></van-image>
        <!-- <img :src="banner" alt=""> -->
      </div>
    </div>
    <div class="main">
      <ul class="switchbar" v-if="(navigation&&navigation.length>1) || (navigation.length==1&&navigation.indexOf('责任单位')==-1)">
        <li :class="{'active':tapType == tab.type}" @click="tapType = tab.type" v-for="(tab,i) in nav" :key="i" v-if="navigation&&navigation.indexOf(tab.name)>-1">{{tab.name}}</li>
      </ul>
      <component :is="component[tapType]"></component>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '../components/header/Header.vue'
import Companys from '../components/Companys.vue'
import Leaders from '../components/Leaders.vue'
import Subjects from '../components/Subjects.vue'
import {getSettingApi} from '../api/post';
import {wxconfig} from "../utils/wxconfig";
export default {
  name: 'Home',
  components: {
    Companys,
    Leaders,
    Subjects,
    Header
  },
  mixins:[wxconfig],
  data(){
    return{
      component:{
        'companys':Companys,
        'leaders':Leaders,
        'subjects':Subjects
      },
      nav:[
        {name:'领衔领导',type:'leaders'},{name:'责任单位',type:'companys'},{name:'项目类别',type:'subjects'}
      ],
      tapType:'companys',
      ico: require('../assets/images/notice.png'),
      banner:'',
      notice:{},
      navigation:[]
    }
  },
  mounted(){
    this.getSetting();
  },
  methods:{
    getSetting(){
      var _this = this;
      getSettingApi().then(res =>{
        if(res.state){
          _this.banner = res.data.img;
          _this.notice = res.data;
          _this.navigation = res.data.navigation?res.data.navigation:[];
          if(_this.navigation.indexOf('责任单位')==-1){
            _this.tapType = _this.nav.filter((val)=>{
              return val.name == res.data.navigation[0];
            })[0]['type'];
          }
          _this.$store.dispatch('changeTitle',res.data.project_title);
          _this.$store.dispatch('updateSetting',res.data);
          document.title = res.data.share_title;
          _this.wxready({
            title: res.data.share_title,
            desc: res.data.share_desc,
            link: location.href
          })
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .home{
    background:#f5f5f5;
    padding-top:0.4rem;
    .notice-bar{
      height:0.4rem;
      line-height: 0.4rem;
      padding-left:0.4rem;
      background: url('../assets/images/notice.png') no-repeat 0.16rem;
      background-size:0.15rem 0.12rem;
      color:#333333;
      font-size: 0.14rem;
      span{
        color:#BF1528;
      }
    }
    .banner{
      width:100vw;
      height:56vw;
      .van-image{
        width:100%;
        height:100%;
        img{
          width:100%;
          height:100%;
        }
      }
      
    }
    .main{
      .switchbar{
        display:flex;
        justify-content: space-between;
        align-items:center;
        height:0.48rem;
        background-color:#ffffff;
        border-bottom:1px solid #DBDBDB;
        li{
          flex:1;
          margin:0 0.1rem;
          height:0.46rem;
          line-height:0.48rem;
          text-align: center;
          font-size: 0.16rem;
          &.active{
            border-bottom:2px solid #E93D41;
            color:#E93D41;
          }
        }
      }
    }
  }
  .van-notice-bar__left-icon, .van-notice-bar__right-icon{
    font-size: 18px;
  }
</style>