<template>
    <div class="container-fluid row">
        <div class="left col-lg-9 col-md-8 p-3">
            <div class="cart p-3">
                <div class="d-flex justify-content-between align-items-center p-2">
                    <h3>Shopping Cart</h3>
                    <h3>10 items</h3>
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
                                        <img :src="item.ImgURL">
                                    </div>
                                </td>
                                <td>{{ item.name }}</td>
                                <td>{{ item.price }}</td>
                                <td>
                                    <div class="wrapper">
                                        <span type="button" class="minus" @click="updateQty(item.id-1, -1)">-</span>
                                        <input type="number" class="num" :placeholder="item.quantity" v-model="item.quantity">
                                        <span type="button" class="plus" @click="updateQty(item.id-1, 1)">+</span>
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
                    <span class="amount">RM10.00</span>
                </div>
                <div class="shipping">
                    <span class="label">Shipping:</span>
                    <span class="amount">RM5.00</span>
                </div>
                <hr class="divider">
                <div class="totalAmount">
                    <span class="label">Total Amount:</span>
                    <span class="amount">RM15.00</span>
                </div>
                <button class="placeOrderBtn" @click="populateFirestore">Place Order</button>
            </div>
        </div>
        
        
    </div>
    
</template>

<script>
import CartItem from '@/components/CartItem.vue';
// import { onSnapshot, doc, setDoc, collection } from "firebase/firestore";
// import { db } from '@/firebase';

export default {
    name: 'Cart',
    components: {
        CartItem
    },
    data() {
        return {
            products: [],
            cartItems: [
                { id: 1, name: 'Tangerine', price: 2.80, quantity: 10, ImgURL:  "https://zionstudios.ph/wp-content/uploads/2021/01/DSC04647-scaled.jpg", stock: 30},
                { id: 2, name: 'Tangerine', price: 2.80, quantity: 20, ImgURL:  "https://zionstudios.ph/wp-content/uploads/2021/01/DSC04647-scaled.jpg", stock: 25},
                { id: 3, name: 'Tangerine', price: 2.80, quantity: 30, ImgURL:  "https://www.ashkeebs.com/wp-content/uploads/2021/08/Zaku-Switch-Product-Image-2.jpg", stock: 35}
            ]
        }
    },
    mounted() {
        /* Active snapshot template */
        // onSnapshot(collection(db, 'products'), (querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log(doc.id + " => ", doc.data());
        //     })
        // })
        fetch('http://localhost:3000/products')
            .then(res => res.json())
            .then(data => this.products = data)
            .catch(err => console.log(err.message))
    },
    methods: {
        removeFromCart() {
            console.log("Function is working")
        },
        updateQty(id, num) {
            if(num == 1){
                // Check if quantity is equal to stocks available
                if(this.cartItems[id].quantity < this.cartItems[id].stock){
                    this.cartItems[id].quantity++
                }
            }else if(num == -1){
                // Check if quantity is already at 1
                if(this.cartItems[id].quantity > 1){
                    this.cartItems[id].quantity--
                }
            }
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