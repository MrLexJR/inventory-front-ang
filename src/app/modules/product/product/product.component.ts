import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProductElement } from '../../shared/interfaces/product-element';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);

  dataSource = new MatTableDataSource<ProductElement>();
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'account',
    'category',
    'picture',
    'actions',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      {
        next: (response) => this.processProductResponse(response),
        error: (e) => console.error(e),
      },
    );
  }

  processProductResponse(resp: any) {
    console.log(resp);
    const dateProduct: ProductElement[] = [];
    if (resp.metadata[0].code == '200') {
      let listCProduct = resp.product.products;

      listCProduct.forEach((element: ProductElement) => {
        // element.category = element.category.name;
        element.picture = 'data:image/jpeg;base64,' + element.picture;
        dateProduct.push(element);
      });

      //set the datasource
      this.dataSource = new MatTableDataSource<ProductElement>(dateProduct);
      this.dataSource.paginator = this.paginator;
    }
  }
}
