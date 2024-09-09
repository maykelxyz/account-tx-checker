import dotenv from "dotenv";
dotenv.config();

import { Pool, PoolConfig } from 'pg';
import { createHash } from 'crypto';

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const database = process.env.DB_DATABASE;
const password = process.env.DB_PASSWORD;

export class DbRepository {
    private pool: Pool;
    constructor() {
        const config: PoolConfig = {
            user: user,
            host: host,
            database: database,
            password: password,
            port: 5432,
        };

        this.pool = new Pool(config);
    }
    async createNewUser(address: string) {
        const client = await this.pool.connect();
        try {
            const encryptedParam = this.encryptParameter(address);
            const result = await client.query('CALL sp_createNewUser($1, $2)', [address, encryptedParam]);
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        } finally {
            client.release();
        }
    }
    private encryptParameter(address: string): string {
        const salt = process.env.SECRET_SALT;
        const hash = createHash('sha256');
        hash.update(address + salt!);
        return hash.digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '')
            .substring(0, 20);
    }
    async close() {
        await this.pool.end();
    }
    async getAllUsers() {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM sp_getAllUsers()');
            return result.rows;
        } catch (error: any) {
            console.log('Error getting all users: ', error);
            throw new Error('Failed to get all users');
        } finally {
            client.release();
        }
    }
}