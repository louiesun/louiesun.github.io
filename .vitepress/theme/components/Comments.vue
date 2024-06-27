<template>
  <p>Here should be the comments section. From here</p>
  <Giscus
    id="comments"
    repo="louiesun/louiesun.github.io"
    repoId="R_kgDOMOvc_A"
    category="Announcements"
    categoryId="DIC_kwDOMOvc_M4CgbNX"
    mapping="specific"
    term={{ Md5.hashStr(location.pathname) }}
    reactionsEnabled="1"
    emitMetadata="0"
    inputPosition="top"
    theme="preferred_color_scheme"
    lang="zh-CN"
  />
  <p>To here, But it May not Appear because of the Giscus API is not working or I use the wrong code. </p>
  <details>
    <summary>This is the code importing Giscus. </summary> 
    &lt;Giscus <br/>
    id=&quot;comments&quot;<br/>
    repo=&quot;louiesun/louiesun.github.io&quot;<br/>
    repoId=&quot;R_kgDOMOvc_A&quot;<br/>
    category=&quot;Announcements&quot;<br/>
    categoryId=&quot;DIC_kwDOMOvc_M4CgbNX&quot;<br/>
    mapping=&quot;specific&quot;<br/>
    term=\{\{ Md5.hashStr(location.pathname) \}\}<br/>
    reactionsEnabled=&quot;1&quot;<br/>
    emitMetadata=&quot;0&quot;<br/>
    inputPosition=&quot;top&quot;<br/>
    theme=&quot;preferred_color_scheme&quot;<br/>
    lang=&quot;zh-CN&quot;<br/>
    /&gt;<br/>
    <br/>
    and in the script part:<br/>
    <br/>
    import {Md5} from 'ts-md5';<br/>
    import { onContentUpdated, useRouter } from &quot;vitepress&quot;;<br/>
    import Giscus from '@giscus/vue';<br/>
  </details>
</template>
<script lang="ts" setup>
import {Md5} from 'ts-md5';
import { onContentUpdated, useRouter } from "vitepress";
import Giscus from '@giscus/vue';

onContentUpdated(() => {
  

});
</script>
<style scoped></style>
