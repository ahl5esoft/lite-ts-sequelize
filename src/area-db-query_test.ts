import { strictEqual } from 'assert';
import { DbFactoryBase, DbOption, IDbQuery, IDbRepository } from 'lite-ts-db';
import { Mock } from 'lite-ts-mock';
import { SequelizeAreaDbFactory } from './area-db-factory';

import { AreaDbQuery as Self } from './area-db-query';

describe('src/db-query.ts', () => {
    describe('.count(where?: Filter<any>)', () => {
        it('ok', async () => {
            const sequelizeAreaDbFactory = new Mock<SequelizeAreaDbFactory>();
            const dbOption = new Mock<DbOption>();

            const dbFactoryBase = new Mock<DbFactoryBase>();
            sequelizeAreaDbFactory.expectReturn(
                r => r.getAreaDbFactory(1),
                dbFactoryBase.actual
            );

            const iDbRepository = new Mock<IDbRepository<any>>();
            dbFactoryBase.expectReturn(
                r => r.db(dbOption.actual),
                iDbRepository.actual
            );

            const iDbQuery = new Mock<IDbQuery<any>>();
            iDbRepository.expectReturn(
                r => r.query(),
                iDbQuery.actual
            );
            iDbQuery.expectReturn(
                r => r.count(undefined),
                2
            );
            const self = new Self(1, sequelizeAreaDbFactory.actual, [dbOption.actual]);
            const res = await self.count();
            strictEqual(res, 2);
        });
    });
});