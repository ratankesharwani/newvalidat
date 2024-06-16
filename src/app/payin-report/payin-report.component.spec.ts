import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinReportComponent } from './payin-report.component';

describe('PayinReportComponent', () => {
  let component: PayinReportComponent;
  let fixture: ComponentFixture<PayinReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayinReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayinReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
