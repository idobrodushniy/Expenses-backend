#!/usr/bin/env groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'docker build -t idobrodushniy/expenses-image:stable .'
            }
        }
        stage('Test') {
            steps {
                sh 'ls ./'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}