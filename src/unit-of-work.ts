import { IUnitOfWorkRepository } from 'lite-ts-db';
import { Sequelize, Transaction } from 'sequelize';

import { SequelizeModelPool } from './model-pool';

/**
 * sequelize工作单元仓储
 */
export class SequelizeUnitOfWork implements IUnitOfWorkRepository {
    /**
     * 提交后函数
     */
    private m_AfterAction: { [key: string]: () => Promise<void>; } = {};
    /**
     * 函数
     */
    private m_Actions: ((tx: Transaction) => Promise<void>)[] = [];

    private m_BulkCreate: { [model: string]: any; } = {};

    /**
     * 构造函数
     * 
     * @param m_Seq Sequelize对象
     * @param m_SeqModelPool Sequelize模型池
     */
    public constructor(
        private m_Seq: Sequelize,
        private m_SeqModelPool: SequelizeModelPool,
    ) { }

    /**
     * 提交
     */
    public async commit() {
        try {
            const tx = await this.m_Seq.transaction();
            try {
                for (const model of Object.keys(this.m_BulkCreate)) {
                    await this.m_SeqModelPool.get(model).bulkCreate(this.m_BulkCreate[model], {
                        transaction: tx
                    });
                    this.m_BulkCreate[model] = [];
                }

                for (const r of this.m_Actions)
                    await r(tx);

                await tx.commit();
            } catch (ex) {
                await tx.rollback();
                throw ex;
            }
        } finally {
            const tasks = Object.values(this.m_AfterAction).map(r => {
                return r();
            });
            await Promise.all(tasks);
        }
    }

    /**
     * 注册提交后函数
     * 
     * @param action 函数
     * @param key 键
     */
    public registerAfter(action: () => Promise<void>, key?: string) {
        key ??= `key-${Object.keys(this.m_AfterAction).length}`;
        this.m_AfterAction[key] = action;
    }

    /**
     * 注册新增
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerAdd(model: string, entry: any) {
        this.m_BulkCreate[model] ??= [];
        this.m_BulkCreate[model].push(entry);
    }

    /**
     * 注册删除
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerRemove(model: string, entry: any) {
        this.m_Actions.push(async tx => {
            await this.m_SeqModelPool.get(model).destroy({
                transaction: tx,
                where: {
                    id: entry.id
                },
            });
        });
    }

    /**
     * 注册更新
     * 
     * @param model 模型
     * @param entry 实体
     */
    public registerSave(model: string, entry: any) {
        this.m_Actions.push(async tx => {
            await this.m_SeqModelPool.get(model).update(entry, {
                transaction: tx,
                where: {
                    id: entry.id
                },
            });
        });
    }
}