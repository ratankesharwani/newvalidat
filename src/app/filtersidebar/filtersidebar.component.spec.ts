import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersidebarComponent } from './filtersidebar.component';

describe('FiltersidebarComponent', () => {
  let component: FiltersidebarComponent;
  let fixture: ComponentFixture<FiltersidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltersidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltersidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
