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

<style lang="scss" src="./assets/style/componentstyle.scss">

</style>