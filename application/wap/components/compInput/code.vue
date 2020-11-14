<template>
    <div class="comp-ver-code" :class="amount==6? 'comp-ver-code6' : ''" @click.stop>
        <div class="input-box" :style="{margin}">
            <label class="simple-input-content" for="codeInput">
                <span v-for="(item,i) in amount" :key="item" ref="codeSpan" :class="code.length >= i ? 'highlight' : ''" @click.stop="handleEvent">{{type ? (code.charAt(i)?'●':'') : code.charAt(i)}}</span>
            </label>
            <input id="codeInput" ref="codeInput" :value="code" type="tel" :maxlength="amount" :placeholder="`请输入${amount}位数字验证码`" @input="handleInput($event)">
        </div>
    </div>
</template>

<script>
    /**
     *  @desc
     *      <comp-ver-code ref="arrow" :amount="6" :type="1" @arrow="arrow"/>
     *      @arrow 方法接收一个参数(数据输完过后的数据)
     *      this.$refs.verCode.clear() -> 父组件调用该方法可以全部删除输入的数据
     *      this.$refs.verCode.onfocus() -> 父组件调用该方法可以自动聚焦 -> android支持，ios不支持
     */
    export default {
        name: 'compVerCode',
        data () {
            return {
                code: '', // input -> value 值
            }
        },
        props:{
            amount: { // span -> 个数；默认为4个
                type: Number,
                default: 4
            },
            type: { // span -> 是否显示为点；默认为不显示
                type: Number,
                default: 0,
            },
            margin: {
                type: String,
                default: '0 auto'
            },
        },
        created() {
            this.code = '';
        },
        methods: {
            onfocus(){
                this.$refs.codeInput.focus()
            },
            //点击事件
            handleEvent(){
                this.code = '';
                this.onfocus();
            },
            //输入事件
            handleInput(e){
                e.target.value = e.target.value.replace(/[^\d]/g, "");
                this.code = e.target.value;
                if(this.code.length == this.amount)
                    this.$emit("arrow",this.code);
            },
            // 输入错误，全删
            clear() {
                this.code = "";
            },
        },
    }
</script>
