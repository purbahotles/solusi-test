import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog'; // Import MAT_DIALOG_DATA
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ArrayUtilsService } from '../array-utils.service';

@Component({
  selector: 'app-edit-employee-dialog',
  templateUrl: './edit-employee-dialog.component.html',
  styleUrls: ['./edit-employee-dialog.component.css']
})
export class EditEmployeeDialogComponent {
  numberArray: any[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Inject MAT_DIALOG_DATA
    private dialogRef: MatDialogRef<any>,
    private dialog: MatDialog, // Inject MatDialog
    private arrayUtilsService: ArrayUtilsService
  ) {
    // Bagi string number menjadi array karakter saat dialog dibuka
    this.numberArray = this.data.number.split(',');
    this.numberArray = [...this.numberArray];
    console.log(this.numberArray, 'this.numberArray');
    
  }

  ngOnChanges(): void {
    this.updateNumberArray();
  }

  private updateNumberArray(): void {
    this.numberArray = this.data.number.split(',').map((num: any) => num.trim());
    console.log(this.numberArray, 'this.numberArray');
  }

  saveChanges(): void {
    // Menghapus tanda koma tambahan setelah penghapusan digit
    const numberString = this.numberArray.filter(Boolean).join(',');
  
    this.data.number = numberString;
    const sum: number[] = numberString.split(',').map((numStr: any) => parseFloat(numStr.trim()));
    const total = sum.reduce((acc, curr) => acc + curr, 0);

    const digits = numberString.split(',').map(Number);

    // Shuffle the array using the ArrayUtilsService
    const random = this.arrayUtilsService.shuffleArray(digits, total);
    // Sort the array of digits
    const sorted = [...digits].sort((a, b) => a - b);
    

    this.data.average = total / sum.length
    this.data.sorted = sorted
    this.data.random = random
    this.dialogRef.close(this.data);
  }

  deleteRow(index: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: this.numberArray[index] // Kirim data karyawan yang dipilih ke dialog
    });
    dialogRef.afterClosed().subscribe(result => { 
      if(result) {
        if (index != -1) {
          this.numberArray.splice(index, 1);
          this.numberArray = [...this.numberArray];
          this.numberArray = this.numberArray.map(item => item);
        }
      }
    });
    
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
}
