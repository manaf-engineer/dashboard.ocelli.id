import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Enforcer, newEnforcer, Util } from 'casbin';
import TypeORMAdapter from 'typeorm-adapter';

@Injectable()
export class CasbinService implements OnModuleInit {
  private enforcer: Enforcer;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeCasbin();
  }

  async initializeCasbin() {
    // Retrieve database-related configuration values from ConfigService
    const dbHost = this.configService.get<string>('dbHost');
    const dbPort = this.configService.get<number>('dbPort');
    const dbUser = this.configService.get<string>('dbUser');
    const dbPassword = this.configService.get<string>('dbPassword');
    const dbName = this.configService.get<string>('dbName');

    // Initialize a TypeORM adapter and use it in a Node-CasbinEnitity enforcer
    const adapter = await TypeORMAdapter.newAdapter({
      type: 'postgres',
      host: dbHost,
      port: dbPort,
      username: dbUser,
      password: dbPassword,
      database: dbName,
    });

    // Create a CasbinEnitity enforcer with the TypeORM adapter
    this.enforcer = await newEnforcer('src/config/model.conf', adapter);

    // Add matching function to allow generalization
    await this.enforcer.addNamedDomainMatchingFunc('g', Util.keyMatch2Func);

    // Load the policy from the database
    await this.enforcer.loadPolicy();
  }

  getEnforcer(): Enforcer {
    return this.enforcer;
  }

  async reloadPolicy() {
    // this.enforcer.clearPolicy();
    await this.enforcer.loadPolicy();
  }
}
