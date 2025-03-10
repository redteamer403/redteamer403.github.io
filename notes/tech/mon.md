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

# Kibana (5601)
## Config files
```bash
#Kibana configuration
/etc/kibana/kibana.yml
```

# Logstash
## Config files
```bash
/etc/logstash/pipelines.yml
/etc/logstash/logstash.yml
```

# Elasticsearch (9200)
```bash
http://10.10.10.115:9200/

# Chech Authentication is enabled/disabled
curl -X GET "ELASTICSEARCH-SERVER:9200/_xpack/security/user"
# if disabled response:
..."status":500}
# if enabled response:
..."status":401}

# list default usernames: 
elastic (superuser)
remote_monitoring_user
beats_system
logstash_system
kibana
kibana_system
apm_system
_anonymous_
# Older versions of Elasticsearch have the default password changeme for this user

# Basic Enumeration
#List all roles on the system:
curl -X GET "ELASTICSEARCH-SERVER:9200/_security/role"
#List all users on the system:
curl -X GET "ELASTICSEARCH-SERVER:9200/_security/user"
#Get more information about the rights of an user:
curl -X GET "ELASTICSEARCH-SERVER:9200/_security/user/<USERNAME>"

# Elastic endpoints
/_cat/segments
/_cat/shards
/_cat/repositories
/_cat/recovery
/_cat/plugins
/_cat/pending_tasks
/_cat/nodes
/_cat/tasks
/_cat/templates
/_cat/thread_pool
/_cat/ml/trained_models
/_cat/transforms/_all
/_cat/aliases
/_cat/allocation
/_cat/ml/anomaly_detectors
/_cat/count
/_cat/ml/data_frame/analytics
/_cat/ml/datafeeds
/_cat/fielddata
/_cat/health
/_cat/indices
/_cat/master
/_cat/nodeattrs
/_cat/nodes
/_cluster/allocation/explain
/_cluster/settings
/_cluster/health
/_cluster/state	
/_cluster/stats	
/_cluster/pending_tasks	
/_nodes	
/_nodes/usage	
/_nodes/hot_threads	
/_nodes/stats	
/_tasks
/_remote/info	
/_security/user
/_security/privilege
/_security/role_mapping
/_security/role
/_security/api_key

# Indices
http://10.10.10.115:9200/_cat/indices?v
# Brute indexes e.g. "bank"
http://10.10.10.115:9200/bank
# Dump index
http://host:9200/<index>/_search?pretty=true
# Dump all (without indicating any index)
http://10.10.10.115:9200/_search?pretty=true
# Search Indices
http://10.10.10.115:9200/_search?pretty=true&q=Rockwell

# Fuzz service
https://github.com/misalabs/horuz

# Check write permissions
curl -X POST '10.10.10.115:9200/bookindex/books' -H 'Content-Type: application/json' -d'
 {
    "bookId" : "A00-3",
    "author" : "Sankaran",
    "publisher" : "Mcgrahill",
    "name" : "how to get a job"
 }'

# Automatic Enumeration via Metasploit
msf > use auxiliary/scanner/elasticsearch/indices_enum
```