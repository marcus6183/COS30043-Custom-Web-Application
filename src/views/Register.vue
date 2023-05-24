<template>
    <div class="container-fluid">
        <div class="register">
            <form class="registerForm" @submit.prevent="register">
                <h2>Register</h2>
                <div class="input-container mt-3 mb-4">
                    <input id="email" type="email" class="text-input" autocomplete="on" placeholder="Email" v-model="register_form.email">
                    <label class="label" for="email">Email</label>
                </div>
                <div class="input-container">
                    <input id="password" type="password" class="text-input" autocomplete="on" placeholder="Password" v-model="register_form.password">
                    <label class="label" for="password">Password</label>
                </div>
                <button class="registerBtn mt-4" type="submit">Register</button>
                <div class="registerText">
                    <span>Already have an account? Login <router-link class="link" :to="{ name: 'Login' }">here</router-link></span>
                </div>
            </form>
        </div>
        
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'Register',
    setup () {
        const register_form = ref({});
        const store = useStore();

        const register = () => {
            store.dispatch('register', register_form.value);
        }

        return {
            register_form,
            register
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

.register {
    background: #fff;
    border-radius: 10px;
    height: 400px;
    width: 360px;
    padding: 20px 40px;
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

/* Register button */
.registerBtn {
    background-color: var(--accentColor2);
    color: white;
    border: none;
    width: 280px;
    height: 50px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
}

.registerBtn:hover {
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