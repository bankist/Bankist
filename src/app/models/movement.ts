export class Movement {
  movementUuid: string;
  concept: string;
  // [balance, income, outcome]
  type: string;
  // [daily, workdays, weekly, monthly, monthly_two, monthly_three, monthly_six, yearly]
  repeat: string;
  product: string;
  from: string;
  to: string;
  amount: number; 
  decimals?: any;
  options?: any;
  essential?: boolean;
  events?: Array<Movement>
}