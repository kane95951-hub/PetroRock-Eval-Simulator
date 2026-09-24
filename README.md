# PetroRock-Eval Simulator

Simulateur pédagogique de pyrolyse Rock-Eval — visualise, de façon simplifiée, comment une roche mère génère ses signaux **S1, S2, S3** et **Tmax** pendant une analyse Rock-Eval.

**Démo en ligne :** [kane95951-hub.github.io/PetroRock-Eval-Simulator](https://kane95951-hub.github.io/PetroRock-Eval-Simulator/)

Projet étudiant — EHES, Génie Pétrolier et Gaz, Groupe 01, Dakar. Réalisé avec l'assistance de Claude (Anthropic).

## À quoi ça sert ?

Cet outil s'adresse aux étudiants en géologie pétrolière qui découvrent la pyrolyse Rock-Eval et veulent relier intuitivement la théorie (TOC, HI, IO, Tmax) aux courbes qu'elle produit, sans avoir besoin d'un laboratoire ni d'échantillons réels.

## Fonctionnalités

- Formulaire de paramètres : **TOC** (%), **HI** (mg HC/g TOC), **IO** (mg CO2/g TOC), **Tmax cible** (°C)
- Préréglages rapides par type de kérogène (I, II, III)
- Validation des champs avec messages d'erreur en français
- Graphique interactif (Chart.js) des trois courbes S1/S2/S3, avec ligne annotant Tmax
- Export des points calculés en **CSV**
- Export du graphique en **image PNG**
- Mode sombre / clair (mémorisé d'une visite à l'autre)
- Application installable (PWA), avec un fonctionnement hors-ligne basique une fois visitée une première fois

## Comment ça marche (modèle simplifié)

Le simulateur ne mesure rien : il **génère** des courbes plausibles à partir des paramètres saisis, selon des règles simplifiées à but pédagogique :

- `S2 = HI × TOC / 100`, tracée comme une gaussienne asymétrique centrée sur Tmax (montée lente, descente rapide)
- `S3 = IO × TOC / 100`, tracée comme un pic plus large, centré à 400°C, indépendant de Tmax
- `S1 ≈ 0,075 × S2`, tracée comme une gaussienne étroite centrée à 300°C — le formulaire ne demandant pas S1 directement, cette valeur est estimée comme une petite fraction de S2

## Limites scientifiques — à lire avant utilisation

⚠️ **Ceci est une simulation pédagogique simplifiée, pas un outil de mesure.** Plusieurs approximations assumées :

- Les courbes sont des gaussiennes construites mathématiquement, pas des données de pyrolyse réelles
- S1 n'a pas de champ dédié et est estimé arbitrairement à partir de S2 (voir ci-dessus), ce qui ne reflète pas la réalité géochimique dans tous les cas
- La position et la largeur des pics (centre de S1 à 300°C, centre de S3 à 400°C, largeurs des trois pics) sont des valeurs fixes choisies pour donner une allure réaliste, pas calibrées sur des jeux de données mesurés
- Aucune variable de temps de rétention, de vitesse de chauffe ou d'appareil réel n'est prise en compte

Les sources scientifiques précises ayant inspiré ce modèle simplifié seront listées ici une fois vérifiées (voir la feuille de route du projet, semaine 7).

## Utilisation

**En ligne :** ouvre simplement le [lien de démo](https://kane95951-hub.github.io/PetroRock-Eval-Simulator/), aucune installation requise.

**En local :**
1. Clone ou télécharge ce dépôt
2. Ouvre `index.html` dans un navigateur (double-clic suffit, aucun serveur requis)

## Structure du projet

```
├── index.html        # Page principale (formulaire + graphique)
├── script.js          # Fonctions de génération des courbes (genererS1/S2/S3)
├── manifest.json       # Métadonnées de l'application installable (PWA)
├── sw.js              # Service worker (fonctionnement hors-ligne basique)
└── icons/             # Icônes de l'application
    ├── icon-192.png
    └── icon-512.png
```

## Technologies

HTML, CSS et JavaScript natifs (aucun framework), [Chart.js](https://www.chartjs.org/) pour les graphiques, hébergé gratuitement sur GitHub Pages.

## Auteur

Ousmane Kane — EHES, Génie Pétrolier et Gaz, Groupe 01, Dakar
