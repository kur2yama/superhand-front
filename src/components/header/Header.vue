<template>
  <div class="header-wrapper">
    <div class="title">{{$store.state.headerTitle}}</div>
    <div class="back" @click="goBack()"><van-icon name="arrow-left" color="#ffffff" size="16"/></div>
    <div class="operate" v-if="hasOperate" @click="handle()"><van-icon name="ellipsis" color="#ffffff" size="16"/></div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    hasOperate:{
      type:Boolean,
      default:false
    },
    level:{
      type:Number,
      default:1
    }
  },
  data(){
    return{
      title:this.$store.state.headerTitle
    }
  },
  mounted(){

  },
  methods:{
    goBack(){
      if(this.level == 2){
        this.$store.dispatch('changeTitle',this.$store.state.setting.project_title);
      }
      this.$router.back(-1);
    },
    handle(){
      this.$emit('operateHandle');
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .header-wrapper{
    position: fixed;
    top:0;
    left:0;
    right:0;
    height:0.4rem;
    background-color: #BF1528;
    z-index:99;
    .title{
      padding:0 0.3rem;
      text-align: center;
      color:#fff;
      line-height: 0.4rem;
      font-size: 0.16rem;
    }
    .back{
      position: absolute;
      top:0;
      left:0;
      height:0.4rem;
      width:0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .operate{
      position: absolute;
      top:0;
      right:0;
      height:0.4rem;
      width:0.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
