import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { take } from 'rxjs';
import { WeekDays } from '../../models/manga.model';
import { Alert, AlertType } from '../../models/notification.model';
import { MangaService } from '../../services/manga.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './admin.component.html',
})
export class AdminComponent {
    fb = inject(FormBuilder);
    mangaService = inject(MangaService);
    mangaForm: FormGroup;
    weekDays = Object.values(WeekDays);
    inputValue: number = 0;
    maxFileSizeBytes = 2 * 1024 * 1024;
    notificationService = inject(NotificationService);

    constructor() {
        this.mangaForm = this.fb.group({
            name: new FormControl('', [
                Validators.required,
                Validators.maxLength(200),
            ]),
            date: new FormControl<WeekDays | null>(this.weekDays[0], [
                Validators.required,
            ]),
            about: new FormControl('', [
                Validators.required,
                Validators.min(1),
                Validators.maxLength(500),
            ]),
            // chapter: new FormControl(0, [
            //   Validators.required,
            //   Validators.min(0),
            //   Validators.maxLength(50),
            // ]),
            image: new FormControl(null, [Validators.required]),
            rating: new FormControl(5, [
                Validators.required,
                Validators.max(5),
                Validators.min(0),
            ]),
        });
    }

    currentRating(index: number) {
        this.mangaForm.get('rating')?.setValue(index);
    }

    setCurrentRating(index: number) {
        const currentRating = this.mangaForm.get('rating')?.value ?? 0;
        const newRating = index + currentRating;
        this.mangaForm.get('rating')?.setValue(newRating);
    }

    onFileChange(event: any): void {
        const file = event.target.files[0];
        if (file) {
            if (!this.isValidFileType(file)) {
                alert(
                    'Invalid file type. Please upload an SVG, PNG, JPG, or GIF image.'
                );
                return;
            }
            if (file.size > this.maxFileSizeBytes) {
                alert('File size exceeds 2MB.');
                return;
            }
            this.mangaForm.patchValue({
                image: file,
            });
        }
    }

    isValidFileType(file: File): boolean {
        const validTypes = [
            'image/svg+xml',
            'image/png',
            'image/jpeg',
            'image/gif',
        ];
        return validTypes.includes(file.type);
    }

    newAlert(alert: Alert) {
        this.notificationService.alert(alert);
    }

    addManga() {
        if (!this.mangaForm.valid) {
            this.newAlert({
                message: 'Please fill out all required fields',
                type: AlertType.Warning,
            });
            return;
        }

        this.mangaService
            .uploadManga(this.mangaForm.value)
            .pipe(take(1))
            .subscribe({
                next: (res) => {
                    this.newAlert({
                        message: 'New manga added!',
                        type: AlertType.Success,
                    });
                    this.mangaForm.reset();
                },
                error: (err) => {
                    this.newAlert({
                        message: err,
                        type: AlertType.Error,
                    });
                    this.mangaForm.reset();
                },
                complete: () => console.log('COMPLETED'),
            });
    }
}
