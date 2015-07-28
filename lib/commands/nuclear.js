var _ = require('lodash');
var Q = require('q');
var Utils = require('../utils');

module.exports = nuclearOption;

function nuclearOption() {
    return Utils.signIn()
        .then(_getSubjects)
        .then(_trashSubjects)
        .catch(function (error) {
            console.error(error);
            process.exit(1);
        })
        .then(Utils.signOut);
}

function _getSubjects(user) {
    var deferred = Q.defer();
    var subjectsList = [];
    console.log('Getting subjects...');

    _getSubjectsPage(1)
        .then(function (subjects) {
            if (subjects.length === 0) {
                deferred.reject('You don\'t have any uploaded subjects.');
            } else {
                subjectsList = subjectsList.concat(subjects);
                if (subjects[0]._meta.subjects.page_count === 1) {
                    deferred.resolve(subjectsList);
                } else {
                    console.log('Found a total of ' + subjects[0]._meta.subjects.page_count + ' pages, getting the rest.');
                    var remainingSubjectPages = [];
                    for (i = 2; i <= (subjects[0]._meta.subjects.page_count); i++) {
                        remainingSubjectPages.push(_getSubjectsPage(i));
                    }
                    Q.all(remainingSubjectPages)
                        .then(function (subjects) {
                            subjects.map(function (subjectPage) {
                                subjectsList = subjectsList.concat(subjectPage);
                            });
                            deferred.resolve(subjectsList);
                        });
                }
            }
        });

    return deferred.promise;

}

function _getSubjectsPage(pageNumber) {
    return Utils.auth.checkCurrent()
        .then(function (user) {
            return Utils.api.type('subjects').get({
                upload_user_id: user.id,
                page: pageNumber
            });
        });
}

function _trashSubjects(subjectsList) {
    console.log('Trashing ' + subjectsList.length + ' subjects');
    subjectsList = _.chunk(subjectsList, 50);
    return subjectsList.reduce(function (result, subjectsChunk) {
        return result.then(function () {
            return _trashSubjectsChunk(subjectsChunk);
        });
    }, Q());
}

function _trashSubjectsChunk(subjectsChunk) {
    var deferred = [];
    subjectsChunk.forEach(function (subject) {
        deferred.push(subject.delete())
    })
    return Q.all(deferred);
}
