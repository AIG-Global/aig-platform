// ============================================================
// AIG HELO — data layer.
//
// EMERGENCY_NUMBERS: a curated list of general/police/ambulance/fire
// numbers per country. This is NOT a claim of exhaustive worldwide
// coverage or of being independently verified against each country's
// current regulations — emergency numbers do occasionally change, and
// this list was built from general knowledge, not a live official
// registry. It covers a broad set of the world's most-populous and
// most-visited countries. For ANY country, including ones covered
// here, the app also links to a canonical, continuously-updated public
// reference (Wikipedia's "List of emergency telephone numbers") so a
// traveler can double-check rather than rely on a single source.
//
// EMBASSY_FINDERS: direct links to a "home" country's own official
// embassy/consular locator tool — not a static database of addresses
// (which would go stale and risks sending someone to a closed or moved
// location). For a home country not listed, the app builds a plain
// web-search link instead, which is honest and always works, rather
// than silently having no answer.
// ============================================================

const EMERGENCY_NUMBERS = [
  { code: "US", name: "United States", general: "911", notes: "911 reaches police, fire, and ambulance everywhere." },
  { code: "CA", name: "Canada", general: "911", notes: "911 reaches police, fire, and ambulance in most areas." },
  { code: "MX", name: "Mexico", general: "911" },
  { code: "GB", name: "United Kingdom", general: "999", secondary: "112", notes: "112 also works and reaches the same services." },
  { code: "IE", name: "Ireland", general: "112", secondary: "999" },
  { code: "FR", name: "France", general: "112", police: "17", ambulance: "15", fire: "18" },
  { code: "DE", name: "Germany", general: "112", police: "110" },
  { code: "ES", name: "Spain", general: "112" },
  { code: "IT", name: "Italy", general: "112", police: "113", ambulance: "118", fire: "115" },
  { code: "PT", name: "Portugal", general: "112" },
  { code: "NL", name: "Netherlands", general: "112" },
  { code: "BE", name: "Belgium", general: "112" },
  { code: "CH", name: "Switzerland", general: "112", police: "117", ambulance: "144", fire: "118" },
  { code: "AT", name: "Austria", general: "112", police: "133", ambulance: "144", fire: "122" },
  { code: "SE", name: "Sweden", general: "112" },
  { code: "NO", name: "Norway", general: "112", police: "112", ambulance: "113", fire: "110" },
  { code: "FI", name: "Finland", general: "112" },
  { code: "DK", name: "Denmark", general: "112" },
  { code: "PL", name: "Poland", general: "112" },
  { code: "GR", name: "Greece", general: "112", police: "100", ambulance: "166", fire: "199" },
  { code: "TR", name: "Turkey", general: "112", police: "155" },
  { code: "RU", name: "Russia", general: "112", police: "102", ambulance: "103", fire: "101" },
  { code: "UA", name: "Ukraine", general: "112", police: "102" },
  { code: "IN", name: "India", general: "112", police: "100", ambulance: "102/108", fire: "101" },
  { code: "CN", name: "China", police: "110", ambulance: "120", fire: "119" },
  { code: "JP", name: "Japan", police: "110", ambulance: "119", fire: "119", notes: "119 covers both fire and ambulance." },
  { code: "KR", name: "South Korea", police: "112", ambulance: "119", fire: "119" },
  { code: "TH", name: "Thailand", general: "191", touristPolice: "1155", ambulance: "1669" },
  { code: "VN", name: "Vietnam", police: "113", ambulance: "115", fire: "114" },
  { code: "PH", name: "Philippines", general: "911" },
  { code: "ID", name: "Indonesia", general: "112", police: "110", ambulance: "118", fire: "113" },
  { code: "MY", name: "Malaysia", general: "999", touristPolice: "999" },
  { code: "SG", name: "Singapore", police: "999", ambulance: "995", fire: "995" },
  { code: "AE", name: "United Arab Emirates", general: "999", ambulance: "998" },
  { code: "SA", name: "Saudi Arabia", police: "999", ambulance: "997", fire: "998" },
  { code: "IL", name: "Israel", police: "100", ambulance: "101", fire: "102" },
  { code: "EG", name: "Egypt", police: "122", ambulance: "123", touristPolice: "126" },
  { code: "ZA", name: "South Africa", general: "112", police: "10111", ambulance: "10177" },
  { code: "NG", name: "Nigeria", general: "112" },
  { code: "KE", name: "Kenya", general: "999", secondary: "112" },
  { code: "MA", name: "Morocco", police: "19", ambulance: "15" },
  { code: "AU", name: "Australia", general: "000" },
  { code: "NZ", name: "New Zealand", general: "111" },
  { code: "BR", name: "Brazil", police: "190", ambulance: "192", fire: "193" },
  { code: "AR", name: "Argentina", general: "911" },
  { code: "CL", name: "Chile", police: "133", ambulance: "131", fire: "132" },
  { code: "CO", name: "Colombia", general: "123" },
  { code: "PE", name: "Peru", police: "105", ambulance: "106" },
  { code: "CR", name: "Costa Rica", general: "911" },
  { code: "IS", name: "Iceland", general: "112" },
  { code: "CZ", name: "Czech Republic", general: "112", police: "158" },
  { code: "HU", name: "Hungary", general: "112", police: "107" },
  { code: "RO", name: "Romania", general: "112" },
  { code: "HR", name: "Croatia", general: "112" },
  { code: "BG", name: "Bulgaria", general: "112", ambulance: "150", fire: "160", police: "166" },
  { code: "SK", name: "Slovakia", general: "112", ambulance: "155", police: "158", fire: "150" },
  { code: "BY", name: "Belarus", police: "102", ambulance: "103", fire: "101", notes: "112 in Belarus reaches fire only, not police or ambulance \u2014 use the direct numbers." },
  { code: "MD", name: "Moldova", general: "112" },
  { code: "EE", name: "Estonia", general: "112" },
  { code: "LV", name: "Latvia", general: "112", police: "110" },
  { code: "LT", name: "Lithuania", general: "112" },
  { code: "BA", name: "Bosnia and Herzegovina", general: "112", police: "122", fire: "123", ambulance: "124" },
  { code: "ME", name: "Montenegro", general: "112", police: "122", fire: "123", ambulance: "124" },
  { code: "MK", name: "North Macedonia", general: "112", police: "192", fire: "193", ambulance: "194" },
  { code: "RS", name: "Serbia", general: "112", police: "192", fire: "193", ambulance: "194" },
  { code: "AL", name: "Albania", general: "112" },
  { code: "IR", name: "Iran", police: "110", ambulance: "115" },
  { code: "PK", name: "Pakistan", police: "15", ambulance: "1122" },
  { code: "BD", name: "Bangladesh", general: "999" },
  { code: "TW", name: "Taiwan", police: "110", ambulance: "119", fire: "119" },
  { code: "HK", name: "Hong Kong", general: "999" }
];

const EMBASSY_FINDERS = [
  { code: "US", name: "United States", url: "https://www.usembassy.gov/" },
  { code: "GB", name: "United Kingdom", url: "https://www.gov.uk/world/embassies" },
  { code: "CA", name: "Canada", url: "https://travel.gc.ca/assistance/embassies-consulates" },
  { code: "AU", name: "Australia", url: "https://www.smartraveller.gov.au/before-you-go/consular-services/embassies" },
  { code: "NZ", name: "New Zealand", url: "https://www.mfat.govt.nz/en/embassies/" },
  { code: "IE", name: "Ireland", url: "https://www.ireland.ie/en/missions-list/" },
  { code: "DE", name: "Germany", url: "https://www.auswaertiges-amt.de/en/aamt/auslandsvertretungen" },
  { code: "FR", name: "France", url: "https://www.diplomatie.gouv.fr/en/the-ministry-and-its-network/france-s-embassies-and-consulates/" },
  { code: "ES", name: "Spain", url: "https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Embajadas-y-Consulados.aspx" },
  { code: "IT", name: "Italy", url: "https://www.esteri.it/en/ministero/struttura/rete-diplomatica/" },
  { code: "NL", name: "Netherlands", url: "https://www.netherlandsworldwide.nl/countries" },
  { code: "SE", name: "Sweden", url: "https://www.swedenabroad.se/en/" },
  { code: "NO", name: "Norway", url: "https://www.norway.no/en/missions/" },
  { code: "FI", name: "Finland", url: "https://um.fi/finland-s-missions-abroad" },
  { code: "DK", name: "Denmark", url: "https://um.dk/en/danish-representations" },
  { code: "IN", name: "India", url: "https://www.mea.gov.in/indian-missions-abroad-new.htm" },
  { code: "CN", name: "China", url: "https://www.mfa.gov.cn/eng/wjbxw_new/embassies/" },
  { code: "JP", name: "Japan", url: "https://www.mofa.go.jp/about/emb_cons/mofaserv.html" },
  { code: "KR", name: "South Korea", url: "https://www.mofa.go.kr/eng/wpge/m_5476/contents.do" },
  { code: "PH", name: "Philippines", url: "https://dfa.gov.ph/list-of-philippine-embassies-and-consulates-general" },
  { code: "SG", name: "Singapore", url: "https://www.mfa.gov.sg/Overseas-Mission" },
  { code: "ZA", name: "South Africa", url: "https://dirco.gov.za/foreign-representation/" },
  { code: "BR", name: "Brazil", url: "https://www.gov.br/mre/en/embassies-and-consulates" },
  { code: "MX", name: "Mexico", url: "https://www.gob.mx/sre" }
];

const EMERGENCY_NUMBERS_REFERENCE_URL = "https://en.wikipedia.org/wiki/List_of_emergency_telephone_numbers";

function findEmergencyNumbers(countryCode) {
  return EMERGENCY_NUMBERS.find(e => e.code === countryCode) || null;
}

function findEmbassyFinder(homeCountryCode) {
  return EMBASSY_FINDERS.find(e => e.code === homeCountryCode) || null;
}

function buildEmbassySearchFallbackUrl(homeCountryName, currentCountryName) {
  const query = encodeURIComponent(homeCountryName + " embassy in " + currentCountryName);
  return "https://www.google.com/search?q=" + query;
}

window.AIGHelpData = {
  EMERGENCY_NUMBERS,
  EMBASSY_FINDERS,
  EMERGENCY_NUMBERS_REFERENCE_URL,
  findEmergencyNumbers,
  findEmbassyFinder,
  buildEmbassySearchFallbackUrl
};
