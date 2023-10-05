import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
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

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => this.processCategoriesResponse(response),
      error: (e) => console.error(e),
      complete: () => console.info('complete service'),
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

  openSnackBar(
    message: string,
    action: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
