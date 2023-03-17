// import { deepStrictEqual } from 'assert';
import { DbModel } from 'lite-ts-db';
import { Mock } from 'lite-ts-mock';
import { ModelStatic, Sequelize } from 'sequelize';

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
                r => r.create(undefined),
                true
            );
            const res = self.registerAdd(TestModel.name, {
                id: '1'
            });
            console.log(res);

        });
    });

    describe('.registerAdd(model: Function, entry: AreaDbModel)', () => {
        it('ok', async () => {

        });
    });

    describe('.registerAfter(action: () => Promise<void>, key?: string)', () => {
        it('ok', async () => {

        });
    });

    describe('.registerRemove(model: Function, entry: AreaDbModel)', () => {
        it('ok', async () => {

        });
    });

    describe('.registerSave(model: Function, entry: AreaDbModel)', () => {
        it('ok', async () => {

        });
    });
});