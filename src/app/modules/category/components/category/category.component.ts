import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { CategoryElement } from 'src/app/modules/shared/interfaces/category-element';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  dataSource = new MatTableDataSource<CategoryElement>();
  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => this.processCategoriesResponse(response),
      error: (e) => console.error(e),
    });
  }

  processCategoriesResponse(res: any) {
    const dataCategory: CategoryElement[] = [];
    if (res.metadata[0].code === '200') {
      let listCategory = res.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });
      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    } else {
      this.dataSource.data = [];
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result === 1) {
        this.getCategories();
        this.openSnackBar('Categoria Agregada', 'Exitosa');
      } else if (result === 2) {
        this.openSnackBar(
          'Se produjo un error al guardar categoria agregada',
          'Error'
        );
      }
    });
  }

  edit(data: CategoryElement) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: { id: data.id, name: data.name, description: data.description },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Categoria Actualizada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar(
          'Se produjo un error al actualizar categoria',
          'Error'
        );
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar('Categoria Eliminada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackBar('Se produjo un error al eliminar categoria', 'Error');
      }
    });
  }

  buscar(termino: string) {
    if (termino.trim().length === 0) {
      return this.getCategories();
    }

    // Verificar si el término es un número
    const isNumber = !isNaN(Number(termino));

    if (isNumber) {
      // Realizar la búsqueda por ID
      this.categoryService.getCategorieById(termino).subscribe((resp: any) => {
        this.processCategoriesResponse(resp);
      });
    } else {
      // Realizar la búsqueda por nombre o descripción
      this.categoryService
        .searchCategories(termino.trim())
        .subscribe((resp: any) => {
          this.processCategoriesResponse(resp);
        });
    }
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
