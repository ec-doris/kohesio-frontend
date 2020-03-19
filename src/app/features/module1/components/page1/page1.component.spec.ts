/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule } from '../../../../core/core.module';
import { RouterMock } from '../../../../shared/testing/router.mock';
import { Page1Component } from './page1.component';

describe('Page1Component', () => {
    let component: Page1Component;
    let fixture: ComponentFixture<Page1Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Page1Component
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
        fixture = TestBed.createComponent(Page1Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
