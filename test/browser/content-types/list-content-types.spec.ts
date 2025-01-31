import { ContentTypeResponses, SharedModels } from '../../../lib';
import * as listContentTypesJson from '../fake-responses/content-types/fake-list-content-types.json';
import { cmLiveClient, getTestClientWithJson, testProjectId } from '../setup';

describe('List content types', () => {
    let response: ContentTypeResponses.ContentTypeListResponse;

    beforeAll(async () => {
        response = await getTestClientWithJson(listContentTypesJson).listContentTypes().toPromise();
    });

    it(`url should be correct`, () => {
        const url = cmLiveClient.listContentTypes().getUrl();

        expect(url).toEqual(`https://manage.kontent.ai/v2/projects/${testProjectId}/types`);
    });

    it(`response should be instance of ContentTypeListResponse class`, () => {
        expect(response).toEqual(jasmine.any(ContentTypeResponses.ContentTypeListResponse));
    });

    it(`response should contain debug data`, () => {
        expect(response.debug).toBeDefined();
    });

    it(`pagination should be correct`, () => {
        expect(response.data.pagination).toEqual(jasmine.any(SharedModels.Pagination));
        expect(response.data.pagination.continuationToken).toEqual(listContentTypesJson.pagination.continuation_token);
        expect(response.data.pagination.nextPage).toEqual(listContentTypesJson.pagination.next_page);
    });

    it(`response should contain data`, () => {
        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data.items)).toBeTruthy();
        expect(response.data.items.length).toEqual(listContentTypesJson.types.length);
        expect(response.data.items).toBeTruthy();
    });

    it(`content type properties should be mapped`, () => {
        const contentTypes = response.data.items;

        contentTypes.forEach((contentType) => {
            const originalItem = listContentTypesJson.types.find((m) => m.id === contentType.id);

            if (!originalItem) {
                throw Error(`Invalid content type with id '${contentType.id}'`);
            }

            expect(contentType.codename).toEqual(originalItem.codename);
            expect(contentType.name).toEqual(originalItem.name);
            expect(contentType.lastModified).toEqual(new Date(originalItem.last_modified));
            expect(contentType.elements.length).toEqual(originalItem.elements.length);
            expect(Array.isArray(contentType.elements)).toBeTruthy();

            contentType.elements.forEach((element) => {
                const originalElement = originalItem.elements.find((m) => m.id === element.id);
                if (!originalElement) {
                    throw Error(`Invalid element with id '${element.id}'`);
                }

                // all element properties should be identical
                for (const key of Object.keys(element)) {
                    const mappedElementValue = (element as any)[key];
                    const originalElementValue = (originalElement as any)[key];
                    expect(mappedElementValue).toEqual(originalElementValue);
                }
            });
        });
    });
});
