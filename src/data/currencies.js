// Multi-Currency Engine (Supports 40+ Currencies & 100+ Countries/Cities)

export const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee', rate: 83.5, code: 'INR' },
  USD: { symbol: '$', name: 'US Dollar', rate: 1.0, code: 'USD' },
  EUR: { symbol: '€', name: 'Euro', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', name: 'British Pound', rate: 0.78, code: 'GBP' },
  JPY: { symbol: '¥', name: 'Japanese Yen', rate: 155.0, code: 'JPY' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', rate: 1.52, code: 'AUD' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', rate: 1.36, code: 'CAD' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', rate: 1.35, code: 'SGD' },
  AED: { symbol: 'AED ', name: 'UAE Dirham', rate: 3.67, code: 'AED' },
  THB: { symbol: '฿', name: 'Thai Baht', rate: 36.5, code: 'THB' },
  CHF: { symbol: 'CHF ', name: 'Swiss Franc', rate: 0.90, code: 'CHF' },
  MXN: { symbol: 'MEX$', name: 'Mexican Peso', rate: 17.5, code: 'MXN' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', rate: 5.2, code: 'BRL' },
  ZAR: { symbol: 'R ', name: 'South African Rand', rate: 18.5, code: 'ZAR' },
  KRW: { symbol: '₩', name: 'South Korean Won', rate: 1380.0, code: 'KRW' },
  MYR: { symbol: 'RM ', name: 'Malaysian Ringgit', rate: 4.7, code: 'MYR' },
  IDR: { symbol: 'Rp ', name: 'Indonesian Rupiah', rate: 16200.0, code: 'IDR' },
  PHP: { symbol: '₱', name: 'Philippine Peso', rate: 58.0, code: 'PHP' },
  VND: { symbol: '₫', name: 'Vietnamese Dong', rate: 25400.0, code: 'VND' },
  TRY: { symbol: '₺', name: 'Turkish Lira', rate: 32.5, code: 'TRY' },
  EGP: { symbol: 'E£ ', name: 'Egyptian Pound', rate: 47.5, code: 'EGP' },
  SAR: { symbol: 'SAR ', name: 'Saudi Riyal', rate: 3.75, code: 'SAR' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.65, code: 'NZD' },
  SEK: { symbol: 'kr ', name: 'Swedish Krona', rate: 10.5, code: 'SEK' },
  NOK: { symbol: 'kr ', name: 'Norwegian Krone', rate: 10.8, code: 'NOK' },
  DKK: { symbol: 'kr ', name: 'Danish Krone', rate: 6.9, code: 'DKK' },
  PLN: { symbol: 'zł ', name: 'Polish Zloty', rate: 4.0, code: 'PLN' },
  CZK: { symbol: 'Kč ', name: 'Czech Koruna', rate: 23.0, code: 'CZK' },
  HUF: { symbol: 'Ft ', name: 'Hungarian Forint', rate: 360.0, code: 'HUF' },
  TWD: { symbol: 'NT$', name: 'Taiwan Dollar', rate: 32.2, code: 'TWD' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', rate: 7.8, code: 'HKD' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', rate: 7.23, code: 'CNY' },
  RUB: { symbol: '₽', name: 'Russian Ruble', rate: 91.0, code: 'RUB' },
  COP: { symbol: 'COL$', name: 'Colombian Peso', rate: 3900.0, code: 'COP' },
  ARS: { symbol: 'ARS$', name: 'Argentine Peso', rate: 890.0, code: 'ARS' },
  CLP: { symbol: 'CLP$', name: 'Chilean Peso', rate: 930.0, code: 'CLP' },
  QAR: { symbol: 'QAR ', name: 'Qatari Riyal', rate: 3.64, code: 'QAR' },
  KWD: { symbol: 'KD ', name: 'Kuwaiti Dinar', rate: 0.31, code: 'KWD' },
  LKR: { symbol: 'LKR ', name: 'Sri Lankan Rupee', rate: 300.0, code: 'LKR' },
  NPR: { symbol: 'NPR ', name: 'Nepalese Rupee', rate: 133.5, code: 'NPR' }
};

export function inferCurrencyForDestination(text = '') {
  const lower = text.toLowerCase();
  
  if (
    lower.includes('tamil nadu') || lower.includes('chennai') || lower.includes('madurai') || lower.includes('tirupati') ||
    lower.includes('thirupathi') || lower.includes('tirumala') || lower.includes('kerala') || lower.includes('kochi') ||
    lower.includes('munnar') || lower.includes('alleppey') || lower.includes('goa') || lower.includes('mumbai') ||
    lower.includes('delhi') || lower.includes('bangalore') || lower.includes('bengaluru') || lower.includes('hyderabad') ||
    lower.includes('jaipur') || lower.includes('kashmir') || lower.includes('srinagar') || lower.includes('gulmarg') ||
    lower.includes('india') || lower.includes('agra') || lower.includes('varanasi') || lower.includes('shimla') ||
    lower.includes('manali') || lower.includes('rishikesh') || lower.includes('pune') || lower.includes('kolkata') ||
    lower.includes('punjab') || lower.includes('amritsar') || lower.includes('gujarat') || lower.includes('ahmedabad') ||
    lower.includes('ladakh') || lower.includes('leh') || lower.includes('udai') || lower.includes('jodhpur')
  ) {
    return 'INR';
  }

  if (lower.includes('japan') || lower.includes('tokyo') || lower.includes('kyoto') || lower.includes('osaka') || lower.includes('hiroshima') || lower.includes('fukuoka') || lower.includes('sapporo') || lower.includes('fuji')) {
    return 'JPY';
  }

  if (
    lower.includes('france') || lower.includes('paris') || lower.includes('nice') || lower.includes('lyon') ||
    lower.includes('italy') || lower.includes('rome') || lower.includes('florence') || lower.includes('venice') || lower.includes('milan') ||
    lower.includes('spain') || lower.includes('madrid') || lower.includes('barcelona') || lower.includes('seville') ||
    lower.includes('germany') || lower.includes('berlin') || lower.includes('munich') || lower.includes('frankfurt') ||
    lower.includes('netherlands') || lower.includes('amsterdam') || lower.includes('greece') || lower.includes('athens') || lower.includes('santorini') ||
    lower.includes('portugal') || lower.includes('lisbon') || lower.includes('porto') || lower.includes('austria') || lower.includes('vienna') ||
    lower.includes('belgium') || lower.includes('brussels') || lower.includes('finland') || lower.includes('helsinki') || lower.includes('ireland') || lower.includes('dublin')
  ) {
    return 'EUR';
  }

  if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('london') || lower.includes('manchester') || lower.includes('edinburgh') || lower.includes('scotland') || lower.includes('england') || lower.includes('wales') || lower.includes('oxford')) {
    return 'GBP';
  }

  if (lower.includes('thailand') || lower.includes('bangkok') || lower.includes('phuket') || lower.includes('chiang mai') || lower.includes('pattaya') || lower.includes('samui')) {
    return 'THB';
  }

  if (lower.includes('switzerland') || lower.includes('swiss') || lower.includes('zurich') || lower.includes('geneva') || lower.includes('interlaken') || lower.includes('lucerne') || lower.includes('zermatt')) {
    return 'CHF';
  }

  if (lower.includes('dubai') || lower.includes('uae') || lower.includes('abu dhabi') || lower.includes('sharjah') || lower.includes('emirates')) {
    return 'AED';
  }

  if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne') || lower.includes('brisbane') || lower.includes('perth') || lower.includes('gold coast') || lower.includes('cairns')) {
    return 'AUD';
  }

  if (lower.includes('canada') || lower.includes('toronto') || lower.includes('vancouver') || lower.includes('montreal') || lower.includes('banff') || lower.includes('calgary') || lower.includes('niagara')) {
    return 'CAD';
  }

  if (lower.includes('singapore') || lower.includes('sentosa') || lower.includes('changi') || lower.includes('marina bay')) {
    return 'SGD';
  }

  if (lower.includes('mexico') || lower.includes('cancun') || lower.includes('tulum') || lower.includes('cabo')) return 'MXN';
  if (lower.includes('brazil') || lower.includes('rio') || lower.includes('sao paulo') || lower.includes('amazon')) return 'BRL';
  if (lower.includes('south africa') || lower.includes('cape town') || lower.includes('johannesburg') || lower.includes('kruger')) return 'ZAR';
  if (lower.includes('korea') || lower.includes('seoul') || lower.includes('busan') || lower.includes('jeju')) return 'KRW';
  if (lower.includes('malaysia') || lower.includes('kuala lumpur') || lower.includes('penang') || lower.includes('langkawi')) return 'MYR';
  if (lower.includes('indonesia') || lower.includes('bali') || lower.includes('jakarta') || lower.includes('ubud') || lower.includes('lombok')) return 'IDR';
  if (lower.includes('philippines') || lower.includes('manila') || lower.includes('boracay') || lower.includes('el nido') || lower.includes('cebu')) return 'PHP';
  if (lower.includes('vietnam') || lower.includes('hanoi') || lower.includes('da nang') || lower.includes('saigon') || lower.includes('ho chi minh') || lower.includes('phu quoc')) return 'VND';
  if (lower.includes('turkey') || lower.includes('istanbul') || lower.includes('cappadocia') || lower.includes('antalya')) return 'TRY';
  if (lower.includes('egypt') || lower.includes('cairo') || lower.includes('giza') || lower.includes('luxor') || lower.includes('nile')) return 'EGP';
  if (lower.includes('saudi') || lower.includes('riyadh') || lower.includes('jeddah') || lower.includes('mecca') || lower.includes('medina')) return 'SAR';
  if (lower.includes('new zealand') || lower.includes('auckland') || lower.includes('queenstown') || lower.includes('christchurch')) return 'NZD';
  if (lower.includes('sweden') || lower.includes('stockholm')) return 'SEK';
  if (lower.includes('norway') || lower.includes('oslo') || lower.includes('bergen')) return 'NOK';
  if (lower.includes('denmark') || lower.includes('copenhagen')) return 'DKK';
  if (lower.includes('poland') || lower.includes('warsaw') || lower.includes('krakow')) return 'PLN';
  if (lower.includes('czech') || lower.includes('prague')) return 'CZK';
  if (lower.includes('hungary') || lower.includes('budapest')) return 'HUF';
  if (lower.includes('taiwan') || lower.includes('taipei')) return 'TWD';
  if (lower.includes('hong kong')) return 'HKD';
  if (lower.includes('china') || lower.includes('beijing') || lower.includes('shanghai') || lower.includes('shenzhen')) return 'CNY';
  if (lower.includes('russia') || lower.includes('moscow') || lower.includes('petersburg')) return 'RUB';
  if (lower.includes('sri lanka') || lower.includes('colombo') || lower.includes('kandy')) return 'LKR';
  if (lower.includes('nepal') || lower.includes('kathmandu') || lower.includes('pokhara')) return 'NPR';

  return 'USD';
}
