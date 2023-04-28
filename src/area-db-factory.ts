import { DbFactoryBase, DbOption, DbModel, DbRepository } from 'lite-ts-db';
import { EnumFactoryBase } from 'lite-ts-enum';
import { Options } from 'sequelize';

import { AreaData } from './area-data';
import { AreaUnitOfWork } from './area-unit-of-work';
import { SequelizeDbFactory } from './db-factory';

export class SequelizeAreaDbFactory extends DbFactoryBase {
    private m_AllDbFactory: Promise<{
        [areaNo: number]: DbFactoryBase;
    }>;

    public constructor(
        private m_GlobalDbFactory: DbFactoryBase,
        private m_EnumFactory: EnumFactoryBase,
        private m_Name: string,
        private m_Options?: Options
    ) {
        super();
    }

    public db<T extends DbModel>(...dbOptions: DbOption[]) {
        const dbRepository = new DbRepository<T>(
            this.uow(),
        );
        dbRepository.dbOptions = dbOptions;

        for (const r of dbOptions)
            r(this, dbRepository);

        return dbRepository;
    }

    public uow() {
        return new AreaUnitOfWork(this, this.m_GlobalDbFactory as SequelizeDbFactory);
    }

    public async getAreaDbFactory(areaNo: number) {
        this.m_AllDbFactory ??= new Promise<{
            [areaNo: number]: DbFactoryBase;
        }>(async (s, f) => {
            try {
                const items = await this.m_EnumFactory.build<AreaData>(AreaData as any).items;
                s(
                    items.reduce((memo, r) => {
                        if (r.subFullConnection[this.m_Name])
                            memo[r.value] = new SequelizeDbFactory(r.subFullConnection[this.m_Name], this.m_Options);

                        return memo;
                    }, {})
                );
            } catch (ex) {
                f(ex);
            }
        });

        const allDbFactory = await this.m_AllDbFactory;
        if (!allDbFactory[areaNo])
            throw new Error(`缺少库配置 ${areaNo}[${this.m_Name}]`);

        return allDbFactory[areaNo];
    }
}