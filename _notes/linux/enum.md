---
layout: default
title: Linux Enumeration
permalink: /notes/linux/enum/
---

<div class="search-container">
  <input type="text" class="search-input" placeholder="Search enumeration notes...">
</div>

<div id="system-info" class="note-section">
  <h2>System Information Gathering</h2>
  <p>Collecting basic system details to understand the Linux environment:</p>
  <ul>
    <li>Kernel version and OS release</li>
    <li>System architecture</li>
    <li>Hostname and uptime</li>
  </ul>
  <h3>Example Commands</h3>
  <pre><code>uname -a              # Kernel and system info
cat /etc/os-release   # OS details
hostnamectl           # Hostname and system info
uptime                # System uptime</code></pre>
</div>

<div id="user-enum" class="note-section">
  <h2>User Enumeration</h2>
  <p>Identifying users and their privileges on the system:</p>
  <ul>
    <li>List all users</li>
    <li>Check current user privileges</li>
    <li>Examine user groups</li>
  </ul>
  <h3>Example Commands</h3>
  <pre><code>cat /etc/passwd       # List all users
whoami                # Current user
id                    # User ID and groups
cat /etc/group        # Group information</code></pre>
</div>

<div id="network-config" class="note-section">
  <h2>Network Configuration</h2>
  <p>Analyzing network settings and connections:</p>
  <ul>
    <li>Network interfaces</li>
    <li>IP addresses</li>
    <li>Routing table</li>
  </ul>
  <h3>Example Commands</h3>
  <pre><code>ip addr              # Network interfaces and IPs
ifconfig             # Alternative for interfaces
netstat -r           # Routing table
ip route             # Routing info</code></pre>
</div>

<div id="running-services" class="note-section">
  <h2>Running Services</h2>
  <p>Identifying active services and processes:</p>
  <ul>
    <li>List running processes</li>
    <li>Check service status</li>
    <li>Examine listening ports</li>
  </ul>
  <h3>Example Commands</h3>
  <pre><code>ps aux               # All running processes
systemctl status     # Service status
netstat -tulpn       # Listening ports
ss -tulpn            # Alternative for ports</code></pre>
</div>

<div id="common-commands" class="note-section">
  <h2>Common Commands</h2>
  <p>General-purpose commands for Linux enumeration:</p>
  <pre><code>uname -a             # System info
cat /etc/issue       # OS version banner
cat /etc/*-release   # Release details
ps aux               # Process list
netstat -tulpn       # Network services</code></pre>
</div>