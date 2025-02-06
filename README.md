# RFQ Analyzer

**Automated RFQ Processing & Notification System**  

🚀 This Google Apps Script scans Gmail for RFQs, filters **chemical-related** RFQs using AI, and sends **Telegram notifications**. It also logs matched RFQs to **Google Sheets** for tracking.

## 🔹 Features
✅ **Gmail Integration** → Scans emails labeled `FGV-RFQ` for RFQs  
✅ **Smart Filtering** → Uses predefined **keyword matching** to identify relevant RFQs  
✅ **OpenAI Integration** → Analyzes RFQs to confirm chemical relevance  
✅ **Telegram Notifications** → Alerts users when a relevant RFQ is found  
✅ **Google Sheets Logging** → Saves matched RFQs for tracking  
✅ **Cost Tracking** → Monitors OpenAI API usage & cost  

## 📁 Project Structure
```
rfq-analyzer/
├── src/
│   ├── api/
│   │   ├── openai.gs        # OpenAI RFQ analysis functions
│   │   ├── telegram.gs      # Telegram notifications
│   ├── services/
│   │   ├── gmail.gs         # Gmail RFQ processing
│   │   ├── sheets.gs        # Google Sheets logging
│   ├── config.gs            # Retrieves API credentials from script properties
│   ├── constants.gs         # Stores static values (keywords, labels, etc.)
│   ├── main.gs              # Entry point for the script execution
├── LICENSE
├── README.md
└── appsscript.json
```

## ⚙️ Setup & Installation
### 1️⃣ Clone or Deploy the Script
#### Option 1: Clone Locally Using Clasp
1. Install **Google Apps Script CLI (`clasp`)**  
   ```sh
   npm install -g @google/clasp
   ```
2. Authenticate with Google:  
   ```sh
   clasp login
   ```
3. Clone the Apps Script project:  
   ```sh
   clasp clone <scriptId>
   ```
   (Find `scriptId` in **Apps Script Editor > Project Settings**)
4. Push changes back to Apps Script:  
   ```sh
   clasp push
   ```

#### Option 2: Manually Copy & Paste into Apps Script
1. Open **Google Apps Script** (`script.google.com`).
2. Create a new project.
3. Copy & paste each `.gs` file into separate script files.
4. Save and deploy.

## 📊 OpenAI API Cost Tracking
This script tracks OpenAI API usage & cost. You can view it using:

```javascript
function getCurrentAPIUsage() {
    const tokens = parseInt(PropertiesService.getScriptProperties().getProperty("MONTHLY_TOKENS") || "0");
    const cost = parseFloat(PropertiesService.getScriptProperties().getProperty("MONTHLY_COST") || "0");
    return `📊 API Usage: ${tokens} tokens used, total cost: $${cost.toFixed(4)}`;
}
```

## 📌 Troubleshooting
### Bot Not Sending Messages?
- Check if the **Telegram Bot Token** is correct.
- Ensure **Telegram Chat ID** is set properly.

### OpenAI Not Filtering Correctly?
- Add or modify **keywords** in `constants.gs`.

### No RFQs Being Processed?
- Ensure the Gmail label **`FGV-RFQ`** is applied to relevant emails.

## 📜 License
This project is licensed under the **MIT License**.

## 📞 Support
For any issues, feel free to open an **issue on GitHub** or contact me.


