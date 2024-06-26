pipeline {
    agent any

    tools {
        nodejs 'nodejs' // Ensure this matches the NodeJS installation name in Jenkins
    }

    environment {
        FILE_PATH = 'database' // Folder where the JSON files will be saved
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from the repository
                git 'https://github.com/LWY1112/Generated-Random-Account-Info.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                bat 'npm install'
            }
        }

        stage('Run Unit Tests') {
            steps {
                // Assuming you have unit tests configured with Jest
                bat 'npm test'
            }
        }

        /*stage('Run Integration Tests') {
            steps {
                // Assuming you have integration tests configured with Jest
                bat 'npm run test:integration'
            }
        }*/

        stage('Static Code Analysis') {
            steps {
                // Run ESLint for static code analysis
                bat 'npx eslint generateAccount.js'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
