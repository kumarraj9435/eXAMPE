// ================================================================
// INVOICE GENERATOR - Google Apps Script
// Features: Create Invoice, Save Data, PDF Export, Dashboard
// Based on: GENUINE INNOVATIONS PVT LTD Tax Invoice Format
// ================================================================

// ---- CONFIG ----
var INVOICE_SHEET = "All Invoices";
var ITEMS_SHEET = "Invoice Items";
var CONFIG_SHEET = "Config";

// ---- MENU ----
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("📄 Invoice Generator")
    .addItem("🆕 Create New Invoice", "showInvoiceForm")
    .addItem("📊 Dashboard", "showDashboard")
    .addItem("📋 View All Invoices", "goToInvoiceSheet")
    .addSeparator()
    .addItem("⚙️ Setup Sheets", "setupSheets")
    .addToUi();
}

// ---- SETUP SHEETS ----
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // All Invoices Sheet
  var invSheet = ss.getSheetByName(INVOICE_SHEET);
  if (!invSheet) {
    invSheet = ss.insertSheet(INVOICE_SHEET);
  }
  invSheet.clear();
  var invHeaders = [
    "Invoice No", "Date", "Buyer Name", "Buyer Address", "Buyer GSTIN", 
    "Buyer State", "Consignee Name", "Consignee Address", "Consignee GSTIN",
    "Total Items", "Subtotal", "CGST", "SGST", "IGST", "Grand Total",
    "Payment Terms", "Reference No", "Status", "Created At"
  ];
  invSheet.getRange(1, 1, 1, invHeaders.length).setValues([invHeaders]);
  invSheet.getRange(1, 1, 1, invHeaders.length).setFontWeight("bold").setBackground("#4285f4").setFontColor("white");
  invSheet.setFrozenRows(1);
  
  // Invoice Items Sheet
  var itemsSheet = ss.getSheetByName(ITEMS_SHEET);
  if (!itemsSheet) {
    itemsSheet = ss.insertSheet(ITEMS_SHEET);
  }
  itemsSheet.clear();
  var itemHeaders = [
    "Invoice No", "Sr No", "Description", "HSN/SAC", "Quantity", "Unit",
    "Rate", "Discount %", "Amount", "Item Code", "Product UPC"
  ];
  itemsSheet.getRange(1, 1, 1, itemHeaders.length).setValues([itemHeaders]);
  itemsSheet.getRange(1, 1, 1, itemHeaders.length).setFontWeight("bold").setBackground("#34a853").setFontColor("white");
  itemsSheet.setFrozenRows(1);
  
  // Config Sheet
  var configSheet = ss.getSheetByName(CONFIG_SHEET);
  if (!configSheet) {
    configSheet = ss.insertSheet(CONFIG_SHEET);
  }
  configSheet.clear();
  var configData = [
    ["Setting", "Value"],
    ["Company Name", "GENUINE INNOVATIONS PVT LTD"],
    ["Company Address", "1st floor 84/3 Mundka Industrial Area, Delhi 110041"],
    ["Company GSTIN", "07AAHCG8852E1ZF"],
    ["Company State", "Delhi, Code: 07"],
    ["Company CIN", "U52609DL2019PTC351933"],
    ["Company Email", "seller@unigenlifestyle.com"],
    ["Company Website", "www.unigenlifestyle.com"],
    ["Invoice Prefix", "GST"],
    ["Next Invoice Number", "202526001"],
    ["CGST Rate", "9"],
    ["SGST Rate", "9"],
    ["IGST Rate", "18"]
  ];
  configSheet.getRange(1, 1, configData.length, 2).setValues(configData);
  configSheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#fbbc04");
  
  SpreadsheetApp.getUi().alert("✅ Setup complete! All sheets created.");
}

// ---- SHOW INVOICE FORM ----
function showInvoiceForm() {
  var html = HtmlService.createHtmlOutputFromFile("InvoiceForm")
    .setWidth(900)
    .setHeight(700)
    .setTitle("Create New Invoice");
  SpreadsheetApp.getUi().showModalDialog(html, "📄 Create New Invoice");
}

// ---- SHOW DASHBOARD ----
function showDashboard() {
  var html = HtmlService.createHtmlOutputFromFile("Dashboard")
    .setWidth(900)
    .setHeight(600)
    .setTitle("Invoice Dashboard");
  SpreadsheetApp.getUi().showModalDialog(html, "📊 Invoice Dashboard");
}

// ---- GO TO INVOICE SHEET ----
function goToInvoiceSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(INVOICE_SHEET);
  if (sheet) {
    ss.setActiveSheet(sheet);
  } else {
    SpreadsheetApp.getUi().alert("⚠️ Please run Setup first!");
  }
}

// ---- GET CONFIG ----
function getConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet) return null;
  
  var data = sheet.getDataRange().getValues();
  var config = {};
  for (var i = 1; i < data.length; i++) {
    config[data[i][0]] = data[i][1];
  }
  return config;
}

// ---- GET NEXT INVOICE NUMBER ----
function getNextInvoiceNumber() {
  var config = getConfig();
  if (!config) return "GST000001";
  var prefix = config["Invoice Prefix"] || "GST";
  var nextNum = config["Next Invoice Number"] || "1";
  return prefix + nextNum;
}

// ---- SAVE INVOICE ----
function saveInvoice(invoiceData) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var invSheet = ss.getSheetByName(INVOICE_SHEET);
    var itemsSheet = ss.getSheetByName(ITEMS_SHEET);
    var configSheet = ss.getSheetByName(CONFIG_SHEET);
    
    if (!invSheet || !itemsSheet) {
      return {success: false, message: "Sheets not found! Please run Setup first."};
    }
    
    var invoiceNo = invoiceData.invoiceNo;
    var now = new Date();
    
    // Save main invoice data
    var invRow = [
      invoiceNo,
      invoiceData.date,
      invoiceData.buyerName,
      invoiceData.buyerAddress,
      invoiceData.buyerGstin,
      invoiceData.buyerState,
      invoiceData.consigneeName,
      invoiceData.consigneeAddress,
      invoiceData.consigneeGstin,
      invoiceData.items.length,
      invoiceData.subtotal,
      invoiceData.cgst,
      invoiceData.sgst,
      invoiceData.igst,
      invoiceData.grandTotal,
      invoiceData.paymentTerms,
      invoiceData.referenceNo,
      "Created",
      now
    ];
    invSheet.appendRow(invRow);
    
    // Save items
    for (var i = 0; i < invoiceData.items.length; i++) {
      var item = invoiceData.items[i];
      var itemRow = [
        invoiceNo,
        i + 1,
        item.description,
        item.hsn,
        item.quantity,
        item.unit,
        item.rate,
        item.discount,
        item.amount,
        item.itemCode,
        item.productUpc
      ];
      itemsSheet.appendRow(itemRow);
    }
    
    // Update next invoice number
    if (configSheet) {
      var data = configSheet.getDataRange().getValues();
      for (var j = 1; j < data.length; j++) {
        if (data[j][0] === "Next Invoice Number") {
          var currentNum = parseInt(data[j][1]);
          configSheet.getRange(j + 1, 2).setValue(currentNum + 1);
          break;
        }
      }
    }
    
    return {success: true, message: "Invoice " + invoiceNo + " saved successfully!", invoiceNo: invoiceNo};
  } catch(e) {
    return {success: false, message: "Error: " + e.message};
  }
}

// ---- GET DASHBOARD DATA ----
function getDashboardData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var invSheet = ss.getSheetByName(INVOICE_SHEET);
  
  if (!invSheet || invSheet.getLastRow() <= 1) {
    return {
      totalInvoices: 0,
      totalRevenue: 0,
      thisMonthInvoices: 0,
      thisMonthRevenue: 0,
      recentInvoices: []
    };
  }
  
  var data = invSheet.getDataRange().getValues();
  var totalInvoices = data.length - 1;
  var totalRevenue = 0;
  var thisMonthInvoices = 0;
  var thisMonthRevenue = 0;
  var now = new Date();
  var currentMonth = now.getMonth();
  var currentYear = now.getFullYear();
  var recentInvoices = [];
  
  for (var i = 1; i < data.length; i++) {
    var grandTotal = parseFloat(data[i][14]) || 0;
    totalRevenue += grandTotal;
    
    var invDate = new Date(data[i][1]);
    if (invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear) {
      thisMonthInvoices++;
      thisMonthRevenue += grandTotal;
    }
    
    // Last 10 invoices
    if (i >= data.length - 10) {
      recentInvoices.push({
        invoiceNo: data[i][0],
        date: data[i][1],
        buyerName: data[i][2],
        grandTotal: grandTotal,
        status: data[i][17]
      });
    }
  }
  
  recentInvoices.reverse();
  
  return {
    totalInvoices: totalInvoices,
    totalRevenue: totalRevenue,
    thisMonthInvoices: thisMonthInvoices,
    thisMonthRevenue: thisMonthRevenue,
    recentInvoices: recentInvoices
  };
}

// ---- GENERATE PDF ----
function generateInvoicePDF(invoiceNo) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var invSheet = ss.getSheetByName(INVOICE_SHEET);
    var itemsSheet = ss.getSheetByName(ITEMS_SHEET);
    var config = getConfig();
    
    // Find invoice
    var invData = invSheet.getDataRange().getValues();
    var invoice = null;
    for (var i = 1; i < invData.length; i++) {
      if (invData[i][0] === invoiceNo) {
        invoice = {
          invoiceNo: invData[i][0],
          date: invData[i][1],
          buyerName: invData[i][2],
          buyerAddress: invData[i][3],
          buyerGstin: invData[i][4],
          buyerState: invData[i][5],
          consigneeName: invData[i][6],
          consigneeAddress: invData[i][7],
          consigneeGstin: invData[i][8],
          subtotal: invData[i][10],
          cgst: invData[i][11],
          sgst: invData[i][12],
          igst: invData[i][13],
          grandTotal: invData[i][14],
          paymentTerms: invData[i][15],
          referenceNo: invData[i][16]
        };
        break;
      }
    }
    
    if (!invoice) return {success: false, message: "Invoice not found!"};
    
    // Find items
    var itemsData = itemsSheet.getDataRange().getValues();
    var items = [];
    for (var j = 1; j < itemsData.length; j++) {
      if (itemsData[j][0] === invoiceNo) {
        items.push({
          srNo: itemsData[j][1],
          description: itemsData[j][2],
          hsn: itemsData[j][3],
          quantity: itemsData[j][4],
          unit: itemsData[j][5],
          rate: itemsData[j][6],
          discount: itemsData[j][7],
          amount: itemsData[j][8]
        });
      }
    }
    
    invoice.items = items;
    invoice.config = config;
    
    return {success: true, invoice: invoice};
  } catch(e) {
    return {success: false, message: "Error: " + e.message};
  }
}

// ---- GET ALL INVOICES ----
function getAllInvoices() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var invSheet = ss.getSheetByName(INVOICE_SHEET);
  
  if (!invSheet || invSheet.getLastRow() <= 1) return [];
  
  var data = invSheet.getDataRange().getValues();
  var invoices = [];
  
  for (var i = 1; i < data.length; i++) {
    invoices.push({
      invoiceNo: data[i][0],
      date: data[i][1],
      buyerName: data[i][2],
      grandTotal: data[i][14],
      status: data[i][17]
    });
  }
  
  return invoices.reverse();
}
