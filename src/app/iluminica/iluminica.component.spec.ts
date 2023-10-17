import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IluminicaComponent } from './iluminica.component';

describe('IluminicaComponent', () => {
  let component: IluminicaComponent;
  let fixture: ComponentFixture<IluminicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IluminicaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IluminicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
