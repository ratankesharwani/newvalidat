import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhitelistDetailsComponent } from './whitelist-details.component';

describe('WhitelistDetailsComponent', () => {
  let component: WhitelistDetailsComponent;
  let fixture: ComponentFixture<WhitelistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhitelistDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhitelistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
