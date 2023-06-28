import {CartApi, ExampleApi} from "../../src/client/api";
import {baseApiURl} from "../const/const";
import {AxiosResponse} from "axios";
import {initStore} from "../../src/client/store";
import {render, RenderResult, waitFor} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {MemoryRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {Route, Switch} from "react-router";
import {Product} from "../../src/client/pages/Product";
import React from "react";

describe('Сервер: ', () => {
    it('После перехода на страницу товара сервер возвращает выбранный товар', async () => {
        const api = new ExampleApi(baseApiURl);
        const cart = new CartApi();
        const apiSpy = jest.spyOn(api, 'getProductById');
        const getApiResult = (): Promise<AxiosResponse<any>> => {
            return apiSpy.mock.results[0].value;
        };

        const store = initStore(api, cart)
        const testedId = 2
        let app: RenderResult;
        await act(async () => {
            app = render(
                <MemoryRouter initialEntries={['/catalog/' + testedId]}>
                    <Provider store={store}>
                        <Switch>
                            <Route path={'/catalog/:id'} component={Product}/>
                        </Switch>
                    </Provider>
                </MemoryRouter>);
        })

        await waitFor(async () => {
            const apiCallResult = (await getApiResult()).data;
            console.log(apiCallResult);
            return expect(apiCallResult).toMatchObject({id: testedId});
        });
    })
    it('Сервер генерирует ID заказов по порядку', async () => {
        const api = new ExampleApi(baseApiURl);
        const checkout = async () => {
            return (await api.checkout({
                name: 'Grzegorz Brzęczyszczykiewicz',
                address: 'al. Jana Pawla II',
                phone: '1231231231'
            }, [])).data;
        }
        const result = await checkout();
        const result2 = await checkout();
        expect(result2.id - result.id).toBe(1);
    })
})