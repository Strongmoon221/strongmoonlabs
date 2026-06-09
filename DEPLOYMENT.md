# Strongmoon Labs Website — Deployment Guide

## Prerequisites

- Node.js 18.17+ (LTS recommended)
- npm 9+ or yarn
- cPanel hosting with Node.js support (Passenger) OR standard VPS

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd strongmoonlabs-website

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your actual values

# 4. Set up the database
npx prisma db push

# 5. Seed with sample data
npm run db:seed

# 6. Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

**Admin panel:** http://localhost:3000/admin  
Default credentials (from seed): `admin@strongmoonlabs.com` / `admin123!`

> ⚠️ **Change the admin password immediately after first login in production.**

---

## Production Build

```bash
npm run build
```

This generates a `.next/standalone` folder (configured via `output: 'standalone'` in `next.config.ts`).

---

## Option A: cPanel with Node.js (Recommended)

### Requirements
- cPanel with **Node.js Selector** (Phusion Passenger)
- Node.js 18+ available in cPanel
- SSH access recommended

### Steps

1. **Upload files** via FTP or cPanel File Manager (or git deploy):
   ```
   Upload all files except:
   - node_modules/
   - .next/
   - *.db files (create fresh on server)
   ```

2. **Set up Node.js App in cPanel:**
   - Go to **Setup Node.js App**
   - Application root: `/home/username/public_html` (or subdirectory)
   - Application URL: your domain
   - Application startup file: `server.js`
   - Node.js version: 18.x or 20.x

3. **Create startup file** (`server.js`) in app root:
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('./.next/standalone/node_modules/next')
   
   const dev = process.env.NODE_ENV !== 'production'
   const app = next({ dev, dir: __dirname })
   const handle = app.getRequestHandler()
   
   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true)
       handle(req, res, parsedUrl)
     }).listen(process.env.PORT || 3000, () => {
       console.log('> Ready on port', process.env.PORT || 3000)
     })
   })
   ```
   
   *Alternatively*, use the standalone output directly:
   ```javascript
   // server.js
   process.chdir(__dirname)
   require('./.next/standalone/server.js')
   ```

4. **Set environment variables** in cPanel Node.js App settings or in a `.env` file:
   ```
   DATABASE_URL=file:./prisma/production.db
   JWT_SECRET=your-very-long-random-secret-here
   ADMIN_EMAIL=admin@yoursite.com
   ADMIN_PASSWORD=your-secure-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   CONTACT_EMAIL=hello@yoursite.com
   NEXT_PUBLIC_SITE_URL=https://yoursite.com
   NODE_ENV=production
   ```

5. **Run database migrations and seed:**
   ```bash
   # Via SSH
   cd /home/username/app-directory
   npm install
   npx prisma db push
   NODE_ENV=production ADMIN_EMAIL=admin@yoursite.com ADMIN_PASSWORD=SecurePass123! tsx prisma/seed.ts
   ```

6. **Build the app:**
   ```bash
   npm run build
   ```

7. **Copy static files** from `.next/standalone`:
   ```bash
   cp -r .next/static .next/standalone/.next/static
   cp -r public .next/standalone/public
   ```

8. **Restart the Node.js app** in cPanel Node.js Selector.

---

## Option B: Standalone VPS / DigitalOcean / Linode

```bash
# Install dependencies and build
npm ci
npm run build

# Copy static assets into standalone output
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# Run the production server
node .next/standalone/server.js
```

Use **PM2** to keep the process alive:
```bash
npm install -g pm2
pm2 start .next/standalone/server.js --name strongmoonlabs
pm2 save
pm2 startup
```

Use **Nginx** as a reverse proxy:
```nginx
server {
    listen 80;
    server_name strongmoonlabs.com www.strongmoonlabs.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Database

### Development (default)
SQLite — zero configuration. Database file stored at `./prisma/dev.db`.

### Production (recommended upgrade)
Switch to **MySQL** (available on most cPanel plans) or **PostgreSQL**:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"   // or "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `DATABASE_URL` in `.env`:
   ```
   # MySQL
   DATABASE_URL="mysql://user:password@localhost:3306/strongmoonlabs"
   
   # PostgreSQL
   DATABASE_URL="postgresql://user:password@localhost:5432/strongmoonlabs"
   ```

3. Run migration:
   ```bash
   npx prisma migrate deploy
   ```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | Database connection string |
| `JWT_SECRET` | ✅ | Secret for admin session tokens (min 32 chars) |
| `ADMIN_EMAIL` | Seed only | Initial admin email |
| `ADMIN_PASSWORD` | Seed only | Initial admin password |
| `SMTP_HOST` | For email | SMTP server hostname |
| `SMTP_PORT` | For email | SMTP port (usually 587) |
| `SMTP_SECURE` | For email | Use TLS (`true`/`false`) |
| `SMTP_USER` | For email | SMTP username/email |
| `SMTP_PASS` | For email | SMTP password or app password |
| `CONTACT_EMAIL` | For email | Where contact form emails are sent |
| `NEXT_PUBLIC_SITE_URL` | SEO | Production URL (with https://) |

---

## Security Checklist

- [ ] Change default admin password after first seed
- [ ] Set a strong `JWT_SECRET` (use `openssl rand -base64 64`)
- [ ] Enable HTTPS (free Let's Encrypt via cPanel)
- [ ] Keep `NODE_ENV=production` in production
- [ ] Never commit `.env` to version control
- [ ] Review SMTP credentials — use app passwords, not account passwords
- [ ] Regularly update `npm audit` vulnerabilities

---

## Admin Panel

URL: `https://yoursite.com/admin`

Features:
- Dashboard with stats
- Full CRUD for portfolio projects
- Toggle published/draft status
- Contact message inbox

---

## Customization

### Update company info
- Contact details: `src/components/layout/Footer.tsx`
- Social links: `src/components/layout/Footer.tsx` and `src/app/contact/page.tsx`
- Stats on homepage: `src/components/sections/Hero.tsx`

### Add/edit projects
Use the admin panel at `/admin/projects` or edit `prisma/seed.ts` and re-run `npm run db:seed`.

### Update colors / branding
Edit `tailwind.config.ts` and `src/app/globals.css`.

---

## Support

For deployment help or customization: hello@strongmoonlabs.com
