export default {
  apply:{
    get_signature:"/weixin/apply.php?act=get_signature", //post 获取jssdk_ticketet_signature", //post 获取jssdk_ticket
    get_userinfo:"/weixin/apply.php?act=get_userinfo", //post code登录，换取用户信息
    get_figure_list:"/weixin/apply.php?act=get_figure_list",//get 获取人物列表
    get_figure:"/weixin/apply.php?act=get_figure",//get 获取人物详情页
    get_figure_label_list:"/weixin/apply.php?act=get_figure_label_list",//get 获取人物标签
    figure_grade_like:"/weixin/apply.php?act=figure_grade_like",//get 人物评级点赞
    save_figure_grade:"/weixin/apply.php?act=save_figure_grade",//post 发布人物评级 
    is_user_attention:'/weixin/apply.php?act=is_user_attention',//get 获取关注列表
    check_user_figure_grade:'/weixin/apply.php?act=check_user_figure_grade',//get 检测用户是否评价过
    share_figure_grade:'weixin/apply.php?act=share_figure_grade',//post 统计分享
  }
}
