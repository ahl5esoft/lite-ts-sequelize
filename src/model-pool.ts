import { ModelStatic, Sequelize } from 'sequelize';

import { defines, tables } from './defines';

/**
 * Sequelize模型管理
 */
export class SequelizeModelPool {
    /**
     * seq模型
     */
    private m_Models = {};

    /**
     * 构造函数
     * 
     * @param m_Seq Sequelize实例
     */
    public constructor(
        private m_Seq: Sequelize
    ) { }

    /**
     * 获取Sequelize模型
     * 
     * @param modelName 模型名
     */
    public get(modelName: string) {
        if (!this.m_Models[modelName]) {
            const fields = defines[modelName];
            if (!fields)
                throw new Error(`缺少模型: ${modelName}`);

            this.m_Models[modelName] = this.m_Seq.define(modelName, fields, {
                timestamps: false,
                underscored: false,
                tableName: tables[modelName]
            });
        }

        return this.m_Models[modelName] as ModelStatic<any>;
    }
}