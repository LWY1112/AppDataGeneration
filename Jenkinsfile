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
                    def jsonFilePath = "${env.FILE_PATH}/generated_${accountType}_accounts.json"

                    // Check if JSON file exists and has content
                    if (!fileExists(jsonFilePath)) {
                        error "The JSON file ${jsonFilePath} does not exist or is empty!"
                    }

                    // Read the content of the JSON file
                    def jsonFileContent = readFile(file: jsonFilePath).trim()

                    if (jsonFileContent.isEmpty()) {
                        error "The JSON file ${jsonFilePath} is empty!"
                    } else {
                        echo "The JSON file ${jsonFilePath} has content."
                    }
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

// Function to check if a file exists
def fileExists(String filePath) {
    return file(filePath).exists()
}
