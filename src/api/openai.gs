// ✅ OpenAI Analysis with Better Error Handling & Cost Tracking
function analyzeWithOpenAI(rfqDetails, apiKey) {
  try {
    const textToAnalyze = `As a procurement expert, analyze if this RFQ is related to chemical supplies or water treatment:
Title: ${rfqDetails.eventName}
Business Unit: ${rfqDetails.businessUnit || ''}

Reply ONLY with a JSON object:
{
  "isRelevant": true/false,
  "reasoning": "one brief sentence why"
}`;

    const payload = {
      model: CONFIG.OPENAI.MODEL,
      messages: [
        {
          role: "system",
          content: "You are a procurement expert specializing in chemical supplies. Respond only in JSON format."
        },
        {
          role: "user",
          content: textToAnalyze
        }
      ],
      temperature: CONFIG.OPENAI.TEMPERATURE,
      max_tokens: CONFIG.OPENAI.MAX_TOKENS
    };

    const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });

    const result = JSON.parse(response.getContentText());

    if (!result.choices || result.choices.length === 0) {
      Logger.log("❌ OpenAI API returned no response.");
      return { isRelevant: false, reasoning: "No response from OpenAI" };
    }

    let analysis;
    try {
      analysis = JSON.parse(result.choices[0].message.content);
    } catch (error) {
      Logger.log("❌ Error parsing OpenAI JSON: " + error.message);
      return { isRelevant: false, reasoning: "Invalid response format" };
    }

    // Log API usage
    if (result.usage) {
      logAPIUsage(result.usage);
    }

    return analysis;

  } catch (error) {
    Logger.log("❌ OpenAI Analysis Error: " + error.message);
    return { isRelevant: false, reasoning: "Error in analysis" };
  }
}

// ✅ Accurate OpenAI Cost Tracking
function logAPIUsage(usage) {
  const props = PropertiesService.getScriptProperties();
  const currentMonth = new Date().getMonth();
  const storedMonth = props.getProperty(CONFIG.SCRIPT_PROPERTIES.API_COUNT_MONTH);

  // Reset if new month
  if (storedMonth !== currentMonth.toString()) {
    props.setProperties({
      [CONFIG.SCRIPT_PROPERTIES.API_COUNT_MONTH]: currentMonth.toString(),
      [CONFIG.SCRIPT_PROPERTIES.MONTHLY_TOKENS]: "0",
      [CONFIG.SCRIPT_PROPERTIES.MONTHLY_COST]: "0"
    });
  }

  // OpenAI pricing (GPT-3.5 Turbo)
  const promptCost = usage.prompt_tokens * CONFIG.OPENAI.PRICING.PROMPT_RATE;
  const completionCost = usage.completion_tokens * CONFIG.OPENAI.PRICING.COMPLETION_RATE;
  const newCost = promptCost + completionCost;

  const currentTokens = parseInt(props.getProperty("MONTHLY_TOKENS") || "0");
  const currentCost = parseFloat(props.getProperty("MONTHLY_COST") || "0");

  props.setProperties({
    "MONTHLY_TOKENS": (currentTokens + usage.total_tokens).toString(),
    "MONTHLY_COST": (currentCost + newCost).toString()
  });

  Logger.log(`📊 Total OpenAI API Cost This Month: $${(currentCost + newCost).toFixed(4)}`);
}

// ✅ Get Current API Usage for Telegram Summary
function getCurrentAPIUsage() {
  const props = PropertiesService.getScriptProperties();
  const tokens = parseInt(props.getProperty("MONTHLY_TOKENS") || "0");
  const cost = parseFloat(props.getProperty("MONTHLY_COST") || "0");

  return `📊 <b>API Usage:</b> ${tokens} tokens used, total cost: $${cost.toFixed(4)}`;
}