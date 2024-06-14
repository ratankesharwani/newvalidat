import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWhitelistDetailsComponent } from './add-whitelist-details.component';

describe('AddWhitelistDetailsComponent', () => {
  let component: AddWhitelistDetailsComponent;
  let fixture: ComponentFixture<AddWhitelistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWhitelistDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddWhitelistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
