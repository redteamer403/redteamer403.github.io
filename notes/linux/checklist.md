---
layout: notes
permalink: /notes/linux/checklist/
title: Linux Penetration Testing Checklist
---

# Linux Penetration Testing Checklist

## Initial Access Phase

### Port Scanning
- [ ] Full TCP scan (nmap -p-)
- [ ] UDP scan of common ports
- [ ] Service version detection
- [ ] Script scanning of discovered services

### Service Enumeration
- [ ] HTTP/HTTPS (80/443)
- [ ] SSH (22)
- [ ] SMB (445)
- [ ] RPC (111)
- [ ] Database services

## Post Exploitation

### Privilege Escalation
- [ ] Check SUID binaries
- [ ] Review sudo permissions
- [ ] Inspect cron jobs
- [ ] Check for kernel exploits
- [ ] Review service configurations

### Lateral Movement
- [ ] Network enumeration
- [ ] Password hunting
- [ ] SSH key discovery
- [ ] Trust relationships

### Data Exfiltration
- [ ] Identify sensitive files
- [ ] Database dumps
- [ ] Configuration files
- [ ] User credentials

## Documentation
- [ ] Screenshot evidence
- [ ] Command outputs
- [ ] Exploitation steps
- [ ] Remediation recommendations