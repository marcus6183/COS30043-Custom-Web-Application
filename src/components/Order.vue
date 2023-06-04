<template>
    <div class="accordion-item">
        <h2 class="accordion-header" id="flush-headingOne">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#flush-collapse' + index" aria-expanded="false" :aria-controls="'flush-collapse' + index">
                <span class="orderText">Order ID:</span>{{ orderObject.id }}
            </button>
        </h2>
        <div :id="'flush-collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'flush-heading' + index" data-bs-parent="#accordionFlushExample">
            <div class="accordion-body">
                <div class="wrapper">
                    <span class="label">Date:</span>
                    <span class="data">{{ getDate }}</span>
                </div>
                <div class="wrapper">
                    <span class="label">Status:</span>
                    <span class="data">{{ orderObject.status }}</span>
                </div>
                <div class="wrapper">
                    <span class="label">Shipping cost:</span>
                    <span class="data">RM {{ orderObject.shippingCost.toFixed(2) }}</span>
                </div>
                <div class="wrapper">
                    <span class="label">Total (excl. Shipping Cost):</span>
                    <span class="data">RM {{ orderObject.orderTotal.toFixed(2) }}</span>
                </div>
                <div class="wrapper">
                    <span class="label">Total (incl. Shipping Cost):</span>
                    <span class="data">RM {{ (orderObject.orderTotal + orderObject.shippingCost).toFixed(2) }}</span>
                </div>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col" class="col-2">Product</th>
                                <th scope="col" class="col-4"></th>
                                <th scope="col" class="col-2 price">Price</th>
                                <th scope="col" class="col-2 qty">Quantity</th>
                                <th scope="col" class="col-2 subtotal">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="orderItem in orderObject.orderedItems">
                                <td>
                                    <div class="imgCont">
                                        <img :src="orderItem.imgURL">
                                    </div>
                                </td>
                                <td>{{ orderItem.name }}</td>
                                <td class="price">{{ orderItem.price.toFixed(2) }}</td>
                                <td class="qty">{{ orderItem.qty }}</td>
                                <td class="subtotal">{{ (orderItem.price * orderItem.qty).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Order',
    props: {
        index: {
            type: Number
        },
        orderObject: {
            type: Object,
        }
    },
    computed: {
        getDate() {
            if(this.orderObject){
                //Convert timestamp to readable date, in the format of "May 31, 2023"
                const date = new Date(this.orderObject.orderDateTimestamp.seconds * 1000)
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return date.toLocaleDateString('en-US', options)
            }else{
                return ''
            }
        }
    }
}
</script>

<style scoped>
.orderText {
    font-weight: bold;
}
.wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0px 8px;
}

.label {
    font-weight: bold;
}

/* Styling contents in table */
th, td {
    text-align: start;
}

.price, .subtotal {
    text-align: end
}

.qty {
    text-align: center;
}

/* Image */
.imgCont {
    width: 100px;
    height: 100px;
    background-color: #fff;
    border: 1px solid grey;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.imgCont img {
    width: 100%;
    height: auto;
    object-fit: cover;
    margin-right: 20px;
}

/* Restyling Accordion */
.accordion-button:not(.collapsed) {
    background-color: var(--accentColor1);
    color: #fff;
}

.accordion-button:focus {
    border: none;
    box-shadow: none;
}

.accordion-collapse {
    overflow: hidden;
}

.accordion-body {
    padding: 8px;
}
</style>