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
    <td>
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
        async removeFromCart() {
            // Can implement confirmation here
            try {
                await deleteDoc(doc(db, 'users/' + store.state.user.uid + '/cart', this.itemObject.id));
                console.log("Item[id]: " + this.itemObject.id + " removed from cart")
            }catch(error){
                console.log(error)
            }
        },
        async updateQuantityInFirestore() {
            if(this.itemObject.quantity != 0){
                const cartRef = doc(db, 'users/' + store.state.user.uid + '/cart', this.itemObject.id);
                await updateDoc(cartRef, {
                    qty: this.itemObject.quantity
                });
                console.log("Update success!")
            }
        }
    },
    created() {
        this.debouncedUpdateQuantityInFirestore = debounce(this.updateQuantityInFirestore, 1000);
    },
}
</script>

<style scoped>
td {
    text-align: start;
    vertical-align: middle;
}
.price {
    text-align: end;
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

</style>