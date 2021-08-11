import {
  DonationAmount,
  DonationFrequency,
  EnForm,
  ProcessingFees,
} from "./events";
import {
  ProgressBar,
  UpsellLightbox,
  ENGrid,
  Options,
  OptionsDefaults,
  setRecurrFreq,
  PageBackground,
  MediaAttribution,
  ApplePay,
  CapitalizeFields,
  ClickToExpand,
  legacy,
  IE,
  LiveVariables,
  sendIframeHeight,
  sendIframeFormStatus,
  ShowHideRadioCheckboxes,
  SimpleCountrySelect,
  SkipToMainContentLink,
  SrcDefer,
  NeverBounce,
} from "./";

export class App extends ENGrid {
  // Events
  private _form: EnForm = EnForm.getInstance();
  private _fees: ProcessingFees = ProcessingFees.getInstance();
  private _amount: DonationAmount = DonationAmount.getInstance(
    "transaction.donationAmt",
    "transaction.donationAmt.other"
  );
  private _frequency: DonationFrequency = DonationFrequency.getInstance();

  private options: Options;

  constructor(options: Options) {
    super();
    this.options = { ...OptionsDefaults, ...options };
    // Add Options to window
    window.EngridOptions = this.options;
    // Document Load
    if (document.readyState !== "loading") {
      this.run();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        this.run();
      });
    }
    // Window Load
    window.onload = () => {
      this.onLoad();
    };
    // Window Resize
    window.onresize = () => {
      this.onResize();
    };
  }

  private run() {
    // Enable debug if available is the first thing
    if (this.options.Debug || App.getUrlParameter("debug") == "true")
      App.setBodyData("debug", "");

    // IE Warning
    new IE();

    // Page Background
    new PageBackground();

    // TODO: Abstract everything to the App class so we can remove custom-methods
    legacy.inputPlaceholder();
    legacy.preventAutocomplete();
    legacy.watchInmemField();
    legacy.watchGiveBySelectField();
    legacy.SetEnFieldOtherAmountRadioStepValue();
    legacy.simpleUnsubscribe();

    legacy.contactDetailLabels();
    legacy.easyEdit();
    legacy.enInput.init();

    new ShowHideRadioCheckboxes("transaction.giveBySelect", "giveBySelect-");
    new ShowHideRadioCheckboxes("transaction.inmem", "inmem-");
    new ShowHideRadioCheckboxes("transaction.recurrpay", "recurrpay-");

    // Controls if the Theme has a the "Debug Bar"
    // legacy.debugBar();

    // Client onSubmit and onError functions
    this._form.onSubmit.subscribe(() => this.onSubmit());
    this._form.onError.subscribe(() => this.onError());
    this._form.onValidate.subscribe(() => this.onValidate());

    // Event Listener Examples
    this._amount.onAmountChange.subscribe((s) =>
      console.log(`Live Amount: ${s}`)
    );
    this._frequency.onFrequencyChange.subscribe((s) =>
      console.log(`Live Frequency: ${s}`)
    );
    this._form.onSubmit.subscribe((s) => console.log("Submit: ", s));
    this._form.onError.subscribe((s) => console.log("Error:", s));

    window.enOnSubmit = () => {
      this._form.dispatchSubmit();
      return this._form.submit;
    };
    window.enOnError = () => {
      this._form.dispatchError();
    };
    window.enOnValidate = () => {
      this._form.dispatchValidate();
      return this._form.validate;
    };

    // iFrame Logic
    this.loadIFrame();

    // Live Variables
    new LiveVariables(this.options);

    // Dynamically set Recurrency Frequency
    new setRecurrFreq();

    // Upsell Lightbox
    new UpsellLightbox();

    // On the end of the script, after all subscribers defined, let's load the current value
    this._amount.load();
    this._frequency.load();

    // Simple Country Select
    new SimpleCountrySelect();
    // Add Image Attribution
    if (this.options.MediaAttribution) new MediaAttribution();
    // Apple Pay
    if (this.options.applePay) new ApplePay();
    // Capitalize Fields
    if (this.options.CapitalizeFields) new CapitalizeFields();
    // Click To Expand
    if (this.options.ClickToExpand) new ClickToExpand();
    if (this.options.SkipToMainContentLink) new SkipToMainContentLink();
    if (this.options.SrcDefer) new SrcDefer();
    // Progress Bar
    if (this.options.ProgressBar) new ProgressBar();

    if (this.options.NeverBounceAPI)
      new NeverBounce(
        this.options.NeverBounceAPI,
        this.options.NeverBounceDateField,
        this.options.NeverBounceStatusField
      );

    this.setDataAttributes();
  }

  private onLoad() {
    if (this.options.onLoad) {
      this.options.onLoad();
    }
    if (this.inIframe()) {
      // Scroll to top of iFrame
      if (App.debug) console.log("iFrame Event - window.onload");
      sendIframeHeight();
      window.parent.postMessage(
        {
          scroll: this.shouldScroll(),
        },
        "*"
      );

      // On click fire the resize event
      document.addEventListener("click", (e: Event) => {
        if (App.debug) console.log("iFrame Event - click");
        setTimeout(() => {
          sendIframeHeight();
        }, 100);
      });
    }
  }

  private onResize() {
    if (this.options.onResize) {
      this.options.onResize();
    }
    if (this.inIframe()) {
      if (App.debug) console.log("iFrame Event - window.onload");
      sendIframeHeight();
    }
  }

  private onValidate() {
    if (this.options.onValidate) {
      if (App.debug) console.log("Client onValidate Triggered");
      this.options.onValidate();
    }
  }

  private onSubmit() {
    if (this.options.onSubmit) {
      if (App.debug) console.log("Client onSubmit Triggered");
      this.options.onSubmit();
    }
    if (this.inIframe()) {
      sendIframeFormStatus("submit");
    }
  }

  private onError() {
    if (this.options.onError) {
      if (App.debug) console.log("Client onError Triggered");
      this.options.onError();
    }
  }

  private inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
  private shouldScroll = () => {
    // If you find a error, scroll
    if (document.querySelector(".en__errorHeader")) {
      return true;
    }
    // Try to match the iframe referrer URL by testing valid EN Page URLs
    let referrer = document.referrer;
    let enURLPattern = new RegExp(/^(.*)\/(page)\/(\d+.*)/);

    // Scroll if the Regex matches, don't scroll otherwise
    return enURLPattern.test(referrer);
  };
  private loadIFrame() {
    if (this.inIframe()) {
      // Add the data-engrid-embedded attribute when inside an iFrame if it wasn't already added by a script in the Page Template
      App.setBodyData("embedded", "");
      // Fire the resize event
      if (App.debug) console.log("iFrame Event - First Resize");
      sendIframeHeight();
    }
  }
  // Use this function to add any Data Attributes to the Body tag
  setDataAttributes() {
    // Add a body banner data attribute if the banner contains no image
    // @TODO Should this account for video?
    // @TODO Should we merge this with the script that checks the background image?
    if (!document.querySelector(".body-banner img")) {
        App.setBodyData("body-banner", "empty");
    }

    // Add a page-alert data attribute if it is empty
    if (document.querySelector(".page-alert *")) {
        App.setBodyData("has-page-alert", "");
    } else {
        App.setBodyData("does-not-have-page-alert", "");
    }       

    // Add a content-header data attribute if it is empty
    if (document.querySelector(".content-header *")) {
        App.setBodyData("has-content-header", "");
    } else {
        App.setBodyData("does-not-have-content-header", "");
    }         

    // Add a body-headerOutside data attribute if it is empty
    if (document.querySelector(".body-headerOutside *")) {
        App.setBodyData("has-body-headerOutside", "");
    } else {
        App.setBodyData("does-not-have-body-headerOutside", "");
    }         

    // Add a body-header data attribute if it is empty
    if (document.querySelector(".body-header *")) {
        App.setBodyData("has-body-header", "");
    } else {
        App.setBodyData("does-not-have-body-header", "");
    }         

    // Add a body-title data attribute if it is empty
    if (document.querySelector(".body-title *")) {
        App.setBodyData("has-body-title", "");
    } else {
        App.setBodyData("does-not-have-body-title", "");
    }         

    // Add a body-banner data attribute if it is empty
    if (document.querySelector(".body-banner *")) {
        App.setBodyData("has-body-banner", "");
    } else {
        App.setBodyData("does-not-have-body-banner", "");
    }     

    // Add a body-bannerOverlay data attribute if it is empty
    if (document.querySelector(".body-bannerOverlay *")) {
        App.setBodyData("has-body-bannerOverlay", "");
    } else {
        App.setBodyData("does-not-have-body-bannerOverlay", "");
    }         

    // Add a body-top data attribute if it is empty
    if (document.querySelector(".body-top *")) {
        App.setBodyData("has-body-top", "");
    } else {
        App.setBodyData("does-not-have-body-top", "");
    }         

    // Add a body-main data attribute if it is empty
    if (document.querySelector(".body-main *")) {
        App.setBodyData("has-body-main", "");
    } else {
        App.setBodyData("does-not-have-body-main", "");
    }         

    // Add a body-bottom data attribute if it is empty
    if (document.querySelector(".body-bottom *")) {
        App.setBodyData("has-body-bottom", "");
    } else {
        App.setBodyData("does-not-have-body-bottom", "");
    }         

    // Add a body-footer data attribute if it is empty
    if (document.querySelector(".body-footer *")) {
        App.setBodyData("has-body-footer", "");
    } else {
        App.setBodyData("does-not-have-body-footer", "");
    }         

    // Add a body-footerOutside data attribute if it is empty
    if (document.querySelector(".body-footerOutside *")) {
        App.setBodyData("has-body-footerOutside", "");
    } else {
        App.setBodyData("does-not-have-body-footerOutside", "");
    }       

    // Add a content-footerSpacer data attribute if it is empty
    if (document.querySelector(".content-footerSpacer *")) {
        App.setBodyData("has-content-footerSpacer", "");
    } else {
        App.setBodyData("does-not-have-content-footerSpacer", "");
    }      

    // Add a content-preFooter data attribute if it is empty
    if (document.querySelector(".content-preFooter *")) {
        App.setBodyData("has-content-preFooter", "");
    } else {
        App.setBodyData("does-not-have-content-preFooter", "");
    }     
    
    // Add a content-footer data attribute if it is empty
    if (document.querySelector(".content-footer *")) {
        App.setBodyData("has-content-footer", "");
    } else {
        App.setBodyData("does-not-have-content-footer", "");
    }     

    // Add a page-backgroundImage data attribute if it is empty
    if (document.querySelector(".page-backgroundImage *")) {
        App.setBodyData("has-page-backgroundImage", "");
    } else {
        App.setBodyData("does-not-have-page-backgroundImage", "");
    }     

    // Add a page-backgroundImageOverlay data attribute if it is empty
    if (document.querySelector(".page-backgroundImageOverlay *")) {
        App.setBodyData("has-page-backgroundImageOverlay", "");
    } else {
        App.setBodyData("does-not-have-page-backgroundImageOverlay", "");
    }     

    // Add a page-customCode data attribute if it is empty
    if (document.querySelector(".page-customCode *")) {
        App.setBodyData("has-page-customCode", "");
    } else {
        App.setBodyData("does-not-have-page-customCode", "");
    }     
  }
}
