import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapviewModalComponent } from './mapview-modal.component';

describe('MapviewModalComponent', () => {
  let component: MapviewModalComponent;
  let fixture: ComponentFixture<MapviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapviewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
