<template>
  <div class="dropdowncontainer-style" ref="dropdownMenu"   style="cursor: pointer; position: initial; ">
    <div style="width: 100%;display:flex" @click="toggleMenu" >
         <div class="dropdown-toggle "  v-if="selected !== undefined">{{ selected.hour}} : {{selected.minute}}  {{selected.find}}
        </div>
        <!-- <div class="dropdown-toggle "   v-if="selected ==''">
          {{ placeholderText }}
        </div> -->
    </div>

    <div class="content-style" v-if="showMenu">
      
      <div :class="{ scrollstyle: this.options.length > 2 }"  >
        <span v-for="(option, index) in dataarray" :key="index" class="dropdownoptions-style" @click="updateOption(option)">
          {{ option.hour }} : {{option.minute}} {{option.find}}  
        </span>
        
      </div>
    </div>
  </div>
</template>

<script>

// import downarrow1 from "../../public/newsvg/Drop-arrow.svg";

export default {
  data() {
    return {
      showMenu:false,
      dataarray:[],
      placeholderText:"select the coupon",
      selectedvalue:""
    };
  },
  components: {  },
  props: {
    options: {
      type: [Array, Object],
    },
    selected: {},
    placeholder: [String],
    isarrow:[String]
  },
  watch: {
   
  },

  
  computed:{
      
  },
  mounted() {
    
  },
  destroyed() {
    document.removeEventListener("onmouseout", this.documentClick);
  },
  async created() {

    this.dataarray=this.options;
    this.updateOption(this.dataarray[0])
    document.addEventListener("click", this.documentClick);
  },
  
  methods: {
    documentClick(e) {
      let el = this.$refs.dropdownMenu;
      let target = e.target;
      if (el !== target && !el.contains(target)) {
        this.showMenu = false;
      }
    },
    toggleMenu() {
      console.log("wrking-now");
      this.showMenu = !this.showMenu;
    },
     updateOption(option) {
      this.showMenu = false;
      console.log(option);
      this.$emit("updateOption", option);
    },
    
  },
};
</script>

<style  lang="scss" scoped>

.dropdowncontainer-style
{
    cursor: pointer;
    position: initial;
    width: 100%;
    color: #333333;
    font-size: 13px;
    font-weight: 400;
    font-family: 'Inter';
    .content-style
    {
      position: absolute;
      margin-top: 12px !important;
      left: -9px;
      z-index: 1;
      padding: 0.5rem 0;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: rgb(0 0 0 / 35%) 0px 5px 15px;
    }
    .content-style.show 
    {
      display: block;
    }
    .dropdownoptions-style
    {
      display: block;
      padding: 8px 7px;
      clear: both;
      font-weight: 400;
      color: #212529;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      border: 0;
    }
    .dropdownoptions-style:hover
    {
      background-color: #f7f8fc;
      border-radius: 5px;
    }
    .dropdown-toggle::after 
    {
      display: none !important;
    }
    .scrollstyle 
    {
      max-height: 200px;
      overflow-x: hidden !important;
      overflow-y: auto;
      overflow: auto;
      font-size: 13px;
      padding-left: 5px;
      padding-right: 5px;
    }
    .dropdown-style.show 
    {
      display: block;
    }
}



</style>