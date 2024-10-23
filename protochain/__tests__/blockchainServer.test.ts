import { beforeAll, describe, expect, jest, test } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/server/blockchainServer';
import Block from '../src/lib/block';

jest.mock('../src/lib/block');
jest.mock('../src/lib/blockchain');

describe('BlockchainServer Tests', () => {

    let genesisBlock : Block;

    beforeAll(() => {
        genesisBlock = new Block({
            data: "Genesis"
        } as Block);
    })

    test('GET /status', async () => {
        const response = await request(app)
            .get('/status');
        
        expect(response.status).toEqual(200);
        expect(response.body.isValid.success).toEqual(true);
    })

    test('GET /block/:indexOrHash - Index', async () => {
        const response = await request(app)
            .get('/block/0');
        
        expect(response.status).toEqual(200);
    })

    test('GET /block/:indexOrHash - Hash', async () => {
        const response = await request(app)
            .get(`/block/${genesisBlock.hash}`);
        
        expect(response.status).toEqual(200);
    })

    test('GET /block/:indexOrHash - Not found', async () => {
        const response = await request(app)
            .get('/block/1');
        
        expect(response.status).toEqual(404);
    })

    test('POST /block - Create Block', async () => {
        const body = {
            index: 1,
            data: "AA",
            previousHash: genesisBlock.hash,
            hash: ""
        }

        const response = await request(app)
            .post('/block')
            .send(body);
        
        expect(response.status).toEqual(201);
    })

    test('POST /block - Create invalid Block', async () => {
        const body = {
            index: -1,
            data: "AA",
            previousHash: genesisBlock.hash,
            hash: ""
        }

        const response = await request(app)
            .post('/block')
            .send(body);
        
        expect(response.status).toEqual(400);
    })
})
