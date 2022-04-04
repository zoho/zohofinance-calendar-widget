import Vue from 'vue';
import App from './App.vue';



Vue.config.productionTip = false

window.ZFAPPS.extension.init().then(async function(AppInstance){
 window.ZFAPPS.invoke('RESIZE', { height: "700px", width: "900px" }).then(() => {
  });
  window.AppInstance = AppInstance;
 new Vue({
    AppInstance: AppInstance,
    ZFAPPS:window.ZFAPPS,
    render: h => h(App),
    
  }).$mount('#app');
});

Vue.prototype.$appMeta = {
  
  calender_Apiurl:"https://www.googleapis.com/calendar/v3/",
  books_Apiurl:"https://books.zoho.com/api/v3/",
  bookconnenction:"zohobooks",
  calenderconnenction:"googlecalender",
};



