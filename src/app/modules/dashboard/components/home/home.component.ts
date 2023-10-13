import { Component, OnInit, inject } from '@angular/core';
import { Chart } from 'chart.js';
import { ProductElement } from 'src/app/modules/shared/interfaces/product-element';
import { ProductService } from 'src/app/modules/shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  chartBar: any;
  chartDoughnut: any;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe({
      next: (response) => this.processProductResponse(response),
      error: (e) => console.error(e),
    });
  }

  processProductResponse(resp: any) {
    const namesProducts: string[] = [];
    const account: number[] = [];

    if (resp.metadata[0].code == '200') {
      let listCProduct = resp.product.products;

      listCProduct.forEach((element: ProductElement) => {
        namesProducts.push(element.name);
        account.push(element.account);
      });

      this.chartBar = new Chart('canvas-bar', {
        type: 'bar',
        data: {
          labels: namesProducts,
          datasets: [{ label: 'Products', data: account }],
        },
      });

      this.chartDoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: namesProducts,
          datasets: [{ label: 'Products', data: account }],
        },
      });
    }
  }
}
