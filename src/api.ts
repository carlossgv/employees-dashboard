import 'dotenv/config';
import axios, { AxiosInstance } from 'axios';
import { CloverEmployee } from './types/clover-employee';
import { CloverOrder } from './types/clover-order';
import { CloverResponse } from './types/clover';

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

  async fetchOrdersByEmployee(employeeId: string) {
    return this.#request<CloverResponse<CloverOrder[]>>(`/employees/${employeeId}/orders`);
  }

  async fetchOrderDetails(orderId: string) {
    return this.#request<CloverResponse<CloverOrder>>(`/orders/${orderId}`);
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
    const targetEmployee = employees[20];

    console.log("Target Employee:", targetEmployee);

    const orders = await cloverClient.fetchOrdersByEmployee(targetEmployee.id);
    const orderDetails = await cloverClient.fetchOrderDetails(orders.elements[0].id);
    console.log("Order Details:", orderDetails);
  } catch (error) {
    console.error("Error:", error);
  }
})();
