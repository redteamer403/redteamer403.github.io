---
layout: notes
title: Linux Enumeration
---

# Linux Enumeration

## System Information Gathering

Essential commands for initial system enumeration:

```bash
# Basic System Info
uname -a
cat /etc/issue
cat /etc/*-release
hostnamectl
lscpu

# User Information
whoami
id
who
w
last

# Network Configuration
ip a
netstat -tulpn
ss -tulpn
iptables -L
```

## Privilege Escalation Vectors

Common areas to check:

1. SUID Binaries
2. Sudo Rights
3. Cron Jobs
4. World-Writable Files
5. Kernel Exploits
6. Service Misconfigurations

## Automated Enumeration Tools

- LinPEAS
- LinEnum
- Linux Exploit Suggester
- Linux Smart Enumeration
- Unix Privesc Check