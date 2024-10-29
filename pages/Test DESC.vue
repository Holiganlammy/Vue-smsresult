<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="selectAll" @change="handleCheckAllChange">Check all</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox v-model="checked" @change="handleCheckedChange" v-for="city in dataList" :label="city.id" :key="city.id">{{city.name}}</el-checkbox>
    <el-button type="danger"  plain @click="retryChoose"> Retry Choose</el-button>
  </div>
</template>

<script>
// import axios from 'axios'
  export default {
    data() {
      return {
        selectAll: false,
        checked: [],
        dataList:[
          { id: 1, name: 'Shanghai' },
          { id: 2, name: 'Beijing' },
          { id: 3, name: 'Guangzhou' },
          { id: 4, name: 'Shenzhen' }
        ],
        isIndeterminate: false
      };
    },
    methods: {
      handleCheckAllChange(val) {
        if (val) {
          this.checked = this.dataList.map(item => item.id);
        } else if (!val) {
          this.checked = [];
        }
        this.isIndeterminate = false;
        console.log(this.checked)
      },
      handleCheckedChange(value) {
        const checkedCount = value.length;
        this.selectAll = checkedCount === this.dataList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataList.length;
      },
       retryChoose() {
        const selectedDataToSend = this.checked.map(id => `id=${id}`).join('&');
        try {
        //  const response = await axios.post(`http://localhost:7777/api/notification/resend?${selectedDataToSend}`);
          console.log(selectedDataToSend)
     //     console.log(response);
       //   this.getdata();
         // this.Lasttime = new Date().toLocaleTimeString();
        } catch (error) {
          console.error('Yamaha SMS [Fetch] Retry Send Error :', error);
        }
      },
    }
  };
</script>