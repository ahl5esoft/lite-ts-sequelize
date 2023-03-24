# ![Version](https://img.shields.io/badge/version-1.3.1-green.svg)

支持 mongo 4.x 以上版本

## 安装

```
npm install lite-ts-sequelize
```

### Node.js 支持

Node.js 需要 `v14` 版本以上

## 使用

```typescript
import { SequelizeDbFactory, modelDbOption } from "lite-ts-sequelize";

class TestModel {
  public id: string;
  public name: string;
}

async function main() {
  const dbFactory = new SequelizeDbFactory(
    "mysql://root:localhost:27017/test",
    {
      logging: false,
    }
  );

  // 添加数据
  await dbFactory.db<TestModel>(modelDbOption(TestModel)).add({
    id: "id-1",
    name: "name 1",
  });

  // 更新数据
  await dbFactory.db<TestModel>(modelDbOption(TestModel)).save({
    id: "id-1",
    name: "name 1 save",
  });

  // 删除数据
  await dbFactory.db<TestModel>(modelDbOption(TestModel)).remove({
    id: "id-1",
  } as TestModel);

  // 查询数据
  await dbFactory
    .db<TestModel>(modelDbOption(modelDbOption(TestModel)))
    .query()
    .toArray({
      where: {
        name: "name 1",
      },
      order: ["id"], // 根据 id 正序
      orderByDesc: ["id"], // 根据 id 倒序
      skip: 0, // 跳过多少条数据, 默认为 0
      take: 100, // 获取多少条数据
    });

  // sql查询数据
  await dbFactory
    .db<TestModel>(modelDbOption(modelDbOption(TestModel)))
    .query()
    .toArray({
      where: {
        sql: "select * from TestModel where appid = ?",
        options: {
          replacements: [],
          type: QueryTypes.SELECT,
        },
      },
    });
}
```
