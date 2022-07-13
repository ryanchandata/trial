import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './partials/header/header.component';
import { FooterComponent } from './partials/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ErrorComponent } from './pages/error/error.component';
import { SurveyLibraryModule } from './survey-library/survey-library.module';
import { JwtModule, JwtHelperService, JwtInterceptor } from '@auth0/angular-jwt';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';

export function jwtTokenGetter(): string
{
  return localStorage.getItem('id_token');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SurveyLibraryModule,
    FlashMessagesModule.forRoot(),
    NgxPageScrollModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: jwtTokenGetter
      }
    })
  ],
  providers: [FlashMessagesService, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
