import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutdetailsComponent } from './payoutdetails.component';

describe('PayoutdetailsComponent', () => {
  let component: PayoutdetailsComponent;
  let fixture: ComponentFixture<PayoutdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutdetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
