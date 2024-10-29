<template>
    <div>
      <el-menu 
      :default-active="activeIndex" 
      class="el-menu-demo" 
      mode="horizontal" 
      @select="handleSelect"
      active-text-color="#ff0000"
      >
        <el-menu-item>
          	<img class="logo" src="~/assets/YAMAHA.PNG" alt="" width="170" height="50">
        </el-menu-item>
        <el-menu-item index="1" class="menu-item">
            <router-link to="/"><i class="el-icon-house"></i>Home</router-link>
        </el-menu-item>
        <el-menu-item index="2" class="menu-item">
            <router-link to="/smsresult"><i class="el-icon-s-data"></i>SMS Result</router-link>
        </el-menu-item>
        <el-menu-item index="3" class="menu-item">
            <router-link to="/uploadsms"><i class="el-icon-upload"></i>SMS Upload</router-link>
        </el-menu-item>
        <el-menu-item index="4" class="menu-item">
            <router-link to="/refile"><i class="el-icon-refresh"></i>Resend</router-link>
        </el-menu-item>
        <!--<el-submenu index="4" class="align-right">
            <template slot="title">
                <img src="~/assets/User.PNG" class="avatar" alt="Avatar"> Yamaha Master
            </template>
            <el-menu-item class="menu-list" ><i class="el-icon-s-custom"></i> Profile</el-menu-item>
            <el-menu-item class="menu-list"><i class="el-icon-s-operation"></i> Settings</el-menu-item>
            <el-menu-item class="menu-list"><i class="el-icon-user"></i> Logout</el-menu-item>
        </el-submenu>-->
      </el-menu>
    </div>
  </template>
  
  <script>
 export default {
  data() {
    return {
      activeIndex: '1',
    };
  },
  created() {
    const storedActiveIndex = sessionStorage.getItem('activeIndex');
    
    if (storedActiveIndex !== null) {
      this.activeIndex = storedActiveIndex;
    } else {
      sessionStorage.setItem('activeIndex', '1');
      this.activeIndex = '1';
      return storedActiveIndex
    }
  },


  methods: {
    handleSelect(key, keyPath) {
      sessionStorage.setItem('activeIndex', key);
    },
  },
};
  </script>
  
  <style scoped>
	.el-menu-demo .logo {
		margin-right: 10px;
		width: 170px;
		height: 50px;
	}
	.el-menu-demo .avatar {
		margin-right: 5px;
		width: 32px;
		height: 32px;
	}
	.el-menu-demo {
		color: #333;
	}

	.el-menu-demo .el-menu-item:hover {
		background-color: #f0f0f0;
	}
	.el-menu-demo .align-right {
		float: right;
	}
	.menu-item {
		display: flex;
		align-items: center; /* จัดให้ข้อความและไอคอนอยู่ตรงกัน */
	}
	.menu-item a {
		text-decoration: none; /* ลบเส้นใต้ข้อความลิงก์ */
	}
	.menu-item i {
		margin-right: 5px; /* ระยะห่างระหว่างไอคอนกับข้อความ */
		margin-top: -5px;
	}
	.menu-list{
		padding: 10px;
	}
  </style>