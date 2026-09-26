/* PetroRock-Eval Simulator v2.0 — moteur de simulation et d'analyse client-side.
   Les données choisies par l'utilisateur restent dans le navigateur. */
'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const TEMP_MIN = 250;
const TEMP_MAX = 650;
const TEMP_STEP = 2;
const HISTORY_KEY = 'petrorock-history-v2';
const PREFERENCE_KEY = 'petrorock-preferences-v2';
const COLORS = { s1: '#7db9dc', s2: '#78ce9e', s3: '#eeab72', tmax: '#e9897f', blue: '#7db9dc', green: '#78ce9e', orange: '#eeab72', rose: '#e9897f', yellow: '#e3cf83' };
const PRESETS = {
  I: { hi: 760, oi: 25, s1: 0.55, tmax: 425, label: 'Type I · lacustre' },
  II: { hi: 450, oi: 35, s1: 0.42, tmax: 435, label: 'Type II · marin' },
  'II-III': { hi: 270, oi: 75, s1: 0.28, tmax: 440, label: 'Type II/III · mixte' },
  III: { hi: 140, oi: 150, s1: 0.18, tmax: 445, label: 'Type III · terrigène' },
  custom: { hi: 450, oi: 35, s1: 0.42, tmax: 435, label: 'Personnalisé' }
};

const I18N = {
  fr: {
    skip: 'Aller au contenu', 'brand-subtitle': 'Laboratoire numérique pédagogique', online: 'En ligne', 'eyebrow': 'GÉOCHIMIE · PYROLYSE PROGRAMMÉE', 'hero-title': 'Des signaux à l’interprétation.', 'hero-lede': 'Explore les pics S1, S2 et S3, calcule les indices Rock-Eval et confronte tes hypothèses à des données de terrain — dans un espace conçu pour apprendre et vérifier.', disclaimer: '<strong>Modèle numérique pédagogique.</strong> Les simulations et alertes ne constituent ni une mesure instrumentale ni un diagnostic géologique.', 'nav-simulation': 'Simulation', 'nav-pyro': 'Pyrogramme', 'nav-interpretation': 'Interprétation', 'nav-data': 'Données & rapports', 'step-one': 'ÉTAPE 1 · ÉCHANTILLON', 'input-title': 'Définir les conditions de pyrolyse', reset: 'Réinitialiser', sample: 'ÉCHANTILLON SYNTHÉTIQUE', 'sample-settings': 'Paramètres de la roche', 'sample-name': 'Nom du scénario', kerogen: 'Matière organique type', 'tmax-mode': 'Mode de lecture Tmax', detected: 'Détecté sur le pic S2', target: 'Valeur cible du scénario', 'preset-note': 'Les préréglages changent HI/OI et la description du scénario. S1 reste un paramètre autonome.', 'model-settings': 'Hypothèses du pyrogramme synthétique', realism: 'Variabilité simulée', 'realism-help': '0 % = profils lisses ; augmente le bruit de signal.', shoulder: 'Épaule S2', 'shoulder-help': 'Ajoute un second apport thermique plus discret.', asymmetry: 'Asymétrie du pic S2', 'asymmetry-help': 'Largeur de la montée par rapport à la descente.', contamination: 'Simuler un signal S1 perturbé', generate: 'Générer le scénario', 'virtual-lab': 'LABORATOIRE NUMÉRIQUE', 'heat-program': 'Programme de chauffe', 'lab-intro': 'Observe les signaux se libérer au fil de la rampe thermique. Le déroulé est illustratif et ne reproduit pas le protocole complet d’un appareil.', guided: 'Guidé', exam: 'Examen', challenge: 'Défi', 'oven-temperature': 'TEMPÉRATURE DU FOUR', 'start-pyrolysis': 'Démarrer la pyrolyse', pause: 'Pause', 'challenge-question': 'À ton avis, quel type de matière organique observes-tu ?', 'check-answer': 'Vérifier ma réponse', 'model-limits-title': 'Hypothèses visibles', 'model-limits-text': 'Les aires des pics représentent S1, S2 et S3. Les formes, l’épaule, le bruit et la contamination sont des paramètres de démonstration réglables.', 'see-method': 'Voir la méthode', 'recent-scenario': 'DERNIER SCÉNARIO', 'open-history': 'Historique →', 'step-two': 'ÉTAPE 2 · SIGNAUX', 'pyro-title': 'Lire le pyrogramme', 'pyro-lede': 'Les surfaces synthétiques sont normalisées aux rendements saisis. La position du maximum de S2 donne le Tmax du scénario.', 'export-png': 'Exporter le graphique PNG', 'export-csv': 'Exporter les points CSV', 'synthetic-pyro': 'PYROGRAMME SYNTHÉTIQUE', 'pyro-units': 'Intensité synthétique normalisée · température en °C', 'points-table': 'POINTS CALCULÉS', 'curve-values': 'Valeurs par température', 'csv-desc': 'Le fichier CSV contient les colonnes température, S1, S2 et S3.', 'step-three': 'ÉTAPE 3 · QUALITÉ & SENS', 'interpret-title': 'Interpréter avec prudence', 'interpret-lede': 'Les indices résument le scénario. Les repères guident la discussion, ils ne remplacent pas le contexte stratigraphique, la lithologie ou les contrôles de laboratoire.', 'save-scenario': 'Enregistrer ce scénario', 'derived-values': 'INDICES DÉRIVÉS', 'results-summary': 'Résumé des résultats', 'quality-control': 'CONTRÔLE DE COHÉRENCE', 'qc-title': 'Points à vérifier', 'qc-caveat': 'Alertes de dépistage heuristiques : une anomalie n’est pas un verdict, et l’absence d’alerte ne garantit pas une donnée valide.', crossplot: 'CROSSPLOT HI / OI', 'organic-matter': 'Repères de matière organique', 'indicative-zones': 'Zones schématiques · indicatives', 'crossplot-caveat': 'Les champs I / II / III sont des repères pédagogiques, non des frontières taxonomiques.', 'scenario-compare': 'COMPARAISON A / B', 'compare-title': 'Comparer deux scénarios', 'sample-a': 'Échantillon A', 'sample-b': 'Échantillon B', 'monte-carlo': 'INCERTITUDE · MONTE-CARLO', 'uncertainty-title': 'Explorer la sensibilité', 'uncertainty-intro': 'Perturbe les entrées selon une incertitude relative et observe une plage indicative d’indices dérivés.', 'relative-uncertainty': 'Incertitude relative sur S1, S2, S3', 'run-monte-carlo': 'Lancer 500 tirages', 'model-assumptions': 'Hypothèses, équations et limites du modèle', equations: 'Équations des indices', 'assumptions-copy': 'Les profils sont des courbes mathématiques normalisées, modulées par asymétrie, bruit et épaules réglables. Elles ne modélisent pas la cinétique instrumentale, le poids d’échantillon, la matrice minérale ou les corrections propres à un appareil. Une contamination simulée est un exemple de perturbation, pas un modèle de mécanisme réel.', 'classification-caveat': 'Les catégories de kérogène et de maturité restent des pistes de discussion. HI, OI, PI et Tmax sont influencés par le type d’échantillon, l’altération, les hydrocarbures migrés, les minéraux et le protocole.', 'step-four': 'ÉTAPE 4 · SÉRIES & EXPORT', 'data-title': 'Travailler sur des données réelles', 'data-lede': 'Importe un tableau localement. Les fichiers ne quittent pas ton navigateur. Les colonnes peuvent être détectées automatiquement ou associées manuellement.', 'example-csv': 'Télécharger un exemple CSV', 'local-analysis': 'ANALYSE LOCALE', 'import-data': 'Importer un jeu de données', 'drop-files': 'Dépose un fichier ou parcours tes dossiers', 'file-types': 'CSV, TSV ou Excel (.xlsx) · traitement dans ce navigateur', separator: 'Séparateur CSV', automatic: 'Automatique', 'load-data': 'Charger et analyser', 'column-mapping': 'Association des colonnes', 'column-mapping-help': 'Vérifie les colonnes reconnues. Les valeurs absentes sont conservées et signalées.', 'apply-import': 'Valider les colonnes', 'expected-data': 'FORMAT ATTENDU', 'data-columns': 'Colonnes utiles', 'required-fields': 'Paramètres Rock-Eval usuels', 'optional-fields': 'Profondeur, lithologie, puits / échantillon', 'optional-help': 'Pour les tendances verticales et les regroupements', 'pyrogram-columns': 'Température + S2 par point', 'pyrogram-help': 'Si fournis, Tmax est détecté sur le maximum de S2', 'data-caveat': 'HI, OI, PI et PY sont recalculés à partir des mesures disponibles. Les valeurs aberrantes ou insuffisantes sont marquées sans supprimer de lignes.', 'loaded-series': 'SÉRIE CHARGÉE', 'export-derived-csv': 'Exporter la table enrichie CSV', 'export-report': 'Créer le rapport PDF', 'depth-trends': 'Tendances en fonction de la profondeur', 'sample-comparison': 'HI / OI · comparaison des échantillons', 'browser-history': 'STOCKAGE LOCAL', 'scenario-history': 'Historique des scénarios', 'clear-history': 'Vider l’historique', 'history-privacy': 'Les scénarios enregistrés restent dans le stockage local de ce navigateur.', 'footer-tagline': 'Outil éducatif · traitement local · données non transmises', documentation: 'Documentation', 'open-history': 'Historique →'
  },
  en: {
    skip: 'Skip to content', 'brand-subtitle': 'Educational digital laboratory', online: 'Online', 'eyebrow': 'GEOCHEMISTRY · PROGRAMMED PYROLYSIS', 'hero-title': 'From signals to interpretation.', 'hero-lede': 'Explore S1, S2 and S3 peaks, calculate Rock-Eval indices and compare your hypotheses with field data—in a workspace built for learning and review.', disclaimer: '<strong>Educational numerical model.</strong> Simulations and alerts are not instrument measurements or geological diagnoses.', 'nav-simulation': 'Simulation', 'nav-pyro': 'Pyrogram', 'nav-interpretation': 'Interpretation', 'nav-data': 'Data & reports', 'step-one': 'STEP 1 · SAMPLE', 'input-title': 'Set pyrolysis conditions', reset: 'Reset', sample: 'SYNTHETIC SAMPLE', 'sample-settings': 'Rock parameters', 'sample-name': 'Scenario name', kerogen: 'Organic matter type', 'tmax-mode': 'Tmax reading mode', detected: 'Detect S2 peak maximum', target: 'Use scenario target', 'preset-note': 'Presets update HI/OI and the scenario description. S1 remains an independent parameter.', 'model-settings': 'Synthetic pyrogram assumptions', realism: 'Simulated variability', 'realism-help': '0% = smooth profiles; higher values add signal noise.', shoulder: 'S2 shoulder', 'shoulder-help': 'Adds a smaller secondary thermal contribution.', asymmetry: 'S2 peak asymmetry', 'asymmetry-help': 'Heating-side width relative to the cooling side.', contamination: 'Simulate a disturbed S1 signal', generate: 'Generate scenario', 'virtual-lab': 'DIGITAL LABORATORY', 'heat-program': 'Heating programme', 'lab-intro': 'Watch the signals appear along the heating ramp. This illustration does not reproduce a full instrument protocol.', guided: 'Guided', exam: 'Exam', challenge: 'Challenge', 'oven-temperature': 'OVEN TEMPERATURE', 'start-pyrolysis': 'Start pyrolysis', pause: 'Pause', 'challenge-question': 'Which organic matter type do you think this is?', 'check-answer': 'Check my answer', 'model-limits-title': 'Visible assumptions', 'model-limits-text': 'Peak areas represent S1, S2 and S3. Shape, shoulder, noise and contamination are adjustable demonstration parameters.', 'see-method': 'View method', 'recent-scenario': 'CURRENT SCENARIO', 'open-history': 'History →', 'step-two': 'STEP 2 · SIGNALS', 'pyro-title': 'Read the pyrogram', 'pyro-lede': 'Synthetic areas are normalized to the entered yields. The S2 maximum gives the scenario Tmax.', 'export-png': 'Export chart PNG', 'export-csv': 'Export points CSV', 'synthetic-pyro': 'SYNTHETIC PYROGRAM', 'pyro-units': 'Normalized synthetic intensity · temperature in °C', 'points-table': 'CALCULATED POINTS', 'curve-values': 'Values by temperature', 'csv-desc': 'The CSV contains temperature, S1, S2 and S3 columns.', 'step-three': 'STEP 3 · QUALITY & CONTEXT', 'interpret-title': 'Interpret with care', 'interpret-lede': 'Indices summarize the scenario. Reference fields support discussion; they do not replace stratigraphic context, lithology or laboratory checks.', 'save-scenario': 'Save this scenario', 'derived-values': 'DERIVED INDICES', 'results-summary': 'Result summary', 'quality-control': 'CONSISTENCY CHECK', 'qc-title': 'Items to review', 'qc-caveat': 'Heuristic screening alerts: an anomaly is not a verdict, and no alert does not guarantee valid data.', crossplot: 'HI / OI CROSSPLOT', 'organic-matter': 'Organic matter reference fields', 'indicative-zones': 'Schematic zones · indicative', 'crossplot-caveat': 'Type I / II / III fields are educational guides, not taxonomic boundaries.', 'scenario-compare': 'A / B COMPARISON', 'compare-title': 'Compare two scenarios', 'sample-a': 'Sample A', 'sample-b': 'Sample B', 'monte-carlo': 'UNCERTAINTY · MONTE CARLO', 'uncertainty-title': 'Explore sensitivity', 'uncertainty-intro': 'Perturb inputs by a relative uncertainty and inspect indicative ranges for derived indices.', 'relative-uncertainty': 'Relative uncertainty on S1, S2, S3', 'run-monte-carlo': 'Run 500 draws', 'model-assumptions': 'Model assumptions, equations and limits', equations: 'Index equations', 'assumptions-copy': 'Profiles are normalized mathematical curves with adjustable asymmetry, noise and shoulders. They do not model instrument kinetics, sample mass, mineral matrix or instrument-specific corrections. Simulated contamination is an example disturbance, not a physical mechanism model.', 'classification-caveat': 'Kerogen and maturity categories are discussion prompts. HI, OI, PI and Tmax are influenced by sample type, alteration, migrated hydrocarbons, minerals and protocol.', 'step-four': 'STEP 4 · SERIES & EXPORT', 'data-title': 'Work with real data', 'data-lede': 'Import a local table. Files stay in your browser. Columns can be detected automatically or mapped manually.', 'example-csv': 'Download sample CSV', 'local-analysis': 'LOCAL ANALYSIS', 'import-data': 'Import a dataset', 'drop-files': 'Drop a file or browse your folders', 'file-types': 'CSV, TSV or Excel (.xlsx) · processed in this browser', separator: 'CSV delimiter', automatic: 'Automatic', 'load-data': 'Load and analyse', 'column-mapping': 'Column mapping', 'column-mapping-help': 'Review recognized columns. Missing values are retained and flagged.', 'apply-import': 'Apply column mapping', 'expected-data': 'EXPECTED FORMAT', 'data-columns': 'Useful columns', 'required-fields': 'Common Rock-Eval parameters', 'optional-fields': 'Depth, lithology, well / sample', 'optional-help': 'For vertical trends and grouping', 'pyrogram-columns': 'Temperature + S2 by point', 'pyrogram-help': 'When supplied, Tmax is detected at the S2 maximum', 'data-caveat': 'HI, OI, PI and PY are recalculated from available measurements. Unusual or insufficient values are flagged without dropping rows.', 'loaded-series': 'LOADED SERIES', 'export-derived-csv': 'Export enriched table CSV', 'export-report': 'Create PDF report', 'depth-trends': 'Trends by depth', 'sample-comparison': 'HI / OI · sample comparison', 'browser-history': 'LOCAL STORAGE', 'scenario-history': 'Scenario history', 'clear-history': 'Clear history', 'history-privacy': 'Saved scenarios remain in this browser’s local storage.', 'footer-tagline': 'Educational tool · local processing · no data sent', documentation: 'Documentation'
  }
};
const EXTRA_I18N = {
  fr: {
    'maturity-label': 'Repère de maturité (indicatif)', 'maturity-low': 'Tmax illustratif bas · 420 °C', 'maturity-mid': 'Tmax illustratif médian · 435 °C', 'maturity-high': 'Tmax illustratif haut · 450 °C', 'maturity-custom': 'Tmax personnalisé', 'screening-thresholds': 'Les seuils QC intégrés sont des repères heuristiques propres au simulateur. Ils ne sont ni des normes Rock-Eval ni des seuils de diagnostic validés.',
    'kerogen-i': 'Type I · lacustre', 'kerogen-ii': 'Type II · marin', 'kerogen-mix': 'Type II/III · mixte', 'kerogen-iii': 'Type III · terrigène', 'kerogen-custom': 'Personnalisé', 'legend-s1': 'S1 · HC libres', 'legend-s2': 'S2 · HC pyrolysés', 'legend-s3': 'S3 · CO₂', 'temperature-column': 'Température (°C)', 's1-signal-column': 'S1 signal (mg HC/g roche/°C)', 's2-signal-column': 'S2 signal (mg HC/g roche/°C)', 's3-signal-column': 'S3 signal (mg CO₂/g roche/°C)',
    'glossary-title': 'Bibliothèque · paramètres Rock-Eval', 'glossary-toc': 'Carbone organique total de la roche, en pourcentage massique.', 'glossary-s1': 'Hydrocarbures libres volatilisés pendant la phase initiale, en mg HC/g roche.', 'glossary-s2': 'Hydrocarbures libérés par craquage thermique du kérogène, en mg HC/g roche.', 'glossary-s3': 'CO₂ issu de la pyrolyse, en mg CO₂/g roche.', 'glossary-tmax': 'Température au sommet du pic S2 ; à interpréter selon sa qualité et son contexte.', 'glossary-hi': 'Indice d’hydrogène : 100 × S2 / TOC, en mg HC/g TOC.', 'glossary-oi': 'Indice d’oxygène : 100 × S3 / TOC, en mg CO₂/g TOC.', 'glossary-pi': 'Indice de production : S1 / (S1 + S2), rapport sans unité.', 'glossary-py': 'Potentiel hydrocarboné mesuré par pyrolyse : S1 + S2.'
  },
  en: {
    'maturity-label': 'Maturity reference (indicative)', 'maturity-low': 'Illustrative low Tmax · 420 °C', 'maturity-mid': 'Illustrative mid Tmax · 435 °C', 'maturity-high': 'Illustrative high Tmax · 450 °C', 'maturity-custom': 'Custom Tmax', 'screening-thresholds': 'Built-in QC thresholds are heuristics specific to this simulator. They are not Rock-Eval standards or validated diagnostic cutoffs.',
    'kerogen-i': 'Type I · lacustrine', 'kerogen-ii': 'Type II · marine', 'kerogen-mix': 'Type II/III · mixed', 'kerogen-iii': 'Type III · terrigenous', 'kerogen-custom': 'Custom', 'legend-s1': 'S1 · free HC', 'legend-s2': 'S2 · pyrolyzed HC', 'legend-s3': 'S3 · CO₂', 'temperature-column': 'Temperature (°C)', 's1-signal-column': 'S1 signal (mg HC/g rock/°C)', 's2-signal-column': 'S2 signal (mg HC/g rock/°C)', 's3-signal-column': 'S3 signal (mg CO₂/g rock/°C)',
    'glossary-title': 'Library · Rock-Eval parameters', 'glossary-toc': 'Total organic carbon in the rock, expressed as mass percent.', 'glossary-s1': 'Free hydrocarbons volatilized in the initial phase, in mg HC/g rock.', 'glossary-s2': 'Hydrocarbons released by thermal cracking of kerogen, in mg HC/g rock.', 'glossary-s3': 'CO₂ released during pyrolysis, in mg CO₂/g rock.', 'glossary-tmax': 'Temperature at the S2 peak maximum; interpret with signal quality and context.', 'glossary-hi': 'Hydrogen index: 100 × S2 / TOC, in mg HC/g TOC.', 'glossary-oi': 'Oxygen index: 100 × S3 / TOC, in mg CO₂/g TOC.', 'glossary-pi': 'Production index: S1 / (S1 + S2), a unitless ratio.', 'glossary-py': 'Pyrolysis hydrocarbon potential: S1 + S2.'
  }
};

const state = {
  lang: 'fr', theme: 'dark', mode: 'guided', scenario: null, curve: [], metrics: {},
  history: [], records: [], datasetName: '', sourceRows: [], headers: [], mapping: {},
  selectedFile: null, animationTimer: null, animationPaused: false, heatIndex: 0,
  challenge: null, challengeActive: false, preChallengeScenario: null, lastMonteCarlo: null
};

function storageGet(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
function tr(key) { return EXTRA_I18N[state.lang]?.[key] || I18N[state.lang]?.[key] || EXTRA_I18N.fr[key] || I18N.fr[key] || key; }
function applyLanguage(lang) {
  state.lang = lang === 'en' ? 'en' : 'fr';
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach(el => { el.innerHTML = tr(el.dataset.i18n); });
  $('#language-toggle').textContent = state.lang === 'fr' ? 'EN' : 'FR';
  $('#language-toggle').setAttribute('aria-label', state.lang === 'fr' ? 'Switch to English' : 'Passer en français');
  updateConnectivity();
  renderQuickResults(); renderMetrics(); renderQc(); renderData(); renderHistory(); renderCrossplot(); renderComparison(); updateLabReadout();
  drawVisibleCharts();
  if (state.scenario) $('#chart-tmax-label').textContent = `${state.scenario.tmaxMode === 'target' ? (state.lang === 'fr' ? 'Tmax cible' : 'Target Tmax') : (state.lang === 'fr' ? 'Tmax détecté' : 'Detected Tmax')} : ${format(state.metrics.tmax, 0)} °C`;
  $('#realism-value').textContent = `${$('#realism').value} %`; $('#shoulder-value').textContent = `${$('#shoulder').value} %`; $('#asymmetry-value').textContent = `${format(Number($('#asymmetry').value) / 10, 1)}×`; $('#uncertainty-value').textContent = `${$('#uncertainty-range').value} %`;
  const prefs = storageGet(PREFERENCE_KEY, {}); prefs.lang = state.lang; storageSet(PREFERENCE_KEY, prefs);
}
function applyTheme(theme) {
  state.theme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  $('#theme-toggle').textContent = state.theme === 'dark' ? '☼' : '☾';
  $('#theme-toggle').setAttribute('aria-label', state.lang === 'fr' ? (state.theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre') : (state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
  const prefs = storageGet(PREFERENCE_KEY, {}); prefs.theme = state.theme; storageSet(PREFERENCE_KEY, prefs);
  drawVisibleCharts();
}
function format(value, digits = 1) {
  if (!Number.isFinite(Number(value))) return '—';
  return new Intl.NumberFormat(state.lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits === 0 ? 0 : Math.min(digits, 1) }).format(Number(value));
}
function htmlEscape(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
let toastTimer;
function showToast(message) {
  const node = $('#toast'); node.textContent = message; node.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 3200);
}

function activatePane(name) {
  $$('.nav-tab').forEach(tab => {
    const active = tab.dataset.pane === name;
    tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
  });
  $$('.workspace-pane').forEach(pane => {
    const active = pane.id === `pane-${name}`;
    pane.hidden = !active; pane.classList.toggle('active', active);
  });
  requestAnimationFrame(drawVisibleCharts);
}
$$('.nav-tab').forEach((tab, index, tabs) => {
  tab.addEventListener('click', () => activatePane(tab.dataset.pane));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
    tabs[target].focus(); tabs[target].click();
  });
});
$$('.jump-tab').forEach(button => button.addEventListener('click', () => activatePane(button.dataset.goto)));

function valuesFromForm() {
  return {
    id: `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: $('#sample-name').value.trim() || (state.lang === 'fr' ? 'Scénario sans nom' : 'Untitled scenario'),
    type: $('#kerogen-type').value,
    toc: Number($('#toc').value), s1: Number($('#s1').value), hi: Number($('#hi').value), oi: Number($('#oi').value),
    tmaxTarget: Number($('#tmax-target').value), tmaxMode: $('#tmax-mode').value, maturity: $('#maturity').value,
    realism: Number($('#realism').value) / 100, shoulder: Number($('#shoulder').value) / 100,
    asymmetry: Number($('#asymmetry').value) / 10, contamination: $('#contamination').checked,
    createdAt: new Date().toISOString()
  };
}
function validateScenario(sample) {
  const checks = [
    ['toc', sample.toc, 0.1, 30, 'TOC', '%'], ['s1', sample.s1, 0, 100, 'S1', 'mg HC/g roche'],
    ['hi', sample.hi, 0, 1200, 'HI', 'mg HC/g TOC'], ['oi', sample.oi, 0, 500, 'OI', 'mg CO₂/g TOC'],
    ['tmax-target', sample.tmaxTarget, 250, 650, 'Tmax', '°C']
  ];
  const errors = [];
  for (const [id, value, min, max, label, unit] of checks) {
    const input = $(`#${id}`); const invalid = !Number.isFinite(value) || value < min || value > max;
    input.setAttribute('aria-invalid', String(invalid));
    if (invalid) errors.push(`${label} ${state.lang === 'fr' ? 'doit être compris entre' : 'must be between'} ${min}–${max} ${unit}.`);
  }
  const error = $('#form-error'); error.hidden = errors.length === 0; error.textContent = errors.join(' ');
  return errors.length === 0;
}
function trapezoidArea(values, step) {
  let area = 0; for (let i = 1; i < values.length; i++) area += (values[i - 1] + values[i]) * step / 2; return area;
}
function normalized(values, area) {
  const total = trapezoidArea(values, TEMP_STEP);
  return total > 0 ? values.map(value => value * area / total) : values.map(() => 0);
}
function gaussianSeries(center, leftWidth, rightWidth, area) {
  const values = [];
  for (let temp = TEMP_MIN; temp <= TEMP_MAX; temp += TEMP_STEP) {
    const sigma = temp < center ? leftWidth : rightWidth;
    values.push(Math.exp(-0.5 * ((temp - center) / sigma) ** 2));
  }
  return normalized(values, area);
}
function noiseShape(values, intensity, seed) {
  if (intensity <= 0) return values;
  const perturbed = values.map((value, i) => {
    const variation = Math.sin((i + 1) * 12.9898 + seed * 78.233) * Math.cos((i + 9) * 4.1414 + seed * 11.17);
    return Math.max(0, value * (1 + variation * intensity));
  });
  return normalized(perturbed, trapezoidArea(values, TEMP_STEP));
}
function mixSeries(a, b, ratio, area) {
  return normalized(a.map((value, index) => value * (1 - ratio) + b[index] * ratio), area);
}
function detectPeak(points, field) {
  let index = 0;
  for (let i = 1; i < points.length; i++) if (points[i][field] > points[index][field]) index = i;
  if (index <= 0 || index >= points.length - 1) return points[index]?.temperature ?? NaN;
  const before = points[index - 1][field], at = points[index][field], after = points[index + 1][field];
  const denominator = before - 2 * at + after;
  const offset = denominator === 0 ? 0 : .5 * (before - after) / denominator;
  return points[index].temperature + Math.max(-1, Math.min(1, offset)) * TEMP_STEP;
}
function createCurve(sample) {
  const temperatures = Array.from({ length: ((TEMP_MAX - TEMP_MIN) / TEMP_STEP) + 1 }, (_, i) => TEMP_MIN + i * TEMP_STEP);
  const s2Total = sample.hi * sample.toc / 100;
  const s3Total = sample.oi * sample.toc / 100;
  const seed = (sample.toc * 17 + sample.s1 * 31 + sample.hi * 7 + sample.oi * 13 + sample.tmaxTarget) % 997;
  let s1 = gaussianSeries(295, 7, 9, sample.s1);
  const mainS2 = gaussianSeries(sample.tmaxTarget, 23 * sample.asymmetry, 15, s2Total);
  const shoulderCenter = Math.min(TEMP_MAX - 10, sample.tmaxTarget + 42);
  const shoulderS2 = gaussianSeries(shoulderCenter, 25, 19, s2Total);
  let s2 = mixSeries(mainS2, shoulderS2, sample.shoulder, s2Total);
  if (sample.contamination && sample.s1 > 0) {
    const contamination = gaussianSeries(322, 8, 12, sample.s1 * .3);
    s1 = normalized(s1.map((value, index) => value + contamination[index]), sample.s1);
  }
  s1 = noiseShape(s1, sample.realism, seed + 3);
  s2 = noiseShape(s2, sample.realism, seed + 7);
  let s3 = gaussianSeries(375, 43, 36, s3Total);
  s3 = noiseShape(s3, sample.realism * .7, seed + 11);
  const points = temperatures.map((temperature, index) => ({ temperature, s1: s1[index], s2: s2[index], s3: s3[index] }));
  let tmax = detectPeak(points, 's2');
  if (sample.tmaxMode === 'target') tmax = sample.tmaxTarget;
  return { points, s2Total, s3Total, tmax };
}
function deriveMetrics(record) {
  const toc = Number(record.toc), s1 = Number(record.s1), s2 = Number(record.s2), s3 = Number(record.s3);
  return {
    hi: Number.isFinite(toc) && toc > 0 && Number.isFinite(s2) ? s2 / toc * 100 : Number.isFinite(record.hi) ? Number(record.hi) : NaN,
    oi: Number.isFinite(toc) && toc > 0 && Number.isFinite(s3) ? s3 / toc * 100 : Number.isFinite(record.oi) ? Number(record.oi) : NaN,
    pi: Number.isFinite(s1) && Number.isFinite(s2) && s1 + s2 > 0 ? s1 / (s1 + s2) : NaN,
    py: Number.isFinite(s1) && Number.isFinite(s2) ? s1 + s2 : NaN,
    tmax: Number.isFinite(record.tmax) ? Number(record.tmax) : NaN
  };
}
function updateScenario(sample, autoSave = false) {
  const curve = createCurve(sample);
  const record = { ...sample, s2: curve.s2Total, s3: curve.s3Total, tmax: curve.tmax };
  const metrics = deriveMetrics(record);
  state.scenario = sample; state.curve = curve.points; state.metrics = metrics;
  $('#current-scenario-name').textContent = sample.name;
  $('#current-scenario-meta').textContent = `${format(sample.s1, 2)} mg HC/g · HI ${format(sample.hi, 0)} · OI ${format(sample.oi, 0)}`;
  $('#chart-title').textContent = sample.name;
  const tmaxLabel = sample.tmaxMode === 'target' ? (state.lang === 'fr' ? 'Tmax cible' : 'Target Tmax') : (state.lang === 'fr' ? 'Tmax détecté' : 'Detected Tmax');
  $('#chart-tmax-label').textContent = `${tmaxLabel} : ${format(metrics.tmax, 0)} °C`;
  $('#empty-chart').hidden = true;
  renderCurveTable(); renderQuickResults(); renderMetrics(); renderQc(); renderCrossplot(); renderComparison();
  updateLabReadout(); drawVisibleCharts();
  if (autoSave) saveScenario(sample, false);
}
function onGenerate(event) {
  event?.preventDefault();
  const sample = valuesFromForm();
  if (!validateScenario(sample)) return;
  updateScenario(sample);
  showToast(state.lang === 'fr' ? 'Scénario recalculé.' : 'Scenario recalculated.');
}
$('#scenario-form').addEventListener('submit', onGenerate);

$('#kerogen-type').addEventListener('change', event => {
  const preset = PRESETS[event.target.value];
  if (!preset || event.target.value === 'custom') return;
  $('#hi').value = preset.hi; $('#oi').value = preset.oi;
  if ($('#sample-name').value.includes('démo') || $('#sample-name').value.includes('demo')) $('#sample-name').value = preset.label;
  onGenerate();
});
const MATURITY_TARGETS = { low: 420, mid: 435, high: 450 };
$('#maturity').addEventListener('change', event => {
  const target = MATURITY_TARGETS[event.target.value];
  if (target) { $('#tmax-target').value = target; onGenerate(); }
});
$('#tmax-target').addEventListener('input', event => {
  const matching = Object.entries(MATURITY_TARGETS).find(([, target]) => target === Number(event.target.value));
  $('#maturity').value = matching?.[0] || 'custom';
});
[['realism', 'realism-value', value => `${value} %`], ['shoulder', 'shoulder-value', value => `${value} %`], ['asymmetry', 'asymmetry-value', value => `${format(value / 10, 1)}×`], ['uncertainty-range', 'uncertainty-value', value => `${value} %`]].forEach(([inputId, outputId, label]) => {
  $(`#${inputId}`).addEventListener('input', event => {
    $(`#${outputId}`).textContent = label(Number(event.target.value));
    if (inputId !== 'uncertainty-range' && state.scenario) onGenerate();
  });
});
$('#contamination').addEventListener('change', () => state.scenario && onGenerate());
$('#reset-button').addEventListener('click', () => {
  $('#sample-name').value = 'Échantillon marin — démo'; $('#kerogen-type').value = 'II'; $('#maturity').value = 'mid'; $('#toc').value = '5'; $('#s1').value = '0.42'; $('#hi').value = '450'; $('#oi').value = '35'; $('#tmax-target').value = '435'; $('#tmax-mode').value = 'detected';
  $('#realism').value = '12'; $('#shoulder').value = '0'; $('#asymmetry').value = '15'; $('#contamination').checked = false;
  $('#realism-value').textContent = '12 %'; $('#shoulder-value').textContent = '0 %'; $('#asymmetry-value').textContent = '1,5×';
  clearLab(); onGenerate();
});

function renderCurveTable() {
  const rows = state.curve.filter((_, index) => index % 5 === 0 || index === state.curve.length - 1);
  $('#curve-table').innerHTML = rows.map(point => `<tr><td>${format(point.temperature, 0)}</td><td>${format(point.s1, 4)}</td><td>${format(point.s2, 4)}</td><td>${format(point.s3, 4)}</td></tr>`).join('');
}
function renderQuickResults() {
  const m = state.metrics, sample = state.scenario;
  if (!sample) return;
  if (state.challengeActive) { $('#quick-results').innerHTML = `<div class="result-chip">${state.lang === 'fr' ? 'Indices masqués jusqu’à ta réponse au défi.' : 'Indices hidden until you answer the challenge.'}</div>`; return; }
  const rockUnit = state.lang === 'fr' ? 'mg HC/g roche' : 'mg HC/g rock';
  const chips = [
    ['S1', format(sample.s1, 2), rockUnit], ['S2', format(sample.hi * sample.toc / 100, 2), rockUnit],
    ['S3', format(sample.oi * sample.toc / 100, 2), state.lang === 'fr' ? 'mg CO₂/g roche' : 'mg CO₂/g rock'], ['Tmax', format(m.tmax, 0), '°C'], ['PI', format(m.pi, 3), state.lang === 'fr' ? 'sans unité' : 'unitless']
  ];
  $('#quick-results').innerHTML = chips.map(([label, value, unit]) => `<div class="result-chip"><span>${label}</span><b>${value}</b><small>${unit}</small></div>`).join('');
}
const METRIC_INFO = [
  ['hi', 'HI', 'mg HC/g TOC', 'Hydrocarbon potential normalized to organic carbon.'], ['oi', 'OI', 'mg CO₂/g TOC', 'CO₂ yield normalized to organic carbon.'], ['pi', 'PI', 'ratio', 'S1 / (S1 + S2), a contextual production ratio.'], ['py', 'PY', 'mg HC/g roche', 'Measured pyrolysis potential: S1 + S2.'], ['tmax', 'Tmax', '°C', 'Temperature at the maximum of the S2 signal.'], ['toc', 'TOC', 'wt. %', 'Total organic carbon in the rock.']
];
function renderMetrics() {
  const sample = state.scenario; if (!sample) return;
  if (state.challengeActive) { $('#metric-grid').innerHTML = `<div class="metric-card">${state.lang === 'fr' ? 'Indices masqués pendant le défi.' : 'Indices hidden during the challenge.'}</div>`; $('#interpretive-note').textContent = state.lang === 'fr' ? 'Réponds au défi pour afficher les indices et leur repère indicatif.' : 'Answer the challenge to reveal the indices and their indicative reference.'; return; }
  const m = state.metrics;
  $('#metric-grid').innerHTML = METRIC_INFO.map(([key, title, unit, note]) => {
    const value = key === 'toc' ? sample.toc : m[key];
    const places = key === 'pi' ? 3 : key === 'tmax' ? 0 : 1;
    const explanation = state.lang === 'fr' ? ({ hi: 'S2 rapporté au TOC', oi: 'S3 rapporté au TOC', pi: 'S1 / (S1 + S2)', py: 'Potentiel mesuré par pyrolyse', tmax: 'Maximum du signal S2', toc: 'Carbone organique total' }[key]) : note;
    return `<div class="metric-card"><span>${title}</span><b>${format(value, places)}</b><small>${unit}</small><div class="metric-explanation">${explanation}</div></div>`;
  }).join('');
  $('#interpretive-note').textContent = `${state.lang === 'fr' ? 'Repère HI/OI :' : 'HI/OI reference:'} ${normalizeType({ metrics: m })}. ${state.lang === 'fr' ? `Tmax ${format(m.tmax, 0)} °C est un indicateur de maturité à contextualiser, pas un verdict.` : `Tmax ${format(m.tmax, 0)} °C is a contextual maturity indicator, not a verdict.`}`;
}
function qcFor(record, metrics, model = false) {
  const items = [];
  const lang = state.lang;
  const push = (severity, title, detail) => items.push({ severity, title, detail });
  const missing = [['TOC', record.toc], ['S1', record.s1], ['S2', record.s2], ['S3', record.s3]].filter(([, value]) => !Number.isFinite(Number(value)));
  if (missing.length) push('error', lang === 'fr' ? 'Valeur(s) manquante(s)' : 'Missing value(s)', missing.map(([key]) => key).join(', '));
  const negative = [['TOC', record.toc], ['S1', record.s1], ['S2', record.s2], ['S3', record.s3]].filter(([, value]) => Number.isFinite(Number(value)) && Number(value) < 0);
  if (negative.length) push('error', lang === 'fr' ? 'Valeur négative impossible' : 'Negative value', negative.map(([key]) => key).join(', '));
  if (Number.isFinite(Number(record.toc)) && Number(record.toc) <= 0) push('error', 'TOC = 0', lang === 'fr' ? 'HI et OI ne peuvent pas être calculés sans TOC positif.' : 'HI and OI cannot be calculated without positive TOC.');
  if (Number.isFinite(Number(record.s2)) && Number(record.s2) < 0.2) push('warning', lang === 'fr' ? 'S2 très faible' : 'Very low S2', lang === 'fr' ? 'Le Tmax peut être peu fiable quand le pic S2 est faible.' : 'Tmax can be unreliable when the S2 peak is weak.');
  if (Number.isFinite(Number(record.hi)) && Number.isFinite(metrics.hi) && Math.abs(Number(record.hi) - metrics.hi) / Math.max(Math.abs(metrics.hi), 1) > .1) push('warning', lang === 'fr' ? 'HI déclaré différent du HI recalculé' : 'Reported HI differs from recalculated HI', lang === 'fr' ? 'Écart supérieur à 10 % : vérifier les unités, TOC et S2.' : 'Difference exceeds 10%: check units, TOC and S2.');
  if (Number.isFinite(Number(record.oi)) && Number.isFinite(metrics.oi) && Math.abs(Number(record.oi) - metrics.oi) / Math.max(Math.abs(metrics.oi), 1) > .1) push('warning', lang === 'fr' ? 'OI déclaré différent du OI recalculé' : 'Reported OI differs from recalculated OI', lang === 'fr' ? 'Écart supérieur à 10 % : vérifier les unités, TOC et S3.' : 'Difference exceeds 10%: check units, TOC and S3.');
  if (Number.isFinite(Number(record.s1)) && Number.isFinite(Number(record.s2)) && Number(record.s1) > 4 * Math.max(Number(record.s2), 0.05)) push('warning', lang === 'fr' ? 'S1 élevé par rapport à S2' : 'S1 high relative to S2', lang === 'fr' ? 'Vérifier les hydrocarbures migrés, la contamination, la lithologie et le protocole.' : 'Review migrated hydrocarbons, contamination, lithology and protocol.');
  if (Number.isFinite(metrics.pi) && metrics.pi > 0.4) push('warning', lang === 'fr' ? 'PI élevé' : 'High PI', lang === 'fr' ? 'Repère heuristique : contextualiser avec Tmax, la maturité et la qualité des données.' : 'Heuristic flag: interpret with Tmax, maturity and data quality.');
  if (Number.isFinite(metrics.hi) && metrics.hi > 1200) push('warning', 'HI > 1 200', lang === 'fr' ? 'Valeur extrême à vérifier avec les unités et la méthode de normalisation.' : 'Extreme value; check units and normalization.');
  if (Number.isFinite(metrics.oi) && metrics.oi > 300) push('warning', 'OI > 300', lang === 'fr' ? 'Valeur élevée à contextualiser avec TOC, minéralogie et protocole.' : 'High value; review TOC, mineralogy and protocol.');
  if (record.s2SignalOnly) push('warning', lang === 'fr' ? 'Trace S2 sans rendement intégré' : 'S2 trace without integrated yield', lang === 'fr' ? 'Tmax est détecté sur le maximum du signal. Une intensité par point ne remplace pas S2 calibré en mg/g pour calculer HI.' : 'Tmax is detected from the signal maximum. Point intensity is not a calibrated mg/g S2 yield for calculating HI.');
  if (Number.isFinite(metrics.tmax) && (metrics.tmax < 300 || metrics.tmax > 500)) push('warning', lang === 'fr' ? 'Tmax hors repère courant' : 'Tmax outside a common range', lang === 'fr' ? 'Vérifier le pic S2, la plage de chauffe, les unités et le signal.' : 'Check S2 peak, heating range, units and signal.');
  if (model && record.contamination) push('warning', lang === 'fr' ? 'Perturbation simulée' : 'Simulated disturbance', lang === 'fr' ? 'L’option de contamination a modifié le profil synthétique S1.' : 'The contamination option altered the synthetic S1 profile.');
  if (!items.length) push('ok', lang === 'fr' ? 'Aucune incohérence simple détectée' : 'No simple inconsistency flagged', lang === 'fr' ? 'Cela ne constitue pas une validation analytique.' : 'This is not analytical validation.');
  return items;
}
function renderQc() {
  const sample = state.scenario; if (!sample) return;
  if (state.challengeActive) { $('#qc-count').textContent = '—'; $('#qc-list').innerHTML = `<li class="qc-item">${state.lang === 'fr' ? 'Le contrôle qualité sera révélé après le défi.' : 'Quality checks will be shown after the challenge.'}</li>`; return; }
  const metrics = state.metrics;
  const record = { ...sample, s2: sample.hi * sample.toc / 100, s3: sample.oi * sample.toc / 100, tmax: metrics.tmax };
  const items = qcFor(record, metrics, true);
  $('#qc-count').textContent = String(items.filter(item => item.severity !== 'ok').length);
  $('#qc-list').innerHTML = items.map(item => `<li class="qc-item ${item.severity}"><span><b>${htmlEscape(item.title)}.</b> ${htmlEscape(item.detail)}</span></li>`).join('');
}

function cssColor(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function prepareCanvas(canvas) {
  if (!canvas || !canvas.isConnected) return null;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return null;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * ratio), height = Math.round(rect.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext('2d'); context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx: context, width: rect.width, height: rect.height };
}
function drawLineChart(canvas, datasets, options = {}) {
  const surface = prepareCanvas(canvas); if (!surface) return;
  const { ctx, width, height } = surface;
  const margin = { top: 15, right: 16, bottom: 42, left: 59 };
  const plot = { x: margin.left, y: margin.top, w: Math.max(20, width - margin.left - margin.right), h: Math.max(20, height - margin.top - margin.bottom) };
  const fg = cssColor('--muted'), grid = cssColor('--line'), accent = cssColor('--rose');
  const all = datasets.flatMap(set => set.points || []).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
  const xMin = options.xMin ?? Math.min(...all.map(point => point.x), 0), xMax = options.xMax ?? Math.max(...all.map(point => point.x), 1);
  const maxY = Math.max(...all.map(point => point.y), 0); const yMax = options.yMax || (maxY <= 0 ? 1 : maxY * 1.13);
  const x = value => plot.x + (value - xMin) / (xMax - xMin || 1) * plot.w;
  const y = value => plot.y + plot.h - value / (yMax || 1) * plot.h;
  ctx.clearRect(0, 0, width, height); ctx.fillStyle = cssColor('--panel'); ctx.fillRect(0, 0, width, height); ctx.font = '10px "DM Sans", sans-serif'; ctx.lineWidth = 1;
  const divisions = 5;
  for (let i = 0; i <= divisions; i++) {
    const py = plot.y + plot.h * i / divisions; const value = yMax * (divisions - i) / divisions;
    ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(plot.x, py); ctx.lineTo(plot.x + plot.w, py); ctx.stroke();
    ctx.fillStyle = fg; ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(format(value, yMax < 1 ? 2 : 1), plot.x - 8, py);
    const tx = xMin + (xMax - xMin) * i / divisions;
    ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(x(tx), plot.y); ctx.lineTo(x(tx), plot.y + plot.h); ctx.stroke();
    ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(format(tx, 0), x(tx), plot.y + plot.h + 8);
  }
  ctx.strokeStyle = cssColor('--line-strong'); ctx.beginPath(); ctx.moveTo(plot.x, plot.y); ctx.lineTo(plot.x, plot.y + plot.h); ctx.lineTo(plot.x + plot.w, plot.y + plot.h); ctx.stroke();
  if (options.annotation != null && options.annotation >= xMin && options.annotation <= xMax) {
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = accent; ctx.beginPath(); ctx.moveTo(x(options.annotation), plot.y); ctx.lineTo(x(options.annotation), plot.y + plot.h); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = accent; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(`Tmax ${format(options.annotation, 0)} °C`, Math.min(x(options.annotation) + 5, plot.x + plot.w - 75), plot.y + 3); ctx.restore();
  }
  datasets.forEach(set => {
    const points = (set.points || []).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
    if (!points.length) return;
    ctx.beginPath(); ctx.lineWidth = set.width || 2; ctx.strokeStyle = set.color; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    if (set.dash) ctx.setLineDash([5, 4]);
    points.forEach((point, index) => index ? ctx.lineTo(x(point.x), y(point.y)) : ctx.moveTo(x(point.x), y(point.y)));
    ctx.stroke(); ctx.setLineDash([]);
  });
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText(options.xLabel || (state.lang === 'fr' ? 'Température (°C)' : 'Temperature (°C)'), plot.x + plot.w / 2, height - 6);
}
function drawPyrogram(canvas = $('#pyrogram-chart')) {
  const curve = state.curve;
  if (!curve.length) { $('#empty-chart').hidden = false; return; }
  drawLineChart(canvas, [
    { points: curve.map(p => ({ x: p.temperature, y: p.s1 })), color: cssColor('--blue'), width: 2 },
    { points: curve.map(p => ({ x: p.temperature, y: p.s2 })), color: cssColor('--accent-strong'), width: 2.5 },
    { points: curve.map(p => ({ x: p.temperature, y: p.s3 })), color: cssColor('--orange'), width: 2 }
  ], { xMin: TEMP_MIN, xMax: TEMP_MAX, annotation: state.metrics.tmax });
}
function drawCrossplotOn(canvas, records) {
  const surface = prepareCanvas(canvas); if (!surface) return;
  const { ctx, width, height } = surface, margin = { left: 58, right: 20, top: 18, bottom: 43 };
  const plot = { x: margin.left, y: margin.top, w: width - margin.left - margin.right, h: height - margin.top - margin.bottom };
  const maxHi = Math.max(850, ...records.map(row => Number(row.metrics?.hi ?? row.hi)).filter(Number.isFinite));
  const maxOi = Math.max(180, ...records.map(row => Number(row.metrics?.oi ?? row.oi)).filter(Number.isFinite));
  const x = val => plot.x + val / maxHi * plot.w, y = val => plot.y + plot.h - val / maxOi * plot.h;
  ctx.clearRect(0, 0, width, height); ctx.fillStyle = cssColor('--panel'); ctx.fillRect(0, 0, width, height); ctx.font = '10px "DM Sans", sans-serif';
  for (let i = 0; i <= 4; i++) {
    const xx = plot.x + plot.w * i / 4, yy = plot.y + plot.h * i / 4;
    ctx.strokeStyle = cssColor('--line'); ctx.beginPath(); ctx.moveTo(xx, plot.y); ctx.lineTo(xx, plot.y + plot.h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(plot.x, yy); ctx.lineTo(plot.x + plot.w, yy); ctx.stroke();
    ctx.fillStyle = cssColor('--muted'); ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(format(maxHi * i / 4, 0), xx, plot.y + plot.h + 7);
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle'; ctx.fillText(format(maxOi * (4 - i) / 4, 0), plot.x - 8, yy);
  }
  // Schémas HI/OI illustratifs : l'application n'impose pas de seuil de typage.
  ctx.save(); ctx.setLineDash([4, 4]); ctx.lineWidth = 1; ctx.strokeStyle = cssColor('--subtle');
  [[500, 0, 250, maxOi * .24], [500, maxOi * .24, 190, maxOi * .5], [190, maxOi * .5, 0, maxOi]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x(x1), y(y1)); ctx.lineTo(x(x2), y(y2)); ctx.stroke(); }); ctx.restore();
  ctx.fillStyle = cssColor('--subtle'); ctx.font = '9px "DM Sans", sans-serif'; ctx.textAlign = 'left'; ctx.fillText('I · repère', x(635), y(28)); ctx.fillText('II · repère', x(340), y(64)); ctx.fillText('III · repère', x(45), y(maxOi * .77));
  records.forEach((row, index) => {
    const hi = Number(row.metrics?.hi ?? row.hi), oi = Number(row.metrics?.oi ?? row.oi);
    if (!Number.isFinite(hi) || !Number.isFinite(oi)) return;
    const color = row.color || [cssColor('--accent-strong'), cssColor('--blue'), cssColor('--orange'), cssColor('--rose')][index % 4];
    ctx.beginPath(); ctx.fillStyle = color; ctx.strokeStyle = cssColor('--page'); ctx.lineWidth = 2; ctx.arc(x(hi), y(oi), row.current ? 6 : 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  });
  ctx.fillStyle = cssColor('--muted'); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillText('HI · mg HC/g TOC', plot.x + plot.w / 2, height - 5);
  ctx.save(); ctx.translate(12, plot.y + plot.h / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText('OI · mg CO₂/g TOC', 0, 0); ctx.restore();
}
function comparisonRecords() {
  const rows = [];
  if (state.scenario && !state.challengeActive) rows.push({ name: state.scenario.name, hi: state.metrics.hi, oi: state.metrics.oi, current: true, color: cssColor('--accent-strong') });
  state.records.slice(0, 180).forEach((record, i) => rows.push({ name: record.name, metrics: record.metrics, hi: record.metrics.hi, oi: record.metrics.oi, color: [cssColor('--blue'), cssColor('--orange'), cssColor('--rose')][i % 3] }));
  state.history.slice(0, Math.max(0, 12 - rows.length)).forEach((item, i) => rows.push({ name: item.name, hi: item.hi, oi: item.oi, color: [cssColor('--blue'), cssColor('--orange'), cssColor('--rose')][i % 3] }));
  return rows;
}
function renderCrossplot() { drawCrossplotOn($('#crossplot-chart'), comparisonRecords()); }
function renderComparison() {
  const a = $('#compare-a'), b = $('#compare-b'); if (!a || !b) return;
  const items = [];
  if (state.scenario && !state.challengeActive) items.push({ id: state.scenario.id, name: state.scenario.name, scenario: state.scenario, curve: state.curve, metrics: state.metrics });
  state.history.forEach(item => { if (!items.some(found => found.id === item.id)) items.push(item); });
  const previousA = a.value, previousB = b.value;
  const options = items.map(item => `<option value="${htmlEscape(item.id)}">${htmlEscape(item.name)}</option>`).join('');
  a.innerHTML = options || '<option value="">—</option>'; b.innerHTML = options || '<option value="">—</option>';
  if (items.some(item => item.id === previousA)) a.value = previousA;
  if (items.some(item => item.id === previousB)) b.value = previousB;
  if (items.length > 1 && a.value === b.value) b.selectedIndex = 1;
  const chosenA = items.find(item => item.id === a.value) || items[0], chosenB = items.find(item => item.id === b.value) || items[1] || items[0];
  if (!chosenA || !chosenB) { $('#compare-summary').textContent = state.lang === 'fr' ? 'Enregistre un autre scénario pour comparer.' : 'Save another scenario to compare.'; return; }
  const curves = [chosenA, chosenB].map(item => item.curve || createCurve(item.scenario || item).points);
  drawLineChart($('#compare-chart'), curves.map((curve, index) => ({ color: index ? cssColor('--orange') : cssColor('--blue'), points: curve.map(point => ({ x: point.temperature, y: point.s2 })) })), { xMin: TEMP_MIN, xMax: TEMP_MAX });
  const met = item => item.metrics || deriveMetrics(item);
  const ma = met(chosenA), mb = met(chosenB);
  $('#compare-summary').innerHTML = `<span><b>A · ${htmlEscape(chosenA.name)}</b> — HI ${format(ma.hi, 0)} · Tmax ${format(ma.tmax, 0)} °C · PI ${format(ma.pi, 2)}</span><span><b>B · ${htmlEscape(chosenB.name)}</b> — HI ${format(mb.hi, 0)} · Tmax ${format(mb.tmax, 0)} °C · PI ${format(mb.pi, 2)}</span>`;
}
$('#compare-a').addEventListener('change', renderComparison); $('#compare-b').addEventListener('change', renderComparison);

function renderDepthMultiples(canvas, records) {
  const surface = prepareCanvas(canvas); if (!surface || !records.length) return;
  const { ctx, width, height } = surface;
  const fields = [['toc', 'TOC', 'wt. %'], ['hi', 'HI', 'mg HC/g TOC'], ['oi', 'OI', 'mg CO₂/g TOC'], ['pi', 'PI', 'ratio'], ['s2', 'S2', 'mg HC/g roche'], ['tmax', 'Tmax', '°C']];
  const columns = width < 610 ? 2 : 3, rows = Math.ceil(fields.length / columns), gap = 12;
  const cellW = (width - gap * (columns + 1)) / columns, cellH = (height - gap * (rows + 1)) / rows;
  const withDepth = records.some(row => Number.isFinite(row.depth));
  const depths = records.map(row => row.depth).filter(Number.isFinite), minDepth = Math.min(...depths, 0), maxDepth = Math.max(...depths, 1);
  ctx.clearRect(0, 0, width, height); ctx.fillStyle = cssColor('--panel'); ctx.fillRect(0, 0, width, height);
  fields.forEach(([key, label, unit], index) => {
    const col = index % columns, row = Math.floor(index / columns), left = gap + col * (cellW + gap), top = gap + row * (cellH + gap);
    const points = records.map((record, i) => ({ depth: Number.isFinite(record.depth) ? record.depth : i, value: Number(record[key] ?? record.metrics?.[key]) })).filter(point => Number.isFinite(point.value));
    const orderedPoints = withDepth ? [...points].sort((a, b) => a.depth - b.depth) : points;
    const min = Math.min(...points.map(point => point.value), 0), max = Math.max(...points.map(point => point.value), 1);
    ctx.fillStyle = cssColor('--panel'); ctx.fillRect(left, top, cellW, cellH); ctx.strokeStyle = cssColor('--line'); ctx.strokeRect(left, top, cellW, cellH);
    ctx.fillStyle = cssColor('--ink'); ctx.font = '600 10px "DM Sans", sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(label, left + 9, top + 7);
    ctx.fillStyle = cssColor('--subtle'); ctx.font = '8px "DM Sans", sans-serif'; ctx.fillText(unit, left + 9, top + 20);
    const plot = { x: left + 34, y: top + 34, w: cellW - 45, h: cellH - 49 };
    ctx.strokeStyle = cssColor('--line'); ctx.beginPath(); ctx.moveTo(plot.x, plot.y); ctx.lineTo(plot.x, plot.y + plot.h); ctx.lineTo(plot.x + plot.w, plot.y + plot.h); ctx.stroke();
    if (!orderedPoints.length) return;
    ctx.strokeStyle = [cssColor('--accent-strong'), cssColor('--blue'), cssColor('--orange'), cssColor('--rose'), '#8967ad', cssColor('--yellow')][index]; ctx.lineWidth = 1.6; ctx.beginPath();
    orderedPoints.forEach((point, i) => {
      const px = plot.x + (point.value - min) / (max - min || 1) * plot.w;
      const py = withDepth ? plot.y + (point.depth - minDepth) / (maxDepth - minDepth || 1) * plot.h : plot.y + (i / Math.max(points.length - 1, 1)) * plot.h;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }); ctx.stroke();
    ctx.fillStyle = cssColor('--muted'); ctx.font = '8px "DM Mono", monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; ctx.fillText(format(min, 1), plot.x, top + cellH - 4); ctx.textAlign = 'right'; ctx.fillText(format(max, 1), plot.x + plot.w, top + cellH - 4);
  });
  if (!records.some(row => Number.isFinite(row.depth))) {
    ctx.fillStyle = cssColor('--subtle'); ctx.font = '9px "DM Sans", sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillText(state.lang === 'fr' ? 'Ordre des lignes (profondeur absente)' : 'Row order (no depth column)', width - 10, 3);
  }
}
function drawVisibleCharts() {
  if ($('#pane-pyrogramme')?.classList.contains('active')) drawPyrogram();
  if ($('#pane-interpretation')?.classList.contains('active')) { drawCrossplotOn($('#crossplot-chart'), comparisonRecords()); renderComparison(); }
  if ($('#pane-data')?.classList.contains('active')) {
    drawDepthMultiples($('#depth-chart'), state.records);
    drawCrossplotOn($('#series-crossplot'), state.records.map(record => ({ ...record, metrics: record.metrics })));
  }
}
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawVisibleCharts, 120); });

function updateLabReadout() {
  $('#oven-temperature').textContent = String([250, 300, 400, 450, 600][Math.min(state.heatIndex, 4)]);
  $('#heat-progress').style.width = `${Math.min(100, state.heatIndex / 4 * 100)}%`;
  const stages = [
    state.lang === 'fr' ? 'Température initiale : prépare l’observation des premiers signaux.' : 'Initial temperature: prepare to observe the first signals.',
    state.lang === 'fr' ? 'Vers 300 °C, les hydrocarbures libres S1 sont représentés.' : 'Near 300 °C, free hydrocarbons S1 are represented.',
    state.lang === 'fr' ? 'Le signal S2 monte avec le craquage thermique simulé.' : 'The S2 signal rises with simulated thermal cracking.',
    state.lang === 'fr' ? 'Le CO₂ S3 est représenté sur une fenêtre thermique plus large.' : 'CO₂ signal S3 is represented over a broader thermal window.',
    state.lang === 'fr' ? `Le maximum S2 situe le Tmax autour de ${format(state.metrics.tmax, 0)} °C.` : `The S2 maximum places Tmax near ${format(state.metrics.tmax, 0)} °C.`
  ];
  const examProgress = state.lang === 'fr' ? `Cycle en cours · étape ${Math.min(state.heatIndex, 4)}/4.` : `Cycle in progress · step ${Math.min(state.heatIndex, 4)}/4.`;
  $('#lab-explanation').textContent = state.mode === 'exam' && state.heatIndex > 0 && state.heatIndex < 4 ? examProgress : state.heatIndex ? stages[Math.min(state.heatIndex, 4)] : (state.lang === 'fr' ? 'Prépare un scénario puis lance la pyrolyse virtuelle.' : 'Prepare a scenario, then start the virtual pyrolysis.');
  ['signal-s1', 'signal-s2', 'signal-s3', 'signal-tmax'].forEach((id, index) => $(`#${id}`).classList.toggle('visible', state.heatIndex >= [1, 2, 3, 4][index]));
}
function clearLab() {
  clearInterval(state.animationTimer); state.animationTimer = null; state.animationPaused = false; state.heatIndex = 0;
  const restoreScenario = state.challengeActive ? state.preChallengeScenario : null;
  state.challengeActive = false; state.challenge = null; state.preChallengeScenario = null; $('.input-panel').hidden = false;
  $('#pause-lab').disabled = true; $('#start-lab').disabled = false; $('#start-lab').querySelector('span:last-child').textContent = tr('start-pyrolysis');
  $('#lab-quiz').hidden = true; $('#quiz-feedback').textContent = ''; $('#quiz-type').value = '';
  if (restoreScenario) updateScenario(restoreScenario);
  updateLabReadout();
}
function finishLab() {
  clearInterval(state.animationTimer); state.animationTimer = null; state.animationPaused = false;
  $('#pause-lab').disabled = true; $('#start-lab').disabled = false; $('#start-lab').querySelector('span:last-child').textContent = tr('start-pyrolysis');
  if (state.mode === 'exam') $('#lab-explanation').textContent = state.lang === 'fr' ? 'Cycle terminé : S1 représente les hydrocarbures libres, S2 les hydrocarbures libérés par craquage, S3 le CO₂ mesuré pendant la pyrolyse et Tmax la température du maximum S2.' : 'Cycle complete: S1 represents free hydrocarbons, S2 hydrocarbons released by cracking, S3 CO₂ measured during pyrolysis, and Tmax the temperature of the S2 maximum.';
  if (state.mode === 'challenge') $('#lab-quiz').hidden = false;
}
function runLab() {
  if (!state.scenario) onGenerate();
  if (!state.scenario) return;
  if (state.animationPaused) { state.animationPaused = false; $('#pause-lab').textContent = tr('pause'); state.animationTimer = setInterval(advanceLab, 650); return; }
  clearLab(); state.heatIndex = 0; updateLabReadout();
  $('#start-lab').disabled = true; $('#pause-lab').disabled = false;
  if (state.mode === 'challenge') { state.preChallengeScenario = state.scenario; state.challengeActive = true; $('.input-panel').hidden = true; createChallenge(); }
  state.animationTimer = setInterval(advanceLab, 650);
}
function advanceLab() {
  if (state.heatIndex < 4) { state.heatIndex++; updateLabReadout(); return; }
  updateLabReadout(); finishLab();
}
$('#start-lab').addEventListener('click', runLab);
$('#pause-lab').addEventListener('click', () => {
  if (state.animationPaused) { state.animationPaused = false; $('#pause-lab').textContent = tr('pause'); state.animationTimer = setInterval(advanceLab, 650); }
  else if (state.animationTimer) { clearInterval(state.animationTimer); state.animationTimer = null; state.animationPaused = true; $('#pause-lab').textContent = state.lang === 'fr' ? 'Reprendre' : 'Resume'; }
});
$$('.mode-button').forEach(button => button.addEventListener('click', () => {
  $$('.mode-button').forEach(item => item.classList.toggle('active', item === button)); state.mode = button.dataset.mode;
  clearLab(); $('#lab-explanation').textContent = state.mode === 'guided' ? (state.lang === 'fr' ? 'Le mode guidé révèle une explication à chaque étape.' : 'Guided mode reveals an explanation at every stage.') : state.mode === 'exam' ? (state.lang === 'fr' ? 'Le mode examen masque les explications jusqu’à la fin du cycle.' : 'Exam mode hides explanations until the cycle ends.') : (state.lang === 'fr' ? 'Le mode défi propose un échantillon inconnu à interpréter.' : 'Challenge mode gives you an unknown sample to interpret.');
}));
function createChallenge() {
  const types = ['I', 'II', 'II-III', 'III']; const type = types[Math.floor(Math.random() * types.length)];
  const preset = PRESETS[type]; const challenge = { ...valuesFromForm(), id: `challenge-${Date.now()}`, name: state.lang === 'fr' ? 'Cas inconnu' : 'Unknown sample', type, hi: preset.hi, oi: preset.oi, s1: Math.max(.1, preset.s1 * (0.8 + Math.random() * .4)), tmaxTarget: 420 + Math.round(Math.random() * 35), realism: .06, shoulder: .1, contamination: false };
  state.challenge = challenge; updateScenario(challenge);
}
$('#quiz-submit').addEventListener('click', () => {
  const answer = $('#quiz-type').value; const target = state.challenge?.type;
  if (!answer) { $('#quiz-feedback').textContent = state.lang === 'fr' ? 'Choisis une réponse avant de vérifier.' : 'Choose an answer before checking.'; return; }
  const close = answer === target || (target === 'II-III' && ['II', 'III'].includes(answer)) || (answer === 'II-III' && ['II', 'III'].includes(target));
  $('#quiz-feedback').textContent = close ? (state.lang === 'fr' ? `Repère compatible : ${PRESETS[target]?.label}. La réponse reste indicative.` : `Compatible reference: ${PRESETS[target]?.label}. This remains indicative.`) : (state.lang === 'fr' ? `Autre hypothèse à discuter. Repère généré : ${PRESETS[target]?.label}. Les indices ne suffisent pas à eux seuls.` : `Consider another hypothesis. Generated reference: ${PRESETS[target]?.label}. Indices alone are not enough.`);
  state.challengeActive = false; state.preChallengeScenario = null; $('.input-panel').hidden = false;
  if (state.challenge) {
    $('#sample-name').value = state.challenge.name; $('#kerogen-type').value = state.challenge.type; $('#maturity').value = 'custom'; $('#toc').value = state.challenge.toc; $('#s1').value = state.challenge.s1; $('#hi').value = state.challenge.hi; $('#oi').value = state.challenge.oi; $('#tmax-target').value = state.challenge.tmaxTarget; $('#realism').value = state.challenge.realism * 100; $('#shoulder').value = state.challenge.shoulder * 100; $('#contamination').checked = state.challenge.contamination;
    updateScenario(state.challenge);
  }
});

function saveScenario(sample = state.scenario, notify = true) {
  if (!sample) return;
  const curve = sample.id === state.scenario?.id ? state.curve : createCurve(sample).points;
  const derived = sample.id === state.scenario?.id ? state.metrics : deriveMetrics({ ...sample, s2: sample.hi * sample.toc / 100, s3: sample.oi * sample.toc / 100, tmax: detectPeak(curve, 's2') });
  const item = { ...sample, metrics: derived, savedAt: new Date().toISOString() };
  state.history = [item, ...state.history.filter(entry => entry.id !== item.id)].slice(0, 30);
  storageSet(HISTORY_KEY, state.history); renderHistory(); renderComparison(); renderCrossplot();
  if (notify) showToast(state.lang === 'fr' ? 'Scénario enregistré dans ce navigateur.' : 'Scenario saved in this browser.');
}
$('#save-scenario').addEventListener('click', () => saveScenario());
function renderHistory() {
  const holder = $('#history-list'); if (!holder) return;
  if (!state.history.length) { holder.innerHTML = `<p class="history-empty">${state.lang === 'fr' ? 'Aucun scénario enregistré.' : 'No saved scenarios.'}</p>`; return; }
  holder.innerHTML = state.history.map(item => `<div class="history-entry"><div><strong>${htmlEscape(item.name)}</strong><small>${new Date(item.savedAt || item.createdAt).toLocaleString(state.lang === 'fr' ? 'fr-FR' : 'en-US')} · HI ${format(item.hi, 0)} · Tmax ${format(item.metrics?.tmax ?? item.tmaxTarget, 0)} °C</small></div><button class="text-button" data-restore="${htmlEscape(item.id)}" type="button">${state.lang === 'fr' ? 'Charger' : 'Load'}</button><button class="text-button" data-remove="${htmlEscape(item.id)}" type="button" aria-label="${state.lang === 'fr' ? 'Supprimer' : 'Remove'}">×</button></div>`).join('');
  $$('[data-restore]', holder).forEach(button => button.addEventListener('click', () => {
    const item = state.history.find(entry => entry.id === button.dataset.restore); if (!item) return;
    $('#sample-name').value = item.name; $('#kerogen-type').value = item.type; $('#maturity').value = item.maturity || 'custom'; $('#toc').value = item.toc; $('#s1').value = item.s1; $('#hi').value = item.hi; $('#oi').value = item.oi; $('#tmax-target').value = item.tmaxTarget; $('#tmax-mode').value = item.tmaxMode; $('#realism').value = item.realism * 100; $('#shoulder').value = item.shoulder * 100; $('#asymmetry').value = item.asymmetry * 10; $('#contamination').checked = item.contamination;
    updateScenario({ ...item, id: `scenario-${Date.now()}` }); activatePane('simulation');
  }));
  $$('[data-remove]', holder).forEach(button => button.addEventListener('click', () => { state.history = state.history.filter(item => item.id !== button.dataset.remove); storageSet(HISTORY_KEY, state.history); renderHistory(); renderComparison(); renderCrossplot(); }));
}
$('#clear-history').addEventListener('click', () => {
  state.history = []; storageSet(HISTORY_KEY, state.history); renderHistory(); renderComparison(); renderCrossplot();
  showToast(state.lang === 'fr' ? 'Historique local vidé.' : 'Local history cleared.');
});

function percentile(sorted, p) { return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))))]; }
$('#run-monte-carlo').addEventListener('click', () => {
  if (!state.scenario) return;
  const uncertainty = Number($('#uncertainty-range').value) / 100, results = [];
  for (let i = 0; i < 500; i++) {
    const perturb = value => Math.max(0, value * (1 + (Math.random() * 2 - 1) * uncertainty));
    const s1 = perturb(state.scenario.s1), s2 = perturb(state.scenario.hi * state.scenario.toc / 100), s3 = perturb(state.scenario.oi * state.scenario.toc / 100);
    const hi = state.scenario.toc > 0 ? s2 / state.scenario.toc * 100 : NaN, oi = state.scenario.toc > 0 ? s3 / state.scenario.toc * 100 : NaN;
    results.push({ hi, oi, pi: s1 + s2 > 0 ? s1 / (s1 + s2) : NaN, tmax: state.metrics.tmax + (Math.random() * 2 - 1) * (uncertainty * 50) });
  }
  const range = key => { const values = results.map(item => item[key]).filter(Number.isFinite).sort((a, b) => a - b); return [percentile(values, .05), percentile(values, .5), percentile(values, .95)]; };
  state.lastMonteCarlo = { uncertainty, range };
  const labels = [['hi', 'HI'], ['oi', 'OI'], ['pi', 'PI'], ['tmax', 'Tmax']];
  $('#monte-carlo-results').innerHTML = labels.map(([key, label]) => { const [low, mid, high] = range(key); return `<div><b>${label}</b> ${format(mid, key === 'pi' ? 3 : 1)} · P5–P95 ${format(low, key === 'pi' ? 3 : 1)}–${format(high, key === 'pi' ? 3 : 1)}${key === 'tmax' ? ' °C' : ''}</div>`; }).join('') + `<small>${state.lang === 'fr' ? 'Tirages pédagogiques · distribution uniforme choisie pour illustrer la sensibilité, pas un intervalle analytique validé.' : 'Educational draws · a uniform distribution illustrates sensitivity; it is not a validated analytical interval.'}</small>`;
});

let fileBuffer = null;
$('#data-file').addEventListener('change', event => { state.selectedFile = event.target.files?.[0] || null; $('#data-status').textContent = state.selectedFile ? state.selectedFile.name : ''; $('#data-status').classList.remove('error'); });
const dropZone = $('.drop-zone');
dropZone.addEventListener('dragover', event => { event.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
dropZone.addEventListener('drop', event => { event.preventDefault(); dropZone.classList.remove('drag-over'); state.selectedFile = event.dataTransfer.files?.[0] || null; $('#data-status').textContent = state.selectedFile?.name || ''; });

function chooseDelimiter(text) {
  const choice = $('#csv-separator').value;
  if (choice !== 'auto') return choice === '\\t' ? '\t' : choice;
  const first = text.split(/\r?\n/).find(line => line.trim()) || '';
  const options = [',', ';', '\t'];
  return options.map(separator => [separator, first.split(separator).length - 1]).sort((a, b) => b[1] - a[1])[0][0];
}
function parseDelimited(text, delimiter) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted && char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (!quoted && char === delimiter) { row.push(cell); cell = ''; }
    else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = ''; if (row.some(value => value.trim())) rows.push(row); row = [];
    } else cell += char;
  }
  row.push(cell); if (row.some(value => value.trim())) rows.push(row);
  return rows;
}
async function unzipXlsx(file) {
  const buffer = await file.arrayBuffer(), view = new DataView(buffer), bytes = new Uint8Array(buffer);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65558); i--) if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error(state.lang === 'fr' ? 'Archive Excel invalide.' : 'Invalid Excel archive.');
  const entryCount = view.getUint16(eocd + 10, true), centralOffset = view.getUint32(eocd + 16, true), decoder = new TextDecoder();
  const entries = new Map(); let cursor = centralOffset;
  for (let i = 0; i < entryCount; i++) {
    if (view.getUint32(cursor, true) !== 0x02014b50) break;
    const method = view.getUint16(cursor + 10, true), size = view.getUint32(cursor + 20, true), nameLen = view.getUint16(cursor + 28, true), extraLen = view.getUint16(cursor + 30, true), commentLen = view.getUint16(cursor + 32, true), localOffset = view.getUint32(cursor + 42, true);
    const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLen));
    const localNameLen = view.getUint16(localOffset + 26, true), localExtraLen = view.getUint16(localOffset + 28, true), dataStart = localOffset + 30 + localNameLen + localExtraLen;
    entries.set(name, { method, data: bytes.slice(dataStart, dataStart + size) });
    cursor += 46 + nameLen + extraLen + commentLen;
  }
  async function readEntry(name) {
    const entry = entries.get(name); if (!entry) return '';
    if (entry.method === 0) return decoder.decode(entry.data);
    if (entry.method !== 8 || typeof DecompressionStream === 'undefined') throw new Error(state.lang === 'fr' ? 'Ce navigateur ne peut pas décompresser ce fichier Excel. Enregistre-le en CSV puis réessaie.' : 'This browser cannot decompress this Excel file. Save it as CSV and try again.');
    try { const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return decoder.decode(await new Response(stream).arrayBuffer()); }
    catch { throw new Error(state.lang === 'fr' ? 'Lecture XLSX indisponible dans ce navigateur. Essaie le format CSV.' : 'XLSX reading is unavailable in this browser. Try CSV format.'); }
  }
  const sharedXml = await readEntry('xl/sharedStrings.xml');
  const shared = sharedXml ? [...new DOMParser().parseFromString(sharedXml, 'application/xml').getElementsByTagName('si')].map(item => item.textContent || '') : [];
  let sheetPath = 'xl/worksheets/sheet1.xml';
  const book = await readEntry('xl/workbook.xml'), rels = await readEntry('xl/_rels/workbook.xml.rels');
  if (book && rels) {
    const sheetId = new DOMParser().parseFromString(book, 'application/xml').getElementsByTagName('sheet')[0]?.getAttribute('r:id');
    const relXml = new DOMParser().parseFromString(rels, 'application/xml');
    const relation = [...relXml.getElementsByTagName('Relationship')].find(item => item.getAttribute('Id') === sheetId);
    if (relation) sheetPath = `xl/${relation.getAttribute('Target').replace(/^\//, '').replace(/^xl\//, '')}`;
  }
  const sheetXml = await readEntry(sheetPath); if (!sheetXml) throw new Error(state.lang === 'fr' ? 'Aucune première feuille Excel lisible.' : 'No readable first worksheet was found.');
  const xml = new DOMParser().parseFromString(sheetXml, 'application/xml'), grid = [];
  const colIndex = reference => { let result = 0; for (const char of reference.match(/^[A-Z]+/i)?.[0] || '') result = result * 26 + char.toUpperCase().charCodeAt(0) - 64; return result - 1; };
  for (const row of [...xml.getElementsByTagName('row')]) {
    const cells = [];
    for (const cell of [...row.getElementsByTagName('c')]) {
      const index = colIndex(cell.getAttribute('r') || 'A1'), value = cell.getElementsByTagName('v')[0]?.textContent ?? '';
      const typed = cell.getAttribute('t') === 's' ? (shared[Number(value)] ?? '') : cell.getAttribute('t') === 'inlineStr' ? (cell.getElementsByTagName('is')[0]?.textContent ?? '') : value;
      cells[index] = typed;
    }
    grid.push(cells.map(value => value ?? ''));
  }
  return grid;
}
function normalizeHeader(value) { return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(); }
const COLUMN_ALIASES = {
  depth: ['depth', 'profondeur', 'prof', 'depth m'], toc: ['toc', 'cot', 'toc wt', 'toc percent', 'carbone organique total'],
  s1: ['s1', 's1 mg hc g roche', 's1 mg hc g rock'], s2: ['s2', 's2 mg hc g roche', 's2 mg hc g rock'], s3: ['s3', 's3 mg co2 g roche', 's3 mg co2 g rock'],
  tmax: ['tmax', 't max', 'tmax c'], hi: ['hi', 'ih', 'hydrogen index', 'indice hydrogene'], oi: ['oi', 'io', 'oxygen index', 'indice oxygene'],
  temperature: ['temperature', 'temp', 'temperature c', 'temp c', 't c'], lithology: ['lithology', 'lithologie', 'facies'], well: ['well', 'puits', 'well name'], sample: ['sample', 'echantillon', 'sample id', 'id'],
};
function detectColumns(headers) {
  const normalized = headers.map(normalizeHeader), mapping = {};
  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    const index = normalized.findIndex(header => aliases.some(alias => header === normalizeHeader(alias) || header.startsWith(`${normalizeHeader(alias)} `)));
    mapping[key] = index >= 0 ? index : '';
  }
  return mapping;
}
function renderMapping(headers, mapping) {
  const labels = state.lang === 'fr' ? { depth: 'Profondeur', toc: 'TOC (%)', s1: 'S1', s2: 'S2', s3: 'S3', tmax: 'Tmax (°C)', hi: 'HI', oi: 'OI', temperature: 'Température (°C)', lithology: 'Lithologie', well: 'Puits', sample: 'ID échantillon' } : { depth: 'Depth', toc: 'TOC (%)', s1: 'S1', s2: 'S2', s3: 'S3', tmax: 'Tmax (°C)', hi: 'HI', oi: 'OI', temperature: 'Temperature (°C)', lithology: 'Lithology', well: 'Well', sample: 'Sample ID' };
  const absent = state.lang === 'fr' ? '— absent —' : '— not provided —';
  $('#mapping-fields').innerHTML = Object.entries(labels).map(([key, label]) => `<label class="mapping-field">${label}<select data-map="${key}"><option value="">${absent}</option>${headers.map((header, index) => `<option value="${index}" ${String(mapping[key]) === String(index) ? 'selected' : ''}>${htmlEscape(header)}</option>`).join('')}</select></label>`).join('');
  $('#column-map').hidden = false;
}
$('#load-data').addEventListener('click', async () => {
  const file = state.selectedFile;
  if (!file) { $('#data-status').textContent = state.lang === 'fr' ? 'Sélectionne d’abord un fichier CSV, TSV ou XLSX.' : 'Select a CSV, TSV or XLSX file first.'; $('#data-status').classList.add('error'); return; }
  if (file.size > 15 * 1024 * 1024) { $('#data-status').textContent = state.lang === 'fr' ? 'Le fichier dépasse 15 Mo. Divise-le en séries plus petites.' : 'File exceeds 15 MB. Split it into smaller series.'; $('#data-status').classList.add('error'); return; }
  try {
    $('#data-status').textContent = state.lang === 'fr' ? 'Lecture du fichier…' : 'Reading file…'; $('#data-status').classList.remove('error');
    let grid;
    if (/\.xlsx$/i.test(file.name)) grid = await unzipXlsx(file);
    else { const text = await file.text(); const delimiter = /\.tsv$/i.test(file.name) ? '\t' : chooseDelimiter(text); grid = parseDelimited(text.replace(/^\uFEFF/, ''), delimiter); }
    if (!grid.length || grid.length < 2) throw new Error(state.lang === 'fr' ? 'Le fichier ne contient pas d’en-tête et de lignes de données.' : 'The file needs a header row and data rows.');
    if (grid.length > 10001) throw new Error(state.lang === 'fr' ? 'Limite de 10 000 lignes pour garder l’analyse fluide. Aucune ligne n’a été importée; divise le fichier puis réessaie.' : 'The 10,000-row limit keeps analysis responsive. No rows were imported; split the file and try again.');
    state.headers = grid[0].map((cell, index) => String(cell || `Colonne ${index + 1}`).trim());
    state.sourceRows = grid.slice(1).map(row => state.headers.map((_, index) => row[index] ?? ''));
    state.datasetName = file.name; state.mapping = detectColumns(state.headers); fileBuffer = null;
    renderMapping(state.headers, state.mapping);
    $('#data-status').textContent = `${state.sourceRows.length} ${state.lang === 'fr' ? 'lignes lues. Vérifie les colonnes détectées.' : 'rows read. Review the detected columns.'}`;
  } catch (error) { $('#data-status').textContent = error.message || String(error); $('#data-status').classList.add('error'); }
});

function parseNumber(value) {
  if (value === null || value === undefined || String(value).trim() === '') return NaN;
  const clean = String(value).trim().replace(/\s/g, '').replace(/[€$]/g, '');
  if (clean.includes(',') && !clean.includes('.')) return Number(clean.replace(',', '.'));
  if (clean.includes(',') && clean.includes('.')) return Number(clean.replace(/,/g, ''));
  return Number(clean);
}
function compileRecords() {
  const mapping = Object.fromEntries($$('[data-map]').map(select => [select.dataset.map, select.value === '' ? '' : Number(select.value)]));
  state.mapping = mapping;
  const raw = state.sourceRows.map(row => Object.fromEntries(Object.entries(mapping).map(([key, index]) => [key, index === '' ? '' : row[index]])));
  const hasTemperature = mapping.temperature !== '', hasSample = mapping.sample !== '';
  if (hasTemperature && mapping.s2 !== '') {
    const groups = new Map();
    raw.forEach((row, index) => {
      const key = hasSample ? (row.sample || `échantillon ${index + 1}`) : (row.depth || row.well || 'pyrogramme importé');
      if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row);
    });
    state.records = [...groups.entries()].map(([name, rows]) => {
      const peak = rows.filter(row => Number.isFinite(parseNumber(row.temperature)) && Number.isFinite(parseNumber(row.s2))).sort((a, b) => parseNumber(b.s2) - parseNumber(a.s2))[0];
      const first = rows[0]; const get = key => mapping[key] === '' ? NaN : parseNumber(first[key]);
      const stableYield = key => {
        const values = rows.map(row => parseNumber(row[key])).filter(Number.isFinite);
        if (!values.length) return NaN;
        const reference = values[0];
        return values.every(value => Math.abs(value - reference) <= Math.max(1e-8, Math.abs(reference) * 1e-6)) ? reference : NaN;
      };
      const s2Trace = rows.map(row => parseNumber(row.s2)).filter(Number.isFinite);
      const s2SignalOnly = s2Trace.length > 1 && s2Trace.some(value => Math.abs(value - s2Trace[0]) > Math.max(1e-8, Math.abs(s2Trace[0]) * 1e-6));
      const record = { name, depth: get('depth'), toc: get('toc'), s1: stableYield('s1'), s2: stableYield('s2'), s3: stableYield('s3'), s2SignalOnly, peakS2Signal: peak ? parseNumber(peak.s2) : NaN, tmax: peak ? parseNumber(peak.temperature) : get('tmax'), hi: get('hi'), oi: get('oi'), lithology: first.lithology, well: first.well, sourceRows: rows.length };
      record.metrics = deriveMetrics(record); record.warnings = qcFor(record, record.metrics); record.name = first.sample || `${state.datasetName} · ${name}`; return record;
    });
  } else {
    state.records = raw.map((row, index) => {
      const get = key => mapping[key] === '' ? NaN : parseNumber(row[key]);
      const record = { name: row.sample || `${state.datasetName} · ${index + 1}`, depth: get('depth'), toc: get('toc'), s1: get('s1'), s2: get('s2'), s3: get('s3'), tmax: get('tmax'), hi: get('hi'), oi: get('oi'), lithology: row.lithology || '', well: row.well || '', rowNumber: index + 2 };
      record.metrics = deriveMetrics(record); record.warnings = qcFor(record, record.metrics); return record;
    });
  }
  if (!state.records.length) throw new Error(state.lang === 'fr' ? 'Aucune ligne exploitable dans le fichier.' : 'No usable rows in the file.');
  renderData(); activatePane('data'); showToast(state.lang === 'fr' ? `${state.records.length} échantillon(s) analysé(s) dans le navigateur.` : `${state.records.length} sample(s) analysed in the browser.`);
}
$('#apply-mapping').addEventListener('click', () => { try { compileRecords(); } catch (error) { $('#data-status').textContent = error.message; $('#data-status').classList.add('error'); } });

function renderData() {
  const panel = $('#series-panel'); if (!panel) return;
  panel.hidden = !state.records.length;
  if (!state.records.length) return;
  $('#series-title').textContent = `${state.datasetName} · ${state.records.length} ${state.lang === 'fr' ? 'échantillon(s)' : 'sample(s)'}`;
  const totalAlerts = state.records.reduce((sum, row) => sum + (row.warnings || []).filter(item => item.severity !== 'ok').length, 0);
  const withDepth = state.records.filter(row => Number.isFinite(row.depth)).length;
  $('#series-summary').innerHTML = `<span><b>${state.records.length}</b> ${state.lang === 'fr' ? 'lignes' : 'rows'}</span><span><b>${withDepth}</b> ${state.lang === 'fr' ? 'profondeurs' : 'depth values'}</span><span><b>${totalAlerts}</b> ${state.lang === 'fr' ? 'points QC à vérifier' : 'QC items to review'}</span><span>${state.lang === 'fr' ? 'Tmax extrait du maximum S2 si température fournie' : 'Tmax read from S2 maximum when temperature is supplied'}</span>`;
  const alerts = state.records.flatMap(record => (record.warnings || []).filter(item => item.severity !== 'ok').map(item => ({ name: record.name, item }))).slice(0, 120);
  $('#series-qc').innerHTML = totalAlerts ? `<details><summary>${state.lang === 'fr' ? `Détails des ${totalAlerts} alertes heuristiques` : `Details for ${totalAlerts} heuristic alerts`}</summary><ul>${alerts.map(({ name, item }) => `<li><b>${htmlEscape(name)} · ${htmlEscape(item.title)}</b> — ${htmlEscape(item.detail)}</li>`).join('')}${totalAlerts > alerts.length ? `<li>${state.lang === 'fr' ? `Affichage limité à ${alerts.length} alertes.` : `Showing first ${alerts.length} alerts.`}</li>` : ''}</ul></details>` : `<p class="fine-print">${state.lang === 'fr' ? 'Aucune incohérence simple signalée. Cela ne valide pas les mesures.' : 'No simple inconsistency flagged. This does not validate the measurements.'}</p>`;
  const headers = state.lang === 'fr' ? ['Échantillon', 'Profondeur', 'TOC', 'S1', 'S2', 'S3', 'HI', 'OI', 'PI', 'PY', 'Tmax', 'QC'] : ['Sample', 'Depth', 'TOC', 'S1', 'S2', 'S3', 'HI', 'OI', 'PI', 'PY', 'Tmax', 'QC'];
  $('#series-head').innerHTML = `<tr>${headers.map(head => `<th>${head}</th>`).join('')}</tr>`;
  $('#series-body').innerHTML = state.records.slice(0, 300).map(record => {
    const values = [record.name, Number.isFinite(record.depth) ? format(record.depth, 2) : '—', Number.isFinite(record.toc) ? format(record.toc, 2) : '—', Number.isFinite(record.s1) ? format(record.s1, 3) : '—', Number.isFinite(record.s2) ? format(record.s2, 3) : '—', Number.isFinite(record.s3) ? format(record.s3, 3) : '—', format(record.metrics.hi, 1), format(record.metrics.oi, 1), format(record.metrics.pi, 3), format(record.metrics.py, 2), format(record.metrics.tmax, 1), (record.warnings || []).filter(item => item.severity !== 'ok').length];
    return `<tr>${values.map((value, index) => `<td class="${index === values.length - 1 && Number(value) > 0 ? 'row-warning' : ''}">${htmlEscape(value)}</td>`).join('')}</tr>`;
  }).join('') + (state.records.length > 300 ? `<tr><td colspan="12">${state.lang === 'fr' ? 'Affichage limité aux 300 premières lignes. Export complet disponible.' : 'Showing first 300 rows. Full export available.'}</td></tr>` : '');
  drawVisibleCharts();
}

function csvQuote(value) { const text = String(value ?? ''); return /[",;\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function downloadBlob(filename, content, type = 'text/csv;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob(['\ufeff', content], { type });
  const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function exportCurveCsv() {
  const rows = [['temperature_C', 'S1_signal_mg_HC_g_rock_per_C', 'S2_signal_mg_HC_g_rock_per_C', 'S3_signal_mg_CO2_g_rock_per_C'], ...state.curve.map(point => [point.temperature, point.s1.toFixed(6), point.s2.toFixed(6), point.s3.toFixed(6)])];
  downloadBlob('petro-rockeval-pyrogramme.csv', rows.map(row => row.map(csvQuote).join(',')).join('\r\n'));
}
$('#export-csv').addEventListener('click', exportCurveCsv);
$('#export-png').addEventListener('click', () => {
  if (!state.curve.length) return showToast(state.lang === 'fr' ? 'Génère un scénario avant l’export.' : 'Generate a scenario before exporting.');
  activatePane('pyrogramme'); requestAnimationFrame(() => { drawPyrogram(); const link = document.createElement('a'); link.href = $('#pyrogram-chart').toDataURL('image/png'); link.download = 'petro-rockeval-pyrogramme.png'; link.click(); });
});
function exportDataCsv() {
  const headers = ['sample', 'well', 'lithology', 'depth', 'TOC_wt_percent', 'S1_mg_HC_g_rock', 'S2_mg_HC_g_rock', 'S3_mg_CO2_g_rock', 'HI_mg_HC_g_TOC', 'OI_mg_CO2_g_TOC', 'PI_ratio', 'PY_mg_HC_g_rock', 'Tmax_C', 'QC'];
  const rows = [headers, ...state.records.map(row => [row.name, row.well, row.lithology, row.depth, row.toc, row.s1, row.s2, row.s3, row.metrics.hi, row.metrics.oi, row.metrics.pi, row.metrics.py, row.metrics.tmax, (row.warnings || []).filter(item => item.severity !== 'ok').map(item => item.title).join(' | ')])];
  downloadBlob('petro-rockeval-donnees-enrichies.csv', rows.map(row => row.map(csvQuote).join(',')).join('\r\n'));
}
$('#export-series-csv').addEventListener('click', exportDataCsv);
$('#download-example').addEventListener('click', () => {
  const example = 'sample,well,depth_m,TOC_wt_percent,S1_mg_HC_g_rock,S2_mg_HC_g_rock,S3_mg_CO2_g_rock,Tmax_C,lithology\nA-01,Puit-A,1840,3.2,0.35,10.24,1.60,428,shale\nA-02,Puit-A,1880,4.1,0.62,13.12,1.64,433,shale\nA-03,Puit-A,1920,2.6,0.28,6.76,1.30,439,marl\nA-04,Puit-A,1960,1.8,0.21,3.06,1.26,446,marl\nA-05,Puit-A,2000,3.7,0.44,8.14,1.85,452,shale';
  downloadBlob('exemple-rockeval.csv', example);
});

function captureReportChart(draw) {
  const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 480;
  canvas.style.cssText = 'position:fixed;left:-200vw;top:0;width:1200px;height:480px;'; document.body.appendChild(canvas);
  const theme = state.theme; document.documentElement.dataset.theme = 'light';
  try { draw(canvas); return canvas.toDataURL('image/png'); }
  finally { document.documentElement.dataset.theme = theme; canvas.remove(); }
}
function makePrintReport() {
  const report = $('#print-report');
  const title = state.records.length ? `${state.lang === 'fr' ? 'Analyse de série' : 'Series analysis'} — ${state.datasetName}` : state.scenario?.name || 'PetroRock-Eval';
  const pyroImage = state.scenario ? captureReportChart(canvas => drawPyrogram(canvas)) : '';
  const crossplotImage = captureReportChart(canvas => drawCrossplotOn(canvas, state.records.length ? state.records : comparisonRecords()));
  const depthImage = state.records.length ? captureReportChart(canvas => renderDepthMultiples(canvas, state.records)) : '';
  const scenarioBody = state.scenario ? `<h2>${state.lang === 'fr' ? 'Scénario' : 'Scenario'}</h2><p>TOC ${format(state.scenario.toc, 2)} wt. % · S1 ${format(state.scenario.s1, 3)} mg HC/g rock · S2 ${format(state.scenario.hi * state.scenario.toc / 100, 3)} mg HC/g rock · S3 ${format(state.scenario.oi * state.scenario.toc / 100, 3)} mg CO₂/g rock · Tmax ${format(state.metrics.tmax, 1)} °C</p><p>HI ${format(state.metrics.hi, 1)} mg HC/g TOC · OI ${format(state.metrics.oi, 1)} mg CO₂/g TOC · PI ${format(state.metrics.pi, 3)} · PY ${format(state.metrics.py, 2)} mg HC/g rock</p><p>${htmlEscape(normalizeType({ metrics: state.metrics }))} · ${state.lang === 'fr' ? 'repère indicatif uniquement.' : 'indicative reference only.'}</p><img class="print-chart" src="${pyroImage}" alt="Pyrogramme synthétique">` : '';
  const tableHeaders = state.lang === 'fr' ? ['Échantillon', 'Profondeur', 'TOC', 'S1', 'S2', 'S3', 'HI', 'OI', 'PI', 'Tmax', 'QC'] : ['Sample', 'Depth', 'TOC', 'S1', 'S2', 'S3', 'HI', 'OI', 'PI', 'Tmax', 'QC'];
  const table = state.records.length ? `<h2>${state.lang === 'fr' ? 'Échantillons et indicateurs' : 'Samples and indicators'}</h2><table><thead><tr>${tableHeaders.map(label => `<th>${label}</th>`).join('')}</tr></thead><tbody>${state.records.slice(0, 1000).map(row => `<tr><td>${htmlEscape(row.name)}</td><td>${format(row.depth, 2)}</td><td>${format(row.toc, 2)}</td><td>${format(row.s1, 3)}</td><td>${format(row.s2, 3)}</td><td>${format(row.s3, 3)}</td><td>${format(row.metrics.hi, 1)}</td><td>${format(row.metrics.oi, 1)}</td><td>${format(row.metrics.pi, 3)}</td><td>${format(row.metrics.tmax, 1)}</td><td>${htmlEscape((row.warnings || []).filter(item => item.severity !== 'ok').map(item => item.title + ': ' + item.detail).join('; '))}</td></tr>`).join('')}</tbody></table>${state.records.length > 1000 ? `<p>${state.lang === 'fr' ? 'Rapport limité aux 1 000 premières lignes; le CSV enrichi contient toute la série.' : 'Report limited to the first 1,000 rows; the enriched CSV contains the full series.'}</p>` : ''}` : '';
  const caveat = state.lang === 'fr' ? 'Rapport pédagogique généré localement. Les résultats sont indicatifs et ne remplacent pas une analyse Rock-Eval instrumentale, un contrôle qualité de laboratoire ou une interprétation contextualisée.' : 'Educational report generated locally. Results are indicative and do not replace an instrumental Rock-Eval analysis, laboratory quality control or contextual interpretation.';
  const chartTitle = state.lang === 'fr' ? 'Diagramme HI / OI' : 'HI / OI crossplot';
  const depthTitle = state.lang === 'fr' ? 'Tendances géochimiques selon la profondeur' : 'Geochemical trends by depth';
  report.innerHTML = `<h1>PetroRock-Eval</h1><p class="print-meta">${htmlEscape(title)} · ${new Date().toLocaleString(state.lang === 'fr' ? 'fr-FR' : 'en-US')}</p><p>${caveat}</p>${scenarioBody}<h2>${chartTitle}</h2><img class="print-chart" src="${crossplotImage}" alt="${chartTitle}">${depthImage ? `<h2>${depthTitle}</h2><img class="print-chart" src="${depthImage}" alt="${depthTitle}">` : ''}${table}<h2>${state.lang === 'fr' ? 'Méthode et précautions' : 'Method and caveats'}</h2><p>HI = 100 × S2 / TOC · OI = 100 × S3 / TOC · PI = S1 / (S1 + S2) · PY = S1 + S2. Tmax is read from the S2 maximum where a pyrogram is available.</p><p>${caveat}</p><p class="print-meta">Sources: Behar et al. (2001), Espitalié et al. (1977), Peters (1986), IFPEN, USGS Open-File Report 90-698, ODP Technical Note 30.</p>`;
  window.print();
}
$('#export-report').addEventListener('click', makePrintReport);

function normalizeType(record) {
  const hi = Number(record.metrics?.hi ?? record.hi), oi = Number(record.metrics?.oi ?? record.oi);
  if (hi > 600 && oi < 50) return state.lang === 'fr' ? 'indices compatibles avec un repère Type I' : 'indices consistent with a Type I reference field';
  if (hi > 300 && oi < 120) return state.lang === 'fr' ? 'indices compatibles avec un repère Type II' : 'indices consistent with a Type II reference field';
  if (hi < 200 && oi > 60) return state.lang === 'fr' ? 'indices compatibles avec un repère Type III' : 'indices consistent with a Type III reference field';
  return state.lang === 'fr' ? 'indices mixtes ou à contextualiser' : 'mixed or context-dependent indices';
}

$('#language-toggle').addEventListener('click', () => applyLanguage(state.lang === 'fr' ? 'en' : 'fr'));
$('#theme-toggle').addEventListener('click', () => applyTheme(state.theme === 'dark' ? 'light' : 'dark'));
function updateConnectivity() {
  const online = navigator.onLine;
  $('#offline-indicator').classList.toggle('offline', !online);
  $('#offline-indicator span').textContent = online ? (state.lang === 'fr' ? 'En ligne' : 'Online') : (state.lang === 'fr' ? 'Hors ligne' : 'Offline');
}
window.addEventListener('online', updateConnectivity);
window.addEventListener('offline', updateConnectivity);
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));

// Initialisation depuis le navigateur : préférences locales et scénario de démonstration.
const savedPreferences = storageGet(PREFERENCE_KEY, {});
state.history = storageGet(HISTORY_KEY, []).filter(item => item && Number.isFinite(Number(item.toc)));
renderHistory(); applyLanguage(savedPreferences.lang || 'fr'); applyTheme(savedPreferences.theme || 'dark');
updateScenario(valuesFromForm());
$('#lab-explanation').textContent = state.lang === 'fr' ? 'Le mode guidé révèle une explication à chaque étape.' : 'Guided mode reveals an explanation at every stage.';

