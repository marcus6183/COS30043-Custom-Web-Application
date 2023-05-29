<template>
    <div class="container-fluid row">
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
                            <tr v-for="item in cartItems">
                                <td>
                                    <div class="imgCont">
                                        <img :src="item.imgURL">
                                    </div>
                                </td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.price.toFixed(2) }}</td>
                                <td>
                                    <div class="wrapper">
                                        <span type="button" class="minus" @click="updateQty(item.id, item.quantity, item.stock, -1)">-</span>
                                        <input type="number" class="num" :placeholder="item.quantity" v-model="item.quantity">
                                        <span type="button" class="plus" @click="updateQty(item.id, item.quantity, item.stock, 1)">+</span>
                                    </div>
                                </td>
                                <td>{{ (item.price * item.quantity).toFixed(2) }}</td>
                                <td>
                                    <button class="removeButton" @click="removeFromCart">
                                        <img src="@/assets/icons/icons8-trash-24.png" alt="">
                                    </button>
                                </td>
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
import { onSnapshot, doc, getDoc, setDoc, collection} from "firebase/firestore";
import { db } from '@/firebase';

export default {
    name: 'Cart',
    components: {
        CartItem
    },
    data() {
        return {
            products: [],
            cartEmpty: false,
            cartItems: [],
            shippingCost: 5
        }
    },
    mounted() {
        onSnapshot(collection(db, 'users/' + store.state.user.uid + '/cart'), (querySnapshot) => {
            const tempCart = [];

            if (querySnapshot.empty) {
                this.cartEmpty = true;
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
                })
                .catch(error => {
                    console.log(error);
                });
            }
        });
        /* Active snapshot template */
        // onSnapshot(collection(db, 'users/' + store.state.user.uid + '/cart'), (querySnapshot) => {
        //     const tempCart = []
        //     if (querySnapshot.empty){
        //         this.cartEmpty = true
        //         console.log("Cart is empty")
        //     }else{
        //         this.cartEmpty = false
        //         querySnapshot.forEach((doc) => {
        //             this.getProductDetails(doc.data().prodId)
        //                 .then(tempObject => {
        //                     tempObject.id = doc.id,
        //                     tempObject.prodId = doc.data().prodId,
        //                     tempObject.quantity = doc.data().qty,
        //                     tempObject.dateAdded = doc.data().dateAdded
        //                     tempCart.push(tempObject)
        //                     console.log(tempCart[0])
        //                 })
        //                 .catch(error => {
        //                     console.log(error)
        //                 })
        //         })
        //     }
        // })

        // onSnapshot(collection(db, 'products'), (querySnapshot) => {
        //     const tempProducts = []
        //     querySnapshot.forEach((doc) => {
        //         const product = {
        //             id: doc.id,
        //             name: doc.data().name,
        //             brand: doc.data().brand,
        //             imgURL: doc.data().imgURL,
        //             category: doc.data().category,
        //             price: doc.data().price,
        //             status: doc.data().status,
        //             stock: doc.data().stock,
        //             featured: doc.data().featured,
        //             carousel: doc.data().carousel
        //         }
        //         tempProducts.push(product)
        //     })
        //     this.products = tempProducts
        //     this.isLoading = false
        // })
        /* OLD TO BE REMOVED */
        // fetch('http://localhost:3000/products')
        //     .then(res => res.json())
        //     .then(data => this.products = data)
        //     .catch(err => console.log(err.message))
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
        removeFromCart() {
            //TODO
            console.log("Function is working")
        },
        updateQty(id, num) {
            //TODO
            console.log(this.cartItems[id])
            // if(num == 1){
            //     // Check if quantity is equal to stocks available
            //     if(this.cartItems[id].quantity < this.cartItems[id].stock){
            //         // Update the cart item in firebase
            //         const cartRef = doc(db, 'users/' + store.state.user.uid + '/cart', id)
            //         this.cartItems[id].quantity++
            //     }
            // }else if(num == -1){
            //     // Check if quantity is already at 1
            //     if(this.cartItems[id].quantity > 1){
            //         this.cartItems[id].quantity--
            //     }
            // }
        },
        populateFirestore(){
            /* 
                Add document with doc id template
                await setDoc(doc(db, "products", product.id.toString()), {          //Id must be sent as a string, int or number will cause error
                    fieldName: value
                }) 
            */
            /*
                Populating products
            */
            // this.products.forEach(async product => {
            //     if(product.id != 1){
            //         // Add a new document in collection "products"
            //         await setDoc(doc(db, "products", product.id.toString()), {
            //             name: product.name,
            //             brand: product.brand,
            //             imgURL: product.imgURL,
            //             category: product.category,
            //             price: product.price,
            //             status: product.status,
            //             stock: product.stock,
            //             featured: product.featured,
            //             carousel: product.carousel
            //         });
            //     }
            // })
        }
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

.container-fluid {
    min-height: 100vh;
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

th, td {
    text-align: start;
    vertical-align: middle;
}

.imgCont {
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
}

.removeButton {
    background: transparent;
    border: none;
    padding: 0px;
    cursor: pointer;
}

.removeButton:hover img {
    content: url("@/assets/icons/icons8-trash-24-hover.png");
}

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