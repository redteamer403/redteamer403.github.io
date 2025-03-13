---
layout: notes
permalink: /notes/web/recon/
title: Web Application Reconnaissance
---

# Web Application Reconnaissance

## Footprinting

```bash
# Fetch HTTP headers
curl -I http://example.com

# Enumerate robots.txt
wget http://example.com/robots.txt

# Discover sitemap
curl http://example.com/sitemap.xml

# Check WHOIS data
whois example.com

# Perform DNS lookup
nslookup example.com

# Enumerate DNS records
dig ANY example.com

# Use Recon-ng for footprinting
recon-ng -m recon/domains-hosts -o DOMAIN=example.com
```

## Technology Identification
```bash
# Identify tech stack with Wappalyzer
wappalyzer http://example.com

# Use WhatWeb
whatweb http://example.com

# Scan with Nmap scripts
nmap -sV --script=http-enum,http-server-header http://example.com

# Check HTTP headers for tech
curl -v http://example.com

# Enumerate CMS
cmsmap -t http://example.com

# Analyze JavaScript files
dirb http://example.com/js/
```

## Endpoint Discovery
```bash
# Directory brute-force
dirb http://example.com

# Use Gobuster
gobuster dir -u http://example.com -w wordlist.txt

# Find hidden params
arjun -u http://example.com/login -m POST

# Enumerate API endpoints
ffuf -u http://example.com/api/FUZZ -w wordlist.txt

# Check for backups
dirb http://example.com -X .bak,.zip

# Discover virtual hosts
virtual-host-discovery -d example.com -w wordlist.txt
```

## OSINT Gathering
```bash
# Harvest emails and subdomains
theHarvester -d example.com -b google,bing,linkedin

# Search GitHub for leaks
github-search.py -t <token> -o example.com

# Scrape LinkedIn
linkedin2username -o usernames.txt example.com

# Check Pastebin
pastes.py -k <keyword> -o pastes.txt

# Use Shodan for exposed services
shodan search "hostname:example.com"
```

## Automated Reconnaissance Tools
- Nmap: ```nmap -sV http://example.com```
- dirb: ```dirb http://example.com```
- Gobuster: ```gobuster dir -u http://example.com -w wordlist.txt```
- Recon-ng: ```recon-ng -m recon/domains-hosts -o DOMAIN=example.com```
- Amass: ```amass enum -d example.com```
- EyeWitness: ```eyewitness -f urls.txt -d output```
- Subfinder: ```subfinder -d example.com```
- Aquatone: ```aquatone -domain example.com```