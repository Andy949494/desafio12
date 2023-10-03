import mongoose from "mongoose";
import { productDB } from '../../../dao/factory.js';
import {expect} from 'chai';
import * as productsMock from '../../mocks/products.mock.js'

describe('Users dao test', function () {
    this.timeout(15000);

    it('Obtener todos los productos con findAllProducts', async () => {
        const result = await productDB.findAllProducts();
        
        expect(result).to.be.ok;
        expect(result).to.be.an('array')
    });

    it('Obtener producto por Id con findProductById', async () => {
        let pid = '647cd68ceefe6a39c1cb79dc'
        const result = await productDB.findProductById(pid);

        expect(result).to.be.ok;
        expect(result).to.be.an('array')
        expect(result._id).to.be.eql('647cd68ceefe6a39c1cb79dc')
    });

    it('Agregar un nuevo producto con createProduct', async () => {
        let newProduct = productsMock.product1;
        const result = await productDB.createProduct(newProduct);

        expect(result).to.be.ok;
        expect(result).to.be.an('array')
        expect(result.title).deep.equal(productsMock.product1.title);
    });

    it('Actualizar un producto con updateOneProduct', async () => {
        let newProduct = productsMock.product2;
        const addedProduct = await productDB.createProduct(newProduct);
        let pid = addedProduct._id;
        let replace = productsMock.product3;
        const result = await productDB.updateOneProduct({pid},replace);

        expect(result).to.be.ok;
        expect(result).to.be.an('array')
        expect(result._id).deep.equal(pid);
        expect(result.title).deep.equal(productsMock.product2.title);
    });

    
    it('Eliminar un producto con deleteOneProduct', async () => {
        let newProduct = productsMock.product2;
        const addedProduct = await productDB.createProduct(newProduct);
        let pid = addedProduct._id;
        const result = await productDB.deleteOneProduct({pid});

        expect(result).deep.equal(null);
        expect(result).to.be.null;
    });

});