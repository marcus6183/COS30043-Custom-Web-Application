<template>
    <div class="container-fluid">
        <div class="row m-2 d-flex justify-content-between">
            <div class="imageContainer col-lg-6 p-0">
                <img :src="product.imgURL" alt="">
            </div>
            <div class="detailContainer col-lg-6 p-0">
                <div class="upper col p-5 d-flex flex-column align-items-center">
                    <h2><strong>[{{ stockStatus }}] {{ product.name }}</strong>></h2><br>
                    <h4>RM {{ product.price }}</h4>
                    <h5>Quantity</h5>
                    <div class="wrapper mb-3">
                        <span type="button" class="minus" @click="updateQty(-1)">-</span>
                        <input type="number" class="num" :placeholder="quantity" v-model="quantity">
                        <span type="button" class="plus" @click="updateQty(1)">+</span>
                    </div>
                    <button class="addToCartBtn">Add to cart</button>
                </div>
                <div class="lower p-5">
                    <h3 class="descText">Description</h3>
                    <ul class="descList">
                        <li v-for="description in descriptionArray">{{ description }}</li>
                    </ul>              
                </div>
            </div>
        </div>
        <div class="similarItems">
            <h2>Similar Items</h2>
            <div class="product-content row">
                <div v-for="similarProduct in similarProducts" class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-5 d-flex justify-content-center">
                    <ProductCard :prodId="similarProduct.id" :prodName="similarProduct.name" :prodPrice="similarProduct.price" :prodImgURL="similarProduct.imgURL"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';

export default {
    name: 'ProductDetails',
    components: {
        ProductCard
    },
    props: ['id'],
    data() {
        return {
            product: Object,
            descriptionArray: [],
            similarProducts: [],
            quantity: 1,
            stockStatus: ''
        }
    },
    mounted() {
        this.fetchProduct();
    },
    methods: {
        fetchProduct() {
            // Fetching the product data
            fetch('http://localhost:3000/products')
                .then(res => res.json())
                .then(data => {
                    // Filter data to get only the matching product id
                    // Array.find() function is used here instead of filter so that it returns an object instead of an array
                    this.product = data.find(product => product.id == this.id)
                    this.product.price = this.product.price.toFixed(2)
                    if(this.product.stock != 0){
                        this.stockStatus = "In-Stock"
                    }else{
                        this.stockStatus = "Out-of-stock"
                    }
                    // Get array of similar products
                    // Filter is used here to exclude the current product and get only products of the same category
                    this.similarProducts = data.filter(product => product.id != this.id && product.category == this.product.category).slice(0, 4)
                })
                .catch(err => console.log(err.message))
            
            // Fetching the product descriptions
            fetch('http://localhost:3000/productDescription')
                .then(res => res.json())
                .then(data => {
                    // Filter data to get only the matching product id
                    data = data.find(product => product.id == this.id)
                    this.descriptionArray = data.description
                })
                .catch(err => console.log(err.message))
        },
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
    },
    beforeRouteUpdate(to, from, next) {
        // update the component's data when the route parameter changes
        this.fetchProduct();
        next();
    }
}
</script>

<style scoped>
.container-fluid {
    min-height: 100vh;
}

/* Image */
.imageContainer {
    height: 500px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    width: auto;
    max-height: 100%;
}

/* Details */
.detailContainer {
    height: auto;
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

/* Description */
.descText {
    border-bottom: 3px solid var(--accentColor1);
}
.descList {
    list-style-type: none;
}

ul {
    text-align: left;
    text-indent: -1.5em;
}

.descList> li:before {
    content: url("@/assets/icons/icons8-more-than-15.png"); /* add an arrow icon before each list item */
    margin-right: 0.5em; /* add some space between the icon and the text */
}

/* Similar items */
.similarItems {
    width: 100%;
    height: auto;
}

.similarItems h2 {
    display: inline-block;
    border-bottom: 3px solid var(--accentColor1);
    margin-bottom: 20px;
}

</style>