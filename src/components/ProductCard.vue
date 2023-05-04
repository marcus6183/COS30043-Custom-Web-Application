<template>
    <div class="card">
        <div class="img-box">
            <router-link to="/">
                <img :src="prodImgURL" class="card-img-top" alt="">
            </router-link>
        </div>
        <!-- <img :src="prodImgURL" class="card-img-top" alt=""> -->
        <div class="card-body">
            <h5 class="card-title">{{ prodName }}</h5>
            <router-link class="btn" to="/">RM{{ prodPrice.toFixed(2) }}</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ProductCard',
    props: [ 'prodId', 'prodName', 'prodPrice', 'prodImgURL'],
}
</script>

<style scoped>
.card {
    width: 18rem;
    border: 0px;
    border-radius: 0px;
    transition: all 0.4s;
}

.card:hover {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
}

.img-box {
    height: 200px;
    width: 100%;
    overflow: hidden;
}
.card img {
    height: 200px;
    width: 100%;
    border-radius: 0;
    object-fit: cover;
    transition: all 0.4s;
}
.card img:hover {
    -ms-transform: scale(1.2); /* IE 9 */
    -webkit-transform: scale(1.2); /* Safari 3-8 */
    transform: scale(1.2); 
}
</style>