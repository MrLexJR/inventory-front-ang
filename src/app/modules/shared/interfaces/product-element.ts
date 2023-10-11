import { CategoryElement } from "./category-element";

export interface ProductElement {
    id: number;
    name: string;
    price: number;
    account: number;
    category: CategoryElement;
    picture: any;
}
