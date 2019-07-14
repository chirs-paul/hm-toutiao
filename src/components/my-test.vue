<template>
    <div class="container">
        <p><slot name="content" :test="innerData">内容</slot></p>
        <p><slot name="bottom">底部</slot></p>
    </div>
</template>

<script>
export default {
  data () {
    return {
      innerData: '组件内部数据'
    }
  }
}
</script>

<style  scope style="less">

</style>
