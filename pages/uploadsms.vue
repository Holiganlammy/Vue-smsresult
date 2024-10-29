<template>
    <div class="upload-page">
      <div class="container">
            <img src="~/assets/LogoTYM.PNG" alt="" width="250" height="">
        </div>
        <el-card class="card-wrapper">
          <div class="upload-card">
            <el-upload
              drag
              class="upload"
              action="notification/upload"
              :before-remove="beforeRemove"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="handleFileChange"
              accept=".txt"
              >
              <i class="el-icon-upload" style="margin-top: 60px;"></i>
              <div class="el-upload__text">วางไฟล์ทีนี่ หรือ <em style="color: red;">คลิกเพื่ออัพโหลดไฟล์</em></div>
              <div slot="tip"  class="el-upload__tip">Yamaha SMS Systems :  DDR_NOTIFICATION/RESULT_SMS ประเภท Txt ไฟล์ เท่านั้น ขนาดไม่เกิน 1MB</div>
              <div slot="tip"  class="el-upload__tip" style="text-align: center; color: red;">จำกัดการอัพโหลดไฟล์ อัพโหลดได้แค่ 1 ไฟล์ TXT / ครั้ง</div>
            </el-upload>
          </div>
          <el-tooltip class="item" effect="dark" content="Yamaha Tip : ก่อนอัพโหลด กรุณาตรวจสอบไฟล์ให้เรียบร้อย" placement="top">
            <el-button class="btn-upload" @click="uploadFile"> Upload  <i class="el-icon-upload el-icon-right"></i></el-button>
          </el-tooltip>
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
      handleFileChange(file, fileList) {
        this.formData.file = file.raw; // ใช้ไฟล์ที่ผู้ใช้เลือก
        const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
      
        if (fileExtension.toLowerCase() !== 'txt') {
          this.$message.error('Yamaha SMS Systems : ห้ามให้เลือกไฟล์ประเภทอื่นมา');
          this.fileList.splice(this.fileList.indexOf(file), 1);
        }
      },
      handleExceed(files, fileList) {
        this.$message.warning(`Yamaha SMS Systems : จำกัด SMS ที่สามารถอัพโหลดได้ 1 ไฟล์, คุณเลือกมา ${files.length} ไฟล์ this time, add up to ${files.length + fileList.length} totally`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`Yamaha SMS Systems : คุณต้องการยกเลิก SMS ไฟล์นี้ ${ file.name } ใช่หรือไม่ ?`);
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
  .upload-page{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .card-wrapper {
      border-radius: 1rem;
      width: 915px;
      height: 506px;
      margin: 10px auto;
  }
  .container {
  display: flex;
  justify-content: center; /* จัดกลางแนวนอน */
  align-items: center; /* จัดกลางแนวตั้ง */
  }
  .upload-card{
    display: flex; 
    justify-content: center; 
    align-items: center;
    margin-top: 50px;
    margin-left: 30px;
  }
  .upload {
  border-radius: 8px; /* ปรับรูปร่างของกรอบ */
  font-size: 16px;
  color: #666;
  }
.upload i {
  font-size: 70px; /* ปรับขนาดไอคอนอัปโหลด */
}
.upload:hover {
  border-color: #409eff; /* ปรับสีกรอบเมื่อเม้าส์ hover */
  color: #409eff;
}
.btn-upload{
  display: flex;
  margin: auto;
  margin-top: 40px;
  width: 187px;
  height: 60px;
  align-items: center;
  justify-content: center;
  background:$colorError;
  border-color: red;
  color: white;
}
.btn-upload:hover{
  color: red;
  background-color: $colorBackground;
  border-color: red;
}
.el-upload-dragger{
  width: 500px;
}
</style>