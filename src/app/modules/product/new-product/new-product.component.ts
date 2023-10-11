import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../shared/services/category.service';
import { CategoryElement } from '../../shared/interfaces/category-element';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css'],
})
export class NewProductComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  public productForm!: FormGroup;
  private fb = inject(FormBuilder);
  estadoFormulario: string = '';

  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  categories: CategoryElement[] = [];
  selectedFile!: File;
  nameImg: string = '';

  ngOnInit(): void {
    console.log(this.data);
    this.estadoFormulario = 'Agregar';

    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      account: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required],
    });

    if (this.data != null) {
      // this.updateForm(this.data);
      this.estadoFormulario = 'Actualizar';
    }

    this.getCategories();
  }

  onSave() {
    let data = {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      account: this.productForm.get('account')?.value,
    };

    const uploadImageData = new FormData();
    uploadImageData.append('picture', this.selectedFile);
    uploadImageData.append('data', JSON.stringify(data));
    uploadImageData.append(
      'categoryId',
      this.productForm.get('category')?.value
    );

    if (this.data != null) {
      //update the product
      this.productService
        .updateProduct(uploadImageData, this.data.id)
        .subscribe(
          (data: any) => {
            this.dialogRef.close(1);
          },
          (error: any) => {
            this.dialogRef.close(2);
          }
        );
    } else {
      //call the service to save a product
      this.productService.saveProduct(uploadImageData).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }
  }

  onCancel() {
    this.dialogRef.close(3);
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) =>
        (this.categories = response.categoryResponse.category),
      error: (e) => console.error(e),
    });
  }

  onFileChanged(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;
  }
}
