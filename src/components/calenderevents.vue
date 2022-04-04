<template>
  <div>
    <div class="content-style" v-if="dataarray.length > 0">
      <div v-for="(data, index) in dataarray" :key="index" class="contentdata-style" ref="rolesSelected" v-on:click="collectionitem(index,$refs.rolesSelected,$event,data)">
        <div style="width:4%" >
          <input type="checkbox" class="checkbox-style" ref="checkBox"  />
        </div>
        <div style="width:100%">
          <div class="contentsummary-style">
            <div class="summarytext-style">{{ data.summary }}</div>
            <div class="contentdate-style">{{data.start.dateTime}}</div>
          </div>
          <div class="discriptioncontainer-style">
            <div ref="hiddenelement" class="contentdiscription-style">
              <span>{{data.description}}</span>
              <br>
              <span v-if="data.descriptionlength>72 && showmore==false" @click.stop="showlesstext($refs.hiddenelement,index)"  class="showmoreandless-style">show less</span>
            </div>

            <span class="showmoreandless-style" v-if="data.descriptionlength>72 && showmore" @click.stop="seemoretext($refs.hiddenelement,index)"><span style="color: rgb(117, 133, 153)">....</span>show more</span>
          </div>
        </div>
        
      </div>
    </div>
   
     <div style="" class="nodata-style" v-if="dataarray.length==0">
       <span style="display:block"><emptydata style="width:28%"/></span>
       <span style="" class="nodatatext-style">NO Such Event name was found</span>
    </div>  
    <div class="footer-style">
      <hr class="hr-style" />
        <button :class="dataarray.length>0 && line_items.length>0? 'addingbtn-style':'disabled-aadingbtnstyle'" v-on:click="addtoinvoice()">
          Add to invoice
        </button>
    </div>
  </div>
</template>





<script type="text/javascript" src="js/script.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>


<script>
import nodata from "../../public/newsvg/nodata.svg";
import emptydata from "../../public/newsvg/noEvent.svg";
import { format } from 'date-fns'



export default {

    props: ["eventlistarray"],

    components: {
      nodata,
      emptydata
  },

  data: function () {
    return {
      dataarray: [],
      custom_field:[],
      line_items: [],
       date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      checkbox:false,
      showmore:true
    };
  },

  watch: {
   
  },
  created: async function () {
    this.dataarray=this.eventlistarray;

    this.dataarray.forEach(data => {
      data.descriptionlength=data.description?.length;
    });
    if(this.dataarray.length>0)
    {
       this.dataarray.forEach(data => {
         let datevar=new Date(data.start.dateTime);
       
        data.start.dateTime=format(datevar, "dd mm yyyy  .  hh:mm aa ");
      });
      await this.getinvoicedetils();
     await ZFAPPS.get("invoice")
      .then(function (res) {
       this.line_items = res.invoice.line_items;
      })
      .catch(function (err) {});
   await AppInstance.instance.on("INVOICE_SAVED", async (res)=> {
      this.line_items = [];
    });
   await AppInstance.instance.on("ON_INVOICE_CHANGE", async (data)=> {
      this.line_items = data.line_items;
    });
    
      
    }
    
   
  },
  methods: {
    
    async collectionitem(index, ref, event, value) 
    {
      let checkBox =this.$refs.checkBox[index] ; 
      let parentdiv=this.$refs.rolesSelected[index];

      parentdiv.checked = !parentdiv.checked;
      
      if(parentdiv.checked)
      {
        this.line_items.push({
          name: " ",
          description: value.summary+"\n"+value.description,
          item_custom_fields: this.custom_field,
        });
        checkBox.checked=true;
        parentdiv.style.backgroundColor = "#F6F7FB";
      }
      else
      {
        if(this.line_items.length>0)
        {
          this.line_items.forEach((data,i) => 
          {
              if(this.line_items[index].description == value.summary+"\n"+value.description) 
              {
                this.line_items.splice(i, 1);
              }
          });
        }
         checkBox.checked=false;
         parentdiv.style.backgroundColor = "";
      }
      
    
    },

   async addtoinvoice() {
      let invoice_items = [];
      await ZFAPPS.get("invoice")
        .then((res) => {
          invoice_items = res.invoice.line_items;
        })
        .catch(function (err) {});

      if (invoice_items.length > 0) {
        invoice_items.forEach((item) => {
          let getcustomfield = item.item_custom_fields;

          getcustomfield.forEach((element, index) => {
            let value = element.value;
            getcustomfield[index] = { ...this.custom_field[index] };
            getcustomfield[index].value = value;
          });
        });
      }

      await ZFAPPS.set(
        "invoice.line_items",
        invoice_items.concat(this.line_items)
      )
        .then((res) => {
          this.$parent.closeModal();
        })
        .catch(function (err) {});
      
    },
   
    async getinvoicedetils() {
      
      await ZFAPPS.get("organization")
        .then((data) => {
          this.organization_id = data.organization.organization_id;
        })
        .catch((err) => {});

      let apiurl = {
        url: `${this.$appMeta.books_Apiurl}invoices/editpage?organization_id=${this.organization_id}`,
        method: "GET",
        connection_link_name: `${this.$appMeta.bookconnenction}`,
      };
      await ZFAPPS.request(apiurl)
        .then(async (value) => {
          let res = JSON.parse(value.data.body);
          this.custom_field = res.item_custom_fields;
        })
        .catch(function (err) {});
    },
    seemoretext(ref,index)
    {
      this.showmore=false;
      ref[index].style.height='100%';
    },
    showlesstext(ref,index)
    {
      this.showmore=true;
      ref[index].style.height='21px';
    }
    
  },
};
</script>
<style scoped  lang="scss">
.content-style {
  overflow: scroll;
  overflow-x: hidden;
  height: 407px;

  .contentdata-style {
  padding: 15px 19px;
  text-align: initial;
  border-bottom: 1px solid #EAF1FB;
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #333333;
  align-items:center;
  cursor: pointer;
}

}

.nodata-style
{
  text-align:center;
  position: relative;top: 69px;
  .nodatatext-style
  {
    display:block;
    color: #6C859D;
    font-size: 14px;
  }
}
.footer-style {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: white;
  padding-bottom: 10px;
}
.hr-style {
  margin-top: 0px;
  margin-bottom: 14px;
  border: 0;
  border-top: 1px solid #EAF1FB;
}
.addingbtn-style {
  padding: 10px;
  position: relative;
  left: 11px;
  border-radius: 5px;
  border: none;
  background-color: #408DFB;
  color: white;
  font-size: 15px;
  font-weight: 600;
}
.disabled-aadingbtnstyle
{
    font-weight: 500;
    padding: 10px;
    position: relative;
    left: 19px;
    border-radius: 6px;
    border: none;
    background-color: #F1F4FD;
    color: white;
    font-size: 15px;
    color: #C2C6D9;
    cursor: not-allowed;
}
.checkbox-style
{
  cursor: pointer;
  width: 15px; 
  height: 17px;
}
.contentsummary-style
{
  display:flex;
  width:100%;
  align-items:center;
  justify-content: space-between;

.summarytext-style
{
  display:block;
  font-size:14px
}
  .contentdate-style
{
  display:block;
  font-size: 12px;
  color: #758599;
}
}

.discriptioncontainer-style
{
  display: flex;
  align-items: end;

  .contentdiscription-style
{
    word-break: break-all;
    color: rgb(117, 133, 153);
    height: 21px;
    overflow: hidden;
    margin-top: 6px;
    width:71%
}
.showmoreandless-style
{
  color:#408DFB;
  font-weight: 500;
  font-size:13px
}
}

</style>