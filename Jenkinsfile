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

        stage('Smoke Tests') {
            steps {
                echo '========================================='
                echo ' RUNNING SMOKE TESTS (HEALTH & LATENCY)  '
                echo '========================================='
                sh 'mvn test -Dtest=SmokeTest'
            }
        }

        stage('Unit Tests') {
            steps {
                echo '========================================='
                echo '       RUNNING CORE UNIT TESTS           '
                echo '========================================='
                sh 'mvn test -Dtest=HelloWorldTest'
            }
        }

        stage('Integration & CLI Tests') {
            steps {
                echo '========================================='
                echo ' RUNNING INTEGRATION & CLI STREAM TESTS  '
                echo '========================================='
                sh 'mvn test -Dtest=IntegrationTest'
            }
        }

        stage('Regression & Boundary Tests') {
            steps {
                echo '========================================='
                echo ' RUNNING PARAMETERIZED REGRESSION TESTS  '
                echo '========================================='
                sh 'mvn test -Dtest=RegressionTest'
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
                sh 'mvn package -DskipTests'
            }
        }

        stage('Runtime Verification') {
            steps {
                echo 'Verifying application runtime execution and CLI smoke check...'
                sh 'java -jar target/jenkins-lab-1.0-SNAPSHOT.jar'
                sh 'java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --smoke'
                sh 'java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --version'
                sh 'java -jar target/jenkins-lab-1.0-SNAPSHOT.jar --greet "Jenkins CI"'
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
            echo '  ALL TEST SUITES (SMOKE, UNIT, INT, REG) PASSED!  '
            echo '  JENKINS CI PIPELINE COMPLETED SUCCESSFULLY       '
            echo '==================================================='
        }
        failure {
            echo '==================================================='
            echo '        JENKINS CI PIPELINE BUILD/TEST FAILED       '
            echo '==================================================='
        }
    }
}
