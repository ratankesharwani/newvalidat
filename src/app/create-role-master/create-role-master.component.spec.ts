import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleMasterComponent } from './create-role-master.component';

describe('CreateRoleMasterComponent', () => {
  let component: CreateRoleMasterComponent;
  let fixture: ComponentFixture<CreateRoleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoleMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRoleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
