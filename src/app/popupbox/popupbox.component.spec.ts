import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupboxComponent } from './popupbox.component';

describe('PopupboxComponent', () => {
  let component: PopupboxComponent;
  let fixture: ComponentFixture<PopupboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopupboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
