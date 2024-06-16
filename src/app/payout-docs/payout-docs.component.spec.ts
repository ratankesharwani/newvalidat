import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayoutDocsComponent } from './payout-docs.component';

describe('PayoutDocsComponent', () => {
  let component: PayoutDocsComponent;
  let fixture: ComponentFixture<PayoutDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayoutDocsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayoutDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
