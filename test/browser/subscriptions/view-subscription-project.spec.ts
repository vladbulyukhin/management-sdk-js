import { SubscriptionModels, SubscriptionResponses } from '../../../lib';
import * as responseJson from '../fake-responses/subscriptions/fake-view-subscription-project.json';
import { cmLiveClient, getTestClientWithJson, testSubscriptionId } from '../setup';

describe('View subscription project ', () => {
    let response: SubscriptionResponses.ViewSubscriptionProjectResponse;

    beforeAll(async () => {
        response = await getTestClientWithJson(responseJson).viewSubscriptionProject().projectId('x').toPromise();
    });

    it(`url should be correct`, () => {
        const idUrl = cmLiveClient.viewSubscriptionProject().projectId('xProjectId').getUrl();

        expect(idUrl).toEqual(`https://manage.kontent.ai/v2/subscriptions/${testSubscriptionId}/projects/xProjectId`);
    });

    it(`response should be instance of ViewSubscriptionProjectResponse class`, () => {
        expect(response).toEqual(jasmine.any(SubscriptionResponses.ViewSubscriptionProjectResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(response.data).toEqual(jasmine.any(SubscriptionModels.SubscriptionProject));
    });

    it(`properties should be mapped`, () => {
        const originalItem = responseJson;
        const item = response.data;

        expect(item.id).toEqual(originalItem.id);
        expect(item.isActive).toEqual(originalItem.is_active);
        expect(item.environments).toEqual(originalItem.environments);
        expect(item.name).toEqual(originalItem.name);
    });
});
