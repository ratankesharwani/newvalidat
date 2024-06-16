import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinServiceComponent } from './payin-service.component';

describe('PayinServiceComponent', () => {
  let component: PayinServiceComponent;
  let fixture: ComponentFixture<PayinServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayinServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayinServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
