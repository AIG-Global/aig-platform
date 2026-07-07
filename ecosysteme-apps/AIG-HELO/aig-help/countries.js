// A broad country name/code list for the home-country and manual-override
// dropdowns. This is just names + ISO codes — stable, well-documented
// reference data, unlike addresses or phone numbers, so a wide list here
// carries much less risk of going stale or being wrong.
const ALL_COUNTRIES = [
  ["AF","Afghanistan"],["AL","Albania"],["DZ","Algeria"],["AR","Argentina"],["AM","Armenia"],
  ["AU","Australia"],["AT","Austria"],["AZ","Azerbaijan"],["BH","Bahrain"],["BD","Bangladesh"],
  ["BY","Belarus"],["BE","Belgium"],["BZ","Belize"],["BJ","Benin"],["BT","Bhutan"],
  ["BO","Bolivia"],["BA","Bosnia and Herzegovina"],["BW","Botswana"],["BR","Brazil"],["BN","Brunei"],
  ["BG","Bulgaria"],["BF","Burkina Faso"],["KH","Cambodia"],["CM","Cameroon"],["CA","Canada"],
  ["CL","Chile"],["CN","China"],["CO","Colombia"],["CR","Costa Rica"],["HR","Croatia"],
  ["CU","Cuba"],["CY","Cyprus"],["CZ","Czech Republic"],["DK","Denmark"],["DO","Dominican Republic"],
  ["EC","Ecuador"],["EG","Egypt"],["SV","El Salvador"],["EE","Estonia"],["ET","Ethiopia"],
  ["FJ","Fiji"],["FI","Finland"],["FR","France"],["GE","Georgia"],["DE","Germany"],
  ["GH","Ghana"],["GR","Greece"],["GT","Guatemala"],["HN","Honduras"],["HK","Hong Kong"],
  ["HU","Hungary"],["IS","Iceland"],["IN","India"],["ID","Indonesia"],["IR","Iran"],
  ["IQ","Iraq"],["IE","Ireland"],["IL","Israel"],["IT","Italy"],["JM","Jamaica"],
  ["JP","Japan"],["JO","Jordan"],["KZ","Kazakhstan"],["KE","Kenya"],["KW","Kuwait"],
  ["KG","Kyrgyzstan"],["LA","Laos"],["LV","Latvia"],["LB","Lebanon"],["LY","Libya"],
  ["LT","Lithuania"],["LU","Luxembourg"],["MO","Macau"],["MG","Madagascar"],["MY","Malaysia"],
  ["MV","Maldives"],["ML","Mali"],["MT","Malta"],["MX","Mexico"],["MD","Moldova"],
  ["MC","Monaco"],["MN","Mongolia"],["ME","Montenegro"],["MA","Morocco"],["MZ","Mozambique"],
  ["MM","Myanmar"],["NA","Namibia"],["NP","Nepal"],["NL","Netherlands"],["NZ","New Zealand"],
  ["NI","Nicaragua"],["NE","Niger"],["NG","Nigeria"],["MK","North Macedonia"],["NO","Norway"],["OM","Oman"],
  ["PK","Pakistan"],["PA","Panama"],["PG","Papua New Guinea"],["PY","Paraguay"],["PE","Peru"],
  ["PH","Philippines"],["PL","Poland"],["PT","Portugal"],["QA","Qatar"],["RO","Romania"],
  ["RU","Russia"],["RW","Rwanda"],["SA","Saudi Arabia"],["SN","Senegal"],["RS","Serbia"],
  ["SG","Singapore"],["SK","Slovakia"],["SI","Slovenia"],["ZA","South Africa"],["KR","South Korea"],
  ["ES","Spain"],["LK","Sri Lanka"],["SE","Sweden"],["CH","Switzerland"],["TW","Taiwan"],
  ["TJ","Tajikistan"],["TZ","Tanzania"],["TH","Thailand"],["TN","Tunisia"],["TR","Turkey"],
  ["TM","Turkmenistan"],["UG","Uganda"],["UA","Ukraine"],["AE","United Arab Emirates"],
  ["GB","United Kingdom"],["US","United States"],["UY","Uruguay"],["UZ","Uzbekistan"],
  ["VE","Venezuela"],["VN","Vietnam"],["YE","Yemen"],["ZM","Zambia"],["ZW","Zimbabwe"]
];

window.AIGHelpData = window.AIGHelpData || {};
window.AIGHelpData.ALL_COUNTRIES = ALL_COUNTRIES;
