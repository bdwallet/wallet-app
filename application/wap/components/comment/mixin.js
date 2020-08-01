let VueEditor = undefined; //编辑器VUE对象
let VueToolbar = undefined; //工具栏对象
let VueList = undefined; //列表对象

window.ListArr = [];

export default {
    data(){
        return{
            test:9999
        }
    },
    computed:{
        href(){
            console.log("adsfasdf",location.href);
            return location.href;
        }
    },
    methods:{
        SetToolbar(v){
            VueToolbar = v;
        },
        SetEditor(v){
            VueEditor = v;
        },
        SetList(v){
            VueList = v;
            window.ListArr.push(v);
        },
        GetToolbar(v){
            return VueToolbar;
        },
        GetEditor(v){
            return VueEditor;
        },
        GetList(v){
            return VueList;
        },



        DelToolbar(v){
            VueToolbar = null;
        },
        DelEditor(v){
            VueEditor = null;
        },
        DelList(v){
            VueList = null;
        },
    }
}