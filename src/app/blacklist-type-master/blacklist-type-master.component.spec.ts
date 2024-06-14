import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistTypeMasterComponent } from './blacklist-type-master.component';

describe('BlacklistTypeMasterComponent', () => {
  let component: BlacklistTypeMasterComponent;
  let fixture: ComponentFixture<BlacklistTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlacklistTypeMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlacklistTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
