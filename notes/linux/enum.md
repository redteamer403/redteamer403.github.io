---
layout: notes
permalink: /notes/linux/enum/
title: Linux Enumeration
---

# Linux Enumeration

## System Information Gathering

### Essential commands for initial system enumeration:

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
### Additional System Information Gathering
```bash
# Additional system details
cat /proc/version
lsb_release -a
dmesg | grep -i linux
```

### Additional Network Configuration
```bash
# ARP table and routing
ip neighbor
route -n
cat /etc/resolv.conf

# External port scanning
nmap -sT -p- <target>
masscan -p0-65535 <target>
```

## Automated Enumeration Tools
- [LinPEAS](https://github.com/peass-ng/PEASS-ng/tree/master/linPEAS)
```bash
#One line start
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
```

- [LinEnum](https://github.com/rebootuser/LinEnum)
- [pspy64](https://github.com/wildkindcc/Exploitation/blob/master/00.PostExp_Linux/pspy/pspy64)