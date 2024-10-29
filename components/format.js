export function formatBank(bankReference) {
    const bankName = bankReference.replace(/[0-9]/g, '');
          
    // แปลงรหัสธนาคารเป็นชื่อธนาคาร
    switch (bankName) {
      case 'KBANK':
        return 'Kasikorn Bank (KBank)';
      case 'BBL':
        return 'Bangkok Bank (BBL)';
      case 'KTB':
        return 'Krungthai Bank (KTB)';
      case 'SCB':
        return 'Siam Commercial Bank (SCB)';
      case 'BAY':
        return 'Bank Of Ayudhya (BAY)';
      case 'BOT':
        return 'Bank of Thailand (BOT)';
      case 'TTB':
        return 'TMB Thanachart Bank (TTB)';
      case 'KKB':
        return 'KIATNAKIN PHATRA BANK (KKB)';  
      case 'CIMBT':
        return 'CIMB Thai Bank (CIMBT) ';  
      case 'TISCO':
        return 'TISCO Bank (TISCO)';  
      case 'UOB':
        return 'United Overseas Bank (UOB)';  
      case 'GSB':
        return 'Government Savings Bank (GSB)';  
      case 'IBank':
        return 'Islamic Bank of Thailand (IBank)';  
      default:
        return bankName;
    }
  }
  
  export function formatDate(transactionDate) {
      // แปลงรูปแบบวันที่
      const dateParts = transactionDate.split(' ');
      const thaiMonth = dateParts[1];
      const thaiYear = dateParts[2];
      const time = dateParts[3];
      const thaiDate = dateParts[0];
  
      const months = {
        'มกราคม': '01',
        'กุมภาพันธ์': '02',
        'มีนาคม': '03',
        'เมษายน': '04',
        'พฤษภาคม': '05',
        'มิถุนายน': '06',
        'กรกฎาคม': '07',
        'สิงหาคม': '08',
        'กันยายน': '09',
        'ตุลาคม': '10',
        'พฤศจิกายน': '11',
        'ธันวาคม': '12',
      };
  
      const month = months[thaiMonth];
      const formattedDate = `${thaiDate}/${month}/${thaiYear} ${time}`;
  
      return formattedDate;
  }
  
  export function formatDateSent(createDate) {
    // แปลงรูปแบบวันที่
    const date = new Date(createDate);
    const thaiYear = date.getFullYear() + 543;
    const thaiDate = date.getDate();
    const thaiMonth = date.getMonth() + 1;
    const time = date.toLocaleTimeString();
  
    const formattedDate = `${thaiDate}/${thaiMonth.toString().padStart(2, '0')}/${thaiYear} ${time} น.`;
  
    return formattedDate;
  }
  
  export function formatSuccess(SMSSuccess) {
    switch (SMSSuccess) {
      case 'SUCCESSFUL':
        return 'DDR_RESULT';
      case 'NOT_SUCCESS':
        return 'DDR_RESULT';
      case 'PENDING':
        return 'DDR_NOTIFICATION';
      default:
        return SMSSuccess;
    }
  }