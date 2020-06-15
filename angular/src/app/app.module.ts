import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Monitoring } from './data/monitoring.model';
import { LayoutModule } from './layout/layout.module';
import { MonitoringService } from './services/monitoring/monitoring.service';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [AppRoutingModule, BrowserModule, LayoutModule, BrowserAnimationsModule],
  providers: [
    Monitoring,
    {
      provide: ErrorHandler,
      useClass: environment.production ? MonitoringService : ErrorHandler,
    },
  ],
})
export class AppModule {}
