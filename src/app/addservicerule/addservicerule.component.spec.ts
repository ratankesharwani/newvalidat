import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddserviceruleComponent } from './addservicerule.component';

describe('AddserviceruleComponent', () => {
  let component: AddserviceruleComponent;
  let fixture: ComponentFixture<AddserviceruleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddserviceruleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddserviceruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
