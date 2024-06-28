<template>
  <footer>
    By
    <a href="https://github.com/louiesun/" target="_blank" title="Author"
      >louiesun</a>
    | Copyright © 2024-{{ date }} | GPLv3&GFDL License 
    <br/>
     <a href="https://github.com/louiesun/louiesun.github.io" target="_blank" title="SourceCode"
      >源码</a>就是我的备案
  </footer>
</template>
<script lang="ts" setup>
const date = new Date().getFullYear();
</script>
<style scoped>
footer {
  text-align: center;
  position: flex;
  width: 100%;
  bottom: 0px;
  padding: 0 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
}
a {
  color: var(--vp-c-brand);
  font-weight: bold;
}
a:hover {
  text-decoration: none;
  color: var(--vp-c-hover);
}
</style>
