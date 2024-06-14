import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterbuttonComponent } from './filterbutton.component';

describe('FilterbuttonComponent', () => {
  let component: FilterbuttonComponent;
  let fixture: ComponentFixture<FilterbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterbuttonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
