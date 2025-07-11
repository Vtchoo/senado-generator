import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class CreateFeedChannelsTable1699704181048 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'feed_channels',
                columns: [
                    { name: 'id', type: 'varchar', isPrimary: true, isUnique: true, isNullable: false },
                    { name: 'guildId', type: 'varchar', isUnique: true, isNullable: false },
                    { name: 'interval', type: 'int', isNullable: false, default: 1000 * 60 * 60 }
                ],
                foreignKeys: [
                    {
                        name: 'FK_feed_guild',
                        columnNames: ['guildId'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'guilds',
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('feed_channels')
    }

}
