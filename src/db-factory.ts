import { DbFactoryBase, DbModel, DbOption, DbRepository } from 'lite-ts-db';
import { Options, Sequelize } from 'sequelize';

import { SequelizeModelPool } from './model-pool';
import { SequelizeUnitOfWork } from './unit-of-work';

export class SequelizeDbFactory extends DbFactoryBase {
    private m_ModelPool: SequelizeModelPool;
    public get modelPool() {
        this.m_ModelPool ??= new SequelizeModelPool(this.seq);
        return this.m_ModelPool;
    }

    private m_Seq: Sequelize;
    public get seq() {
        this.m_Seq ??= new Sequelize(this.m_Connection, this.m_Options);
        return this.m_Seq;
    }

    public constructor(
        private m_Connection: string,
        private m_Options?: Options
    ) {
        super();
    }

    public db<T extends DbModel>(...dbOptions: DbOption[]) {
        const dbRepository = new DbRepository<T>(
            this.uow(),
        );
        for (const r of dbOptions)
            r(this, dbRepository);
        return dbRepository;
    }

    public uow() {
        return new SequelizeUnitOfWork(this.seq, this.modelPool);
    }
}