// ✅ Function to get stored credentials
function getScriptProperty(propertyName) {
  return PropertiesService.getScriptProperties().getProperty(propertyName);
}

// ✅ Validate API Credentials
function validateCredentials(credentials) {
  const required = ['openAIKey', 'telegramBot', 'chatId'];
  const missing = required.filter(key => !credentials[key]);

  if (missing.length > 0) {
    Logger.log(`❌ Missing credentials: ${missing.join(', ')}`);
    return false;
  }
  return true;
}