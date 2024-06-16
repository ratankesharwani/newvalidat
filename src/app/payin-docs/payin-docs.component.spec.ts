import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayinDocsComponent } from './payin-docs.component';

describe('PayinDocsComponent', () => {
  let component: PayinDocsComponent;
  let fixture: ComponentFixture<PayinDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayinDocsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayinDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
