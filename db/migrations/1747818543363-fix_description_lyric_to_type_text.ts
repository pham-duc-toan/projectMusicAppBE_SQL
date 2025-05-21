import { MigrationInterface, QueryRunner } from "typeorm";

export class FixDescriptionLyricToTypeText1747818543363 implements MigrationInterface {
    name = 'FixDescriptionLyricToTypeText1747818543363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`singer\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`topic\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`topic\` ADD \`description\` text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_f2343efcc33d8bdbcffda2a777a\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_8579bf9bed238198c2349c217c2\``);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`lyrics\``);
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`lyrics\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`singerId\` \`singerId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`topicId\` \`topicId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`play_list\` DROP FOREIGN KEY \`FK_fd872a93c13bfaecc18111a47e6\``);
        await queryRunner.query(`ALTER TABLE \`play_list\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`play_list\` CHANGE \`userId\` \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c79b947bd74e21899903bdda128\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`roleId\` \`roleId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`singerIdId\` \`singerIdId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_f2343efcc33d8bdbcffda2a777a\` FOREIGN KEY (\`singerId\`) REFERENCES \`singer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_8579bf9bed238198c2349c217c2\` FOREIGN KEY (\`topicId\`) REFERENCES \`topic\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`play_list\` ADD CONSTRAINT \`FK_fd872a93c13bfaecc18111a47e6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c79b947bd74e21899903bdda128\` FOREIGN KEY (\`singerIdId\`) REFERENCES \`singer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c79b947bd74e21899903bdda128\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_c28e52f758e7bbc53828db92194\``);
        await queryRunner.query(`ALTER TABLE \`play_list\` DROP FOREIGN KEY \`FK_fd872a93c13bfaecc18111a47e6\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_8579bf9bed238198c2349c217c2\``);
        await queryRunner.query(`ALTER TABLE \`song\` DROP FOREIGN KEY \`FK_f2343efcc33d8bdbcffda2a777a\``);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`singerIdId\` \`singerIdId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`roleId\` \`roleId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c79b947bd74e21899903bdda128\` FOREIGN KEY (\`singerIdId\`) REFERENCES \`singer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_c28e52f758e7bbc53828db92194\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`role\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`play_list\` CHANGE \`userId\` \`userId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`play_list\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`play_list\` ADD CONSTRAINT \`FK_fd872a93c13bfaecc18111a47e6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`topicId\` \`topicId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`singerId\` \`singerId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`lyrics\``);
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`lyrics\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`song\` ADD \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song\` CHANGE \`avatar\` \`avatar\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_8579bf9bed238198c2349c217c2\` FOREIGN KEY (\`topicId\`) REFERENCES \`topic\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`song\` ADD CONSTRAINT \`FK_f2343efcc33d8bdbcffda2a777a\` FOREIGN KEY (\`singerId\`) REFERENCES \`singer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`topic\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`topic\` ADD \`description\` varchar(255) NOT NULL DEFAULT ''''`);
        await queryRunner.query(`ALTER TABLE \`singer\` CHANGE \`deletedAt\` \`deletedAt\` datetime NULL DEFAULT 'NULL'`);
    }

}
