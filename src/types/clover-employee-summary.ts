export type EmployeeSummariesResponse = {
  total: {
    net: number;
    tipAmount: number;
    averageNetSales: number;
  };
  employeeSummaries: {
    elements: CloverEmployeeSummary[];
  };
}

export type CloverEmployeeSummary = {
  id: string;
  employee: {
    id: string;
    name: string;
    nickname?: string;
    role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  }
  summary: {
    voids: number;
    numVoids: number;
    grossSales: number;
    refundAmount: number;
    refundAmountTotal: number;
    paymentAmount: number;
    numRefunds: number;
    refundRepaymentAmount: number;
    numDiscounts: number;
    discountAmount: number;
    net: number;
    nonRevenueItems: number;
    giftCardLoads: number;
    tenderStats: {
      elements: {
        type: 'cash' | 'card' | 'other'
        amountCollected: number;
        numPayments: number;
        numRefunds: number;
      }
    };
    tipAmount: number;
    taxAmount: number;
    taxAmountCollected: number;
    additionalChargeAmount: number;
    amountCollected: number;
    averageNetSales: number;
    exchangeAmount: number;
    numExchanges: number;
    numTransactions: number;
    numPayments: number;
  }
}
