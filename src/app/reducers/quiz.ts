import { createSelector } from 'reselect';
import * as _ from 'lodash';
import { Album } from '../models/album';
import { Answer } from '../models/answer';
import * as quiz from '../actions/quiz';
// import * as collection from '../actions/collection';


export interface State {
  currentAlbumIndex: number;
  answers: Answer[];
  albums: Album[];
  genres: string[];
  displayAnswer: boolean;
};

export function reducer(state, action: quiz.Actions): State {
  switch (action.type) {
    case quiz.ActionTypes.LOAD:
      return {
        answers: [],
        currentAlbumIndex: 0,
        albums: action.payload.albums,
        genres: action.payload.genres,
        displayAnswer: false
      };
    case quiz.ActionTypes.ANSWER:
      return Object.assign({}, state, {
        answers: [...state.answers, {
          album: state.albums[state.currentAlbumIndex],
          genre: action.payload
        }],
        displayAnswer: true
      })
    case quiz.ActionTypes.NEXT_QUESTION:
      return Object.assign({}, state, {
        displayAnswer: false,
        currentAlbumIndex: state.currentAlbumIndex == state.albums.length-1 ? -1 : state.currentAlbumIndex + 1
      })

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getGenres = (state: State) => {
  return state && state.currentAlbumIndex > -1 && state.genres
    && _.chain(_.range(5))
      .reduce(selectedGenres => {
        selectedGenres.push(_.sample(state.genres.filter(genre => !selectedGenres.includes(genre))));
        return selectedGenres
      }, [state.albums[state.currentAlbumIndex].genres[0]])
      .shuffle()
      .value();
}

export const getCurrentAlbum = (state: State) => {
  return state.albums[state.currentAlbumIndex];
};

export const shouldDisplayAnswer = (state: State) => state.displayAnswer;

export const isCurrentAnswerCorrect = (state: State) => {
  const currentAnswer = state.answers[state.currentAlbumIndex];
  return currentAnswer && currentAnswer.album.genres.includes(currentAnswer.genre);
}

export const isCompleted = (state: State) => {
  return state.currentAlbumIndex === -1;
}

export const getResults = (state: State) => {
  return {
    correct: state.answers.reduce((total, answer) => total + (answer.album.genres.includes(answer.genre) ? 1 : 0), 0),
    total: state.answers.length
  }
}