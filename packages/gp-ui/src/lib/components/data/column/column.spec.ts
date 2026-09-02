import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpColumn } from './column';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpColumn],
  template: `
    <gp-column field="name" header="Full Name" [sortable]="true" width="200px" align="center" />
  `
})
class TestHostComponent {}

describe('GpColumn', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let column: GpColumn;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpColumn]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    column = fixture.debugElement.children[0].componentInstance;
  });

  it('should initialize column inputs correctly', () => {
    expect(column.field()).toBe('name');
    expect(column.header()).toBe('Full Name');
    expect(column.sortable()).toBeTrue();
    expect(column.width()).toBe('200px');
    expect(column.align()).toBe('center');
  });
});
