import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutActivityLogComponent } from './payout-activity-log.component';

describe('PayoutActivityLogComponent', () => {
  let component: PayoutActivityLogComponent;
  let fixture: ComponentFixture<PayoutActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutActivityLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
