import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCategoryDialog } from './update-category-dialog';

describe('UpdateCategoryDialog', () => {
  let component: UpdateCategoryDialog;
  let fixture: ComponentFixture<UpdateCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateCategoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCategoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
