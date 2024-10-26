import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { firstValueFrom, take } from 'rxjs';
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
    file: File | null = null;

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
                Validators.maxLength(500),
            ]),
            image: new FormControl(null, [Validators.required])
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
        this.file = event.target.files[0];

        if (this.file) {
            if (!this.isValidFileType(this.file)) {
                this.newAlert({
                    type: AlertType.Warning,
                    message: 'Invalid file type. Please upload an PNG, JPG, or GIF image.',
                    duration: 5000
                });
                this.file = null;
                return;
            }

            if (this.file.size > this.maxFileSizeBytes) {
                this.newAlert({
                    type: AlertType.Warning,
                    message: 'File size exceeds 2MB.',
                    duration: 5000
                });

                this.file = null;
                return;
            }
            this.mangaForm.patchValue({
                image: this.file,
            });
        }
    }

    isValidFileType(file: File): boolean {
        const validTypes = [
            'image/png',
            'image/jpeg',
            'image/gif',
        ];
        return validTypes.includes(file.type);
    }

    newAlert(alert: Alert) {
        this.notificationService.alert(alert);
    }

    async addManga() {
        if (this.mangaForm.invalid || !this.file) {
            this.newAlert({
                message: 'Please fill out all required fields',
                type: AlertType.Warning,
            });

            return;
        }

        const { image, ...mangaData } = this.mangaForm.value;


        try {
            const response: any = await firstValueFrom(this.mangaService.getPresignedUrl(this.file.type));

            await firstValueFrom(this.mangaService.uploadImageToS3(response.signedUrl, this.file));

            const newMangaData = {
                ...mangaData,
                url: response.key
            };

            console.log(newMangaData);

            await firstValueFrom(this.mangaService.createManga(newMangaData));

            this.newAlert({
                message: 'New manga created!',
                type: AlertType.Success,
            });

            this.mangaForm.reset();
        } catch (error) {

        }
    }
}
