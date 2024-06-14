import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlacklisttypeComponent } from './add-blacklisttype.component';

describe('AddBlacklisttypeComponent', () => {
  let component: AddBlacklisttypeComponent;
  let fixture: ComponentFixture<AddBlacklisttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBlacklisttypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBlacklisttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
