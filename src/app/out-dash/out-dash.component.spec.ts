import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutDashComponent } from './out-dash.component';

describe('OutDashComponent', () => {
  let component: OutDashComponent;
  let fixture: ComponentFixture<OutDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutDashComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OutDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
