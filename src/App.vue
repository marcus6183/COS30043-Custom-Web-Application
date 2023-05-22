<template>
  <NavBar/>
  <router-view/>
  <Footer/>
</template>

<script>
import NavBar from '@/components/NavBar.vue'; // Importing NavBar component
import Footer from './components/Footer.vue'; // Importing Footer component
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '@/firebase';

export default {
  name: 'App',
  components: {
    NavBar,
    Footer // Register the component
  }
}
</script>

<!--Global CSS are declared here-->
<style>
/* Importing custom fonts*/
@font-face {
  font-family: 'ConcertOne';
  src: url('@/assets/fonts/ConcertOne-Regular.ttf') format('truetype');
}
@font-face {
  font-family: 'SFPro-Bold';
  src: url('@/assets/fonts/SFPRODISPLAYBOLD.OTF') format('opentype');
}
@font-face {
  font-family: 'SFPro-Medium';
  src: url('@/assets/fonts/SFPRODISPLAYMEDIUM.OTF') format('opentype');
}
@font-face {
  font-family: 'SFPro-Regular';
  src: url('@/assets/fonts/SFPRODISPLAYREGULAR.OTF') format('opentype');
}

:root {
  --primaryColor: #F8F9FA;
  --accentColor1: #00bf63;
  --accentColor2: #ff914d;
}

#app {
  /* Font used is SFPro-Medium */
  font-family: SFPro-Regular, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
}

body {
  background-color: var(--primaryColor);
}
</style>
