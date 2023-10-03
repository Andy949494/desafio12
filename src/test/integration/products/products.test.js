import {expect} from 'chai';
import supertest from 'supertest';
import * as productsMock from '../../mocks/products.mock.js'
import * as usersMock from '../../mocks/users.mock.js';

const requester = supertest('http://localhost:8080');

describe('Testing products routes', () => {
    let authToken;
    before(async () => {
        const mockUser = { email: usersMock.admin.email, password: usersMock.admin.password };
        const login = await requester.post('/api/users/login').send(mockUser);
        const cookieResult = login.headers['set-cookie'][0];
        const cookieParts = cookieResult.split(';');
        const tokenPart = cookieParts.find((part) => part.includes('cookieToken='));
        authToken = tokenPart.split('=')[1];
    });

    it('It should return an object with all the products in the DB', async () => {
        const result = await requester.get('/api/products').send();

        expect(result.body).to.be.an('object');
        expect(result.body.status).deep.equal('success');
        expect(result.body.payload).to.be.an('array');
        expect(result.ok).to.be.true;
        expect(result.status).to.equal(200);
    });

    it('It should create a new product', async () => {
            const result = await requester
                .post('/api/products')
                .set('Cookie', [`cookieToken=${authToken}`])
                .field('title', productsMock.product1.title)
                .field('description', productsMock.product1.description)
                .field('code', productsMock.product1.code)
                .field('price', productsMock.product1.price.toString())
                .field('status', productsMock.product1.status)
                .field('stock', productsMock.product1.stock.toString())
                .field('category', productsMock.product1.category)

        expect(result.status).to.equal(200);
        expect(result.body).to.have.property('status', 'success');
        expect(result.body).to.have.property('payload');
        expect(result.body.payload).to.have.property('_id');
        expect(result.body.payload).to.have.property('title', productsMock.product1.title);
    })

    it('It should fail if title is not provided', async() => {
        const bodyResponse = {
            status:"error",
            error:"Incomplete values"
        };

        const result = await requester
            .post('/api/products')
            .set('Cookie', [`cookieToken=${authToken}`])
            .field('title', "")
            .field('description', productsMock.product1.description)
            .field('code', productsMock.product1.code)
            .field('price', productsMock.product1.price.toString())
            .field('status', productsMock.product1.status)
            .field('stock', productsMock.product1.stock.toString())
            .field('category', productsMock.product1.category)

        expect(result.ok).to.be.false;
        expect(result.body.status).to.be.equal(bodyResponse.status);
        expect(result.body.error).to.be.equal(bodyResponse.error);
        expect(result.statusCode).to.deep.equal(400)
    });

    it('It should return a product by its Id', async () => {
        
        const postResult = await requester
            .post('/api/products')
            .set('Cookie', [`cookieToken=${authToken}`])
            .field('title', productsMock.product1.title)
            .field('description', productsMock.product1.description)
            .field('code', productsMock.product1.code)
            .field('price', productsMock.product1.price.toString())
            .field('status', productsMock.product1.status)
            .field('stock', productsMock.product1.stock.toString())
            .field('category', productsMock.product1.category)

        const id = postResult.body.payload._id

        const result = await requester.get(`/api/products/${id}`);

         expect(result.body.payload).to.have.property('_id');
         expect(result.body.status).deep.equal('success');
         expect(result.ok).to.be.true;
         expect(result.statusCode).to.be.equal(200);
         expect(result.body.payload.title).to.equal(productsMock.product1.title);
         expect(result.body.payload.description).to.equal(productsMock.product1.description);
         expect(result.body.payload.code).to.equal(productsMock.product1.code);
         expect(result.body.payload.price).to.equal(productsMock.product1.price);
         expect(result.body.payload.status).to.equal(productsMock.product1.status);
         expect(result.body.payload.stock).to.equal(productsMock.product1.stock);
         expect(result.body.payload.category).to.equal(productsMock.product1.category);
    });

    it('It should update one product succesfully', async () => {
        const bodyResponse = {
            status: 'success',
            payload: 'Product updated successfully'
        };
        const postResult = await requester
            .post('/api/products')
            .set('Cookie', [`cookieToken=${authToken}`])
            .field('title', productsMock.product1.title)
            .field('description', productsMock.product1.description)
            .field('code', productsMock.product1.code)
            .field('price', productsMock.product1.price.toString())
            .field('status', productsMock.product1.status)
            .field('stock', productsMock.product1.stock.toString())
            .field('category', productsMock.product1.category)        
        
        const id = postResult.body.payload._id;

        const result = await requester.put(`/api/products/${id}`).set('Cookie', [`cookieToken=${authToken}`]).send(productsMock.product3);

        expect(result.body).to.deep.equal(bodyResponse);
        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);

        const productById = await requester.get(`/api/products/${id}`);

        expect(productById.body.payload.title).to.be.equal(productsMock.product3.title)
    });

    it('It should delete one product', async () => {
        const bodyResponse = {
            status: 'success',
            payload: 'Product deleted successfully'
        };

        const postResult = await requester
            .post('/api/products')
            .set('Cookie', [`cookieToken=${authToken}`])
            .field('title', productsMock.product1.title)
            .field('description', productsMock.product1.description)
            .field('code', productsMock.product1.code)
            .field('price', productsMock.product1.price.toString())
            .field('status', productsMock.product1.status)
            .field('stock', productsMock.product1.stock.toString())
            .field('category', productsMock.product1.category)          
        
        
        const id = postResult.body.payload._id;

        const result = await requester
            .delete(`/api/products/${id}`)
            .set('Cookie', [`cookieToken=${authToken}`])
            
        expect(result.body).to.deep.equal(bodyResponse);
        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);

        const getResult = await requester.get(`/api/products/${id}`);
    
        expect(getResult.statusCode).to.equal(500);
    });
});