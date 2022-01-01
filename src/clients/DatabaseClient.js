import MongoClient from 'mongodb';
import { DATABASE_CONFIGS } from '../constants.js';
import * as Logger from '../logger.js';

class DatabaseClient {
  constructor() {
    this.logger = Logger.getInstance();
    this.DB_CONFIG = DATABASE_CONFIGS.MY_STOCK_DB;
    const { USERNAME, PASSWORD, HOSTNAME } = this.DB_CONFIG;
    this.uri = `mongodb+srv://${USERNAME}:${PASSWORD}@${HOSTNAME}`;
  }

  async connect() {
    this.logger.info(`Attempting to connect to database ${this.DB_CONFIG.NAME}`);
    this.client = await MongoClient.connect(this.uri, { useUnifiedTopology: true });
    this.db = this.client.db(this.DB_CONFIG.NAME);
    this.logger.info(`Successfully connected to database ${this.DB_CONFIG.NAME}`);
  }

  async find(collection, target) {
    return await this.db.collection(collection).find(target).toArray();
  }

  async findMax(collection, field) {
    const result = await this.db.collection(collection).find().sort({ [field]: -1 }).limit(1).toArray();
    if (result.length === 0) return null;
    return result[0][field];
  }

  async findMin(collection, field) {
    const result = await this.db.collection(collection).find().sort({ [field]: +1 }).limit(1).toArray();
    if (result.length === 0) return null;
    return result[0][field];
  }

  async insert(collection, target) {
    if (Array.isArray(target)) {
      return await this.db.collection(collection).insertMany(target);
    }
    return await this.db.collection(collection).insertOne(target);
  }

  async updateOne(collection, target, updated) {
    return await this.db.collection(collection).updateOne(target, {$set: updated});
  }

  async updateMany(collection, target, updated) {
    return await this.db.collection(collection).updateMany(target, {$set: updated});
  }
}

let instance;
export const getInstance = () => {
  if (!instance) {
    instance = new DatabaseClient();
    instance.connect((err) => {
      this.logger.error(`Error occurred when attempt to connect to database ${this.DB_CONFIG.NAME}`, err);
    });
  }
  return instance;
};