import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarGazersComponent } from './star-gazers.component';

describe('StarGazersComponent', () => {
  let component: StarGazersComponent;
  let fixture: ComponentFixture<StarGazersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarGazersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarGazersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
