<template>
  <div>
    <div class="eventlist-container" v-if="eventList.length">
      <!-- ..............LIST-OF-EVENTS............... -->

      <div v-for="(data, index) in eventList" :key="index" class="listofevent-style" :class="data.description?'':' empty-description'" ref="eventSelected"
        v-on:click="selectEvents(index, data)">
        <!-- ..............Check-Box................ -->
        <span class="checkbox-spanstyle">
          <input type="checkbox" class="checkbox-style" ref="checkBox"/>
        </span>

        <!-- ..............Summary and description....-->
        <span class="summaryanddescritption" :class="data.description?'':'d-flex'">
          <!-- ............Events-Summary..............-->

          <span class="contentsummary-style">
            <span>{{ data.summary }}</span>
            <span class="summarydate-style">{{ data.start.dateTime }}<span class="slash-style">&nbsp;|&nbsp;</span>{{data.start.time}}</span>
          </span>

          <!-- ...........Event-Description............-->

          <span class="discription-container">
            <span class="discription-content" ref="description">
              <span>{{ data.description }}</span>
              <span class="view-moredetail " v-if="isBigDescriptionLength(data)"
                v-on:click.stop="getMoreDetails(index)">show less
              </span>
            </span>
            <span class="view-moredetail display-block" ref="showmore" 
              v-on:click.stop="getMoreDetails(index)"><span v-if="isBigDescriptionLength(data)">show more</span>
            </span>
          </span>
        </span>
      </div>
    </div>

    <!-- .....................Empty Event ......................... -->
    <div class="empty-data" v-if="!eventList.length">
      <emptydata />
      <span class="error-message">{{ errorMessage }}</span>
    </div>

    <!-- .................... Add to invoice button........................ -->
    <div class="footer">
      <hr class="hr" />
      <button :class="eventList.length && line_items.length? 'botton' : 'disabled-button'" v-on:click="addtoInvoice()">
        Add to invoice
      </button>
      <span class="selectevent-count" v-if="selectEventCount">
        {{ selectEventCount }}&nbsp;&nbsp;selected
      </span>
    </div>

  </div>
</template>

 <script type="text/javascript" src="js/script.js"></script>

<script>
import { format } from "date-fns";
import emptydata from "../../public/svgfile/noEvent.svg";

export default {
   props: {
    eventlistarray: {
      type: [Array, Object],
    },
    errorMessage: [String],
  },
  components: {
    emptydata,
  },

  data() {
    return {
      eventList: [],
      custom_field: [],
      line_items: [],
      selectEventCount: "",
      organizationId:""
    };
  },
  
  
  created: async function () {

    this.apiParameterOptions= {
        url: "",
        method: "GET",
        connection_link_name: `${this.$appMeta.bookconnenction}`,
      };

    this.eventList = this.eventlistarray;
    if (this.eventList.length) {
      this.initialSettings();
      await this.getOrganizationDetail();
      await this.getInvoiceStructureDetails();
    }
  },
  methods: {

    isBigDescriptionLength(data){
      return data.descriptionlength > 72;
    },
    //adding initial data's in your eventList//
    initialSettings()
    {
        this.eventList.forEach((element) => {
        element.start.time=format(new Date(element.start.dateTime),"hh:mm aa ");
        element.start.dateTime = format(new Date(element.start.dateTime),"dd/MM/yyyy");
        element.descriptionlength = element.description?.length;
        element.showmore = false;
      });
    },

    //get current organization details //

    async getOrganizationDetail() {
      try {
        let getOrganizationDetail = await window.ZFAPPS.get("organization");
        this.organizationId =getOrganizationDetail.organization.organization_id;
      } catch (err) {
        console.log(err);
      }
    },
    //get sample invoice structure details//
    async getInvoiceStructureDetails() {
      
      let apiUrl = `${this.$appMeta.books_Apiurl}invoices/editpage?organization_id=${this.organizationId}`
      this.apiParameterOptions.url=apiUrl;
      try {
        let getinvoicestructure = await window.ZFAPPS.request(this.apiParameterOptions);
        this.custom_field = JSON.parse(getinvoicestructure.data.body)?.item_custom_fields;
      } catch (err) {
        console.log(err);
      }
    },
    //select the Events //
    selectEvents(index, value) {
      let geteventCheckBoxref = this.$refs.checkBox[index];
      let getSummaryDivElementref = this.$refs.eventSelected[index];

      getSummaryDivElementref.checked = !getSummaryDivElementref.checked;

      if (getSummaryDivElementref.checked) {
        this.line_items.push({
          name: " ",
          description: value.summary + "\n" + value.description,
          item_custom_fields: this.custom_field,
          eventid: value.id,
        });
        geteventCheckBoxref.checked = true;

        getSummaryDivElementref.classList.add("bg-color");
      } else {
        this.line_items = this.line_items.filter((data) => {
          return data.eventid != value.id;
        });
        geteventCheckBoxref.checked = false;
        getSummaryDivElementref.classList.remove("bg-color");
      }
      this.selectEventCount = this.line_items.length
        ? this.line_items.length
        : "";
    },

    //select the events are add in your invoice list//
    async addtoInvoice() {
      let invoice_items = [];
      try {
        let getInvoiceDetail = await window.ZFAPPS.get("invoice");
        invoice_items = getInvoiceDetail.invoice.line_items;

        if (invoice_items.length) {
          invoice_items.forEach((item) => {
            let getCustomField = item.item_custom_fields;
            getCustomField.forEach((element, index) => {
              let value = element.value;
              getCustomField[index] = { ...this.custom_field[index] };
              getCustomField[index].value = value;
            });
          });
        }
        await this.setInvoiceLineitem(invoice_items);
      } catch (err) {
        console.log(err);
      }
    },
    async setInvoiceLineitem(invoiceitems) {
      await window.ZFAPPS.set(
        "invoice.line_items",
        invoiceitems.concat(this.line_items)
      )
        .then(() => {
          this.closeModal();
        })
        .catch(() => {});
    },

    getMoreDetails(index) {
      let getDescriptionRef=this.$refs.description[index];
      let getShowmoreRef=this.$refs.showmore[index];

      this.eventList[index].showmore=!this.eventList[index].showmore;

      if(this.eventList[index].showmore==true)
      {
        getShowmoreRef.classList.add('display-none');
        getDescriptionRef.classList.add('background-height');
      }
      else
      {
        getShowmoreRef.classList.remove('display-none');
        getDescriptionRef.classList.remove('background-height');
      }
    },

    closeModal() {
      ZFAPPS.closeModal();
    },
  },
};
</script>
<style lang="scss" scoped>

.bg-color {
  background-color: #f6f7fb;
}
.background-height
{
  height: 100% !important;
}
.display-block
{
  display: block;
}
.display-none
{
  display: none !important;
}
.empty-description{
    align-items: center;
    line-height: 44px;
}
.d-flex
{
  display: flex;
}
.slash-style
{
  color:#80808047;
}
</style>

