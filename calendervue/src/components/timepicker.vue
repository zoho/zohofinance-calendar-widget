<template>
  <div class="dropdown" ref="dropdownMenu" >
    <span @click="toggleMenu" class="dropdown-toggle " v-if="selected">
        {{ selected.hour}} : {{selected.minute}} : {{selected.time}}
    </span>

    <div class="content-style" v-if="showMenu" >
      <div class="scrollstyle">
        <span v-for="(option,index) in timeList" :key="index" class="dropdown-options" @click="$emit('updateOption', option) , showMenu = false">
          {{ option.hour }} : {{option.minute}} {{option.time}}  
        </span>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      showMenu:false,
      timeList:[],
    };
  },
  props: {
    timesequenceList: {
      type: [Array],
    },
    selected: {},
    
  },
 
  async created() 
  {
    this.timeList=this.timesequenceList;
    this.updateOption(this.selected);
  },
  
  methods: {
    documentClick(e) {
      let el = this.$refs.dropdownMenu;
      let target = e.target;
      if (el !== target && !el.contains(target)) {
        this.showMenu = false;
        this.removeDropdownListener();
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
      if(this.showMenu)
      {
        document.addEventListener("click", this.documentClick);
      }
    },
    updateOption(option) {
      this.showMenu = false;
      this.$emit("updateOption", option);
      this.removeDropdownListener();
    },
    removeDropdownListener()
    {
      document.removeEventListener("click", this.documentClick);
    }
  },
};
</script>

