const db = require('./shared/database');
const Utils = require('../utils/utils');

class DBCRUDService {
  constructor(schema, procedureName) {
    if (!procedureName) {
      throw new Error('Procedure name is required');
    }

    this.schema = schema;
    this.procedureName = procedureName;
    this.tempTableName = tempTableName; // ✅ assign properly
  }

  getFullProcedureName() {
    return this.schema ? `${this.schema}.${this.procedureName}` : this.procedureName;
  }

  async executeStoredProcedure(params) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Procedure call - only one parameter
      await client.query(`CALL ${this.getFullProcedureName()}($1::json)`, [JSON.stringify(params)]);


      // Fetch result from temp table
      if (!this.tempTableName) {
        await client.query('COMMIT');
        return null; // No temp table defined
      }

      const selectResult = await client.query(`SELECT result FROM ${this.tempTableName}`);
      await client.query('COMMIT');
      return selectResult.rows[0]?.result || null;

    } catch (err) {
      await client.query('ROLLBACK');
      throw new Error(`Failed to execute stored procedure: ${err.message}`);
    } finally {
      client.release();
    }
  }

  async getById(params) {
    return await this.executeStoredProcedure({
      action_mode: 'getById',
      ...params
    });
  }

  async getList(params) {
    return await this.executeStoredProcedure({
      action_mode: 'getList',
      ...params
    });
  }

  async create(params) {
    return await this.executeStoredProcedure({
      action_mode: 'insert',
      ...params
    });
  }

  async update(params) {
    return await this.executeStoredProcedure({
      action_mode: 'update',
      ...params
    });
  }

  async delete(params) {
    return await this.executeStoredProcedure({
      action_mode: 'delete',
      ...params
    });
  }
}

module.exports = DBCRUDService;
