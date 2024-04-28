import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArrayUtilsService {
  constructor() {}

  shuffleArray(array: any[], total: number): any[] {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While elemen acak
    while (currentIndex !== 0) {
      // pilih elemen
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // Tukar dengan elemen saat ini
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    // Hitung jumlah total baru dari array yang diacak
    const newTotal = array.reduce((acc, curr) => acc + curr, 0);

    // Sesuaikan elemen terakhir untuk total
    array[array.length - 1] += total - newTotal;

    return array;
  }
}
