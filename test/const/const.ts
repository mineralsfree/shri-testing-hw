import {CartState, Product, ProductShortInfo} from "../../src/common/types";

export const baseApiURl = 'http://localhost:3000/hw/store'
export const productsMock: ProductShortInfo[] = [
    {
        "id": 0,
        "name": "Awesome Mouse",
        "price": 271
    },
    {
        "id": 1,
        "name": "Awesome Table",
        "price": 132
    },
    {
        "id": 2,
        "name": "Refined Shoes",
        "price": 289
    }
]
// @ts-ignore
export const productMock: Product = {
    color: "plum",
    description: "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
    id: 0,
    material: "Plastic",
    name: "Refined Sausages",
    price: 999
}
export const filledCart: CartState = {
    "0": {"name": "Gorgeous Hat", "count": 4, "price": 68},
    "1": {"name": "Unbranded Bacon", "count": 5, "price": 705},
    "2": {"name": "Licensed Mouse", "count": 6, "price": 61}
}
const bugObj = process.env.BUG_ID ? {'bug_id': process.env.BUG_ID} : null;
export const bugParams = bugObj ? '?' + new URLSearchParams(bugObj).toString() : ''