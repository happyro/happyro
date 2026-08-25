# 导入目录

## 导入目录的用途是什么？

`import/` 目录允许你修改配置，而无需改动主 `/conf/` 和 `/db/` 文件。

将自定义条目放入这两个位置中的 `import/` 目录后，更新服务器时无需解决核心文件冲突。你只需保存自己的更改，其余内容由 rAthena 更新。

## 它是如何工作的？

可以将“import”理解为“覆盖”。只需在导入文件中放入你修改或正在“覆盖”的设置。

For example, when setting up a server there are always a few config settings that users would like to change in order for rAthena to suit their needs. The following example will show you how to use the `/db/import/` directory correctly. (for `/conf/import/` examples, see [/conf/readme.md](/conf/readme.md))

### 成就
---
我们要添加自定义成就：一个可通过 NPC 脚本授予玩家，另一个可授予 GM。

#### /db/import/achievement_db.yml

```yml
    - Id: 280000
      Group: None
      Name: Emperio
      Reward:
        TitleId: 1035
      Score: 50
    - Id: 280001
      Group: None
      Name: Staff
      Reward:
        TitleId: 1036
      Score: 50
```


### 副本
---
我们要添加自定义住宅副本。

#### /db/import/instance_db.yml

```yml
    - Id: 35
      Name: Home
      IdleTimeOut: 900
      Enter:
        Map: 1@home
        X: 24
        Y: 6
      AdditionalMaps:
        - Map: 2@home
        - Map: 3@home
```


### 怪物别名
---
我们要让波利显示为巴风特的外观。

#### /db/import/mob_avail.yml

```yml
    - Mob: PORING
      Sprite: BAPHOMET
```


### 自定义地图
---
我们要添加自定义地图。需要先将地图名称加入 `import/map_index.txt`，再写入 `import/map_cache.dat`，供地图服务器加载。

#### /db/import/map_index.txt

```
    1@home	1250
    2@home
    3@home
    ev_has
    shops
    prt_pvp
```


### 物品交易限制
---
我们要确保特定物品不能交易、出售、丢弃或存入仓库等。

#### /db/import/item_db.yml

```yml
    - Id: 34000 # Old Green Box
      Trade:
        NoDrop: true
        NoTrade: true
        TradePartner: true
        NoSell: true
        NoCart: true
        NoStorage: true
        NoGuildStorage: true
        NoMail: true
        NoAuction: true
    - Id: 34001 # House Keys
      Trade:
        NoDrop: true
        NoTrade: true
        TradePartner: true
        NoSell: true
        NoCart: true
        NoStorage: true
        NoGuildStorage: true
        NoMail: true
        NoAuction: true
    - Id: 34002 # Reputation Journal
      Trade:
        NoDrop: true
        NoTrade: true
        TradePartner: true
        NoSell: true
        NoCart: true
        NoStorage: true
        NoGuildStorage: true
        NoMail: true
        NoAuction: true
```


### 自定义任务
---
我们要向 quest_db 添加自定义任务。

#### /db/import/quest_db.yml

```yml
    - Id: 89001
      Title: "Reputation Quest"
    - Id: 89002
      Title: "Reputation Quest"
```



这个系统对所有人都非常有帮助。只要使用 `import/` 系统，大多数 Git 冲突都会消失。
