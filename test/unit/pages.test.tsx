import {cleanup, render, screen, within} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Application} from "../../src/client/Application";

import React from "react";
import {CartApi, ExampleApi} from "../../src/client/api";
import {initStore} from "../../src/client/store";
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import {baseApiURl} from "../const/const";

describe('Страницы', () => {
    afterEach(cleanup);
    beforeEach(cleanup)
    it('Cтраницы главная, условия доставки, контакты должны иметь статическое содержимое', async () => {
        const basename = '/hw/store';

        const staticContactContent = ['Contacts',
            'Ut non consequatur aperiam ex dolores. Voluptatum harum consequatur est totam. Aut voluptatum aliquid aut optio et ea. Quaerat et eligendi minus quasi. Culpa voluptatem voluptatem dolores molestiae aut quos iure. Repellat aperiam ut aliquam iure. Veritatis magnam quisquam et dolorum recusandae aut.',
            'Molestias inventore illum architecto placeat molestias ipsam facilis ab quo. Rem dolore cum qui est reprehenderit assumenda voluptatem nisi ipsa. Unde libero quidem. Excepturi maiores vel quia. Neque facilis nobis minus veniam id. Eum cum eveniet accusantium molestias voluptas aut totam laborum aut. Ea molestiae ullam et. Quis ea ipsa culpa eligendi ab sit ea error suscipit. Quia ea ut minus distinctio quam eveniet nihil. Aut voluptate numquam ipsa dolorem et quas nemo.',
        ]
        const staticDeliveryContent = ['Delivery',
            'Deserunt occaecati tempora. Qui occaecati est aliquam. Enim qui nulla ipsam. Incidunt impedit enim consequuntur amet at consequuntur vero. Dolor et ad facere asperiores iste est praesentium quaerat iure. Quibusdam mollitia autem quos voluptas quia est doloremque corporis et. Sed fuga quasi esse perspiciatis fugit maxime. Qui quidem amet.',
            'Dolores magnam consequatur iste aliquam qui sint non ab. Culpa saepe omnis. Recusandae vel aperiam voluptates harum. Perspiciatis qui molestiae qui tempora quisquam. Mollitia voluptatum minus laboriosam. Dolor maiores possimus repudiandae praesentium hic eos. Veritatis et repellat.',
            'Pariatur nisi nobis hic ut facilis sunt rerum id error. Soluta nihil quisquam quia rerum illo. Ipsam et suscipit est iure incidunt quasi et eum. Culpa libero dignissimos recusandae. In magni sapiente non voluptas molestias. Deserunt quos quo placeat sunt. Ea necessitatibus dolores eaque ex aperiam sunt eius. Saepe aperiam aut. Quaerat natus consequatur aut est id saepe et aut facilis.'
        ]
        const staticHomePage = ['Welcome to Example store!',
            'Culpa perspiciatis corporis facilis fugit similique',
            'Cum aut ut eveniet rem cupiditate natus veritatis quia',
            'Quickly', 'Qualitatively', 'Inexpensive',
            'Odio aut assumenda ipsam amet reprehenderit. Perspiciatis qui molestiae qui tempora quisquam',
            'Ut nisi distinctio est non voluptatem. Odio aut assumenda ipsam amet reprehenderit',
            'Perspiciatis qui molestiae qui tempora quisquam. Ut nisi distinctio est non voluptatem',
            'Sed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.',
            'Modi corporis consectetur aliquid sit cum tenetur enim. Sed voluptatum quis voluptates laudantium incidunt laudantium. Illo non quos eos vel ipsa. Explicabo itaque est optio neque rerum provident enim qui sed. Corrupti commodi voluptatem vero soluta hic.',

        ]
        const user = userEvent.setup()
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const store = initStore(api, cart);

        const app = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>);

        const linksContainer = await app.getByTestId('navbar-nav');
        const contactsLink = await within(linksContainer).findByText('Contacts');
        const pageContainer = await app.getByTestId('page-container');

        //Contact page
        await user.click(contactsLink);
        staticContactContent.forEach(text => {
            expect(pageContainer).toHaveTextContent(text);
        })

        //Delivery page
        const deliveryLink = await within(linksContainer).findByText('Delivery');
        await user.click(deliveryLink);
        staticDeliveryContent.forEach(text => {
            expect(pageContainer).toHaveTextContent(text);
        })
        const deliveryImage = within(pageContainer).getByRole('img');
        expect(deliveryImage).toBeDefined();

        //Home page
        const homeLink = await app.findByText('Example store');
        await user.click(homeLink);
        staticHomePage.forEach(text => {
            expect(pageContainer).toHaveTextContent(text);
        })
    })

    it('В магазине должны быть страницы: главная, каталог, условия доставки, контакты', async () => {
        const user = userEvent.setup()
        const basename = '/hw/store';

        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const store = initStore(api, cart)
        const app = render(
            <BrowserRouter basename={basename}>
                <Provider store={store}>
                    <Application/>
                </Provider>
            </BrowserRouter>);
        const linksContainer = await app.getByTestId('navbar-nav');
        const contactsLink = await within(linksContainer).findByText('Contacts');
        const deliveryLink = await within(linksContainer).findByText('Delivery');
        const cartLink = await within(linksContainer).findByText('Cart');
        const catalogLink = await within(linksContainer).findByText('Catalog');


        let pageContainer = await app.getByTestId('page-container');
        expect(pageContainer.firstElementChild).toHaveClass('Home');

        await user.click(deliveryLink);
        pageContainer = await app.getByTestId('page-container')
        expect(pageContainer.firstElementChild).toHaveClass('Delivery')

        await user.click(contactsLink);
        pageContainer = await app.getByTestId('page-container')
        expect(pageContainer.firstElementChild).toHaveClass('Contacts')

        await user.click(cartLink);
        pageContainer = await app.getByTestId('page-container')
        expect(pageContainer.firstElementChild).toHaveClass('Cart')

        await user.click(catalogLink);
        pageContainer = await app.getByTestId('page-container')
        expect(pageContainer.firstElementChild).toHaveClass('Catalog')
    })

})