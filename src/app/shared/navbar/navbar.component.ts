import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import githubUsernameRegex from 'github-username-regex';

declare var Materialize:any;
declare var $;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  
  constructor() { }
  
  @Input() api: any;
  @Input() username: string;
  @Input() sortListBy: any;
  @Input() filterLanguages: any;
  @Output() sortListByChange = new EventEmitter<string>();
  @Output() usernameChange = new EventEmitter<string>();
  
  changeSortListBy(newSortListBy) {
    this.sortListBy = newSortListBy;
    this.sortListByChange.emit(newSortListBy);
  }

  changeUsername(username) {
    let usrenameTestStatus = githubUsernameRegex.test(username);
    if(usrenameTestStatus) {
      this.usernameChange.emit(username);
      this.username = username;
      return;
    }
    Materialize.toast('Digite um nome de usuário válido.', 4000);
  }

  updateApiRemainingPercentage() {
    if(this.api.rate === undefined) return 0;
    let remaining = ( this.api.rate.remaining * 100 ) / this.api.rate.limit;
    return remaining.toFixed(1);
  }
  
  ngOnInit() {}
  
}
