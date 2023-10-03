import {expect} from 'chai';
import * as usersMock from '../../mocks/users.mock.js';
import supertest from 'supertest';


const requester = supertest('http://localhost:8080');

describe('Testing users endpoints', () => {

    it('It should register an user succesfully', async () => {
        const result = await requester.post('/api/users/register').send(usersMock.user1);

        expect(result).to.be.ok;
    });

    it('It should login succesfully and return a cookie', async () => {
        const mockUser = {
            email: usersMock.user1.email,
            password: usersMock.user1.password
        };

        console.log(mockUser)

        const result = await requester.post('/api/users/login').send(mockUser);
        const cookieResult = result.headers['set-cookie'][0];

        //console.log(cookieResult);

        expect(cookieResult).to.be.ok;

        // const cookie = {
        //     key: cookieResult.split('=')[0],
        //     value: cookieResult.split(';')[1],
        // };
        const cookieParts = cookieResult.split(';');
        const tokenPart = cookieParts.find(part => part.includes('cookieToken='));
        const token = tokenPart.split('=')[1];
        console.log(token)
        //console.log(cookie)
        //expect(cookie.key).to.be.equal('cookieToken');
        //expect(cookie.value).to.be.ok;

    });
});