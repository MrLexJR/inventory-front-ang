import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * get all the products
   */
  getProducts() {
    const endpoint = `${this.baseUrl}/products`;
    return this.http.get(endpoint);
  }

  /**
   * save the product
   */
  saveProduct(body: any) {
    const endpoint = `${this.baseUrl}/products`;
    return this.http.post(endpoint, body);
  }

  /**
   * update product
   */
  updateProduct(body: any, id: any) {
    const endpoint = `${this.baseUrl}/products/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete product
   */
  deleteProduct(id: any) {
    const endpoint = `${this.baseUrl}/products/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by name
   */
  getProductByName(name: any) {
    const endpoint = `${this.baseUrl}/products/filter/${name}`;
    return this.http.get(endpoint);
  }

  /**
   * export excel products
   */
  exportProduct() {
    const endpoint = `${this.baseUrl}/products/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob',
    });
  }
}
