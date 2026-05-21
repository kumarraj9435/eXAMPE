/**
 * Automated Attendance Sheet System for Google Sheets
 * This script provides automatic attendance tracking with date management
 */

// Configuration
const CONFIG = {
  ATTENDANCE_SHEET: 'Attendance',
  STUDENTS_SHEET: 'Students',
  SUMMARY_SHEET: 'Summary',
  START_ROW: 2, // Row where data starts (after headers)
  NAME_COLUMN: 1,
  DATE_START_COLUMN: 2
};

/**
 * Creates menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 Attendance System')
    .addItem('🆕 Initialize Sheets', 'initializeSheets')
    .addItem('➕ Add Today\'s Date', 'addTodayDate')
    .addItem('📊 Generate Summary', 'generateSummary')
    .addItem('👥 Add Student', 'addStudentDialog')
    .addItem('🔄 Auto-fill Present', 'autoFillPresent')
    .addToUi();
}

/**
 * Initialize all required sheets with proper structure
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create or get Attendance sheet
  let attendanceSheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
  if (!attendanceSheet) {
    attendanceSheet = ss.insertSheet(CONFIG.ATTENDANCE_SHEET);
  } else {
    attendanceSheet.clear();
  }
  
  // Create or get Students sheet
  let studentsSheet = ss.getSheetByName(CONFIG.STUDENTS_SHEET);
  if (!studentsSheet) {
    studentsSheet = ss.insertSheet(CONFIG.STUDENTS_SHEET);
  } else {
    studentsSheet.clear();
  }
  
  // Create or get Summary sheet
  let summarySheet = ss.getSheetByName(CONFIG.SUMMARY_SHEET);
  if (!summarySheet) {
    summarySheet = ss.insertSheet(CONFIG.SUMMARY_SHEET);
  } else {
    summarySheet.clear();
  }
  
  // Setup Attendance Sheet
  setupAttendanceSheet(attendanceSheet);
  
  // Setup Students Sheet
  setupStudentsSheet(studentsSheet);
  
  // Setup Summary Sheet
  setupSummarySheet(summarySheet);
  
  SpreadsheetApp.getUi().alert('✅ Attendance system initialized successfully!');
}

/**
 * Setup the attendance sheet with headers
 */
function setupAttendanceSheet(sheet) {
  // Headers
  sheet.getRange('A1').setValue('Student Name');
  sheet.getRange('A1').setFontWeight('bold').setBackground('#4285f4').setFontColor('white');
  
  // Format
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(1);
  sheet.setColumnWidth(1, 200);
  
  // Add sample students
  const sampleStudents = ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5'];
  sampleStudents.forEach((name, index) => {
    sheet.getRange(CONFIG.START_ROW + index, CONFIG.NAME_COLUMN).setValue(name);
  });
  
  // Add data validation for attendance cells (Present/Absent/Late)
  const validationRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['P', 'A', 'L', ''], true)
    .setAllowInvalid(false)
    .setHelpText('P = Present, A = Absent, L = Late')
    .build();
  
  // Apply validation to a large range
  sheet.getRange(CONFIG.START_ROW, CONFIG.DATE_START_COLUMN, 100, 365)
    .setDataValidation(validationRule);
}

/**
 * Setup the students sheet
 */
function setupStudentsSheet(sheet) {
  sheet.getRange('A1').setValue('Student ID');
  sheet.getRange('B1').setValue('Student Name');
  sheet.getRange('C1').setValue('Email');
  sheet.getRange('D1').setValue('Contact');
  
  sheet.getRange('A1:D1')
    .setFontWeight('bold')
    .setBackground('#34a853')
    .setFontColor('white');
  
  sheet.setColumnWidths(1, 4, 150);
}

/**
 * Setup the summary sheet
 */
function setupSummarySheet(sheet) {
  sheet.getRange('A1').setValue('Summary Report');
  sheet.getRange('A1').setFontWeight('bold').setFontSize(14);
  
  sheet.getRange('A3').setValue('Student Name');
  sheet.getRange('B3').setValue('Total Present');
  sheet.getRange('C3').setValue('Total Absent');
  sheet.getRange('D3').setValue('Total Late');
  sheet.getRange('E3').setValue('Total Days');
  sheet.getRange('F3').setValue('Attendance %');
  
  sheet.getRange('A3:F3')
    .setFontWeight('bold')
    .setBackground('#fbbc04')
    .setFontColor('white');
  
  sheet.setColumnWidths(1, 6, 150);
}

/**
 * Add today's date as a new column
 */
function addTodayDate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('⚠️ Please initialize sheets first!');
    return;
  }
  
  // Find the last column with data
  const lastColumn = sheet.getLastColumn();
  const newColumn = lastColumn + 1;
  
  // Add today's date
  const today = new Date();
  const dateCell = sheet.getRange(1, newColumn);
  dateCell.setValue(today);
  dateCell.setNumberFormat('MM/dd/yyyy');
  dateCell.setFontWeight('bold');
  dateCell.setBackground('#4285f4');
  dateCell.setFontColor('white');
  dateCell.setHorizontalAlignment('center');
  
  // Set column width
  sheet.setColumnWidth(newColumn, 100);
  
  SpreadsheetApp.getUi().alert(`✅ Added date: ${Utilities.formatDate(today, Session.getScriptTimeZone(), 'MM/dd/yyyy')}`);
}

/**
 * Generate summary report
 */
function generateSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const attendanceSheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
  const summarySheet = ss.getSheetByName(CONFIG.SUMMARY_SHEET);
  
  if (!attendanceSheet || !summarySheet) {
    SpreadsheetApp.getUi().alert('⚠️ Please initialize sheets first!');
    return;
  }
  
  // Clear previous summary
  const lastRow = summarySheet.getLastRow();
  if (lastRow > 3) {
    summarySheet.getRange(4, 1, lastRow - 3, 6).clear();
  }
  
  // Get attendance data
  const lastStudentRow = attendanceSheet.getLastRow();
  const lastDateColumn = attendanceSheet.getLastColumn();
  
  if (lastDateColumn < CONFIG.DATE_START_COLUMN) {
    SpreadsheetApp.getUi().alert('⚠️ No attendance dates found!');
    return;
  }
  
  const totalDays = lastDateColumn - CONFIG.DATE_START_COLUMN + 1;
  
  // Process each student
  for (let row = CONFIG.START_ROW; row <= lastStudentRow; row++) {
    const studentName = attendanceSheet.getRange(row, CONFIG.NAME_COLUMN).getValue();
    
    if (!studentName) continue;
    
    let present = 0, absent = 0, late = 0;
    
    // Count attendance
    for (let col = CONFIG.DATE_START_COLUMN; col <= lastDateColumn; col++) {
      const value = attendanceSheet.getRange(row, col).getValue().toString().toUpperCase();
      
      if (value === 'P') present++;
      else if (value === 'A') absent++;
      else if (value === 'L') late++;
    }
    
    const percentage = totalDays > 0 ? ((present + late) / totalDays * 100).toFixed(2) : 0;
    
    // Write to summary
    const summaryRow = row - CONFIG.START_ROW + 4;
    summarySheet.getRange(summaryRow, 1).setValue(studentName);
    summarySheet.getRange(summaryRow, 2).setValue(present);
    summarySheet.getRange(summaryRow, 3).setValue(absent);
    summarySheet.getRange(summaryRow, 4).setValue(late);
    summarySheet.getRange(summaryRow, 5).setValue(totalDays);
    summarySheet.getRange(summaryRow, 6).setValue(percentage + '%');
    
    // Color code percentage
    const percentCell = summarySheet.getRange(summaryRow, 6);
    if (parseFloat(percentage) >= 90) {
      percentCell.setBackground('#d9ead3');
    } else if (parseFloat(percentage) >= 75) {
      percentCell.setBackground('#fff2cc');
    } else {
      percentCell.setBackground('#f4cccc');
    }
  }
  
  SpreadsheetApp.getUi().alert('✅ Summary generated successfully!');
}

/**
 * Add student dialog
 */
function addStudentDialog() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt('Add New Student', 'Enter student name:', ui.ButtonSet.OK_CANCEL);
  
  if (result.getSelectedButton() == ui.Button.OK) {
    const studentName = result.getResponseText();
    addStudent(studentName);
  }
}

/**
 * Add a new student to the attendance sheet
 */
function addStudent(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('⚠️ Please initialize sheets first!');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, CONFIG.NAME_COLUMN).setValue(name);
  
  SpreadsheetApp.getUi().alert(`✅ Added student: ${name}`);
}

/**
 * Auto-fill all empty cells in the last date column with "P" (Present)
 */
function autoFillPresent() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert('⚠️ Please initialize sheets first!');
    return;
  }
  
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < CONFIG.DATE_START_COLUMN) {
    SpreadsheetApp.getUi().alert('⚠️ No attendance dates found!');
    return;
  }
  
  const lastRow = sheet.getLastRow();
  let filledCount = 0;
  
  for (let row = CONFIG.START_ROW; row <= lastRow; row++) {
    const cell = sheet.getRange(row, lastColumn);
    if (!cell.getValue()) {
      cell.setValue('P');
      filledCount++;
    }
  }
  
  SpreadsheetApp.getUi().alert(`✅ Filled ${filledCount} cells with "P" (Present)`);
}

/**
 * Conditional formatting helper
 */
function applyConditionalFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.ATTENDANCE_SHEET);
  
  // Clear existing rules
  sheet.clearConditionalFormatRules();
  
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  
  if (lastColumn < CONFIG.DATE_START_COLUMN) return;
  
  const range = sheet.getRange(CONFIG.START_ROW, CONFIG.DATE_START_COLUMN, 
                               lastRow - CONFIG.START_ROW + 1, 
                               lastColumn - CONFIG.DATE_START_COLUMN + 1);
  
  // Present = Green
  const presentRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('P')
    .setBackground('#d9ead3')
    .setRanges([range])
    .build();
  
  // Absent = Red
  const absentRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('A')
    .setBackground('#f4cccc')
    .setRanges([range])
    .build();
  
  // Late = Yellow
  const lateRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('L')
    .setBackground('#fff2cc')
    .setRanges([range])
    .build();
  
  sheet.setConditionalFormatRules([presentRule, absentRule, lateRule]);
}
