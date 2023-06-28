import React from 'react';
import '@testing-library/jest-dom'

import {fireEvent, render, screen, within} from '@testing-library/react';
import {Application} from "../../src/client/Application";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import {cleanup} from '@testing-library/react'
import events from '@testing-library/user-event';

const basename = '/hw/store';

const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);


describe('Тестирование страницы приложения', () => {
    afterEach(cleanup);

    it('Название магазина в шапке должно быть ссылкой на главную страницу', async () => {
        const app = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>);

        const {findByText} = app;
        const link = await findByText('Example store');

        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/hw/store/')
    });
    it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async () => {
        const app = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>);
        const linksContainer = await app.getByTestId('navbar-nav');
        const links = await within(linksContainer).findAllByRole('link');
        expect(links.map(el => el.tagName)).toEqual(expect.arrayContaining(['A', 'A', 'A', 'A']));
        expect(links.map(el => el.innerHTML)).toEqual(expect.arrayContaining(['Catalog', 'Delivery', 'Contacts', 'Cart']));

    })


    // it('', async () => {
    //     // Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 1000})
    //     const app = render(
    //         <BrowserRouter basename={basename}>
    //             <Provider store={store}>
    //                 <Application/>
    //             </Provider>
    //         </BrowserRouter>);
    //
    //     fireEvent(window, new Event('resize'));
    //     const toggle = await app.getByRole('button', { name: /toggle navigation/i });
    //     const toggleStyles = window.getComputedStyle(toggle);
    //     console.log(toggleStyles.getPropertyValue('display'));
    //     expect(toggleStyles.getPropertyValue('display')).not.toBe('none');
    // })
    //


    // it('', async () => {
    //     const app = render(
    //         <BrowserRouter basename={basename}>
    //             <Provider store={store}>
    //                 <Application/>
    //             </Provider>
    //         </BrowserRouter>);
    //     const toggle = await app.getByRole('button', {name: /toggle navigation/i});
    //     await events.click(toggle);
    //     screen.logTestingPlaygroundURL();
    //
    //     const linksContainer = await app.getByTestId('navbar-nav');
    //     const link = await within(linksContainer).getAllByRole('link')[0];
    //     await events.click(link);
    //     const linksContainerStyles = getComputedStyle(linksContainer.parentElement);
    //     console.log(linksContainer.parentElement.getAttribute('class'));
    //     expect(linksContainer.parentElement).toHaveStyle('display: none');
    // })
});
