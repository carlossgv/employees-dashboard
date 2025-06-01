import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';
import { CloverEmployee } from './types/clover-employee';
import { CloverResponse } from './types/clover';
import { EmployeeSummariesResponse as CloverEmployeeSummariesResponse } from './types/clover-employee-summary';

class CloverClient {
  #merchantId: string;
  #privateToken: string;
  #axiosInstance: AxiosInstance;

  constructor(merchantId: string, privateToken: string) {
    if (!merchantId || !privateToken) {
      throw new Error("Merchant ID and Private Token are required.");
    }

    this.#merchantId = merchantId;
    this.#privateToken = privateToken;

    this.#axiosInstance = axios.create({
      baseURL: `https://api.clover.com/v3/merchants/${this.#merchantId}`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.#privateToken}`,
      },
    });
  }

  async #request<T>(path: string, queryParams = {}): Promise<T> {
    try {
      const response = await this.#axiosInstance.get<T>(path, { params: queryParams });
      return response.data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async fetchEmployees() {
    return this.#request<CloverResponse<CloverEmployee[]>>("/employees");
  }

  async fetchEmployeeSummary(
    employeeId: string,
    createdTimeStart?: number,
    createdTimeEnd?: number
  ) {
    const filters: string[] = [`employee.id=${employeeId}`];

    if (createdTimeStart !== undefined) {
      const end = createdTimeEnd ?? Date.now();
      filters.push(`clientCreatedTime>${createdTimeStart}`);
      filters.push(`clientCreatedTime<${end}`);
    }

    const query = filters.map(f => `filter=${encodeURIComponent(f)}`).join('&');

    return this.#request<CloverEmployeeSummariesResponse>(
      `summaries/employee_sales?${query}`
    );
  }

  async fetchLineItemReportByEmployee(
    employeeId: string,
    createdTimeStart: number,
    createdTimeEnd: number
  ): Promise<CloverReportResponse> {
    const filters: string[] = [
      `clientCreatedTime>${createdTimeStart}`,
      `clientCreatedTime<${createdTimeEnd}`,
      `employee.id=${employeeId}`
    ];

    const query = filters.map(f => `filter=${encodeURIComponent(f)}`).join('&');

    return this.#request<CloverReportResponse>(`reports/line_items?${query}`);
  }
}


// Usage
const MERCHANT_ID = process.env.CLOVER_MERCHANT_ID;
const PRIVATE_TOKEN = process.env.CLOVER_PRIVATE_TOKEN;
if (!MERCHANT_ID || !PRIVATE_TOKEN) {
  throw new Error("CLOVER_MERCHANT_ID and CLOVER_PRIVATE_TOKEN environment variables are required.");
}

const cloverClient = new CloverClient(MERCHANT_ID, PRIVATE_TOKEN);

(async () => {
  try {
    const employeeData = await cloverClient.fetchEmployees();
    const employees = employeeData.elements;
    // console.log("Employees:", employees);
    // Blessdar's Id: 5NGP9TCKXBS8M
    // example start timestamp: 1748581200000
    // example end timestamp: 1748667599000
    const end = 1748753999000
    const start =1748667600000

    const targetEmployee = employees.find(emp => emp.id === "5NGP9TCKXBS8M");
    if (!targetEmployee) {
      throw new Error("Target employee not found.");
    }

    console.log("Target Employee:", targetEmployee);

    const summary = await cloverClient.fetchEmployeeSummary(targetEmployee.id, start, end);
    console.debug("Employee Summary", summary);
    console.debug('Summary:', summary.employeeSummaries.elements[0]);

    const lineItemReport = await cloverClient.fetchLineItemReportByEmployee(targetEmployee.id, start, end);
    // console.debug("Line Item Report:", lineItemReport);
    console.debug('Line Item Report:', lineItemReport.revenueItems.items.elements[0]);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    }
    console.error("Error:", error);
  }
})();
