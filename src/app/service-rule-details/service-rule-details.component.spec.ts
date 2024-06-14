import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRuleDetailsComponent } from './service-rule-details.component';

describe('ServiceRuleDetailsComponent', () => {
  let component: ServiceRuleDetailsComponent;
  let fixture: ComponentFixture<ServiceRuleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceRuleDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceRuleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
