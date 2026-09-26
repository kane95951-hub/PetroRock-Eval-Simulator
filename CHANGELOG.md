# Journal des modifications

## 2.0.5 — 2026-09-26

- Ajout d’une vue 2D animée du four de pyrolyse, de l’échantillon, de la ligne de gaz schématique et des signaux S1/S2/S3.
- La température, les pics, Tmax, les états de chauffe/pause et les libellés FR/EN suivent le cycle de simulation.

## 2.0.4 — 2026-09-26

- La page principale vérifie d’abord la version en ligne; le cache local sert de secours hors connexion.

## 2.0.3 — 2026-09-26

- Guide de démarrage resserré pour mieux afficher son bouton de fin dans les fenêtres courtes.
- Ressources versionnées pour appliquer correctement la mise en page mise à jour après publication.

## 2.0.2 — 2026-09-26

- Ajout d’un guide de démarrage court en quatre étapes, affiché à la première visite et rouvrable depuis l’en-tête.
- Chaque étape du guide ouvre directement l’onglet concerné; contenu disponible en français et en anglais.

## 2.0.1 — 2026-09-26

- Ressources CSS et JavaScript renommées pour éviter la réutilisation des anciens fichiers mis en cache par la version précédente du site.
- Indicateur de connexion initialisé d’après l’état réel du navigateur et courbes de profondeur triées par profondeur.

## 2.0.0 — 2026-09-26

- Refonte complète du simulateur en quatre espaces : simulation, pyrogramme, interprétation et analyse de données.
- Rendement S1 autonome; profils S1/S2/S3 normalisés, paramétrables et accompagnés d’hypothèses visibles.
- Détection de Tmax à partir du maximum S2, interpolation du sommet et validation des entrées.
- Calcul des indices HI, OI, PI et PY, alertes QC heuristiques et repères HI/OI présentés avec prudence.
- Laboratoire guidé, examen et défi; rampe de chauffe jusqu’à 600 °C.
- Comparaison A/B, historique local, analyse Monte-Carlo, import CSV/TSV/XLSX, associations de colonnes et graphiques par profondeur.
- Exports CSV et PNG, rapport imprimable en PDF, interface français/anglais, thèmes clair/sombre et cache hors ligne.
- Documentation du modèle, unités, limites, seuils heuristiques, références et usage local.

