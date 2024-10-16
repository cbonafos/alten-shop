import { Injectable, inject, signal } from "@angular/core";
import { Product } from "./product.model";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ProductsService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = "http://localhost:5031/api/products";
   
    private readonly _products = signal<Product[]>([]);
    public readonly products = this._products.asReadonly();

    public get(): Observable<Product[]> {
        return this.http.get<Product[]>(this.baseUrl).pipe(
            tap((products) => this._products.set(products)),
        );
    }

    public create(product: Product): Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl, product).pipe(
            tap(() => this._products.update(products => [product, ...products])),
        );
    }

    public update(product: Product): Observable<boolean> {
        return this.http.patch<boolean>(`${this.baseUrl}/${product.id}`, product).pipe(
            tap(() => this._products.update(products => {
                return products.map(p => p.id === product.id ? product : p)
            })),
        );
    }

    public delete(productId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}/${productId}`).pipe(
            tap(() => this._products.update(products => products.filter(product => product.id !== productId))),
        );
    }
}