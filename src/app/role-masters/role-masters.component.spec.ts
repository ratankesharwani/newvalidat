import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMastersComponent } from './role-masters.component';

describe('RoleMastersComponent', () => {
  let component: RoleMastersComponent;
  let fixture: ComponentFixture<RoleMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleMastersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
