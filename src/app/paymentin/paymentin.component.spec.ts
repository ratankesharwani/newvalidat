import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentinComponent } from './paymentin.component';

describe('PaymentinComponent', () => {
  let component: PaymentinComponent;
  let fixture: ComponentFixture<PaymentinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentinComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
