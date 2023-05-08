<template>
	<div class="home">
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

export default {
	name: 'HomeView',
	components: {
		Carousel, // Carousel component
		CardView // Card component
	},
	data() {
		return {
			products: [],
		}
	},
	mounted() {
				fetch('http://localhost:3000/products')
						.then(res => res.json())
						.then(data => this.products = data)
						.catch(err => console.log(err.message))
	},
	methods: {
				getFeaturedProducts() {
					return this.products.filter((product) => product.featured == true);
				},
				getCarouselProducts() {
					return this.products.filter((product) => product.carousel == true);
				}
	}
}
</script>

<style scoped>
.home {
	min-height: 100vh;
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
