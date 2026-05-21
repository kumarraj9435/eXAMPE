function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Barcode Label Generator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
