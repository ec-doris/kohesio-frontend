/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoreModule } from '../../../../core/core.module';
import { RouterMock } from '../../../../shared/testing/router.mock';
import { Page2Component } from './page2.component';

describe('Page2Component', () => {
    let component: Page2Component;
    let fixture: ComponentFixture<Page2Component>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Page2Component
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
        fixture = TestBed.createComponent(Page2Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
