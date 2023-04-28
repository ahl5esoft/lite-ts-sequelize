import { Mock } from 'lite-ts-mock';
import { Sequelize } from 'sequelize';

import { SequelizeDbQuery as Self } from './db-query';
import { SequelizeModelPool } from './model-pool';

class Config {
    public id: string;
    public items: any;
}

describe('src/db-query.ts', () => {
    describe('.count(where?: WhereOptions<any>)', () => {
        it('ok', async () => {
            const dbMock = new Mock<SequelizeModelPool>();
            const seqMock = new Mock<Sequelize>();

            const self = new Self(dbMock.actual, Config.name, seqMock.actual);
            const v = {
                where: {
                    sql: 'SELECT t1.account_id,t1.access_token,t1.refresh_token,t1.aaa FROM qq_ad'
                }
            };
            seqMock.expected.query('SELECT  t1.account_id AS t1.accountId, t1.access_token AS t1.accessToken, t1.refresh_token AS t1.refreshToken, t1.aaa AS t1.aaa FROM qq_ad', undefined);
            await self.toArray(v);
        });
    });
});