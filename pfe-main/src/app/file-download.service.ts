import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor() { }

  downloadFile(file: File) {
    const url = window.URL.createObjectURL(file);
    window.open(url);
  }
}






