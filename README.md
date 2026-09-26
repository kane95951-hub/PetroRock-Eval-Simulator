# PetroRock-Eval Simulator

**Laboratoire numérique pédagogique** pour explorer les signaux de pyrolyse Rock-Eval, calculer les indices dérivés et analyser des tableaux d’échantillons.

- **Application publiée :** <https://kane95951-hub.github.io/PetroRock-Eval-Simulator/>
- **Version :** 2.0.3
- **Hébergement :** GitHub Pages, dépôt statique, sans serveur ni compte utilisateur dans l’application.

> **Limite d’usage.** Les courbes synthétiques, interprétations et alertes QC sont des aides pédagogiques. Elles ne remplacent ni une analyse instrumentale Rock-Eval, ni un contrôle qualité de laboratoire, ni l’interprétation géologique contextualisée.

## Espaces de travail

1. **Simulation** — saisir TOC, S1, HI, OI et une cible Tmax; choisir un type de matière organique et un repère de maturité indicatif. S1 est un paramètre indépendant. Les réglages de variabilité permettent de voir l’effet du bruit, de l’asymétrie, d’une épaule ou d’un signal S1 perturbé.
2. **Pyrogramme** — observer S1, S2 et S3 selon la température, afficher le Tmax détecté ou imposé, consulter les points calculés et exporter les données CSV ou une image PNG.
3. **Interprétation** — lire TOC, HI, OI, PI, PY et Tmax avec leurs unités; consulter les alertes de cohérence et le diagramme HI/OI; comparer deux scénarios sauvegardés; explorer la sensibilité par 500 tirages Monte-Carlo.
4. **Données & rapports** — importer un fichier CSV, TSV ou Excel `.xlsx`, associer les colonnes, calculer les indices, inspecter les tendances par profondeur, exporter une table enrichie et imprimer un rapport enregistrable en PDF.

Le laboratoire numérique propose les modes **Guidé**, **Examen** et **Défi**. La rampe animée suit 250, 300, 400, 450 et 600 °C. Les cas de défi masquent les indices avant la réponse. Une bibliothèque rappelle les paramètres principaux et leurs unités. Un guide de démarrage en une minute accompagne les nouvelles visites et reste accessible dans l’en-tête.

## Modèle et équations

Pour un scénario synthétique, TOC est en wt. %, S1/S2 en mg HC/g roche et S3 en mg CO₂/g roche. Les indices dérivés sont :

```text
S2 = HI × TOC / 100
S3 = OI × TOC / 100
HI = (S2 / TOC) × 100
OI = (S3 / TOC) × 100
PI = S1 / (S1 + S2)
PY = S1 + S2
Tmax = température du maximum du signal S2, quand il est détecté
```

Ces définitions suivent les présentations de la méthode par IFPEN et l’USGS. [IFPEN — formules HI/OI](https://www.ifpenergiesnouvelles.fr/breve/rock-evalr-aller-plus-loin), [USGS Open-File Report 90-698 — définitions Rock-Eval](https://pubs.usgs.gov/of/1990/0698/report.pdf).

Les signaux de démonstration sont des profils mathématiques dont l’aire est normalisée au rendement saisi. Le profil S1 est indépendant de S2; S2 est asymétrique autour de la cible Tmax; S3 est un pic plus large centré à 375 °C par convention illustrative. Le bruit, l’épaule, l’asymétrie et le déplacement du signal S1 sont des paramètres de démonstration, pas des modèles de mécanismes instrumentaux. Le maximum S2 est interpolé entre les points voisins pour le mode Tmax détecté.

Les profils ne décrivent pas la cinétique d’un appareil, la masse d’échantillon, le débit de gaz, la matrice minérale, les corrections instrumentales, la combustion ni les protocoles analytiques. Les préréglages de kérogène et le repère de maturité servent à construire des exemples; ils ne constituent pas une classification.

## Contrôle qualité indicatif

Le contrôle de cohérence signale les données manquantes ou négatives, un TOC non positif, un S2 inférieur à 0,2 mg HC/g roche, un S1 supérieur à quatre fois S2, PI supérieur à 0,4, HI supérieur à 1 200, OI supérieur à 300, Tmax hors de 300–500 °C et un écart supérieur à 10 % entre HI/OI fournis et recalculés. Ces valeurs sont des **heuristiques propres à l’application**, pas des normes ni des seuils diagnostiques. Chaque alerte demande une vérification de l’unité, du protocole, du signal et du contexte. Une absence d’alerte ne valide pas une mesure.

Tmax peut être peu fiable quand le pic S2 est faible; l’USGS indique également qu’une valeur nulle peut correspondre à un Tmax jugé non fiable. L’indice PI et les catégories HI/OI demandent une interprétation prudente, avec des données complémentaires. [USGS](https://pubs.usgs.gov/of/1990/0698/report.pdf), [IFPEN](https://www.ifpenergiesnouvelles.fr/breve/rock-evalr-aller-plus-loin).

## Importer des données

Les fichiers sont lus dans le navigateur; aucun fichier n’est envoyé à un serveur par l’application. Le format conseillé comporte une ligne d’en-tête, puis les colonnes suivantes :

| Paramètre | Alias reconnus (exemples) |
| --- | --- |
| Échantillon | `sample`, `sample_id`, `échantillon`, `id` |
| Puits | `well`, `puits` |
| Profondeur | `depth`, `depth_m`, `profondeur` |
| TOC | `TOC`, `COT`, `TOC (%)` |
| Rendements | `S1`, `S2`, `S3` |
| Tmax et indices | `Tmax`, `HI`/`IH`, `OI`/`IO` |
| Pyrogramme | `temperature`/`temp` avec `S2` par point |
| Contexte | `lithology`, `lithologie` |

Le séparateur CSV est détecté automatiquement et peut être changé. Les colonnes peuvent être remappées manuellement. Les cellules manquantes sont gardées et signalées; les lignes ne sont pas supprimées silencieusement. L’import est limité à 10 000 lignes et 15 Mo pour conserver une interaction fluide. Pour un classeur Excel, seule la première feuille est lue.

Quand une série température–S2 est fournie, Tmax est la température du maximum S2. Si les valeurs S2 varient point par point, elles sont traitées comme une trace de signal et ne sont pas assimilées à un rendement intégré calibré en mg/g : HI reste alors indisponible à moins qu’un HI ou un S2 intégré valide soit fourni. Sur les échantillons qui contiennent S2 intégré et TOC, HI est recalculé.

## Exports, historique et hors ligne

- **CSV du pyrogramme :** température et intensité par degré (aire intégrée en mg/g roche).
- **CSV enrichi :** données importées, indices recalculés, Tmax et titres d’alertes.
- **PNG :** pyrogramme avec fond et repère Tmax.
- **Rapport PDF :** ouvre la boîte de dialogue d’impression du navigateur; choisis « Enregistrer en PDF ». Le rapport inclut les résultats, graphiques, avertissements et jusqu’aux 1 000 premiers échantillons. Le CSV enrichi reste disponible pour la série complète.
- **Historique :** scénarios explicitement enregistrés dans le stockage local du navigateur; aucun compte ou synchronisation.
- **PWA :** le service worker met en cache les fichiers de l’application lors de la première visite en ligne. Ensuite, le simulateur et les données locales restent accessibles hors ligne.

L’application est en français et en anglais. Le thème, la langue et l’historique sont mémorisés localement. Le code de l’application ne charge pas de bibliothèque ou police externe.

## Lancer en local

Ouvre la racine du dépôt avec un serveur HTTP local, ou utilise GitHub Pages. Le service worker n’est pas activé en `file://`; les fonctions de simulation restent disponibles sans lui. Aucun paquet à installer ni étape de compilation n’est nécessaire.

GitHub Pages sert la racine de la branche `main`. Les changements sur cette branche sont publiés par Pages.

## Structure

```text
index.html      interface et espaces de travail
styles.v2.0.3.css  thèmes, mise en page responsive, impression et guide
script.v2.0.3.js   génération des signaux, indices, QC, import/export, graphiques et guide
manifest.json   manifeste PWA
sw.js           cache hors ligne versionné
icon.svg        icône de l’application
icons/          icônes PNG utilisées par le manifeste PWA
CHANGELOG.md    historique des versions
```

## Références scientifiques et techniques

- Behar, F., Beaumont, V., & De B. Penteado, H. L. (2001). *Rock-Eval 6 Technology: Performances and Developments*. Oil & Gas Science and Technology, 56(2), 111–134. [doi:10.2516/ogst:2001013](https://doi.org/10.2516/ogst:2001013).
- Espitalié, J. et al. (1977). *Méthode rapide de caractérisation des roches mères, de leur potentiel pétrolier et de leur degré d’évolution*. Revue de l’Institut Français du Pétrole, 32(1), 23–42. [doi:10.2516/ogst:1977002](https://doi.org/10.2516/ogst:1977002).
- Peters, K. E. (1986). *Guidelines for Evaluating Petroleum Source Rock Using Programmed Pyrolysis*. AAPG Bulletin, 70(3), 318–329. [doi:10.1306/94885688-1704-11D7-8645000102C1865D](https://doi.org/10.1306/94885688-1704-11D7-8645000102C1865D).
- Pimmel, A. & Claypool, G. (2001). *Introduction to Shipboard Organic Geochemistry*. ODP Technical Note 30. [DOI](https://doi.org/10.2973/odp.tn.30.2001) · [texte technique Rock-Eval](https://www-odp.tamu.edu/publications/tnotes/tn30/tn30_11.htm).
- USGS. *Rock Eval Data*, Open-File Report 90-698. [Définitions de S1, S2, S3, Tmax, HI, OI et PI](https://pubs.usgs.gov/of/1990/0698/report.pdf).
- IFPEN. [Rock-Eval® : pour aller plus loin](https://www.ifpenergiesnouvelles.fr/breve/rock-evalr-aller-plus-loin) · [Analyse thermique des roches et des sols](https://www.ifpenergiesnouvelles.fr/breve/rock-evalr-analyse-thermique-des-roches-et-des-sols).
- Tissot, B. P. & Welte, D. H. (1984). *Petroleum Formation and Occurrence*. [doi:10.1007/978-3-642-87813-8](https://doi.org/10.1007/978-3-642-87813-8).

## Journal des changements

Voir [CHANGELOG.md](CHANGELOG.md). Les retours d’étudiants, essais sur plusieurs navigateurs/appareils et validation d’échantillons de référence restent des vérifications externes à organiser par les utilisateurs du projet.

## Auteur

Ousmane Kane — EHES, Génie Pétrolier et Gaz, Dakar.

