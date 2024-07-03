pipeline {
    agent any

    tools {
        nodejs 'nodejs' // Ensure this matches the NodeJS installation name in Jenkins
    }

    parameters {
        choice(name: 'TEST_FILE', choices: ['all', 'tests/generateUser.test.js', 'tests/generateEmployee.test.js', 'tests/generateAccount.test.js', 'tests/generateCustomer.test.js'], description: 'Select the test file to run')
        choice(name: 'TEST_CASE', choices: ['all', 'user', 'employee', 'customer'], description: 'Specify the test case to run within the test file')
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

        stage('Run Tests') {
            steps {
                script {
                    def testFile = params.TEST_FILE
                    def testCase = params.TEST_CASE

                    if (testFile == 'all') {
                        bat 'npx jest'
                    } else {
                        if (testCase == 'all') {
                            bat "npx jest ${testFile}"
                        } else {
                            bat "npx jest ${testFile} -t '${testCase}'"
                        }
                    }
                }
            }
        }

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
