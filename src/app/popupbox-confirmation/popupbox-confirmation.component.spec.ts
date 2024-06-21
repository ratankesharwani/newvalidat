import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupboxConfirmationComponent } from './popupbox-confirmation.component';

describe('PopupboxConfirmationComponent', () => {
  let component: PopupboxConfirmationComponent;
  let fixture: ComponentFixture<PopupboxConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupboxConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupboxConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
