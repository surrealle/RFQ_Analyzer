// ✅ Log RFQ Matches to Google Sheets
function logRFQMatches(rfqs, sheetId) {
  try {
    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("RFQ Matches") ||
                 SpreadsheetApp.openById(sheetId).insertSheet("RFQ Matches");

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date", "Event Name", "Reference", "Business Unit",
        "Buyer", "Start Date", "End Date", "AI Reasoning", "Link"
      ]);
    }

    rfqs.forEach(rfq => {
      sheet.appendRow([
        new Date(),
        rfq.eventName,
        rfq.referenceNumber,
        rfq.businessUnit,
        rfq.buyer,
        rfq.startDate,
        rfq.endDate,
        rfq.reasoning,
        rfq.link
      ]);
    });

    Logger.log(`✅ Successfully logged ${rfqs.length} RFQs to Google Sheets.`);
  } catch (error) {
    Logger.log("❌ Error logging RFQ matches: " + error.message);
  }
}