# Matchbook Academy Web App

## Setup

Setup development environment on your computer

### Pre-Requisite

* Setup AWS credential (detail in doc)
* Nodejs installed on your computer

### Steps

```
// 1. Clone repository to local location
$ git clone https://github.com/matchbookfoundationdev/ma-webapp.git

// 2. Go into the repository root
$ cd mf-webapp

// 3. Install dependency
$ npm install // install nodejs dependency

// 4. Install Test depedency
$ npm install --global mocha
```

## Develop

Basic development flow

```
// 1. Make code changes
...

// 2. Run Unit Test
$ npm test

// 3. Run Webapp locally
$ npm start

// 4. Test by opening browser: http://127.0.0.1:3000/

// 5. Commit & push changes to repository
$ git add .
$ git commit -m "some message"
$ git push
```

## Deploy

Deploy latest change to AWS environment

```
// 1. Create archive
$ npm run archive

// 2. upload 'ma-webapp.zip' to beanstalk
```

## Reference

* Design Doc: https://docs.google.com/document/d/1spacGPM3UdpYxupFbDhpxXa_GgcYF_-5gzJ0dbk7AGM/edit
