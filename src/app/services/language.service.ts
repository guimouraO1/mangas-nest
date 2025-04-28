import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Languages } from '../../models/language.model';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    DEFAULT_LANGUAGE = 'en';
    private languageSubject = new BehaviorSubject<Languages>('en');
    language$ = this.languageSubject.asObservable();
    translateService =  inject(TranslateService);

    initializeLanguage(): void {
        this.translateService.addLangs(['pt-br', 'en']);
        this.translateService.setDefaultLang(this.DEFAULT_LANGUAGE);

        const language: Languages = localStorage.getItem('language') as Languages;

        if(language && language === 'pt-br' || language === 'en') {
            this.translateService.use(language);
            this.setLanguage(language);
        };
    }

    getLanguage(): string {
        return this.languageSubject.value;
    }

    setLanguage(language: Languages) {
        localStorage.setItem('language', language);
        this.languageSubject.next(language);
        this.translateService.use(language);
    }
}