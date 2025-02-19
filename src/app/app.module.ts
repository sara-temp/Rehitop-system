import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule, withEventReplay } from '@angular/platform-browser';

import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SystemModule } from "./system/system.module";
import { ManagerModule } from './manager/manager.module';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from '../mytheme';
import { FilterMatchMode } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SystemModule,
    ManagerModule
  ],
  providers: [
    provideHttpClient(withFetch()), importProvidersFrom(HttpClientModule), provideAnimationsAsync(),
    providePrimeNG(
      {
        theme: {
          preset: MyPreset,
        },
        // filterMatchModeOptions: {
        //   text: [FilterMatchMode.STARTS_WITH, FilterMatchMode.CONTAINS, FilterMatchMode.NOT_CONTAINS, FilterMatchMode.ENDS_WITH, FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS],
        //   numeric: [FilterMatchMode.EQUALS, FilterMatchMode.NOT_EQUALS, FilterMatchMode.LESS_THAN, FilterMatchMode.LESS_THAN_OR_EQUAL_TO, FilterMatchMode.GREATER_THAN, FilterMatchMode.GREATER_THAN_OR_EQUAL_TO],
        //   date: [FilterMatchMode.DATE_IS, FilterMatchMode.DATE_IS_NOT, FilterMatchMode.DATE_BEFORE, FilterMatchMode.DATE_AFTER]
        // },
        translation: {
          startsWith: 'מתחיל ב',
          contains: 'מכיל',
          notContains: 'לא מכיל',
          endsWith: 'מסתיים ב',
          equals: 'שווה ל',
          notEquals: 'לא שווה ל',
          noFilter: 'ללא סינון',
          lt: 'קטן מ',
          lte: 'קטן או שווה ל',
          gt: 'גדול מ',
          gte: 'גדול או שווה ל',
          is: 'הוא',
          isNot: 'אינו',
          before: 'לפני',
          after: 'אחרי',
          dateIs: 'התאריך הוא',
          dateIsNot: 'התאריך אינו',
          dateBefore: 'תאריך לפני',
          dateAfter: 'תאריך אחרי',
          clear: 'נקה',
          apply: 'החל',
          matchAll: 'התאם הכל',
          matchAny: 'התאם כל אחד',
          addRule: 'הוסף כלל',
          removeRule: 'הסר כלל',
          accept: 'אשר',
          reject: 'בטל',
          choose: 'בחר',
          upload: 'העלה',
          cancel: 'בטל',
          fileSizeTypes: ['בייט', 'קילובייט', 'מגהבייט', 'ג\'יגהבייט'],
          dayNames: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
          dayNamesShort: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'ש\''],
          dayNamesMin: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'],
          monthNames: ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'],
          monthNamesShort: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יוני', 'יולי', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'],
          dateFormat: 'dd/mm/yy',
          firstDayOfWeek: 0, // 0 = ראשון, 1 = שני וכו׳
          today: 'היום',
          weekHeader: 'שבוע',
          weak: 'חלש',
          medium: 'בינוני',
          strong: 'חזק',
          passwordPrompt: 'הזן סיסמה',
          emptyMessage: 'אין נתונים',
          emptyFilterMessage: 'אין נתונים מתאימים',
          fileChosenMessage: 'קובץ נבחר',
          noFileChosenMessage: 'לא נבחר קובץ',
          pending: 'ממתין',
          chooseYear: 'בחר שנה',
          chooseMonth: 'בחר חודש',
          chooseDate: 'בחר תאריך',
          prevDecade: 'עשור קודם',
          nextDecade: 'עשור הבא',
          prevYear: 'שנה קודמת',
          nextYear: 'שנה הבאה',
          prevMonth: 'חודש קודם',
          nextMonth: 'חודש הבא',
          prevHour: 'שעה קודמת',
          nextHour: 'שעה הבאה',
          prevMinute: 'דקה קודמת',
          nextMinute: 'דקה הבאה',
          prevSecond: 'שנייה קודמת',
          nextSecond: 'שנייה הבאה',
          am: 'לפנה״צ',
          pm: 'אחה״צ',
          searchMessage: 'תוצאות חיפוש עבור',
          selectionMessage: 'נבחרה',
          emptySelectionMessage: 'אין בחירה',
          emptySearchMessage: 'לא נמצאו תוצאות',
        }

      }
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
