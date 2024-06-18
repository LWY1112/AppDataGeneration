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

        stage('Generate User Account') {
            steps {
                script {
                    def numAccounts = 5
                    def accountType = 'user' // Change this to 'employee' or 'product' as needed

                    // Run the script with arguments
                    bat "node form-filler.js ${numAccounts} ${accountType}"
                }
            }
        }

        stage('Check Generated User File') {
            steps {
                script {
                    // Check if JSON file has content
                    def accountType = 'user'
                    def jsonFilePath = "${env.FILE_PATH}/generated_${accountType}_accounts.json"
                    def jsonFileContent = readFile(file: jsonFilePath)
                    if (jsonFileContent.trim().isEmpty()) {
                        error "The JSON file ${jsonFilePath} is empty!"
                    } else {
                        echo "The JSON file ${jsonFilePath} has content."
                        echo jsonFileContent
                    }
                }
            }
        }

        /*stage('Run Unit Tests') {
            steps {
                // Assuming you have unit tests configured with Jest
                bat 'npm run test:unit'
            }
        }*/

        stage('Generate Employee Account') {
            steps {
                script {
                    def numAccounts = 5
                    def accountType = 'employee' // Change this to 'employee' or 'product' as needed

                    // Run the script with arguments
                    bat "node form-filler.js ${numAccounts} ${accountType}"
                }
            }
        }

        stage('Check Generated Employee File') {
            steps {
                script {
                    // Check if JSON file has content
                    def accountType = 'employee'
                    def jsonFilePath = "${env.FILE_PATH}/generated_${accountType}_accounts.json"
                    def jsonFileContent = readFile(file: jsonFilePath)
                    if (jsonFileContent.trim().isEmpty()) {
                        error "The JSON file ${jsonFilePath} is empty!"
                    } else {
                        echo "The JSON file ${jsonFilePath} has content."
                        echo jsonFileContent
                    }
                }
            }
        }

        /*stage('Run Integration Tests') {
            steps {
                // Assuming you have integration tests configured with Jest
                bat 'npm run test:integration'
            }
        }*/

        stage('Generate Product Account') {
            steps {
                script {
                    def numAccounts = 5
                    def accountType = 'product' // Change this to 'employee' or 'product' as needed

                    // Run the script with arguments
                    bat "node form-filler.js ${numAccounts} ${accountType}"
                }
            }
        }

        stage('Check Generated Product File') {
            steps {
                script {
                    // Check if JSON file has content
                    def accountType = 'product'
                    def jsonFilePath = "${env.FILE_PATH}/generated_${accountType}_category.json"
                    def jsonFileContent = readFile(file: jsonFilePath)
                    if (jsonFileContent.trim().isEmpty()) {
                        error "The JSON file ${jsonFilePath} is empty!"
                    } else {
                        echo "The JSON file ${jsonFilePath} has content."
                        echo jsonFileContent
                    }
                }
            }
        }

        stage('Static Code Analysis') {
            steps {
                // Run ESLint for static code analysis
                bat 'npm run lint'
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
