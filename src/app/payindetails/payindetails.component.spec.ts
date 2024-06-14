import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayindetailsComponent } from './payindetails.component';

describe('PayindetailsComponent', () => {
  let component: PayindetailsComponent;
  let fixture: ComponentFixture<PayindetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayindetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayindetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
