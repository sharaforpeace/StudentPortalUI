import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { gender } from 'src/app/models/ui-models/gender.model';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/Services/gender.service';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: '',
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
    },
  };

  isNewStudent = false;
  headerTxt = '';
  genderList: gender[] = [];

  constructor(
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');
    });

    if (this.studentId) {
      if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
        // -> new Student Functionality
        this.isNewStudent = true;
        this.headerTxt = 'Add New Student';
      } else {
        //-> Existing Student Functionality
        this.isNewStudent = false;
        this.headerTxt = 'Edit Student';
        this.studentService.getStudent(this.studentId).subscribe({
          next: (successResponse) => {
            this.student = successResponse;
          },
          error: (errorResponse) => {},
        });
      }
      this.genderService.getGenderList().subscribe({
        next: (successResponse) => {
          this.genderList = successResponse;
        },
        error: (errorResponse) => {},
      });
    }
  }

  onUpdate(): void {
    this.studentService.updateStudent(this.student.id, this.student).subscribe({
      next: (successResponse) => {
        this.snackbar.open(' Student updated successfully !', undefined, {
          duration: 2000,
        });
      },
      error: (errorResponse) => {
        //
      },
    });
  }

  onDelete(): void {
    this.studentService.deleteStudent(this.student.id).subscribe({
      next: (successResponse) => {
        this.snackbar.open(' Student deleted successfully !', undefined, {
          duration: 2000,
        });
        setTimeout(() => {
          this.router.navigateByUrl('students');
        }, 2000);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }

  onAdd(): void {
    this.studentService.addStudent(this.student).subscribe({
      next: (successResponse) => {
        this.snackbar.open(' Student Created successfully !', undefined, {
          duration: 2000,
        });
        setTimeout(() => {
          this.studentId = `${successResponse.id}`;
          this.reloadCurrentRoute(this.studentId);
        }, 2000);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      },
    });
  }
  reloadCurrentRoute(studentId: string) {
    const currentUrl = ['students/' + studentId];
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(currentUrl);
    });
  }
}
