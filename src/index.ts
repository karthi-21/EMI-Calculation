interface IEMIListItem {
  principle?: number;
  interest?: number;
  emi: number;
  balance: number;
}

interface IEMI {
  totalPayable?: number;
  interest?: number;
  emi?: number;
  rbir?: IEMIListItem[];
  fir?: IEMIListItem[];
  error?: string;
}

export class EMICalculation {
  private today = new Date();

  /**
   * To Calculate EMI amount, Interest amount, Total payable amount
   * Reducing balance interest rate LIST / Fixed interest rate LIST
   * Use calculate method to get results as return object.
   * Use monthDiff method to get difference between two objects.
   */
  // tslint:disable-next-line:no-empty
  constructor() {}

  /**
   * This method returns difference between two dates provided
   * *Note inputs should be in date formate.
   *
   * @param d1 First date
   * @param d2 Second date
   * @returns Difference between two dates as integer.
   */
  public monthDiff(d1: Date, d2: Date) {
    const d1m = d1.getMonth() + 1;
    let months = 0;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1m;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  /**
   * To Calculate EMI amount, Interest amount, Total payable amount and RBIR List
   *
   * @param amount Loan Amount(Bought from bank/issuer).
   * @param interest Interest rate in percentage(As mentioned by issuer).
   * @param tenure Number of installments or total number of tenure.
   * @param type Type of interest rate (POSSIBLE VALUES: 'rbir', 'fir')
   * @returns EMI Object which contains { emi, totalPayable, interest, rbir, fir, error }
   */
  public calculate(amount: number, interest: number, tenure: number, type: string): IEMI {
    const returnItem: IEMI = {};
    try {
      if (amount && interest && tenure && type) {
        if (type.toLowerCase() === 'rbir') {
          const p = amount;
          const r = interest / 12 / 100;
          const n = tenure;
          const emi = (p * r * (1 + r) ** n) / ((1 + r) ** n - 1);
          let balance = p;
          const rbir = [];
          for (let i = 0; i < tenure; i++) {
            const intsrt = (balance * (interest / 100)) / 12;
            const temp: IEMIListItem = {
              balance: Math.round(balance - (emi - intsrt)),
              emi: Math.round(emi),
              interest: Math.round(intsrt),
              principle: Math.round(emi - intsrt),
            };
            rbir.push(temp);
            balance = Math.round(balance - (emi - intsrt));
          }
          returnItem.totalPayable = emi * tenure;
          returnItem.interest = returnItem.totalPayable - amount;
          returnItem.emi = emi;
          returnItem.rbir = rbir;
        } else {
          returnItem.interest = (amount / 100) * interest;
          returnItem.totalPayable = amount + returnItem.interest;
          returnItem.emi = returnItem.totalPayable / tenure;
          const p = amount;
          const fir = [];
          let balance = p;
          const intrst = returnItem.interest / tenure;
          for (let i = 0; i < tenure; i++) {
            const temp: IEMIListItem = {
              balance: Math.round(balance - (returnItem.emi - intrst)),
              emi: Math.round(returnItem.emi),
            };
            fir.push(temp);
            balance = Math.round(balance - (returnItem.emi - intrst));
          }
          returnItem.fir = fir;
        }
      } else {
        returnItem.error = 'Values cannot be null or undefined!';
      }
    } catch (error) {
      returnItem.error = error;
    }
    return returnItem;
  }
}
