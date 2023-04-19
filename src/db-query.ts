import { DbQueryOption, IDbQuery } from 'lite-ts-db';
import { FindOptions, QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize, WhereOptions } from 'sequelize';

import { SequelizeModelPool } from './model-pool';

type SqlQuery = {
    options: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>,
    sql: string;
};

export class SequelizeDbQuery<T> implements IDbQuery<T> {
    public static reg = /(?:_)(\w)/g;

    public constructor(
        private m_SeqModelPool: SequelizeModelPool,
        private m_Model: string,
        private m_Seq: Sequelize
    ) { }

    public async count(where?: WhereOptions<any>) {
        return await this.m_SeqModelPool.get(this.m_Model).count({
            where
        });
    }

    public async toArray(v?: DbQueryOption<WhereOptions<any> | SqlQuery>) {
        const opt: FindOptions<any> = {};
        if (v?.skip)
            opt.offset = v.skip;
        if (v?.order) {
            opt.order = v.order.map(r => {
                return [r, 'ASC'];
            });
        }
        if (v?.orderByDesc) {
            opt.order = v.orderByDesc.map(r => {
                return [r, 'DESC'];
            });
        }
        if (v?.take)
            opt.limit = v.take;
        if (v?.where) {
            const sqlQuery = v.where as SqlQuery;
            if (sqlQuery.sql) {
                const result = await this.m_Seq.query(sqlQuery.sql, sqlQuery.options);
                return result.map(m => {
                    return Object.keys(m).reduce((memo, r) => {
                        if (r.includes('_'))
                            memo[r.replace(SequelizeDbQuery.reg, (_, char) => char.toUpperCase())] = m[r];
                        else
                            memo[r] = m[r];
                        return memo;
                    }, {});
                });
            } else {
                opt.where = v.where;
            }
        }
        const res = await this.m_SeqModelPool.get(this.m_Model).findAll(opt);
        return res.map((r: any) => {
            return r.dataValues;
        });
    }
}