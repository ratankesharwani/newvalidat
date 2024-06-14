import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayindetailsformComponent } from './payindetailsform.component';

describe('PayindetailsformComponent', () => {
  let component: PayindetailsformComponent;
  let fixture: ComponentFixture<PayindetailsformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayindetailsformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayindetailsformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
