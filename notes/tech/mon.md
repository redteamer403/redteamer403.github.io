---
layout: notes
permalink: /notes/tech/mon/
title: Pentesting Monitoring Tools
---

# Pentesting Monitoring Tools
<embed src="/assets/file/Hacking-Monitoring-CNCF-Sarah-Conway.pdf" type="application/pdf" width="100%" height="600px" />

# Grafana
[CVE-2021-4379 exploitation guide](https://github.com/jas502n/Grafana-CVE-2021-43798)\
\
CVEs Tools\
[https://github.com/pedrohavay/exploit-grafana-CVE-2021-43798](https://github.com/pedrohavay/exploit-grafana-CVE-2021-43798)\
[https://github.com/halencarjunior/grafana-CVE-2021-43798](https://github.com/halencarjunior/grafana-CVE-2021-43798)\
[https://github.com/h0ffayyy/CVE-2019-15043](https://github.com/h0ffayyy/CVE-2019-15043)


# Prometheus
<embed src="/assets/file/pentest-report_prometheus.pdf" type="application/pdf" width="100%" height="600px" />

```bash
#Leakage of usernames and passwords provided in URL strings from the loaded YAML configuration file
/api/v1/status/config

#Leakage of metadata labels, including environment variables as well as user and machine names, added to target machine addresses
/api/v1/targets

#Leakage of usernames when providing a full path to the YAML configuration file
/api/v1/status/flags
```