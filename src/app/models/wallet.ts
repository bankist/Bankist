export class Wallet {
  name: string;
  type: string;
  movements: any;
  plans: any;
  walletUuid: any;
  assistant: any
  constructor(data: {name: string, type: string, walletUuid: any, movements: any, plans: any, assistant: any}) {
    this.name = data.name;
    this.type = data.type;
    this.walletUuid = data.walletUuid;
    this.movements = data.movements;
    this.plans = data.plans;
    this.assistant = {};
  }
}