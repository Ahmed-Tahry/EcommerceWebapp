# Kubernetes Deployment for Microservices

This directory contains the Kubernetes manifest files to deploy the microservices application suite to an Azure Kubernetes Service (AKS) cluster.

## Prerequisites

1.  **Azure Kubernetes Service (AKS) Cluster**: An operational AKS cluster.
2.  **Azure Container Registry (ACR)**: An ACR instance to store Docker images.
    *   Ensure AKS has pull access to this ACR (e.g., by attaching ACR to AKS: `az aks update -n <aks_cluster_name> -g <resource_group> --attach-acr <acr_name_or_id>`).
3.  **`kubectl`**: Configured to communicate with your AKS cluster.
4.  **Docker**: For building images locally if not solely relying on CI/CD.
5.  **Ingress Controller**: An Ingress controller (e.g., Nginx Ingress, AGIC) must be installed and configured in your AKS cluster.
6.  **Persistent Storage**: Ensure your AKS cluster has a default StorageClass or you specify one in the `postgres-pvc.yaml`.
7.  **(Optional) `helm`**: If you choose to deploy PostgreSQL or Keycloak via Helm charts instead of the provided manifests.
8.  **(Optional) `cert-manager`**: For automated TLS certificate management for Ingress.

## Services to be Deployed

*   **PostgreSQL**: Database server (deployed via manifests, consider Azure Database for PostgreSQL for production).
*   **Keycloak**: Identity and Access Management (uses PostgreSQL).
*   **Settings Service**: Node.js microservice (uses PostgreSQL).
*   **Shop Service**: Node.js microservice (uses PostgreSQL).
*   **Nginx**: OpenResty-based API Gateway, routing requests to backend services and handling OIDC authentication with Keycloak.

**Note**: The `frontend/remos-react` application and the placeholder `invoice_service` and `sales_dashboard_service` are not included in this Kubernetes deployment plan as per current scope.

## Structure

*   `secrets.yaml`: **Placeholder for secrets.** Contains base64 encoded placeholder values. **IMPORTANT**: These are not secure for production and should be managed via Azure Key Vault, CI/CD secret injection, or other secure mechanisms.
*   `postgres-pvc.yaml`: PersistentVolumeClaim for PostgreSQL data.
*   `postgres-deployment.yaml`: Deployment for PostgreSQL.
*   `postgres-service.yaml`: Service for PostgreSQL.
*   `keycloak-deployment.yaml`: Deployment for Keycloak.
*   `keycloak-service.yaml`: Service for Keycloak.
*   `settings-service-deployment.yaml`: Deployment for Settings Service.
*   `settings-service-service.yaml`: Service for Settings Service.
*   `shop-service-deployment.yaml`: Deployment for Shop Service.
*   `shop-service-service.yaml`: Service for Shop Service.
*   `nginx-configmap.yaml`: ConfigMap containing the `nginx.conf` for the API Gateway.
*   `nginx-deployment.yaml`: Deployment for Nginx API Gateway.
*   `nginx-service.yaml`: Service for Nginx API Gateway.
*   `ingress.yaml`: Ingress resource to expose the Nginx API Gateway externally.

## Manual Deployment Steps (Illustrative)

These steps assume you are deploying manually. For CI/CD, these would be automated.

1.  **Build and Push Docker Images**:
    *   For each service (`keycloak_config`, `nginx_config`, `shop_service`, `settings_service`):
        *   Navigate to the service directory (e.g., `cd shop_service`).
        *   Build the Docker image: `docker build -t <your_acr_name>.azurecr.io/<service_image_name>:<tag> .`
            *   Example: `docker build -t myregistry.azurecr.io/shop-service:v1.0.0 .`
        *   Login to ACR: `az acr login --name <your_acr_name>`
        *   Push the image: `docker push <your_acr_name>.azurecr.io/<service_image_name>:<tag>`

2.  **Update Manifest Placeholders**:
    *   In all `*-deployment.yaml` files, replace `<acr_name>` with your ACR name and `<tag>` with the image tag you used.
    *   In `kubernetes/nginx-configmap.yaml` (inside `nginx.conf` data) and `kubernetes/ingress.yaml`, replace `<your-external-domain>` with the public DNS name that will point to your Ingress controller's IP.
    *   Configure TLS in `kubernetes/ingress.yaml` by uncommenting the `tls` section and providing a `secretName` that contains your TLS certificate, or configure `cert-manager` annotations.

3.  **Apply Secrets (Securely!)**:
    *   **CRITICAL**: The `secrets.yaml` file contains placeholder base64 encoded values. For a real deployment:
        *   Encode your actual secret values: `echo -n "yourActualPassword" | base64`
        *   Update the `data` fields in `secrets.yaml`.
        *   Alternatively, and recommended, create secrets directly using `kubectl create secret generic app-secrets --from-literal=db_user='user' --from-literal=db_password='password' ...` or manage them via Azure Key Vault.
    *   If using the modified `secrets.yaml` (for dev/test only): `kubectl apply -f kubernetes/secrets.yaml`

4.  **Deploy PostgreSQL**:
    *   `kubectl apply -f kubernetes/postgres-pvc.yaml`
    *   `kubectl apply -f kubernetes/postgres-deployment.yaml`
    *   `kubectl apply -f kubernetes/postgres-service.yaml`
    *   Wait for PostgreSQL to be ready: `kubectl get pods -l app=postgres-db -w`

5.  **Deploy Keycloak**:
    *   `kubectl apply -f kubernetes/keycloak-deployment.yaml`
    *   `kubectl apply -f kubernetes/keycloak-service.yaml`
    *   Wait for Keycloak: `kubectl get pods -l app=keycloak -w`
    *   **Keycloak Configuration**: The Keycloak image includes scripts for initial setup. Ensure the `KC_HOSTNAME_URL` and `KC_HOSTNAME_ADMIN_URL` in `keycloak-deployment.yaml` are correctly set (initially to the service, then updated if external access to Keycloak itself is needed directly, though it's usually accessed via Nginx for end-users). The OIDC client in Keycloak used by Nginx (`myapp-api`) must have its "Valid Redirect URIs" configured to include `http://<your-external-domain>/auth/callback` (or whatever Nginx is configured with).

6.  **Deploy Application Services (Shop & Settings)**:
    *   `kubectl apply -f kubernetes/shop-service-deployment.yaml`
    *   `kubectl apply -f kubernetes/shop-service-service.yaml`
    *   `kubectl apply -f kubernetes/settings-service-deployment.yaml`
    *   `kubectl apply -f kubernetes/settings-service-service.yaml`
    *   Monitor startup: `kubectl get pods -l app=shop-service -w` and `kubectl get pods -l app=settings-service -w`
    *   **Database Migrations**: The deployment manifests include commented-out sections for init containers to run migrations. You'll need to:
        *   Ensure your Node.js services have a migration script (e.g., `npm run migrate`).
        *   Uncomment and adapt the `initContainers` section in `*-deployment.yaml` files for shop and settings services.
        *   Alternatively, run migrations manually using a Kubernetes Job after deployment.

7.  **Deploy Nginx API Gateway**:
    *   `kubectl apply -f kubernetes/nginx-configmap.yaml`
    *   `kubectl apply -f kubernetes/nginx-deployment.yaml`
    *   `kubectl apply -f kubernetes/nginx-service.yaml`
    *   Monitor startup: `kubectl get pods -l app=nginx -w`

8.  **Deploy Ingress**:
    *   `kubectl apply -f kubernetes/ingress.yaml`
    *   Find the external IP of your Ingress controller: `kubectl get svc -n <ingress-controller-namespace>` (e.g., `ingress-nginx` or `kube-system` for AGIC).
    *   Configure your DNS provider to point `<your-external-domain>` to this external IP.

## Next Steps & Recommendations

1.  **CI/CD Pipeline**: Implement a CI/CD pipeline (e.g., GitHub Actions, Azure DevOps) to automate building, pushing images, and deploying to AKS. This was out of scope for the current changes but is crucial for production.
2.  **Frontend Deployment**:
    *   The `frontend/remos-react` application needs a Dockerfile and Kubernetes manifests to be deployed.
    *   It can be served by a dedicated Nginx container or integrated into the existing Nginx gateway (requiring modification of `nginx-configmap.yaml` and the Nginx Docker image to include frontend static assets).
3.  **Incomplete Services**: `invoice_service` and `sales_dashboard_service` are placeholders. They require full development, including Dockerfiles and Kubernetes manifests, before they can be deployed.
4.  **Security**:
    *   **Secrets Management**: Integrate Azure Key Vault with AKS for managing all secrets.
    *   **Network Policies**: Implement Kubernetes Network Policies to restrict traffic flow between pods.
    *   **Image Scanning**: Scan Docker images for vulnerabilities.
    *   **RBAC**: Configure RBAC for accessing the AKS cluster.
    *   **Keycloak Production Hardening**: Review Keycloak documentation for production setup (HTTPS, realm settings, etc.).
    *   **Nginx `ssl_verify`**: Change `ssl_verify = "no"` to `"yes"` in `nginx-configmap.yaml` for Keycloak communication if Keycloak is exposed internally via HTTPS or if it's a production environment.
5.  **Database**:
    *   **Managed PostgreSQL**: Strongly consider using Azure Database for PostgreSQL instead of deploying PostgreSQL within AKS for production workloads. This offers better reliability, scalability, and manageability. If you switch, update `DB_HOST` environment variables in deployments and remove the PostgreSQL manifests.
    *   **Database Creation**: The current setup assumes databases (`keycloak`, `ShopDb`, `SettingsDb`) are created (PostgreSQL deployment creates `keycloak`). Ensure `ShopDb` and `SettingsDb` are created, either by an init job, manually, or by application startup logic.
6.  **Monitoring & Logging**:
    *   Integrate Azure Monitor for containers or deploy a monitoring stack like Prometheus/Grafana.
    *   Configure centralized logging (e.g., Azure Log Analytics, ELK stack).
7.  **Resource Management**:
    *   Adjust CPU/memory requests and limits in deployment files based on actual application performance and load testing.
8.  **Helm Charts**: Consider using Helm charts for deploying complex applications like PostgreSQL and Keycloak, as they often provide more configuration options and lifecycle management features.
9.  **Configuration Management**:
    *   For more complex configurations, explore tools like Kustomize or Helm for managing Kubernetes manifests.
10. **Health Probes**: Ensure all services have meaningful readiness and liveness probes. The current ones for Node.js services point to `/`. Verify these paths return appropriate status codes.

This README provides a starting point. Adapt and extend it based on your specific environment and requirements.Tool output for `create_file_with_block`:
