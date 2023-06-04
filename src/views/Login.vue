<template>
    <div class="container-fluid">
        <div class="login">
            <form class="loginForm" novalidate @submit.prevent="login">
                <h2>Login</h2>
                <div class="input-container mt-3 mb-4">
                    <input id="email" type="email" class="text-input" autocomplete="on" placeholder="Email" v-model="login_form.email">
                    <label class="label" for="email">Email</label>
                </div>
                <div class="input-container">
                    <input id="password" type="password" class="text-input" autocomplete="on" placeholder="Password" v-model="login_form.password">
                    <label class="label" for="password">Password</label>
                </div>
                <button class="loginBtn mt-4" type="submit">Login</button>
                <div class="registerText">
                    <span>Don't have an account? Register <router-link class="link" :to="{ name: 'Register' }">here</router-link></span>
                </div>
            </form>
        </div>
    </div>
   
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
    setup () {
        const login_form = ref({});
        const store = useStore();

        const login = () => {
            store.dispatch('login', login_form.value);
        }

        return {
            login_form,
            login,
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

h2 {
    font-weight: bold;
}

.container-fluid {
    height: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login {
    background: #fff;
    border-radius: 10px;
    height: 400px;
    width: 360px;
    padding: 20px 40px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

/* Custom input field with label */
/* Tutorial link: https://www.youtube.com/watch?v=7yXUfcujpsk */
.input-container {
    width: 280px;
    position: relative;
}

.label {
    position: absolute;
    left: 10px;
    top: 14px;
    transition: all 0.2s;
    padding: 0 2px;
    z-index: 1;
    color: black;
}

.text-input {
    padding: 0.8rem;
    width: 100%;
    height: 100%;
    border: 3px solid black;
    border-radius: 5px;
    font-size: 18px;
    outline: none;
    transition: all 0.3s;
}

.label::before {
    content: "";
    height: 5px;
    position: absolute;
    left: 0;
    top: 10px;
    width: 100%;
    z-index: -1;
}

.text-input:focus {
    border: 3px solid var(--accentColor1);
}

.text-input:focus + .label, 
input:not(:placeholder-shown).text-input + .label{
    top: -20px;
    
    color: var(--accentColor1);
    font-size: 14px;
}

.text-input::placeholder {
    font-size: 16px;
    opacity: 0;
    transition: all 0.3s;
}

.text-input:focus::placeholder {
    opacity: 1;
    animation-delay: 0.2s;
}

/* Login button */
.loginBtn {
    background-color: var(--accentColor2);
    color: white;
    border: none;
    width: 280px;
    height: 50px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
}

.loginBtn:hover {
    background-color: var(--accentColor1);
}

/* Register text */
.registerText {
    margin-top: 80px;
    width: 100%;
 }

.link {
    color: var(--accentColor1);
}

.link:hover {
    color: var(--accentColor2);
}
</style>