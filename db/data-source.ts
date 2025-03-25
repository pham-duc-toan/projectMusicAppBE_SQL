import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
ConfigModule.forRoot({
  isGlobal: true,
});
const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mssql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 1433),
  username: configService.get<string>('DB_USER', 'sa'),
  password: configService.get<string>('DB_PASSWORD', 'yourStrong(!)Password'),
  database: configService.get<string>('DB_NAME', 'music_app_db'),
  entities: ['dist/**/*.entity.js'],
  synchronize: false, // Tự động tạo bảng mà không cần migration
  migrations: ['dist/db/migrations/*.js'],
  extra: {
    trustServerCertificate: true,
  },
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
// npm run migration:generate -- db/migrations/ten
// npm run migration:run
