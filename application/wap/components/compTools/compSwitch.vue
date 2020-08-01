<template>
    <div class="comp-switch">
        <input type="checkbox" id="comp-switch" @change="ChangeSwitch($event)">
        <label class="switch-label" for="onoffswitch">
                <span class="switch-inner"></span>
                <span class="switch"></span> 
            </label>
    </div>
</template>

<script>
    export default {
        name: 'comp-switch',
        methods: {
            ChangeSwitch(e) {
                this.$emit('ChangeSwitch', e.target.checked)
            }
        }
    }
</script>

<style lang="less" scoped>
    .comp-switch {
        position: relative;
        user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -webkit-user-select: none;
        input[type='checkbox'] {
            position: absolute;
            opacity: 0;
            margin: 0;
            z-index: 1;
        }
        .switch-label {
            display: block;
            width: 1.25rem;
            height: .7rem;
            overflow: hidden;
            cursor: pointer;
            border-radius: .825rem;
            display: flex;
            align-items: center;
            .switch-inner {
                display: block;
                width: 200%;
                margin-left: -100%;
                height: 100%;
                transition: all .5s ease;
                &::after,
                &::before {
                    display: block;
                    float: right;
                    width: 50%;
                    height: 100%;
                    padding: 0;
                    box-sizing: border-box;
                }
                &::after {
                    content: '';
                    background: #BFD0FF;
                }
                &::before {
                    content: '';
                    background: #BCBCBC;
                }
            }
            .switch {
                position: absolute;
                display: block;
                width: .925rem;
                height: .925rem;
                background: #f3f3f3;
                box-shadow: 0 .075rem .1rem 0 rgba(0, 0, 0, 0.3), 0 .225rem .45rem 0 rgba(0, 0, 0, 0.1);
                border: .025rem solid #fff;
                top: -0.125rem;
                left: -0.25rem;
                border-radius: 50%;
                transition: all .5s ease;
                z-index: 0;
                &::after{
                    content: '';
                    display: block;
                    padding-right: 100%;
                }
            }
        }
        input[type='checkbox']:checked + .switch-label .switch-inner {
            margin-left: 0;
        }
        input[type='checkbox']:checked + .switch-label .switch {
            left: .575rem;
            background: #5682FF;
            box-shadow: 0 .075rem .1rem 0 rgba(0, 0, 0, 0.3), 0 .225rem .45rem 0 rgba(0, 0, 0, 0.1);
            border: .025rem solid rgba(98, 139, 255, 1);
        }
    }
</style>