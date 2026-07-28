# Secure CI/CD Pipeline for a Three-Tier Full Stack Application

[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-red?logo=jenkins)](https://www.jenkins.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerization-blue?logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-EKS-326CE5?logo=kubernetes)](https://kubernetes.io/)
[![AWS](https://img.shields.io/badge/AWS-EKS-FF9900?logo=amazon-aws)](https://aws.amazon.com/eks/)
[![SonarQube](https://img.shields.io/badge/SonarQube-Code%20Quality-4E9BCD?logo=sonarqube)](https://www.sonarsource.com/products/sonarqube/)
[![Trivy](https://img.shields.io/badge/Trivy-Security%20Scanner-1904DA)](https://trivy.dev/)

This repository contains a containerized Node.js, Express, MongoDB, and EJS web application with a DevSecOps delivery workflow designed for Jenkins, SonarQube, Trivy, Docker, Docker Hub, Kubernetes, and Amazon EKS.

The application is based on a YelpCamp-style campground platform where users can register, log in, create campgrounds, upload images, view locations, and add reviews. The infrastructure and pipeline demonstrate how a full-stack application can move from source code to a Kubernetes deployment with automated quality and security checks.

## Table of Contents

- [Project Overview](#project-overview)
- [Application Features](#application-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Run Locally](#run-locally)
- [Docker Usage](#docker-usage)
- [CI/CD Pipeline Workflow](#cicd-pipeline-workflow)
- [DevSecOps Security](#devsecops-security)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Command Reference](#command-reference)
- [Notes](#notes)

## Project Overview

The goal of this project is to implement a secure and automated CI/CD pipeline for a three-tier full-stack application:

- Presentation tier: EJS views, Bootstrap styling, client-side JavaScript, and MapTiler maps
- Application tier: Node.js and Express REST-style server routes
- Data tier: MongoDB database with Mongoose models and session storage

The pipeline is designed to automate dependency installation, test execution, static code analysis, vulnerability scanning, Docker image creation, image publishing, and deployment to Amazon EKS through Kubernetes manifests.

## Application Features

- User registration, login, logout, authentication, and authorization
- Campground creation, editing, listing, and deletion
- Review creation and deletion
- Image upload and storage through Cloudinary
- Map display and location support through MapTiler
- MongoDB-backed sessions using `connect-mongo`
- Input validation with Joi
- Security middleware using Helmet and MongoDB query sanitization
- Containerized runtime using Docker
- Kubernetes deployment with Secret, Deployment, readiness probe, liveness probe, and LoadBalancer Service

## Architecture

```text
Developer
   |
   v
GitHub Repository
   |
   v
Jenkins Pipeline
   |
   +--> npm install / npm test
   |
   +--> SonarQube Static Code Analysis
   |
   +--> Trivy Filesystem Scan
   |
   +--> Docker Image Build
   |
   +--> Trivy Image Scan
   |
   +--> Docker Hub Push
   |
   v
Amazon EKS Cluster
   |
   +--> Kubernetes Secret
   +--> Kubernetes Deployment
   +--> Kubernetes Service: LoadBalancer
   |
   v
End Users
```

## Technology Stack

| Category | Technologies |
| --- | --- |
| Source Control | Git, GitHub |
| CI/CD | Jenkins |
| Code Quality | SonarQube |
| Security Scanning | Trivy |
| Containerization | Docker |
| Container Registry | Docker Hub |
| Orchestration | Kubernetes |
| Cloud Platform | Amazon Web Services |
| Kubernetes Service | Amazon EKS |
| Backend Runtime | Node.js, Express |
| Views | EJS, EJS Mate |
| Database | MongoDB, Mongoose |
| Authentication | Passport, Passport Local |
| File Storage | Cloudinary |
| Maps | MapTiler |
| Package Manager | npm |

## Repository Structure

```text
.
|-- Dockerfile
|-- docker-compose.yml
|-- package.json
|-- package-lock.json
|-- app.js
|-- middleware.js
|-- schemas.js
|-- cloudinary/
|-- controllers/
|-- images/
|-- Manifests/
|   `-- dss.yml
|-- models/
|-- public/
|   |-- javascripts/
|   `-- stylesheets/
|-- routes/
|-- seeds/
|-- utils/
|-- views/
|   |-- campgrounds/
|   |-- layouts/
|   |-- partials/
|   `-- users/
`-- README.md
```

## Prerequisites

Install and configure the following tools before running the full pipeline:

- Node.js 18 or later
- npm
- Docker
- Docker Compose
- Git
- AWS CLI
- kubectl
- eksctl
- Trivy
- Jenkins server
- SonarQube server
- Docker Hub account
- MongoDB Atlas database
- Cloudinary account
- MapTiler account

## Environment Variables

Create a `.env` file in the project root for local development.

```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_KEY=your-cloudinary-api-key
CLOUDINARY_SECRET=your-cloudinary-api-secret
MAPTILER_KEY=your-maptiler-key
DB_URL=your-mongodb-connection-string
SECRET=your-session-secret
PORT=3000
```

Do not commit real credentials to Git. For Kubernetes, store these values in a Kubernetes Secret and reference them from the deployment.

## Run Locally

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

Open the application:

```text
http://localhost:3000
```

Run the test script:

```bash
npm test
```

Note: the current `npm test` script is a placeholder that exits successfully. Add real unit and integration tests before using this pipeline for production-grade quality gates.

## Docker Usage

Build the Docker image:

```bash
docker build -t <dockerhub-username>/camp:latest .
```

Run the container:

```bash
docker run -d -p 3000:3000 --env-file .env <dockerhub-username>/camp:latest
```

Run with Docker Compose:

```bash
docker compose up --build
```

Push the image to Docker Hub:

```bash
docker login
docker push <dockerhub-username>/camp:latest
```

## CI/CD Pipeline Workflow

The Jenkins pipeline is expected to execute the following stages:

1. Checkout source code from GitHub
2. Install Node.js dependencies with `npm install`
3. Run tests with `npm test`
4. Analyze code quality with SonarQube
5. Scan the repository filesystem with Trivy
6. Build the Docker image
7. Scan the Docker image with Trivy
8. Authenticate with Docker Hub
9. Push the Docker image to Docker Hub
10. Update the Kubernetes deployment on Amazon EKS
11. Verify pods, services, and rollout status

Example Jenkins shell commands:

```bash
npm install
npm test
sonar-scanner
trivy fs --format table -o fs-report.html .
docker build -t <dockerhub-username>/camp:latest .
trivy image --format table -o image-report.html <dockerhub-username>/camp:latest
docker push <dockerhub-username>/camp:latest
kubectl apply -n webapps -f Manifests/dss.yml
kubectl rollout status deployment/yelp-camp-deployment -n webapps
kubectl get pods -n webapps
kubectl get svc -n webapps
```

## DevSecOps Security

### SonarQube

SonarQube is used for static code analysis and quality gates. It helps detect:

- Bugs
- Code smells
- Maintainability issues
- Security hotspots
- Potential vulnerabilities

### Trivy

Trivy is used before and after containerization:

- Filesystem scan: detects vulnerable dependencies and configuration issues in the source tree
- Image scan: detects operating system package vulnerabilities, language package vulnerabilities, and CVEs in the built image

### Secret Management

The Kubernetes manifest uses a Secret named `yelp-camp-secrets` for sensitive values such as:

- Cloudinary credentials
- MapTiler API key
- MongoDB connection string
- Session secret

Before deploying, replace sample or placeholder values in `Manifests/dss.yml` with valid base64-encoded values or use `kubectl create secret generic` from environment values.

## Kubernetes Deployment

The Kubernetes resources are defined in [Manifests/dss.yml](./Manifests/dss.yml).

Create the namespace:

```bash
kubectl create namespace webapps
```

Apply the manifest:

```bash
kubectl apply -n webapps -f Manifests/dss.yml
```

Check deployment status:

```bash
kubectl rollout status deployment/yelp-camp-deployment -n webapps
```

Verify running resources:

```bash
kubectl get all -n webapps
```

Get the external LoadBalancer URL:

```bash
kubectl get svc yelp-camp-service -n webapps
```

Delete the deployed resources:

```bash
kubectl delete -n webapps -f Manifests/dss.yml
```

## Command Reference

### AWS CLI Commands

Configure AWS CLI:

```bash
aws configure
```

Verify AWS credentials:

```bash
aws sts get-caller-identity
```

List EKS clusters:

```bash
aws eks list-clusters
```

Update kubeconfig:

```bash
aws eks update-kubeconfig --region ap-southeast-1 --name EKS-1
```

### eksctl Commands

Create an EKS cluster:

```bash
eksctl create cluster --name EKS-1 --region ap-southeast-1 --without-nodegroup
```

Associate IAM OIDC provider:

```bash
eksctl utils associate-iam-oidc-provider --cluster EKS-1 --approve
```

Create a managed node group:

```bash
eksctl create nodegroup \
  --cluster EKS-1 \
  --region ap-southeast-1 \
  --name node1 \
  --node-type t3.micro \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 4 \
  --managed
```

List node groups:

```bash
eksctl get nodegroup --cluster EKS-1 --region ap-southeast-1
```

Delete the node group:

```bash
eksctl delete nodegroup --cluster EKS-1 --region ap-southeast-1 --name node1
```

Delete the cluster:

```bash
eksctl delete cluster --name EKS-1 --region ap-southeast-1
```

### Docker Commands

Build image:

```bash
docker build -t <dockerhub-username>/camp:latest .
```

List images:

```bash
docker images
```

Run container:

```bash
docker run -d -p 3000:3000 --env-file .env <dockerhub-username>/camp:latest
```

Stop and remove a container:

```bash
docker stop <container-id>
docker rm <container-id>
```

Remove image:

```bash
docker rmi <dockerhub-username>/camp:latest
```

Login and push:

```bash
docker login
docker push <dockerhub-username>/camp:latest
```

Pull image:

```bash
docker pull <dockerhub-username>/camp:latest
```

### Node.js Commands

Install dependencies:

```bash
npm install
```

Run application:

```bash
npm start
```

Run tests:

```bash
npm test
```

### SonarQube Commands

Run SonarScanner:

```bash
sonar-scanner
```

Start an existing SonarQube container:

```bash
docker start sonarqube
```

Stop SonarQube:

```bash
docker stop sonarqube
```

### Trivy Commands

Scan the filesystem:

```bash
trivy fs .
```

Save a filesystem scan report:

```bash
trivy fs --format table -o fs-report.html .
```

Scan the Docker image:

```bash
trivy image <dockerhub-username>/camp:latest
```

Save an image scan report:

```bash
trivy image --format table -o image-report.html <dockerhub-username>/camp:latest
```

### Kubernetes Commands

Check cluster information:

```bash
kubectl cluster-info
```

List nodes:

```bash
kubectl get nodes
kubectl get nodes -o wide
```

Describe a node:

```bash
kubectl describe node <node-name>
```

Create namespace:

```bash
kubectl create namespace webapps
```

List namespaces:

```bash
kubectl get namespaces
```

Apply application resources:

```bash
kubectl apply -n webapps -f Manifests/dss.yml
```

Restart deployment:

```bash
kubectl rollout restart deployment/yelp-camp-deployment -n webapps
```

Check rollout:

```bash
kubectl rollout status deployment/yelp-camp-deployment -n webapps
```

Rollback deployment:

```bash
kubectl rollout undo deployment/yelp-camp-deployment -n webapps
```

List pods:

```bash
kubectl get pods -n webapps
kubectl get pods -n webapps -w
```

Describe a pod:

```bash
kubectl describe pod <pod-name> -n webapps
```

View logs:

```bash
kubectl logs <pod-name> -n webapps
kubectl logs -f deployment/yelp-camp-deployment -n webapps
```

Open a shell inside a pod:

```bash
kubectl exec -it <pod-name> -n webapps -- bash
```

List services and endpoints:

```bash
kubectl get svc -n webapps
kubectl describe svc yelp-camp-service -n webapps
kubectl get endpoints -n webapps
```

List secrets:

```bash
kubectl get secrets -n webapps
kubectl describe secret yelp-camp-secrets -n webapps
```

View all resources:

```bash
kubectl get all -n webapps
kubectl describe all -n webapps
```

Check resource usage:

```bash
kubectl top nodes
kubectl top pods -n webapps
```

Validate the manifest:

```bash
kubectl apply --dry-run=client -n webapps -f Manifests/dss.yml
kubectl explain deployment
```

Clean up application resources:

```bash
kubectl delete -n webapps -f Manifests/dss.yml
kubectl delete namespace webapps
```

### Quick Commands Cheat Sheet

```bash
kubectl get nodes
kubectl get pods -A
kubectl get all -n webapps
kubectl logs -f deployment/yelp-camp-deployment -n webapps
kubectl describe pod <pod-name> -n webapps
kubectl get svc -n webapps
docker images
docker push <dockerhub-username>/camp:latest
trivy image <dockerhub-username>/camp:latest
aws eks update-kubeconfig --region ap-southeast-1 --name EKS-1
```

## Notes

- Update the Docker image in `Manifests/dss.yml` before deploying your own build.
- Replace placeholder Kubernetes Secret values with valid base64-encoded values.
- Add a `Jenkinsfile` to the repository if you want Jenkins to run this workflow directly from source control.
- Add real automated tests before enforcing strict production quality gates.

