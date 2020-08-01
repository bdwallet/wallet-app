<template>
    <div class="checkapi">
        <div class="input-box">
            <comp-input placeholder="请求地址" v-model="address" />
            <div class="checkbox">
                <div @click="applyType = 1" class="btn" :class="{'hover': applyType==1}">Post</div>
                <div @click="applyType = 0" class="btn" :class="{'hover': applyType==0}">Get</div>
            </div>
            <div class="params-box">
                <div class="params" v-for="item in paramsArr" :key="item">
                    <comp-input class="paramsKey" placeholder="key" v-model="paramsKey[item-1]" />
                    <comp-input class="paramsVal" placeholder="value" v-model="paramsVal[item-1]" />
                </div>
                <div>
                    <comp-input class="addBtn" Type="button" value="+" @arrow="addParams" :status="1" />
                </div>
            </div>
            <comp-input Type="button" value="清除" @arrow="clear" :status="1" />
            <comp-input class="submitBtn" Type="button" value="请求" @arrow="submit" :status="1" />
        </div>
    </div>
</template>

<script>
    import compInput from '~components/compInput/input';
    export default {
        name: 'checkapi',
        components: {
            compInput
        },
        data() {
            return {
                applyType: 1,
                paramsArr: 1,
                address: '',
                paramsKey: {},
                paramsVal: {},
            }
        },
        methods: {
            submit() {
                if(!this.address)
                    return ;
                let p = this.getParams();
                if (this.applyType) {
                    Ajax.post(`/weixin/apply.php?act=${this.address}`, p).then();
                } else {
                    Ajax.get(`/weixin/apply.php?act=${this.address}`, p).then();
                }
            },
            getParams() {
                let p = {};
                let index = 0;
                do {
                    p[this.paramsKey[index]] = this.paramsVal[index];
                    index++;
                } while (this.paramsArr > index);
                return p;
            },
            addParams() {
                this.paramsArr += 1;
            },
            clear() {
                this.paramsArr = 1;
                this.paramsKey = {};
                this.paramsVal = {};
                this.$set(this.paramsKey, 0, undefined);
                this.$set(this.paramsVal, 0, undefined);
            }
        },
        mounted() {
            this.$set(this.paramsKey, 0, undefined);
            this.$set(this.paramsVal, 0, undefined);
        }
    }
</script>

<style lang="less" scoped>
    .checkapi {
        //padding:.75rem;
        .input-box {
            .checkbox {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 2rem;
                margin: .75rem 0;
                border: 1px solid #3689ef;
                .btn {
                    flex: 1;
                    height: 100%;
                    text-align: center;
                    &.hover {
                        background: #3689ef;
                    }
                }
            }
            .addBtn {
                margin-top: .5rem;
            }
            .params-box {
                margin-bottom: 1rem;
                .params {
                    display: flex;
                }
                .paramsVal,
                .paramsKey {
                    margin: .2rem;
                }
            }
            .submitBtn {
                margin-top: 1rem;
            }
        }
    }
</style>

