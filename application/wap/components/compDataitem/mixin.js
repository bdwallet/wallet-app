import "./style";
export default {
    props:{
        data:{
            type:Object,
            default:{}
        },
        index:{
            type:Number
        }
    },
    // data(){
    //     return{
    //         // currentItem: {
    //         //     obj: {},
    //         //     index: 0
    //         // }, //当前操作对象
    //     }
    // },
    computed:{
        userInfo(){
            return this.$store.getters.userInfo;
        },
        //路由上的用户ID，用于个人主页业务处理 是否显示个人操作按钮等
        uid(){
            return this.$route.params.uid;
        },
        //标记是否为作者本人作品
        isAuthor(){
            return this.data.user_id == this.userInfo.user_id;
        },
        //标识是否为登录者本人主页
        isSelf(){
            return this.userInfo.user_id == this.uid && this.uid > 0;
        },
        //父级数据数组
        dataList(){
            return this.$parent.$parent.dataList;
        },
    },
    methods:{
        //跳转至文章详情页
        GotoDetail(){
            let query = {
                goanywhere: location.pathname
            };
            // type == 4 为公告
            // if(this.data.type == 4) this.$router.push({path: `/announce/detail/${this.data.id}`, query});
            if(this.data.type == undefined){ //交易所外评
                this.$router.push({path:`/extlevaluation/${this.data.id}`,query});
            }else{
                this.$router.push({path: `/detail/${this.data.type}/${this.data.id}`,query});
            }
        },
        //跳转到项目详情页
        GotoProject() {
            let path = {
                path: `/article/${this.data.item_id}`,
                query: {
                    pro: this.data.urrency || this.data.cn,
                    cname: this.data.cn,
                    score: this.data.score
                }
            };
            if(this.data.type == 5) //0：项目评级 5：交易所评级
                path.path = `/exchange/${this.data.item_id}`;
            this.$router.push(path);
        },
        // 进入热榜
        GotoHotlist() {
            let query = this.data.grade_top.split("|");
            this.$router.push({
                path: '/hotlist',
                query: {
                    tabs: query[0],
                    time: query[1]
                }
            })
        },
    },
    mounted(){
        // console.log("in compDataitemLicai2 => mounted()",'itemId',JSON.stringify(this.data));
    }
}
