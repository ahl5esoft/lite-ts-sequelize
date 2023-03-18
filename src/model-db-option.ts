import { DbOption, DbRepository } from 'lite-ts-db';

import { SequelizeAreaDbFactory } from './area-db-factory';
import { AreaDbQuery } from './area-db-query';
import { SequelizeDbFactory } from './db-factory';
import { SequelizeDbQuery } from './db-query';

export function modelDbOption(model: any): DbOption {
    return (dbFactory, dbRepo_) => {
        const dbRepo = dbRepo_ as DbRepository<any>;
        dbRepo.model = typeof model == 'string' ? model : model.ctor ?? model.name;
        dbRepo.createQueryFunc(() => {
            const sequelizeAreaDbFactory = dbFactory as SequelizeAreaDbFactory;
            if (dbRepo.areaNo && sequelizeAreaDbFactory.getAreaDbFactory) {
                return new AreaDbQuery(
                    dbRepo.areaNo,
                    sequelizeAreaDbFactory,
                    dbRepo.dbOptions
                );
            }

            return new SequelizeDbQuery(
                (dbFactory as SequelizeDbFactory).modelPool,
                dbRepo.model
            );
        });
    };
}