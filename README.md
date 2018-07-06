# mongodb

## 1.安装

- mongodb默认会在`mongo`命令启动的盘符的根目录下的`data/db`中存储数据。
- 使用`mongod --dbpath pathname`来指定`mongodb`存储数据的位置

## 2.连接`mongodb`

- 在命令行中输入 `mongo` 命令，默认连接本地数据库

- 连接mongodb

  ```shell
  #连接mongodb的标准格式
  mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]
  ```

  + mongodb：//：是固定格式，必须要指定

  + `[username:password@]`：如果设置，连接时驱动会尝试登陆这个数据库

  + `host`:要连接的服务器的地址

  + `[port]`：默认为`27017`

  + `[/database]`:要连接的数据库，默认为`test`数据库
    ```shell
    mongodb://admin:123456@localhost/
    ```

## 3.数据库基础操作
 - 使用`use`创建，如果不存在这个数据库，则新建，存在则切换到该数据库 
   ```shell
   use DATABASE_NAME
   ```

- 查看所有数据库
   ```shell
    show dbs
    #当前数据库
    db
   ```

- 删除数据库
  ```shell
  # 删除正在使用的数据库
   db.dropDatabase()
  ```

- 创建集合
  ```shell
  db.createCollection(name,option)
  #查看当前数据库下的集合
  show collections
  ```
  + `name`:要创建的集合的名称
  + `option`:指定有关内存大小以及索引的选项
    * `capped`:（可选）如果为`true`，则创建固定集合，达到最大值时，会自动覆盖最早的文档，必须指定`size`。
    * `autoIndexId`:（可选）如为`true`，自动在`_id`字段创建索引。默认为`false`。
    * `size`:（可选）为固定集合指定最大值。
    * `max`:（可选）指定固定集合中包含文档的最大数量。

- 删除集合

   ```shell
   # collection是当前数据库中要删除的集合名称
   db.collection.drop()
   ```

- 插入文档

   ```shell
   db.collection_name.insert(document)
   #查看某个集合中的文档  document 为 json格式
   db.collection_name.find()
   #可用js的for循环生成
   for(var i =0;i < 10;i++){ db.students.insert({title:'MySql' +i,description:'MYSQL' +i})}
   #结果
   { "_id" : ObjectId("5b3c132758c4fdd5aa9aadf1"), "title" : "MySql0", "description" : "MYSQL0" }
   { "_id" : ObjectId("5b3c132758c4fdd5aa9aadf2"), "title" : "MySql1", "description" : "MYSQL1" }
   { "_id" : ObjectId("5b3c132758c4fdd5aa9aadf3"), "title" : "MySql2", "description" : "MYSQL2" }
   { "_id" : ObjectId("5b3c132758c4fdd5aa9aadf4"), "title" : "MySql3", "description" : "MYSQL3" }
   { "_id" : ObjectId("5b3c132758c4fdd5aa9aadf5"), "title" : "MySql4", "description" : "MYSQL4" }
   ...
   ```

   + `collection_name`是要插入文档的集合名称，如果`collection_name`在当前数据库中不存在时，会自动新建
   + `document`是文档对象,格式是`{title:'MongoDB'}`

- 更新文档

   ```shell
   db.collection_name.update(<query>,<update>,{upsert:<boolean>,multi:<boolean>,writeConcern:<document>})
   ```

   + `query`:`update`的查询条件
   + `update`:`update`的对象和一些更新的操作符。
   + `upsert`:默认是`false`
   + `multi`:默认只更新查询到的第一条数据，设置为`true`，会更新查到的所有数据
   + `writeConcern`:(可选)抛出异常的级别

- 查询文档

   ```shell
   #若要使按照JSON格式输出，可在find()后跟pretty()
   db.collection_name.find(query,Projection)
   db.collection_name.find().pretty()
   #只返回一个文档
   db.collection_name.findOne()
   ```

   + `query`:(可选)查询条件

   + `Projection`:(可选)有两种模式，`inclusion`模式和`exclusion`,默认返回所有键。

     * `inclusion`:指定返回的键，不返回其他键

       ```shell
       #{ "_id" : ObjectId("5b3c0ac358c4fdd5aa9aade6"), "title" : "MySql", "description" : "MYSQL" }
       #inclusion模式
       db.students.find({title:'MySql'},{title:1})
       #只返回title键，不可以同时使用两种模式即db.students.find({title:'MySql'},{title：1，description:0})
       { "_id" : ObjectId("5b3c0ac358c4fdd5aa9aade6"), "title" : "MySql" }
       ```

     * `exclusion`:指定不返回的键

       ```shell
       db.students.find({title:'MySql'},{title:0})
       #返回的结果
       { "_id" : ObjectId("5b3c0ac358c4fdd5aa9aade6"), "description" : "MYSQL" }
       ```




- 比较条件

  ```shell
   #等于 格式：{key:value} 如：
   db.students.find({title:'MySql'})
   #小于 格式：{key:{$lt:value}}
   db.students.find({age:{$lt:20}})
   #小于等于 格式：{key:<$lte:value>}
   db.students.find({age:{$lte:20}})
   #大于 格式：{<key>:{$gt:value}}
   db.students.find({age:{$gt:20}})
   #大于等于 格式：{key:{$gte:value}}
   db.students.find({age:{$gte:20}})
   #不等于 格式：{key:{$ne:value}}
   db.students.find({title:{$ne:'mongodb'}})
  ```

  

   + `AND`条件

     ```shell
     #多个查询条件用 ',' 分隔。 格式：{key1：value1,key2:value2}
     db.students.find({name:'zhangsan',age:'20'})
     ```

   + `OR`条件

     ```shell
     #使用$or关键字 
     db.students.find({$or:[{key1:value1},{key2:value2}]})
     ```

   + `AND`和`OR`结合

     ```shell
     db.collection_name.find({$or:[{key1:value1},{key2:value2}],{key3:value3}})
     ```

   + 范围运算符（`$in`、`$nin`）

     ```shell
     #返回在[]的值的文档
     #如查询年龄是20，30的
     db.collection_name.find({age:{$in:[20,30]}})
     #不在[]中的
     db.collection_name.find({age:{$nin:[10,20]}})
     ```

   + 支持正则表达式查询

     ```shell
     db.collection_name.find({name:/^a/})
     db.collection_name.find({name:{$regex:'^a'}})
     ```

   + 自定义查询

     使用`$where`操作符,跟一个函数，返回一个结果是`true`的文档。

     ```shell
     #比如查询年龄在10-20之间的学生
     db.students.find({$where:function(){return this.age>10&&this.age<20}})
     ```

- `$type`操作符

   ```shell
   #查询集合中title为String数据类型的文档，$type对应的Number可查表
   db.collection_name.find({title:{$type:2}})
   ```

- `limit`和`skip`方法

   ```shell
   #limit()接受一个Number参数，只取得查询出的number个文档
   db.collection_name.find().limit(n)
   #skip()接受一个Number参数，跳过n个文档
   db.collection_name.find().limit(n)
   #skip优先级比limit优先级高，会先执行skip
   db.collection_name.find().limit(2).skip(3) #只会取得查询到的文档中的第4，5个文档
   ```

- 排序（`sort`方法）

   ```shell
   #sort优先级更高 按照key进行排序，1：升序，-1:降序
   db.collection_name.sort({key:1})
   ```

- 索引

   ```shell
   #createIndex()
   db.collection_name.createIndex(key,options)
   ```

- 统计个数

   ```shell
   #使用count()
   db.students.find().count()
   db.students.find({age:{$gte:15}}).count()
   db.stundents.count({age:{$gte:15}})
   ```

- 去重

   ```shell
   #distinct(去重字段,查询条件)
   db.students.distinct('name',{age:{$gt:23}})
   #result中只包含name字段的值
   ```

# 4.数据库高级操作

	## 4.1 聚合(`aggregate`主要用于计算数据)

```shell
db.collection_name.aggregate([{管道:{表达式}}])
```

###   管道（将前一次操作的结果作为下一次的输入）

  - 常用管道

    - `$group`：将集合中的文档分组，可用于统计结果

      ```shell
      #_id:'$name' 表示按照哪个列进行分组
      #$sum:'$age',将相同'name'的'age'相加
      db.students.aggregate([{$group:{_id:'$name',counter:{$sum:'$age'}}}])
      #result
      { "_id" : "htk", "couter" : 245 }
      #将文档内容加入到结果集的数组
      db.students.aggergate([{$group:{_id:'$name',name:{$push:$$ROOT}}}])
      ```

    - `$match`:用于过滤数据，只输出符合条件的文档

      ```shell
      #过滤出age大于23的
      db.students.aggregate([{$match:{age:{$gt:23}}}])
      #过滤出age大于23，并分组
      db.students.aggregate([{$match:{age:{$gt:23}}},{$group:{_id:'$name',counter:{$sum:1}}}])
      ```

    - `$project`:投影，控制输出结果的显示情况

      ```shell
      # 0 不显示，1 显示
      db.students.aggregate([{$group:{_id:'$name',counter:{$sum:1}}},{$project:{_id:0,counter:1}}])
      ```

    - `$sort`:将输入文档排序后输出

      ```shell
      db.students.aggregate([{$sort:{age:-1}}])
      ```

    - `$limit`:限制聚合管道返回的文档数

      ```shell
      #输出前两条
      db.students.aggregate([{$limit:2}])
      ```

    - `$skip`：跳过指定数量的文档，并返回余下的文档

      ```shell
      #跳过前两条
      db.students.aggregate([$skip:2])
      ```

    - `$unwind`：对某字段值进行拆分

      ```shell
      db.students.aggregate([$unwind:'$fenshu'])
      #空数组、非数组、无字段、null情况,为防止数据丢失
      db.students.aggregate([$unwind:{path:'$fenshu',preserveNullAndEmptyArrays:true}])
      ```

###   表达式

```shell
表达式：'$列名'
```

- 常用表达式
  + `$sum`:计算总和，$sum:1同count表示计数
  + `$avg`:计算平均值
  + `$min`:计算最小值
  + `$max`:计算最大值
  + `$push`:在结果文档中插入值到一个数组中
  + `$first`:根据资源文档的排序获取第一个文档数据
  + `$last`:根据资源文档的排序获取最后一个文档数据

## 4.2 安全

 - 创建超级管理员

   ```shell
   use admin
   db.createUser({
       user:'admin',
       pwd:'123',
       roles:[{role:'root',db:'admin'}]
   })
   ```

    - 修改配置

      ```shell
      sudo vi /etc/mongod.conf
      #修改一下部分
      security:
        authorization: enabled
      # 重启服务
      sudo service mongod stop
      sudo service mongod start
      #连接（用户）
      mongo -u 'username' -p 'userpassword' --authenticationDatabase 'admin'
      ```

