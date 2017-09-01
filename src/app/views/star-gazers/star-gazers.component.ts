import { Component, OnInit, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import githubUsernameRegex from 'github-username-regex';

declare var Materialize:any;
declare var $;

@Component({
  selector: 'app-star-gazers',
  templateUrl: './star-gazers.component.html',
  styleUrls: ['./star-gazers.component.scss']
})

export class StarGazersComponent implements OnInit {
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}
  
  public selectedOrder = 'open_issues';
  public inputUsername = '';
  public user : any = [];
  public repositories : any = [];
  public filteredRepositories : any = [];
  public languages : any = [];
  public apiRatingLimit : any = [];
  public catchBadResponse : any = [];

  userExists() {
    return this.user.login !== undefined;
  }
  
  populateLanguages() {

    let tempLanguages = [];

    this.repositories.forEach(repository => {

      let currentLanguage = repository.language != null ? repository.language : 'Outras',
          languageIndex = tempLanguages.indexOf(currentLanguage);

      if(languageIndex < 0) {
        tempLanguages.push(currentLanguage);
        this.languages.push({
          name: currentLanguage,
          selected: true
        });
      }
    });
  }

  toggleAllLanguagesState = true;

  toggleAllLanguages() {

    let languages = [];
    this.toggleAllLanguagesState = ! this.toggleAllLanguagesState;

    this.languages.forEach((language, key) => {
      let item = {
        name: language.name,
        selected: this.toggleAllLanguagesState
      }
      languages.push(item);
    });

    this.languages = languages;
  }

  toggleLanguage(index) {
    this.languages[index].selected = ! this.languages[index].selected;
  }

  filterRepositories() {

    let repositories = [],
        languages = [];

    this.languages.forEach(language => {
      if(language.selected){
        languages.push(language.name);
      }
    });

    this.repositories.forEach(repository => {
      let currentLanguage = repository.language != null ? repository.language : 'Outras',
          index = languages.indexOf(currentLanguage);
      if(index >= 0) {
        repositories.push(repository);
      }
    });

    this.filteredRepositories = repositories;
    return this.filteredRepositories;
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

  fetchStars(username: string): any {

    this.languages = [];

    this.http.get('https://api.github.com/users/' + username + '/starred')
    .subscribe(
      response => {
        this.repositories = response;
        this.populateLanguages();
      },
      error =>  {
        console.log(error);
        Materialize.toast(error.message, 4000);
      }
    );
    
    // fatch api rating limits
    this.fetchApiRatingLimits();
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
