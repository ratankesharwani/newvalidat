import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinServicesComponent } from './payin-services.component';

describe('PayinServicesComponent', () => {
  let component: PayinServicesComponent;
  let fixture: ComponentFixture<PayinServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayinServicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayinServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
