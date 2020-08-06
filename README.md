# Matchbook Foundation

## Setup

Setup development environment on your computer

### Pre-Requisite

* Setup AWS credential (detail in doc)
* Nodejs installed on your computer

### Steps

```
// 1. Clone repository to local location
$ git clone https://github.com/matchbookfoundationdev/mf-webapp.git

// 2. Go into the repository root
$ cd mf-webapp

// 3. Install dependency
$ npm install // install nodejs dependency
```

## Develop

Locally run the webapp to develop and test

```
// 1. Make code changes
...

// 2. Run locally
$ npm start

// 3. Test by opening browser: http://127.0.0.1:3000/

// 4. Commit & push changes to repository
$ git add .
$ git commit -m 'some message'
$ git push
```

## Deploy

Deploy latest change to AWS environment

```
// 1. Create archive
$ npm run archive

// 2. upload 'mf-webapp.zip' to beanstalk
```

## Reference

* Design Doc: https://docs.google.com/document/d/1spacGPM3UdpYxupFbDhpxXa_GgcYF_-5gzJ0dbk7AGM/edit
