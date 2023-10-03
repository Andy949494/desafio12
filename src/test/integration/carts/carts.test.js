import {expect} from 'chai';
import supertest from 'supertest';
import * as usersMock from '../../mocks/users.mock.js';
import * as cartsMock from '../../mocks/carts.mock.js'
import * as productsMock from '../../mocks/products.mock.js'

const requester = supertest('http://localhost:8080');

describe('Testing carts routes', () => {
    let authToken;
    before(async () => {
        const mockUser = { email: usersMock.admin.email, password: usersMock.admin.password };
        const login = await requester.post('/api/users/login').send(mockUser);
        const cookieResult = login.headers['set-cookie'][0];
        const cookieParts = cookieResult.split(';');
        const tokenPart = cookieParts.find((part) => part.includes('cookieToken='));
        authToken = tokenPart.split('=')[1];
    });
    // it('It should return an object with all the carts in the DB', async () => {
    //     const result = await requester.get('/api/carts').set('Cookie', [`cookieToken=${authToken}`]);
    //     expect(result.body).to.be.an('object');
    //     expect(result.body.status).deep.equal('success');
    //     expect(result.body.payload).to.be.an('array');
    //     expect(result.ok).to.be.true;
    // });

    // it('It should create a new cart', async () => {
        
    //    const result = await requester.post('/api/carts').set('Cookie', [`cookieToken=${authToken}`]);

    //      expect(result.body.payload).to.have.property('_id');
    //      expect(result.body.payload).to.have.property('products');
    //      expect(result.body.status).deep.equal('success');
    //      expect(result.ok).to.be.true;
    //      expect(result.statusCode).to.be.equal(200);
    // });

    // it('It should return a cart by its Id', async () => {
    //     const resultPost = await requester.post('/api/carts').set('Cookie', [`cookieToken=${authToken}`])
    //     const id = resultPost.body.payload._id;

    //     const result = await requester.get(`/api/carts/${id}`).set('Cookie', [`cookieToken=${authToken}`]);

    //     expect(result.ok).to.be.true;
    //     expect(result.statusCode).to.deep.equal(200);
    //     expect(result.body.payload).to.have.property('_id');
    //     expect(result.body.payload).to.have.property('products');
    //     expect(result.body.payload._id).to.equal(id);
    // });

    it('It should update one cart succesfully', async () => {
        const bodyResponse = {
            status: 'success',
            payload: 'Cart updated successfully'
        };
        const resultPost = await requester.post('/api/carts').set('Cookie', [`cookieToken=${authToken}`])
        const id = resultPost.body.payload._id;

        const result = await requester.put(`/api/carts/${id}`).set('Cookie', [`cookieToken=${authToken}`]).send(cartsMock.cart1);


        console.log(result)
        // expect(result.body).to.deep.equal(bodyResponse);
        // expect(result.ok).to.be.true;
        // expect(result.statusCode).to.deep.equal(200);

        // const cart = await requester.get(`/api/carts/${id}`).set('Cookie', [`cookieToken=${authToken}`]);

        // console.log(cart.body.payload.products[0].product)
        //expect(cart.products.product).to.be.equal(cartsMock.cart1.product)
    });

    // it('It should add one product to a cart by its id', async () => {
    //     const bodyResponse = {
    //         status: 'success',
    //         payload: 'Product added successfully'
    //     };
    //     const resultProductPost = await requester.post('/api/products').send(productsMock.product1)
    //     const pid = resultProductPost.body.payload._id;

    //     const resultCartPost = await requester.post('/api/carts')
    //     const cid = resultCartPost.body.payload._id;

    //     const result = await requester.post(`/api/carts/${cid}/product/${pid}`);

    //     expect(result.body).to.deep.equal(bodyResponse);
    //     expect(result.ok).to.be.true;
    //     expect(result.statusCode).to.deep.equal(200);

    //     const getcarts = await requester.get('/api/carts');
    //     const cart = getcarts.body.payload.find( el => el._id === cid);

    //     expect(cart.products.product).to.be.equal(pid)
    // });

    // it('It should update a cart quantity succesfully', async () => {
    //     const bodyResponse = {
    //         status: 'success',
    //         payload: 'Quantity updated successfully'
    //     };
    //     const resultProductPost = await requester.post('/api/products').send(productsMock.product1)
    //     const pid = resultProductPost.body.payload._id;

    //     const resultCartPost = await requester.post('/api/carts')
    //     const cid = resultCartPost.body.payload._id;

    //     const result = await requester.put(`/api/carts/${cid}/product/${pid}`).send(cartsMock.newQuiantity);

    //     expect(result.body).to.deep.equal(bodyResponse);
    //     expect(result.ok).to.be.true;
    //     expect(result.statusCode).to.deep.equal(200);

    //     const getcarts = await requester.get('/api/carts');
    //     const cart = getcarts.body.payload.find( el => el._id === cid);

    //     expect(cart.products.product).to.be.equal(pid)
    // });

    // it('It should delete one product from cart', async () => {
    //     const bodyResponse = {
    //         status: 'success',
    //         payload: 'Product deleted successfully'
    //     };
    //     const resultProductPost = await requester.post('/api/products').send(productsMock.product1)
    //     const pid = resultProductPost.body.payload._id;

    //     const resultCartPost = await requester.post('/api/carts')
    //     const cid = resultCartPost.body.payload._id;

    //     const result = (await requester.delete(`/api/carts/${cid}/product/${pid}`));

    //     expect(result.body).to.deep.equal(bodyResponse);
    //     expect(result.ok).to.be.true;
    //     expect(result.statusCode).to.deep.equal(200);

    //     const getcarts = await requester.get('/api/carts');
    //     const cart = getcarts.body.payload.find( el => el._id === cid);

    //     expect(cart.products.product).to.be.equal(undefined)
    // });

    // it('It should delete all products from cart', async () => {
    //     const bodyResponse = {
    //         status: 'success',
    //         payload: 'All products deleted successfully'
    //     };
        
    //     const resultCartPost = await requester.post('/api/carts')
    //     const cid = resultCartPost.body.payload._id;

    //     const result = (await requester.delete(`/api/carts/${cid}`));

    //     expect(result.body).to.deep.equal(bodyResponse);
    //     expect(result.ok).to.be.true;
    //     expect(result.statusCode).to.deep.equal(200);

    //     const getcarts = await requester.get('/api/carts');
    //     const cart = getcarts.body.payload.find( el => el._id === cid);

    //     expect(cart.products).to.be.equal(undefined)
    // });
});