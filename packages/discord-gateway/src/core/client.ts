import { Client, Collection, ClientOptions } from 'discord.js';

export class webareClient extends Client {
  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }

  public commands: Collection<String, object>;
}
