---
layout: default
title: Notes
---

<div class="search-container">
  <input type="text" class="search-input" placeholder="Search notes...">
</div>

<div class="notes-container">
  <div class="notes-sidebar">
    <div class="notes-category">
      <h3>Linux</h3>
      <div class="notes-subcategory">
        <a href="#linux-enum">Enumeration</a>
        <a href="#linux-enum-sysinfo">System Information Gathering</a>
        <a href="#linux-enum-users">User Enumeration</a>
        <a href="#linux-enum-network">Network Configuration</a>
        <a href="#linux-enum-services">Running Services</a>
        <a href="#linux-enum-commands">Common Commands</a>
        <a href="#linux-privesc">Privilege Escalation</a>
        <a href="#linux-post">Post Exploitation</a>
        <a href="#linux-checklist">Penetration Testing Checklist</a>
      </div>
    </div>

    <div class="notes-category">
      <h3>Windows</h3>
      <div class="notes-subcategory">
        <a href="#windows-enum">Enumeration</a>
        <a href="#windows-privesc">Privilege Escalation</a>
        <a href="#windows-post">Post Exploitation</a>
        <a href="#windows-av">AV/EDR Evasion</a>
      </div>
    </div>

    <div class="notes-category">
      <h3>Active Directory</h3>
      <div class="notes-subcategory">
        <a href="#ad-enum">Domain Enumeration</a>
        <a href="#ad-attack">Attack Vectors</a>
        <a href="#ad-persist">Persistence</a>
        <a href="#ad-lateral">Lateral Movement</a>
      </div>
    </div>

    <div class="notes-category">
      <h3>Network</h3>
      <div class="notes-subcategory">
        <a href="#network-recon">Reconnaissance</a>
        <a href="#network-scan">Port Scanning</a>
        <a href="#network-pivot">Pivoting</a>
        <a href="#network-sniff">Traffic Analysis</a>
      </div>
    </div>

    <div class="notes-category">
      <h3>Web Application</h3>
      <div class="notes-subcategory">
        <a href="#web-recon">Reconnaissance</a>
        <a href="#web-vulns">Common Vulnerabilities</a>
        <a href="#web-auth">Authentication Bypass</a>
        <a href="#web-api">API Testing</a>
      </div>
    </div>
  </div>

  <div class="notes-content">
    <!-- Linux Enumeration Sections -->
    <div id="linux-enum" class="note-section">
      <h2>Linux Enumeration</h2>
      <p>Comprehensive guide for Linux system enumeration:</p>
      <ul>
        <li>System Information Gathering</li>
        <li>User Enumeration</li>
        <li>Network Configuration</li>
        <li>Running Services</li>
      </ul>
    </div>

    <div id="linux-enum-sysinfo" class="note-section">
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

    <div id="linux-enum-users" class="note-section">
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

    <div id="linux-enum-network" class="note-section">
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

    <div id="linux-enum-services" class="note-section">
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

    <div id="linux-enum-commands" class="note-section">
      <h2>Common Commands</h2>
      <p>General-purpose commands for Linux enumeration:</p>
      <pre><code>uname -a             # System info
cat /etc/issue       # OS version banner
cat /etc/*-release   # Release details
ps aux               # Process list
netstat -tulpn       # Network services</code></pre>
    </div>

    <!-- Other Linux Sections -->
    <div id="linux-privesc" class="note-section">
      <h2>Linux Privilege Escalation</h2>
      <p>Methods and techniques for escalating privileges on Linux systems:</p>
      <ul>
        <li>SUID Binary Exploitation</li>
        <li>Sudo Misconfigurations</li>
        <li>Kernel Exploits</li>
        <li>Cron Job Abuse</li>
      </ul>
      <h3>Key Tools</h3>
      <ul>
        <li>LinPEAS</li>
        <li>Linux Exploit Suggester</li>
        <li>pspy</li>
      </ul>
    </div>

    <div id="linux-post" class="note-section">
      <h2>Linux Post Exploitation</h2>
      <p>Placeholder for post-exploitation techniques.</p>
    </div>

    <div id="linux-checklist" class="note-section">
      <h2>Penetration Testing Checklist</h2>
      <p>Placeholder for Linux pentesting checklist.</p>
    </div>

    <!-- Windows Sections -->
    <div id="windows-enum" class="note-section">
      <h2>Windows Enumeration</h2>
      <p>Essential Windows system enumeration techniques:</p>
      <ul>
        <li>System Information</li>
        <li>User and Group Enumeration</li>
        <li>Network Shares</li>
        <li>Running Services</li>
      </ul>
      <h3>PowerShell Commands</h3>
      <pre><code>Get-WmiObject Win32_OperatingSystem
Get-LocalUser
Get-LocalGroup
Get-Service</code></pre>
    </div>

    <div id="windows-privesc" class="note-section">
      <h2>Windows Privilege Escalation</h2>
      <p>Common Windows privilege escalation vectors:</p>
      <ul>
        <li>Service Misconfigurations</li>
        <li>Unquoted Service Paths</li>
        <li>Token Manipulation</li>
        <li>Registry Exploits</li>
      </ul>
      <h3>Key Tools</h3>
      <ul>
        <li>WinPEAS</li>
        <li>PowerUp</li>
        <li>SharpUp</li>
      </ul>
    </div>

    <div id="windows-post" class="note-section">
      <h2>Windows Post Exploitation</h2>
      <p>Placeholder for post-exploitation techniques.</p>
    </div>

    <div id="windows-av" class="note-section">
      <h2>AV/EDR Evasion</h2>
      <p>Placeholder for AV/EDR evasion techniques.</p>
    </div>

    <!-- Active Directory Sections -->
    <div id="ad-enum" class="note-section">
      <h2>Active Directory Enumeration</h2>
      <p>Advanced AD enumeration methodology:</p>
      <ul>
        <li>Domain Controllers</li>
        <li>Users and Groups</li>
        <li>Group Policies</li>
        <li>Trust Relationships</li>
      </ul>
      <h3>Key Tools</h3>
      <ul>
        <li>BloodHound</li>
        <li>PowerView</li>
        <li>ADExplorer</li>
      </ul>
    </div>

    <div id="ad-attack" class="note-section">
      <h2>Attack Vectors</h2>
      <p>Placeholder for AD attack vectors.</p>
    </div>

    <div id="ad-persist" class="note-section">
      <h2>Persistence</h2>
      <p>Placeholder for AD persistence techniques.</p>
    </div>

    <div id="ad-lateral" class="note-section">
      <h2>Lateral Movement</h2>
      <p>Placeholder for AD lateral movement techniques.</p>
    </div>

    <!-- Network Sections -->
    <div id="network-recon" class="note-section">
      <h2>Network Reconnaissance</h2>
      <p>Placeholder for network reconnaissance techniques.</p>
    </div>

    <div id="network-scan" class="note-section">
      <h2>Port Scanning</h2>
      <p>Placeholder for port scanning techniques.</p>
    </div>

    <div id="network-pivot" class="note-section">
      <h2>Pivoting</h2>
      <p>Placeholder for network pivoting techniques.</p>
    </div>

    <div id="network-sniff" class="note-section">
      <h2>Traffic Analysis</h2>
      <p>Placeholder for traffic analysis techniques.</p>
    </div>

    <!-- Web Application Sections -->
    <div id="web-recon" class="note-section">
      <h2>Web Reconnaissance</h2>
      <p>Placeholder for web reconnaissance techniques.</p>
    </div>

    <div id="web-vulns" class="note-section">
      <h2>Common Vulnerabilities</h2>
      <p>Placeholder for web vulnerabilities.</p>
    </div>

    <div id="web-auth" class="note-section">
      <h2>Authentication Bypass</h2>
      <p>Placeholder for auth bypass techniques.</p>
    </div>

    <div id="web-api" class="note-section">
      <h2>API Testing</h2>
      <p>Placeholder for API testing techniques.</p>
    </div>
  </div>
</div>