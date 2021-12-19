import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Components/admin/admin.component';
import { AlfemoComponent } from './Components/alfemo/alfemo.component';
import { CatalogComponent } from './Components/catalog/catalog.component';
import { CommercialInnvoiceComponent } from './Components/commercial-innvoice/commercial-innvoice.component';
import { DealerProfileComponent } from './Components/dealer-profile/dealer-profile.component';
import { DealersComponent } from './Components/dealers/dealers.component';
import { FrightPricesComponent } from './Components/fright-prices/fright-prices.component';
import { HomeComponent } from './Components/home/home.component';
import { LogInComponent } from './Components/log-in/log-in.component';
import { MyPosComponent } from './Components/my-pos/my-pos.component';
import { NewPoComponent } from './Components/new-po/new-po.component';
import { NewPortComponent } from './Components/new-port/new-port.component';
import { PortsComponent } from './Components/ports/ports.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { UsersComponent } from './Components/users/users.component';

const routes: Routes = [
  {path:'LogIn',component:LogInComponent},
  {path:'', component:CatalogComponent},
  {path:'CreatePO', component:NewPoComponent},
  {path:'MyPos', component:MyPosComponent},
  {path:'Admin', component:AdminComponent},
  {path:'Alfemo', component:AlfemoComponent},
  {path:'Catalog', component: CatalogComponent},
  {path:'FrightPrices', component: FrightPricesComponent},
  {path:'Dealers', component: DealersComponent},
  {path: 'DealerProfile/:DealerId', component: DealerProfileComponent},
  {path: 'reports', component: ReportsComponent},
  {path: 'NewPort', component: NewPortComponent},
  {path: 'Ports', component: PortsComponent},
  {path: 'Invoice', component: CommercialInnvoiceComponent},
  {path: 'Users', component: UsersComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
