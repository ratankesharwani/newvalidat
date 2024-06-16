import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinActivityLogComponent } from './payin-activity-log.component';

describe('PayinActivityLogComponent', () => {
  let component: PayinActivityLogComponent;
  let fixture: ComponentFixture<PayinActivityLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayinActivityLogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayinActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
