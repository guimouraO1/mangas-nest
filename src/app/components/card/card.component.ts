import { CommonModule, registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { Component, input, OnInit } from '@angular/core';
registerLocaleData(localePT);

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.getWeekdayAbbreviated(this.data));
  }
  manga: any = input();
  data = new Date();
  weekdayNames = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

  getWeekdayAbbreviated(date: Date): string {
    return this.weekdayNames[date.getDay()];
  }
}
