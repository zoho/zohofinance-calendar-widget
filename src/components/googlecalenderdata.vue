<template>
  <div>
    
   <div style="" class="header-style">
      <span style="display:flex"><googleCalendaricon style="" class="googleicon-style"/></span>
      <span class="headertext-style" >Google Event Calender</span>
    </div>
    <br><br>
    
    <div style="padding: 0px 19px">
      <div style="display: flex">
        <div class="filterfield-style" style="width: 30%">
          <span class="filterlable-style">Search Event</span>
          <div class="filterinput-style" style="padding: 8px 9px !important;">
            <searchicon style="width:16px"/>
            <div>
               <input type="text" placeholder="Name of Event"  class="forminput-style" v-model="searchvalue" ref="autofocus" v-on:keyup.enter="filter()"/>
            </div>
          </div>
        </div>
        <div class="filterfield-style" style="width:56%" >
          <span class="filterlable-style">Sort by Date & TIme</span>
          <div class="datefilter-style" >
            <div class="datepicker-style">
              <date-picker  v-model="range" mode="date" :masks="{ input: ['L', 'YYYY-MM-DD'] }" is-range >
                <template v-slot="{ inputEvents } ">
                  <div style="display: flex; align-items: center">
                    <div v-on="inputEvents.start"  class="dateinput-style">{{ startdate }}</div>
                    <div style="width:8%;color: #0000002b;">|</div>
                    <div style="position: relative" >
                        <timepicker v-if="dropdown"
                            :options="Fromtimearray"
                            :selected="selectfromtime"
                            v-on:updateOption="updatefromtime"
                        >
                        </timepicker>
                    </div>
                  </div>
                </template>
              </date-picker>
            </div>

            <arrow class="arrow-style"/>

            <div class="datepicker-style">
              <date-picker  v-model="range" mode="date" :masks="{ input: ['L', 'YYYY-MM-DD'] }" is-range >
                <template v-slot="{ inputEvents } ">
                  <div style="display: flex; align-items: center">
                    <div v-on="inputEvents.end" class="dateinput-style">{{ enddate }}</div>
                    <div style="width:8%;color: #0000002b;">|</div>
                    <div style="position: relative" >
                      <timepicker v-if="dropdown"
                        :options="Totimearray"
                        :selected="selecttotime"
                        v-on:updateOption="updatetotime"
                      >
                      </timepicker>
                    </div>
                  </div>
                </template>
              </date-picker>
            </div>
          </div>
        </div>

        
        <div style="width:14%">
          <span class="filterlable-style">&nbsp; </span>
          <button class="applybutton-style" v-on:click="filter()">Apply</button>
        </div>
      </div>

      
    </div>
    <br />
    <hr class="hr-style" />
    <div style="padding: 0px 19px">
      <div  class="clearfilter-style">
        <div>
          <span  class="eventlable-style"> Events</span>
          <span  class="datereference-style"> &#8226;&nbsp;&nbsp;{{ this.daterangereference }}</span>
        </div>
        <div style="cursor: pointer">
          <span  class="cleartext-style" @click="clearsort()">Clear Sort</span>
        </div>
      </div>
    </div>

    <calenderevantlist
    v-if="!loading && calleventcomponent"
      v-bind:eventlistarray="dataarray"
    />

    <div>
      <loading v-if="loading" />
    </div>
   
  </div>
</template>




// <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>

<script type="text/javascript" src="js/script.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>


<script>
import Calendar from "v-calendar/lib/components/calendar.umd";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import loading from "./loading.vue";
import calenderevantlist from "./calenderevents.vue";
import searchicon from "../../public/newsvg/search.svg";
import arrow from "../../public/newsvg/arrow.svg";
import infosvg from "../../public/newsvg/Info.svg";
import importantnote from "../../public/newsvg/importantnote.svg";
import googleCalendaricon from "../../public/newsvg/googleCalendaricon.svg";
import arrow2 from "../../public/newsvg/arrow2.svg";
import timepicker from "../components/timepicker.vue"

export default {
  components: {
    Calendar,
    DatePicker,
    loading,
    calenderevantlist,
    searchicon,
    arrow,
    infosvg,
    importantnote,
    googleCalendaricon,
    arrow2,
    timepicker
  },

  data: function () {
    return {
      stdate: "",
      dataarray: [],
      startdate:new Date(),
      enddate: new Date(),
      line_items: [],
      checkvalue: "",
      range: {
        start: new Date(),
        end: new Date(),
      },
      masks: {
        input: "YYYY-MM-DD h:mm A",
      },
      dateref: "",
      timezone: "",

      searchvalue: "",
      startingimg: false,
      selectedDate: "",
      isemptyimg: false,
      loading: false,
      daterangereference: "",
      fromtime: "",
      totime: "",
      starttimeui: "",
      endtimeui: "",
      ischeck: true,
      timemanage: "",
      timestore: "",
      custom_field: [],
      calleventcomponent: false,
      findtimerange:"",
      timerange:{
         starttime: new Date(),
        endtime: new Date(),
      },
      startingtime:"",
      endingtime:"",
      selectedDepartment:"",
      dropdowndataarray:[],
      dropdown:true,
      timepicker,
      Fromtimearray:[
                     {hour:'12',minute:'00',find:'AM'},
                     {hour:'12',minute:'30',find:'AM'},
                     {hour:'01',minute:'00',find:'AM'},
                     {hour:'01',minute:'30',find:'AM'},
                     {hour:'02',minute:'00',find:'AM'},
                     {hour:'02',minute:'30',find:'AM'},
                     {hour:'03',minute:'00',find:'AM'},
                     {hour:'03',minute:'30',find:'AM'},
                     {hour:'04',minute:'00',find:'AM'},
                     {hour:'04',minute:'30',find:'AM'},
                     {hour:'05',minute:'00',find:'AM'},
                     {hour:'05',minute:'30',find:'AM'},
                     {hour:'06',minute:'00',find:'AM'},
                     {hour:'06',minute:'30',find:'AM'},
                     {hour:'07',minute:'00',find:'AM'},
                     {hour:'07',minute:'30',find:'AM'},
                     {hour:'08',minute:'00',find:'AM'},
                     {hour:'08',minute:'30',find:'AM'},
                     {hour:'09',minute:'00',find:'AM'},
                     {hour:'09',minute:'30',find:'AM'},
                     {hour:'10',minute:'00',find:'AM'},
                     {hour:'10',minute:'30',find:'AM'},
                     {hour:'11',minute:'00',find:'AM'},
                     {hour:'11',minute:'30',find:'AM'},
                     {hour:'12',minute:'00',find:'PM'},
                     {hour:'12',minute:'30',find:'PM'},
                     {hour:'01',minute:'00',find:'PM'},
                     {hour:'01',minute:'30',find:'PM'},
                     {hour:'02',minute:'00',find:'PM'},
                     {hour:'02',minute:'30',find:'PM'},
                     {hour:'03',minute:'00',find:'PM'},
                     {hour:'03',minute:'30',find:'PM'},
                     {hour:'04',minute:'00',find:'PM'},
                     {hour:'04',minute:'30',find:'PM'},
                     {hour:'05',minute:'00',find:'PM'},
                     {hour:'05',minute:'30',find:'PM'},
                     {hour:'06',minute:'00',find:'PM'},
                     {hour:'06',minute:'30',find:'PM'},
                     {hour:'07',minute:'00',find:'PM'},
                     {hour:'07',minute:'30',find:'PM'},
                     {hour:'08',minute:'00',find:'PM'},
                     {hour:'08',minute:'30',find:'PM'},
                     {hour:'09',minute:'00',find:'PM'},
                     {hour:'09',minute:'30',find:'PM'},
                     {hour:'10',minute:'00',find:'PM'},
                     {hour:'10',minute:'30',find:'PM'},
                     {hour:'11',minute:'00',find:'PM'},
                     {hour:'11',minute:'30',find:'PM'},
                     ],

      Totimearray:[
                     {hour:'12',minute:'00',find:'AM'},
                     {hour:'12',minute:'30',find:'AM'},
                     {hour:'01',minute:'00',find:'AM'},
                     {hour:'01',minute:'30',find:'AM'},
                     {hour:'02',minute:'00',find:'AM'},
                     {hour:'02',minute:'30',find:'AM'},
                     {hour:'03',minute:'00',find:'AM'},
                     {hour:'03',minute:'30',find:'AM'},
                     {hour:'04',minute:'00',find:'AM'},
                     {hour:'04',minute:'30',find:'AM'},
                     {hour:'05',minute:'00',find:'AM'},
                     {hour:'05',minute:'30',find:'AM'},
                     {hour:'06',minute:'00',find:'AM'},
                     {hour:'06',minute:'30',find:'AM'},
                     {hour:'07',minute:'00',find:'AM'},
                     {hour:'07',minute:'30',find:'AM'},
                     {hour:'08',minute:'00',find:'AM'},
                     {hour:'08',minute:'30',find:'AM'},
                     {hour:'09',minute:'00',find:'AM'},
                     {hour:'09',minute:'30',find:'AM'},
                     {hour:'10',minute:'00',find:'AM'},
                     {hour:'10',minute:'30',find:'AM'},
                     {hour:'11',minute:'00',find:'AM'},
                     {hour:'11',minute:'30',find:'AM'},
                     {hour:'12',minute:'00',find:'PM'},
                     {hour:'12',minute:'30',find:'PM'},
                     {hour:'01',minute:'00',find:'PM'},
                     {hour:'01',minute:'30',find:'PM'},
                     {hour:'02',minute:'00',find:'PM'},
                     {hour:'02',minute:'30',find:'PM'},
                     {hour:'03',minute:'00',find:'PM'},
                     {hour:'03',minute:'30',find:'PM'},
                     {hour:'04',minute:'00',find:'PM'},
                     {hour:'04',minute:'30',find:'PM'},
                     {hour:'05',minute:'00',find:'PM'},
                     {hour:'05',minute:'30',find:'PM'},
                     {hour:'06',minute:'00',find:'PM'},
                     {hour:'06',minute:'30',find:'PM'},
                     {hour:'07',minute:'00',find:'PM'},
                     {hour:'07',minute:'30',find:'PM'},
                     {hour:'08',minute:'00',find:'PM'},
                     {hour:'08',minute:'30',find:'PM'},
                     {hour:'09',minute:'00',find:'PM'},
                     {hour:'09',minute:'30',find:'PM'},
                     {hour:'10',minute:'00',find:'PM'},
                     {hour:'10',minute:'30',find:'PM'},
                     {hour:'11',minute:'00',find:'PM'},
                     {hour:'11',minute:'30',find:'PM'},
        ],

      selectfromtime:{},
      selecttotime:{}
      
      
    };
  },

  
  watch: {
    range: function () {
      this.startdate = moment(this.range.start).format("DD/MM/YYYY");
      this.enddate = moment(this.range.end).format("DD/MM/YYYY");
    },
   

  },
  mounted:()=>{
 
  
  },
  created: async function () {
   this.$nextTick(function()  {
          this.$refs.autofocus.focus();
      });
    this.loading = true;
   
    await this.initialstate();
    setTimeout(async() => {
      await this.filter();
    }, 1000);
    
  },
  
  methods: {
    
   async initialstate()
    {
      this.range.start=new Date();
      this.range.end=new Date();
      this.startdate = moment(this.range.start).format("DD/MM/YYYY");
      this.enddate = moment(this.range.end).format("DD/MM/YYYY");
    },
    async getcalenderevent() 
    {
      

      let options = "";

      let startdate = moment(this.range.start).format("YYYY-MM-DD").concat("T",this.selectfromtime.hour,":",this.selectfromtime.minute,":","00")
      let enddate = moment(this.range.end).format("YYYY-MM-DD").concat("T",this.selecttotime.hour,":",this.selecttotime.minute,":","00")

      if (this.searchvalue != "") 
      {
        options = {
          url: `${this.$appMeta.calender_Apiurl}calendars/primary/events?timeMax=${enddate}Z&timeMin=${startdate}Z&q=${this.searchvalue}`,

          method: "GET",

          connection_link_name: `${this.$appMeta.calenderconnenction}`,
        };
      }
      else 
      {
        options = {
          url: `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMax=${enddate}Z&timeMin=${startdate}Z`,

          method: "GET",

          connection_link_name: "googlecalender",
        };
      }
      return await window.ZFAPPS.request(options)
        .then(async (value) => {
          let eventarray = JSON.parse(value.data.body);

          this.daterangereference = moment(this.range.start).format("MMM DD").concat(" - " + moment(this.range.end).format("MMM DD"));

          if (eventarray.items) 
          {
            return eventarray.items;
          }
          else 
          {
            return [];
          }

        })
        .catch((err) => {
          console.log(err);
        });
    },

    async filter() 
    {
      
      this.loading = true;
      
      let temparray = await this.getcalenderevent();
      if(temparray)
      {
        this.dataarray = temparray;
        this.calleventcomponent=true;
        this.loading = false;
      }
      else
      {
          this.dataarray = [];
          this.loading = false;
      }
      
    },

    closeModal() 
    {
      window.ZFAPPS.closeModal();
    },

    clearsort() 
    {
      setTimeout(() => {
        this.searchvalue="";
        this.range={},          
        this.initialstate();
        this.filter();
      }, 500);
    },
   
   
    refreshcall()
    {
      location.reload();
    },

    
    updatefromtime(value)
    {
      this.selectfromtime = value ;

    },
    updatetotime(value)
    {
      this.selecttotime=value;
    }

  },
};
</script>
<style scoped lang="scss">


.header-style
{
    padding: 0px 19px;
    display:flex;
    align-items:center;
    box-shadow: #cbcede 0px 0px 4px 0px
}
.headertext-style 
{
  font-size: 15px; 
  font-weight: 600;
  color: #333333;
}
.googleicon-style
{
  width: 33px;
  height: 62px;
}
.filterfield-style
{
  padding-right: 10px;
  .filterlable-style {
    font-size: 13px;
    font-weight: 500;
    color: #333333;
}
.filterinput-style {
  border: 1px solid #DEE1EE;
  padding: 0px !important;
  border-radius: 6px;
  margin-top: 10px;
  display: flex;
}
}
.datefilter-style
{
  display:flex;
  margin-top:10px;
  .datepicker-style
  {
    border: 1px solid #DEE1EE;
    border-radius: 5px;
    width:75%
  }
  .dateinput-style 
  {
    width: 56%;
    border-radius: 4px;
    line-height: 34px;
    padding-left: 7px;
    border: 1px solid transparent;
  }
  .dateinput-style:hover
  {
    border: 1px solid #4891FA;
  }
}
.clearfilter-style
{
    display: flex; 
    justify-content: space-between;
    align-items:center;

    .eventlable-style
    {
        font-size: 15px;
        color:#333333;
        font-weight:600
    }
    .datereference-style
    {
      margin-left: 2px;
      font-size: 13px;
      font-weight: 400;
      color: #4D5C6D !important;
    }
    .cleartext-style
    {
      font-size: 13px; 
      color: #408DFB;
      font-weight: 500
    }
}

.hr-style 
{
    margin-top: 0px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #EAF1FB;
}
::placeholder 
{
  color: #788497ca;
  font-size: 13px;
}
.forminput-style
{
  width: 100%;
  border: none;
  line-height: 1.4;
  padding-left: 7px;
}
.forminput-style:focus
{
  outline: none;
  width: 100%;
}


.applybutton-style {
    padding: 9px;
    margin-top: 28px;
    width: 100%;
    border-radius: 6px;
    border: none;
    background-color: #408DFB;
    color: #FFFFFF;
    font-size: 13px;
    font-weight: 600;
}
.arrow-style
{
    width: 34px;
    padding-left: 7px;
    padding-right: 10px;
}

::v-deep .vc-header{
border-bottom: 1px solid #E6E9F5 !important ;
padding-bottom:14px !important;
margin-bottom: 15px !important;
}

::v-deep .vc-container .vc-container
{
  border-top: 1px solid #4891FA !important;

}
::v-deep .vc-popover-caret
{
  border-top: 1px solid#4891FA !important;
  border-left: 1px solid#4891FA !important;
  z-index: 0 !important;
}
::v-deep .vc-highlight
{
  border-radius: 6px !important;
}
::v-deep .vc-day-content
{
  border-radius: 6px !important;
}
::v-deep .vc-highlight.vc-highlight-base-middle
{
  background-color:#EAF1FB !important;
}
::v-deep .vc-highlight.vc-highlight-base-start
{
  background-color:#EAF1FB !important;
}
::v-deep .vc-highlight.vc-highlight-base-end
{
  background-color:#EAF1FB !important;
}
::v-deep .vc-svg-icon
{
    border-radius: 12px !important;
    border: 1px solid #616e8633 !important;
    padding: 3px;
}
::v-deep .vc-svg-icon:hover
{
    border-radius: 12px !important;

}
::v-deep .vc-arrow:hover
{
      border-radius: 12px !important;
      background-color: transparent !important;

}
::v-deep .vc-container.vc-blue
{
    box-shadow: #E6E9F5 0px 0px 0.25em, #E6E9F5 0px 0.25em 1em !important;

}


::v-deep #iframe
{
  border-radius: 15px !important;
}
</style>