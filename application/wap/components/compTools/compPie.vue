<template>
	<div class="comp-pie">
		<div class="canvasContent">
			<ul class="legend">
				<li v-for="(item,index) in data" :key="item">
					<i :style="{'background-color': colors[index]}"></i><span>{{item.name}}&nbsp;&nbsp;{{((data[index].value/total)*100).toFixed(2)+'%'}}</span>
				</li>
			</ul>
			<div class="canvasbox">
				<canvas class="canvas" ref="canvas" width="504" height="504">
				您的浏览器暂不支持canvas
				</canvas>
			</div>
		</div>
	</div>

</template>
<script type="text/javascript">
	export default {
		name:'compPie',
		data(){
			return {
				data:[],
				ctx:"",
				colors:['#00BDD0','#EBBE63','#DB7B55','#BDD090','#61B3D3','#B7B6E2','#A1887F','#607D8B'],
				render: 0,
			}
		},
		props:{
			result:{
				default:{}
			}
		},
		watch:{
			result(val){
				this.data = val;
				this.ctx.clearRect(0,0,504,504);
				this.pie()
			},
		},
		computed:{
			total(){
				let totalNum = 0;
				this.data.forEach((item,index)=>{
					totalNum +=+item.value
				});
				return totalNum;
			}
		},
		methods:{
			// 绘制 饼状图
			pie(){
				let start=0;
				let end=0;
				for(let i=0;i<this.data.length;i++){
					this.ctx.beginPath();    //开始路径
					this.ctx.moveTo(84*3,84*3);
					end += (this.data[i].value/this.total)*2*Math.PI;
					this.ctx.lineWidth = 1;
					this.ctx.strokeStyle = "white";
					this.ctx.fillStyle = this.colors[i];
					this.ctx.arc(84*3,84*3,64*3,start,end);
					this.ctx.fill();
					this.ctx.closePath();
					this.ctx.stroke();
					start = end;
				}
			},
		},
		mounted(){
			let c=this.$refs.canvas;
			this.ctx=c.getContext("2d");
			this.data = this.result;
			// 清空整个画布
			this.ctx.clearRect(0,0,504,504);
			// 数据存在 绘制饼状图
			this.data && this.pie()
		}
	}
</script>
<style lang="less">
	.comp-pie{
		width: 100%;
		margin-top: 0.9rem;
		.title{
			font-size: 0.7rem;
			font-weight: bold;
			padding-left: 30px;
		}
		.canvasContent{
			width: 100%;
			display: flex;
			justify-content: space-around;
			.canvasbox{
				 width: 8.4rem;
				 height: 8.4rem;
				.canvas{
					transform: scale(0.333) translate(-100%,-100%);
				}
			}
			.legend{
				margin: auto 0;
				font-size: 0.7rem;
				li{
					line-height: 1.5;
					margin-right: 4px;
					span{
						line-height: 1;
					}
					i{
						width: 8px;
						height: 8px;
						display: inline-block;
						vertical-align: middle;
						margin-right: 4px;
					}
				}
			}
		}

	}
</style>
