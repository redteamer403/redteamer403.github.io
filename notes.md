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
        <a href="/notes/enum/">Enumeration</a>
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
    <div id="linux-enum" class="note-section">
      <h2>Linux Enumeration</h2>
      <p>Comprehensive guide for Linux system enumeration:</p>
      <ul>
        <li>System Information Gathering</li>
        <li>User Enumeration</li>
        <li>Network Configuration</li>
        <li>Running Services</li>
      </ul>
      <h3>Common Commands</h3>
      <pre><code>uname -a
cat /etc/issue
cat /etc/*-release
ps aux
netstat -tulpn</code></pre>
    </div>

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
  </div>
</div>