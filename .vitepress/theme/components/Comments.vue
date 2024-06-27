<template>
  <p>The comments will be ok. </p>
  <!--
  <Giscus id="comments" repo="louiesun/louiesun.github.io" repoId="R_kgDOMOvc_A" category="Announcements"
    categoryId="DIC_kwDOMOvc_M4CgbNX" mapping="pathname" reactionsEnabled="1" emitMetadata="0"
    inputPosition="top" theme="preferred_color_scheme" lang="zh-CN" />
    -->
</template>
<script lang="ts" setup>
import { Md5 } from 'ts-md5';
import { onContentUpdated, useRouter } from "vitepress";
import Giscus from '@giscus/vue';



onContentUpdated(() => {
});
</script>
<style scoped></style>
