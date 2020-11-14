<template>
    <div class="comment-page" style="padding-bottom:2.5rem;">
        <comp-comment-list ref="comment" :type="type" :rid="rid" :pid="pid" @response="GetData"/>
        
        <comp-comment-toolbar
            v-if="$route.name = 'comment'"
            :type="type"
            :rid="rid"
            :comment_data="Dcomment"
            :is_like="Dcomment.is_like"
            :is_collect="-1"
            :like_num="Dcomment.comment_like_num"
            :comment_num="0"
            placeholder="回复他：" />
    </div>
</template>

<script>
import {
    compCommentToolbar,
    compCommentList
} from "~components/comment";
export default {
    name: "comment",
    components: {
        compCommentList,
        compCommentToolbar
    },
    data() {
        return {
            Dcomment:{}, //评论数据
        };
    },
    computed: {
        // 文章id
        rid() {
            return this.$route.params.rid;
        },
        // 评论id
        pid() {
            return this.$route.params.pid;
        },
        type() {
            return this.$route.query.type;
        }
    },
    methods:{
        GetData(v){
            this.Dcomment = v;
        }
    },
    mounted() {
        Share.Ready();
    }
};
</script>
