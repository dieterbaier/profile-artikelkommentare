# Article comments for dieterbaier.eu

This repository contains public comments on the articles at
[dieterbaier.[eu, at, info, com]](https://dieterbaier.eu/).

The website remains entirely static. Anyone wishing to comment on an article
can open a pre-filled GitHub issue in this
repository via the relevant article. Existing comments are only loaded once readers
explicitly request them.

## Commenting on an article

Comments are normally created via the **Comment on this article** (_Diesen Artikel kommentieren_)
link in the relevant article. This means that the article ID, article title and
article URL are already pre-filled.

All comments are public. Please do not publish any confidential or
personal information that should not be publicly visible.

## Assignment

A GitHub Action recognises the structured issue form and creates the fixed label
`Artikelkommentar` itself if necessary. It also reads the article ID from
the issue body and checks it against `config/allowed-article-ids.json`. Only IDs of
published website articles are assigned an article-specific label such as
`ART-003-doc-as-code`.

The [`profile` repository](https://github.com/dieterbaier/profile) generates this allowlist from its metadata and
synchronises it following a successful public site deployment. The token
used for this requires write access to this repository.

When an issue is edited, the action resynchronises the article ID label
. Other labels and the actual comment remain unchanged.

This allows all article comments to be filtered, for example, as follows:

```text
is:issue label:Artikelkommentar
```

Comments on a specific article can be found using both labels:

```text
is:issue label:Artikelkommentar label:ART-003-doc-as-code
```

## Licence

The automation and repository structure are licensed under the [MIT Licence](LICENSE).
Comments posted by GitHub users remain the property
of their respective authors and are not re-licensed under the MIT Licence.
