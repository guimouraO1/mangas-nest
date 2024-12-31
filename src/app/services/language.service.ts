import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Languages } from '../models/language.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
    
    private languageSubject = new BehaviorSubject<Languages>('en');
    language$ = this.languageSubject.asObservable();
    translateService =  inject(TranslateService);

    initialize(): void {
        this.translateService.addLangs(['pt-br', 'en']);
        this.translateService.setDefaultLang('en');

        const language: Languages = localStorage.getItem('lg') as Languages;

        if(language && language === 'pt-br' || language === 'en') {
            this.translateService.use(language);
            this.setLanguage(language);
        };
      }

    getLanguageObserver(): Observable<string> {
        return this.language$;
    }
    
    setLanguage(language: Languages) {
        this.languageSubject.next(language);
    }
}
