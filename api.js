const BUSINESS = "DISTRICT_BURGER_BA";
class CloverClient {
  #merchantId;
  #privateToken;

  constructor(merchantId, privateToken) {
    if (!merchantId || !privateToken) {
      throw new Error("Merchant ID and Private Token are required.");
    }
    this.#merchantId = merchantId;
    this.#privateToken = privateToken;
  }

  async #request(path, queryParams = {}) {
    const url = new URL(
      `https://api.clover.com/v3/merchants/${this.#merchantId}${path}`,
    );

    Object.entries(queryParams).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.#privateToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async fetchEmployees() {
    return this.#request("/employees");
  }

  async fetchOrdersByEmployee(employeeId) {
    return this.#request(`/employees/${employeeId}/orders?limit=100`);
  }

  async fetchOrderDetails(orderId) {
    return this.#request(`/orders/${orderId}`);
  }
}

const MERCHANT_ID = process.env[`${BUSINESS}_CLOVER_MERCHANT_ID`];
const PRIVATE_TOKEN = process.env[`${BUSINESS}_CLOVER_PRIVATE_TOKEN`];
const cloverClient = new CloverClient(MERCHANT_ID, PRIVATE_TOKEN);

(async () => {
  try {
    const employeeData = await cloverClient.fetchEmployees();
    const employees = employeeData.elements;
    console.log("Employees:", employees);
    const targetEmployee = employees.find((e) => e.id == "XX4PE09PZ459E");

    console.log("Target Employee:", targetEmployee);

    const orders = await cloverClient.fetchOrdersByEmployee(targetEmployee.id);
    console.log("Fetched Orders for Employee:", orders);
    // console.log("Orders:", orders[0]);
    for (const order of orders.elements) {
      console.log("Order:", order);
      // if (orders.elements.length > 10) {
      //   console.log(order);
      // }
      // const orderDetails = await cloverClient.fetchOrderDetails(
      //   orders.elements[0].id,
      // );
      // console.log("Order Details:", orderDetails);
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
