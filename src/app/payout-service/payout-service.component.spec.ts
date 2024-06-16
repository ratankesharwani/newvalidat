import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutServiceComponent } from './payout-service.component';

describe('PayoutServiceComponent', () => {
  let component: PayoutServiceComponent;
  let fixture: ComponentFixture<PayoutServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
