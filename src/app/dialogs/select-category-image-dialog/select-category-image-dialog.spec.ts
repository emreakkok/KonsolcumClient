import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCategoryImageDialog } from './select-category-image-dialog';

describe('SelectCategoryImageDialog', () => {
  let component: SelectCategoryImageDialog;
  let fixture: ComponentFixture<SelectCategoryImageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectCategoryImageDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCategoryImageDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
