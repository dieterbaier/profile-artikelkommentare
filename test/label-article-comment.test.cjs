'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const labelArticleComment = require('../.github/scripts/label-article-comment.cjs');

function issueBody(articleId) {
    return [
        '### Artikel-ID', '', articleId, '',
        '### Artikel', '', 'Dokumentation als Code', '',
        '### Artikel-URL', '', 'https://dieterbaier.eu/article.html', '',
        '### Kommentar', '', 'Ein Kommentar', '',
        '### Öffentliche Veröffentlichung', '', 'Bestätigt'
    ].join('\n');
}

function fixture({ articleId, allowedIds, labels = [] }) {
    const calls = [];
    const github = {
        paginate: async () => labels,
        rest: {
            issues: {
                createLabel: async args => calls.push(['createLabel', args.name]),
                addLabels: async args => calls.push(['addLabels', args.labels]),
                listLabelsOnIssue: Symbol('listLabelsOnIssue'),
                removeLabel: async args => calls.push(['removeLabel', args.name])
            },
            repos: {
                getContent: async () => ({
                    data: { content: Buffer.from(JSON.stringify({ article_ids: allowedIds })).toString('base64') }
                })
            }
        }
    };
    const context = {
        repo: { owner: 'dieterbaier', repo: 'profile-artikelkommentare' },
        issue: { number: 42 },
        payload: { issue: { body: issueBody(articleId) } }
    };
    const failures = [];
    const core = { info: () => {}, setFailed: message => failures.push(message) };
    return { calls, core, failures, github, context };
}

test('valid changes assign the new label before removing the previous assignment', async () => {
    const setup = fixture({
        articleId: 'ART-003-doc-as-code',
        allowedIds: ['ART-003-doc-as-code'],
        labels: [{ name: 'Artikelkommentar' }, { name: 'ART-002-smarter-cicd' }, { name: 'ART-003-doc-as-code' }]
    });

    await labelArticleComment(setup);

    assert.deepEqual(setup.failures, []);
    const addArticle = setup.calls.findIndex(call => call[0] === 'addLabels' && call[1][0] === 'ART-003-doc-as-code');
    const removePrevious = setup.calls.findIndex(call => call[0] === 'removeLabel');
    assert.ok(addArticle >= 0);
    assert.ok(removePrevious > addArticle);
    assert.deepEqual(setup.calls[removePrevious], ['removeLabel', 'ART-002-smarter-cicd']);
});

test('invalid changes preserve the previous valid article assignment', async () => {
    const setup = fixture({
        articleId: 'ART-999-unknown',
        allowedIds: ['ART-003-doc-as-code'],
        labels: [{ name: 'Artikelkommentar' }, { name: 'ART-003-doc-as-code' }]
    });

    await labelArticleComment(setup);

    assert.match(setup.failures[0], /nicht für die öffentliche Website freigegeben/);
    assert.equal(setup.calls.some(call => call[0] === 'removeLabel'), false);
    assert.equal(setup.calls.some(call => call[0] === 'addLabels' && call[1][0].startsWith('ART-')), false);
});
