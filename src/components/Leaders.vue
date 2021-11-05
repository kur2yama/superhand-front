<template>
<van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功">
  <div class="leader-wrapper">
    <div class="leader-header">
      <span>领衔领导</span>
      <span>全部</span>
      <span>进行中</span>
      <span>已完成</span>
      <span>已超时</span>
    </div>
    <div class="leader-tb">
      <div class="leader-tr" v-for="item in listData" :key="item.id" @click="viewDetail(item)">
        <span>{{item.name}}</span>
        <span><em class="all">{{item.all}}</em></span>
        <span><em class="going">{{item.going}}</em></span>
        <span><em class="finish">{{item.finish}}</em></span>
        <span><em class="timeout">{{item.timeout}}</em></span>
      </div>
      <van-empty description="暂无数据" v-if="listData.length == 0"/>
    </div>
  </div>
</van-pull-refresh>
</template>

<script>
import {getLeadersApi} from '../api/post';
export default {
  name: 'Leaders',
  props: {
    
  },
  data(){
    return{
      isLoading:false,
      listData:[]
    }
  },
  mounted(){
    this.getLeaders();
  },
  methods:{
    onRefresh(){
      this.getLeaders();
    },
    getLeaders(){
      var _this = this;
      getLeadersApi().then(res =>{
        _this.isLoading = false;
        if(res.state){
          _this.listData = res.data;
        }
      }).catch(error =>{

      })
    },
    viewDetail(sec){
      this.$router.push({name:'Section',params:{id:sec.id},query:{type:'leader'}})
      this.$store.dispatch('changeTitle',sec.name);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .leader-wrapper{
    min-height:calc(100vh - 60vw);
    background-color: #fff;
    .leader-header{
      height:0.48rem;
      display: flex;
      align-items: center;
      background-color: #f5f5f5;
      span{
        line-height:0.48rem;
        text-align: center;
        font-size: 0.14rem;
        color:#666666;
        &:first-child{
          width:25%;
        }
        &:not(:first-child){
          flex:1;
        }
      }
    }
    .leader-tb{
      .leader-tr{
        height:0.48rem;
        display: flex;
        align-items: center;
        span{
          line-height:0.48rem;
          text-align: center;
          font-size: 0.14rem;
          color:#333333;
          display: flex;
          justify-content: center;
          align-items: center;
          &:first-child{
            width:25%;
          }
          &:not(:first-child){
            flex:1;
            em{
              display: block;
              width:0.46rem;
              line-height: 0.18rem;
              border-radius: 27px;
              &.all{background-color: #A9A9A94f;}
              &.going{background-color: #3284ff4f;color:#3285FF;}
              &.finish{background-color: #3ECB4B4f;color:#3ECB4B;}
              &.timeout{background-color: #BF15284f;color:#BF1528;}
            }
          }
        }
      }
    }
  }
</style>
