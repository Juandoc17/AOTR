import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { NavbarComponent } from './navbar/navbar.component';

import {DialogModule} from 'primeng/dialog';
import {CalendarModule} from 'primeng/calendar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VinsComponent } from './vins/vins.component';
import { DatingPipe } from '../pipes/dating.pipe';
import { VinDetailComponent } from './vin-detail/vin-detail.component';

import { SwiperModule, SwiperConfigInterface,
  SWIPER_CONFIG } from 'ngx-swiper-wrapper';

  const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
    observer: true,
    direction: 'horizontal',
    threshold: 50,
    spaceBetween: 5,
    slidesPerView: 1,
    centeredSlides: true
  };

@NgModule({
  declarations: [NavbarComponent, VinsComponent, DatingPipe, VinDetailComponent
    ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    CommonModule,
    PanelRoutingModule,
    DialogModule,
    CalendarModule
  ],
  providers: [
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    }
  ]
})
export class PanelModule { }
