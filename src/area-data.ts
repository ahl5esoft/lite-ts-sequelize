import { EnumItem } from 'lite-ts-enum';

export class AreaData extends EnumItem {
    /**
     * 完整的数据库连接信息
     */
    public fullConnectionString: {
        [app: string]: string;
    };
}