import { Component, OnInit, Input } from '@angular/core';

declare var $;

@Component({
  selector: 'card-repository',
  templateUrl: './card-repository.component.html',
  styleUrls: ['./card-repository.component.scss']
})
export class CardRepositoryComponent implements OnInit {
  
  @Input() repository;
  @Input() languageColor;
  
  constructor() { }
  
  ngOnInit() {
    $('.tooltipped').tooltip({
      position:'top',
      delay: 50
    });
}

  formatInMegabytes(number){
    number = number / 1024;
    let formatedNumber = number.toFixed(2) + ' MB';
    return formatedNumber;
  }
  
}
