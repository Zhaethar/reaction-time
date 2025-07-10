// .netlify/functions/saveScore.js

import { neon } from '@netlify/neon';

export async function handler(event) {
  const sql = neon();
  const { time } = JSON.parse(event.body);
  await sql`INSERT INTO ranking (time) VALUES (${time})`;
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "기록 저장됨!" })
  };
}
