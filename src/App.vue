<template>
  <div id="app">
    <div>
            <router-link active-class="" to="/airdrop">代币空投</router-link>
            <router-link active-class="" to="/collect">代币归集</router-link>
            <router-link active-class="" to="/create">创建代币</router-link>
            <router-link active-class="" to="/transform">单位转换</router-link>
        </div>
        <div>
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