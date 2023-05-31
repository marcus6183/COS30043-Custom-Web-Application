<template>
    <div class="loading" v-if="isLoading">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
    <div :class="'container-fluid row ' + (isLoading ? '':'show')">
        <div class="left col-lg-9 col-md-8 p-3">
            <div class="cart p-3">
                <div class="d-flex justify-content-between align-items-center p-2">
                    <h3>Shopping Cart</h3>
                    <h3>{{ cartItems.length }} items</h3>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col" class="col-1">Product</th>
                                <th scope="col" class="col-6"></th>
                                <th scope="col" class="col-1">Price</th>
                                <th scope="col" class="col-2">Quantity</th>
                                <th scope="col" class="col-2">Subtotal</th>
                                <th scope="col" class="col-1">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in cartItems" :key="index">
                                <CartItem :itemObject="item"></cartitem>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="right col-lg-3 col-md-4 p-3">
            <div class="totals p-3">
                <div class="pt-2 pb-2">
                    <h3>Totals</h3>
                </div>
                <div class="items">
                    <span class="label">Items:</span>
                    <span class="amount">RM{{ getTotals }}</span>
                </div>
                <div class="shipping">
                    <span class="label">Shipping:</span>
                    <span class="amount">RM{{ shippingCost.toFixed(2) }}</span>
                </div>
                <hr class="divider">
                <div class="totalAmount">
                    <span class="label">Total Amount:</span>
                    <span class="amount">RM {{ (Number(getTotals) + shippingCost).toFixed(2) }}</span>
                </div>
                <button class="placeOrderBtn" @click="populateFirestore">Place Order</button>
            </div>
        </div>
    </div>
</template>

<script>
import CartItem from '@/components/CartItem.vue';
import store from '@/store';
import { onSnapshot, doc, getDoc, deleteDoc, setDoc, updateDoc, collection} from "firebase/firestore";
import { db } from '@/firebase';

export default {
    name: 'Cart',
    components: {
        CartItem
    },
    data() {
        return {
            products: [],
            cartItems: [],
            shippingCost: 5,
            isLoading: true
        }
    },
    mounted() {
        onSnapshot(collection(db, 'users/' + store.state.user.uid + '/cart'), (querySnapshot) => {
            const tempCart = [];

            if (querySnapshot.empty) {
                this.cartItems = [];
                this.isLoading = false;
                console.log("Cart is empty");
            } else {
                this.cartEmpty = false;

                const promises = [];

                querySnapshot.forEach((doc) => {
                const promise = this.getProductDetails(doc.data().prodId)
                    .then(tempObject => {
                        tempObject.id = doc.id;
                        tempObject.prodId = doc.data().prodId;
                        tempObject.quantity = doc.data().qty;
                        tempObject.dateAdded = doc.data().dateAdded;
                        tempCart.push(tempObject);
                    })
                    .catch(error => {
                        console.log(error);
                    });

                promises.push(promise);
                });

                Promise.all(promises)
                .then(() => {
                    this.cartItems = tempCart;
                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error);
                });
            }
        });
    },
    methods: {
        async getProductDetails(prodId) {
            // Fetch document in products collection by document product ID (also the document ID)
            const docRef = doc(db, 'products', prodId)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                const productDetails = {
                    name: docSnap.data().name,
                    price: docSnap.data().price,
                    imgURL: docSnap.data().imgURL,
                    stock: docSnap.data().stock
                }
                return productDetails
            }else{
                console.log("Document with id of: " + prodId + "doesn't exists")
                return false
            }
        },
    },
    computed: {
        getTotals() {
            let total = 0
            this.cartItems.forEach(item => {
                total += item.price * item.quantity
            })
            return total.toFixed(2)
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
    min-height: 100vh;
    opacity: 0;
	transition: opacity 0.5s ease;
}

.show {
    opacity: 1;
}

.cart, .totals {
    height: fit-content;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.totals h3 {
    border-bottom: 3px solid var(--accentColor1);
}

th {
    text-align: start;
    vertical-align: middle;
}

/* .imgCont {
    width: 100px;
    height: 100px;
    background-color: #fff;
    border: 1px solid grey;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.imgCont img {
    width: 100%;
    height: auto;
    object-fit: cover;
    margin-right: 20px;
}

.wrapper {
    height: fit-content;
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 5px;
    border: 1px solid var(--accentColor1);
} 
.wrapper span {
    width: 25px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
}
.num::-webkit-inner-spin-button, 
.num::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
.num {
    border: none;
    text-align: center;
    width: 30px;
    font-size: 16px;
    border-right: 2px solid rgba(0,0,0,0.2);
    border-left: 2px solid rgba(0,0,0,0.2);
}
.num:focus {
    outline:none;
} */

/* .removeButton {
    background: transparent;
    border: none;
    padding: 0px;
    cursor: pointer;
}

.removeButton:hover img {
    content: url("@/assets/icons/icons8-trash-24-hover.png");
} */

/* Totals container */
.items, .shipping, .totalAmount {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.label, .amount {
    font-weight: bold;
}

.amount {
    color: var(--accentColor2);
}
.divider {
  border-top: 2px solid var(--accentColor1);
  margin: 10px 0;
}

.placeOrderBtn {
    background-color: var(--accentColor2);
    color: white;
    border: none;
    width: 150px;
    height: 50px;
    margin: 10px 0px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
}

.placeOrderBtn:hover {
    background-color: var(--accentColor1);
}
</style>