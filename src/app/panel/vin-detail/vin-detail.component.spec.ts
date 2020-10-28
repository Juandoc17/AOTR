import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinDetailComponent } from './vin-detail.component';

describe('VinDetailComponent', () => {
  let component: VinDetailComponent;
  let fixture: ComponentFixture<VinDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
