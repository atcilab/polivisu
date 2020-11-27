import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
} from "@angular/core";
import { INavigationLink } from "../../models";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnDestroy {
  navLinks: INavigationLink[];
  subscriptions: Subscription[] = [];
  selected: number = 1;
  @Output("onSelect") onSelect: EventEmitter<number> = new EventEmitter();
  constructor(private _translate: TranslateService) {
    this.getTranslatedText();
    const translate$ = this._translate.onLangChange.subscribe((language) => {
      this.getTranslatedText();
    });
    this.subscriptions.push(translate$);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private getTranslatedText() {
    this.navLinks = [
      { to: "overview", text: "admin.menu.overview", id: 1 },
      { to: "users", text: "admin.menu.users", id: 2 },
      { to: "projects", text: "admin.menu.projects", id: 3 },
    ];
  }

  onComponentSelect(event: number) {
    this.onSelect.emit(event);
    this.selected = event;
  }
}
