import {Component, OnInit} from '@angular/core';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegUserService} from './reg-user.service';
import {Token} from '../../global/login/token.model';
import {LoginStatusService} from '../../global/login/login.status.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';
import {NgForm} from '@angular/forms';
import {LoginService} from '../../global/login/login.service';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {Movie} from '../../global/models/movie.model';
import {MovieService} from '../../global/movie/movie.service';
import {Review} from '../../global/models/review.model';
import {Observable} from 'rxjs/Observable';
import {UserFile} from '../../global/models/userFile.model';

class Profile {
  name: string;
  profileId: number;
  profileImage: string;
  biography: string;
  isCritic: boolean;
  username: string;
  email: string;
  registeredDate: string;
}

@Component({
  selector: 'app-reg-user',
  templateUrl: './reg-user.component.html',
  styleUrls: ['./reg-user.component.scss'],
  providers: [RegUserService, LoginService]
})
export class RegUserComponent implements OnInit {
  tpRegisteredDate:string;
  currentIndex = 1;
  closeReason: string;
  profile = new Profile();
  tokenHelper = new JwtHelperService();
  profile_url: string;
  oldPassword: string;
  newPassword: string;
  changePasswordSuccess: boolean;
  changePasswordFailure: boolean;
  whishlistMovies: Movie[];
  watchlistMovies: Movie[];
  whishlistTvs: Movie[];
  watchlistTvs: Movie[];
  ratedMovieList: Movie[];
  reviews: Review[];
  followerProfiles: UserFile[];
  followYouProfiles: UserFile[];
  indexs: number;
  constructor(private router: Router,
              private movieService: MovieService,
              private loginService: LoginService,
              private modalService: NgbModal,
              private regUserService: RegUserService,
              private loginStatusService: LoginStatusService,
              private toastr: ToastrService) {
  }

  showDiv(index) {
    this.currentIndex = index;
    console.log(this.currentIndex);
  }

  ngOnInit() {
    this.loadPosters();
    this.indexs = 0;


    if (this.loginStatusService.getTokenDetails() !== null) {
      this.loginStatusService.changeStatus(true);
      this.getWishlist();
      this.getWatchlist();
      this.getRatedMovieList();
      this.getReviews();
      this.getFollowers();
      this.getFollowYou();
      this.regUserService.getProfile().subscribe(profileDetails => {
        console.log(profileDetails);
        this.profile = profileDetails as Profile;
        const decodedToken = this.tokenHelper.decodeToken(localStorage.getItem('token'));
        this.profile.email = decodedToken['email'];
        this.profile.profileId = decodedToken['profileId'];
        this.profile.username = decodedToken['username'];
        this.profile.profileImage = profileDetails['profileImage'];
        this.profile.registeredDate = profileDetails['registeredDate'];

        if (this.profile.profileImage === undefined) {
          this.profile_url = 'http://localhost:8080/user/avatar/default.jpeg';
        } else {
          this.profile_url = 'http://localhost:8080/user/avatar/' + profileDetails['profileImage'];
        }
      });
    }
  }
  setImdbId(imdbId: string) {
    this.movieService.setSelectedMovieId(imdbId);
  }
  deleteUser() {
    if (confirm('Are you sure to DELETE your account?')) {
      this.regUserService.deleteUser().subscribe(data => {
        this.loginService.logout();
        return true;
      },
        error => {
          console.error('Error deleting the account');
          return Observable.throw(error);
        });
    }
  }
  deleteReview(imbdId: string, review: Review) {
    if (confirm('Want to delete review of ' + review.movieTitle)) {
      console.log('deleting: review of ' + review.movieTitle);
      this.regUserService.deleteReview(imbdId, review.reviewId).subscribe(
        data => {
          // refresh the list
          this.getReviews();
          this.toastr.success('Success');
          return true;
        },
        error => {
          console.error('Error deleting review of ' + review.movieTitle);
          this.toastr.error('Failed to delete review');
          return Observable.throw(error);
        }
      );
      console.log('deleted');
    }
  }
  editReview(imbdId: string, review: Review) {
    if (confirm('Want to edit review of ' + review.movieTitle)) {
      console.log('editing: review of ' + review.movieTitle);
      this.regUserService.editReview(imbdId, review).subscribe(
        data => {
          // refresh the list
          this.getReviews();
          this.toastr.success('Success');
          return true;
        },
        error => {
          console.error('Error edit review of ' + review.movieTitle);
          this.toastr.error('Failed to edit review');
          return Observable.throw(error);
        }
      );
      console.log('edited');
    }
  }
  getReviews(): any {
    this.regUserService.getReviews()
      .subscribe(
        data => {
          this.reviews = data as Review[];
          console.log(this.reviews);
        },
        error => console.log('Failed to fetch movies playing')
      );
  }
  getFollowers(): any {
    this.regUserService.getFollowers()
      .subscribe(
        data => {
          this.followerProfiles = data as UserFile[];
          console.log(this.followerProfiles);
        },
        error => console.log('Failed to fetch movies playing')
      );
  }
  getFollowYou(): any {
    this.regUserService.getFollowYou()
      .subscribe(
        data => {
          this.followYouProfiles = data as UserFile[];
          console.log(this.followYouProfiles);
        },
        error => console.log('Failed to fetch movies playing')
      );
  }
  getRatedMovieList(): any {
    this.regUserService.getRatedMovieList()
      .subscribe(
        data => {
          this.ratedMovieList = data as Movie[];
          console.log(this.ratedMovieList);
        },
        error => console.log('Failed to fetch movies playing')
      );
  }
  getWishlist(): any {
    this.regUserService.getWishlistMovies()
      .subscribe(
        data => {
          this.whishlistMovies = data as Movie[];
          console.log(this.whishlistMovies);
        },
        error => console.log('Failed to fetch movies playing')
      );

    this.regUserService.getWishlistTvs()
      .subscribe(
        data => {
          this.whishlistTvs = data as Movie[];
          console.log(this.whishlistTvs);
        },
        error => console.log('Failed to fetch movies playing')
      );
  }
  getWatchlist(): any {
    this.regUserService.getWatchlistMovies()
      .subscribe(
        data => {
          this.watchlistMovies = data as Movie[];
          console.log(this.watchlistMovies);
        },
        error => console.log('Failed to fetch movies playing')
      );
    this.regUserService.getWatchlistTvs()
      .subscribe(
        data => {
          this.watchlistTvs = data as Movie[];
          console.log(this.watchlistTvs);
        },
        error => console.log('Failed to fetch movies playing')
      );
  }
  updateProfile() {
    this.tpRegisteredDate = this.profile.registeredDate;
    this.profile.registeredDate = null;
    this.regUserService.update(this.profile).subscribe(data => {
      this.toastr.success('Success');
    }, error => {
      this.toastr.error('Failed to update profile');
    });
    this.profile.registeredDate = this.tpRegisteredDate;
  }

  open(content) {
    this.modalService.open(content).result.then(result => {
      this.closeReason = `Reason ${result}`;
    }, (reason) => {
      this.closeReason = `Dismissed ${this.getDissmissReason(reason)}`;
    });
  }

  getDissmissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing escape';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking x';
    } else {
      return `With ${reason}`;
    }
  }

  upload(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      const user = JSON.parse(localStorage.getItem('credential')) as Token;
      formData.append('file', file, file.name);
      formData.append('userId', user.id.toString());

      this.regUserService.upload(formData).subscribe(data => {
        this.router.navigateByUrl('/user');
      }, error => {
        this.toastr.success('Failure');
        console.log(error);
      });
    }
  }

  changePassword(form: NgForm) {
    this.regUserService.changePassword(this.oldPassword, this.newPassword).subscribe(result => {
      if (result['success'] === true) {
        form.resetForm();
        this.changePasswordSuccess = true;
        this.toastr.success('Success');
        this.loginService.logout();
        this.router.navigateByUrl('/home');
      } else {
        this.changePasswordFailure = true;
        console.log('fail to cahnge the password');
        this.toastr.error('Failed to change the password, make sure you passwords are correct');
        form.resetForm();
      }
    });
  }
  loadPosters(): void {
    const movieNames = ['Blade Runner 2049', 'Coco', 'Call Me By Your Name', 'Lady Bird', 'Get Out', 'Dunkirk', 'In the Fade', 'Phantom Thread'];

    const images = ['https://images-na.ssl-images-amazon.com/images/M/MV5BNzA1Njg4NzYxOV5BMl5BanBnXkFtZTgwODk5NjU3MzI@._V1_SX300.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BYjQ5NjM0Y2YtNjZkNC00ZDhkLWJjMWItN2QyNzFkMDE3ZjAxXkEyXkFqcGdeQXVyODIxMzk5NjA@._V1_SX300.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BNDk3NTEwNjc0MV5BMl5BanBnXkFtZTgwNzYxNTMwMzI@._V1_SX300.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BODhkZGE0NDQtZDc0Zi00YmQ4LWJiNmUtYTY1OGM1ODRmNGVkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUxMjEzNzE1NF5BMl5BanBnXkFtZTgwNDYwNjUzMTI@.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BNjA4MzEzOTc0N15BMl5BanBnXkFtZTgwOTcyNDY4MjI@.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTYwNDI5Njg2M15BMl5BanBnXkFtZTgwMzIyNTYxNDM@.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BOTE5MzkwMjM0NV5BMl5BanBnXkFtZTgwMTQ0Mjk0NDM@.jpg',
    ];

    const imageContainers: NodeListOf<Element> = document.getElementsByClassName('l-cards__image');
    const movieTitles: NodeListOf<Element> = document.getElementsByClassName('l-cards__text');

    let i = 0, y = 0;
    while (i < movieTitles.length) {
      // create img element and append to container
      const img = document.createElement('img');
      img.setAttribute('src', images[y]);
      img.setAttribute('alt', movieNames[y]);
      img.style.height = '16em';
      imageContainers[i].appendChild(img);

      // create span and append movie names and ratings
      const ratings = document.createElement('p');
      ratings.style.color = 'rgb(229, 9, 20)';
      ratings.innerHTML = '4.9/5.0';

      movieTitles[i].innerHTML = movieNames[y];
      movieTitles[i].appendChild(ratings);
      // movieTitles[i].style.fontSize = '2em';

      i++;
      y++;
      if (y == 4) { y = 0; }
    }

  }
}
