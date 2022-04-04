import Vue from 'vue';
import App from './App.vue';
import Calendar from 'v-calendar/lib/components/calendar.umd'
import DatePicker from 'v-calendar/lib/components/date-picker.umd'


Vue.config.productionTip = false

window.ZFAPPS.extension.init().then(async function(AppInstance){
 window.ZFAPPS.invoke('RESIZE', { height: "700px", width: "900px" }).then(() => {
  });
  window.AppInstance = AppInstance;
  var vm =new Vue({
    AppInstance: AppInstance,
    ZFAPPS:window.ZFAPPS,
    render: h => h(App),
    
  }).$mount('#app');
  global.vm = vm;
});
Vue.prototype.$appMeta = {
  
  calender_Apiurl:"https://www.googleapis.com/calendar/v3/",
  books_Apiurl:"https://books.zoho.com/api/v3/",
  bookconnenction:"zohobooks",
  calenderconnenction:"googlecalender",
};

Vue.component('calendar', Calendar)
Vue.component('date-picker', DatePicker)

