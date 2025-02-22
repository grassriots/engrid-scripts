import { ENGrid, EngridLogger } from "./";

export class GiveBySelect {
  private logger: EngridLogger = new EngridLogger(
    "GiveBySelect",
    "#FFF",
    "#333",
    "🐇"
  );
  private transactionGiveBySelect = document.getElementsByName(
    "transaction.giveBySelect"
  ) as NodeListOf<HTMLInputElement>;

  constructor() {
    if (!this.transactionGiveBySelect) return;
    this.transactionGiveBySelect.forEach((giveBySelect) => {
      giveBySelect.addEventListener("change", () => {
        this.logger.log("Changed to " + giveBySelect.value);
        if (giveBySelect.value.toLowerCase() === "card") {
          ENGrid.setPaymentType("");
        } else {
          ENGrid.setPaymentType(giveBySelect.value);
        }
      });
    });
    // Set the initial value of giveBySelect to the transaction.paymenttype field
    const paymentType = ENGrid.getPaymentType();
    if (paymentType) {
      this.logger.log("Setting giveBySelect to " + paymentType);
      const isCard = [
        "visa",
        "mastercard",
        "amex",
        "discover",
        "diners",
        "jcb",
        "vi",
        "mc",
        "ax",
        "dc",
        "di",
        "jc",
      ].includes(paymentType.toLowerCase());
      this.transactionGiveBySelect.forEach((giveBySelect) => {
        if (isCard && giveBySelect.value.toLowerCase() === "card") {
          giveBySelect.checked = true;
        } else if (
          giveBySelect.value.toLowerCase() === paymentType.toLowerCase()
        ) {
          giveBySelect.checked = true;
        }
      });
    }
  }
}
