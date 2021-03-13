import { SimpleEventDispatcher } from "strongly-typed-events";
import { ENGrid } from "../engrid";

export class DonationFrequency extends ENGrid {
  private _onFrequencyChange = new SimpleEventDispatcher<string>();
  private _frequency: string = "onetime";
  private _recurring: string = "n";
  private static instance: DonationFrequency;

  private constructor() {
    super();
    // Watch the Radios for Changes
    document.addEventListener("change", (e: Event) => {
      const element = e.target as HTMLInputElement;
      if (element && element.name == "transaction.recurrpay") {
        this.recurring = element.value;
        // When this element is a radio, that means you're between onetime and monthly only
        if (element.type == 'radio') {
          this.frequency = element.value.toLowerCase() == 'n' ? 'onetime' : 'monthly';
          // This field is hidden when transaction.recurrpay is radio
          DonationFrequency.setFieldValue('transaction.recurrfreq', this.frequency.toUpperCase());
        }
      }
      if (element && element.name == "transaction.recurrfreq") {
        this.frequency = element.value;
      }
    });
  }

  public static getInstance(): DonationFrequency {
    if (!DonationFrequency.instance) {
      DonationFrequency.instance = new DonationFrequency();
    }

    return DonationFrequency.instance;
  }

  get frequency(): string {
    return this._frequency;
  }

  // Every time we set a frequency, trigger the onFrequencyChange event
  set frequency(value: string) {
    this._frequency = value.toLowerCase() || 'onetime';
    this._onFrequencyChange.dispatch(this._frequency);
    DonationFrequency.setBodyData('transaction-recurring-frequency', this._frequency);
  }

  get recurring(): string {
    return this._recurring;
  }

  set recurring(value: string) {
    this._recurring = value.toLowerCase() || 'n';
    DonationFrequency.setBodyData('transaction-recurring', this._recurring);
  }

  public get onFrequencyChange() {
    return this._onFrequencyChange.asEvent();
  }

  // Set amount var with currently selected amount
  public load() {
    this.frequency = DonationFrequency.getFieldValue('transaction.recurrfreq');
    this.recurring = DonationFrequency.getFieldValue('transaction.recurrpay');
    // ENGrid.enParseDependencies();
  }
}
