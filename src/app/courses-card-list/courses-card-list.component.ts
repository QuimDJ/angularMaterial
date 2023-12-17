import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { openEditCourseDialog } from '../course-dialog/course-dialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    constructor(private dialog: MatDialog) {
        
    }

    ngOnInit() {
        
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









