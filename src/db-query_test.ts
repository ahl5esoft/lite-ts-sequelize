import { deepStrictEqual, strictEqual } from 'assert';
import { Mock } from 'lite-ts-mock';
import { ModelStatic } from 'sequelize';

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

            const self = new Self(dbMock.actual, Config.name);

            const modelStatic = new Mock<ModelStatic<any>>();

            dbMock.expectReturn(
                r => r.get(Config.name),
                modelStatic.actual
            );
            modelStatic.expectReturn(
                r => r.count({ where: undefined }),
                2
            );
            const res = await self.count();
            strictEqual(res, 2);
        });
    });

    describe('.toArray(v?: DbQueryOption<WhereOptions<any>>)', () => {
        it('ok', async () => {
            const dbMock = new Mock<SequelizeModelPool>();
            const modelStatic = new Mock<ModelStatic<any>>();
            dbMock.expectReturn(
                r => r.get(Config.name),
                modelStatic.actual
            );
            modelStatic.expectReturn(
                r => r.findAll({}),
                [{
                    dataValues: 222
                }]
            );
            const self = new Self(dbMock.actual, Config.name);
            const res = await self.toArray();
            deepStrictEqual(res, [222]);
        });
    });
});