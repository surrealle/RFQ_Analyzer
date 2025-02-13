// ✅ Extract RFQ Details from Email Body
function extractRFQDetails(emailBody, subject) {
  try {
    return {
      eventName: emailBody.match(/Event Name\s*:\s*(.*)/i)?.[1]?.trim() || subject,
      referenceNumber: emailBody.match(/Reference Number\s*:\s*(.*)/i)?.[1]?.trim(),
      businessUnit: emailBody.match(/Business Unit\s*:\s*(.*)/i)?.[1]?.trim(),
      endDate: emailBody.match(/Event End Date\s*:\s*(.*)/i)?.[1]?.trim(),
      startDate: emailBody.match(/Event Start Date\s*:\s*(.*)/i)?.[1]?.trim(),
      buyer: emailBody.match(/Buyer\s*:\s*(.*)/i)?.[1]?.trim()
    };
  } catch (error) {
    Logger.log("❌ Error extracting RFQ details: " + error.message);
    return { eventName: null };
  }
}

// ✅ Exclude Only Very Obvious Non-Chemical RFQs
function isExcludedRFQ(rfqDetails) {
  const textToCheck = `${rfqDetails.eventName} ${rfqDetails.businessUnit}`.toLowerCase();
  
  const excludeKeywords = [
    "calibration", "instrumen", "alatganti", "gearbox", "conveyor",
    "peralatan", "barang elektrik", "tenaga kerja", "manpower", "contractor", "service"
  ];

  return excludeKeywords.some(word => textToCheck.includes(word));
}

// ✅ Smarter Keyword Matching with Partial Match Allowance
function isLikelyChemicalRFQ(rfqDetails) {
    const textToCheck = `${rfqDetails.eventName} ${rfqDetails.businessUnit}`.toLowerCase();

    // ✅ Count the number of relevant keyword matches
    const relevantMatches = CONFIG.RFQ.RELEVANT_KEYWORDS.filter(
        word => textToCheck.includes(word)
    ).length;

    // ✅ Check if any excluded keywords are present
    const hasExcludedKeyword = CONFIG.RFQ.EXCLUDE_KEYWORDS.some(
        word => textToCheck.includes(word)
    );

    // ✅ Return true if at least 2 relevant keywords match and no exclusion words are found
    return (relevantMatches >= 2) && !hasExcludedKeyword;
}


// ✅ Apply Gmail Label to Important RFQs
function applyLabel(thread, labelName = CONFIG.GMAIL.LABELS.CHEMICAL_RFQ) {
  try {
    let label = GmailApp.getUserLabelByName(labelName);
    if (!label) {
      label = GmailApp.createLabel(labelName);
    }
    thread.addLabel(label);
  } catch (error) {
    Logger.log("❌ Error applying label: " + error.message);
  }
}