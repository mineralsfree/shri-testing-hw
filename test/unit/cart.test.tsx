import {CartApi, ExampleApi} from "../../src/client/api";
import {baseApiURl, filledCart} from "../const/const";
import {initStore} from "../../src/client/store";
import {render, RenderResult, screen} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import '@testing-library/jest-dom'
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Route} from "react-router";
import React from "react";
import {Cart} from "../../src/client/pages/Cart";
import userEvent from "@testing-library/user-event";
import {CartItem, CartState} from "../../src/common/types";
import {Application} from "../../src/client/Application";
import {phone} from "faker";
import axios from "axios";
import events from "@testing-library/user-event";

describe('Корзина', () => {
    const CLEAR_CART_BUTTON_TEXT = 'Clear shopping cart'
    it('если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        jest.spyOn(cart, 'getState').mockImplementation(() => {
            return {};
        })
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/cart']}>
                    <Provider store={store}>
                        <Route path={'/cart'} component={Cart}/>
                    </Provider>
                </MemoryRouter>);
        })
        const link = await app.findByRole('link');
        expect(link).toHaveAttribute('href', '/catalog');
    })
    it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        let newCartState;
        jest.spyOn(cart, 'getState').mockImplementation(() => {
            return filledCart;
        })
        jest.spyOn(cart, 'setState').mockImplementation((cart: CartState) => {
            newCartState = cart;
        })
        const user = userEvent.setup()

        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/cart']}>
                    <Provider store={store}>
                        <Route path={'/cart'} component={Cart}/>
                    </Provider>
                </MemoryRouter>);
        })
        const button = await app.findByText(CLEAR_CART_BUTTON_TEXT);
        await user.click(button);
        expect(newCartState).toEqual({});
    })
    it('для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async () => {
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        jest.spyOn(cart, 'getState').mockImplementation(() => {
            return filledCart;
        })
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/cart']}>
                    <Provider store={store}>
                        <Route path={'/cart'} component={Cart}/>
                    </Provider>
                </MemoryRouter>);
        })
        let sum = 0;
        for (const cartItem of Object.values(filledCart)) {
            await Promise.all([
                app.findByText(cartItem.name),
                app.findByText(`$${cartItem.price}`),
                app.findByText(cartItem.count),
            ])
            sum += cartItem.count;
        }
        app.findByText(`$${sum}`);
    })
    it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        jest.spyOn(cart, 'getState').mockImplementation(() => {
            return filledCart;
        })
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </MemoryRouter>
            );
        })
        const cartLink = await app.findByTestId('header-cart-link');
        expect(cartLink.innerHTML).toContain('(3)');
        // screen.logTestingPlaygroundURL();

    })
    it('Пользователь может офомрмить заказ, вводя свои данные', async () => {
        const api = new ExampleApi(baseApiURl);
        const cartApi = new CartApi();
        let spy = jest.spyOn(api, "checkout");

        jest.spyOn(cartApi, 'getState').mockImplementation(() => {
            return filledCart;
        })
        const user = userEvent.setup()

        const store = initStore(api, cartApi)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/cart']}>
                    <Provider store={store}>
                        <Route path={'/cart'} component={Cart}/>
                    </Provider>
                </MemoryRouter>
            );
        })

        const phoneInput = await app.getByTestId('f-phone') as HTMLInputElement;
        const addressInput = await app.getByTestId('f-address');
        const nameInput = await app.getByTestId('f-name');
        await user.type(nameInput, 'Grzegorz Brzęczyszczykiewicz');
        await user.type(phoneInput, '1231231231');
        await user.type(addressInput, 'al. Jana Pawla II');
        const submitButton = await app.findByTestId('Form-Submit');
        await user.click(submitButton);
        expect(spy).toHaveBeenCalled();
    })
})