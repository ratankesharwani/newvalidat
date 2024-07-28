import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempGraph01Component } from './temp-graph01.component';

describe('TempGraph01Component', () => {
  let component: TempGraph01Component;
  let fixture: ComponentFixture<TempGraph01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempGraph01Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempGraph01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
