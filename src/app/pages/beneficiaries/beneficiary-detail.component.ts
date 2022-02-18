import {AfterViewInit, Component, Inject, Input, OnDestroy, Renderer2, ViewChild} from '@angular/core';
import {ProjectService} from "../../services/project.service";
import { Router, ActivatedRoute } from '@angular/router';
import {MapComponent} from "../../components/kohesio/map/map.component";
import {BeneficiaryDetail} from "../../models/beneficiary-detail.model";
import { MatPaginator } from '@angular/material/paginator';
import { BeneficiaryService } from 'src/app/services/beneficiary.service';
import { startWith, tap, delay, takeUntil } from 'rxjs/operators';
import { BeneficiaryProjectList } from '../../models/beneficiary-project-list.model';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
declare let L:any;

@Component({
    selector: 'app-beneficiary-detail',
    templateUrl: './beneficiary-detail.component.html',
    styleUrls: ['../projects/projects.component.scss', './beneficiaries.component.scss']
})
export class BeneficiaryDetailComponent implements AfterViewInit, OnDestroy {

    @Input()
    public beneficiary!: BeneficiaryDetail;

    @Input()
    public beneficiaryProjects!: MatTableDataSource<[]>;

    @Input()
    public isModal: boolean = false;

    public wikidataLink!: string;
    public currentUrl: string = location.href;
    public displayedColumns: string[] = ['label', 'budget', 'euBudget', 'fundLabel'];

    @ViewChild(MapComponent) public map!: MapComponent;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    public mobileQuery: boolean;
    private destroyed = new Subject<void>();
 
    constructor(private projectService: ProjectService,
        private beneficiaryService: BeneficiaryService,
                private route: ActivatedRoute,
                private router: Router,
                breakpointObserver: BreakpointObserver){

                    this.mobileQuery = breakpointObserver.isMatched('(max-width: 768px)');
        
                    breakpointObserver
                    .observe([
                        "(max-width: 768px)"
                    ])
                    .pipe(takeUntil(this.destroyed))
                    .subscribe(result => {
                        for (const query of Object.keys(result.breakpoints)) {
                            this.mobileQuery = result.breakpoints[query];
                        }
                    });

    }

    ngOnInit(){
        
        if (!this.beneficiary) {
            this.beneficiary = this.route.snapshot.data['beneficiary'];
        }

        if(!this.beneficiaryProjects){
            this.beneficiaryProjects = this.route.snapshot.data['beneficiaryProjects'].projects;
        }
    }

    ngAfterViewInit(): void {
        if (this.beneficiary.coordinates) {
            let coords: any;
            // @ts-ignore
            coords = this.beneficiary.coordinates;
            coords = coords.replace("Point(", "").replace(")", "").split(" ");
            this.map.addMarker(coords[1],coords[0], true, 5);
            this.map.refreshView();
        }

        this.paginator.page
        .pipe(
            startWith(null),
            delay(0),
            tap(() => this.beneficiaryProjects)
        ).subscribe();

    }

    openWiki(event:any){
        window.open("https://linkedopendata.eu/wiki/Item:" + this.beneficiary.item, "_blank");
    }

    openGraph(event:any){
        const entity = "https://linkedopendata.eu/entity/" + this.beneficiary.item;
        window.open(
            "https://query.linkedopendata.eu/embed.html#%23defaultView%3AGraph%0ASELECT%20%3Fitem%20%3FitemLabel%20WHERE%20%7B%0A%20%20VALUES%20%3Fitem%20%7B%20%3C"
            + entity
            + "%3E%7D%20%3Fitem%20%3FpDirect%20%3FlinkTo%20.%0A%20%20%3Fitem%20rdfs%3Alabel%20%3FitemLabel%20.%0A%20%20FILTER(lang(%3FitemLabel)%3D%22en%22)%0A%7D",
        "_blank");
    }

    getProjectsPerPage(page: number = 0) {
        
        this.beneficiaryService.getBeneficiaryProjects(this.beneficiary.item, page).subscribe((result:BeneficiaryProjectList) =>{
            if (result && result.projects){
                this.beneficiaryProjects = new MatTableDataSource<[]>(result.projects);
            }
        });
    }

    onPaginate(event:any) {
        this.paginator.pageIndex = event.pageIndex;
        this.getProjectsPerPage(event.pageIndex);
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }

}
