<template>
    <nav class="navbar navbar-expand-lg navbar-light sticky-top">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <img class="logoImage" src="@/assets/images/logo_img.png" alt="">
                <span class="logo1">CARROT</span><span class="logo2">KEEBS</span>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">HOME</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: 'ProductView' }">PRODUCTS</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" :to="{ name: 'Cart' }">CART</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.user">
                        <router-link class="nav-link" :to="{ name: 'Account'}">ACCOUNT</router-link>
                    </li>
                    <li class="nav-item" v-if="$store.state.user">
                        <div @click="$store.dispatch('logout')">
                            <router-link class="nav-link" :to="{ name: 'HomeView'}">LOGOUT</router-link>
                        </div>
                    </li>
                    <li class="nav-item" v-else>
                        <router-link class="nav-link" :to="{ name: 'Login'}">LOGIN</router-link>
                    </li>
                </ul>
            </div>
            
        </div>
    </nav>
</template>

<script>
import { onBeforeMount } from 'vue';
import { useStore } from 'vuex'

export default {
    name: 'NavBar',

    setup() {
        const store = useStore()

        onBeforeMount(() => {
        store.dispatch('fetchUser')
        })
    }
}
</script>

<style>
/*Logo Styles*/
.logoImage {
    width: 50px;
    height: 60px;
}

.navbar {
    background: #fff;
}

a.navbar-brand {
    display: flex;
    margin: 0;
    padding: 10px;
    font-size: 20pt;
    align-items: center;
    justify-content: center;
    font-family: ConcertOne, sans-serif;
}

.logo1 {
    color: black;
}

.logo2 {
    color: #00bf63;
}

/*Navigation bar links*/
.nav-item {
    margin: 20px;
}

.nav-link {
    font-size: 12pt;
    color: black;
    transition: all 0.2s;
    position: relative;
}

.nav-link::after {
    content: '';
    opacity: 0;
    transition: all 0.3s;
    height: 3px;
    width: 0%;
    background-color: #00bf63;
    position: absolute;
    bottom: 0;
    left: 0;
}

.nav-link:hover::after {
    opacity: 1;
    width: 100%;
}

.navbar .nav-link.router-link-exact-active {
    color: black;
}
</style>