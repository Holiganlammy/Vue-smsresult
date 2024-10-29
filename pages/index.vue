<template>
    <div class="sms-home">
        <link rel="stylesheet" href="path-to-element-plus-css/element-plus.css">
        <div class="container">
            <img src="~/assets/LogoTYM.PNG" alt="" width="300" height="">
        </div>
        <div class="center-text">
            YAMAHA SMS NOTIFICATION / RESULT
        </div>
        <el-card class="box-card" style="padding: 50px;">
            <template #header>
                <div class="card-header" style="margin-top: -30px;">
                  <span class="text-news">แจ้งข่าวสาร YAMAHA SMS</span>
                </div>
            </template>
            <div class="messagebox-news">
              <div style=" display: flex; font-size: 15px; color: #a52a2a;height: 20px;align-items: baseline;">
                      <i class="el-icon-date" style="margin: 0 5px 0 0"></i>
                      <div>2023-09-18</div>
                </div>
                <div>
                    มีการเพิ่มระบบต่างๆหน้าเว็บไซต์ จะปิดให้บริการเว็บเวลา <a style="color: red;">เวลา 20.00 น.</a>
                </div>
                <div style=" display: flex; font-size: 15px; color: #a52a2a;height: 20px;align-items: baseline; margin-top: 10px;">
                      <i class="el-icon-date" style="margin: 0 5px 0 0"></i>
                      <div>2023-09-20</div>
                </div>
                <div>
                    มีการอัพเดตระบบ SMS บางอย่างให้เสถียรมากขึ้นและมีการเปิดเว็บไซต์ <a style="color: red;">เวลา 08.00 น.</a>
                </div>
            </div>
        </el-card>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 30px; gap: 20px;">
          <a href="/smsresult">
            <el-button class="el-btn" icon="el-icon-s-data"> SMS Result </el-button>
          </a>
          <a href="/uploadsms">
            <el-button class="el-btn" icon="el-icon-upload"> SMS Upload </el-button>
            </a>
        </div>
    </div>
</template>

<script>
export default {
  data(){
    return{
      
    }
  },
  methods:{
    onclicksmsresult(){
      this.$router.push('/smsresult')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/styles/variables";
  .sms-home{
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .center-text {
    font-size: 30px;
    text-align: center;
    font-family: "Gill Sans", sans-serif;
    margin-bottom: 30px;
    color: black;
  }
   .text-news{
    font-size: 20px;
    margin-left: 380px;
    text-align: center;
   }
   .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    }
    .box-card {
    width: 1000px;
    margin:auto;
  }
  .container {
  display: flex;
  justify-content: center; /* จัดกลางแนวนอน */
  align-items: center; /* จัดกลางแนวตั้ง */
}
  .el-btn{
    max-width: 143px;
    height: 45px;
    color: white;
    background-color: $colorError;
  }
  .messagebox-news{
    margin-top: 20px;
  }
</style>