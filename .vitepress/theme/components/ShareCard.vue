<template>
  <div class="shareCard">
    <h1 class="title">
      <span>Hi, I'm Louiesun. 👋</span>
    </h1>
    <p class="description">
      A student.
    </p>
    <h1 class="title">My other Accounts. </h1>
    <div class="description">
      <div class="Links">
        <a href="https://github.com/louiesun" target="_blank">
          <img src="/AccountsLinksIcon/GithubIcon.svg" width="30" height="30" class="avator" />
        </a>
        <a href="https://liaoyuan1949.site/u/louiesun/summary" target="_blank">
          <img src="/AccountsLinksIcon/bu2021.svg" width="30" height="30" class="avator" />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>
<style scoped>
.shareCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  text-align: center;
}

.title {
  display: flex;
  align-items: center;
  font-size: 2.2em;
  font-weight: bold;
}

.description {
  margin: 1em 0;
}

.Links {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
}

.avator {
  border-radius: 50%;
  border: 1px solid var(--vp-avator-border);
}

@keyframes avator-transform {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-360deg);
  }
}

.avator:hover {
  animation: 5s linear 0s infinite avator-transform;
}
</style>
