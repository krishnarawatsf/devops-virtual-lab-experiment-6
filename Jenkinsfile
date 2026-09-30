pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
        jdk 'Java-11'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub repository...'
                checkout scm
            }
        }

        stage('Compile') {
            steps {
                echo 'Compiling Java Source Code with Maven...'
                sh 'mvn compile'
            }
        }

        stage('Unit Testing') {
            steps {
                echo 'Executing Automated Unit Tests...'
                sh 'mvn test'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'target/surefire-reports/*.xml'
                }
            }
        }

        stage('Package & Build Artifact') {
            steps {
                echo 'Packaging application into executable JAR...'
                sh 'mvn clean package'
            }
        }

        stage('Execute & Verify') {
            steps {
                echo 'Verifying application runtime output...'
                sh 'java -jar target/jenkins-lab-1.0-SNAPSHOT.jar'
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo 'Archiving build artifacts...'
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: false
            }
        }
    }

    post {
        success {
            echo '==================================================='
            echo '  JENKINS CI PIPELINE COMPLETED SUCCESSFULLY (PASSED) '
            echo '==================================================='
        }
        failure {
            echo '==================================================='
            echo '        JENKINS CI PIPELINE BUILD FAILED            '
            echo '==================================================='
        }
    }
}
