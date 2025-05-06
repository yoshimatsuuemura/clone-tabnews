import database from "infra/database.js";

async function status(request, response) {
  const updateAt = new Date().toISOString();

  const versaoResult = await database.query("SHOW server_version;");
  const versaoPostgres = versaoResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnections = parseInt(
    maxConnectionsResult.rows[0].max_connections,
    10,
  );
  const databaseName = process.env.POSTGRES_DB;
  const activeConnectionsResult = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1; ",
    values: [databaseName],
  });
  const activeConnections = parseInt(activeConnectionsResult.rows[0].count);

  response.status(200).json({
    updated_at: updateAt,
    dependencies: {
      database: {
        version: versaoPostgres,
        max_connection: parseInt(maxConnections),
        active_connections: activeConnections,
      },
    },
  });
}

export default status;
