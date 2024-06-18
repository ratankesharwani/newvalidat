import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthrizationAlertComponent } from './authrization-alert.component';

describe('AuthrizationAlertComponent', () => {
  let component: AuthrizationAlertComponent;
  let fixture: ComponentFixture<AuthrizationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthrizationAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthrizationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
