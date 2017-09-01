import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRepositoryComponent } from './card-repository.component';

describe('CardRepositoryComponent', () => {
  let component: CardRepositoryComponent;
  let fixture: ComponentFixture<CardRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
