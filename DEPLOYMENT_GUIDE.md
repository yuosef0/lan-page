# Deployment Guide - Apex & Base Website

## Server Information
- Server IP: `194.163.136.186`
- User: `root`

---

## Prerequisites on Server

### 1. Connect to Server
```bash
ssh root@194.163.136.186
```

### 2. Install Node.js (if not installed)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 4. Install Git (if not installed)
```bash
apt-get update
apt-get install -y git
```

---

## Deployment Steps

### Step 1: Clone Repository
```bash
# Navigate to web directory
cd /var/www

# Clone your repository
git clone https://github.com/yuosef0/lan-page.git
cd lan-page

# Or if you prefer a different name
# git clone https://github.com/yuosef0/lan-page.git apex-base
# cd apex-base
```

### Step 2: Create Environment File
```bash
# Create .env.local file
nano .env.local
```

Add the following content (replace with your actual values):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Build the Application
```bash
npm run build
```

### Step 5: Start with PM2
```bash
# Start the application
pm2 start npm --name "apex-base" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command that PM2 outputs
```

### Step 6: Check Status
```bash
# Check if app is running
pm2 status

# View logs
pm2 logs apex-base

# Monitor
pm2 monit
```

---

## Setting up Nginx (Reverse Proxy)

### 1. Install Nginx
```bash
apt-get install -y nginx
```

### 2. Create Nginx Configuration
```bash
nano /etc/nginx/sites-available/apex-base
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name 194.163.136.186;  # Replace with your domain if you have one

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Enable Site
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/apex-base /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

# Restart nginx
systemctl restart nginx

# Enable nginx to start on boot
systemctl enable nginx
```

---

## Setting up Firewall (Optional but Recommended)

```bash
# Allow SSH
ufw allow OpenSSH

# Allow HTTP
ufw allow 80

# Allow HTTPS (for future SSL)
ufw allow 443

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## SSL Certificate (Optional - for HTTPS)

If you have a domain name:

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
certbot renew --dry-run
```

---

## Useful PM2 Commands

```bash
# Restart application
pm2 restart apex-base

# Stop application
pm2 stop apex-base

# Delete from PM2
pm2 delete apex-base

# View logs
pm2 logs apex-base

# View only error logs
pm2 logs apex-base --err

# Clear logs
pm2 flush

# Monitor CPU/Memory
pm2 monit

# List all processes
pm2 list
```

---

## Updating the Application

When you make changes to your code:

```bash
# SSH to server
ssh root@194.163.136.186

# Navigate to project
cd /var/www/lan-page

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart PM2
pm2 restart apex-base

# Check logs
pm2 logs apex-base
```

---

## Troubleshooting

### Check if app is running
```bash
pm2 status
```

### Check logs for errors
```bash
pm2 logs apex-base --err
```

### Check if port 3000 is in use
```bash
netstat -tulpn | grep 3000
```

### Check Nginx status
```bash
systemctl status nginx
```

### Check Nginx logs
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Restart everything
```bash
pm2 restart apex-base
systemctl restart nginx
```

---

## Environment Variables Needed

Make sure you have these in your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: If you need server-side Supabase access
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Access Your Website

After deployment:
- HTTP: `http://194.163.136.186`
- Or with your domain: `http://yourdomain.com`

---

## Security Recommendations

1. **Change SSH Port** (optional)
   ```bash
   nano /etc/ssh/sshd_config
   # Change Port 22 to something else like 2222
   systemctl restart sshd
   ```

2. **Disable Root Login** (after creating another user)
   ```bash
   # Create new user first
   adduser yourname
   usermod -aG sudo yourname

   # Then disable root
   nano /etc/ssh/sshd_config
   # Set PermitRootLogin no
   ```

3. **Keep System Updated**
   ```bash
   apt-get update
   apt-get upgrade -y
   ```

4. **Setup Fail2Ban** (prevents brute force attacks)
   ```bash
   apt-get install -y fail2ban
   systemctl enable fail2ban
   systemctl start fail2ban
   ```

---

## Need Help?

If you encounter any issues:

1. Check PM2 logs: `pm2 logs apex-base`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Check if services are running: `pm2 status` and `systemctl status nginx`
4. Make sure port 3000 is not blocked by firewall
5. Verify environment variables are set correctly

---

## Quick Deploy Script

You can also create a deploy script:

```bash
# Create deploy.sh
nano /var/www/lan-page/deploy.sh
```

Add this content:
```bash
#!/bin/bash
cd /var/www/lan-page
git pull origin main
npm install
npm run build
pm2 restart apex-base
echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x /var/www/lan-page/deploy.sh
```

Run it:
```bash
./deploy.sh
```
