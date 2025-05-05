import { Client, CLient } from "pg";

async function query(queryObject) {
  const client = new Client();
  await client.connect();
  const result = await client.query(queryObject);
  await client.end();
}

export default {
  query: query,
};
