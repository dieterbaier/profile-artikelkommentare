'use strict';

const ARTICLE_LABEL_PATTERN = /^ART-[0-9]{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FORM_HEADINGS = ['### Artikel', '### Artikel-URL', '### Kommentar', '### Öffentliche Veröffentlichung'];

module.exports = async function labelArticleComment({ github, context, core }) {
    const body = context.payload.issue.body || '';
    const lines = body.split(/\r?\n/);
    const heading = lines.findIndex(line => line.trim() === '### Artikel-ID');

    if (heading < 0 || !FORM_HEADINGS.every(expected => lines.some(line => line.trim() === expected))) {
        core.info('Issue wurde nicht mit dem Artikelkommentar-Formular erstellt.');
        return;
    }

    const articleId = lines.slice(heading + 1).find(line => line.trim())?.trim() || '';
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const issue_number = context.issue.number;

    async function ensureLabel(name, color, description) {
        try {
            await github.rest.issues.createLabel({ owner, repo, name, color, description });
        } catch (error) {
            if (error.status !== 422) throw error;
        }
    }

    await ensureLabel('Artikelkommentar', '7057FF', 'Öffentlicher Kommentar zu einem Artikel');
    await github.rest.issues.addLabels({ owner, repo, issue_number, labels: ['Artikelkommentar'] });

    if (!ARTICLE_LABEL_PATTERN.test(articleId)) {
        core.setFailed(`Ungültige oder fehlende Artikel-ID: ${articleId || '<leer>'}`);
        return;
    }

    const allowlistFile = await github.rest.repos.getContent({
        owner,
        repo,
        path: 'config/allowed-article-ids.json'
    });
    const allowlist = JSON.parse(Buffer.from(allowlistFile.data.content, 'base64').toString('utf8'));
    const allowedArticleIds = new Set(allowlist.article_ids || []);

    if (!allowedArticleIds.has(articleId)) {
        core.setFailed(`Artikel-ID ist nicht für die öffentliche Website freigegeben: ${articleId}`);
        return;
    }

    await ensureLabel(articleId, '1D76DB', `Kommentare zum Artikel ${articleId}`);
    await github.rest.issues.addLabels({ owner, repo, issue_number, labels: [articleId] });

    const labels = await github.paginate(github.rest.issues.listLabelsOnIssue, {
        owner,
        repo,
        issue_number,
        per_page: 100
    });

    for (const label of labels) {
        if (ARTICLE_LABEL_PATTERN.test(label.name) && label.name !== articleId) {
            await github.rest.issues.removeLabel({ owner, repo, issue_number, name: label.name });
        }
    }
};
