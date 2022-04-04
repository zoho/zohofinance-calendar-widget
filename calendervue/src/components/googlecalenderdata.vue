<template>
  <div>
    <div class="header">
      <googleCalendaricon class="googlecalender-icon" />
      <span class="header-text">Google Event Calender</span>
    </div>

    <!-- .................Filtet-style.................... -->

    <div class="filter-body">
      <!-- ............NAME-Search-style.......... -->

      <div class="filter-fields">
        <span class="filter-fieldlable">Search Event</span>
        <div class="filter-searchinput" >
          <searchicon class="search-icon" />
          <input
            type="text"
            placeholder="Name of Event"
            class="form-input"
            v-model="searchValue"
            ref="autofocus"
            v-on:keyup.enter="filter()"
            tabindex="1"
          />
        </div>
      </div>

      <!-- ...........Date and Time Select..........-->

      <div class="filter-fields" style="width: 56%">
        <span class="filter-fieldlable">Sort by Date & TIme</span>
        <div class="date-filter">
          <!-- ...........From-Date-picker-style.........-->

          <div class="date-picker" >
            <date-picker
              v-model="range"
              mode="date"
              is-range
              class="datepicker-display"
              tabindex="2"
            >
              <template v-slot="{ inputEvents }">
                <span v-on="inputEvents.start"  class="date-inputfield">
                  {{ startDate }}
                </span>
              </template>
            </date-picker>
            <span class="dateandtime-border">|</span>
            <span class="time-picker" tabindex="3">
              <timepicker 
                :timesequenceList="timesequence_array"
                :selected="selectFromTime"
                v-on:updateOption="updateFromTime"
              >
              </timepicker>
            </span>
          </div>

          <arrow class="arrow-icon" />

          <!-- ...........To-Date-picker-style................-->

          <div class="date-picker" >
            <date-picker
              v-model="range"
              mode="date"
              :masks="{ input: ['L', 'YYYY-MM-DD'] }"
              is-range
              class="datepicker-display"
              tabindex="4"
            >
              <template v-slot="{ inputEvents }">
                <div v-on="inputEvents.end" class="date-inputfield">
                  {{ endDate }}
                </div>
              </template>
            </date-picker>
            <span class="dateandtime-border">|</span>
            <span class="time-picker" tabindex="5">
              <timepicker
                :timesequenceList="timesequence_array"
                :selected="selectToTime"
                v-on:updateOption="updateToTime"
              >
              </timepicker>
            </span>
          </div>
        </div>
      </div>

      <!-- ............APPLY-Button-style....................-->

      <div class="buttondiv-width" >
        <span class="filter-fieldlable">&nbsp; </span>
        <button class="apply-button" v-on:click="getCalenderEvent()" tabindex="6">
          Apply
        </button>
      </div>

      <!-- ...................................................-->
    </div>

    <hr class="hr" />

    <!-- ......................Clear-Sorts-style..........-->

    <div class="filter-clear">
      <span>
        <span class="showevent-lable"> Events</span>
        <span class="showevent-date">
          &#8226;&nbsp;&nbsp;{{ this.showFilterDate }}</span
        >
      </span>
      <span class="cleartext-style">
        <clearsorticon class="clear-icon"/>
        <span  @click="clearsort()">Clear Sort</span>
      </span>
    </div>

    <!--.................Calender-Events-List............ -->

    <calenderevantlist
      v-if="!loading && canShowEventList" 
      v-bind:eventlistarray="eventList"
      v-bind:errorMessage="errorMessage"
    />

    <!-- .....................Loading.......................-->

    <loading v-if="loading" />
  </div>
</template>


 <script type="text/javascript" src="js/script.js"></script>

<script>
import { format } from "date-fns";
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import loading from "./loading.vue";
import calenderevantlist from "./calendereventslist.vue";
import timepicker from "../components/timepicker.vue";
import searchicon from "../../public/svgfile/search.svg";
import arrow from "../../public/svgfile/arrow.svg";
import googleCalendaricon from "../../public/svgfile/googleCalendaricon.svg";
import clearsorticon from "../../public/svgfile/Clearsort.svg";

export default {
  components: {
    DatePicker,
    loading,
    calenderevantlist,
    searchicon,
    arrow,
    googleCalendaricon,
    timepicker,
    clearsorticon
  },

  data: function () {
    return {
      eventList: [],
      startDate: "",
      endDate: "",
      range: {start: "",end: "",},
      searchValue: "",
      loading: false,
      showFilterDate: "",
      selectFromTime: {},
      selectToTime: {},
      timesequence_array:[],
      errorMessage:"",
      canShowEventList:false
    };
  },

  watch: {
    range: function () {
      this.startDate = format(this.range.start, "dd/MM/yyyy");
      this.endDate = format(this.range.end, "dd/MM/yyyy");
    },
  },

  created: async function () {
    
    this.options = {
      url: '',

      method: "GET",

      connection_link_name: `${this.$appMeta.calenderconnenction}`,
    };

    this.setTimeSequence();
    this.setAutoFocus();
    this.initialSettings();
    await this.getCalenderEvent();
  },

  methods: {
    setAutoFocus() {
      this.$nextTick(() => {
        this.$refs.autofocus.focus();
      });
    },
     initialSettings() {
      this.range.start = new Date();
      this.range.end = new Date();
      this.startDate = format(this.range.start, "dd/MM/yyyy");
      this.endDate = format(this.range.end, "dd/MM/yyyy");
      this.selectFromTime = this.timesequence_array[0];
      this.selectToTime = this.timesequence_array[23];
    },
    async getCalenderEvent() {

      this.loading = true;

      let startDate = format(this.range.start, "yyyy-MM-dd").concat(
        "T",this.selectFromTime.hour,":",this.selectFromTime.minute,":",this.selectFromTime.second);
        
      let endDate = format(this.range.end, "yyyy-MM-dd").concat(
        "T",this.selectToTime.hour,":",this.selectToTime.minute,":",this.selectFromTime.second);

      let searchParam = this.searchValue ? `&q=${this.searchValue}` : '';

      let apiUrl= `${this.$appMeta.calender_Apiurl}calendars/primary/events?timeMax=${endDate}Z&timeMin=${startDate}Z${searchParam}`

      this.options.url=apiUrl;
      
      this.showFilterDate = format(this.range.start, "MMM dd").concat(" - " + format(this.range.end, "MMM dd"));

      try {
        let { data: { body } } = await ZFAPPS.request(this.options);

        let { items } = JSON.parse(body);

        if (items?.length) 
        {
          this.eventList = items;
        }
        else
        {
          this.errorMessage ="no result found in the given criteria";
          this.eventList = [];
          throw this.errorMessage;
        }
      }
      catch(err) {
        console.log(err);
      }
      finally {
        this.canShowEventList=true;
        this.loading = false;
      }
     
    },

    clearsort() {
      this.searchValue = "";
      this.range = {};
      this.initialSettings();
      this.getCalenderEvent();
    },

    updateFromTime(value) {
      this.selectFromTime = value;
    },
    updateToTime(value) {
      this.selectToTime = value;
    },
    setTimeSequence() {
      for (let i=1; i<=24; i++)
      {
        if (i<=12)
        {
          this.timesequence_array.push({ hour: i, minute: '00',second:'00',time: 'AM' });
          this.timesequence_array.push({ hour: i, minute: '30',second:'00',time: 'AM' }) 
           
        }
        else
        {
          this.timesequence_array.push({ hour: i-12, minute: '00',second:'00',time: 'PM' });
          this.timesequence_array.push({ hour: i-12, minute: '30',second:'00',time: 'PM' }) 
        }
      }
      
    },
  },
};
</script>
<style scoped >
::v-deep .vc-header {
  border-bottom: 1px solid #e6e9f5 !important ;
  padding-bottom: 14px !important;
  margin-bottom: 15px !important;
}

::v-deep .vc-container .vc-container {
  border-top: 1px solid #408dfb !important;
}
::v-deep .vc-popover-caret {
  border-top: 1px solid#408dfb !important;
  border-left: 1px solid#408dfb !important;
  z-index: 0 !important;
}
::v-deep .vc-highlight {
  border-radius: 6px !important;
}
::v-deep .vc-day-content {
  border-radius: 6px !important;
}
::v-deep .vc-highlight.vc-highlight-base-middle {
  background-color: #eaf1fb !important;
}
::v-deep .vc-highlight.vc-highlight-base-start {
  background-color: #eaf1fb !important;
}
::v-deep .vc-highlight.vc-highlight-base-end {
  background-color: #eaf1fb !important;
}
::v-deep .vc-svg-icon {
  border-radius: 12px !important;
  border: 1px solid #616e8633 !important;
  padding: 3px;
}
::v-deep .vc-svg-icon:hover {
  border-radius: 12px !important;
}
::v-deep .vc-arrow:hover {
  border-radius: 12px !important;
  background-color: transparent !important;
}
::v-deep .vc-container.vc-blue {
  box-shadow: #e6e9f5 0px 0px 0.25em, #e6e9f5 0px 0.25em 1em !important;
}
::v-deep #iframe {
  border-radius: 15px !important;
}
/* .date-filter .date-picker .date-inputfield:focus-visible{
  outline: none !important;
  border-color: #4891fa !important;
}
.date-filter .date-picker .datepicker-display:focus-visible
{
  outline: none !important;
  border:1px solid red !important;
} */
</style>