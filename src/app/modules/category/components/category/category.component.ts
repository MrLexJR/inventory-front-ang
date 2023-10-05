import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);

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
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
