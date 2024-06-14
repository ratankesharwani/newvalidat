import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistDetailsComponent } from './blacklist-details.component';

describe('BlacklistDetailsComponent', () => {
  let component: BlacklistDetailsComponent;
  let fixture: ComponentFixture<BlacklistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlacklistDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlacklistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
