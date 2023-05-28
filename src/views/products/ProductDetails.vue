<template>
    <div class="container-fluid">
        <div class="row m-2 d-flex justify-content-between">
            <div class="imageContainer col-lg-6 p-0">
                <img :src="product.imgURL" alt="">
            </div>
            <div class="detailContainer col-lg-6 p-0">
                <div class="upper col p-5 d-flex flex-column align-items-center">
                    <h2><strong>[{{ stockStatus }}] {{ product.name }}</strong></h2><br>
                    <h4>RM {{ product.price }}</h4>
                    <h5>Quantity</h5>
                    <div class="wrapper mb-3">
                        <span type="button" class="minus" @click="updateQty(-1)">-</span>
                        <input type="number" class="num" :placeholder="quantity" v-model="quantity">
                        <span type="button" class="plus" @click="updateQty(1)">+</span>
                    </div>
                    <button class="addToCartBtn" @click="addToCart(product.id)">Add to cart</button>
                </div>
                <div class="lower p-5">
                    <h3 class="descText">Description</h3>
                    <ul class="descList">
                        <li v-for="description in product.description">{{ description }}</li>
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
import store from '@/store';
import router from '@/router'
import ProductCard from '@/components/ProductCard.vue';
import { 
    onSnapshot, collection, doc, getDocs, addDoc, // For data retrieval
    query, where, updateDoc, serverTimestamp // For add to cart
} from "firebase/firestore";
import { db } from '@/firebase';
import Swal from 'sweetalert2';

export default {
    name: 'ProductDetails',
    components: {
        ProductCard
    },
    props: ['id'],
    data() {
        return {
            product: Object,
            similarProducts: [],
            quantity: 1,
            stockStatus: '',
        }
    },
    mounted() {
        this.fetchProduct();
    },
    methods: {
        // // Fetching the product data
            // fetch('http://localhost:3000/products')
            //     .then(res => res.json())
            //     .then(data => {
            //         // Filter data to get only the matching product id
            //         // Array.find() function is used here instead of filter so that it returns an object instead of an array
            //         this.product = data.find(product => product.id == this.id)
            //         this.product.price = this.product.price.toFixed(2)
            //         if(this.product.stock != 0){
            //             this.stockStatus = "In-Stock"
            //         }else{
            //             this.stockStatus = "Out-of-stock"
            //         }
            //         // Get array of similar products
            //         // Filter is used here to exclude the current product and get only products of the same category
            //         this.similarProducts = data.filter(product => product.id != this.id && product.category == this.product.category).slice(0, 4)
            //     })
            //     .catch(err => console.log(err.message))
            
            // // Fetching the product descriptions
            // fetch('http://localhost:3000/productDescription')
            //     .then(res => res.json())
            //     .then(data => {
            //         // Filter data to get only the matching product id
            //         data = data.find(product => product.id == this.id)
            //         this.descriptionArray = data.description
            //     })
            //     .catch(err => console.log(err.message))
        fetchProduct() {
            onSnapshot(collection(db, 'products'), (querySnapshot) => {
                const tempProducts = []
                querySnapshot.forEach((doc) => {
                    const product = {
                        id: doc.id,
                        name: doc.data().name,
                        brand: doc.data().brand,
                        imgURL: doc.data().imgURL,
                        category: doc.data().category,
                        price: doc.data().price,
                        status: doc.data().status,
                        stock: doc.data().stock,
                        featured: doc.data().featured,
                        carousel: doc.data().carousel,
                        description: doc.data().description
                    }
                    tempProducts.push(product)
                })
                this.filterProduct(tempProducts)
            })
        },
        filterProduct(tempProducts){
            // Finding product by id
            this.product = tempProducts.find(product => product.id == this.id)
            if(this.product.stock != 0){
                this.stockStatus = "In-Stock"
            }else{
                this.stockStatus = "Out-of-stock"
            }
            // Get array of similar product
            this.similarProducts = tempProducts.filter(product => product.id != this.id && product.category == this.product.category).slice(0, 4)
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
        },
        async addToCart(prodId){
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
            // Check if user is logged in
            if (!store.state.user){
                // Redirects the user to the login page if they are not logged in
                router.push("/login")
            } else {
                // Check if the user's cart already has the product added
                const collectionPath = 'users/' + store.state.user.uid + '/cart'

                // Query to find current product in firestore
                const q = query(collection(db, collectionPath), where("prodId", "==", prodId));

                // Run query
                const querySnapshot = await getDocs(q);

                // If the query result is empty -> add a new document in the cart collection
                if(querySnapshot.empty){
                    // add new document in the cart collection
                    try {
                        await addDoc(collection(db, collectionPath), {
                            prodId: prodId,
                            qty: this.quantity,
                            dateAdded: serverTimestamp(),
                            dateModified: serverTimestamp()
                        })
                        Toast.fire({
                            icon: 'success',
                            title: 'Product added to cart'
                        })
                    } catch (error) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Error adding product to cart. Please try again later'
                        })
                    }
                    
                // Else -> update the document in the cart collection
                } else {
                    const docObject = querySnapshot.docs[0] // Assuming that there is only 1 result from the query
                    const docRef = doc(db, collectionPath, docObject.id)
                    try {
                        await updateDoc(docRef, {
                            qty: Number(docObject.data().qty) + this.quantity,
                            dateModified: serverTimestamp()
                        })
                        Toast.fire({
                            icon: 'success',
                            title: 'Product has been updated in cart'
                        })
                    } catch (error) {
                        Toast.fire({
                            icon: 'error',
                            title: 'Error adding product to cart. Please try again later'
                        })
                    }
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