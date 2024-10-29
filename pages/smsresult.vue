<template>
  <div class="sms-page">
    <el-card class="card-wrapper">
      <el-card class="card-filter">
      <el-select v-model="selectedSearchType" placeholder ="ประเภท SMS" clearable >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="selectsentsms" clearable placeholder="สถานะการส่ง SMS" style="margin-left: 5px;">
        <el-option
          v-for="items in selectSMSOption"
          :key="items.smsvalue"
          :label="items.smslabel"
          :value="items.smsvalue">
        </el-option>
      </el-select>
          <el-date-picker
              v-model="dateRange"
              type="daterange"
              unlink-panels
              range-separator="-"
              start-placeholder="เริ่มวันที่"
              end-placeholder="สิ้นสุดวันที่"
              :shortcuts="pickerOptionsWithShortcuts.shortcuts"
              :picker-options="pickerOptionsWithShortcuts" 
              style="margin-bottom: 10px; margin-left: 5px;"
          />
    <!--v-model="input3">-->
            <el-input
            v-model="searchInput"
            placeholder="ค้นหา SMS"
            clearable
            style="border-radius: 4px;"
            @keydown.enter="searchData()"
          >
          <template #prepend>
            <el-button style="background-color: red; color: white;" icon="el-icon-search"/>
          </template>
          <template #append>
            <el-button style="background-color: red; color: white;" type="primary" icon="el-icon-search" @click="searchData">Search</el-button>
          </template>
        </el-input>
      </el-card>
      <div class="retry-choose">
        <el-tooltip class="item" effect="dark" content="Yamaha Tip : ก่อน Retry กรุณาตรวจสอบข้อมูล SMS ที่จะ Retry ให้เรียบร้อย" placement="top">
          <el-button class="btn-retry" @click="openmsg"> Retry SMS Select  <i class="el-icon-refresh"></i></el-button>
        </el-tooltip>
        <div class="timer-refresh-wrapper">
            <p style="margin-top: 10px; margin: 0;"> Current Time : {{ NowTime }} น.</p>
            <p>Last Time Update : {{ Lasttime }} น.</p>
        </div>
      </div>
    <div class="sms-table">
      <el-table
        ref="smsref"
        v-loading="isLoading"
        class="sms-table-wrapper"
        style="width: 100%"
        :cell-style="{ padding: 0, margin: 0 }"
        :data="dataList"
        :default-sort= "getDefaultSort"
        @sort-change="onSortChanged"
      >
      <el-table-column width="30px">
        <div slot="header">
          <el-checkbox  :indeterminate="selectAll && checked.length > 0 && checked.length < dataList.length" @change="handleCheckAllChange"></el-checkbox>
        </div>
        <div slot-scope="props">
          <el-checkbox v-model="props.row.checked" :disabled="props.row.sendSms === 1" @change="handleCheckedChange(props.row)">1</el-checkbox>
        </div>
      </el-table-column>
      <el-table-column width="70px">
        <div slot-scope="props" class="row-wrapper">
          <el-badge is-dot :type="props.row.sendSms ? 'success' : 'danger'" style="margin-top: 5px;">
              <img
                src="~assets/icon/sms.png"
                style="width: 30px"
              />
          </el-badge>
        </div>
      </el-table-column>
      <el-table-column width="180px" sortable prop="transactionDate" label="วันที่ทำรายการ">
        <template slot-scope="props">
          <div v-if="props.row.transactionDate">
            {{ formatDate(props.row.transactionDate) }} น.
          </div>
          <div v-else>
            <!-- ไม่แสดงข้อมูลเมื่อ Transaction_date ไม่มีค่า -->
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150px">
        <div slot="header">รายชื่อธนาคาร</div>
        <div slot-scope="props" class="row-wrapper">
          {{ formatBank(props.row.bankReference) }}
        </div>
      </el-table-column>
      <el-table-column width="190px">
        <div slot="header">ชื่อลูกค้า</div>
        <div slot-scope="props" class="row-wrapper">
          {{ props.row.dealerName }}
        </div>
      </el-table-column>
      <el-table-column width="75px">
        <div slot="header">รหัสลูกค้า</div>
        <div slot-scope="props" class="row-wrapper">
          {{ props.row.dealerCode }}
        </div>
        // props.row.Header_Department == "SP" ? props.row.Header_DocRefNo : ""
      </el-table-column>
      <el-table-column min-width="70px">
        <div slot="header">เลขที่บัญชี</div>
        <div slot-scope="props" class="row-wrapper">
          {{ props.row.payeeAccountDSP }}
        </div>
      </el-table-column>
      <el-table-column
        min-width="185px"
        prop="Mobile_No"
        label="เบอร์โทรศัพท์"
      >
      <template slot-scope="props">
        {{ props.row.mobileNo.replace(/;/g, ' | ') }}
      </template>
      </el-table-column>
      <el-table-column prop="createDate" sortable label="เวลาที่ส่ง" width="150px">
        <template slot-scope="props">
          {{ formatDateSent(props.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" style="margin-left: 10px;">
        <div slot="header">Notification / Result</div>
        <div
          slot-scope="props"
          class="row-wrapper"
          style="margin-left: 20px;"
        >
          {{ formatSuccess(props.row.result) }}
        </div>
      </el-table-column>
      <el-table-column width="90px" align="center" >
        <div slot="header">Retry SMS</div>
        <template slot-scope="props">
          <div
            v-if="props.row.sendSms === 1"
            style="text-align: center;"
          >
          <el-button disabled type="success" icon="el-icon-check" circle></el-button>
          </div>
          <div v-else-if="props.row.sendSms === 0">
            <el-tooltip class="item" effect="dark" content="Yamaha Tip : ก่อน Retry กรุณาตรวจสอบข้อมูล SMS ที่จะ Retry ให้เรียบร้อย" placement="top">
             <el-button type="danger" icon="el-icon-refresh-left" circle @click="msgoneretry(props.row.id)"></el-button>
            </el-tooltip>
          </div>
          <div v-else>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
    <section class="pagination-wrapper">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next ,jumper"
        :total="pagination.total"
        :page-sizes="[10, 30, 50]"
        :page-size="pagination.pageSize"
        style="color: red;"
        @current-change="changePage"
        @size-change="onSizeChanged"
      ></el-pagination>
    </section>
  </el-card>
</div>
</template>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
import { formatBank, formatDate, formatDateSent, formatSuccess } from '~/components/format.js';
import axios from 'axios'
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [],
      },
      pickerOptionsWithShortcuts: {
        shortcuts: [
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      selectedSearchType: '',
      options: [
        {
          value: 'DDR_NOTIFICATION',
          label: 'DDR_NOTIFICATION',
        },
        {
          value: 'DDR_RESULT',
          label: 'DDR_RESULT',
        },
      ],
      selectsentsms: '',
      selectSMSOption: [
        {
          smsvalue: 'SMS_SUCCESS',
          smslabel: 'SMS SUCCESSFUL',
        },
        {
          smsvalue: 'SMS_NOT_SUCCESS',
          smslabel: 'SMS NOT SUCCESS',
        },
      ],
      dataList:[],
      searchInput: '',
      pagination :{
        page: 1,
        total :0,
        pageSize :10,
      },
      sortBy:'createDate',
      sortOrder: 'DESC',
      isLoading: false,
      NowTime: new Date().toLocaleTimeString(),
      Lasttime: new Date().toLocaleTimeString(),
      dateRange: [],
      isSearching: false,
      selectAll:false,
      checked:[],
    };
  },
  async created() {
    await this.getdata();
  },
  mounted() {
    setInterval(() => {
      this.NowTime = new Date().toLocaleTimeString();
    }, 1000);
    setInterval(() => {
      this.$router.go();
      this.Lasttime = new Date().toLocaleTimeString();
    }, 1800000);
  },
  computed: {
    getDefaultSort() {
      return {
        prop: 'createDate',
        order: this.sortOrder === 'DESC' ? 'descending' : this.sortOrder === 'ASC' ? 'ascending' : ''
      };
    },
    
  }, 
  methods:{
    formatBank(bankReference) {
      return formatBank(bankReference);
    },
    formatDate(transactionDate) {
      return formatDate(transactionDate);
    },
    formatDateSent(createDate) {
      return formatDateSent(createDate);
    },
    formatSuccess(SMSSuccess) {
      return formatSuccess(SMSSuccess);
    },
    async getdata(){
      this.isLoading = true
      const page = this.pagination.page
      const pageSize = this.pagination.pageSize;
      const sortOrder = this.sortOrder;
      try {
          const response = await axios.get(`http://localhost:7777/api/notification/tabledata/search?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`)
          this.pagination.page = response.data.number + 1;
          this.pagination.total = response.data.totalElements;
          if (Array.isArray(response.data.content)) {
              this.dataList = response.data.content
              
          } else {
            this.dataList = []
          }
          this.checked = []
          this.isLoading = false
         // console.log('Yamaha SMS [Fetch] Get TableSMS :',response)
         // console.log('Yamaha SMS [Fetch] Get PageSize :',this.pagination.pageSize)
          console.log(response)
      } catch(error) {
        console.error('Yamaha SMS [Fetch] Get TableSMS Error :',error)
      }
    },
    async onSortChanged({ prop, order }) {
      this.sortOrder = order === 'ascending' ? 'ASC' : 'descending' ? 'DESC':'';
      this.sortBy = prop
      this.checked = []
      console.log(order)
      console.log(this.checked)
      if (this.isSearching) {
           await  this.searchData();
        } else {
           await  this.getdata();
           this.Lasttime = new Date().toLocaleTimeString();
        }
      if (order === 'null'){
        this.checked = []
      }
    },
    async searchData() {
      this.isLoading = true
      this.isSearching = true;
      const page = this.pagination.page
      const pageSize = this.pagination.pageSize;
      const sortOrder = this.sortOrder;
      const queryParams = [];
        if (this.selectedSearchType === 'DDR_NOTIFICATION') {
          queryParams.push(`result=PENDING`);
        }else if (this.selectedSearchType === 'DDR_RESULT') {
          queryParams.push(`result=SUCCESSFUL,NOT_SUCCESS`);
        }
        if (this.selectsentsms === 'SMS_SUCCESS') {
          queryParams.push(`sendSms=1`);
        }else if (this.selectsentsms === 'SMS_NOT_SUCCESS') {
          queryParams.push(`sendSms=0`);
        }
        if (this.dateRange && this.dateRange.length === 2) {
          const startDate = this.formatDatePickerStart(this.dateRange[0]);
          const endDate = this.formatDatePickerEnd(this.dateRange[1]);
          queryParams.push(`startDate=${startDate}`);
          queryParams.push(`endDate=${endDate}`);
        }
        if (this.searchInput) {
          const searchString = encodeURIComponent(this.searchInput.trim());
          if (/^[A-Za-z]{2}\d{5}$/.test(searchString)) {
        queryParams.push(`dealerCode=${searchString}`);
        }
         else if (/^\d{5,7}$/.test(searchString)) {
          queryParams.push(`dealerCode=${searchString}`);
        } else if (/^\d{8,}$/.test(searchString)) {
          queryParams.push(`mobileNo=${searchString}`);
        } else {
          queryParams.push(`dealerName=${searchString}`);
        }
      } try {
         const response = await axios.get(`http://localhost:7777/api/notification/tabledata/search?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&${queryParams.join('&')}`);
         if (!isNaN(response.data.number) && response.data.totalElements !== undefined) {
            this.pagination.page = response.data.number + 1;
            this.pagination.total = response.data.totalElements;
          } else {
            this.pagination.page = 1; 
            this.pagination.total = 0;
          }
           if (Array.isArray(response.data.content)) {
                this.dataList = response.data.content
            } else {
              this.dataList = []; 
            } 
            this.isLoading = false
            this.checked = [];
            console.log('seachdata',response)
            console.log('seachdata',this.pagination.page)
            console.log('seachdata',this.pagination.total)
            if (this.searchInput === '' && this.selectedSearchType ==='' && this.selectsentsms ==='' && this.dateRange ===''){
              this.isSearching = false;
              await this.getdata()
              console.log(this.dataList)
            }else{

            }
        } catch (error) {
          console.error('Error searching data:', error);
        }
     },  
      formatDatePickerStart(createDate) {
          const dateObject = new Date(createDate);
          const year = dateObject.getFullYear();
          const month = String(dateObject.getMonth() + 1).padStart(2, '0');
          const day = String(dateObject.getDate()).padStart(2, '0');
          const hours = '00';
          const minutes = '00';
          const seconds = '00';
          const milliseconds = '000';

          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
      },
      formatDatePickerEnd(createDate) {
          const dateObject = new Date(createDate);
          const year = dateObject.getFullYear();
          const month = String(dateObject.getMonth() + 1).padStart(2, '0');
          const day = String(dateObject.getDate()).padStart(2, '0');
          const hours = '23';
          const minutes = '59';
          const seconds = '00';
          const milliseconds = '000';

          return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
      },
      async changePage(page) {
        this.pagination.page = page;
          this.checked = [];
          console.log(this.dataList)
        if (this.isSearching) {
            await this.searchData();
        } else {
            await this.getdata();
            this.Lasttime = new Date().toLocaleTimeString();
        }
      },
      async onSizeChanged(data) {
      this.pagination.pageSize = data;
        this.checked = [];
      if (this.isSearching) {
            await this.searchData();
        } else {
            await this.getdata();
            this.Lasttime = new Date().toLocaleTimeString();
        }
    },
      async retryChoose() {
        const selectedDataToSend = this.checked.map(id => `id=${id}`).join('&');
        try {
        //  console.log(selectedDataToSend)
      //    console.log(this.checked)
          const response = await axios.post(`http://localhost:7777/api/notification/resend?${selectedDataToSend}`);
      //    console.log(selectedDataToSend)
          console.log(response); 
          setTimeout(() => {
            this.$router.go()
          }, 2000);
          this.Lasttime = new Date().toLocaleTimeString();
        } catch (error) {
          console.error('Yamaha SMS [Fetch] Retry Send Error :', error);
        }
      },
    async retrysms(id){
      try{
       const response = await axios.post(`http://localhost:7777/api/notification/resend?id=${id}`)
      console.log(response)
    //  this.getdata()
      }catch (error){
        console.error('Yamaha SMS [Fetch] Retry Send Error :', error)
      }
    },
    async openmsg() {
      if (!this.dataList.some(item => item.checked)) {
        this.$message({
          type: 'error',
          message: 'Yamaha SMS : กรุณาเลือกรายการที่ต้องการ Retry SMS ก่อน'
        });
        return;
      }
      try {
        await this.$confirm('Yamaha SMS : คุณต้องการที่จะ Retry SMS หรือไม่?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
        });
        this.$message({
          type: 'success',
          message: 'Yamaha SMS : คุณได้ทำการ Retry SMS แล้ว'
        });
        await this.retryChoose();
      } catch (error) {
        this.$message({
          type: 'info',
          message: 'Yamaha SMS : คุณได้ยกเลิกการ Retry SMS'
        });
      }
    },
    async msgoneretry(id) {
      try {
        await this.$confirm('Yamaha SMS : คุณต้องการที่จะ Retry SMS หรือไม่?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
        });
        this.$message({
          type: 'success',
          message: 'Yamaha SMS : คุณได้ทำการ Retry SMS แล้ว'
        });
        await this.retrysms(id);
      } catch (error) {
        this.$message({
          type: 'info',
          message: 'Yamaha SMS : คุณได้ยกเลิกการ Retry SMS'
        });
      }
    },
    handleCheckAllChange(val) {
      if (val) {
        this.checked = this.dataList
          .filter(item => item.sendSms !== 1)
          .map(item => item.id);
      } else {
        this.checked = [];
      }

      this.dataList.forEach(item => {
        if (item.sendSms !== 1) {
          item.checked = val;
        }
      });
      console.log(this.checked)
    },
    handleCheckedChange(row) {
      if (row.sendSms !== 1) {
        if (row.checked) {
          this.checked.push(row.id);
        } else {
          const index = this.checked.indexOf(row.id);
          if (index !== -1) {
            this.checked.splice(index, 1);
          }
        }
      }
      const checkedCount = this.dataList.filter(item => item.sendSms !== 1 && item.checked).length;
      this.selectAll = checkedCount === this.dataList.filter(item => item.sendSms !== 1).length;
      console.log(this.checked);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";

.sms-page {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
    .card-wrapper {
      border-radius: 1rem;
      margin: 5px;
    .card-filter{
      border-radius: 1rem;
      margin-top: -5px;
      padding: 10px;
      margin-left: 285px;
      margin-right: 285px;
    }
    .sms-table {
      .sms-table-wrapper {
        font-size: 12px;
        margin-top:10px ;
        .card-wrapper {
          .descriptions-wrapper {
            display: flex;
            flex-direction: column;
            margin: 1rem;
            border-left: 1px solid;
            border-right: 1px solid;
            border-top: 1px solid;
            border-color: $colorBorder;

            .descriptions-item-wrapper {
              display: flex;
              flex-direction: row;
              padding: 0.5rem;
              border-bottom: 1px solid;
              border-color: $colorBorder;
              .label-wrapper {
                .icon {
                  margin: 0 5px 0 0;
                }
                font-weight: bold;
                display: flex;
                width: 120px;
                align-items: center;
              }
              .value-wrapper {
                display: flex;
                flex-direction: row;
                .tool-tip-wrapper {
                  display: flex;
                  flex-direction: row;
                }
                .value-download {
                  margin: 0 6px 0 3px;
                  font-weight: bold;
                }
              }
            }
          }
        }
        .row-wrapper {
          display: flex;
          height: 50px;
          padding: 0;
          margin: 0;
          align-items: center;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
    .demo-date-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
  }

  .demo-date-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
  }

  .demo-date-picker .block:last-child {
    border-right: none;
  }

  .demo-date-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
  }
  .pagination-wrapper {
      display: flex;
      justify-content: center;
      margin: 15px 0;
    }
  .input-search:focus{
    border-color: #ff0000;
  }
  .timer-refresh-wrapper {
        margin-top: 10px ;
        justify-content: flex-end;
        align-items: center;
        display: flex;
        width: 100%;
        font-size: small;
        font-weight: bold;
        flex-direction: column; /* เปลี่ยนเป็นแนวตั้ง */
        align-items: flex-end;
        margin-bottom: -20px;
  }
    .retry-choose {
      display: flex;
      flex-direction: row; /* จัดเรียงตามแนวนอน */
      align-items: center; /* จัดให้กลางแนวตั้ง */
      width: 100%;
      font-size: small;
      font-weight: bold;
      margin-top: -20px;
      justify-content: space-between; /* จัดให้อยู่หน้าสุดของ container */
  }
  .btn-retry{
    display: flex;
    margin: auto;
    margin-top: 40px;
    width: 140px;
    height: 40px;
    align-items: center;
    justify-content: center;
    background:$colorError;
    border-color: red;
    color: white;
    }
    .btn-retry:hover{
    color: red;
    background-color: $colorBackground;
    border-color: red;
    }
}
</style>