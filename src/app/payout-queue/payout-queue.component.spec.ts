import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutQueueComponent } from './payout-queue.component';

describe('PayoutQueueComponent', () => {
  let component: PayoutQueueComponent;
  let fixture: ComponentFixture<PayoutQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutQueueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
