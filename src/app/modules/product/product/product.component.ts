import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { ProductElement } from '../../shared/interfaces/product-element';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
    this.productService.getProducts().subscribe({
      next: (response) => this.processProductResponse(response),
      error: (e) => console.error(e),
    });
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
    } else {
      this.dataSource.data = [];
    }
  }

  openProductDialog() {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Producto Agregado', 'Exitosa');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al guardar producto', 'Error');
      }
    });
  }

  edit(product: ProductElement) {
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data: {
        product,
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Producto editado', 'Exitosa');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al editar producto', 'Error');
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id: id, module: 'product' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Producto eliminado', 'Exitosa');
        this.getProducts();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al eliminar producto', 'Error');
      }
    });
  }

  buscar(name: any) {
    if (name.length === 0) {
      return this.getProducts();
    }

    this.productService.getProductByName(name).subscribe({
      next: (resp: any) => this.processProductResponse(resp),
      error: (e) => (this.dataSource.data = []),
    });
  }

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
