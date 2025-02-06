// ✅ Send Telegram Message
function sendTelegramAlert(botToken, chatId, message) {
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const options = {
    method: "post",
    payload: {
      chat_id: chatId,
      text: message,
      parse_mode: CONFIG.TELEGRAM.PARSE_MODE
    }
  };

  try {
    UrlFetchApp.fetch(telegramUrl, options);
  } catch (error) {
    Logger.log("❌ Error sending Telegram message: " + error.message);
  }
}

// ✅ Hybrid Notification Mode: Sends One Message per RFQ or Consolidated if ≤ 10
function sendNotifications(relevantRFQs, credentials) {
  if (relevantRFQs.length === 1) {
    sendTelegramAlert(credentials.telegramBot, credentials.chatId, formatSingleRFQMessage(relevantRFQs[0]));
  } else if (relevantRFQs.length <= 10) {
    sendTelegramAlert(credentials.telegramBot, credentials.chatId, formatTelegramMessage(relevantRFQs));
  } else {
    relevantRFQs.forEach(rfq => {
      sendTelegramAlert(credentials.telegramBot, credentials.chatId, formatSingleRFQMessage(rfq));
    });
  }
}

// ✅ Format Single RFQ for Telegram (Includes API Usage)
function formatSingleRFQMessage(rfq) {
  return `🔔 <b>New Chemical RFQ Alert</b>\n
📝 <b>Event:</b> ${escapeHtml(rfq.eventName)}
🔢 <b>Reference:</b> <code>${rfq.referenceNumber}</code>
🏢 <b>Unit:</b> ${escapeHtml(rfq.businessUnit)}
👤 <b>Buyer:</b> ${escapeHtml(rfq.buyer)}
📅 <b>Start:</b> ${escapeHtml(rfq.startDate)}
⏰ <b>End:</b> ${escapeHtml(rfq.endDate)}
💭 <b>AI Analysis:</b> ${escapeHtml(rfq.reasoning)}
🔗 <a href="${rfq.link}">Open in Gmail</a>\n\n${getCurrentAPIUsage()}`;
}

// ✅ Format Multiple RFQs for Telegram (Includes API Usage)
function formatTelegramMessage(rfqs) {
  let message = `🔍 <b>Chemical RFQs Found</b> (${new Date().toLocaleDateString()})\n\n`;
  let messageLength = message.length;

  rfqs.forEach((rfq, index) => {
    let details = `
🔔 <b>RFQ #${index + 1}</b>
📝 <b>Event:</b> ${escapeHtml(rfq.eventName)}
🔢 <b>Reference:</b> <code>${rfq.referenceNumber}</code>
🏢 <b>Unit:</b> ${escapeHtml(rfq.businessUnit)}
👤 <b>Buyer:</b> ${escapeHtml(rfq.buyer)}
📅 <b>Start:</b> ${escapeHtml(rfq.startDate)}
⏰ <b>End:</b> ${escapeHtml(rfq.endDate)}
💭 <b>AI Analysis:</b> ${escapeHtml(rfq.reasoning)}
🔗 <a href="${rfq.link}">Open in Gmail</a>
──────────────`;

    if ((messageLength + details.length) < CONFIG.TELEGRAM.MAX_LENGTH) {
      message += details;
      messageLength += details.length;
    }
  });

  // ✅ Add API Usage Summary at the End of the Message
  return message + `\n\n💡 Found ${rfqs.length} relevant RFQs\n\n${getCurrentAPIUsage()}`;
}

// ✅ Escape HTML Characters for Telegram
function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#39;");
}