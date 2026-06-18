#!/usr/bin/env node
/**
 * Strongmoon Labs — VPS Monitoring Agent (Node.js)
 *
 * Setup:
 *   npm install express
 *   AGENT_TOKEN=your_secret_token PORT=9000 node node-agent.js
 *
 * Or with PM2:
 *   AGENT_TOKEN=your_secret_token pm2 start node-agent.js --name monitor-agent
 */

const express = require('express')
const os = require('os')
const { execSync } = require('child_process')

const TOKEN = process.env.AGENT_TOKEN
const PORT = process.env.PORT || 9000

if (!TOKEN) {
  console.error('ERROR: AGENT_TOKEN environment variable is required')
  process.exit(1)
}

const app = express()

function getDisk() {
  try {
    const out = execSync("df -B1 / | tail -1").toString().trim().split(/\s+/)
    const total = parseInt(out[1])
    const used = parseInt(out[2])
    const free = parseInt(out[3])
    return { total, used, free, percent: Math.round((used / total) * 100) }
  } catch {
    return { total: 0, used: 0, free: 0, percent: 0 }
  }
}

function getPm2() {
  try {
    const out = execSync('pm2 jlist 2>/dev/null', { timeout: 3000 }).toString()
    const list = JSON.parse(out)
    return list.map(p => ({
      name: p.name,
      status: p.pm2_env?.status ?? 'unknown',
      cpu: p.monit?.cpu ?? 0,
      memory: p.monit?.memory ?? 0,
      restarts: p.pm2_env?.restart_time ?? 0,
    }))
  } catch {
    return []
  }
}

let prevCpuSample = null
let lastCpuPercent = 0

function sampleCpu() {
  const cpus = os.cpus()
  return cpus.reduce((sum, cpu) => {
    const t = Object.values(cpu.times).reduce((a, b) => a + b, 0)
    return { total: sum.total + t, idle: sum.idle + cpu.times.idle }
  }, { total: 0, idle: 0 })
}

setInterval(() => {
  const curr = sampleCpu()
  if (prevCpuSample) {
    const totalDiff = curr.total - prevCpuSample.total
    const idleDiff = curr.idle - prevCpuSample.idle
    lastCpuPercent = totalDiff > 0 ? Math.round((1 - idleDiff / totalDiff) * 100) : 0
  }
  prevCpuSample = curr
}, 1000)

function getCpuPercent() {
  return lastCpuPercent
}

app.get('/metrics', (req, res) => {
  const auth = req.headers.authorization
  if (auth !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const [load1, load5, load15] = os.loadavg()
  const disk = getDisk()
  const pm2 = getPm2()

  res.json({
    cpu: {
      load1, load5, load15,
      percent: getCpuPercent(),
      cores: os.cpus().length,
    },
    mem: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      percent: Math.round((usedMem / totalMem) * 100),
    },
    disk,
    uptime: os.uptime(),
    os: `${os.type()} ${os.release()}`,
    pm2,
  })
})

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Monitor agent running on port ${PORT}`)
})
