import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedBeneComponent } from './banned-bene.component';

describe('BannedBeneComponent', () => {
  let component: BannedBeneComponent;
  let fixture: ComponentFixture<BannedBeneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannedBeneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannedBeneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
