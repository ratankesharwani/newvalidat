import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomRuleComponent } from './add-custom-rule.component';

describe('AddCustomRuleComponent', () => {
  let component: AddCustomRuleComponent;
  let fixture: ComponentFixture<AddCustomRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomRuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCustomRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
