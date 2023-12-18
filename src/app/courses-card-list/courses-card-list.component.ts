import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from '../course-dialog/course-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    cols = 3;
    rowHeight = "500px";
    op = 0;
    handsetPortrait = false;

    constructor(private dialog: MatDialog,
    private responsive: BreakpointObserver) {
        
    }

    ngOnInit() {
        this.responsive.observe([
            Breakpoints.TabletPortrait,
            Breakpoints.TabletLandscape,
            Breakpoints.HandsetPortrait,
            Breakpoints.HandsetLandscape
        ]).subscribe(result => {
            
            this.cols = 2;
            this.rowHeight = "500px";
            this.handsetPortrait = false;

            const breakpoints = result.breakpoints;

            if (breakpoints[Breakpoints.TabletPortrait]) {
                this.cols = 1; this.op = 1;
            }
            else if (breakpoints[Breakpoints.HandsetPortrait]) {
                this.cols = 1;
                this.rowHeight = "430px"; this.op = 2;
                 this.handsetPortrait = true;
            }
            else if (breakpoints[Breakpoints.HandsetLandscape]) {
                this.cols = 1;this.op = 3;
            }
            else if (breakpoints[Breakpoints.TabletLandscape]) {
                this.cols = 2; this.op = 4;
            }
            else{
                this.cols = 2;
                this.rowHeight = "450px"; this.op = 5;
            }
            console.log(this.cols, this.rowHeight,this.op);
        });
    }

    editCourse(course:Course) {
        openEditCourseDialog(this.dialog, course)
            .pipe(
                filter((val:any) => !!val)
            )
            .subscribe(
                (val: any) => console.log("new course value", val)
            );
    }

}









