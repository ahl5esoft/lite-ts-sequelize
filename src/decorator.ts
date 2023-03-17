import { DataType, ModelAttributeColumnOptions } from 'sequelize';

import { defines } from './defines';

/**
 * Sequelize字段定义装饰器
 * 
 * @param define 字段定义
 */
export function SeqelizeField(define: DataType | ModelAttributeColumnOptions<any>): PropertyDecorator {
    return (target: any, field: string) => {
        if (!defines[target.constructor.name])
            defines[target.constructor.name] = {};

        if (typeof define == 'function' || typeof define == 'string') {
            define = {
                allowNull: false,
                type: define,
            };
        } else {
            (define as ModelAttributeColumnOptions<any>).allowNull = false;
        }

        defines[target.constructor.name][field] = define;
    };
}