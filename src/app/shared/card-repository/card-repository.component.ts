import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-repository',
  templateUrl: './card-repository.component.html',
  styleUrls: ['./card-repository.component.scss']
})
export class CardRepositoryComponent implements OnInit {
  
  @Input() repository;
  
  constructor() { }
  
  ngOnInit() {}
  
  stringToRGB(str){
    if(str === null) return 'CACACA';

    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var c = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    
    return "00000".substring(0, 6 - c.length) + c;
  }

  formatInMegabytes(number){
    number = number / 1024;
    let formatedNumber = number.toFixed(2) + ' MB';
    return formatedNumber;
  }
  
}
