import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutServicesComponent } from './payout-services.component';

describe('PayoutServicesComponent', () => {
  let component: PayoutServicesComponent;
  let fixture: ComponentFixture<PayoutServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
