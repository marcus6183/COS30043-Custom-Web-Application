<template>
    <td>
        <div class="imgCont">
            <img :src="itemObject.imgURL">
        </div>
    </td>
    <td>{{ itemObject.name }}</td>
    <td class="price">{{ itemObject.price.toFixed(2) }}</td>
    <td>
        <div class="wrapper">
            <span type="button" class="minus" @click="updateQty(-1)">-</span>
            <input type="number" class="num" :placeholder="itemObject.quantity" v-model.lazy="itemObject.quantity" v-on:change="updateQuantityInFirestore">
            <span type="button" class="plus" @click="updateQty(1)">+</span>
        </div>
    </td>
    <td class="price">{{ (itemObject.price * itemObject.quantity).toFixed(2) }}</td>
    <td class="remove">
        <button class="removeButton" @click="removeFromCart()">
            <img src="@/assets/icons/icons8-trash-24.png" alt="">
        </button>
    </td>
</template>

<script>
import { doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/firebase"
import store from "@/store"
import debounce from 'lodash/debounce'
import Swal from 'sweetalert2';

export default {
    name: 'CartItem',
    props: {
        itemObject: {
            type: Object,
            required: true
        }
    },
    methods: {
        updateQty(num) {
            if(num == 1){
                // Check item quantity on current stock
                if(this.itemObject.quantity < this.itemObject.stock){
                    this.itemObject.quantity++
                    this.debouncedUpdateQuantityInFirestore()
                }
            }else if (num == -1){
                // Check if item quantity is already 1
                if(this.itemObject.quantity > 1){
                    this.itemObject.quantity--
                    this.debouncedUpdateQuantityInFirestore()
                }
            }
        },
        // Removes the cart item in firestore
        async removeFromCart() {
            // Confirmation dialouge
            Swal.fire({
                title: 'Are you sure?',
                text: 'Remove \"' + this.itemObject.name + '\" from cart?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#00bf63',
                cancelButtonColor: '#ff914d',
                confirmButtonText: 'Confirm'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        await deleteDoc(doc(db, 'users/' + store.state.user.uid + '/cart', this.itemObject.id));
                        console.log("Item[id]: " + this.itemObject.id + " removed from cart")
                        Swal.fire({
                            text: '\"' + this.itemObject.name + '\" has been removed from cart',
                            icon: 'success',
                            confirmButtonColor: '#00bf63'
                        })
                    }catch(error){
                        console.log(error)
                    }
                    
                }
            })
            
        },
        // Updates the quantity of cart item in firestore
        async updateQuantityInFirestore() {
            // Checks the quantity, only proceed when the quantity is not 0 (possible when manually changing the input)
            if(this.itemObject.quantity != 0){
                const cartRef = doc(db, 'users/' + store.state.user.uid + '/cart', this.itemObject.id);
                await updateDoc(cartRef, {
                    qty: this.itemObject.quantity
                });
                console.log("Update success!")
            }
        }
    },
    // Debounce from Lodash library, to minimize API call/update to firestore
    created() {
        this.debouncedUpdateQuantityInFirestore = debounce(this.updateQuantityInFirestore, 1000);
    },
}
</script>

<style scoped>
/* positioning of table data (td)*/
td {
    text-align: start;
    vertical-align: middle;
}
.price {
    text-align: end;
}
.remove {
    text-align: center;
}

/* Image */
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

/* Quantity +- button */
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

/* Remove button (trash icon) */
.removeButton {
    background: transparent;
    border: none;
    padding: 0px;
    cursor: pointer;
}

.removeButton:hover img {
    content: url("@/assets/icons/icons8-trash-24-hover.png");
}

</style>