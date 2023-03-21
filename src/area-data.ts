import { EnumItem } from 'lite-ts-enum';

export class AreaData extends EnumItem {
    /**
     * 子库的完整数据库连接信息
     */
    public subFullConnection: {
        [app: string]: string;
    };
}