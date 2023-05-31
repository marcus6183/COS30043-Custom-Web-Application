<template>
    <div class="loading" v-if="isLoading">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
    <div :class="'container-fluid row ' + (isLoading ? '':'show')">
        <div class="left col-lg-9 col-md-8 p-3">
            <div class="orders p-3">
                <div class="titleText p-2">
                    <h3>Order History</h3>
                </div>
                <div class="accordion accordion-flush" id="accordionFlushExample">
                    <Order v-for="(order, index) in orders" :key="index" :index="index" :orderObject="order"></Order>
                </div>
            </div>
        </div>
        <div class="right col-lg-3 col-md-4 p-3">
            <div class="userDetails p-3">
                <div class="titleText p-2">
                    <h3>Account</h3>
                    <button class="editButton" @click="editProfile()">
                        <img src="@/assets/icons/icons8-edit-24.png" alt="">
                    </button>
                </div>
                <div class="name">
                    <span class="label">Name: </span>
                    <span class="data">{{ userDetails.name }}</span>
                </div>
                <div class="contact">
                    <span class="label">Contact: </span>
                    <span class="data">{{ userDetails.contactNum }}</span>
                </div>
                <div class="address">
                    <span class="label">Address: </span>
                    <span class="data">{{ userDetails.address }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '@/store'
import { db } from '@/firebase'
import { collection, doc, onSnapshot, getDoc } from 'firebase/firestore'
import Order from '@/components/Order.vue'

export default {
    name: 'Account',
    components: {
        Order
    },
    data() {
        return {
            isLoading: true,
            userDetails: Object,
            orders: []
        }
    },
    mounted() {
        this.getUserDetails()
        console.log('UID is: ' + store.state.user.uid)
        onSnapshot(collection(db, 'users/' + store.state.user.uid + '/orders'), (querySnapshot) => {
            const tempOrders = []
            if (querySnapshot.empty) {
                this.isLoading = false
                console.log("Orders is empty")
            } else {
                querySnapshot.forEach((doc) => {
                    const orderObject = {
                        id: doc.id,
                        orderDateTimestamp: doc.data().orderDate,
                        orderTotal: doc.data().orderTotal,
                        status: doc.data().status,
                        orderedItems: doc.data().orderItems
                    }
                    tempOrders.push(orderObject)
                })
                this.orders = tempOrders
                this.isLoading = false
            }
        });
    },
    methods: {
        async getUserDetails() {
            // Method to get user details by user id
            const docRef = doc(db, "users", store.state.user.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                this.userDetails = docSnap.data()
            } else {
                console.log("User doesn't exists")
            }
        },
        editProfile() {
            //TOBEIMPLEMENTED
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.loading {
	height: calc(100vh - 240px);
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.container-fluid {
    min-height: calc(100vh - 240px);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.show {
    opacity: 1;
}

.orders, .userDetails {
    height: fit-content;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.titleText {
    display: flex;
    justify-content: space-between;
}

/* Accordion */
.accordion {
    overflow: hidden;
    border-radius: 5px;
    --bs-accordion-btn-active-icon: url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e);
}

/* User Details container */
.name, .contact, .address {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0px 8px;
}

.label, .data {
    font-weight: bold;
}

.data {
    color: var(--accentColor2);
    text-align: end;
}

.editButton {
    background: transparent;
    border: none;
    padding: 0px;
    cursor: pointer;
}

.editButton:hover img {
    content: url("@/assets/icons/icons8-edit-24-green.png");
}
</style>