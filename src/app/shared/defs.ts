
export const PRODUCTS = [
  "rent",
  "shopping",
  "coffee",
  "phone",
  // "cryptocurrency",
  "groceries",
  "salary",
  "restaurant",
  "transport",
  "cinema",
  "concert",
  "taxes"
];

export const INTERVALS = [
  {id: "begining"},
  {id: "week"},
  {id: "month"},
  {id: "2months"},
  {id: "6months"},
  {id: "1yr"},
  {id: "2yrs"},
  {id: "5yrs"},
  {id: "10yrs"},
  {id: "20yrs"}
];

export const REPEAT = [
  "daily", 
  "workdays", 
  "weekly", 
  "monthly", 
  "monthly_two", 
  "monthly_three", 
  "monthly_six", 
  "yearly"
];

export const LANGUAGES = [
  "en", 
  "es"
];

export const CURRENCIES = [
  {id: "USD", name: "United States Dollar", symbol: "$"}, 
  {id: "EUR", name: "Euro", symbol: "€"},
  {id: "JPY", name: "Japanese Yen", symbol: "¥"},
  {id: "GBP", name: "Pound sterling", symbol: "£"},
  {id: "AUD", name: "Australian Dollar", symbol: "A$"},
  {id: "CAD", name: "Canadian Dollar", symbol: "C$"}
];

export const SAVING_RATES = [
  {id: "CHL", rate: 20.8},
  {id: "NOR", rate: 14.7},
  {id: "IRL", rate: 13.2},
  {id: "MEX", rate: 5.3},
  {id: "ESP", rate: 4.9},
  {id: "JPN", rate: 4.6},
  {id: "USA", rate: 2.3},
  {id: "GBR", rate: 0.5},
];

export const CURRENCY_OPTIONS = {
  align: "left",
  allowNegative: false,
  allowZero: false,
  decimal: ",",
  precision: 0,
  prefix: "",
  suffix: " €",
  thousands: ".",
  nullable: true
};

export var DEMO_MOVEMENTS = [
  {
    text: "DEMO_1_TEXT",
    concept: "DEMO_1_CONCEPT",
    type: "balance",
    from: "today",
    repeat: null,
    product: "balance",
    decimals: false,
    essential: false,
    amount: 600
  },{
    text: "DEMO_2_TEXT",
    concept: "DEMO_2_CONCEPT",
    type: "income",
    from: "monthEndDay",
    repeat: "monthly",
    product: "salary",
    decimals: false,
    essential: false,
    amount: 1400
  },{
    text: "DEMO_3_TEXT",
    concept: "DEMO_3_CONCEPT",
    type: "outcome",
    from: "monthFirstDay",
    repeat: "monthly",
    product: "rent",
    decimals: false,
    essential: true,
    amount: 480
  },{
    text: "DEMO_4_TEXT",
    concept: "DEMO_4_CONCEPT",
    type: "outcome",
    from: "monthFirstDay",
    repeat: "monthly",
    product: "phone",
    decimals: false,
    essential: true,
    amount: 80
  },{
    text: "DEMO_5_TEXT",
    concept: "DEMO_5_CONCEPT",
    type: "outcome",
    from: "nextMonday",
    repeat: "weekly",
    product: "groceries",
    decimals: false,
    essential: true,
    amount: 60
  },{
    text: "DEMO_6_TEXT",
    concept: "DEMO_6_CONCEPT",
    type: "outcome",
    from: "nextFriday",
    repeat: "weekly",
    product: "restaurant",
    decimals: false,
    essential: false,
    amount: 15
  },{
    text: "DEMO_7_TEXT",
    concept: "DEMO_7_CONCEPT",
    type: "outcome",
    from: "nextMonday",
    repeat: "workdays",
    product: "coffee",
    decimals: true,
    essential: false,
    amount: 0.5
  }
];