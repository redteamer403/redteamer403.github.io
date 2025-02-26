---
layout: notes
permalink: /notes/network/scan/
title: Network Port Scanning
---

# Network Port Scanning

## TCP Scanning
```bash
# Full TCP scan
nmap -p- 192.168.1.1

# Stealth SYN scan
nmap -sS 192.168.1.1

# Service version scan
nmap -sV -p 1-1024 192.168.1.1

# Scan top ports
nmap --top-ports 1000 192.168.1.1
```

## UDP Scanning
```bash
# Basic UDP scan
nmap -sU 192.168.1.1

# Scan specific UDP ports
nmap -sU -p 53,123,161 192.168.1.1

# Detect UDP services
nmap -sU -sV 192.168.1.1

# Aggressive UDP scan
nmap -sU -A 192.168.1.1
```

## Stealth Scanning
```bash
# Fragment packets
nmap -f 192.168.1.1

# Spoof source IP
nmap -S <spoofed_ip> 192.168.1.1

# Decoy scan
nmap -D <decoy1>,<decoy2> 192.168.1.1

# Idle scan
nmap -sI <zombie_host> 192.168.1.1
```

## Scanning Tools
- Nmap: ```nmap -sS <target>```
- Masscan: ```masscan -p0-65535 <target> --rate 1000```
- Unicornscan: ```unicornscan -i eth0 -r 1000 192.168.1.1```
- Hping3: ```hping3 -S 192.168.1.1```
- ZMap: ```zmap -p 80 192.168.1.0/24```