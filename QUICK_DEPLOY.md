# Quick Deployment Steps

## 🚀 First Time Setup (Run Once)

### 1. Connect to Server
```bash
ssh root@194.163.136.186
```

### 2. Install Requirements
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs git nginx

# Install PM2
npm install -g pm2
```

### 3. Clone & Setup Project
```bash
cd /var/www
git clone https://github.com/yuosef0/lan-page.git
cd lan-page

# Create environment file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EOF

# Install & Build
npm install
npm run build

# Start with PM2
pm2 start npm --name "apex-base" -- start
pm2 save
pm2 startup
```

### 4. Setup Nginx
```bash
cat > /etc/nginx/sites-available/apex-base << 'EOF'
server {
    listen 80;
    server_name 194.163.136.186;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/apex-base /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### 5. Access Website
Open browser: `http://194.163.136.186`

---

## 🔄 Update Deployment (Run Anytime)

```bash
ssh root@194.163.136.186
cd /var/www/lan-page
git pull
npm install
npm run build
pm2 restart apex-base
```

---

## 📋 Useful Commands

```bash
# Check status
pm2 status

# View logs
pm2 logs apex-base

# Restart app
pm2 restart apex-base

# Stop app
pm2 stop apex-base

# Delete app
pm2 delete apex-base
```

---

## ⚠️ Important Files

- **Project**: `/var/www/lan-page`
- **Environment**: `/var/www/lan-page/.env.local`
- **Nginx Config**: `/etc/nginx/sites-available/apex-base`
- **PM2 Config**: `~/.pm2`

---

## 🆘 Troubleshooting

```bash
# App not working?
pm2 logs apex-base --err

# Nginx not working?
systemctl status nginx
tail -f /var/log/nginx/error.log

# Port in use?
netstat -tulpn | grep 3000

# Restart everything
pm2 restart apex-base
systemctl restart nginx
```
