import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Translations } from '../../public-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private cache: Observable<Translations> | undefined = undefined;

  constructor(private requestService: RequestService) {}

  load(langId: string): Observable<Translations> {
    if (!this.cache) {
      this.cache = this.requestService.get<Translations>(`assets/translations.json`);
    }
    return this.cache;
  }
}
