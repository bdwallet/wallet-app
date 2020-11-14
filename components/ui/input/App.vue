<template>
	<ui-form-group :class="id"> 
			<div class="inputBox"   :class="['inputBox-'+titleStruct,{'ui-focus':isfocus}]" :style="outInputStyle">
				<div :class="['input-title','ui-title-'+titleStruct]" v-if="title" :style="titleStyle">
					{{title}}
				</div>
				<div :class="['input-main']">
					<div class="input-editor-outer" :class="{'ui-error': tipText,'ui-disabled': disabled}" :style="getInputStyle">
								<input 
											:id="id" 
											:type="type"
											:class="['input-editor',{'ui-numline':numTip}]" 
											spellcheck="false"
											:disabled="disabled"
											:placeholder="placeholder" 
											@focus="onFocus" 
											@blur="onBlur"
											@keydown="keydown"
											v-model="content"
											:maxlength="numTip?inputMaxlength:''"
											>
								<div class="ui-input-con-num" v-if="maxlength>0&&numTip">
					      </div>
					      <span v-if="id=='password'" class="passEye">
					      	<i :class="['icon', type=='password' ? 'icon-yanjing1' : 'icon-yanjing']" @click="changeType"></i>
					      </span>
					</div>
					<a href="javascript:;" v-if="id=='captcha'" class="img-code" @click="refImg"><img :src="captchaImgsrc||$assets.codeBg" title="点击刷新" /></a>
					<ui-button v-if="id=='verification'" @click="getVerification"  class="btn-verification"  :disabled="verificationBtnDisabled" >{{verificationText}}</ui-button>
			  </div>
			  <div class="ui-tip-box" v-if="tipText&&textTip">
			        <i class="icon icon-error"></i><span v-text="tipText"></span>
			  </div>
			</div>
   </ui-form-group> 
</template>
<script type="text/javascript">
	import service from '~service';
	import ajax from '~ajax';
	export default{
		name: 'Input',
		props:{		
			type:{
				type: String,
				default: 'text'
			},
			property:{
				type: String,
				default: ''
			},
			disabled:{
				type: Boolean,
				default: false
			},
			numTip:{
				type: Boolean,//是否需要字符提醒,默认false不提醒
				default: false
			},
			textTip:{
				type: Boolean,
				default: true
			},
      maxlength: { //最大输入长度，0为不限制顺
        type: Number,
        default: 30
      },
      minlength: { //最小输入长度
        type: Number,
        default: 0
      },
      outInputStyle: {
        type: Object,//input框外层div样式
        default: {}
      },
      placeholder:{
				type: String,
				default: '请输入内容'
			},
			doChecked:{ //是否触发组件检查数据事件
        type: String,
        default: ''
      },
			title:{
				type: String,//具有标题结构的标题
				default: ''
			},
			titleStruct:{
				type: String,//标题结构，默认上下leftright为左右
				default: 'topdown'
			},
			height:{
				type: Number,//主要用于有标题组件标题行高
				default: 40
			},
			inputStyle:{
				type: Object,
				default: {}
			},
			width:{
				type: Number,
				default: 380
			}
			,
			id:{
				type: String,
				default: ''
			},
			validataType:{
				type: String,
				default: ''
			},
			verificationBtnDisabled:{
				type: Boolean,
				default: false
			},
			verificationText:{
				type: String,
				default: ''
			},
			captchaImgsrc:{
				type: String,
				default: ''
			},
			needCapchaImg:{
				type: String,//是否需要图形验证码
				default: ''
			},
			phone:{
				type: Number,
				default:''
			}
		},
		data(){
			return{
				isfocus: false,//聚焦样式
				tipError: false,//错误样式
				tipText: '',//错误提醒
				keywords: '',//获取敏感词库
				content:'',//输入框内容
			}
		},
		computed:{
			titleStyle(){
				let titleStyleObj = {};
				if(this.titleStruct=='leftright'){
					titleStyleObj['line-height'] = this.height + 'px'; 
				}
				return titleStyleObj
			},
			getInputStyle(){
				let styleObj = this.inputStyle;
				styleObj['height'] = this.height+'px';
				styleObj['width'] = this.width+'px';
				return styleObj;
			},
			contentNum() {
        return this.tirmSpace(this.content).length;
      },
      inputMaxlength() {
      	return this.content.length-this.contentNum + (+this.maxlength)
      },
		},
		watch: {
			'doChecked':function(val){
         this.checkValue();
      },
		},
		methods:{
			refImg(){	
					this.changeCaptchaImg(this.phone,'notip');
					this.$emit('phonecheck');
			},
			changeCaptchaImg(phoneNumber,notip){
					let phone = phoneNumber;
					let notips = notip;
					ajax.get(this.$api.checkUser.certification,{phone}).then(res => {
						let imgsrc =`${this.$global.isPro ? '' : process.env.BASE_API}/user/checkUser.php?act=verification&phone=${phone}&${Math.random()}`;
						this.$emit('captchaImg',imgsrc)
					}).catch(error=>{
						this.$emit('captchaImg','');
						if(!notips){
							this.tipText = '该手机号未注册！';
						}
					});
			},
			giveCaptchaImg(){
					if(this.captchaImgsrc){
						return false;
					}
					this.changeCaptchaImg(this.content)
			},
			giveVal(val){
				let res = {};
      	res.val = val;
      	let getproperty = this.property;
      	res.status = 0;
      	if(this.tipText){
      		res.status = 1;//验证不通过
      	}
      	this.$emit(getproperty, res)
			},
			onFocus(e){
				this.isfocus = true;
			},
			onBlur(e){
				this.isfocus = false;
				let content = this.checkValue();
				this.giveVal(this.content);
			},
      keydown(e){
      	if(e.keyCode==13){
      		let content = this.checkValue();
      		this.giveVal(this.content);
      	}
      },
			validata(testType){
				let validataStatus = false;
				let content = this.content;
				let regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
				let regVerify = /\S+/;
				let regPassword = /^\s*[\s\S]{6,16}\s*$/;
				let regCaptcha = /\S+/;
				let message = '';
				if(testType=='phone'){
						if(!regPhone.test(content)){
								message = '请输入正确的手机号码';
						}else{
							 this.giveCaptchaImg();
						}
				}else if(testType=='verification'&&!regVerify.test(content)){
						message = '请输入验证码';
				}else if(testType=='password'&&!regPassword.test(content)){
						message = '请输入6到16位密码';
				}else if(testType=='captchaImg'&&(!regCaptcha.test(content)|| this.tirmSpace(content).length !=4)){
						message = '请输入正确的验证码';
				}else{
					message = "";
				}
				this.tipText = message;
				if(this.tipText){
					return true
				}
				return this.tipText
			},
			checkValue() {
				if(this.validata(this.validataType)) return false;
        if (this.contentNum < this.minlength && this.minlength > 0)
          this.tipText = `请输入至少${this.minlength}个字`;
        else if (this.contentNum > this.maxlength && this.maxlength > 0)
          this.tipText = `请输入至多${this.maxlength}个字`;
        else if (this.keywords) {
          let content = this.content;
          this.checkKeywords(content, this.keywords);
        } else {
          this.tipText = '';
        }
        let value = false;
        if(!this.tipText){
        	value = this.content;
        }
        return value;
      },
      //匹配关键词
      checkKeywords(content, keywords) {
        let result = false;
        if (keywords && keywords.length > 0) {

        		let matchword = '';
	          for (const index in keywords) {
	            if (keywords.hasOwnProperty(index)) {
	              const KW = keywords[index];
	              for (const k in KW) {
	                if (KW.hasOwnProperty(k)) {
	                  let word = KW[k];
	                  let key = '/';
	                  for (let i = 0; i < word.length; i++) {
	                    if (i < word.length - 1)
	                      key = key + word[i] + '[\\s\\S]{0,3}';
	                    else
	                      key = key + word[i];
	                  }
	                  key += '/g';
	                  let reg = eval(key);
	                  let getmatch = reg.exec(content);
			              if(getmatch != null){
			              	 matchword += ' “'+getmatch+'” ';
			              }
	                }
	              }
	            }
	          }
	          if(matchword !==''){
	          	this.tipText = '包含敏感词汇'+matchword;
	          }else{
	          	this.tipText = ''
	          }
	        }
      },
		  //去除字符串空格
      tirmSpace(str) {
        str = str.replace(/[\s\t]/g, "");
        return str;
      },
      getVerification(){
      	this.$emit('getVerification',)
      },
      changeType(){
      	if(this.type=='text'){
      		this.type = 'password';
      	}else{
      		this.type = 'text';
      	}
      },
		},
		mounted(){
			
		},
	}
</script>
<style lang="less">
	.inputBox{
		min-height: 60px;
		&.inputBox-leftright{
			display: flex !important;
		}
		&.ui-focus{
			.input-editor-outer{
				border-color: #0099cc;
			}
			.ui-tip-box{
				 color: #666 !important;
				 .icon{
				    color: #999;
		      }

			}
		}
		.ui-tip-box {
	      margin-top: 8px;
	      height: 12px;
	      line-height: 12px;
	      color:#ff5b57;
	      font-size: 12px;
	      .icon{
	      	font-size: 12px;
			    color: #ff5b57;
			    margin-right: 5px;
	      }
	      &::after {
	        display: table;
	        content: '';
	        clear: both;
	      }
	      .ui-input-con-num {
	        float: right;
	        color: #bbb;
	      }
	      /* .ui-input-tip {
	        float: left;
	        color: #ea1d38;
	      } */
	    }
		.input-main{
		
			flex: 1;
			.input-editor-outer{
				background: #fff;
				border-radius: 3px;
				border: 1px solid #ddd;
		    position: relative;
				.input-editor{
						height: 100%;
				    line-height: 100%;
				    display: block;
				    /* width: calc(~"100% - 24px"); */
				    width: 100%;
				    background-color: inherit;
				    position: absolute;
				    padding-left: 12px;
				    padding-right: 12px;
					  &.ui-numline{
					    width: calc(~"100% - 64px");
					  }
					  &#password{
					  	padding-right: 40px;
					  }
					  &::-webkit-input-placeholder{
						    color: #bbb;
						}
				}
				.passEye{
					position: absolute;
					right: 5px;
   				height: 100%;
   				top: 0;
   				color: #bbbbbb;
   				text-align: center;
   				min-width: 30px;
   				i{
   					cursor: pointer;
						font-size: 20px;
						line-height: 38px;
						&:hover{
							color:#999;
						}
   				}
				}
				.ui-input-con-num{
					position: absolute;
					right: 12px;
			    color: #bbb;
			    height: 12px;
			    line-height: 12px;
			    font-size: 12px;
			    top: calc(~"50% - 6px"); 
		      .ui-input-tip {
		        float: left;
		        color: #ea1d38;
		      }
				}
				&.ui-disabled{
		    	background-color: #f1f1f1;
	    		.input-editor{
	    			cursor: default;
	    			background-color: #f1f1f1;
	    		}
		    }
			}
			
			.ui-error {
	      /* border-color: #ea1d38 !important; */
	    }
		}
		.input-title{
			font-size: 14px;
			color: #777777;
			line-height: 1;
			margin-bottom: 12px;
			&.ui-title-leftright{
				margin-bottom: 0;
				margin-right: 20px;
			}
			&.ui-title-topdown{
				line-height: 1 !important;
			}
		}
    input::-ms-clear { display: none;}
		input::-ms-reveal { display: none;}
		input{
			padding: 0;
	    border: 0;
	    outline: none;
	    -webkit-appearance: none;
	    box-shadow: none;
	    cursor: text;
		}
		input:focus, input:focus {
		    outline: none;
		    box-shadow: none;
		}
		::-webkit-input-placeholder { /* WebKit browsers */
		    color:    #bbb;
		}
		:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
		    color:    #bbb;
		}
		::-moz-placeholder { /* Mozilla Firefox 19+ */
		    color:    #bbb;
		}
		:-ms-input-placeholder { /* Internet Explorer 10+ */
		    color:    #bbb;
		}
		input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
		    background-color: inherit !important;
		    background-image: none !important;
		    color: rgb(0, 0, 0) !important;
		}
	}
	.verification,.captcha{
		.input-main{
			height: 40px;
		}
		.input-editor-outer{
			width: 244px !important;
			display: inline-block;
		}
	}
	.img-code{
			display: inline-block;
			margin-left: 8px;
			width: 102px;
			height: 40px;
			img{
				width: 100%;
				height: 100%;
			}
	}
</style>