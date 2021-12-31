<template>
<van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功">
  <div class="subject-wrapper">
    <ul>
      <li v-for="item in listData" :key="item.id" @click="viewDetail(item)">
        <span class="image">
          <img :src="item.ico" alt="">
        </span>
        <span class="title">{{item.name}}</span>
        <span class="total">{{item.total}}项</span>
      </li> 
    </ul>
    <van-empty description="暂无数据" v-if="listData.length == 0"/>
  </div>
</van-pull-refresh>
</template>

<script>
import {getSubjectsApi} from '../api/post';
export default {
  name: 'Subjects',
  props: {
    
  },
  data(){
    return{
      isLoading:false,
      listData:[]
    }
  },
  mounted(){
    this.getSubjects();
  },
  methods:{
    onRefresh(){
      this.getSubjects();
    },
    getSubjects(){
      var _this = this;
      getSubjectsApi().then(res =>{
        _this.isLoading = false;
        if(res.state){
          _this.listData = res.data;
        }
      }).catch(error =>{

      })
    },
    imageHandle(ico){
      return 'http://site.cjyun.test/' + ico
    },
    viewDetail(sec){
      this.$router.push({name:'Section',params:{id:sec.id},query:{type:'subject'}})
      this.$store.dispatch('changeTitle',sec.name);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .subject-wrapper{
    min-height:calc(100vh - 60vw);
    background-color: #fff;
    ul{
      display:flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      padding:0.1rem 0.16rem;
      li{
        width:33.33%;
        display:flex;
        flex-direction: column;
        align-items: center;
        padding:0.2rem 0;
        .image{
          width:0.5rem;
          height:0.5rem
        }
        .title{
          margin-top:0.1rem;
          line-height: 0.26rem;
          font-size: 0.15rem;
          font-weight: 550;
        }
        .total{
          margin-top:0.05rem;
          line-height: 0.18rem;
          font-size: 0.12rem;
          width:0.5rem;
          background-color: #A9A9A94F;
          border-radius: 27px;
          text-align: center;
        }
      }
    }
  }
</style>
