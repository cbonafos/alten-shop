import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Routes } from "@angular/router";
import { CartDetailsComponent } from "./features/cart-details.component";

export const CART_ROUTES: Routes = [
	{
		path: "details",
		component: CartDetailsComponent,
	},
	{ path: "**", redirectTo: "details" },
];
