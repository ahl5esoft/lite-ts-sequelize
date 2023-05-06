import { DbQueryOption, IDbQuery } from 'lite-ts-db';
import { FindOptions, QueryOptions, QueryOptionsWithType, QueryTypes, Sequelize, WhereOptions } from 'sequelize';

import { SequelizeModelPool } from './model-pool';

export type SqlQuery = {
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
                //sql内的仅处理SELECT类型语句
                if (sqlQuery.options?.type == QueryTypes.SELECT) {
                    const fields = sqlQuery.sql.match(/SELECT (.+) FROM/)[1];
                    const outSql = fields
                        .split(",")
                        .map(
                            (field) =>
                                ` ${field} AS ${field.replace(/_(\w)/g, (_, p1) => p1.toUpperCase())}`
                        )
                        .join(",");
                    sqlQuery.sql = sqlQuery.sql.replace(fields, outSql);
                }
                return await this.m_Seq.query(sqlQuery.sql, sqlQuery.options);
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