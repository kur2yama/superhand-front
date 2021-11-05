<template>
  <div class="loading" v-if="$store.state.isLoading">
      <van-loading type="spinner" size="30px" color="#FFFFFF"/>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  data(){
    return{
      value:''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .loading{
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background: rgba(0,0,0,.2);
        display:flex;
        justify-content: center;
        align-items: center;
    }
</style>
