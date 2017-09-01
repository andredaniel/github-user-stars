import { Component, OnInit, Pipe, HostListener, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import githubUsernameRegex from 'github-username-regex';
import { DOCUMENT } from "@angular/platform-browser";
import { HttpClient } from '@angular/common/http';

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
    private http: HttpClient,
    private router: Router
  ) {}

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
    this.router.navigate(['/' + username]);
  }

  fetchUserData(username: string): any {
    this.http.get('https://api.github.com/users/' + username)
    .subscribe(
      response => {
        this.user = response;
        this.fetchStars(username);
      },
      error =>  {

        this.repositories = [];
        this.languages = [];
        this.user = [];

        switch (error.status) {
          case 404:
            Materialize.toast('O usuário informado não existe.', 4000);
            break;

          case 403:
            Materialize.toast('Limite de uso da API excedido.', 4000);
            break;

          default:
          Materialize.toast(error.message, 4000);
          break;
        }
      }
    );
  }

  fetchStars(username: string, page: number = 1): any {
    this.http.get('https://api.github.com/users/' + username + '/starred?page=' + page)
    .subscribe(
      response => {

        let length = JSON.parse(JSON.stringify(response)).length;
        if(length === 0) {
          this.nothingToLoad = true;
          return;
        }

        if(page > 1) {
          this.repositories = this.repositories.concat(response);
          this.isFetchingMoreStars = false;
        } else {
          this.repositories = response;
          this.nothingToLoad = false;
        }
        this.populateLanguages();
        this.filterRepositories();
      },
      error =>  {
        console.log(error);
        Materialize.toast(error.message, 4000);
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

  public isFetchingMoreStars = false;
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

  fetchApiRatingLimits() {
    this.http.get('https://api.github.com/rate_limit')
    .subscribe(
      response => {
        this.apiRatingLimit = response;
      },
      error =>  {
        console.log(error);
        Materialize.toast(error.message, 4000);
      }
    );
  }
  
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {

      let username = params['username'] !== undefined ? params['username'] : '',
          usrenameTestStatus = githubUsernameRegex.test(username);

      if(usrenameTestStatus && username !== '') {
        this.inputUsername = username;
        this.fetchUserData(username);
        return;
      } else if( username !== '' ) {
        Materialize.toast('O usuário informado não é válido.', 4000);
      }
    });

    this.fetchApiRatingLimits();
    $('.dropdown-button').dropdown();
  }
}
