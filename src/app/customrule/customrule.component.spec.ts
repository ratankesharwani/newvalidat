import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomruleComponent } from './customrule.component';

describe('CustomruleComponent', () => {
  let component: CustomruleComponent;
  let fixture: ComponentFixture<CustomruleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomruleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
