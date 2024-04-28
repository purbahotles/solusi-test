import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { EditEmployeeDialogComponent } from '../edit-employee-dialog/edit-employee-dialog.component';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { NgForm } from '@angular/forms';
import { ArrayUtilsService } from '../array-utils.service';
export interface Employee {
  number: string;
  average: string;
  sorted: string[];
  random: string[];
}

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})


export class EmployeeListComponent implements AfterViewInit, OnInit {
  employees: Employee[] = [];
  random!: number[];
  dataSource = new MatTableDataSource<Employee>();
  displayedColumns: string[] = ['number', 'average', 'sorted', 'random', 'actions'];
  newEmployee: Employee = { number: '', average: '', sorted: [], random: [] };
  employeeFormInitialized = false;

  @ViewChild('employeeForm') employeeForm!: NgForm; // ViewChild for the form

  ngOnInit(): void {
    // Mark the form as touched when the component initializes
    this.employeeFormInitialized = true;
    if (this.employeeForm) {
      this.employeeForm.form.markAllAsTouched();
    }
  }

  ngAfterViewInit(): void {
    if (this.employeeFormInitialized && this.employeeForm) {
      this.employeeForm.form.markAllAsTouched();
    }
  }

  constructor(private dialog: MatDialog, private arrayUtilsService: ArrayUtilsService) {}

  editRow(employee: Employee): void {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      width: '250px',
      data: employee // Kirim data karyawan yang dipilih ke dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Perbarui data karyawan jika dialog dikonfirmasi (tombol "Save" ditekan)
        const index = this.employees.findIndex(emp => emp.number === result.number);
        if (index !== -1) {
          this.employees[index] = result;
        }
      }
    });
  }

  deleteRow(index: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: this.employees[index] 
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        // Hapus baris karyawan dari array 'employees' berdasarkan indeks
        this.employees.splice(index, 1);
        // Perbarui data source
        this.dataSource.data = this.employees;
      }
    });
    
  }

  isFormValid(): any {
    return !!this.employeeForm && this.employeeForm.valid;
  }

  clearForm(): void {
    this.newEmployee = { number: '', average: '', sorted: [], random: [] };
  }

  addEmployee(): void {
    if (!this.isFormValid()) {
      return;
    }
  
    // Memisahkan string menjadi array karakter, kemudian mengonversi setiap karakter menjadi bilangan bulat
    const numbers = this.newEmployee.number.split('').map(num => parseInt(num, 10));
  
    // Menghitung total dari semua bilangan dalam array
    const total = numbers.reduce((acc, curr) => acc + curr, 0);
  
    // Menghitung rata-rata dengan membagi total dengan jumlah bilangan dalam array
    const average = total / numbers.length;

    const sorted = [...numbers].sort((a, b) => a - b);
    console.log(sorted, 'sorted')

    const random = this.arrayUtilsService.shuffleArray(numbers, total); // Use the service's shuffleArray method

    console.log(random, 'random test')
  
    // Mengubah string '123' menjadi '1,2,3'
  
    const sortedStrings = sorted.map(num => num.toString());
    const randomStrings = random.map(num => num.toString());
    const formattedNumber = this.newEmployee.number.split('').join(',');

  
    // Menambahkan objek 'newEmployee' ke dalam array 'employees' dengan nilai rata-rata
    this.employees.push({ ...this.newEmployee, number: formattedNumber, average: average.toString(), sorted: sortedStrings, random: randomStrings });
  
    this.clearForm();
    this.dataSource.data = this.employees;
  }
}
