<template>
  <div class="section-wrapper">
    <Header :level="2" />
    <div class="search-wrapper">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入要查询的办事项"
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch" class="search">查询</div>
        </template>
      </van-search>
    </div>
    <div class="nav">
      <ul class="switchbar">
        <li :class="{'active':action == tab.type}" @click="switchHand(tab.type)" v-for="(tab,i) in nav" :key="i">{{tab.name}}</li>
      </ul>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" style="min-height: calc(100vh - 1rem);">
    <div class="main">
      <div class="subject-item" v-for="item in listData" :key="item.id" @click="goDetail(item)">
        <div class="subject-top">
          <span class="name">{{item.name}}</span>
          <span class="tips" :class="{'finish':item.state == 'finish','going':item.state == 'going','timeout':item.state == 'timeout'}">{{item.state | stateFilter}}</span>
        </div>
        <div class="number col">项目编号: {{item.number}}</div>
        <div class="duty col">
          <span>责任领导: {{item.lname}}</span>
          <span>责任单位: {{item.cname}}</span>
        </div>
        <div class="duty col" v-if="item.endtime&&item.endtime!=''">
          <span>完成时间: {{item.endtime | timeFilter}}</span>
        </div>
        <div class="process-wrap col">
          <span>项目进度:</span>
          <p class="bar"><span :style="{'width':item.project_percent+'%'}" :class="{'finish':item.state == 'finish','going':item.state == 'going','timeout':item.state == 'timeout'}"></span></p>
          <span class="percent">{{item.project_percent}}%</span>
        </div>
        <div class="process-wrap col">
          <span>时间进度:</span>
          <p class="bar"><span :style="{'width':item.time_percent+'%'}" :class="{'finish':item.state == 'finish','going':item.state == 'going','timeout':item.state == 'timeout'}"></span></p>
          <span class="percent">{{item.time_percent}}%</span>
        </div>
        <div class="score-wrap" v-if="showRate">
          <span>综合评分:</span>
          <van-rate
            v-model="item.score"
            :size="25"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
            readonly
          />
        </div>
      </div>
      <van-empty description="暂无数据" v-if="listData.length == 0"/>
    </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getProjectlistApi ,getSettingApi} from '../api/post';
import Header from '../components/header/Header.vue'
import {wxconfig} from "../utils/wxconfig";
export default {
  name: 'Section',
  components: {
    Header
  },
  mixins:[wxconfig],
  data(){
    return{
      keywords:'',
      type:this.$route.query.type,
      nav:[{name:'全部',type:'all'},{name:'进行中',type:'going'},{name:'已完成',type:'finish'},{name:'已超时',type:'timeout'}],
      action:'all',
      listData:[],
      isLoading:false,
      showRate:false

    }
  },
  mounted(){
    this.getSetting();
    this.getList();

  },
  methods:{
    getSetting(){
      var _this = this;
      getSettingApi().then(res =>{
        if(res.state){
          _this.showRate = res.data.score==1?true:false;
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
    },
    getList(){
      var _this = this;
      var params = {
        keyword:_this.keywords
      }
      if(_this.action != 'all') params.state = _this.action;
      if(_this.type == 'company'){
        params.companyid = _this.$route.params.id;
      }else if(_this.type == 'subject'){
        params.categoryid = _this.$route.params.id;
      }else if(_this.type == 'leader'){
        params.leaderid = _this.$route.params.id;
      }
      getProjectlistApi(params).then(res=>{
        _this.isLoading = false;
        if(res.state){
          _this.listData = res.data;
        }
      }).catch(err=>{

      })
    },
    onRefresh(){
      this.getList();
    },
    switchHand(action){
      var _this = this;
      _this.action = action;
      _this.getList();
    },
    onSearch(){
      this.getList();
    },
    goDetail(sec){
      this.$router.push({name:'Subject',params:{id:sec.id}})
      this.$store.dispatch('changeTitle','');
    }
  },
  filters:{
    idFilter(val){
      var year =  new Date().getFullYear();
      var id = val.length==1?`00${val}`:(val.length==2?`0${val}`:val);
      return `SW${year}${id}`
    },
    timeFilter(val){
      var date = val.split('-')
      return `${date[0]}年${date[1]}月${date[2]}日`
    },
    stateFilter(val){
      var state = val=='finish'?'已完成':(val=='going'?'进行中':(val=='timeout'?'已超时':'未知'));
      return state;
    }
  }
}
</script>
<style lang="less" scoped>
  .section-wrapper{
    padding-top:0.4rem;
    .search-wrapper{
      .search{color:#CC4134;}
    }
    .nav{
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
    .main{
      padding:0.1rem;
      .subject-item{
        background-color: #fff;
        padding:0.15rem;
        border-radius: 5px;
        font-size: 0.14rem;
        margin-bottom:0.1rem;
        box-shadow: 0px 6px 12px 0px rgba(212, 212, 212, 0.3);
        .col{
          line-height: 0.26rem;
        }
        
        .subject-top{
          line-height:0.24rem;
          display:flex;
          align-items:center;
          .name{
            flex:1;
            padding-right:0.18rem;
            font-size: 0.16rem;
          }
          .tips{
            width:0.46rem;
            background-color: #BF15284F;
            color:#BF1528;
            border-radius: 27px;
            line-height: 0.18rem;
            text-align: center;
            font-size: 0.12rem;
            padding:0 0.03rem;
            &.finish{
              background-color: #3ECB4B4F;
              color:#3ECB4B;
            }
            &.going{
              background-color: #3285FF4F;
              color:#3285FF;
            }
          }
        }
        .number{
          height:0.22rem;
          line-height: 0.22rem;
          color:#999999;
          font-size: 0.14rem;
        }
        .duty{
          span:first-child{
            margin-right:0.16rem;
          }
        }
        .process-wrap{
          display: flex;
          align-items: center;
          .percent{
            color:#999;
            width:0.4rem;
          }
          .bar{
            margin:0 0.05rem;
            flex:1;
            background-color: #efefef;
            height:0.06rem;
            border-radius: 5px;
            position: relative;
            span{
              position: absolute;
              top:0;
              left:0;
              background-color: #BF1528;
              border-radius: 5px;
              height:0.06rem;
              &.finish{
                background-color: #3ECB4B;
              }
              &.going{
                background-color: #3285FF;
              }
            }
          }
        }
        .score-wrap{
          display: flex;
          align-items:center;
          justify-content: flex-end;
          margin:0.05rem 0;
          color:#999999;
        }
      }
    }
  }
</style>