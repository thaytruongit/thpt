/**
 * THAYTRUONGIT - THPT HUB: GOOGLE SHEETS AUTOMATED BRIDGE
 * Tự động tạo bảng, định dạng cột, gắn công thức Thông tư 22 và đồng bộ 2 chiều từ Website
 */

const SHEET_NAMES = {
  ACCOUNTS: 'TaiKhoan_HS',
  GRADEBOOK: 'BangDiem_TT22',
  SUBMISSIONS: 'LichSu_NopBai',
  LAB_LIVE: 'PhongMay_Live'
};

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureAllSheetsExist(ss);

  const action = (e && e.parameter && e.parameter.action) || 'GET_ALL';
  if (action === 'GET_ALL') {
    const data = {
      status: 'OK',
      accounts: getSheetRecords(ss.getSheetByName(SHEET_NAMES.ACCOUNTS)),
      gradebook: getSheetRecords(ss.getSheetByName(SHEET_NAMES.GRADEBOOK)),
      submissions: getSheetRecords(ss.getSheetByName(SHEET_NAMES.SUBMISSIONS))
    };
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'READY' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureAllSheetsExist(ss);

    const body = JSON.parse(e.postData.contents);
    const eventType = body.eventType;
    const payload = body.payload || {};

    if (eventType === 'AUTO_INIT_SCHEMA' || eventType === 'BULK_SYNC_ALL') {
      if (payload.students && Array.isArray(payload.students)) {
        syncAllStudentsToSheets(ss, payload.students);
      }
    } else if (eventType === 'RECORD_SUBMISSION') {
      recordSubmissionAndScore(ss, payload);
    } else if (eventType === 'UPDATE_GRADEBOOK') {
      upsertStudentGradeRow(ss, payload);
    } else if (eventType === 'UPSERT_STUDENT') {
      upsertStudentAccountRow(ss, payload);
      upsertStudentGradeRow(ss, payload);
    } else if (eventType === 'LAB_HEARTBEAT') {
      updateLabSeatStatus(ss, payload);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS', eventType }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function ensureAllSheetsExist(ss) {
  initSheetIfMissing(ss, SHEET_NAMES.ACCOUNTS, [
    'Mã HS', 'Họ và Tên', 'Lớp', 'Định hướng', 'Máy trạm', 'Mã PIN', 'Điểm XP', 'Cấp độ (Level)', 'Chuỗi ngày (Streak)', 'Cập nhật cuối'
  ], '#1e40af');

  initSheetIfMissing(ss, SHEET_NAMES.GRADEBOOK, [
    'Mã HS', 'Họ và Tên', 'Lớp', 'ĐĐGtx 1', 'ĐĐGtx 2', 'ĐĐGtx 3', 'ĐĐGtx 4', 'ĐĐGgk (x2)', 'ĐĐGck (x3)', 'ĐTB Môn HK', 'Xếp loại TT22'
  ], '#047857');

  initSheetIfMissing(ss, SHEET_NAMES.SUBMISSIONS, [
    'Thời gian', 'Mã HS', 'Họ và Tên', 'Lớp', 'Loại bài', 'Mã bài / Đề thi', 'Tên bài tập', 'Kết quả (Verdict)', 'Điểm số', 'XP cộng thêm'
  ], '#4f46e5');

  initSheetIfMissing(ss, SHEET_NAMES.LAB_LIVE, [
    'Số máy', 'Mã HS', 'Họ và Tên', 'Lớp', 'Trạng thái', 'Bài đang làm', 'Số lần chuyển Tab', 'Cập nhật lúc'
  ], '#b45309');
}

function initSheetIfMissing(ss, name, headers, headerColor) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerColor);
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function recordSubmissionAndScore(ss, p) {
  const subSheet = ss.getSheetByName(SHEET_NAMES.SUBMISSIONS);
  subSheet.appendRow([
    new Date().toLocaleString('vi-VN'),
    p.studentId || '',
    p.studentName || '',
    p.classId || '',
    p.submissionType || 'AUTO_JUDGE',
    p.problemId || '',
    p.problemTitle || '',
    p.verdict || 'AC',
    p.score || 0,
    p.xpAdded || 0
  ]);

  if (p.studentSnapshot) {
    upsertStudentAccountRow(ss, p.studentSnapshot);
    upsertStudentGradeRow(ss, p.studentSnapshot);
  }
}

function upsertStudentAccountRow(ss, s) {
  const sheet = ss.getSheetByName(SHEET_NAMES.ACCOUNTS);
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(s.id)) {
      rowIndex = i + 1;
      break;
    }
  }
  const rowValues = [
    s.id, s.name, s.class_id, s.track, s.seat || '', s.pin || '1111',
    s.xp || 0, s.level || 1, s.streak || 1, new Date().toLocaleString('vi-VN')
  ];
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function upsertStudentGradeRow(ss, s) {
  const sheet = ss.getSheetByName(SHEET_NAMES.GRADEBOOK);
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(s.id)) {
      rowIndex = i + 1;
      break;
    }
  }
  const targetRow = rowIndex > 0 ? rowIndex : data.length + 1;
  const formulaDTB = `=ROUND((D${targetRow}+E${targetRow}+F${targetRow}+G${targetRow}+H${targetRow}*2+I${targetRow}*3)/9, 1)`;
  const formulaRank = `=IF(J${targetRow}>=8.0, "Tốt", IF(J${targetRow}>=6.5, "Khá", IF(J${targetRow}>=5.0, "Đạt", "Chưa đạt")))`;

  const rowValues = [
    s.id, s.name, s.class_id,
    Number(s.tx1 || 0), Number(s.tx2 || 0), Number(s.tx3 || 0), Number(s.tx4 || 0),
    Number(s.gk || 0), Number(s.ck || 0),
    formulaDTB, formulaRank
  ];

  sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
}

function syncAllStudentsToSheets(ss, students) {
  students.forEach(s => {
    upsertStudentAccountRow(ss, s);
    upsertStudentGradeRow(ss, s);
  });
}

function updateLabSeatStatus(ss, p) {
  const sheet = ss.getSheetByName(SHEET_NAMES.LAB_LIVE);
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][1]) === String(p.id)) {
      rowIndex = i + 1;
      break;
    }
  }
  const rowValues = [
    p.seat || '', p.id, p.name, p.class_id, p.status || 'ONLINE',
    p.current_task || '', p.tab_warnings || 0, new Date().toLocaleString('vi-VN')
  ];
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function getSheetRecords(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = r[idx]; });
    return obj;
  });
}
