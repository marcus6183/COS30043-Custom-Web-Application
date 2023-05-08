<template>
   <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
            <button v-for="(product, index) in carouselProducts" :key="index" type="button" data-bs-target="#carouselExampleCaptions" :data-bs-slide-to="index" :class="{ active: index === 0 }" aria-label="Slide {{ index + 1 }}"></button>
        </div>
        <div class="carousel-inner">
            <div v-for="(product, index) in carouselProducts" :key="index" :class="index === 0 ? 'carousel-item active' : 'carousel-item'">
                <router-link :to="{ name: 'ProductDetails', params: { id: product.id }}">
                    <img :src="product.imgURL" class="d-block w-100" alt="">
                </router-link>
                <div class="carousel-caption d-none d-md-block">
                    <h5>{{ product.name }}</h5>
                    <p>In Stock Now!</p>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>

</template>

<script>
export default {
    name: 'Carousel',
    props: ['carouselProducts']
}
</script>

<style scoped>
.carousel-item {
  width: 100%;
  height: 500px; /* set the desired height here */
}

.carousel-item img {
  object-fit: cover; /* ensure that the image fills the container */
  width: 100%;
  height: 100%;
}
</style>