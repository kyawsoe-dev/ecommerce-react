import axios, { AxiosInstance } from "axios";
import { OrderType } from "../types/order";

export class ApiService<T> {
  public api: AxiosInstance;
  protected resource: string;

  constructor(
    resource: string,
    baseURL: string = process.env.REACT_APP_API_BASE_URL || ""
  ) {
    this.resource = resource;
    this.api = axios.create({ baseURL });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    });
  }

  listWithQuery(query: string) {
    return this.api.get(`/${this.resource}?${query}`);
  }

  get(id: string) {
    return this.api.get(`/${this.resource}/${id}`);
  }

  getAll(query: string) {
    return this.api.get(`/${this.resource}/all?${query}`);
  }

  create(data: T) {
    return this.api.post(`/${this.resource}`, data);
  }

  update(id: string, data: Partial<T>) {
    return this.api.put(`/${this.resource}/${id}`, data);
  }

  updateStatus(id: string, data: Partial<T>) {
    return this.api.put(`/${this.resource}/${id}/status`, data);
  }

  remove(id: string) {
    return this.api.delete(`/${this.resource}`);
  }

  fetchCategories() {
    return this.api.get("/categories");
  }

  fetchMerchants() {
    return this.api.get("/merchants");
  }
}

export const productService = new ApiService("products");
export const userService = new ApiService("users");
export const orderService = new ApiService<OrderType>("orders");
