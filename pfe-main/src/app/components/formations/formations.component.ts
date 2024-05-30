import { Component, OnInit } from '@angular/core';
import { Formation } from '../../model/formation';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../../service/formation.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css']
})
export class FormationsComponent implements OnInit {
  formationId: any;
  pdfs: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.formationId = params['id'];
      this.loadPDFs();
    });
  }

  loadPDFs() {
    this.formationService.getFormationPDFById(this.formationId).subscribe(
      pdfs => {
        this.pdfs = pdfs;
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de chargement des PDF',
          showConfirmButton: false,
          timer: 1500
        })
        console.error('Error loading PDFs:', error);
      }
    );
  }

  getPdfUrl(pdfName: string): SafeResourceUrl {
    const url = `http://localhost:9090/pdf/${pdfName}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
}
