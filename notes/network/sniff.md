---
layout: notes
permalink: /notes/network/sniff/
title: Network Traffic Analysis
---

# Network Traffic Analysis

## Packet Capture
```bash
# Capture with Wireshark
wireshark -i eth0

# Capture with tcpdump
tcpdump -i eth0 -w capture.pcap

# Filter specific port
tcpdump -i eth0 port 80 -w capture.pcap

# Live capture with tshark
tshark -i eth0
```

## MITM Sniffing
```bash
# ARP spoofing with arpspoof
arpspoof -i eth0 -t <target> <gateway>

# Start Responder for NTLM
responder -I eth0 -P

# DNS spoofing
dnsspoof -i eth0 -f hosts.txt

# SSL strip
sslstrip -l 8080
```

## Packet Analysis
```bash
# Analyze pcap with tshark
tshark -r capture.pcap

# Filter HTTP traffic
tshark -r capture.pcap -Y "http"

# Extract files
tshark -r capture.pcap -T fields -e http.file_data

# Use Wireshark filters
wireshark -r capture.pcap -Y "tcp.port == 443"
```

## Analysis Tools
- Wireshark: ```wireshark -i eth0```
- tcpdump: ```tcpdump -i eth0 -w capture.pcap```
- tshark: ```tshark -r capture.pcap```
- BetterCAP: ```bettercap -iface eth0```
- NetworkMiner: ```networkminer capture.pcap```