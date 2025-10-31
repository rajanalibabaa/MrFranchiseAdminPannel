export const INITIAL_FILTERS = {
  search: '',
  state: '',
  city: '',
  district: '',
  investmentRange: '',
  planToInvest: '',
  readyToInvest: '',
  applyBy: '',
  mainCategory: '',
  subCategory: '',
  childCategory: ''
};

export const DEBOUNCE_DELAY = 300;

export const TABLE_HEADERS = [
  { label: '', width: 60 },
  { label: 'Investor Details', minWidth: 250 },
  { label: 'Location', minWidth: 200 },
  { label: 'Category Interest', minWidth: 220 },
  { label: 'Investment', minWidth: 180 },
  { label: 'Brands', minWidth: 120 },
  { label: 'Created', minWidth: 140 },
  { label: 'Actions', width: 80 }
];
