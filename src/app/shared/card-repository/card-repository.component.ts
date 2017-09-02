import { Component, Input } from '@angular/core';

@Component({
  selector: 'card-repository',
  templateUrl: './card-repository.component.html',
  styleUrls: ['./card-repository.component.scss']
})
export class CardRepositoryComponent {
  
  @Input() repository;
  @Input() languageColor;
  
  constructor() { }

}
