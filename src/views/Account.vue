<template>
    <div>
        My Account
        <p>UID: {{ $store.state.user.uid }}</p>
        <p>Email: {{ $store.state.user.email }}</p>
    </div>
</template>

<script>
import store from '@/store';
// import { useStore } from 'vuex'
// import { onBeforeMount } from 'vue';
export default {
    name: 'Account',
    // setup() {
    //     const store = useStore()
    //     onBeforeMount(() => {
    //         store.dispatch('fetchUser')
    //     })
    // },
    mounted() {
        console.log('UID is: ' + store.state.user.uid)
    }
}
</script>

<style scoped>

</style>