<template>
	<div class="loading" v-if="isLoading">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</div>
	<div :class="'home ' + (isLoading ? '':'show')">
		<Carousel :carouselProducts="getCarouselProducts()"/>
		<div class="container">
			<h1>Featured Products</h1>
			<div class="row d-flex justify-content-center">
				<div v-for="product in getFeaturedProducts()" class="col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
					<CardView :product="product"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Carousel from '@/components/Carousel.vue';
import CardView from '@/components/CardView.vue';
import { onSnapshot, collection } from "firebase/firestore";
import { db } from '@/firebase';

export default {
	name: 'HomeView',
	components: {
		Carousel, // Carousel component
		CardView // Card component
	},
	data() {
		return {
			products: [],
			isLoading: true,
			ssListener: null
		}
	},
	mounted() {
		this.ssListener = onSnapshot(collection(db, 'products'), (querySnapshot) => {
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
                    carousel: doc.data().carousel
                }
                tempProducts.push(product)
            })
            this.products = tempProducts
			this.isLoading = false
        })
		// fetch('http://localhost:3000/products')
		// 		.then(res => res.json())
		// 		.then(data => this.products = data)
		// 		.catch(err => console.log(err.message))
	},
	methods: {
		getFeaturedProducts() {
			return this.products.filter((product) => product.featured == true);
		},
		getCarouselProducts() {
			return this.products.filter((product) => product.carousel == true);
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
/* Loading animation */
.loading {
	height: calc(100vh - 240px);
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.home {
	min-height: 100vh;
	opacity: 0;
	transition: opacity 0.5s ease;
}

.show {
	opacity: 1;
}

.col-xl-3
.col-lg-4,
.col-md-6,
.col-sm-12 {
	margin-bottom: 50px;
}

.container {
	margin-top: 50px;
	padding: 0;
}

h1 {
	display: inline-block;
	border-bottom: 3px solid var(--accentColor1);
	margin-bottom: 20px;
}
</style>
