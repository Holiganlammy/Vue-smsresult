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
mssql.connect(config)
  .then(() => {
    console.log('Connected to SQL Server');
  })
  .catch((err) => {
    console.error('Error connecting to SQL Server', err);
  });

router.get('/DataSMS', async (req, res) => {
  try {
    const sql = await mssql.connect(config);

    const query =`
    SELECT
      TRANSACTION_DATE,
      BANK_REFERENCE,
      DEALER_NAME,
      PAYEE_ACCOUNT_DSP,
      MOBILE_NO,
      CONVERT(VARCHAR(10), create_date, 103) + ' ' + CONVERT(VARCHAR(8), create_date, 108) AS create_date,
      RESULT,
      send_sms
    FROM [YamahaSMS].[dbo].[ORACLE_DDR_RESULT_SMS]
  `;

    const result = await sql.request().query(query);

    const dataList = result.recordset.map(tabledata => ({
      Transaction_date: tabledata.TRANSACTION_DATE,
      Bank_reference: tabledata.BANK_REFERENCE,
      Dealer_name: tabledata.DEALER_NAME,
      Payee_Account_Dsp: tabledata.PAYEE_ACCOUNT_DSP,
      Mobile_No: tabledata.MOBILE_NO,
      Result: tabledata.RESULT,
      Create_date: tabledata.create_date,
      Send_sms: tabledata.send_sms,
    }));

    res.status(200).json({
      dataList
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
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
      // เพิ่ม properties อื่น ๆ ตามที่คุณต้องการ
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
