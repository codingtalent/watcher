import Dexie, { Table } from 'dexie';

/*export interface UserBlockChain {
  id?: number;
  blockchain: string;
}*/

export interface UserSwapsAlert {
  timestamp: number;
  status: number; // 0 new, 1 read
}
export interface UserSwapsAlertDetails {
  id?: number;
  block_time: string;
  amount_usd: number;
  token_pair: string;
  taker: string;
  tx_hash: string;
  project_contract_address: string;
  timestamp: number;
}

export interface UserSwapsAlertPool {
  id?: number;
  threshold: number;
  blockchain: string;
  pool_address: string;
}

export class MyDexie extends Dexie {
  //userBlockChain!: Table<UserBlockChain>; 
  userSwapsAlert!: Table<UserSwapsAlert>;
  userSwapsAlertDetails!: Table<UserSwapsAlertDetails>;
  userSwapsAlertPool!: Table<UserSwapsAlertPool>; 

  constructor() {
    super('watcherDB');
    this.version(1).stores({
      //userBlockChain: '++id, blockchain', // Primary key and indexed props
      userSwapsAlert: 'timestamp, status',
      userSwapsAlertDetails: '++id, block_time, amount_usd, token_pair, taker, tx_hash, project_contract_address, timestamp',
      userSwapsAlertPool: '++id, threshold, blockchain, pool_address',
    });
  }

  /*public async setUserBlockChain(data: UserBlockChain) {
    data.id = 1; // one user 
    const id = await this.userBlockChain.put(data);
    return id;
  }
  public async getUserBlockChain() {
    const userBc = await this.userBlockChain.where({
      id: 1}
    ).first();
    return userBc;
  }*/

  public async setSwapsAlertPool(data: UserSwapsAlertPool) {
    data.id = 1; // one user 
    const id = await this.userSwapsAlertPool.put(data);
    return id;
  }
  public async getSwapsAlertPool() {
    const userSAP = await this.userSwapsAlertPool.where({
      id: 1}
    ).first();
    return userSAP;
  }

  public async setUserSwapsAlert(timestamp: number, data: UserSwapsAlertDetails[]) {
    let usa: UserSwapsAlert = {
      timestamp: timestamp,
      status: 0
    }
    await this.userSwapsAlert.put(usa);
    await this.userSwapsAlertDetails.bulkPut(data)
    return timestamp;
  }
  public async getUserSwapsAlertCount() {
    const swapsAlert = await this.userSwapsAlert.where({
      status: 0}
    ).toArray();
    return swapsAlert.length;
  }
  public async getUserSwapsAlert(limit:number=10) {
    const swapsAlert = await this.userSwapsAlert.orderBy('timestamp').reverse().limit(limit).toArray();
    return swapsAlert;
  }
  public async getUserSwapsAlertDetails(timestamp: number[]) {
    const details = await this.userSwapsAlertDetails.where('timestamp').anyOf(timestamp).toArray();
    return details;
  }
  public async deleteUserSwapsAlertData(timestamp: number[]) {
    await this.userSwapsAlert.bulkDelete(timestamp);
    await this.userSwapsAlertDetails.where('timestamp').anyOf(timestamp).delete();
  }
}

export const db = new MyDexie();
