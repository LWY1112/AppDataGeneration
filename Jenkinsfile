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

        stage('Run Generator Script') {
            steps {
                script {
                    def numAccounts = 10
                    def accountType = 'user' // Change this to 'employee' or 'product' as needed

                    // Create the Database directory if it doesn't exist
                    bat "if not exist ${env.FILE_PATH} mkdir ${env.FILE_PATH}"

                    // Run the script with arguments
                    bat "node form-filler.js ${numAccounts} ${accountType}"
                }
            }
        }

        stage('Check Generated File') {
            steps {
                script {
                    def accountType = 'user'
                    def filePath = "${env.FILE_PATH}/generated_${accountType}_accounts.json"

                    // Check if the file was created and has content
                    bat """
                    if exist "${filePath}" (
                        type "${filePath}"
                    ) else (
                        echo "File not found or is empty"
                        exit 1
                    )
                    """
                }
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
