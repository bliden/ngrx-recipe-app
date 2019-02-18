import { Component, OnInit, OnDestroy } from "@angular/core";
import { AppState } from "../state";
import { Store, select } from "@ngrx/store";
import {
  selectCurrentRecipe,
  selectRecipeLoader
} from "../state/recipe.selector";
import { Subscription, Observable, Subject } from "rxjs";
import { Recipe } from "@app/models/recipe";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-selected-recipe",
  templateUrl: "./selected-recipe.component.html",
  styleUrls: ["./selected-recipe.component.scss"]
})
export class SelectedRecipeComponent implements OnInit, OnDestroy {
  selectedRecipe: Recipe;
  loading$: Observable<boolean>;
  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const recipe$ = this.store
      // .select(selectCurrentRecipe)
      // .pipe(tap(console.log))
      .pipe(
        select(selectCurrentRecipe),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(val => (this.selectedRecipe = val));

    this.loading$ = this.store.select(selectRecipeLoader);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
