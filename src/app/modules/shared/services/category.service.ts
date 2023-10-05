import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryElement } from '../interfaces/category-element';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * get all categories
   *
   * @returns all categories
   */
  getCategories(): Observable<any> {
    const endpoint = `${this.baseUrl}/categories`;
    return this.http.get(endpoint);
  }

  /**
   * Create Categories
   *
   * @param body
   * @returns
   */
  saveCategorie(body: CategoryElement): Observable<any> {
    const endpoint = `${this.baseUrl}/categories`;
    return this.http.post(endpoint, body);
  }

  /**
   * Update Categories
   *
   * @param body data update
   * @param id id of catageories
   * @returns observable
   */
  updateCategorie(body: any, id: any) {
    const endpoint = `${this.baseUrl}/categories/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * Delete Categories
   * 
   * @param id identificador 
   * @returns observable
   */
  deleteCategories(id: any){
    const endpoint = `${this.baseUrl}/categories/${id}`;
    return this.http.delete(endpoint);
  }
}
