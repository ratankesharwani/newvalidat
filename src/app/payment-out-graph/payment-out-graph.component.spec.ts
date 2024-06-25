import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentOutGraphComponent } from './payment-out-graph.component';

describe('PaymentOutGraphComponent', () => {
  let component: PaymentOutGraphComponent;
  let fixture: ComponentFixture<PaymentOutGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOutGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentOutGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
