<template>
  <div class="subject">
    <Header :hasOperate="true" @operateHandle="operateHandle" />
    <div class="main" ref="html2canvas">
      <div class="base-info">
        <div class="title">{{ detail.name }}</div>
        <div class="thumb">
          <van-image :src="detail.thumb" crossorigin="anonymous" />
        </div>
        <div class="content" v-html="detail.content"></div>
        <div class="duty">
          <p>
            领衔领导: {{ detail.lname }}&nbsp;&nbsp;&nbsp;&nbsp;责任单位:
            {{ detail.cname }}
          </p>
          <p>完成时间: {{ detail.endtime | timeFilter }}</p>
        </div>
      </div>
      <div class="process-info" v-if="detail && detail.rate">
        <div class="title">项目进度</div>
        <ul>
          <i class="line"></i>
          <li v-for="(item, i) in detail.rate" :key="item.id">
            <i class="tips" :class="{ done: i == 0 }"></i>
            <div class="state">
              <span :class="{ done: i == 0 }">{{
                item.process == "0" ? "进行中" : "已完成"
              }}</span>
              <span class="time">{{ item.created }}</span>
            </div>
            <div class="content">
              <p class="desc">{{ item.desc }}</p>
              <p>发布单位: {{ item.pubcompany }}</p>
              <p>发布人: {{ item.pubeditor }}</p>
              <p class="view-pic" v-if="item.file"> <span @click="viewpic(item.file)">查看图片</span> </p>
            </div>
          </li>
        </ul>
      </div>
    

    </div>
    <Rate v-if="showRate" />
    <van-share-sheet
      v-model="showShare"
      :options="options"
      @select="onSelect"
    />
    <!-- <van-dialog v-model="isViewPic" show-cancel-button>
      <div style="padding:20px;">
        <img :src="viewfile" />
      </div>
      
    </van-dialog> -->
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "../components/header/Header.vue";
import Rate from "../components/Rate.vue";
import { getProjectDetailApi , getSettingApi} from "../api/post";
import { ImagePreview } from 'vant';
import {wxconfig} from "../utils/wxconfig";
export default {
  name: "Home",
  components: {
    Header,
    Rate,
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  mixins:[wxconfig],
  data() {
    return {
      detail: {},
      showRate:false,
      showShare:false,
      viewfile:'',
      isViewPic:false,
      options:[
        { name: '下载长图', icon: 'poster' },
      ],
      shareImg:'../assets/images/icon.png'
    };
  },
  mounted() {
    this.getDetail();
    this.getSetting();
    if(mc.isClient()){
      this.options=[
        { name: '微信', icon: 'wechat' },
        { name: '下载长图', icon: 'poster' }
      ];
    }
  },
  methods: {
    getSetting(){
      var _this = this;
      getSettingApi().then(res =>{
        if(res.state){
          _this.showRate = res.data.score==1?true:false;
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getDetail() {
      var _this = this;
      var params = {
        id: _this.$route.params.id,
      };
      getProjectDetailApi(params)
        .then((res) => {
          if (res.state) {
            _this.detail = res.data;
            this.$forceUpdate();

            _this.wxready({
              title: res.data.name,
              desc: res.data.name,
              link: location.href,
              imgUrl: res.data.thumb,
            })

          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 进度中图片预览
    viewpic(pic){
      // this.viewfile = pic;
      // this.isViewPic = true;
      ImagePreview([pic]);
    },
    saveImage(divText, imgText) {
      let canvasID = this.$refs[divText];
      let that = this;
      let a = document.createElement("a");
      this.$html2canvas(canvasID).then((canvas) => {
        let dom = document.body.appendChild(canvas);
        dom.style.display = "none";
        a.style.display = "none";
        document.body.removeChild(dom);
        let blob = that.dataURLToBlob(dom.toDataURL("image/png"));
        a.setAttribute("href", URL.createObjectURL(blob));
        //这块是保存图片操作  可以设置保存的图片的信息
        a.setAttribute("download", imgText + ".png");
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(blob);
        document.body.removeChild(a);
        that.showShare = false;
      });
    },
    dataURLToBlob(dataurl) {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // 图片转base64
    getBase64Image(imageUrl){
      var _this = this;
      if(!imageUrl) return;
      //一定要设置为let，不然图片不显示
			let image = new Image();

			//解决跨域问题
			// image.setAttribute('crossOrigin', 'anonymous');
			// image.src = imageUrl
      image.crossOrigin = "*"
      image.src = imageUrl + '?v=' + Math.random()

			//image.onload为异步加载
			image.onload = () => {
				var canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				var context = canvas.getContext('2d');
				context.drawImage(image, 0, 0, image.width, image.height);
				
				var quality = 0.8;
				//这里的dataurl就是base64类型
				var dataURL = canvas.toDataURL("image/jpeg", quality);//使用toDataUrl将图片转换成jpeg的格式,不要把图片压缩成png，因为压缩成png后base64的字符串可能比不转换前的长！
        _this.detail.thumb = dataURL;
			}
    },
    operateHandle(){
      this.getBase64Image(this.detail.thumb);
      this.showShare = true;
    },
    onSelect(option){
      if(option.icon=='poster'){
        this.saveImage('html2canvas','share')
      }else if(option.icon=='wechat'){
        var option = {
          title: this.detail.name,
          content:this.detail.name ,
          image: this.shareImg,
          url: location.href
        }
        mc.shareWeChat(option)
      }
    }
  },
  filters: {
    timeFilter(val) {
      if(val){
        var date = new Date(val.replace(/-/g,'/')),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
        return `${year}年${month}月${day}日`;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.subject {
  padding-top: 0.39rem;
  .main {
    padding: 0 0.1rem;
    overflow: hidden;
    background: url("../assets/images/detail_bg.png") top/100% no-repeat;
    .base-info {
      background-color: #fff;
      border-radius: 6px;
      box-shadow: 0px 6px 12px 0px rgba(212, 212, 212, 0.3);
      margin-top: 0.1rem;
      .title {
        font-size: 0.18rem;
        padding: 0.16rem 0.15rem;
        text-align: center;
        font-weight: 550;
        color:#111111;
      }
      .thumb {
        padding: 0 0.15rem;
        .van-image {
          width: 100%;
          img {
            width: 100%;
          }
        }
      }
      .content {
        padding: 0.16rem 0.15rem;
        font-size: 0.14rem;
        color: #111111;
        line-height: 0.2rem;
      }
      .duty {
        background-color: #bd192d;
        color: #fff;
        padding: 0.1rem 0.15rem;
        border-radius: 0 0 6px 6px;
        p {
          line-height: 0.24rem;
          font-size: 0.14rem;
        }
      }
    }
    .process-info {
      padding: 0 0.15rem;
      margin: 0.2rem 0;
      color: #333333;
      font-size: 0.16rem;
      font-weight: 550;
      ul {
        position: relative;
        margin-top:0.1rem;
        .line {
          position: absolute;
          left: 0.09rem;
          top: 0.09rem;
          width: 1px;
          height: calc(100% - 0.18rem);
          background-color: #d8d8d8;
        }
        li {
          padding-left: 0.2rem;
          position: relative;
          .tips {
            position: absolute;
            top: 0.03rem;
            left: 0;
            height: 0.18rem;
            width: 0.18rem;
            background: url("../assets/images/state_ing.png") no-repeat
              center/100%;
            &.done {
              background: url("../assets/images/state_done.png") no-repeat
                center/100%;
            }
          }
          .state {
            display: flex;
            align-items: center;
            height: 0.24rem;
            color: #999999;
            .time {
              margin-left: 0.05rem;
              font-size: 0.13rem;
              font-weight: normal;
            }
            .done {
              color: #bd192d;
            }
          }
          .content {
            padding: 0.1rem;
            background-color: #fff;
            border-radius: 6px;
            margin: 0.1rem 0 0.16rem 0;
            font-weight: normal;
            box-shadow: 0px 6px 12px 0px rgba(212, 212, 212, 0.3);
            p {
              line-height: 0.2rem;
              color: #666;
              font-size: 0.12rem;
              &.desc {
                color: #000;
                font-size: 0.14rem;
              }
              &.view-pic{
                display: flex;
                justify-content: flex-end;
                color:#1989fa;
              }
            }
          }
        }
      }
    }
  }
}
</style>