<template>
	<div class="ext-croper">
		<div class="ext-croper-container" ref="container">
			<div class="ext-croper-close" @click="close"><svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></div>
			<div class="ext-croper-header">编辑头像<p>调整头像尺寸和位置</p></div>
			<div class="ext-croper-body">
				<div class="ext-croper-main" ref="main">
					<div class="ext-croper-area" ref="area" :style="{width:areaWidth,height:areaHeight}">
						<span class="euc-focus">+</span>
						<i class="euc-pos euc-side" v-for="(v,k) in ui.side" :key="k" :class="'euc-side-'+v.k" :data-pos="v.p"></i>
						<i class="euc-pos euc-dot" v-for="(v,k) in ui.dot" :key="k" :class="'euc-dot-'+v.k" :data-pos="v.p"></i>
					</div>
					<i class="euc-mask" v-for="(v,k) in ui.side" :key="k" :class="'euc-mask-'+v.k" :ref="'euc-mask-'+v.k"></i>
					<img :src="src" ref="img"/>
				</div>
			</div>
			
			<div class="ext-croper-footer"><ui-button type="primary"  @click="save" :ripplet="false">确定</ui-button></div>
		</div>
	</div>
</template>
<script src="./mixin"></script>
<style lang="less" src="./style"></style>