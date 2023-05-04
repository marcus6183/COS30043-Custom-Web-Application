<template>
    <div class="container-fluid">
        <div class="row">
            <div id="filter-cont" class="col-lg-3 col-md-12">
                <div class="inner">
                    <div class="row d-flex justify-content-center gy-3">
                        <div class="col-lg-10 col-md-3 p-0 ml-1 d-flex align-items-center text-container">
                            <p class="filter-text">FILTERS</p>
                        </div>
                        <div class="col-lg-10 col-md-3 filter-group"> 
                            <input id="floatingInput" class="form-control form-control-sm" type="text" placeholder="Search" aria-label="default input example" v-model="filters.searchInput">   
                        </div>
                        <div class="col-lg-10 col-md-3 filter-group">
                            <select class="form-select form-select-sm" aria-label="Default select example" v-model="filters.category">
                                <option value="All" selected>All</option>
                                <option value="switch">Switches</option>
                                <option value="keycap">Keycaps</option>
                                <option value="keyboard">Keyboards</option>
                            </select>
                        </div>
                        <div class="col-lg-10 col-md-3 filter-group">
                            <select class="form-select form-select-sm" aria-label="Default select example" v-model="filters.sortByPrice">
                                <option value="none" selected>None</option>
                                <option value="lth">Price: Low to High</option>
                                <option value="htl">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div id="products" class="col-lg-9 col-md-12">
                <div class="row d-flex">
                    <div v-for="product in filteredList" class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-xs-12 mb-5 d-flex justify-content-center">
                        <ProductCard :prodId="product.id" :prodName="product.name" :prodPrice="product.price" :prodImgURL="product.imgURL"/>
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
            filters: {searchInput: '', category: 'All', sortByPrice: 'none'},
            products: []
        }
    },
    mounted() {
        fetch('http://localhost:3000/products')
            .then(res => res.json())
            .then(data => this.products = data)
            .catch(err => console.log(err.message))
    },
    computed:{
        filteredList:function(){
            let tempList = this.products
            // Filter by search (name)
            if(tempList){
                if(this.filters.searchInput.length>0){
                    tempList = tempList.filter((product) =>{
                        return (product.name.toLowerCase().match(this.filters.searchInput.toLowerCase()));
                    });
                }
                // Filter by category
                if(!this.filters.category.toLowerCase().match("all")){
                    tempList = tempList.filter((product) => {
                        return (product.category.toLowerCase().match(this.filters.category.toLowerCase()));
                    })
                }
                // Sort by price
                // lth = low to high; htl = high to low
                if(this.filters.sortByPrice.toLowerCase().match("lth")){
                    tempList.sort((a, b) => a.price - b.price);
                }else if(this.filters.sortByPrice.toLowerCase().match("htl")){
                    tempList.sort((a, b) => b.price - a.price);
                }

            }else{
                console.log("tempList array is empty")
            }
            return tempList
        }
    }
}
</script>

<style scoped>
@media (min-width: 992px) {
    .text-container {
        display: flex;
        justify-content: center;
    }
}

#filter-cont {
    padding: 10px;
    height: max-content;
}
/* .form-select, .filter-text, .form-control {
    background: blue;
} */
.inner {
    background-color: var(--primaryColor);
    border-radius: 5px;
    height: 100%;
    width: auto;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    padding: 25px;
    /* display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap; */
}

/* .form-control, .form-select {
    margin-bottom: 20px;
    width: 60%;
} */
#products {
    padding: 10px;
    height: 100%;
    min-height: 100vh;
}

</style>
