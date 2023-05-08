<template>
    <div class="container-fluid">
        <div class="row m-2 d-flex justify-content-between">
            <div class="imageContainer col-lg-6 p-0">
                <img :src="product.imgURL" alt="">
            </div>
            <div class="detailContainer col-lg-6 p-5 d-flex flex-column align-items-center">
                <h1>[{{ stockStatus }}] {{ product.name }}</h1><br>
                <h5>RM {{ product.price }}</h5>
                <h5>Quantity</h5>
                <div class="wrapper mb-3">
                    <span type="button" class="minus" @click="updateQty(-1)">-</span>
                    <input type="number" class="num" :placeholder="quantity" v-model="quantity">
                    <!-- <span class="num">{{ quantity }}</span> -->
                    <span type="button" class="plus" @click="updateQty(1)">+</span>
                </div>
                <button class="addToCartBtn">Add to cart</button>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            product: Object,
            quantity: 1,
            stockStatus: ''
        }
    },
    mounted() {
        fetch('http://localhost:3000/products')
            .then(res => res.json())
            .then(data => {
                // Filter data to get only the matching product id
                // Array.find() function is used here instead of filter so that it returns an object instead of an array
                data = data.find(product => product.id == this.id)
                this.product = data
                this.product.price = this.product.price.toFixed(2)
                if(this.product.stock != 0){
                    this.stockStatus = "In-Stock"
                }else{
                    this.stockStatus = "Out-of-stock"
                }
            })
            .catch(err => console.log(err.message))
    },
    methods: {
        updateQty(num) {
            if(num == 1){
                // Check if quantity is equal to stocks available
                if(this.quantity < this.product.stock){
                    this.quantity++
                }
            }else if(num == -1){
                // Check if quantity is already at 1
                if(this.quantity > 1){
                    this.quantity--
                }
            }
        }
    }
}
</script>

<style scoped>
.container-fluid {
    min-height: 100vh;
}

.imageContainer {
    height: 500px;
    background-color: #fff;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.detailContainer {
    height: 500px;
}

img {
    width: auto;
    max-height: 100%;
}

/* Quantity inc/dec box  */
.wrapper {
    height: 50px;
    min-width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 5px;
    border: 1px solid var(--accentColor1);
} 
.wrapper span {
    width: 100%;
    text-align: center;
    font-size: 25px;
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
    width: 50px;
    font-size: 20px;
    border-right: 2px solid rgba(0,0,0,0.2);
    border-left: 2px solid rgba(0,0,0,0.2);
}
.num:focus {
    outline:none;
}
.addToCartBtn {
    background-color: var(--accentColor2);
    color: white;
    border: none;
    width: 150px;
    height: 50px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
}

.addToCartBtn:hover {
    background-color: var(--accentColor1);
}
</style>