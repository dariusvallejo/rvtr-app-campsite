import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { EditAccountComponent } from './edit-account/edit-account.component';


const routes: Routes = [
  { component: AccountComponent, path: ':id' },
  { component : EditAccountComponent, path:'editaccount/:id'}
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)],
})
export class AccountRoutingModule {}
