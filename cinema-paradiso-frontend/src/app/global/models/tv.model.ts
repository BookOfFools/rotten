import {Celebrity} from './celebrity.model';
import {Trailer} from './trailer.model';
import {Review} from './review.model';

export class TV {
  imdbId: string;
  title: string;
  year: number;
  rated: string;
  releaseDate: Date;
  genres: string[];
  awards: string[];
  photos: string[];
  director: string[];
  cast: string[];
  trailers: string[];
  reviews: Review[];
  plot: string;
  language: string;
  country: string;
  poster: string;
  rating: number;
  production: string;
  website: string;
  numberOfRatings: number;
  duration: number;
  totalSeasons: number;
  audienceRating: number;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
