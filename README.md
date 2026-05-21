# 📋 Automated Attendance Sheet System for Google Sheets

An automated attendance tracking system built with Google Apps Script that integrates with Google Sheets to manage student attendance efficiently.

## ✨ Features

- **Automatic Date Management**: Add today's date with one click
- **Multiple Sheets**: Organized structure with Attendance, Students, and Summary sheets
- **Attendance Tracking**: Track Present (P), Absent (A), or Late (L) for each student
- **Auto-fill Present**: Quickly mark all students as present for a day
- **Summary Reports**: Automatically generate attendance statistics and percentages
- **Color-Coded**: Visual feedback with conditional formatting
- **Easy Student Management**: Add students through a simple dialog

## 🚀 Setup Instructions

### Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Attendance Tracker" or any name you prefer

### Step 2: Add the Script

1. In your Google Sheet, click on **Extensions** → **Apps Script**
2. Delete any code in the editor
3. Copy all the code from `attendance-script.gs` file
4. Paste it into the Apps Script editor
5. Click the **Save** icon (💾) and name your project "Attendance System"

### Step 3: Authorize the Script

1. Close the Apps Script tab and return to your Google Sheet
2. Refresh the page (F5 or Ctrl+R)
3. You'll see a new menu called **📋 Attendance System** appear in the menu bar
4. Click on **📋 Attendance System** → **🆕 Initialize Sheets**
5. Google will ask for authorization - click **Continue** and grant the necessary permissions

## 📖 How to Use

### Initial Setup

1. **Initialize Sheets**: Click **📋 Attendance System** → **🆕 Initialize Sheets**
   - This creates three sheets: Attendance, Students, and Summary
   - Adds sample students to get you started

### Daily Operations

2. **Add Today's Date**: Click **📋 Attendance System** → **➕ Add Today's Date**
   - Adds a new column with today's date
   - Do this at the start of each day/class

3. **Mark Attendance**: In the Attendance sheet
   - Enter **P** for Present
   - Enter **A** for Absent  
   - Enter **L** for Late
   - Cells will automatically color-code:
     - 🟢 Green = Present
     - 🔴 Red = Absent
     - 🟡 Yellow = Late

4. **Auto-fill Present** (Optional): Click **📋 Attendance System** → **🔄 Auto-fill Present**
   - Automatically marks all empty cells in the latest date column as "P"
   - Great for classes with high attendance - mark everyone present, then change exceptions

5. **Add Students**: Click **📋 Attendance System** → **👥 Add Student**
   - Enter student name in the dialog
   - Student is added to the attendance sheet

6. **Generate Summary**: Click **📋 Attendance System** → **📊 Generate Summary**
   - Creates a summary report with:
     - Total Present days
     - Total Absent days
     - Total Late days
     - Total Days tracked
     - Attendance percentage
   - Color-coded percentages:
     - 🟢 Green = 90% or above
     - 🟡 Yellow = 75-89%
     - 🔴 Red = Below 75%

## 📊 Sheet Descriptions

### Attendance Sheet
- Main sheet for daily attendance tracking
- First column: Student names
- Following columns: Dates (one per day)
- Use P/A/L to mark attendance

### Students Sheet
- Store additional student information
- Columns: Student ID, Name, Email, Contact
- Optional - use for reference

### Summary Sheet
- Auto-generated attendance statistics
- Shows total P/A/L counts and percentages
- Updates when you run "Generate Summary"

## 🎯 Tips & Best Practices

1. **Start Each Session**: Click "Add Today's Date" at the beginning of class
2. **Quick Entry**: Use the auto-fill present feature for classes with high attendance
3. **Regular Summaries**: Generate summary reports weekly or monthly to track trends
4. **Data Validation**: The system prevents invalid entries - only P, A, L, or empty cells are allowed
5. **Backup**: Google Sheets automatically saves, but you can download backups via File → Download

## 🔧 Customization

You can modify the script to:
- Change color schemes
- Add more attendance status options (e.g., "E" for Excused)
- Add automatic email notifications for low attendance
- Export reports to PDF
- Add time-based tracking (specific class periods)

## 📱 Mobile Access

This system works on mobile devices through the Google Sheets app:
1. Open the sheet on your phone
2. Use the three-dot menu to access Apps Script functions
3. Mark attendance on the go

## 🆘 Troubleshooting

**Menu not appearing?**
- Refresh the page
- Make sure you've run the script authorization

**Can't mark attendance?**
- Ensure you've initialized the sheets
- Check that you're entering only P, A, or L

**Summary not generating?**
- Make sure you have at least one date column
- Verify student names are in column A

## 📄 License

Free to use and modify for educational purposes.

## 🤝 Support

For issues or questions, check the code comments or modify the script to fit your specific needs.

---

**Happy Tracking! 📚**
