// src/utils/excel.js
const ExcelJS = require('exceljs');
const path = require('path');
const os = require('os');
const fs = require('fs');

async function saveJobsToExcel(jobs) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Jobs');

  sheet.columns = [
    { header: 'Job ID', key: 'id', width: 24 },
    { header: 'Engineer', key: 'engineer', width: 24 },
    { header: 'Society', key: 'society', width: 24 },
    { header: 'Flat Number', key: 'flatNumber', width: 12 },
    { header: 'Status', key: 'status', width: 14 },
    { header: 'Owner Name', key: 'ownerName', width: 20 },
    { header: 'Owner Number', key: 'ownerNumber', width: 16 },
    { header: 'Service Type', key: 'serviceType', width: 16 },
    { header: 'Reason', key: 'reason', width: 32 },
    { header: 'Signature Path', key: 'signaturePath', width: 40 },
    { header: 'Submitted At', key: 'submittedAt', width: 24 },
  ];

  jobs.forEach(j => {
    sheet.addRow({
      id: j._id.toString(),
      engineer: (j.engineer && j.engineer.name) || j.engineer?.toString(),
      society: (j.society && j.society.name) || j.society?.toString(),
      flatNumber: j.flatNumber,
      status: j.status,
      ownerName: j.ownerName || '',
      ownerNumber: j.ownerNumber || '',
      serviceType: j.serviceType || '',
      reason: j.reason || '',
      signaturePath: j.signaturePath || '',
      submittedAt: j.submittedAt ? j.submittedAt.toISOString() : ''
    });
  });

  const tmpDir = path.join(os.tmpdir(), 'field_inspector_exports');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const filePath = path.join(tmpDir, `field_jobs_${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

module.exports = { saveJobsToExcel };
