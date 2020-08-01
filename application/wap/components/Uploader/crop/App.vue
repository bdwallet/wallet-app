<template>
	<div class="head-croper">
		<div class="head-croper-container" ref="container">
			<div class="head-croper-close" @click.stop="close"><svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></div>
			
			<div class="head-croper-body" ref="previewBody" :style="{height:previewHeight}">
				<div class="head-croper-main" ref="main">
					<div class="head-croper-area" ref="area" :style="{width:areaWidth,height:areaHeight}"></div>
					<i class="euc-mask" v-for="(v,k) in ui.side" :key="k" :class="'euc-mask-'+v.k" :ref="'euc-mask-'+v.k"></i>
					<img :src="src" ref="img" style="z-index:-1;"/>
				</div>
			</div>
			
			<div class="head-croper-footer"><ui-button type="primary"  @click.stop="save" :ripplet="false" class="btn">确定</ui-button></div>
		</div>
	</div>
</template>
<script src="./mixin.js"></script>
<style lang="less" src="./style.less"></style>

