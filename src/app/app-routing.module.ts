import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Views components
import { StarGazersComponent } from './views/star-gazers/star-gazers.component';

const routes: Routes = [
  {
    path: '',
    component: StarGazersComponent,
  },
  {
    path: ':username',
    component: StarGazersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
