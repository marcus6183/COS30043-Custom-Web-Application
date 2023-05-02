<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-3 col-md-12 bg-warning">
                <div class="filterContainer">
                    Column filters
                </div>
            </div>
            <div id="products" class="col-lg-9 col-md-12 bg-danger">
                <div class="row d-flex justify-content-center">
                    <div v-for="item in items" id="items" class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-xs-12 d-flex justify-content-center">
                        <ProductCard/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProductCard from '@/components/ProductCard.vue';

export default {
  name: 'ProductView',
  components: {
    ProductCard // Card component
  },
  data() {
    return {
      items: [
        { id: 1, name: "Owlab Neon Switches", imgPath: require('@/assets/images/switch_owlabneon.jpeg'), route: "/switches"},
        { id: 2, name: "London Fog Switches", imgPath: require('@/assets/images/switch_londonfog.webp'), route: "/switches"},
        { id: 3, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
        { id: 4, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
        { id: 5, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
        { id: 6, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
        { id: 7, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
        { id: 8, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
        { id: 9, name: "PBTFans Spark Light", imgPath: require('@/assets/images/keycaps_PBTFansSparkLight.jpg'), route: "/switches"},
      ]
    }
  }
}
</script>

<style scoped>
.container-fluid {
    background-color: blue;
}

.filterContainer {
    padding: 20px
}
#products {
    padding: 10px;
    height: 2000px;
}

#items {
    margin-bottom: 20px;
}

</style>
