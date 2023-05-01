<template>
  <div class="home">
    <Carousel/>
    <div class="container">
      <h1>Featured Products</h1>
      <div class="row d-flex justify-content-center">
        <div v-for="item in items" class="col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
          <CardView :item="item"/>
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
      items: [
        { id: 1, name: "Owlab Neon Switches", imgPath: require('@/assets/images/switch_owlabneon.jpeg'), route: "/switches"},
        { id: 2, name: "London Fog Switches", imgPath: require('@/assets/images/switch_londonfog.webp'), route: "/switches"},
        { id: 3, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"}
      ]
    }
  }
}
</script>

<style scoped>
.home {
  height: auto;
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
