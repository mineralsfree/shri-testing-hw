import userEvent from '@testing-library/user-event'
import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import {render, within, screen, waitFor, getByText, RenderResult} from "@testing-library/react";
import {BrowserRouter, MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";
import React from "react";
import '@testing-library/jest-dom'
import {act} from "react-dom/test-utils";
import {baseApiURl, bugParams, productMock, productsMock} from "../const/const";
import {Route, Switch} from "react-router";
import {Product} from "../../src/client/pages/Product";
import {CartState} from "../../src/common/types";
import axios, {AxiosResponse} from "axios";

const MockAdapter = require("axios-mock-adapter");

describe("Тестирование Каталога", () => {
    const mock = new MockAdapter(axios);
    mock.onGet(/.*\/api\/products\/0/).reply(200, productMock);
    mock.onGet(/.*\/api\/products$/).reply(200, productsMock);

    const mockAdapter = axios.defaults.adapter;


    beforeEach(() => {
        axios.defaults.adapter = mockAdapter;
    })

    const LOCAL_STORAGE_KEY = 'example-store-cart';
    const ITEM_IN_CART_TEXT = 'Item in cart';
    const ADD_TO_CART_TEXT = /add to cart/i;
    it('если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
        localStorage.clear();
        const user = userEvent.setup()
        const basename = '/hw/store';
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/catalog/0']}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </MemoryRouter>);
        })

        const addButton = await app.getByRole('button', {name: ADD_TO_CART_TEXT})
        await user.click(addButton);
        //на странице товара
        await app.getByText(ITEM_IN_CART_TEXT)

        const linksContainer = await app.getByTestId('navbar-nav');
        const catalogLink = await within(linksContainer).findByText('Catalog');
        await user.click(catalogLink);
        await waitFor(() => {
            if (!app.container.querySelector('.ProductItem')) {
                return Promise.reject();
            }
        })
        const card = await app.getAllByTestId('0')[0];
        //на странице каталога
        await within(card).findByText('Item in cart');
    })

    it('для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
        mock.restore();
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const {data: serverData} = await api.getProducts()
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/catalog']}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </MemoryRouter>);
        })
        await waitFor(() => {
            if (!app.container.querySelector('.ProductItem')) {
                return Promise.reject();
            }
        })
        const card = await app.getAllByTestId('0')[0];
        await within(card).findByText(serverData[0].name);
        await within(card).findByText(`$${serverData[0].price}`);
        const link = await within(card).findByRole('link')
        expect(link).toHaveAttribute('href', '/catalog/0')
        expect(serverData[0].name).toBeDefined();
        expect(serverData[0].price).toBeDefined();
        expect(serverData[0].id).toBeDefined();
    })

    it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка * * "добавить в корзину"', async () => {
        mock.restore()
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/catalog/0']}>
                    <Provider store={store}>
                        <Switch>
                            <Route path={'/catalog/:id'} component={Product}/>
                        </Switch>
                    </Provider>
                </MemoryRouter>);
        })
        await app.findByText(productMock.name);
        await app.findByText(productMock.description);
        await app.findByText(productMock.color);
        await app.findByText(`$${productMock.price}`);
        await app.findByText(productMock.material);
        await app.getByRole('button', {name: ADD_TO_CART_TEXT});
    })
    it('в каталоге должны отображаться товары, список которых приходит с сервера', async () => {
        const user = userEvent.setup()
        const basename = '/hw/store';
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <BrowserRouter basename={basename}>
                    <Provider store={store}>
                        <Application/>
                    </Provider>
                </BrowserRouter>);
        })
        const linksContainer = await app.getByTestId('navbar-nav');
        const catalogLink = await within(linksContainer).findByText('Catalog');
        await user.click(catalogLink);
        await waitFor(() => {
            if (!app.container.querySelector('.ProductItem')) {
                return Promise.reject();
            }
        })
        expect(app.container.querySelectorAll('.card-body').length).toBe(productsMock.length);
    })
    it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
        let myLocalStorage: { cart: CartState };
        const user = userEvent.setup()
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        jest.spyOn(cart, 'setState').mockImplementation((cart: CartState) => {
            myLocalStorage = {cart};
        })
        jest.spyOn(cart, 'getState').mockImplementation(() => ({}));
        const store = initStore(api, cart)
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/catalog/0']}>
                    <Provider store={store}>
                        <Route path={'/catalog/:id'} component={Product}/>
                    </Provider>
                </MemoryRouter>);
        })
        const addButton = await app.getByRole('button', {name: ADD_TO_CART_TEXT})
        await user.click(addButton);
        await user.click(addButton);
        expect(myLocalStorage.cart[0].count).toBe(2)
    })
})