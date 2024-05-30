import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscrivezVousComponent } from './inscrivez-vous.component';

describe('InscrivezVousComponent', () => {
  let component: InscrivezVousComponent;
  let fixture: ComponentFixture<InscrivezVousComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InscrivezVousComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InscrivezVousComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
