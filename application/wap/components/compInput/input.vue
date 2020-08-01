<template>
    <div class="comp-input">
        <div
            v-if="Type == 'button'"
            class="input-item input-button"
            ref="inputs"
            :style="{ height, width }"
            :class="{'input-button-active': status, 'pink-bg-btn': pinkBg, 'no-border-redius': nobg, 'bg-btn-1': bg==1, 'bg-btn-2': bg==2}"
            @click.stop="btns"
        >
            <i class="icon input-icon" :class="icon" v-show="icon"></i>
            <span>{{value}}</span>
            <span v-if="subTip" class="sub">{{ subTip }}</span>
        </div>
        <div
            v-else
            class="input-item input-type"
            ref="inputs"
            :style="{ height, width }"
            :class="{'input-error': isError || error,'input-active' : isActive, 'pink-bg-input' : pinkBg, 'white-no-bg': nobg}"
        >
            <input
                :value="value"
                :type="Type == 'code' || Type == 'number' ? 'tel' : Type"
                @focus="onFocus($event)"
                @blur="onBlur"
                @click.stop="getCursortPosition($event)"
                :placeholder="placeholder"
                :maxlength="Type == 'tel'? '11': (Type == 'code'? '4' : '')"
                @input="handleInput($event)"
            />
            <i class="icon icon-dianji" v-show="value && isActive" @click.stop="cleartext"></i>
            <i
                class="icon icon-renkanguo"
                v-if="eye"
                @click.stop="show"
                ref="eye"
                :class="{'active-eye': passwordShow }"
            ></i>
        </div>
    </div>
</template>

<script>
/**
 * @desc
 *  input调用方法
 *    ①import compInput from '~components/compInput/input'
 *    ②<comp-input v-model="value" Type="password" :eye="true" placeholder="请输入密码"/>
 *    ③<comp-input v-model="value" Type="tel" reg="^[1][0-9]{10}$" placeholder="请输入手机号"/>
 *    ④<comp-input v-model="value"  placeholder="请输入昵称"/>
 *  button调用方法
 *    ①import compInput from '~components/compInput/input'
 *    ②<comp-input ref="compinput"  @arrow="submit" :height="'3.5rem'" :width="'3.5rem'" :value="value" :status="false" Type="button"/>
 *  Type: 可传值: password, tel, button, text等
 * */
import "./style";
export default {
    name: "compInput",
    data() {
        return {
            passwordShow: false, // 控制密码显示
            CaretPos: -1, // 光标位置
            numLength: 0, //  输入数据长度
            isError: 0, //input的输入内容是否正确
            isActive: 0 //是否获得焦点
        };
    },
    props: {
        Type: {
            type: String,
            default: "text"
        },
        placeholder: {
            type: String,
            default: "请输入相关信息"
        },
        height: {
            type: String,
            default: "2.1rem"
        },
        width: {
            type: String,
            default: "100%"
        },
        eye: {
            // type="password" 时显示眼睛
            type: String,
            default: false
        },
        status: {
            // 控制button的状态
            type: Boolean,
            default: false
        },
        pinkBg: {
            // 背景为粉色，底部激活无高亮  用于邀请注册输入框的样式
            type: Boolean,
            default: false
        },
        nobg:{
            // 背景为白色
            type: Boolean,
            default: false
        },
        bg: { // 控制背景
            type: Number,
            default: 0
        },
        scene: { // 场景
            type: String,
            default: ''
        },
        isonscroll: false, // 是否在屏幕滚动区域内 用于解决mui input输入框失焦滚动到页面顶部问题
        value: "", // input v-model绑定的数据
        icon: "", // Type='button' 时的图标
        subTip: "", // Type='button' 时的副标题
        reg: "", // 是否需要校验输入数据的格式
        error: 0
    },
    methods: {
        // 输入事件
        handleInput(e) {
            // code用于邀请注册中的短信验证码输入
            if (this.Type == "code")
                e.target.value = e.target.value.replace(/[^\d]/g, "");

            // num用于提现输入黑钻数量
            if (this.Type == "number" && this.scene !== 'licai')
                e.target.value = e.target.value.replace(/[^\d]/g, "");
            // e.target.value = e.target.value.match(/^\d*(\.?\d{0,2})/g)[0]; //只能输入两位小数

            if (this.Type == "tel") {
                e.target.value = e.target.value.replace(/[^\d]/g, "");
                this.getCursortPosition(e.target);
                // this.mobileFormat(e.target); // 光标问题
            }
            if(this.scene == 'licai') {
                if(e.target.value > 10000000) e.target.value = 10000000;
            }
            this.passwordShow = false;
            this.$emit("input", e.target.value);
            this.value = e.target.value;
        },

        // 聚焦显示底部蓝色线
        onFocus(e) {
            this.isActive = 1;
            this.isError = 0;
            this.getCursortPosition(e.target);
        },

        // 失焦隐藏底部蓝色线
        onBlur() {
            // 用于解决mui input输入框失焦滚动到页面顶部问题
            this.isonscroll && document.body.classList.remove('mui-focusin');

            if (this.reg) {
                let v =
                    this.Type == "tel"
                        ? this.value.replace(/\s/g, "")
                        : this.value;
                let reg = new RegExp(this.reg);
                if (!reg.test(v)) this.isError = 1;
            }
            this.isActive = 0;
        },

        // 格式化手机号
        mobileFormat(obj) {
            let value = obj.value;
            value = value.replace(/\s*/g, "");
            let result = [];
            for (let i = 0; i < value.length; i++) {
                if (i == 3 || i == 7) {
                    result.push(" " + value.charAt(i));
                } else {
                    result.push(value.charAt(i));
                }
            }
            obj.value = result.join("");
            if (obj.value.length < this.numLength) {
                if (this.CaretPos == 9 || this.CaretPos == 4) {
                    this.CaretPos -= 1;
                }
            }
            if (obj.value.length > this.numLength) {
                if (this.CaretPos == 9 || this.CaretPos == 4) {
                    this.CaretPos += 1;
                }
            }
            this.setCaretPosition(obj, this.CaretPos);
            this.numLength = obj.value.length;
        },

        // 获取当前光标
        getCursortPosition(ctrl) {
            if (document.selection) {
                ctrl.focus();
                let Sel = document.selection.createRange();
                Sel.moveStart("character", -ctrl.value.length);
                this.CaretPos = Sel.text.length;
            } else if (ctrl.selectionStart || ctrl.selectionStart == "0")
                this.CaretPos = ctrl.selectionStart;
        },

        // 设置光标位置
        setCaretPosition(ctrl, pos) {
            if (ctrl.setSelectionRange) {
                ctrl.focus();
                ctrl.setSelectionRange(pos, pos);
            } else if (ctrl.createTextRange) {
                let range = ctrl.createTextRange();
                range.collapse(true);
                range.moveEnd("character", pos);
                range.moveStart("character", pos);
                range.select();
            }
        },

        //清除输入数据
        cleartext() {
            this.value = "";
            this.$emit("input", "");
            this.isError = 0;
            this.isActive = 0;
            this.passwordShow = false;
        },

        // 密码的显示隐藏
        show() {
            this.passwordShow = !this.passwordShow;
            this.passwordShow ? (this.Type = "text") : (this.Type = "password");
        },

        // button 点击事件
        btns() {
            if (this.status) {
                this.$emit("arrow");
            }
        }
    }
};
</script>
