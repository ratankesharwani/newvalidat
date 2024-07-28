import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempGraph02Component } from './temp-graph02.component';

describe('TempGraph02Component', () => {
  let component: TempGraph02Component;
  let fixture: ComponentFixture<TempGraph02Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempGraph02Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempGraph02Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
