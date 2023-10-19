import { ConfigurationStore } from "@locii/truuth-aws-lib";
import { ConnectionInfo } from "@locii/truuth-db";

export class ConfigSettings {
  private readonly config: ConfigurationStore.ParameterStore;

  constructor() {
    this.config = new ConfigurationStore.ParameterStore();
  }


  async getConnectionInfo(alias: string): Promise<ConnectionInfo> {
    return JSON.parse(await this.config.getParameter(`/${process.env.APP}/${process.env.STAGE}/tenants/${alias}/mongodb`));
  }
}
