<template>
<van-pull-refresh v-model="isLoading" @refresh="onRefresh" success-text="刷新成功" style="min-height: calc(100vh - 60vw);">
  <div class="company-wrapper">
    <div class="company-wrap" v-for="section in listData" :key="section.id" v-if="section.company&&section.company.length>0">
      <div class="left" :style="{'background-color':section.color}"><i>{{section.number}}</i></div>
      <div class="right">
        <div class="section" v-for="item in section.company" :key="item.id" @click="viewDetail(item)">
          <div class="top">
            <div class="info">
              <img :src="item.ico?item.ico:'http://img.cjyun.org/a/10102/202110/b2550a536c6980c79c35a476887f0450.jpg'" alt="">
              <span>{{item.name}}</span>
            </div>
            <div class="arrow">
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="bottom">
            <div class="sum">在办<span class="in">{{item.going}}</span></div>
            <div class="sum">完成<span class="done">{{item.finish}}</span></div>
            <div class="sum">超时<span class="over">{{item.timeout}}</span></div>
          </div>
        </div>
      </div>
    </div>
    <van-empty description="暂无数据" v-if="listData.length == 0"/>
  </div>
</van-pull-refresh>
</template>

<script>
import {getCompanysApi} from '../api/post';
export default {
  name: 'Company',
  props: {
    
  },
  data(){
    return{
      isLoading:false,
      listData:[]
    }
  },
  mounted(){
    this.getCompanys();
  },
  methods:{
    onRefresh(){
      this.getCompanys();
    },
    getCompanys(){
      var _this = this;
      getCompanysApi().then(res =>{
        _this.isLoading = false;
        if(res.state){
          _this.listData = res.data;
        }
      }).catch(error =>{

      })
    },
    viewDetail(sec){
      this.$router.push({name:'Section',params:{id:sec.id},query:{type:'company'}})
      this.$store.dispatch('changeTitle',sec.name);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .company-wrapper{
    padding:0.1rem;
    .company-wrap{
      display:flex;
      margin-bottom:0.1rem;
      .left{
        width:0.4rem;
        display:flex;
        align-items:center;
        justify-content: center;
        font-size:0.26rem;
        color:#ffffff;
        border-radius: 5px 0 0 5px;
      }
      .right{
        flex:1;
        margin-left:6px;
        .section{
          height:0.96rem;
          background-color: #fff;
          border-radius: 0 5px 5px 0;
          box-shadow: 0px 6px 12px 0px rgba(212, 212, 212, 0.3);
          &:not(:last-child){
            margin-bottom:0.1rem;
          }
          .top{
            height:0.55rem;
            display: flex;
            justify-content: space-between;
            padding-left:0.1rem;
            .info{
              display: flex;
              align-items:center;
              img{width:0.3rem;height:0.3rem;}
              span{font-size: 0.16rem;margin-left:0.06rem;font-weight: 600;}
            }
            .arrow{display: flex;align-items: center;margin-right:0.16rem;font-size:0.16rem;color:#C4C4C6;}
          }
          .bottom{
            height:0.41rem;
            background-color: #FAFAFC;
            border-radius: 0 0 5px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .sum{
              flex:1;
              font-size:0.12rem;
              display: flex;
              justify-content: center;
              align-items: center;
              span{
                width:0.55rem;
                height:0.18rem;
                text-align: center;
                margin-left:5px;
                &.in{background-color: #3284ff4f;color:#3285FF;border-radius:27px;}
                &.done{background-color: #3ECB4B4f;color:#3ECB4B;border-radius:27px;}
                &.over{background-color: #BF15284f;color:#BF1528;border-radius:27px;}
              }
            }
          }
        }
      }
    }
  }
</style>