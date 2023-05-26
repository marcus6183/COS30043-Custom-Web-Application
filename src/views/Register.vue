<template>
    <div class="container-fluid row">
        <div class="register col-8 col-sm-7 col-md-8 col-lg-7 col-xl-6 col-xxl-5">
            <form class="registerForm" novalidate @submit.prevent="register">
                <div class="row">
                    <div class="col-12 mb-4">
                        <h2>Register</h2>
                    </div>
                    <div class="first col-md-6">
                        <div class="input-container mb-4">
                            <input id="email" type="text" class="text-input" autocomplete="on" placeholder="Email" v-model="register_form.email">
                            <label class="label" for="email">Email</label>
                        </div>
                        <div class="input-container mb-4">
                            <input id="password" type="password" class="text-input" autocomplete="on" placeholder="Password" v-model="register_form.password">
                            <label class="label" for="password">Password</label>
                        </div>
                        <div class="input-container mb-4">
                            <input id="confirmPassword" type="password" class="text-input" autocomplete="off" placeholder="Confirm Password" v-model="register_form.confirmPassword">
                            <label class="label" for="confirmPassword">Confirm Password</label>
                        </div>
                    </div>
                    <div class="second col-md-6">
                        <div class="input-container mb-4">
                            <input id="name" type="text" class="text-input" autocomplete="on" placeholder="Name" v-model="register_form.name">
                            <label class="label" for="name">Name</label>
                        </div>
                        <div class="input-container mb-4">
                            <input id="contactNum" type="text" class="text-input" autocomplete="on" placeholder="Contact number" v-model="register_form.contactNum">
                            <label class="label" for="contactNum">Contact number</label>
                        </div>
                        <div class="input-container addressCont mb-4">
                            <textarea id="address" type="text" class="text-input" autocomplete="on" placeholder="Address" v-model="register_form.address"></textarea>
                            <label class="label" for="address">Address</label>
                        </div>
                    </div>
                    <div class="third col-12">
                        <button class="registerBtn" type="submit">Register</button>
                        <div class="loginText">
                            <span>Don't have an account? Register <router-link class="link" :to="{ name: 'Register' }">here</router-link></span>
                        </div>
                    </div>
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
    height: auto;
    /* width: 80%; */
    padding: 20px 40px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.first, .second, .third {
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Custom input field with label */
/* Tutorial link: https://www.youtube.com/watch?v=7yXUfcujpsk */
.input-container {
    width: 90%;
    height: 50px;
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
input:not(:placeholder-shown).text-input + .label,
textarea:not(:placeholder-shown).text-input + .label{
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

/* Different height for address input field */
.addressCont {
    height: 100px;
}

/* Register button */
.registerBtn {
    background-color: var(--accentColor2);
    color: white;
    border: none;
    width: 45%;
    height: 50px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
}

.registerBtn:hover {
    background-color: var(--accentColor1);
}

/* Register text */
.loginText {
    margin-top: 20px;
    width: 100%;
 }

.link {
    color: var(--accentColor1);
}

.link:hover {
    color: var(--accentColor2);
}
</style>