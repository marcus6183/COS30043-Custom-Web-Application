import { createStore } from 'vuex'
import router from '@/router'
import { auth, db } from '@/firebase'
import { collection, doc, addDoc, setDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import Swal from 'sweetalert2'

const store = createStore({
    state: {
        user: null
    },
    mutations: {
        SET_USER (state, user) {
            state.user = user
        },
        CLEAR_USER (state) {
            state.user = null
        }
    },
    actions: {
        async login({ commit }, details) {
            const { email, password } = details
            let errMessage = ''
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            // Input validation
            if (!email) {
                errMessage = 'Please enter your email address'
            } else if (!emailRegex.test(email)) {
                errMessage = 'Please enter a valid email address'
            } else if (!password) {
                errMessage = 'Please enter a password'
            }

            // Returns if the input did not pass the validation
            if (errMessage) {
                Swal.fire({ title: 'Error', text: errMessage, confirmButtonColor: '#00bf63' })
                return
            }
          
            try {
                await signInWithEmailAndPassword(auth, email, password)
                commit('SET_USER', auth.currentUser)
                router.push('/')
            } catch (error) {
                switch (error.code) {
                    case 'auth/user-not-found':
                    Swal.fire({ title: 'Error', text: 'Email not found', confirmButtonColor: '#00bf63' })
                    break
                    case 'auth/wrong-password':
                    Swal.fire({ title: 'Error', text: 'Incorrect password', confirmButtonColor: '#00bf63' })
                    break
                    default:
                    Swal.fire({
                        title: 'Error',
                        text: 'There seems to be an error on our side. Sorry for the inconvenience',
                        confirmButtonColor: '#00bf63'
                    })
                }
            }
        },
        async register ({ commit }, details) {
            const { email, password, confirmPassword, name, contactNum, address } = details
            let errMessage = ''
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            let nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/
            let contactRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
            // Input validation
            if (!email) {
                errMessage = 'Please enter your email address'
            } else if (!emailRegex.test(email)) {
                errMessage = 'Please enter a valid email address'
            } else if (!password) {
                errMessage = 'Please enter a password'
            } else if (!confirmPassword) {
                errMessage = 'Please confirm your password'
            } else if (password !== confirmPassword) {
                errMessage = 'Passwords do not match'
            } else if (!name) {
                errMessage = 'Please enter your name'
            } else if (!nameRegex.test(name)) {
                errMessage = 'Name must only contain alphabets'
            } else if (!contactNum) {
                errMessage = 'Please enter your contact number'
            } else if (!contactRegex.test(contactNum)) {
                errMessage = 'Please enter a valid contact number (e.g. 0123456789)'
            } else if (!address) {
                errMessage = 'Please enter your address'
            }

            // Returns if the input did not pass the validation
            if (errMessage) {
                Swal.fire({ title: 'Error', text: errMessage, confirmButtonColor: '#00bf63' })
                return
            }

            try {
                await createUserWithEmailAndPassword(auth, email, password)
                    .then(async cred => {
                        await setDoc(doc(db, 'users', cred.user.uid), { // Passing cred.user.uid here to create a document in the "users" collection with a document ID equal to the user id in firebase authentication
                            name: name,
                            contactNum: contactNum,
                            address: address
                        })
                    })
                //Create user account in firestore here
                commit('SET_USER', auth.currentUser)
                router.push('/')
            } catch (error) {
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        Swal.fire({ title: 'Error', text: 'Email is already in use', confirmButtonColor: '#00bf63' })
                        break
                    case 'auth/invalid-email':
                        Swal.fire({ title: 'Error', text: 'Invalid email', confirmButtonColor: '#00bf63' })
                        break
                    case 'auth/operation-not-allowed':
                        Swal.fire({ title: 'Error', text: 'Operation is not allowed', confirmButtonColor: '#00bf63' })
                        break
                    case 'auth/weak-password':
                        Swal.fire({ title: 'Error', text: 'Weak password. Please choose another one', confirmButtonColor: '#00bf63' })
                        break
                    default:
                        console.log(error)
                        Swal.fire({
                            title: 'Error',
                            text: 'There seems to be an error on our side. Sorry for the inconvenience',
                            confirmButtonColor: '#00bf63'
                        })
                }
                return
            }
        },
        async logout ({commit}) {
            await signOut(auth)
            
            commit('CLEAR_USER')

            router.push('/')
        },

        fetchUser ({ commit }) {
            auth.onAuthStateChanged(async user => {
                if(user === null) {
                    commit('CLEAR_USER')
                } else {
                    commit('SET_USER', user)

                    if (router.isReady() && (router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/register')) {
                        router.push('/')
                    }
                }
            })
        }
    }
})

export default store