import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Components/admin/admin.component';
import { AlfemoComponent } from './Components/alfemo/alfemo.component';
import { CatalogComponent } from './Components/catalog/catalog.component';
import { HomeComponent } from './Components/home/home.component';
import { LogInComponent } from './Components/log-in/log-in.component';
import { MyPosComponent } from './Components/my-pos/my-pos.component';
import { NewPoComponent } from './Components/new-po/new-po.component';

const routes: Routes = [
  {path:'LogIn',component:LogInComponent},
  {path:'', component:HomeComponent},
  {path:'CreatePO', component:NewPoComponent},
  {path:'MyPos', component:MyPosComponent},
  {path:'Admin', component:AdminComponent},
  {path:'Alfemo', component:AlfemoComponent},
  {path:'Catalog', component: CatalogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
