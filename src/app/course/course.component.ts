import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Course } from "../model/course";
import { Lesson } from '../model/lesson';
import {CoursesService} from "../services/courses.service";
import {debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize} from 'rxjs/operators';
import {merge, fromEvent, throwError} from "rxjs";
import { SelectionModel } from '@angular/cdk/collections';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit {

  course:Course;
  loading = false;

  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  @ViewChild(MatSort)
  sort: MatSort;

  lessons: Lesson[] = [];
  
  selection = new SelectionModel(true, []);

  displayedColumns = ['select', 'seqNo', 'description', 'duration'];
  expandedLesson: Lesson = null;
  
    constructor(private route: ActivatedRoute,
                private coursesService: CoursesService) {

    }

    ngOnInit() {

      this.course = this.route.snapshot.data["course"];
      this.loadLessonsPage();

    }

  loadLessonsPage() {
    this.loading = true;
    this.coursesService.findLessons(this.course.id,
      this.sort?.direction ?? "asc",
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 3,
    this.sort?.active ?? "seqNo")
      .pipe(
        tap(lessons => this.lessons = lessons),
        catchError(err => {
          console.log("Error loading lessons", err);
          alert("Error loading lessons.");
          return throwError(err);
        }),
        finalize(() => this.loading = false)
      ).subscribe();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadLessonsPage())
        ).subscribe();
  }
  
  onToggleLesson(lesson:Lesson) {
    if (lesson == this.expandedLesson) {
      this.expandedLesson = null;
    }
    else {
      this.expandedLesson = lesson;
    }
  }

  onLessonToggled(lesson:Lesson) {
    this.selection.toggle(lesson);
    console.log(this.selection.selected);
  }

  isAllSelected() {
    return this.selection.selected?.length == this.lessons?.length;
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.selection.clear();    
    }
    else {
      // sprite operator converts array to sequence of numbers separated by commas 
      this.selection.select(...this.lessons); 
      }
  }

}
