<template>
    <div class="container-fluid">
        <div class="row">
            <div id="filter-container">
                <div class="accordion accordion-flush" id="filters-accordion">
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="flush-headingOne">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                Filters
                            </button>
                        </h2>
                        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#filters-accordion">
                            <div class="row d-flex justify-content-between m-0 m-3">
                                <div class="col-lg-3 p-0 m-0 mb-2">
                                    <label for="searchInput" class="form-label m-0">Search:</label>
                                    <input class="form-control form-control-sm" name="searchInput" type="text" placeholder="Product name" aria-label="default input example" v-model="filters.searchInput">   
                                </div>
                                <div class="col-lg-3 p-0 m-0 mb-2">
                                    <label for="categorySelect" class="form-label m-0">Category:</label>
                                    <select class="form-select form-select-sm" name="categorySelect" aria-label="Default select example" v-model="filters.category">
                                        <option value="All" selected>All</option>
                                        <option value="switch">Switches</option>
                                        <option value="keycap">Keycaps</option>
                                        <option value="keyboard">Keyboards</option>
                                    </select>
                                </div>
                                <div class="col-lg-3 p-0 m-0">
                                    <label for="sortSelect" class="form-label m-0">Sort by:</label>
                                    <select class="form-select form-select-sm" name="sortSelect" aria-label="Default select example" v-model="filters.sortByPrice">
                                        <option value="none" selected>None</option>
                                        <option value="lth">Price: Low to High</option>
                                        <option value="htl">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div id="products" class="col">
                <div class="product-text d-flex justify-content-between align-items-center">
                    <h2>{{ productText }}</h2>
                    <h2>{{ resultsCount }} items</h2>
                </div>
                <div class="product-content row">
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
            products: [],
            productText: '',
            resultsCount: 0
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
            if(this.filters.searchInput != '' || this.filters.category != 'All'){
                console.log("Category: " + this.filters.category)
                this.productText = "Filter results"
            }else{
                this.productText = "Products"
            }
            this.resultsCount = tempList.length
            return tempList
        }
    }
}
</script>

<style scoped>
#products {
    padding: 10px;
    height: 100%;
    min-height: 100vh;
}

#filter-container {
    padding: 0px 40px;
    margin-top: 20px;
}
.product-text {
    margin-top: 20px;
    width: 100%;
    height: fit-content;
    padding: 0 30px
}

.product-content {
    margin-top: 20px;
}

.form-control:focus, .form-select:focus {
    box-shadow: none;
    border: 1px solid var(--accentColor1);
}
/* Restyling Accordion button */
.accordion-button:not(.collapsed) {
    background-color: transparent;
    color: inherit;
}

.accordion-button:focus {
    border: none;
    box-shadow: none;
}

.accordion {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -webkit-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    -moz-box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
    --bs-accordion-btn-active-icon: url(data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e);
}

.form-label {
    float: left;
}

#filters-accordion {
    border-radius: 5px;
    overflow: hidden;
}

#flush-collapseOne {
    overflow: hidden;
}
</style>
