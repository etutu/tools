<template>
  <div id="app">
    <div>
      <router-link active-class="" to="/airdrop">代币空投</router-link>
      <router-link active-class="" to="/collect">代币归集</router-link>
      <router-link active-class="" to="/create_token">创建代币</router-link>
      <router-link active-class="" to="/transform">单位转换</router-link>
      <router-link active-class="" to="/create_wallet">创建钱包</router-link>
    </div>
    <div>
      <router-link active-class="" to="/token_lock">代币锁定</router-link>
      <router-link active-class="" to="/locked_token">普通代币</router-link>
      <router-link active-class="" to="/locked_lp">LP代币</router-link>
      <router-link active-class="" to="/batch_check_balance">批量检查钱包余额</router-link>
    </div>
    <div style="margin-top: 50px;">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>
<style>
    a {
        margin: 0 20px;
        text-decoration: none;
    }
    h1 {
        color: red;
    }
    /* ul {
        float: left;
    } */

    li {
        list-style: none;
    }
</style>