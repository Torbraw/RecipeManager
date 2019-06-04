import {BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { DetailComponent } from './detail/detail.component';
import {FormsModule} from '@angular/forms';
import { DynamicComponent } from './dynamic/dynamic.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EditdialogComponent } from './editdialog/editdialog.component';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import { EditComponent } from './edit/edit.component';
import { ErrorComponent } from './error/error.component';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxPaginationModule } from 'ngx-pagination';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {AuthGuard} from './services/auth.guard';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AngularFirestore} from '@angular/fire/firestore';
import { ListpubliqueComponent } from './listpublique/listpublique.component';
import { DetailpubliqueComponent } from './detailpublique/detailpublique.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ListComponent,
    CreateComponent,
    DetailComponent,
    DynamicComponent,
    EditdialogComponent,
    EditComponent,
    ErrorComponent,
    LoginComponent,
    ListpubliqueComponent,
    DetailpubliqueComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxPaginationModule,
    AngularFireModule.initializeApp(environment.firebase),
    BrowserAnimationsModule,
    FormsModule,
    MatDialogModule,
    AngularFireAuthModule,
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: '/login', pathMatch: 'full' }, //  Route par défaut, redirige page
      { path: 'index', component: ListComponent,  canActivate: [AuthGuard] },
      { path: 'error', component: ErrorComponent,  canActivate: [AuthGuard] },
      { path: 'create', component: CreateComponent, runGuardsAndResolvers: 'always',  canActivate: [AuthGuard] },
      { path: 'detail/:recette', component: DetailComponent,  canActivate: [AuthGuard] },
      { path: 'detailpublic/:recette', component: DetailpubliqueComponent,  canActivate: [AuthGuard] },
      { path: 'edit/:recette', component: EditComponent,  canActivate: [AuthGuard] },
      { path: 'public', component: ListpubliqueComponent,  canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: '**', component: ErrorComponent}
    ], {onSameUrlNavigation: 'reload'})
  ],
  providers: [AngularFirestore],
  entryComponents: [DynamicComponent, EditdialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

