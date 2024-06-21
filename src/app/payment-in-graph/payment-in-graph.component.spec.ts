import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInGraphComponent } from './payment-in-graph.component';

describe('PaymentInGraphComponent', () => {
  let component: PaymentInGraphComponent;
  let fixture: ComponentFixture<PaymentInGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentInGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentInGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
