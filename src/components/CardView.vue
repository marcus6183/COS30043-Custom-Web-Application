<template>
    <div class="card">
        <img :src="product.imgURL" class="card-img-top" alt="">
        <div class="item-body">
            <h5>{{ product.name }}</h5>
            
            <router-link class="btn" :to="{ name: 'ProductDetails', params: { id: product.id }}">View Product</router-link>
        </div>
    </div>
</template>

<script>
export default {
  props: {
    product: {
        type: Object,
        required: true
    }
  }
}
</script>

<style scoped>
.card {
    position: relative;
    width: 18rem;
    height: 300px;
    border: 0px;
    border-radius: 5px;
    margin: 0;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.item-body {
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    padding: 1rem;
    color: var(--primaryColor);
    background-color: rgba(0,0,0,0.5);
}

.btn {
    position: relative;
    margin-top: 20px;
    bottom: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    color: var(--primaryColor);
    border-radius: 5px;
    background-color: var(--accentColor2);
    transition: all 0.3s ease-in-out;
}

.btn:hover {
    background-color: var(--accentColor1); /* new background color on hover */
}

img {
    height: 100%;
    width: auto;
    object-fit: cover;
}
</style>