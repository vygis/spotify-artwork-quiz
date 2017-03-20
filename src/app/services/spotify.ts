import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { QuizData } from '../quiz-data';
import { Album } from '../models/album';


@Injectable()
export class SpotifyService {
  private API_PATH: string = 'https://api.spotify.com/v1/recommendations';

  constructor(private http: Http) {}

  loadData(): Observable<any> {
    return Observable.create(observer => {
      observer.next(QuizData);
      setTimeout(() => observer.complete(), 1000)
    })
  }

  // retrieveBook(volumeId: string): Observable<Book> {
  //   return this.http.get(`${this.API_PATH}/${volumeId}`)
  //     .map(res => res.json());
  // }
}
