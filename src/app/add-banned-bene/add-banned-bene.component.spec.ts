import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBannedBeneComponent } from './add-banned-bene.component';

describe('AddBannedBeneComponent', () => {
  let component: AddBannedBeneComponent;
  let fixture: ComponentFixture<AddBannedBeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBannedBeneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddBannedBeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
