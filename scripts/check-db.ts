import { readFileSync } from 'fs'
import { join } from 'path'
import { Client } from 'pg'

function loadDotenvIfNeeded() {
  if (process.env.DATABASE_URL) return
  try {
    const envPath = join(process.cwd(), '.env')
    const content = readFileSync(envPath, 'utf8')
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_0-9]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      const key = m[1]
      let val = m[2]
      // Remove surrounding quotes
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      if (!(key in process.env)) process.env[key] = val
    }
  } catch (e) {
    // ignore
  }
}

async function main(){
  loadDotenvIfNeeded()
  const conn = process.env.DATABASE_URL
  if(!conn){
    console.error('DATABASE_URL not found in environment')
    process.exit(2)
  }

  const client = new Client({ connectionString: conn })
  try{
    await client.connect()
    const res = await client.query('SELECT version()')
    console.log('Connected to DB:', res.rows[0])
    await client.end()
    process.exit(0)
  }catch(err:any){
    console.error('DB connection error:', err.message || err)
    process.exit(1)
  }
}

main()
