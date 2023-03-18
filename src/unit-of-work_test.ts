// import { deepStrictEqual } from 'assert';
import { DbModel } from 'lite-ts-db';
import { Mock } from 'lite-ts-mock';
import { ModelStatic, Sequelize, Transaction } from 'sequelize';

import { SequelizeModelPool } from './model-pool';
import { SequelizeUnitOfWork as Self } from './unit-of-work';

class TestModel extends DbModel { }

describe('src/unit-of-work.ts', () => {
    describe('.commit()', () => {
        it('ok', async () => {
            const sequelize = new Mock<Sequelize>();
            const sequelizeModelPool = new Mock<SequelizeModelPool>();

            const self = new Self(sequelize.actual, sequelizeModelPool.actual);

            const modelStatic = new Mock<ModelStatic<any>>();
            sequelizeModelPool.expectReturn(
                r => r.get(TestModel.name),
                modelStatic.actual
            );
            modelStatic.expectReturn(
                r => r.create(undefined, {}),
                true
            );
            self.registerAdd(TestModel.name, undefined);
            const transaction = new Mock<Transaction>();
            sequelize.expectReturn(
                r => r.transaction(),
                transaction.actual
            );
            transaction.expectReturn(
                r => r.commit(),
                undefined
            );
            transaction.expectReturn(
                r => r.rollback(),
                undefined
            );
            await self.commit();
        });
    });
});