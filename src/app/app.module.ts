import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { JwtModule} from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';


//This function injects automatically the autorizathion header to the HTTP requests.
//WhitelistDomains array needs to be filled with the URL to allow this process
export function tokenGetter() {
  return localStorage.getItem("access_token_aot");
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['https://aot-generic.herokuapp.com']
      }
    })
  ],
  providers: [
    AuthGuardService, AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
