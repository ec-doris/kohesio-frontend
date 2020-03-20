/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule } from '../../core/core.module';
import { RouterMock } from '../../shared/testing/router.mock';
import { Module2Component } from './module2.component';

describe('Module2Component', () => {
    let component: Module2Component;
    let fixture: ComponentFixture<Module2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Module2Component
            ],
            imports: [
                CoreModule,
            ],
            providers: [
                { provide: Router, useClass: RouterMock },
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Module2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
