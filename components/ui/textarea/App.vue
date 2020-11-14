<template>
  <div class="ui-textarea">
    <div class="ui-textarea-editor" 
        :class="{'ui-error':(tipText && !message),'ui-disabled':!disabled}" 
        :contenteditable="disabled" 
        :placeholder="placeholder" 
        spellcheck="false" 
        :style="uiStyle" 
        @click="setLastEditRange" 
        @input="inputHandle" 
        @keyup="keyupHandle" 
        @keydown="setKeyCode"
        @blur="blurHandle" 
        v-html="currentContent"></div>
    <div class="ui-tip-box">
      <div class="ui-textarea-con-num" v-if="maxlength>0">
        <span :class="{'ui-textarea-tip':contentNum>=maxlength}">{{contentNum}}</span>
        <span>/{{maxlength}}</span>
      </div>
      <transition name="tiptext" tag="div">
        <div class="ui-textarea-tip" v-if="tipText">{{tipText}}</div>
      </transition>
    </div>
    <!--倒三角-->
    <div class="layer_arrow" v-if="triangle">
      <div class="arrow_bor" :style="triangle">
        <i :class="[bg_fr,'line']"></i>
        <em class="bg_br line"></em>
      </div>
    </div>
  </div>
</template>
<script>
  import service from '~service';
  let keywords = null;
  export default {
    name: 'Textarea',
    props: {
      disabled: { //输入状态 true:可输入,false:禁用
        type: Boolean,
        default: true
      },
      maxlength: { //最大输入长度，0为不限制顺
        type: Number,
        default: 500
      },
      minlength: { //最小输入长度
        type: Number,
        default: 0
      },
      value: { //内容
        type: String,
        default: ''
      },
      uiStyle: { //输入框的style
        type: Object,
        default: {}
      },
      placeholder: { //编辑器没有内容时的默认展示
        type: String,
        default: '请输入内容'
      },
      doChecked: { //是否触发组件检查数据事件
        type: String,
        default: ''
      },
      triangle: { //小三角left/right距离
        type: String,
        default: ''
      },
      message:{ //外部错误提示
        type:String,
        default:''
      }
    },
    data() {
      return {
        currentContent: this.value, //用于更新视图
        changeCount: { //this.value, //用于内容计数与业务逻辑
          html: this.value,
          text: this.value
        },
        currentKeyCode: 0, //当前按键值
        lastEditRange: null, //最后光标对象
        tipText: '', //错误提示文本
        bg_fr: 'bg_fr', //倒三角颜色类名
      }
    },
    watch: {
      'value': function(val) {
        this.currentContent = val;
        this.changeCount.html = val;
        this.changeCount.text = val;
      },
      'doChecked': function(val) {
        let parameter = typeof(val) == "object" ? val : false;
        this.checkValue(parameter);
      },
      'message': function(val){
        this.tipText = val;
      }
    },
    computed: {
      contentNum() {
        return this.tirmSpace(this.changeCount.text).length;
      },
      inputStatus() {
        return !(this.contentNum >= this.maxlength);
      },
    },
    methods: {
      inputHandle(event) {
        if (this.inputStatus || this.currentKeyCode == 8 || this.currentKeyCode == 46) {
          let html = event.target.innerHTML;
          let text = event.target.innerText;
          this.changeCount.html = html;
          this.changeCount.text = text;
          this.setLastEditRange();
        } else {
          this.setCaretPosition(event.target);
        }
      },
      //兼容IE
      keyupHandle(event) {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
          //console.log("is IE");
          this.inputHandle(event);
        }
      },
      blurHandle(e) {
        this.inputHandle(e);//修复Edge浏览器兼容问题
        let value = this.checkValue(false);
        this.$emit('blur', value);
      },
      //记录当前按钮的键值
      setKeyCode(event) {
        this.currentKeyCode = event.keyCode;
      },
      //设置光标位置
      setCaretPosition(divEdit) {
        let lastStartOffset = this.lastEditRange.startOffset;
        // 编辑框设置焦点
        divEdit.focus()
        // 获取选定对象
        let selection = getSelection()
        // 判断是否有最后光标对象存在
        if (this.lastEditRange) {
          // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
          selection.removeAllRanges()
          selection.addRange(this.lastEditRange)
        }
        //<br>BUG标签修改
        let emojiText = document.createTextNode(this.changeCount.html);
        divEdit.innerHTML = "";
        divEdit.appendChild(emojiText);
        let range = document.createRange()
        range.selectNodeContents(emojiText)
        range.setStart(emojiText, lastStartOffset)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
        // 无论如何都要记录最后光标对象
        this.lastEditRange = selection.getRangeAt(0)
      },
      // 保存当前selection对象
      setLastEditRange() {
        // 获取选定对象
        let selection = getSelection();
        // 设置最后光标对象
        this.lastEditRange = selection.getRangeAt(0);
        //改变倒三角类
        this.bg_fr = this.bg_fr == 'bg_fr_error' ? 'bg_fr_error' : 'bg_fr_default';
      },
      //检测数据 返回：正确内容 或 false
      checkValue(parameter) {
        //let content = this.changeCount.html.replace(/<i>/g, '').replace(/<\/i>/g, '');
        let content = this.changeCount.text;
        this.changeCount.html = content;
        this.currentContent = content;
        if (this.contentNum < this.minlength && this.minlength > 0)
          this.tipText = `请输入至少${this.minlength}个字`;
        else if (this.contentNum > this.maxlength && this.maxlength > 0)
          this.tipText = `请输入至多${this.maxlength}个字`;
        else if (keywords) {
          let keyarr = keywords;
          if(parameter) keyarr = parameter;
          let res = this.checkKeywords(content,keyarr);
          if (res) {
            this.currentContent = res;
            this.tipText = '包含敏感词汇，请修改后再发布';
          } else {
            this.tipText = '';
          }
        } else {
          this.tipText = '';
        }
        let value = false;
        if (this.tipText) {
          this.bg_fr = 'bg_fr_error';
        } else {
          this.bg_fr = 'bg_fr';
          value = this.currentContent;
        }
        return value;
      },
      //匹配关键词
      checkKeywords(content,keywordsArr) {
        let result = false;
        if (keywordsArr && keywordsArr.length > 0) {
          for (const index in keywordsArr) {
            if (keywordsArr.hasOwnProperty(index)) {
              const KW = keywordsArr[index];
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
                  content = content.replace(reg, function(str) {
                    result = true;
                    return `<i>${str}</i>`;
                  });
                }
              }
            }
          }
        }
        if (result)
          result = content;
        return result;
      },
      //去除字符串空格
      tirmSpace(str) {
        str = str.replace(/[\s\t]/g, "");
        return str;
      },
    },
    mounted() {
      keywords = service.checkwords();
    }
  };
</script>
<style lang="less">
  .ui-textarea {
    position: relative;
    font-size: 12px;
    .ui-textarea-editor {
      transition: all .2s ease;
      width: 100%;
      min-height:34px;
      padding: 5px;
      outline: 0;
      border: 1px solid #ddd;
      background: #fff;
      font-size: 14px;
      color: #333;
      overflow-x: hidden;
      overflow-y: auto;
      user-select: text;
      -webkit-user-select: text;
      cursor: text;
      word-break: break-all;
      white-space: pre-wrap;
      -webkit-user-modify: read-write-plaintext-only;
      &[contentEditable=true]:empty:not(:focus):before {
        content: attr(placeholder);
        color: #aaa;
        font-size: 14px;
        line-height: inherit;
      }
      &:focus {
        border-color: #0099cc;
      }
      i {
        font-style: normal;
        color: #ea1d38;
        background: #fcdde1;
      }
    }
    .ui-error {
      border-color: #ea1d38 !important;
    }
    .ui-disabled {
      background-color: #f1f1f1;
      cursor: default;
    }
    .ui-tip-box {
      margin-top: 8px;
      height: 12px;
      line-height: 12px;
      font-size: 12px;
      &::after {
        display: table;
        content: '';
        clear: both;
      }
      .ui-textarea-con-num {
        float: right;
        color: #bbb;
      }
      .ui-textarea-tip {
        float: left;
        color: #ea1d38;
      }
    } //倒三角
    .layer_arrow {
      .arrow_bor {
        .bg_br {
          border-color: transparent transparent #fff transparent !important;
          margin-left: -17px !important;
          margin-top: 1.2px !important;
        }
        .bg_fr {
          border-color: transparent transparent #ddd transparent !important;
        }
        .bg_fr_default {
          border-color: transparent transparent #0099cc transparent !important;
        }
        .bg_fr_error {
          border-color: transparent transparent #ea1d38 transparent !important;
        }
        .bg_fr_success {
          border-color: transparent transparent #0099cc transparent !important;
        }
      }
    }
    .tiptext-enter-active {
      transition: all .3s ease;
    }
    .tiptext-leave-active {
      transition: all .3s ease;
    }
    .tiptext-enter {
      transform: translateY(-10px);
      opacity: 0;
    }
    .tiptext-leave-to {
      transform: translateX(10px);
      opacity: 0;
    }
  }
</style>