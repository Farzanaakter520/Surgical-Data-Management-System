const db = require('./shared/database.js');
const Utils = require('../utils/utils.js');

class DBCRUDService {
  constructor(schema, procedureName) {
    if (!schema || !procedureName) {
      throw new Error('Schema and procedure name are required');
    }
    this.schema = schema;
    this.procedureName = procedureName;
  }

  async executeStoredProcedure(params) {
    try {
      const query = `CALL ${this.schema}.${this.procedureName}($1::jsonb, $2::jsonb)`;
      const result = await db.query(query, [JSON.stringify(params), null]);
      return result.rows?.[0]?.result || null;
    } catch (error) {
      throw new Error(`Failed to execute stored procedure: ${error.message}`);
    }
  }

  async getById(params) {
    return this.executeStoredProcedure({ action_mode: 'getById', ...params });
  }

  async getList(params) {
    return this.executeStoredProcedure({
      action_mode: params.action_mode ? params.action_mode.toLowerCase() : 'getList',
      ...params,
    });
  }

  async create(params) {
    return this.executeStoredProcedure({ action_mode: 'insert', ...params });
  }

  async update(params) {
    return this.executeStoredProcedure({ action_mode: 'update', ...params });
  }

  async delete(params) {
    return this.executeStoredProcedure({ action_mode: 'delete', ...params });
  }
}

module.exports = DBCRUDService;
