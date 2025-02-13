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

// ✅ Mark message in Script Properties (quick lookup)
function markMessageInProperties(messageId) {
  try {
    PropertiesService.getScriptProperties().setProperty(messageId, "processed");
    Logger.log(`✅ Message ${messageId} marked in Script Properties`);
  } catch (error) {
    Logger.log(`❌ Error marking message in properties: ${error.message}`);
  }
}

// ✅ Mark an RFQ as Processed in Sheets (historical tracking)
function markRFQAsProcessed(referenceNumber, messageId) {
  try {
    const sheetId = getScriptProperty("GOOGLE_SHEET_ID");
    if (!sheetId) {
      Logger.log("⚠️ No Google Sheet ID found. Skipping RFQ tracking.");
      return;
    }

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Processed RFQs") ||
                 SpreadsheetApp.openById(sheetId).insertSheet("Processed RFQs");

    // ✅ Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Date", "Reference Number", "Message ID"]);
    }

    // ✅ Check if RFQ is already logged (avoid duplicates)
    const data = sheet.getDataRange().getValues();
    const existingRFQs = data.map(row => row[1]); // Reference Number column

    if (!existingRFQs.includes(referenceNumber)) {
      sheet.appendRow([new Date(), referenceNumber, messageId]);
      Logger.log(`✅ RFQ ${referenceNumber} marked as processed.`);
    } else {
      Logger.log(`⏩ RFQ ${referenceNumber} is already logged. Skipping.`);
    }
  } catch (error) {
    Logger.log("❌ Error marking RFQ as processed: " + error.message);
  }
}

// ✅ Combined function to mark both properties and sheets
function markMessageAsProcessed(referenceNumber, messageId) {
  markMessageInProperties(messageId);
  markRFQAsProcessed(referenceNumber, messageId);
}

// ✅ Check if an RFQ has already been processed using Reference Number
function isRFQProcessed(referenceNumber) {
  try {
    const sheetId = getScriptProperty("GOOGLE_SHEET_ID");
    if (!sheetId) {
      Logger.log("⚠️ No Google Sheet ID found. Skipping RFQ check.");
      return false;
    }

    const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Processed RFQs");
    if (!sheet) return false;

    const data = sheet.getDataRange().getValues();
    return data.some(row => row[1] === referenceNumber); // Check if reference exists
  } catch (error) {
    Logger.log("❌ Error checking if RFQ is processed: " + error.message);
    return false;
  }
}