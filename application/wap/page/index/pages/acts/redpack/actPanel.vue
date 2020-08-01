<template>
	<div class="act-panel">
    <div class="tl">
      <div class="sprites-frame-bg4"></div>
      <div class="sprites-frame-bg3"></div>
      <div class="sprites-frame-bg1"></div>
    </div>
    <div class="sprites-frame-bg2 tr"></div>
    <div class="sprites-frame-bg5 bl"></div>
    <div class="sprites-frame-bg6 br"></div>
		<slot />
	</div>
</template>

<style lang="less">
	@marging:.2rem;
	.act-panel{
    position:relative;
		background: #FFE9E0;
    border-radius:.45rem;
    .com{
      position:absolute;
      display: flex;
    }
    .tl{
			.com;
			top: @marging;
			left: @marging;
			.sprites-frame-bg1{
				margin-left:-2rem;
				transform:rotate(180deg);
			}
    }
    .tr{
			.com;
			top: @marging;
			right: @marging;
    }
    .bl{
			.com;
			left: @marging;
			bottom: @marging;
    }
    .br{
			.com;
			right: @marging;
			bottom: @marging;
			transform:rotate(90deg);
    }
	}
</style>