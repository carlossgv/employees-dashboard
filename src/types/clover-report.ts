type CloverReportResponse = {
  href: string;
  revenueItems: CloverRevenueItems;
  nonRevenueItems: CloverNonRevenueItems;
  majorLabelsExist: boolean;
};

type CloverRevenueItems = {
  items: {
    elements: CloverRevenueItem[];
  };
  total: CloverRevenueItemSummary;
  itemsHaveMultipleCategories: boolean;
};

type CloverNonRevenueItems = {
  items: {
    elements: any[]; // TODO: Replace with specific structure if available
  };
  total: CloverRevenueItemSummary;
  itemsHaveMultipleCategories: boolean;
};

type CloverRevenueItem = {
  id: string;
  name: string;
  numberSold: number;
  numRefunds: number;
  refundAmount: number;
  refundAmountRegardlessOfRepayment: number;
  refundAmountRegardlessOfRepaymentFractionalCents: number;
  refundRepaymentAmount: number;
  refundRepaymentAmountFractionalCents: number;
  numExchanges: number;
  exchangeAmount: number;
  inACategory: boolean;
  inventoryItem: CloverInventoryItem;
  labels: {
    elements: CloverLabel[];
  };
  modifierSales: {
    elements: CloverModifierSale[];
  };
  grossModifierSales: number;
  totalDiscounts: number;
  totalDiscountsFractionalCents: number;
  netNumberSold: number;
  grossItemSales: number;
  grossSales: number;
  netItemSales: number;
  netItemSalesFractionalCents: number;
  netModifierSales: number;
  netModifierSalesFractionalCents: number;
  netSales: number;
  netSalesFractionalCents: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossProfitMargin: number;
  averageNetSales: number;
  percentTotalNetSales: number;
  partialRefundAmount: number;
  partialRefundRepaymentAmount: number;
  category: CloverCategory;
};

type CloverRevenueItemSummary = Omit<
  CloverRevenueItem,
  'id' | 'inventoryItem' | 'labels' | 'modifierSales' | 'inACategory' | 'category'
> & {
  name: string;
};

type CloverInventoryItem = {
  name: string;
  code: string;
  sku: string;
  cost: number;
};

type CloverLabel = {
  id: string;
  name: string;
  showInReporting: boolean;
};

type CloverModifierSale = {
  name: string;
  numberSold: number;
  revenueSold: number;
  numNonRevenueSold: number;
  priceSold: number;
};

type CloverCategory = {
  name: string;
  id: string;
  items: {
    elements: any[]; // TODO: Replace with specific structure if available
  };
  deleted: boolean;
};
