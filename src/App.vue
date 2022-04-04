<template>
  <div >
    <component
      v-bind:is="currentComponent"
      v-on:set-current-component="setCurrentComponent"
      
    ></component>
  </div>
</template>

<script>
import googlecalenderdata from './components/googlecalenderdata.vue'
export default {
  name: 'App',
  components: {
    googlecalenderdata
  },
  
   created: async function () {
  

        this.setCurrentComponent("googlecalenderdata");
  },
  data:function() {
      return {
        date: null,
        currentComponent:"googlecalenderdata"
      }
},
methods:{
   setCurrentComponent(componentName) {
      this.currentComponent = componentName;

    },
}
}
</script>

<style type="scss">
#app {
  font-family: 'Inter';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}
body{
  overflow:hidden !important;
  
}
::-webkit-scrollbar {
  width: 4px;
  height: 8px !important;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #D0D2D7;
}

::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>
