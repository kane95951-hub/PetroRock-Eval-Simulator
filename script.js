/**
 * Génère les points de la courbe S1 (hydrocarbures libres).
 *
 * Le pic S1 correspond aux hydrocarbures déjà présents dans la roche
 * avant la pyrolyse : ils s'évaporent tôt et rapidement pendant la
 * chauffe, d'où une gaussienne volontairement étroite, centrée à 300°C.
 *
 * @param {number[]} temperatures - Températures (°C) où calculer la courbe
 * @param {number} valeurS1 - Valeur totale de S1 (mg HC/g roche) : pilote
 *                            la hauteur du pic (aire sous la courbe)
 * @returns {{temperature: number, valeur: number}[]} Tableau de points
 */
function genererS1(temperatures, valeurS1) {
  const centre = 300;   // °C — position du sommet du pic S1
  const largeur = 15;   // °C — écart-type : pic étroit et pointu

  return temperatures.map(function (temperature) {
    // Formule d'une gaussienne : la valeur diminue d'autant plus vite
    // que la température s'éloigne du centre (300°C).
    const exposant = -0.5 * Math.pow((temperature - centre) / largeur, 2);

    // Ce facteur assure que l'aire totale sous la courbe reste
    // proportionnelle à valeurS1, quelle que soit la largeur choisie.
    const hauteur = valeurS1 / (largeur * Math.sqrt(2 * Math.PI));

    const valeur = hauteur * Math.exp(exposant);

    return { temperature: temperature, valeur: valeur };
  });
}
