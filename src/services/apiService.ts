import axios, { AxiosInstance } from "axios";

class ApiService<T> {
  private api: AxiosInstance;
  private resource: string;

  constructor(
    resource: string,
    baseURL: string = "http://localhost:3000/api/v1"
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

  create(data: T) {
    return this.api.post(`/${this.resource}`, data);
  }

  update(id: string, data: Partial<T>) {
    return this.api.put(`/${this.resource}/${id}`, data);
  }

  remove(id: string) {
    return this.api.delete(`/${this.resource}/${id}`);
  }

  fetchCategories() {
    return this.api.get("/categories");
  }

  fetchMerchants() {
    return this.api.get("/merchants");
  }
}

export const productService = new ApiService("products");
