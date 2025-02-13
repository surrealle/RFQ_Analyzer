// Configuration constants
const CONFIG = {
    TELEGRAM: {
        MAX_LENGTH: 4096,
        PARSE_MODE: 'HTML',
        MESSAGE_TYPES: {
            SINGLE: 'single',
            CONSOLIDATED: 'consolidated'
        }
    },
    OPENAI: {
        MODEL: "gpt-3.5-turbo",
        TEMPERATURE: 0.2,
        MAX_TOKENS: 150,
        PRICING: {
            PROMPT_RATE: 0.0015 / 1000,
            COMPLETION_RATE: 0.002 / 1000
        }
    },
    GMAIL: {
        SEARCH_QUERY: 'label:FGV-RFQ newer_than:1d',
        LABELS: {
            CHEMICAL_RFQ: 'FGV Chemical RFQ'
        },
        EXCLUDED_SUBJECTS: ['Event Ended']
    },
    SCRIPT_PROPERTIES: {
        API_COUNT_MONTH: "API_COUNT_MONTH",
        MONTHLY_TOKENS: "MONTHLY_TOKENS",
        MONTHLY_COST: "MONTHLY_COST"
    },
    RFQ: {
        RELEVANT_KEYWORDS: [
            "chemical", "bahan kimia", "soda", "alum", "polymer", 
            "water treatment", "cooling tower", "boiler chemical", 
            "effluent", "makmal", "laboratory", "analisis", "study", 
            "waste characteristic", "processing water materials",
            "cooling tower treatment", "belian chemical", "annual tender",
            "boiler water", "filter media", "pemprosesan air",
            "pembelian chemical", "supply chemical", "water analysis",
            "supply chemicals", "water treatment supply", 
            "bahan rawatan air", "filter system"
        ],
        EXCLUDE_KEYWORDS: [
            "calibration", "instrumen", "alatganti", "gearbox", 
            "conveyor", "barang elektrik", "contractor"
        ]
    },
};