import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

dotenv.config();

const config = {
  name: 'chatDb',
  connector: 'mysql',
  url: '',
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ChatDbDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'chatDb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.chatDb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
