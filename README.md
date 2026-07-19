# Artikelkommentare für dieterbaier.eu

Dieses Repository enthält öffentliche Kommentare zu den Artikeln auf
[dieterbaier.eu](https://dieterbaier.eu/).

Die Website bleibt vollständig statisch. Wer einen Artikel kommentieren möchte,
öffnet über den jeweiligen Artikel ein vorausgefülltes GitHub-Issue in diesem
Repository. Bestehende Kommentare werden erst geladen, nachdem Leserinnen oder
Leser dies ausdrücklich anfordern.

## Einen Artikel kommentieren

Kommentare werden normalerweise über den Link **Diesen Artikel kommentieren**
im jeweiligen Artikel angelegt. Dadurch sind Artikel-ID, Artikeltitel und
Artikel-URL bereits vorausgefüllt.

Alle Kommentare sind öffentlich. Bitte veröffentliche keine vertraulichen oder
personenbezogenen Informationen, die nicht öffentlich sichtbar sein sollen.

## Zuordnung

Das Issue Form weist jedem Kommentar das feste Label `Artikelkommentar` zu. Eine
GitHub Action liest außerdem die Artikel-ID aus dem strukturierten Issue-Body und
weist ein artikelspezifisches Label wie `ART-003-doc-as-code` zu.

Beim Bearbeiten eines Issues synchronisiert die Action das Artikel-ID-Label
erneut. Andere Labels und der eigentliche Kommentar bleiben unverändert.

Damit lassen sich alle Artikelkommentare beispielsweise so filtern:

```text
is:issue label:Artikelkommentar
```

Kommentare zu einem bestimmten Artikel lassen sich mit beiden Labels finden:

```text
is:issue label:Artikelkommentar label:ART-003-doc-as-code
```

## Lizenz

Die Automatisierung und Repository-Struktur stehen unter der [MIT-Lizenz](LICENSE).
Die von GitHub-Nutzerinnen und -Nutzern eingestellten Kommentare bleiben Inhalte
der jeweiligen Verfassenden und werden durch die MIT-Lizenz nicht neu lizenziert.
