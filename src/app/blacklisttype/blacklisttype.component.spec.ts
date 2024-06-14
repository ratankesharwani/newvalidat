import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklisttypeComponent } from './blacklisttype.component';

describe('BlacklisttypeComponent', () => {
  let component: BlacklisttypeComponent;
  let fixture: ComponentFixture<BlacklisttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlacklisttypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlacklisttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
