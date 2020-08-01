/// 全局后台接口路径

import Global from '~script/global';
//Global.host
let php = "/weixin/apply.php?act=";

if (Global.isApp && Global.isPro)
  php = Global.host + php;


export default {
  //h5接口
  apply: {
    get_signature: `${php}get_signature`, //post 获取jssdk_ticket
    // 以前的微信登录 废弃 get_userinfo: `${php}get_userinfo`, //post code登录，换取用户信息
    check_level: `${php}check_level`, //post 校验用户权限
    check_grade: `${php}check_grade`, //post 校验用户是否评级过
    //save_grade: `${php}save_grade`, //post 保存评级文章
    issue_save: `${php}issue.save`,//post 发布内容 params:type(1:评级2:爆料3:话题4:公告5:交易所)
    update_grade: `${php}update_grade`, //post 修改评级文章
    del_grade: `${php}del_grade`, //post 删除评级文章
    //get_currency_list: `${php}get_currency_list`,//post 获取账单明细
    get_list: `${php}get_list`, //get 获取项目列表
    search_item: `${php}search_item`, //get 搜索项目列表
    get_grade_list: `${php}get_grade_list`, //get 获取评级文章列表
    item_info:`${php}item_info`, //get 获取项目详情
    rand_item:`${php}rand_item`, //get 获取项目详情页的推荐列表

    list_get: `${php}list.get`, //get 获取数据列表 @scene 1：获取首页推荐列表 2：首页评级列表 3：首页爆料列表
    get: `${php}get`, //get //获取项目信息
    get_grade: `${php}get_grade`, //get 获取评级文章详情
    contentInfo_get: `${php}contentInfo.get`, //获取内容详情
    get_user_currency: `${php}get_user_currency`, //post 获取用户数据
    get_users: `${php}get_users`, //post 获取用户数据
    get_mission: `${php}get_mission`, //post 获取用户数据
    // grade_like: `${php}grade_like`, //POST 评级点赞 废弃
    get_like_user_photo: `${php}get_like_user_photo`, //get 获取点赞人头像
    get_grade_publicity: `${php}get_grade_publicity`, //get 获取文章宣传信息
    is_user_attention: `${php}is_user_attention`, //get 判断用户是否关注
    get_meg_list: `${php}get_meg_list`, //get 获取通知消息
    send_sms: `${php}send_sms`, //post 发送验证码
    binding_phone: `${php}binding_phone`, //post 绑定手机号
    unbinding_phone: `${php}unbinding_phone`, //post 解绑手机号
    save_user_apply: `${php}save_user_apply`, //post 申请超级评审员，表单提交
    get_user_apply: `${php}get_user_apply`, //get 获取申请评审员提交内容
    upload_img: `${php}upload_img`, //post 图片上传
    upload_base_img: `${php}upload_base_img`, //post 图片上传 Base64
    del_img: `${php}del_img`, //post 删除图片
    getHotWord: `${php}get_hot_word`, //get 获取热门项目
    update_search: `${php}update_search`, //post 更改搜索关键词
    user_sign: `${php}user_sign`, //post 用户签到
    mission_share: `${php}mission_share`, //post 任务分享接口
    grade_usertop: `${php}grade_usertop`, //post 个人中心评级置顶
    get_levelequity_byuser: `${php}get_levelequity_byuser`, //post 获取当前用户的等级和权益
    is_old_user: `${php}is_old_user`, //post 检测是否为老用户
    get_validate: `${php}get_validate`, //post 获取滑动验证码
    check_validate: `${php}check_validate`, //post 校验验证码并发送短信
    user_login: `${php}user_login`, //post 用户登录 用户为注册 先注册在登陆
    user_logout: `${php}user_logout`, //post 退出登录
    set_pwd: `${php}set_pwd`, //post 用户设置密码，修改密码
    set_user_info: `${php}set_user_info`, //post 修改用户信息
    binding_wx: `${php}binding_wx`, //post 绑定、解绑微信
    check_pay: `${php}check_pay`, // post 支持密码验证
    get_invite: `${php}get_invite`, // get 获取邀请相关数据
    get_invite_list: `${php}get_invite_list`, // get 获取邀请列表数据
    apply_input: `${php}apply_input`, // post 申请充值地址
    get_exp_list: `${php}get_exp_list`, // get 获取经验明细
    
    //钱包中心
    get_burse: `${php}get_burse`, // post 获取钱包数据get_address
    get_stay_list: `${php}get_stay_list`, // get 获取待释放列表
    get_address: `${php}get_address`, // get 获取提现地址列表
    save_address: `${php}save_address`, // post 保存、修改提现地址
    del_address: `${php}del_address`, // post 删除提现地址
    get_available: `${php}get_available`, // get 获取可以的黑钻数量
    output_apply: `${php}output_apply`, // post 提现申请
    get_record: `${php}get_record`, // get 获取提现\充值记录
    update_eth: `${php}update_eth`, // get 更新ETH充值记录
    
    //实名认证
    do_idcert: `${php}do_idcert`, // get 获取提现\充值记录
    get_idcert: `${php}get_idcert`, // get 获取提现\充值记录
    
    // 赞赏
    add_give: `${php}add_give`, // post 赞赏
    get_give_list: `${php}get_give_list`, //获取赞赏列表
    
    //意见反馈
    feedback_get_cate: `${php}feedback.get_cate`, // get 获取反聩分类
    feedback_submit: `${php}feedback.submit`, // post 提交反馈
    
    //举报
    report_get_cate: `${php}reprot.get_cate`, // get 获取举报分类
    reprot_submit: `${php}reprot.submit`, // post 提交举报
    
    // 资讯、活动、帮助宝典
    news_get_list: `${php}news.get_list`, // post 获取 资讯、活动、帮助宝典列表
    news_get_detail: `${php}news.get_detail`, // get  获取详情
    news_do_like: `${php}news.do_like`, //  post 资讯,活动,帮助 点赞和评论点赞
    
    // 项目公告
    itemnoti_get_list: `${php}itemnoti.get_list`, //  post 获取公告列表
    itemnoti_get_new: `${php}itemnoti.get_new`, //post 获取 项目最新官方入驻
    itemnoti_located_list: `${php}itemnoti.located_list`, // post 获取项目方入驻项目列表
    itemnoti_get_detail: `${php}itemnoti.get_detail`, // get 获取 公告详情
    itemnoti_check_update: `${php}itemnoti.check_update`, // get 获取项目方简写
    itemnoti_update: `${php}itemnoti.update`, // post 提交发布公告
    itemnoti_del: `${php}itemnoti.del`, // post 删除公告
    
    common_like: `${php}common.like`, // post 点赞 （资讯，活动，帮助）（项目公告）以及其评论点赞
    
    // banner
    banner_get_list: `${php}banner.get_list`, // post 获取 Banner
    operation_get_list: `${php}operation.get_list`,// post 获取葫芦位数据
    
    
    //评论相关
    get_comment_list: `${php}common.get_comment_list`, //post  获取评论列表
    save_comment: `${php}common.save_comment`, // post 添加评论
    del_comment: `${php}del_comment`, //post 评级、爆料 删除评论
    del_comment2: `${php}common.del_comment`, //post 评级、爆料 删除评论
    // like_comment: `${php}comment_like`, //post 评级、爆料 评论点赞  废弃
    
    // 通知消息相关
    unread_messages: `${php}member.get_message`, //获取是否还有未读消息
    unread_messages_numlist: `${php}member.get_count`, //获取是否还有未读消息
    
    // 防薅羊毛，答题
    answer_question: `${php}answer.question`, // post
    
    // 校验用户是否可以提现
    check_output: `${php}check_output`, // post
    
    // 关注、粉丝、收藏、精评
    get_att_grade_list: `${php}get_att_grade_list`, //get 获取推送关注 获取关注内容列表
    update_att: `${php}update_att`, //post 添加关注
    update_coll: `${php}update_coll`, // post 收藏文章
    get_att_list: `${php}get_att_list`, // get 关注列表/粉丝列表
    get_coll_list: `${php}get_coll_list`, // get 收藏列表
    
    // 热榜
    get_hot_grade: `${php}get_hot_grade`, // get 获取排行榜
    
    // 快讯
    get_newsletter: `${php}newsletter.get_list`, // get 获取快讯
    newsletter_like: `${php}newsletter.like`, // post 利好 利空
    
    // 每日锦鲤
    get_node_gift: `${php}get_node_gift`, //get 获取节点奖励列表
    
    // 付费置顶
    get_top: `${php}get_top`, // get 获取付费置顶数据
    add_top: `${php}add_top`, // post 提交置顶数据
    
    // 交易所评级
    get_bourse_info: `${php}bourse.get_bourse`, // get 获取交易所简介
    get_bourse_list: `${php}bourse.get_grade_list`, // get 获取交易所评级列表
    bourse_up_grade: `${php}bourse.update_grade`, // post 更改交易所评级内容
    get_bourse_extledetail: `${php}bourse.media_grade_info`, // get 获取外部测评详情
    get_bourse_media_list: `${php}bourse.get_media_list`, // post 获取外部测评列表
    get_bourse_gradecount: `${php}bourse.grade_count`, // get 获取评级分类数据
    
    // 交易所评级相关
    get_search_label:`${php}bourse.get_search_label`, // get 获取交易所排序类型标签

    //年终盘点
    YearlyStatistics:`${php}YearlyStatistics.get`, // get 获取2019年总数据
    
    // 理财支付接口
    finance_addBill: `${php}finance.addBill`, // POST 提交理财购买数据
    
    //新春活动相关接口
    // 'add_chance': `${php}add_chance`,//获得机会
    // 'get_chance_list': `${php}get_chance_list`,//机会列表 get
    // 'open_chance': `${php}open_chance`,//抽卡 post
    // 'add_gift': `${php}add_gift`,//集卡成功后创建礼品 post
    // 'open_gift': `${php}open_gift`,//打开礼物 post
    // 'check_EOS': `${php}check_EOS`,// post
    // 'check_JT': `${php}check_JT`,// post
    // 'get_user_gift': `${php}get_user_gift`,//get 获取他人奖品
  }
}
