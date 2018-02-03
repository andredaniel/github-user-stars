import { Component, OnInit, Pipe, HostListener, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import githubUsernameRegex from 'github-username-regex';
import { DOCUMENT } from "@angular/platform-browser";
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// language colors
import { LanguageColors } from '../../json/language-colors';

declare var Materialize:any;
declare var $;

@Component({
  selector: 'app-star-gazers',
  templateUrl: './star-gazers.component.html',
  styleUrls: ['./star-gazers.component.scss']
})

export class StarGazersComponent implements OnInit {
  
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private activatedRoute: ActivatedRoute,
    private http: Http,
    private router: Router
  ) {
    router.events.subscribe(event => {
      
      let self = this;
      let username = activatedRoute.snapshot.params['username'];
      
      if(event instanceof NavigationEnd) {
        console.log('NavigationEnd');
        this.fetchApiRatingLimits().then(function(){

          if(username === undefined) {
            // clean data
            self.filteredRepositories = [];
            self.repositories = [];
            self.languages = [];
            self.user = [];
            return;
          }

          let usrenameTestStatus = githubUsernameRegex.test(username);

          if(usrenameTestStatus) {
            self.inputUsername = username;
            self.fetchUserData(username);
          } else if( username !== '' ) {
            Materialize.toast('O usuário informado não é válido.', 5000);
          }
        });
      }
    });
  }

  public languageColors = LanguageColors;
  public responsesPerRequest : number = 30;
  public selectedOrder = 'open_issues';
  public inputUsername = '';
  public user : any = [];
  public repositories : any = [];
  public filteredRepositories : any = [];
  public languages : any = [];
  public apiRatingLimit : any = [];
  public catchBadResponse : any = [];
  public currentPage : number = 1;
  public nothingToLoad = false;
  public isFetchingMoreStars = false;

  userExists() {
    return this.user.login !== undefined;
  }

  populateLanguages() {

    this.languages = {};
    let tempLanguages = [];

    this.repositories.forEach(repository => {

      let currentLanguage = repository.language != null ? repository.language : 'Outras',
          languageIndex = tempLanguages.indexOf(currentLanguage);

      if(languageIndex < 0) {
        tempLanguages.push(currentLanguage);
        this.languages[currentLanguage] = true;
      }
    });
  }

  toggleAllLanguagesState = true;

  toggleAllLanguages() {
    let languages = [];
    this.toggleAllLanguagesState = ! this.toggleAllLanguagesState;
    for (var key in this.languages) {
      languages[key] = this.toggleAllLanguagesState;
    }
    this.languages = languages;
    this.filterRepositories();
  }

  toggleLanguage(index) {
    this.languages[index] = ! this.languages[index];
    this.filterRepositories();
  }

  filterRepositories() {

    let repositories = [];

    this.repositories.forEach(repository => {
      let currentLanguage = repository.language != null ? repository.language : 'Outras';
      if(this.languages[currentLanguage]) {
        repositories.push(repository);
      }
    });

    this.filteredRepositories = repositories;
  }

  loadUserRoute(username: string): any {
    this.router.navigate(['/' + username], { relativeTo: this.activatedRoute });
  }

  fetchUserData(username: string): any {

    // Return if has no API limit
    if( ! this.checkApiLimitsAndNotify() ) return;

    // clean data
    this.filteredRepositories = [];
    this.repositories = [];
    this.languages = [];
    this.user = [];

    // do request
    this.http.get('https://api.github.com/users/' + username)
    .map(res => res.json())
    .subscribe(
      response => {
        console.log('fetchUserData');
        this.user = response;
        this.fetchStars(username);
      },
      error => {
        switch (error.status) {
          case 404:
            Materialize.toast('O usuário informado não existe.', 5000);
            break;

          case 403:
            Materialize.toast('Limite de uso da API excedido.', 5000);
            break;

          default:
            Materialize.toast(error.message, 5000);
          break;
        }
        this.fetchApiRatingLimits();
      }
    );
  }

  fetchStars(username: string, page: number = 1): any {

    // Return if has no API limit
    if( ! this.checkApiLimitsAndNotify() ) return;

    this.http.get('https://api.github.com/users/' + username + '/starred?page=' + page)
    .map(res => res.json())
    .subscribe(
      response => {
        console.log('fetchStars');

        let length = JSON.parse(JSON.stringify(response)).length;
        if(length === 0) {
          this.nothingToLoad = true;
          return;
        }

        if(page > 1) {
          this.repositories = this.repositories.concat(response);
        } else {
          this.repositories = response;
          this.nothingToLoad = false;
        }

        this.isFetchingMoreStars = false;
        this.populateLanguages();
        this.filterRepositories();
      },
      error =>  {
        console.log(error);
        Materialize.toast(error.message, 5000);
      }
    );
    
    // fetch api rating limits
    this.fetchApiRatingLimits();
  }

  fetchMoreStars() {
    this.currentPage++;
    let page = this.currentPage;
    this.fetchStars(this.user.login, page);
  }
 
  @HostListener('scroll', ['$event'])
  onScroll($event:Event):void {

    let pos = $event.srcElement.scrollTop + $event.srcElement.clientHeight,
        max = $event.srcElement.scrollHeight,
        offset = 100;
    if(
      pos > max - offset
      && ! this.isFetchingMoreStars
      && (this.repositories.length === 0 || this.repositories.length >= this.responsesPerRequest)
    ) {
      this.isFetchingMoreStars = true;
      this.fetchMoreStars();
    }
  }

  checkApiLimitsAndNotify() {
    if(this.apiRatingLimit.rate.remaining === 0){
      Materialize.toast('Você atingiu o limite máximo de uso da API. Aguarde um pouco.', 5000);
      return false;
    }
    return true;
  }

  fetchApiRatingLimits() : Promise <boolean> {
    let self = this;
    return new Promise<boolean>((resolve, reject) => {
      this.http.get('https://api.github.com/rate_limit')
      .map(res => res.json())
      .subscribe(
        response => {
          console.log('fetchApiRatingLimits');
          this.apiRatingLimit = response;
          resolve();
        },
        error =>  {
          console.log(error);
          Materialize.toast(error.message, 5000);
        }
      )
    })
  }
  
  ngOnInit() {
    $('.dropdown-button').dropdown();
  }
}
