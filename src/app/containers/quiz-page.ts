import 'rxjs/add/operator/let';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as quizActions from '../actions/quiz';
import { Album } from '../models/album';
import * as fromRoot from '../reducers';
// import { Book } from '../models/book';


@Component({
  selector: 'bc-quiz-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <md-card>
      <md-card-title>Can you guess an album's musical style by its cover?</md-card-title>
    </md-card>
    <div class="quiz-body">
      <div class="album">
        <md-card class="album-cover">
          <md-card-content>
            <img *ngIf="(isQuizCompleted | async) !== true" [src]="(currentAlbum | async).imageUrl">
            <div class="empty" *ngIf="(isQuizCompleted | async) === true"></div>
            <div class="overlay" *ngIf="(shouldDisplayAnswer | async) === true"
              (click)="nextQuestion()">
              <div *ngIf="(isCurrentAnswerCorrect | async) === true">Correct!</div>
              <div *ngIf="(isCurrentAnswerCorrect | async) === false">
                <div>Wrong!</div>
                <div>It's actually {{(currentAlbum | async).genres[0]}}</div>
              </div>
            </div>
            <div class="overlay" *ngIf="(isQuizCompleted | async) === true"
              (click)="reset()">
              <div>You got {{(results | async).correct}} out of {{(results | async).total}}</div>
            </div>
          </md-card-content>
        </md-card>
      </div>
      <div class="genre-buttons" *ngIf="(shouldDisplayAnswer | async) === false && (isQuizCompleted | async) === false">
        <button md-raised-button *ngFor="let genre of genres | async"
          (click)="selectAnswer(genre)">{{genre}}</button>
      </div>
    </div>
  `,
  /**
   * Container components are permitted to have just enough styles
   * to bring the view together. If the number of styles grow,
   * consider breaking them out into presentational
   * components.
   */
  styles: [`
    .quiz-body {
      margin-top: 30px;
    }
    .album {
      display:flex;
      justify-content: center;
    }
    img {
      max-width: 300px;
    }
    .album-cover {
      display: flex;
      justify-content: center;
      position: relative;
    }
    .album-cover .empty {
      height: 300px;
      width: 300px;
    }
    .overlay {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(255,255,255,0.7);
      display:flex;
      align-items: center;
      text-align: center;
      font-size: 36px;
      font-weight: bold;
      cursor: pointer;
    }
    .overlay.empty {
      width: 300px;
      height:300px;
    }
    .genre-buttons {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  `]
})
export class QuizPageComponent {
  public genres : Observable<string[]>;
  public currentAlbum : Observable<Album>;
  public shouldDisplayAnswer: Observable<boolean>;
  public isCurrentAnswerCorrect: Observable<boolean>
  public isQuizCompleted: Observable<boolean>
  public results: Observable<{}>
  constructor(private store: Store<fromRoot.State>) {
    this.genres = this.store.select(fromRoot.getQuizGenres);
    this.currentAlbum = this.store.select(fromRoot.getQuizCurrentAlbum);
    this.shouldDisplayAnswer = this.store.select(fromRoot.shouldQuizDisplayAnswer);
    this.isQuizCompleted = this.store.select(fromRoot.isQuizCompleted);
    this.isCurrentAnswerCorrect = this.store.select(fromRoot.isQuizCurrentAnswerCorrect);
    this.results = this.store.select(fromRoot.getQuizResults);
  }
  ngOnInit() {
    this.reset();
  }
  public reset() {
    this.store.dispatch(new quizActions.InitAction(10));
  }
  public selectAnswer(genre) {
    this.store.dispatch(new quizActions.AnswerAction(genre));
  }
  public nextQuestion() {
    this.store.dispatch(new quizActions.NextQuestionAction());
  }
}
