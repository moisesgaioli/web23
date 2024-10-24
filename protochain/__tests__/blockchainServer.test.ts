import { describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server/blockchainServer';

jest.mock('../src/lib/blockchain');

describe('BlockchainServer Tests', () => {

    test('GET /status', async () => {
        const response = await request(app)
            .get('/status');
        
        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
    })

    test('GET /block/next - Next Block', async () => {
        const response = await request(app)
            .get('/block/next');
        
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(1);
    })

    test('GET /block/:indexOrHash - Index', async () => {
        const response = await request(app)
            .get('/block/0');
        
        expect(response.status).toEqual(200);
        expect(response.body.index).toEqual(0);
    })

    test('GET /block/:indexOrHash - Hash', async () => {
        const response = await request(app)
            .get(`/block/HASH`);
        
        expect(response.status).toEqual(200);
        expect(response.body.hash).toEqual("HASH");
    })

    test('GET /block/:indexOrHash - Not found block', async () => {
        const response = await request(app)
            .get('/block/1');
        
        expect(response.status).toEqual(404);
    })

    test('POST /block - Create Block', async () => {
        const body = {
            index: 1,
            data: "AA",
            previousHash: "HASH",
            hash: ""
        }

        const response = await request(app)
            .post('/block')
            .send(body);
        
        expect(response.status).toEqual(201);
        expect(response.body.index).toEqual(1);
    })

    test('POST /block - Create invalid Block', async () => {
        const body = {
            index: -1,
            data: "AA",
            previousHash: "HASH",
            hash: ""
        }

        const response = await request(app)
            .post('/block')
            .send(body);
        
        expect(response.status).toEqual(400);
    })

    test('POST /block - Create invalid Block - Empty hash', async () => {
        const body = {
            index: 1,
            data: "AA",
            previousHash: "HASH"
        }

        const response = await request(app)
            .post('/block')
            .send(body);
        
        expect(response.status).toEqual(422);
    })
})
