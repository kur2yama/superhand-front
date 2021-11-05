<template>
  <div class="login-wrapper"></div>
</template>

<script>
import { postRateApi } from "../api/post";
export default {
  name: "Login",
  props: {},
  data() {
    return {
      isMobile: true,
      sendtimer: null,
      sendflag: true,
      captchaCode: "",
      captchaImgCode: "",
      mobile: "",
      captchaurl: "/login/captcha",
      isShowCaptcha: false,
      account: "",
      password: "",
      hasAccount: false,
      hasPassword: false,
      hasMobile: false,
      hasCaptcha: false,
      isShowLogin: false,
      loginDisable: false,
      loginFlag: true,
    };
  },
  mounted() {
      
  },
  watch: {
        account(n, o) {
            this.hasAccount = !n ? false : true;
        },
        password(n, o) {
            this.hasPassword = !n ? false : true;
        },
        mobile(n, o) {
            this.hasMobile = !n ? false : true;
        },
        captchaCode(n, o) {
            this.hasCaptcha = !n ? false : true;
        },
        isMobile(n, o) {
            if (n) {
                if (this.hasMobile && this.hasCaptcha) {
                    this.loginDisable = true;
                } else {
                    this.loginDisable = false;
                }
            } else {
                if (this.hasAccount && this.hasPassword) {
                    this.loginDisable = true;
                } else {
                    this.loginDisable = false;
                }
            }
        }
  },
  methods: {
    getSite() {
            var _this = this
            $.ajax({
                url: '/ajax/user',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    var oauthConfig = {
                        'mode': 'public',
                        'appUrl': 'http://app.cjyun.org', // APP站点的URL
                        'noticeUrl': '/index/login/notice',  // 登录成功后，通知本站点登录的URL
                        'siteid': res.stateid
                    };
                    window.oauth = Oauth(oauthConfig);
                    if (res.state) {
                        _this.memberid = res.user.memberid
                    }
                },
                error: function (err) {

                }
            })
        },
        switchLoginMode() {
            this.isMobile = !this.isMobile;
            this.account = '';
            this.password = '';
            this.mobile = '';
            this.captchaCode = '';
        },
        // 点击发送验证码 -弹起图片验证码
        sendCode() {
            var _this = this;
            if (!_this.mobile || _this.mobile.length != 11) {
                alert("手机号格式错误");
                return false;
            }
            if (!_this.sendflag) return false;
            _this.flashCaptcha();
            _this.isShowCaptcha = true;
        },
        sendCodeFn() {
            var _this = this;
            var number = 60;
            var params = {
                mobile: _this.mobile,
                siteid: '10001'
            }
            _this.sendflag = false;
            clearTimeout(_this.sendtimer);
            _this.sendtimer = setInterval(function () {
                number--;
                if (number === 0) {
                    clearInterval(_this.sendtimer);
                    _this.sendtimer = null;
                    _this.sendflag = true;
                    $("#captcha-send-btn").html('发送验证码')
                    return;
                }
                $('#captcha-send-btn').html(number + 's')
            }, 1000)
            _this.isShowCaptcha = false;
            _this.flashCaptcha()
            $.post("/login/sendsms", params, function (res) {
                if (!res.state) {
		   _this.flashCaptcha();
                    alert(res.error)
                }
            })
        },
        // 确定图片验证码
        sureCaptcha() {
            var _this = this;
            if (!_this.captchaImgCode) {
                alert('验证码不能为空');
                return;
            }
            _this.checkCaptchaCode()
        },
        checkCaptchaCode() {
            var _this = this;
            if (!_this.captchaImgCode) {
                alert('验证码不能为空');
                return;
            }
            var params = {
                captcha: _this.captchaImgCode
            }
            $.post('/login/checkcaptcha', params, function (res) {
                if (res.state) {
                    _this.sendCodeFn();
                    _this.closeCaptcha();
                } else {
                    alert(res.error)
                }
            })
        },
        // 刷新图片验证码
        flashCaptcha() {
            var url = "/login/captcha?_" + new Date().getTime();
            this.captchaurl = url;
        },
        closeCaptcha() {
            this.isShowCaptcha = false;
            this.captchaImgCode = '';
        },
        //h5提交登录
        login() {
            if (this.loginFlag) {
                this.loginFlag = false
                var self = this;
                var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (!self.isMobile) {
                    var loginData = {
                        'account': this.account,
                        'password': this.password,
                        'remember': 0,
                        'type': reg.test(this.account) ? 'email' : 'mobile',
                        '_': new Date().getTime(),
                        'login_type': 0,
                        'need_https': 1
                    };
                } else {
                    var loginData = {
                        'account': this.mobile,
                        'password': this.password,
                        'remember': 0,
                        'type': reg.test(this.mobile) ? 'email' : 'mobile',
                        '_': new Date().getTime(),
                        'code': this.captchaCode,
                        'login_type': 1,
                        'need_https': 1

                    };
                }

                $.ajax({
                    url: '/index/login/cloud',
                    type: "POST",
                    data: loginData,
                    success: function (res) {
                        console.log(res)
                        if (res.state) {
                            self.isShowLogin = false;
                            self.loginFlag = true
                            oauth.login(res.data, function (data) {
                                // 登录成功，通知本地后端登录
                                self.noticeLogin(data.noticeurl);
                            }, function (is_captcha, code, error) {

                            });
                        }
                    }
                })
            }
        },
        //通知后端登录
        noticeLogin(url) {
            var _this = this
            $.post(url, function (res) {
                if (res.state) {
                    // 登录成功
                    window.location.reload();
                    // _this.getSite();
                    // _this.isShowLogin = false;
                } else {
                    // 登录失败
                    alert('登陆失败')
                }
            });
        },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.rate-wrapper {
  .rate-float {
    position: fixed;
    bottom: 0.4rem;
    right: 0.15rem;
    width: 0.5rem;
    height: 0.74rem;
    background: url("../assets/images/float.png") no-repeat center/100%;
  }
  .rate-dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    .rate-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2.8rem;
      height: 2.6rem;
      z-index: 100;
      background-color: #be1527;
      border-radius: 8px;
    }
    .rate-cont {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 2.62rem;
      height: 2.42rem;
      border-radius: 8px;
      background-color: #fff;
      .title {
        margin: 0.24rem 0 0.1rem;
        height: 0.26rem;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          color: #c70506;
          font-size: 0.18rem;
          font-weight: 550;
        }
        i {
          width: 0.2rem;
          height: 0.02rem;
          border-radius: 3px;
          margin: 0 0.05rem;
          &.left {
            background-image: linear-gradient(
              90deg,
              rgba(199, 5, 6, 0) 0%,
              #c70506 100%
            );
          }
          &.right {
            background-image: linear-gradient(
              90deg,
              #c70506 0%,
              rgba(199, 5, 6, 0) 100%
            );
          }
        }
      }
      .desc {
        color: #666666;
        font-size: 0.13rem;
        text-align: center;
      }
      .star-wrap {
        display: flex;
        justify-content: center;
        margin: 0.2rem 0;
      }
      .submit {
        width: 2.2rem;
        height: 0.4rem;
        margin: 0 auto;
        background-color: #be1527;
        color: #fff;
        line-height: 0.4rem;
        text-align: center;
      }
      .close {
        text-align: center;
        color: #999999;
        font-size: 0.14rem;
        line-height: 0.2rem;
        margin: 0.1rem 0;
      }
    }
  }
}
</style>
