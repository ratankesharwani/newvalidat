import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempGraphComponent } from './temp-graph.component';

describe('TempGraphComponent', () => {
  let component: TempGraphComponent;
  let fixture: ComponentFixture<TempGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
