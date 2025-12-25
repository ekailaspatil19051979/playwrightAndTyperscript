pipeline {
  agent any
  environment {
    NODE_ENV = 'test'
    BASE_URL = 'https://www.flipkart.com'
    SHARD_TOTAL = '2'
    SHARD_INDEX = '0'
  }
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Run Playwright Tests') {
      steps {
        sh 'chmod +x run-tests.sh'
        sh './run-tests.sh'
      }
    }
    stage('Archive Reports') {
      steps {
        archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
      }
    }
  }
  post {
    always {
      junit 'playwright-report/*.xml'
    }
    failure {
      mail to: 'team@example.com',
           subject: "Jenkins Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
           body: "Check Jenkins for details."
    }
  }
}
