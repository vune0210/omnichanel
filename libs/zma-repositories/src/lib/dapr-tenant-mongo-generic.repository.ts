/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuid } from 'uuid';
import { DaprClient } from '@dapr/dapr'; // Assume appropriate Dapr SDK import
import { QueryOptions } from '../abstracts/query-options.interface';
import { ITenantGenericRepository } from '../abstracts/tenant-generic-repository.abstract';

export class DaprTenantMongoGenericRepository<T> implements ITenantGenericRepository<T> {
  protected storeName: string;
  protected daprClient: DaprClient;

  constructor(daprClient: DaprClient, storeName: string) {
    this.daprClient = daprClient;
    this.storeName = storeName;
  }

  private buildDaprFilter(mongoFilter: any): any {
    if (!mongoFilter || typeof mongoFilter !== 'object') return {};

    // Logical ops
    if (mongoFilter.$and) {
      const nodes = mongoFilter.$and.map((f: any) => this.buildDaprFilter(f));
      return nodes.length === 1 ? nodes[0] : { AND: nodes };
    }
    if (mongoFilter.$or) {
      const nodes = mongoFilter.$or.map((f: any) => this.buildDaprFilter(f));
      return nodes.length === 1 ? nodes[0] : { OR: nodes };
    }

    // Leaf ops
    const ands: any[] = [];
    for (const key of Object.keys(mongoFilter)) {
      const val = mongoFilter[key];

      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if (Array.isArray(val.$in)) {
          ands.push({ IN: { [key]: val.$in } });
          continue;
        }
        if (val.$gt !== undefined) { ands.push({ GT:  { [key]: val.$gt } }); continue; }
        if (val.$gte !== undefined){ ands.push({ GTE: { [key]: val.$gte } }); continue; }
        if (val.$lt !== undefined) { ands.push({ LT:  { [key]: val.$lt } }); continue; }
        if (val.$lte !== undefined){ ands.push({ LTE: { [key]: val.$lte } }); continue; }
        if (val.$ne !== undefined) { ands.push({ NEQ: { [key]: val.$ne } }); continue; }

        // Không hỗ trợ $regex trong Dapr Query → fallback EQ nguyên object (ít gặp)
        ands.push({ EQ: { [key]: val } });
        continue;
      }

      // primitive
      ands.push({ EQ: { [key]: val } });
    }

    if (ands.length === 0) return {};
    return ands.length === 1 ? ands[0] : { AND: ands };
  }
  
  // private buildDaprFilter(mongoFilter: any): any {
  //   if (!mongoFilter || typeof mongoFilter !== 'object') return {};

  //   // Logical ops
  //   if (mongoFilter.$and) {
  //     const nodes = mongoFilter.$and.map((f: any) => this.buildDaprFilter(f));
  //     return nodes.length === 1 ? nodes[0] : { AND: nodes };
  //   }
  //   if (mongoFilter.$or) {
  //     const nodes = mongoFilter.$or.map((f: any) => this.buildDaprFilter(f));
  //     return nodes.length === 1 ? nodes[0] : { OR: nodes };
  //   }

  //   // Leaf ops
  //   const ands: any[] = [];
  //   for (const key of Object.keys(mongoFilter)) {
  //     const val = mongoFilter[key];

  //     if (val && typeof val === 'object' && !Array.isArray(val)) {
  //       if (val.$regex !== undefined) {
  //         // Dapr Mongo hỗ trợ CONTAINS nhưng không hỗ trợ ignoreCase
  //         ands.push({ CONTAINS: { [key]: val.$regex } });
  //         continue;
  //       }
  //       if (Array.isArray(val.$in)) { ands.push({ IN: { [key]: val.$in } }); continue; }
  //       if (val.$gt !== undefined)  { ands.push({ GT:  { [key]: val.$gt } }); continue; }
  //       if (val.$gte !== undefined) { ands.push({ GTE: { [key]: val.$gte } }); continue; }
  //       if (val.$lt !== undefined)  { ands.push({ LT:  { [key]: val.$lt } }); continue; }
  //       if (val.$lte !== undefined) { ands.push({ LTE: { [key]: val.$lte } }); continue; }
  //       if (val.$ne !== undefined)  { ands.push({ NEQ: { [key]: val.$ne } }); continue; }

  //       ands.push({ EQ: { [key]: val } });
  //       continue;
  //     }

  //     // primitive
  //     ands.push({ EQ: { [key]: val } });
  //   }

  //   if (ands.length === 0) return {};
  //   return ands.length === 1 ? ands[0] : { AND: ands };
  // }

  private buildDaprSort(sort?: any): any[] {
    if (!sort) return [];
    if (typeof sort === 'string') {
      return sort.split(/\s+/).filter(Boolean).map((s) => {
        const field = s.startsWith('-') ? s.slice(1) : s;
        const order = s.startsWith('-') ? 'DESC' : 'ASC';
        return { key: field, order };
      });
    }
    if (typeof sort === 'object') {
      return Object.entries(sort).map(([k, v]) => ({
        key: k,
        order: (v === -1 || String(v).toLowerCase() === 'desc') ? 'DESC' : 'ASC',
      }));
    }
    return [];
  }

  private async find(tenantId: string, query: any, options?: QueryOptions): Promise<T[]> {
    const { limit = 10, skip = 0, sort } = options || {};
    const mongoQuery = { ...query };
    if (tenantId) {
      mongoQuery.tenantId = tenantId;
    }
    const daprFilter = this.buildDaprFilter(mongoQuery);
    const daprSort = this.buildDaprSort(sort);

    let token: string | undefined = undefined;
    let currentSkip = 0;

    // Skip by fetching and discarding batches
    while (currentSkip < skip) {
      const batchSize = Math.min(skip - currentSkip, 100);
      const response: any = await this.daprClient.state.query(this.storeName, {
        filter: daprFilter,
        sort: daprSort,
        page: { limit: batchSize, token },
      });
      currentSkip += response.results?.length || 0;
      token = response.token;
      if (!token) break;
    }

    if (currentSkip < skip) return [];

    // Fetch the actual page
    const response: any = await this.daprClient.state.query(this.storeName, {
      filter: daprFilter,
      sort: daprSort,
      page: { limit, token },
    });

    return (response.results || []).map((r: any) => (r.data ?? r.value) as T);
  }

  async findMany({
    tenantId,
    find,
    options,
  }: {
    tenantId: string;
    find: { item?: Partial<T>; filter?: any };
    options?: QueryOptions;
  }): Promise<T[]> {
    return this.find(tenantId, find.item || find.filter, options);
  }

  async findManyByIds({
    tenantId,
    ids,
    options,
  }: {
    tenantId: string;
    ids: (string | number)[];
    options?: QueryOptions;
  }): Promise<T[]> {
    return this.find(tenantId, { _id: { $in: ids } }, options);
  }

  async findAll({ tenantId, params }: { tenantId: string; params?: QueryOptions }): Promise<T[]> {
    return this.find(tenantId, {}, params);
  }

  async findOne({
    tenantId,
    find,
  }: {
    tenantId: string;
    find?: { item?: Partial<T>; filter?: any };
  }): Promise<T | null> {
    const results = await this.find(tenantId, find?.item || find?.filter, { limit: 1 });
    return results[0] || null;
  }

  async findById({ tenantId, id }: { tenantId: string; id: string | number }): Promise<T | null> {
    const key = `${tenantId}_${id}`;
    const result = await this.daprClient.state.get(this.storeName, key);
    return result ? (result as T) : null;
  }

  async create({ tenantId, item }: { tenantId: string; item: T }): Promise<T> {
    const newItem: any = { ...item };
    if (!newItem._id) {
      newItem._id = uuid();
    }
    newItem.tenantId = tenantId;
    const key = `${tenantId}_${newItem._id}`;
    await this.daprClient.state.save(this.storeName, [{ key, value: newItem }]);
    return newItem;
  }

  async createMany({ tenantId, items }: { tenantId: string; items: T[] }): Promise<T[]> {
    const newItems = items.map(item => {
      const newItem: any = { ...item };
      if (!newItem._id) {
        newItem._id = uuid();
      }
      newItem.tenantId = tenantId;
      const key = `${tenantId}_${newItem._id}`;
      return { key, value: newItem };
    });
    await this.daprClient.state.save(this.storeName, newItems);
    return newItems.map(i => i.value);
  }

  async updateOne({
    tenantId,
    id,
    update,
    options,
  }: {
    tenantId: string;
    id: string | number;
    update: { item?: Partial<T>; operator?: any };
    options?: QueryOptions;
  }): Promise<T | null> {
    const key = `${tenantId}_${id}`;
    const current: any = await this.daprClient.state.get(this.storeName, key);
    if (!current) return null;
    const updateData = update.item || (update.operator?.$set || update.operator);
    const updated = { ...current, ...updateData };
    await this.daprClient.state.save(this.storeName, [{ key, value: updated }]);
    return updated as T;
  }

  async createOrUpdate({
    tenantId,
    id,
    update,
  }: {
    tenantId: string;
    id: string | number;
    update: { item?: Partial<T>; operator?: any };
  }): Promise<T> {
    const key = `${tenantId}_${id}`;
    let current: any = await this.daprClient.state.get(this.storeName, key);
    if (!current) {
      current = { _id: id, tenantId };
    }
    const updateData = update.item || (update.operator?.$set || update.operator);
    const updated = { ...current, ...updateData };
    await this.daprClient.state.save(this.storeName, [{ key, value: updated }]);
    return updated as T;
  }

  async updateManyByIds({
    tenantId,
    ids,
    item,
  }: {
    tenantId: string;
    ids: (string | number)[];
    item: Partial<T>;
  }): Promise<{ modifiedCount: number }> {
    const results = await this.findManyByIds({ tenantId, ids, options: { limit: 10000 } });
    const updatedItems = results.map(r => {
      const updated: any = { ...r, ...item };
      const key = `${tenantId}_${(r as any)._id}`;
      return { key, value: updated };
    });
    await this.daprClient.state.save(this.storeName, updatedItems);
    return { modifiedCount: updatedItems.length };
  }

  async updateMany({
    tenantId,
    filter,
    item,
  }: {
    tenantId: string;
    filter?: any;
    item: Partial<T>;
  }): Promise<{ modifiedCount: number }> {
    const results = await this.find(tenantId, filter || {}, { limit: 10000 });
    const updatedItems = results.map(r => {
      const updated: any = { ...r, ...item };
      const key = `${tenantId}_${(r as any)._id}`;
      return { key, value: updated };
    });
    await this.daprClient.state.save(this.storeName, updatedItems);
    return { modifiedCount: updatedItems.length };
  }

  async aggregate({ pipeline }: { pipeline: any[] }): Promise<any[]> {
    // Limited support: Assume simple $match pipeline, otherwise not implemented
    if (pipeline[0]?.$match) {
      return this.find('', pipeline[0].$match, {});
    }
    throw new Error('Aggregate not fully supported in Dapr state store');
  }
}