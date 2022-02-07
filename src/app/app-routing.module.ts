import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './Components/admin/admin.component';
import { AlfemoComponent } from './Components/alfemo/alfemo.component';
import { AllProductsComponent } from './Components/all-products/all-products.component';
import { BillOfLadingComponent } from './Components/bill-of-lading/bill-of-lading.component';
import { CatalogComponent } from './Components/catalog/catalog.component';
import { CommercialInnvoiceComponent } from './Components/commercial-innvoice/commercial-innvoice.component';
import { DealerProfileComponent } from './Components/dealer-profile/dealer-profile.component';
import { DealersComponent } from './Components/dealers/dealers.component';
import { DeclarationComponent } from './Components/declaration/declaration.component';
import { FrightPricesComponent } from './Components/fright-prices/fright-prices.component';
import { GeneralConformityCertificateComponent } from './Components/general-conformity-certificate/general-conformity-certificate.component';
import { HomeComponent } from './Components/home/home.component';
import { InvoicesComponent } from './Components/invoices/invoices.component';
import { ISFComponent } from './Components/isf/isf.component';
import { LogInComponent } from './Components/log-in/log-in.component';
import { MyPosComponent } from './Components/my-pos/my-pos.component';
import { NewPoComponent } from './Components/new-po/new-po.component';
import { NewPortComponent } from './Components/new-port/new-port.component';
import { PackingListComponent } from './Components/packing-list/packing-list.component';
import { PortsComponent } from './Components/ports/ports.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { TSCACertificationComponent } from './Components/tsca-certification/tsca-certification.component';
import { UsersComponent } from './Components/users/users.component';

const routes: Routes = [
  { path: 'LogIn', component: LogInComponent },
  { path: '', component: CatalogComponent },
  { path: 'CreatePO', component: NewPoComponent },
  { path: 'MyPos', component: MyPosComponent },
  { path: 'Admin', component: AdminComponent },
  { path: 'Alfemo', component: AlfemoComponent },
  { path: 'Catalog', component: CatalogComponent },
  { path: 'FrightPrices', component: FrightPricesComponent },
  { path: 'Dealers', component: DealersComponent },
  { path: 'DealerProfile/:DealerId', component: DealerProfileComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'NewPort', component: NewPortComponent },
  { path: 'Ports', component: PortsComponent },
  { path: 'Invoice', component: CommercialInnvoiceComponent },
  { path: 'Users', component: UsersComponent },
  { path: 'Products', component: AllProductsComponent },
  { path: 'BOL', component: BillOfLadingComponent },
  { path: 'Invoices', component: InvoicesComponent },
  { path: 'ISF', component: ISFComponent },
  { path: 'Packinglist', component: PackingListComponent },
  { path: 'Declaration', component: DeclarationComponent },
  { path: 'TSCA', component: TSCACertificationComponent },
  { path: 'GCC', component: GeneralConformityCertificateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
