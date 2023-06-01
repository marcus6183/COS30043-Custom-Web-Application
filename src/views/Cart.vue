<template>
    <div class="loading" v-if="isLoading">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
    <div v-else :class="'container-fluid row ' + (isLoading ? '':'show')">
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
                <button :disabled="isCartEmpty" class="placeOrderBtn" @click="placeOrder">Place Order</button>
            </div>
        </div>
    </div>
</template>

<script>
import CartItem from '@/components/CartItem.vue'
import store from '@/store'
import { 
    onSnapshot,
    doc,
    getDoc,
    addDoc,
    deleteDoc,
    updateDoc,
    collection,
    serverTimestamp
} from "firebase/firestore"
import { db } from '@/firebase'
import Swal from 'sweetalert2'

export default {
    name: 'Cart',
    components: {
        CartItem
    },
    data() {
        return {
            cartItems: [],
            shippingCost: 5,
            isLoading: true,
            ssListener: null
        }
    },
    mounted() {
        // Calls snapshotListener to subscribe to the listener
        this.snapshotListener()  
    },
    methods: {
        snapshotListener() {
            this.ssListener = onSnapshot(collection(db, 'users/' + store.state.user.uid + '/cart'), (querySnapshot) => {
                const tempCart = []
                if (querySnapshot.empty) {
                    this.cartItems = []
                    this.isLoading = false
                } else {
                    const promises = []

                    querySnapshot.forEach((doc) => {
                    const promise = this.getProductDetails(doc.data().prodId)
                        .then(tempObject => {
                            tempObject.id = doc.id
                            tempObject.prodId = doc.data().prodId
                            tempObject.quantity = doc.data().qty
                            tempObject.dateAdded = doc.data().dateAdded
                            tempCart.push(tempObject)
                        })
                        .catch(error => {
                            console.log(error)
                        })

                    promises.push(promise)
                    })

                    Promise.all(promises)
                    .then(() => {
                        this.cartItems = tempCart
                        this.isLoading = false
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            })
        },
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
                console.log("Document with id of: " + prodId + "doesn't exists; from: getProductDetails()")
                return false
            }
        },
        async placeOrder() {
            // Set loading animation while processing the order
            this.isLoading = true

            // Unsubscribe from snapshotListener
            this.ssListener()

            // Sweet Alert settings
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })

            // Check if itemCart is empty
            if(this.cartItems.length != 0){
                const collectionPath = 'users/' + store.state.user.uid + '/orders'
                const tempOrderedItems = []

                // Populate cart items into tempOrderedItems, keeping only wanted attributes
                this.cartItems.forEach(item => {
                    const tempObject = {
                        prodId: item.prodId,
                        name: item.name,
                        imgURL: item.imgURL,
                        price: item.price,
                        qty: item.quantity
                    }
                    tempOrderedItems.push(tempObject)
                })

                // Add order data to orders collection
                try {
                    await addDoc(collection(db, collectionPath), {
                        orderDate: serverTimestamp(),
                        status: "Unfulfilled",
                        orderTotal: +(this.getTotals + this.shippingCost),
                        orderItems: tempOrderedItems
                    })
                    // Calls updateStocks() and clearCart() once orders has been added
                    this.updateStocks()
                    this.clearCart()

                    // Subscribe back to snapshotListener
                    this.snapshotListener()

                    // Show notification that order has been placed
                    Toast.fire({
                        icon: 'success',
                        title: 'Order placed successfully'
                    })
                } catch (error) {
                    console.log(error)
                    Toast.fire({
                        icon: 'error',
                        title: 'Error adding placing order. Please try again later'
                    })
                }
            }else{
                console.log("Cart is empty; from: placeOrder()")
            }
        },

        // Function that updates the stock for each affected product
        async updateStocks() {
            for (const item of this.cartItems) {
                const productRef = doc(db, 'products', item.prodId);
                try {
                    await updateDoc(productRef, {
                        stock: Number(item.stock - item.quantity),
                    });
                    console.log("Stocks for product: " + item.prodId + " have been updated");
                } catch (error) {
                    console.log(error);
                }
            }
        },

        // Function that clears the cart collection
        // Since deleting a whole collection is not recommended by firestore, will use loop to delete each document instead
        async clearCart() {
            for (const item of this.cartItems) {
                try {
                    await deleteDoc(doc(db, 'users/' + store.state.user.uid + '/cart', item.id));
                    console.log("Item[id]: " + item.id + " removed from cart");
                } catch (error) {
                    console.log(error);
                }
            }
        }
    },
    computed: {
        // Returns the total price of all items combined
        getTotals() {
            let total = 0
            this.cartItems.forEach(item => {
                total += item.price * item.quantity
            })
            return total.toFixed(2)
        },
        // For checking if cart is empty (used for disabling place order button)
        isCartEmpty() {
            return this.cartItems.length === 0
        }
    },
    beforeRouteLeave(to, from, next) {
        // Unsubscribe from the listener before leaving the component
        this.ssListener();
        next();
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

th {
    text-align: start;
    vertical-align: middle;
}

/* Totals container */
.totals h3 {
    border-bottom: 3px solid var(--accentColor1);
}

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

.placeOrderBtn:disabled {
    background-color: #a8a8a8;
}
</style>