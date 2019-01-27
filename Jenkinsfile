#!/usr/bin/env groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t idobrodushniy/expenses-image:stable .'
            }
        }
        stage('Prepare environment for tests') {
            steps {
                sh 'docker-compose up -d '
            }
        }
        stage('Test Django') {
            steps {
                script {
                    try {
                        sh 'set +e'
                        sh 'docker-compose exec -T django python manage.py test'
                        sh 'set -e'
                    }
                    catch(Exception e) {
                        currentBuild.result = 'FAILURE'
                    }
                }
            }
        }
    }
    post {
        cleanup {
          sh 'docker-compose down'
        }

    }
}