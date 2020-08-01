<template>
    <div class="comp-comment-editor" @touchmove="$event.preventDefault();">
        <div class="input-area">
            <textarea ref="textarea" v-model="Dcontent" @blur="OnBlur" @focus="OnFocus" :placeholder="placeholder" />
            <div class="textarea-pannel" v-show="!Disfocus" @click="SetFocus"></div>
            <div class="submit" :class="{'ok': Dcontent && Dcontent.length != 0}" @click="OnSubmit">发布</div>
        </div>
		<transition name="tips">
			<comp-uploader class="uplaoder" v-show="DshowUploader" @click.native="Upload(1)" ref="uploader" @uploaded="Uploaded" :max-length='3' />
		</transition>
        <div class="action-area">
            <!-- 暂时取消匿名评论功能 -->
            <!-- <comp-anonymous style="margin-right:.75rem;" v-if="type == 1" @click.native="Select" @checked="v=>{Danonymity=v;}" /> -->
            <i class="icon icon-pic" v-if="userInfo.user_level>=3" @click="Upload"></i>
        </div>
    </div>
</template>

<script>
    import "./style";
    import mixin from './mixin';
    import store from '~script/store';
    import Global from '~script/global';
	import compAnonymous from '~components/compAnonymous';
    import compUploader from '~components/compUploader';

    export default {
        name:'compCommentEditor',
        mixins: [mixin],
        components:{
            compAnonymous,
            compUploader
        },
        props:{
            type:{ //0评级 1爆料 2话题 3 (资讯，活动，帮助)  4 (项目公告)
                defalut: 1,
            },
            typeid:0,// 评级、爆料ID  项目公告时传 itemnoti_id的值  资讯时传news_id 的值,
            commentid:0, //回复时的评论ID  可选 有值时为回复  不传或传0时为评论
            placeholder: { //提示方案
                defalut: '发评论...',
            },
            pdata:{ //父级评论数据，回复时传
                defalut: {}
            },
            content: '', //评论内容  用于修改评论时 或上一次用户没有发布成功的内容
            imgs:{
                type: Array,
                defalut: []
            },
            nonymity:0,
            isDetail: 0, //回复时是否是在评论详情页
        },
        data(){
            return {
                Dtimeout:0,
                DshowUploader:0, //显示图片上传组件显示状态
                Dcontent: '', //评论内容
                Disfocus: 0, //是否获取焦点
                Dwating: 0, //是否延时销毁 防止点击发布按钮、上传图片、选择匿名实名，textarea失焦就触发
                Dimgs: [], //图片，多张时数组
                Danonymity: 0, //0实名 1匿名
                DuploadStatus:1, //是否正在上传图片 1:已上传成功或未上传 0：正在上传
                Dposting: 0, //数据提交状态
            }
        },
        computed:{
            userInfo(){
                return store.getters.userInfo;
            },
        },
        methods: {
            //准备上传图片 type 防止直接点击上传+号被动失焦
            Upload(type){
                //防止被动失焦销毁
                this.Dwating = 1;
                if(type!=1)
                    this.DshowUploader=!this.DshowUploader;
            },
            //图片上传完成业务处理
            Uploaded(imgs, ischange, status){
				this.DuploadStatus = status;
				if (!this.DuploadStatus) return false;
				this.Dimgs = imgs;
            },
            //打开匿实名选择组件
            Select(){
                //防止被动失焦销毁
                this.Dwating = 1;
            },
            //提交评论数据
            OnSubmit(){
                if(this.Dposting) return; //防止重复提交问题
                if(!this.Dcontent) return; //内容为空
                if(!this.DuploadStatus){
                    Dialog.tip("图片上传中...");
                    return;
                }
                if(this.Dcontent.length > 2000){
                    Dialog.alert("字数不能超过2000");
                    return;
                }
                this.Dposting = 1;
                //防止点击发布按钮，textarea失焦 被动失焦销毁
                this.Dwating = 1;
                let ps = {
                    type: this.type, //0评级 1爆料 2话题 3资讯 活动 4项目公告
                    comment_type_id: this.typeid, //项目公告时传 itemnoti_id的值 资讯时传news_id 的值
                    comment_content:this.ReplaceContent(this.Dcontent),
                    comment_intro: this.ReplaceContent(this.Dcontent.substr(0,30)),
                    comment_pater_id: this.commentid, //回复时的PID 父级评论的id
                    comment_up_id: (this.pdata && this.pdata.comment_id) || 0, // 回复-回复时的父级id
                    comment_reply_id: (this.pdata && this.pdata.user_id) || 0, //回复时的父级评论的用户id
                    comment_imgs: this.Dimgs,
                    comment_anonymity: this.Danonymity, //1匿名 2不匿名
                };

                Ajax.post(Api.apply.save_comment,ps).then(res => {
                    if(!this.commentid)
                        ps.commentPaterData = [];
                    //向评论列表添加数据
                    ps.comment_id = res.data.commentData.comment_id;
                    ps.comment_user_id = this.userInfo.user_id;
                    ps.comment_create_time = (new Date().getTime());
                    ps.comment_like_num = 0;
                    ps.is_like = 0;
                    ps.level = this.userInfo.level;
                    ps.user_anonymity = this.Danonymity;
                    ps.user_name = this.Danonymity ? res.data.commentData.anonData[0] : this.userInfo.user_name;
                    ps.user_photo = this.Danonymity ? res.data.commentData.anonData[1] : this.userInfo.user_photo;
                    ps.user_located_item_id = this.userInfo.user_located_item_id;
                    ps.isDetail = this.isDetail;
                    ps.reply_name = this.commentid ? this.pdata.user_name : ''; //回复时需要添加回复人的名称
                    //评论工具栏评论数+1;
                    let compToolbar = this.GetToolbar();
                    if(compToolbar)
                        compToolbar.$props.comment_num = +compToolbar.$props.comment_num + 1;
                    //向评论列表添加数据
                    let compList = this.GetList();
                    compList && compList.AddData(ps);

                    //清除$props.content数据
                    this.Dcontent = '';
                    this.Danonymity = 0;
                    this.Dimgs = [];
                    this.Dposting = 0;
                    this.$emit('submit',res);
                    //清除Dwating 恢复原状态
                    this.Dwating = 0;
                    this.OnBlur();
                }).catch(err => {
                    this.Dposting = 0;
                    this.$emit('submit',err);
                    this.OnBlur();
                });
                //这里需要做个判断 IOS APP在这抛出 为解决定位问题，其余平台应在Ajax内部返回 ########
                if(Global.isApp)
                    this.OnBlur();
            },
            //内容空格与回车处理函数(连续多个空格缩成1个空格；连续多行精简成1行) replace(/\n|\r\n/g,"<br>")
            ReplaceContent(txt) {
                let regEx = /\n+|\r\n+/g;
                txt = txt.replace(regEx, '`');
                regEx = /\s+/g;
                txt = txt.replace(regEx, ' ');
                txt = txt.replace(/\`/g, '\n');
                return txt;
            },
            //设置焦点 上传图片、选择匿实名时，失焦后再获取焦点时需要处理 事件优先级 tap > onfocus
            SetFocus(e){
                //设置输入框焦点
                this.$refs.textarea.focus();
                //return;
                // if (Global.isApp) { //并且为IOS端
                //     this.IOSInFocus(1);
                // } else {
                //     //设置输入框焦点
                //     this.$refs.textarea.focus();
                // }
                // e && e.preventDefault && e.preventDefault();
            },
            //textarea失焦事件
            //type:0时为用户主动失焦 直接$destroy() （点击收起键盘、滚动屏幕、发布成功）
            //type:1时为被动失焦 收回输入框即可 （上传图片、选择匿实名）
            OnBlur() {
                this.Disfocus = 0; //已失焦
                // if (Global.isApp) { //并且为IOS端
                //     this.IOSInFocus();
                // }
                let data = {content:this.Dcontent,imgs:this.Dimgs,nonymity:this.Dnonymity};
                this.$emit('blur',data); //失焦后把内容抛出，为toolbar显示
                //防止点击发布按钮、上传图片、选择匿名实名，textarea失焦就触发
                this.Dtimeout = setTimeout(() => {
                    if(!this.Dwating){
                        this.destroy();
                        Backdrop.hide();
                    }
                }, 10);
            },
            //获得焦点时
            OnFocus(){
                this.Disfocus = 1; //已聚焦
                this.Dwating = 0; //恢复原值
            },
            //IOS需要处理软键盘弹出时的定位问题 type:1 聚焦 0 失焦
            IOSInFocus(type){
                let self = this.$el;
                //聚焦时
                if(type){
                    //记录软键盘弹出前的滚动高度
                    //let beforeScrollTop = document.scrollingElement.scrollTop;
                    //设置兼容样式
                    //定位至屏幕正中间 需要减去input的本身高度/1.7
                    //let top = beforeScrollTop + window.innerHeight / 2 - self.clientHeight/1.7;
                    //self.style.position = "absolute";
                    //self.style.top = top + 'px';
                    //self.style.bottom = 'auto';
                    //设置输入框焦点
                    //this.$refs.textarea.focus();
                    //记录软键盘弹出后的滚动高度
                    //let focusedScrollTop = document.scrollingElement.scrollTop;
                    //向下位移focusedScrollTop - beforeScrollTop距离，使其尽量靠近软键盘
                    //self.style.transform = `translateY(${focusedScrollTop - beforeScrollTop}px)`;
                }
                //失焦时
                else {
                    //恢复基本样式
                    //self.style.position = 'fixed';
                    //self.style.top = 'auto';
                    //self.style.bottom = '2.45rem'; //待完善，这里需要处理一下IPhone X 底部非安全区距离
                    //作为输入框与键盘之间间隙的填充
                    //self.style.paddingBottom = '20px';
                    //去掉向下位移
                    //self.style.transform = 'translateY(0)';
                }
            },
            destroy(){
                let data = {content:this.Dcontent,imgs:this.Dimgs,nonymity:this.Dnonymity};
                this.$emit('blur',data); //失焦后把内容抛出，为toolbar显示
                this.$destroy();
            }
        },
        mounted() {
            Backdrop.show(this.destroy);
            //创建新编辑器时，应该先判断是否已存在一个编辑器
            let oldEditor = this.GetEditor();
            //存在则先销毁
            if(oldEditor) oldEditor.$destroy();
            let main = document.getElementsByClassName("comp-comment-editor");
            if(main && main.length > 0){
                document.body.removeChild(main[0]);
            }
            document.body.appendChild(this.$el);

            //保存对象
            this.SetEditor(this);

            //设置焦点
            this.SetFocus();

            //获取toolbar，如果存在，则隐藏
            let toolbar = this.GetToolbar();
            if(toolbar){
                toolbar.Hide();
            }

            //编辑器创建后抛出状态
            setTimeout(() => {
                this.$emit('show',1);
            }, 0);

            //修改评论 或上一次未发布成功 赋值
            this.Dcontent = this.content;
            this.Dnonymity = this.nonymity;
            if(this.imgs && this.imgs.length > 0){
                this.DshowUploader = 1; //有图片的话，默认显示上传组件
                this.Dimgs = this.imgs;
                this.$refs.uploader.initImglist(this.imgs);
            }
        },
        destroyed() {

            //移除DOM
            let parent = this.$el.parentNode;
            parent && parent.removeChild(this.$el);

            //编辑器移除后抛出状态
            this.$emit('close',1);

            //显示已存在的toolbar
            let toolbar = this.GetToolbar();
            if(toolbar){
                toolbar.Show();
            }
        }
    }
</script>
