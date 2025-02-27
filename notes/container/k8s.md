---
layout: notes
permalink: /notes/container/k8s/
title: Kubernetes Pentesting Notes
---

# Kubernetes Pentesting Notes

## Commands
```bash
# Get Kubernetes client and server versions
kubectl version

# Get cluster info
kubectl cluster-info

# List all nodes
kubectl get nodes

# Describe a specific node
kubectl describe node <node-name>

# List all pods in all namespaces
kubectl get pods --all-namespaces

# Describe a pod
kubectl describe pod <pod-name> -n <namespace>

# Get pod logs
kubectl logs <pod-name> -n <namespace>

# Exec into a pod
kubectl exec -it <pod-name> -n <namespace> -- /bin/bash

# List all deployments
kubectl get deployments --all-namespaces

# Describe a deployment
kubectl describe deployment <deployment-name> -n <namespace>

# Scale a deployment
kubectl scale deployment <deployment-name> --replicas=3 -n <namespace>

# List all services
kubectl get services --all-namespaces

# Describe a service
kubectl describe service <service-name> -n <namespace>

# List all secrets
kubectl get secrets --all-namespaces

# Describe a secret
kubectl describe secret <secret-name> -n <namespace>

# Decode a secret
kubectl get secret <secret-name> -n <namespace> -o jsonpath="{.data}" | base64 -d

# List all configmaps
kubectl get configmaps --all-namespaces

# Describe a configmap
kubectl describe configmap <configmap-name> -n <namespace>

# List all namespaces
kubectl get namespaces

# Switch context
kubectl config use-context <context-name>

# List contexts
kubectl config get-contexts

# Check cluster roles
kubectl get clusterroles

# Check role bindings
kubectl get rolebindings --all-namespaces

# Check cluster role bindings
kubectl get clusterrolebindings

# List all jobs
kubectl get jobs --all-namespaces

# Describe a job
kubectl describe job <job-name> -n <namespace>

# List all cronjobs
kubectl get cronjobs --all-namespaces

# Describe a cronjob
kubectl describe cronjob <cronjob-name> -n <namespace>

# Delete a resource
kubectl delete pod <pod-name> -n <namespace>

# Apply a manifest
kubectl apply -f manifest.yaml

# Check resource usage
kubectl top nodes
kubectl top pods -n <namespace>

# Port-forward to a pod
kubectl port-forward pod/<pod-name> 8080:80 -n <namespace>

# Copy files to/from pod
kubectl cp <local-path> <pod-name>:<pod-path> -n <namespace>

# Check events
kubectl get events --all-namespaces

# Debug a resource
kubectl debug pod/<pod-name> -n <namespace>
```

## Kubernetes Manifests (Examples)
### Pod Manifest
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  namespace: default
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    securityContext:
      runAsUser: 1000
      runAsGroup: 1000
      allowPrivilegeEscalation: false
```

### Deployment Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: default
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        securityContext:
          capabilities:
            drop: [ALL]
```

### Service Manifest
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  namespace: default
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
    protocol: TCP
  type: ClusterIP
```

### Security-Focused Manifest (Pod with RBAC)
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
  namespace: default
  annotations:
    security.alpha.kubernetes.io/seccomp: runtime/default
spec:
  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      runAsNonRoot: true
      readOnlyRootFilesystem: true
      allowPrivilegeEscalation: false
  serviceAccountName: restricted-sa
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-reader-binding
  namespace: default
subjects:
- kind: ServiceAccount
  name: restricted-sa
  namespace: default
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

## Security Testing (Red Team Focus)
```bash 
# Enumerate pods for sensitive data 
kubectl get pods --all-namespaces -o jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.spec.containers[*].image}{'\n'}{end}" 

# Check for privileged pods 
kubectl get pods --all-namespaces -o jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.spec.containers[*].securityContext.privileged}{'\n'}{end}" | grep true 

# Find exposed secrets 
kubectl get secrets --all-namespaces -o json | jq '.data' 

# Test RBAC permissions 
kubectl auth can-i create pods -n <namespace> 

# Check service accounts 
kubectl get serviceaccounts --all-namespaces 

# Scan for misconfigured RBAC 
kubectl get clusterrolebindings,rolebindings --all-namespaces 

# Extract configmaps for secrets 
kubectl get configmaps --all-namespaces -o json | jq '.data' 

# Test network policies 
kubectl get networkpolicies --all-namespaces 

# Check for hostPath mounts 
kubectl get pods --all-namespaces -o jsonpath="{range .items[*]}{.metadata.name}{'\t'}{.spec.volumes[*].hostPath}{'\n'}{end}" | grep hostPath 

# Inspect pod security context 
kubectl describe pod <pod-name> -n <namespace> | grep -i security 

# Test pod exec for privilege escalation 
kubectl exec -it <pod-name> -n <namespace> -- whoami </CODE>
```

### Automated Security Tools
Kubescape: ```kubescape scan```

Kube-Hunter: ```kube-hunter```

Trivy: ```trivy image <image-name>```

Falco: ```falco --pid <pid>```

Kubesec: ```kubesec scan <manifest.yaml>```

Polaris: ```polaris audit -f manifest.yaml```

Sysdig Falco: ```sysdig falco```

Aqua Security: ```aqua scan <cluster>```