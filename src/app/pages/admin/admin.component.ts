import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { WeekDays } from '../../models/manga.model';
import { AlertType } from '../../models/notification.model';
import { MangaService } from '../../services/manga.service';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, TranslateModule, CommonModule],
    templateUrl: './admin.component.html',
})
export class AdminComponent {
    fb = inject(FormBuilder);
    mangaService = inject(MangaService);
    notificationService = inject(NotificationService);
    translateService = inject(TranslateService);

    stepper: boolean = true;
    mangaForm: FormGroup;
    weekDays = Object.values(WeekDays);
    maxFileSizeBytes = 2 * 1024 * 1024;
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
        }, { validators: this.stepperValidator() });
    }

    async onFileChange(event: any) {
        this.file = event.target.files[0];

        if (this.file) {
            if (!this.isValidFileType(this.file)) {
                const invalidFileType = await firstValueFrom(this.translateService.get("pages.admin.alerts.invalid-file-type"));

                this.notificationService.alert({
                    type: AlertType.Warning,
                    message: invalidFileType,
                    duration: 5000
                });
                this.file = null;
                return;
            }

            if (this.file.size > this.maxFileSizeBytes) {
                const fileSizeExceeds = await firstValueFrom(this.translateService.get("pages.admin.alerts.file-size-exceeds"));
                this.notificationService.alert({
                    type: AlertType.Warning,
                    message: fileSizeExceeds,
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

    async addManga() {
        if (this.mangaForm.invalid || !this.file) {
            const fileSizeExceeds = await firstValueFrom(this.translateService.get("pages.admin.alerts.all-fields-required"));

            this.notificationService.alert({
                message: fileSizeExceeds,
                type: AlertType.Warning,
            });


            return;
        }

        const { image, ...mangaData } = this.mangaForm.value;

        try {
            const response = await firstValueFrom(this.mangaService.getPresignedUrl(this.file.type));
            await firstValueFrom(this.mangaService.uploadImageToS3(response.signedUrl, this.file));

            const newMangaData = {
                ...mangaData,
                url: `${environment.urlImages}${response.key}`
            };
            await firstValueFrom(this.mangaService.createManga(newMangaData));
            
            const successMessage = await firstValueFrom(this.translateService.get("pages.admin.alerts.success"));
            this.notificationService.alert({
                message: successMessage,
                type: AlertType.Success,
            });

            this.stepper = true;
            this.mangaForm.reset();
        } catch (error) {
            console.log(error);
        }
    }

    stepperValidator() {
        return (formGroup: FormGroup): { [key: string]: any } | null => {
            const name = formGroup.get('name');
            const date = formGroup.get('email');
            const about = formGroup.get('about');
            const image = formGroup.get('image');

            if (date && date.invalid || name && name.invalid || about && about.invalid) {
                return { step1: true };
            }

            if (image && image.invalid) {
                return { step2: true };
            }

            return null;
        };
    }
}
