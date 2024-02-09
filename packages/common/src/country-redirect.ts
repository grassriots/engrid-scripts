// This component allows you to redirect the user to a different page based on their country.
// It works by checking the country field on the page and comparing it to the list of countries in the CountryRedirect option.
// If the country matches one of the countries in the list, the user is redirected to the specified URL only if the URL is not the same as the current page.
// The CountryRedirect option is an object with the country as the key and the URL as the value.
// Example:
//
// CountryRedirect: {
//   US: "https://example.com/us",
//   CA: "https://example.com/ca",
//   GB: "https://example.com/gb",
// },
// The country codes must match the country codes in the country field
// The CountryRedirect component can also be set at the page level. Useful for Regional Pages, with a Code Block like this:
//
// <script>
//   window.EngridPageOptions = window.EngridPageOptions || [];
//   window.EngridPageOptions.CountryRedirect = {
//     US: "https://example.com/us",
//     CA: "https://example.com/ca",
//     GB: "https://example.com/gb",
//   };
// </script>
//
// This will override the default CountryRedirect options for that page.
//

import { ENGrid, Country, EngridLogger } from ".";

export class CountryRedirect {
  private logger: EngridLogger = new EngridLogger(
    "CountryRedirect",
    "white",
    "brown",
    "🛫"
  );
  private _country = Country.getInstance();
  constructor() {
    if (!this.shouldRun()) return;
    if (this._country.countryField) {
      this._country.onCountryChange.subscribe((country) => {
        this.checkRedirect(country);
      });
    }
    this.checkRedirect(this._country.country);
  }

  shouldRun() {
    // Only run if the CountryRedirect option is not false
    if (!ENGrid.getOption("CountryRedirect")) {
      return false;
    }
    return true;
  }
  checkRedirect(country: string) {
    const countryRedirect = ENGrid.getOption("CountryRedirect");
    // Check if the country is in the list and if the current URL is not the same as the redirect URL
    // We are using includes because the URL might have query parameters
    if (
      countryRedirect &&
      country in countryRedirect &&
      window.location.href.includes(countryRedirect[country]) === false
    ) {
      this.logger.log(`${country}: Redirecting to ${countryRedirect[country]}`);
      window.location.href = countryRedirect[country];
    }
  }
}
