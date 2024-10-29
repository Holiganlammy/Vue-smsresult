<template>
  <div class="resend-page">
    <div class="container">
          <img src="~/assets/LogoTYM.PNG" alt="" width="300px" height="">
      </div>
      <el-card class="card-wrapper">
        <div class="resend-card">
          <el-tooltip class="item" effect="dark" content="Yamaha Tip : ปุ่มนี้คือปุ่มเฉพาะการกดส่ง SMS เข้า Server กรุณาห้ามกดเล่น" placement="top">
            <el-button class="btn-resend" @click="openmsg"> Resend file to Server  <i class="el-icon-s-promotion"></i></el-button>
          </el-tooltip>
            <div 
            class="el-upload__tip" 
            style="margin-left: -25px;"
            >
            Yamaha SMS Systems : ปุ่มสำหรับการส่งข้อมูล SMS ลูกค้า Yamaha จาก Server Ymate ไปยัง Seagull Server โดยตรง 
          </div>
            <div 
              class="el-upload__tip" 
                style="text-align: center; color: red;margin-left: -15px;"
              >
                กรุณาตรวจสอบก่อนทำการกดปุ่ม จำกัดการกด 1 รอบ / ครั้ง
            </div>
        </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
      return {
        fileList: [],
      formData: {
        file: null,
      },
      }
  },
  methods: {
    async openmsg() {
      try {
        await this.$confirm('Yamaha SMS : คุณต้องการที่จะ Resend ข้อมูล SMS หรือไม่?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
        });
        this.$message({
          type: 'success',
          message: 'Yamaha SMS : คุณได้ทำการ Resend แล้ว'
        });
      //  await this.uploadFile();
      } catch (error) {
        this.$message({
          type: 'info',
          message: 'Yamaha SMS : คุณได้ยกเลิกการ Resend'
        });
      }
    },
    async uploadFile (file){

      const fileNames = ['DDR_NOTIFICATION_SMS_', 'DDR_RESULT_SMS_'];
      const fileName = this.formData.file.name;
      
      if (!fileNames.some(name => fileName.startsWith(name))) {
        this.$message.warning({
          message:  `Yamaha SMS Systems :  ชื่อไฟล์ "${fileName}" ไม่ถูกต้อง กรุณาเลือกไฟล์ "DDR_NOTIFICATION_SMS" หรือ "DDR_RESULT_SMS" เท่านั้น`,
          duration: 3000
        });
       // this.$message.warning('Yamaha SMS Systems : โปรดใช้ชื่อไฟล์ "DDR_NOTIFICATION_SMS" หรือ "DDR_RESULT_SMS" เท่านั้น');
        return;
      }
      try{
        const formData = new FormData();
        formData.append('file', this.formData.file);

        const response = await axios.post('http://localhost:7777/api/notification/upload',formData ,{
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        })
        this.fileList = response.data.fileList;
        console.log(response.data);
        this.$message({
          message: 'Yamaha SMS Systems : Upload File SMS Success',
          type: 'success'
        });
       setTimeout(() => {
          this.$router.go()
        }, 500); 
      }catch(error){
        console.error('Yamaha SMS [Fetch] Upload Data :', error);
        this.$message.error('Yamaha SMS [Fetch] Upload Data : Failed to Sent SMS , Please Try Again Later')
      }
    },
},
};
</script>
<style lang="scss" scoped>
@import "~assets/styles/variables";
.resend-page{
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.card-wrapper {
    border-radius: 1rem;
    width: 750px;
    height: 400px;
    margin: 10px auto;
    margin-top: 10px;
}
.container {
  display: flex;
  justify-content: center; /* จัดกลางแนวนอน */
  align-items: center; /* จัดกลางแนวตั้ง */
}
.resend-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-left: 30px;
}
.resend {
border-radius: 8px; /* ปรับรูปร่างของกรอบ */
font-size: 16px;
color: #666;
}
.btn-resend{
display: flex;
margin: 50px;
margin-top: 70px;
width: 350px;
height: 100px;
align-items: center;
justify-content: center;
background:$colorError;
border-color: red;
color: white;
}
.btn-resend:hover{
color: red;
background-color: $colorBackground;
border-color: red;
}

.el-tooltip__popper {
  margin-top: 10px; /* ปรับระยะห่างของ tooltip จากปุ่ม */
}
</style>