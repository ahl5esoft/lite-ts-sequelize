import { DbModel, DbOption, IDbQuery, DbQueryOption } from 'lite-ts-db';
import { WhereOptions } from 'sequelize';

import { SequelizeAreaDbFactory } from './area-db-factory';

export class AreaDbQuery<T extends DbModel> implements IDbQuery<T> {
    public constructor(
        private m_AreaNo: number,
        private m_DbFactory: SequelizeAreaDbFactory,
        private m_DbOptions: DbOption[],
    ) { }

    public async count(where?: WhereOptions<any>) {
        const dbFactory = await this.m_DbFactory.getAreaDbFactory(this.m_AreaNo);
        return await dbFactory.db<T>(...this.m_DbOptions).query().count(where);
    }

    public async toArray(v?: DbQueryOption<WhereOptions<any>>) {
        const dbFactory = await this.m_DbFactory.getAreaDbFactory(this.m_AreaNo);
        return await dbFactory.db<T>(...this.m_DbOptions).query().toArray(v);
    }
}
