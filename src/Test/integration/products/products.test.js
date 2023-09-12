import {expect} from 'chai';
import supertest from 'supertest';
import * as productsMock from '../../mocks/products.mock.js'

const requester = supertest('http://localhost:8080');

describe('Testing products routes', () => {
    it('It should return an object with all the products in the DB', async () => {
        const result = await requester.get('/api/products').send();

        expect(result.body).to.be.an('object');
        expect(result.body.status).deep.equal('success');
        expect(result.body.payload).to.be.an('array');
        expect(result.ok).to.be.true;
    });

    it('It should create a new product', async () => {
        
        const result = await requester.post('/api/products').send(productsMock.product1);
        
         expect(result.body.payload).to.have.property('_id');
         expect(result.body.status).deep.equal('success');
         expect(result.ok).to.be.true;
         expect(result.statusCode).to.be.equal(200);
    });

    it('It should fail if name is not provided', async() => {
        const bodyResponse = {
            status:"error",
            error:"Incomplete values"
        };

        const result = await requester.post('/api/products').send(productsMock.productWithoutTitle);

        expect(result.ok).to.be.false;
        expect(result.body.status).to.be.equal(bodyResponse.status);
        expect(result.body.error).to.be.equal(bodyResponse.error);
        expect(result.statusCode).to.deep.equal(400)
    });

    it('It should return a product by its Id', async () => {
        
        const resultPost = await requester.post('/api/products').send(productsMock.product1);
        const id = resultPost.body.payload._id;

        const result = await requester.get(`/api/products/${id}`);
        
         expect(result.body.payload).to.have.property('_id');
         expect(result.body.status).deep.equal('success');
         expect(result.ok).to.be.true;
         expect(result.statusCode).to.be.equal(200);
    });

    it('It should update one product succesfully', async () => {
        const bodyResponse = {
            status: 'success',
            payload: 'Product updated successfully'
        };
        const resultPost = await requester.post('/api/products').send(productsMock.product2);        
        const id = resultPost.body.payload._id;

        const result = await requester.put(`/api/products/${id}`).send(productsMock.product3);

        expect(result.body).to.deep.equal(bodyResponse);
        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);

        const getProducts = await requester.get('/api/products').send();
        const product = getProducts.body.payload.find( el => el._id === id);

        expect(product.title).to.be.equal(productsMock.product3.title)
    });

    it('It should delete one product', async () => {
        const bodyResponse = {
            status: 'success',
            payload: 'Product deleted successfully'
        };

        const resultPost = await requester.post('/api/products').send(productsMock.product3);        
        const id = resultPost.body.payload._id;

        const result = await requester.delete(`/api/products/${id}`);

        expect(result.body).to.deep.equal(bodyResponse);
        expect(result.ok).to.be.true;
        expect(result.statusCode).to.deep.equal(200);

        const getProducts = await requester.get('/api/products').send();
        const product = getProducts.body.payload.find( el => el._id === id);

        expect(product).to.be.equal(undefined);
    });
});