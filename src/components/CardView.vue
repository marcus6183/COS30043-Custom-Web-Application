<template>
    <div class="card">
        <img :src="item.imgPath" class="card-img-top" alt="">
        <div class="item-body">
            <h5>{{ item.name }}</h5>
            <router-link class="btn" :to="item.route">View Product</router-link>
        </div>
        <!-- <img src="@/assets/images/switch_londonfog.webp" class="card-img-top" alt=""> -->
        <!-- <div class="card-body">
            <h5 class="card-title">Owlab Neon Switch</h5>
            <router-link class="btn" to="/switches"><h5>Owlab Neon</h5></router-link>
        </div> -->
    </div>
</template>

<script>
export default {
  props: {
    item: {
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
    border: 0px;
    border-radius: 5px;
    margin: 0;
    box-shadow: 0px 6px 11px 0px rgba(0,0,0,0.7);
    -webkit-box-shadow: 0px 6px 11px 0px rgba(0,0,0,0.7);
    -moz-box-shadow: 0px 6px 11px 0px rgba(0,0,0,0.7);
} 

.card img {
    height: 350px;
    width: auto;
    border-radius: 5px;
    object-fit: cover;
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
</style>