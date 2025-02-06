// ✅ Check emails, process all RFQs in a thread, analyze with OpenAI, and send Telegram alerts
function analyzeRFQEmailsDaily() {
	try {
	  // ✅ Get credentials
	  const credentials = {
		openAIKey: getScriptProperty("OPENAI_API_KEY"),
		telegramBot: getScriptProperty("TELEGRAM_BOT_TOKEN"),
		chatId: getScriptProperty("TELEGRAM_CHAT_ID"),
		googleSheetId: getScriptProperty("GOOGLE_SHEET_ID")
	  };
  
	  if (!validateCredentials(credentials)) {
		Logger.log("❌ Missing API credentials.");
		return;
	  }
  
	  // ✅ Search RFQs under "FGV RFQ" Gmail label (Last 24 Hours)
	  const threads = GmailApp.search(CONFIG.GMAIL.SEARCH_QUERY);
	  const relevantRFQs = [];
  
	  for (const thread of threads) {
		const messages = thread.getMessages(); // ✅ Process all emails in a thread
  
		for (const message of messages) {
		  const messageId = message.getId();
  
		  // ✅ Skip if already processed
		  if (PropertiesService.getScriptProperties().getProperty(messageId)) continue;
  
		  const emailContent = {
			body: message.getPlainBody(),
			subject: message.getSubject()
		  };
  
		  // ✅ Extract RFQ details
		  const rfqDetails = extractRFQDetails(emailContent.body, emailContent.subject);
		  if (!rfqDetails.eventName) continue;
  
		  // ✅ Allow all RFQs except clear mismatches
		  if (!isExcludedRFQ(rfqDetails)) {
			const openAIResult = analyzeWithOpenAI(rfqDetails, credentials.openAIKey);
  
			if (openAIResult.isRelevant) {
			  relevantRFQs.push({
				...rfqDetails,
				messageId,
				link: `https://mail.google.com/mail/u/0/#inbox/${messageId}`,
				reasoning: openAIResult.reasoning
			  });
  
			  // ✅ Mark as important and apply label
			  thread.markImportant();
			  applyLabel(thread, "FGV Chemical RFQ");
			}
		  }
  
		  // ✅ Mark message as processed
		  markMessageAsProcessed(messageId);
		}
	  }
  
	  // ✅ Send notifications based on RFQ count
	  if (relevantRFQs.length > 0) {
		sendNotifications(relevantRFQs, credentials);
  
		// ✅ Log matches to Google Sheets if Sheet ID is provided
		if (credentials.googleSheetId) {
		  logRFQMatches(relevantRFQs, credentials.googleSheetId);
		}
	  }
  
	} catch (error) {
	  Logger.log("❌ Error in main execution: " + error.message);
	}
  }