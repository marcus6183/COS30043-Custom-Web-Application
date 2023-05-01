<template>
    <div class="container-fluid">
        <div class="row d-flex justify-content-center">
            <p>Find us at:</p>
        </div>
        <div class="row d-flex justify-content-center">
            <div class="col-1 d-flex justify-content-evenly">
                <a href="https://www.instagram.com" target="_blank">
                    <img src="@/assets/icons/icons8-instagram-24.png" alt="Instagram icon by Icons8">
                </a>
                <a href="https://www.facebook.com" target="_blank">
                    <img src="@/assets/icons/icons8-facebook-24.png" alt="Facebook icon by Icons8">
                </a>
                <a href="https://www.twitter.com" target="_blank">
                    <img src="@/assets/icons/icons8-twitter-24.png" alt="Twitter icon by Icons8">
                </a>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            <p>&copy; CarrotKeebs</p>
        </div>
    </div>
    <!-- <div class="footer">
        <div class="text">
            <p>Find us at:</p>
        </div>
        <div class="icons">
            <a href="https://www.instagram.com" target="_blank">
                <img src="@/assets/icons/icons8-instagram-24.png" alt="Instagram icon by Icons8">
            </a>
            <a href="https://www.facebook.com" target="_blank">
                <img src="@/assets/icons/icons8-facebook-24.png" alt="Facebook icon by Icons8">
            </a>
            <a href="https://www.twitter.com" target="_blank">
                <img src="@/assets/icons/icons8-twitter-24.png" alt="Twitter icon by Icons8">
            </a>
        </div>
    </div> -->
</template>
  
<script>
export default {
name: "Footer",
};
</script>

<style scoped>

p {
    padding: 0;
    margin: 0;
}
.container-fluid {
    padding: 20px;
    height: fit-content;
    background-color: var(--accentColor1);
    color: var(--primaryColor)
}

/* .footer {
    height: 100px;
    background-color: var(--accentColor1);
    display: flex;
    align-items: center;
    justify-content: center;
}
.icons {
    width: 100px;
    display: flex;
    justify-content: space-evenly;
    background-color: blue;
} */
</style>
  