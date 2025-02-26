---
layout: notes
permalink: /notes/network/recon/
title: Network Reconnaissance
---

# Network Reconnaissance

## Host Discovery
```bash
# Ping sweep
nmap -sn 192.168.1.0/24

# ARP scan
arp-scan -l

# Discover live hosts with masscan
masscan -p0-65535 192.168.1.0/24 --rate 1000

# ICMP echo with hping3
hping3 -1 192.168.1.1
```

## DNS Enumeration
```bash
# Enumerate DNS records
dnsenum example.com

# Zone transfer attempt
dig axfr example.com @ns1.example.com

# Brute-force subdomains
subfinder -d example.com -o subdomains.txt

# Query DNS with nslookup
nslookup -type=NS example.com
```

## OSINT Gathering
```bash
# Gather public info
theHarvester -d example.com -b google

# Search LinkedIn
linkedin2username -o usernames.txt example.com

# Scan Shodan
shodan search "org:example.com"

# Fetch WHOIS data
whois example.com
```

## Service Fingerprinting
```bash
# Identify services with nmap
nmap -sV -O 192.168.1.0/24

# Enumerate SNMP
snmpwalk -v2c -c public 192.168.1.1

# Check HTTP headers
curl -I http://example.com

# Use enum4linux for SMB
enum4linux -a 192.168.1.1
```

## Automated Reconnaissance Tools
- Nmap: ```nmap -sn <network>```
- Masscan: ```masscan -p0-65535 <network>```
- dnsrecon: ```dnsrecon -d example.com```
- Recon-ng: ```recon-ng -m recon/domains-hosts```
- SpiderFoot: ```spiderfoot -d example.com```