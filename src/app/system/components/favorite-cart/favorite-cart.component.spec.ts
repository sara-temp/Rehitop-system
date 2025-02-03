import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCartComponent } from './favorite-cart.component';

describe('FavoriteCartComponent', () => {
  let component: FavoriteCartComponent;
  let fixture: ComponentFixture<FavoriteCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
