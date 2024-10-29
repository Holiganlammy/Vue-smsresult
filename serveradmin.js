const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const cors = require('cors')
const app = express();
const router = express.Router()
app.use(cors())
app.use(express.json())
// ตั้งค่าการเชื่อมต่อกับ SQL Server
const config = {
  //user: 'nonnipat',
  //password: 'nonnipat',
  server: '127.0.0.1', 
  database: 'YamahaSMS' ,
  options: {
      encrypt: true,
      trustServerCertificate: true
  }
};

// Middleware
router.use(bodyParser.json());
router.get('/test', (req,res) => {
  return res.json({ title : 'TEST API GET'})
})
/* router.get('/getUserLogins', async (req, res) => { //ตัวหลัก
  try {
      const pool = await mssql.connect(config);
      
      const query = 'SELECT * FROM [YamahaAdmin].[dbo].[UserLogin]';
      const result = await pool.request().query(query);
      const dataList = result.recordset.map(user => ({
        id: user.ID,
        username: user.Username,
        password: user.Password,
        nameUser: user.NameUser,
        role: user.Role,
        email: user.Email,
        formCode: user.FormCode,
        department: user.Department,
        createTime: user.CreateTime,
        lastlogin: user.LastLogin,
        // เพิ่ม properties อื่น ๆ ตามที่คุณต้องการ
      })); 
    //  console.log(result)
     // console.log(dataList)
      res.status(200).json(dataList);
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
  }
}); */
router.get('/getUserLogins/:page', async (req, res) => {
  try {
    const sql = await mssql.connect(config);
    const perPage = 999999999 // จำกัดรายการทั้งหมด
    const page = req.params.page || 1; // หน้าที่แสดง (ถ้าไม่ระบุจะเป็นหน้าที่ 1)

    const query =`
    SELECT
      ID,
      Username,
      Password,
      NameUser,
      Role,
      Email,
      JobPositions,
      Department,
      CONVERT(VARCHAR(10), CreateTime, 103) + ' ' + CONVERT(VARCHAR(8), CreateTime, 108) AS CreateTime,
      LastLogin
    FROM [YamahaAdmin].[dbo].[UserLogin]
  `;

    const result = await sql.request().query(query);

    const dataList = result.recordset.map(user => ({
      id: user.ID,
      username: user.Username,
      password: user.Password,
      nameUser: user.NameUser,
      role: user.Role,
      email: user.Email,
      jobpositions: user.JobPositions,
      department: user.Department,
      createTime: user.CreateTime,
      lastlogin: user.LastLogin,
    }));
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const pagedDataList = dataList.slice(startIndex, endIndex);

    res.status(200).json({
      dataList: pagedDataList,
      totalItems: dataList.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
router.get('/getUserData/:id', async (req, res) => {
  try {
    const sql = await mssql.connect(config);
    const id = req.params.id;


    const query = `
      SELECT
        ID,
        Username,
        Password,
        NameUser,
        Role,
        Email,
        JobPositions,
        Department
      FROM [YamahaAdmin].[dbo].[UserLogin]
      WHERE ID = @id`; 
    const result = await sql
      .request()
      .input('id', id) 
      .query(query);

    const dataList = result.recordset.map(user => ({
      id: user.ID,
      username: user.Username,
      password: user.Password,
      nameUser: user.NameUser,
      role: user.Role,
      email: user.Email,
      jobpositions: user.JobPositions,
      department: user.Department,
    }));
   // console.log('GetUser :',dataList)
    res.status(200).json({
      dataList: dataList,
      totalItems: dataList.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
// เรียก API สำหรับการเพิ่มข้อมูล
 router.post('/addData', async (req, res) => {
  try {
      const DataUser = req.body; 
      await mssql.connect(config)

      const checkQuery = `
      SELECT * FROM [YamahaAdmin].[dbo].[UserLogin] WHERE
      ([Username] = @Username AND [Nameuser] <> @Nameuser) OR
      ([Username] <> @Username AND [Nameuser] = @Nameuser) OR
      ([Username] = @Username AND [Nameuser] = @Nameuser);`;
      
      const checkRequest = new mssql.Request();
      checkRequest.input('Username', mssql.VarChar, DataUser.username);
      checkRequest.input('NameUser', mssql.VarChar, DataUser.nameuser);
      const existingUser = await checkRequest.query(checkQuery);
      if (existingUser.recordset.length > 0) {
        let errorMessageUser = '';
        let errorMessageName = '';
        let errorMessageAll = '';

        if (existingUser.recordset.some(user => user.Username === DataUser.username)) {
          errorMessageUser += 'ที่คุณใช้นี้มีในระบบผู้ใช้แล้ว';
        }
      
        if (existingUser.recordset.some(user => user.NameUser === DataUser.nameuser)) {
          errorMessageName += 'ที่คุณใช้นี้มีในระบบผู้ใช้แล้ว';
        }
        if (errorMessageUser && errorMessageName){
          errorMessageAll += 'ที่คุณใช้นี้มีในระบบผู้ใช้แล้ว'
        }
      
        res.status(400).send({
          usernameError: errorMessageUser.trim(),
          nameuserError: errorMessageName.trim(),
          twoError: errorMessageAll.trim(),
        });
      }else{
        const query = `INSERT INTO [YamahaAdmin].[dbo].[UserLogin] 
        ([Username], [Password], [NameUser], [Role], [Email], [JobPositions], [Department], [CreateTime])
        VALUES (@Username, @Password, @NameUser, @Role, @Email, @JobPositions, @Department, @CreateTime)`;
      
        const request = new mssql.Request()
        request.input('Username', mssql.VarChar, DataUser.username);
        request.input('Password', mssql.VarChar, DataUser.password);
        request.input('NameUser', mssql.VarChar, DataUser.nameuser);
        request.input('Role', mssql.Int, DataUser.role);
        request.input('Email', mssql.VarChar, DataUser.email);
        request.input('JobPositions', mssql.VarChar, DataUser.jobpositions);
        request.input('Department', mssql.VarChar, DataUser.department);
        const createtime = new Date(DataUser.createtime);
        createtime.setHours(createtime.getHours() + 7); // เพิ่ม 7 ชั่วโมง
        request.input('CreateTime', mssql.DateTime, createtime);
        console.log('Add User info :',DataUser)
        console.log('CreateTime UTC+7 :',createtime)
        await request.query(query);
        
        res.status(200).send('Data added successfully');
      }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  } finally {
    mssql.close()
  }
}); 
/* router.post('/addName', async (req, res) => { //ตัว Test ใส่ข้อมูล
  try {
    const { firstName, lastName } = req.body;

    await mssql.connect(config);
    const result = await mssql.query`
      INSERT INTO Names (FirstName, LastName)
      VALUES (${mssql.NVarChar(255).value(firstName)}, ${sql.NVarChar(255).value(lastName)})
    `;

    res.status(200).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  } finally {
    mssql.close();
  }
}); */
// เรียก API สำหรับการแก้ไขข้อมูล
router.put('/updatedata/:id', async (req, res) => {
  try {
    await mssql.connect(config);

    const selectdata = req.body; 

    const query = `
      UPDATE UserLogin
      SET Username = @username, Password = @password, NameUser = @nameUser, Role = @role,
      Email = @email, JobPositions = @jobpositions, Department = @department
      WHERE ID = @id`;

    const request = new mssql.Request();
    request.input('ID', mssql.VarChar, selectdata.id);
    request.input('Username', mssql.VarChar, selectdata.username);
    request.input('Password', mssql.VarChar, selectdata.password);
    request.input('NameUser', mssql.VarChar, selectdata.nameUser);
    request.input('Role', mssql.Int, selectdata.role);
    request.input('Email', mssql.VarChar, selectdata.email);
    request.input('JobPositions', mssql.VarChar, selectdata.jobpositions);
    request.input('Department', mssql.VarChar, selectdata.department);
    console.log('UpdateData :',selectdata)
    await request.query(query);

    res.status(200).send('Data updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  } finally {
    mssql.close();
  }
});

router.delete('/deleteData/:id', async (req, res) => {
  try {
    const sql = await mssql.connect(config);
  
    const id = req.params.id;
    const query = `DELETE FROM UserLogin WHERE ID = @ID`;
      
    const result = await sql
      .request()
      .input('ID', id)
      .query(query);
      
    const dataList = (result.recordset || []).map(user => ({
      id: user.ID,
    }));
    console.log('DeleteData : ID --> ',id)
    res.status(200).json({
      message: 'Data delete successfully',
      dataList: dataList,
      totalItems: dataList.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  } finally {
    mssql.close();
  }
});
router.get('/search', async (req, res) => {
  try {
    const sql = await mssql.connect(config);

    const query =` SELECT FROM [YamahaAdmin].[dbo].[UserLogin]`;

    const result = await sql.request().query(query);

    const dataList = result.recordset.map(user => ({
      id: user.ID,
      username: user.Username,
      password: user.Password,
      nameUser: user.NameUser,
      role: user.Role,
      email: user.Email,
      jobpositions: user.JobPositions,
      department: user.Department,
      createTime: user.CreateTime,
      lastlogin: user.LastLogin,

    }));
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const pagedDataList = dataList.slice(startIndex, endIndex);

    res.status(200).json({
      dataList: pagedDataList,
      totalItems: dataList.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});
app.use('/api', router)
app.listen(12345, () => {
  console.log(`Server is running on port 12345`);
});
