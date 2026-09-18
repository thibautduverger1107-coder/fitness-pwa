import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  Home, Target, Scale, UtensilsCrossed, Dumbbell, History as HistoryIcon,
  Heart, Trash2, ChevronLeft, ChevronRight, Flag, Plus, X, Check,
  LogOut, Lock, User as UserIcon, MessageCircle, Send, Sparkles, Music2, Flame, Footprints, Menu
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from "recharts";

/* ============================== BASE NUTRITIONNELLE (pour 100 g / 100 ml) ============================== */

const NUTRITION_DB = [
  { keywords: ["pomme de terre", "pommes de terre"], kcal: 87, prot: 2, lip: 0.1, gluc: 20 },
  { keywords: ["patate douce"], kcal: 90, prot: 2, lip: 0.2, gluc: 21 },
  { keywords: ["saumon fume", "saumon fumé"], kcal: 146, prot: 25, lip: 4.5, gluc: 0 },
  { keywords: ["saumon"], kcal: 208, prot: 20, lip: 13, gluc: 0 },
  { keywords: ["beurre de cacahuete", "beurre de cacahuète", "puree d'amande", "purée d'amande", "beurre d'amande"], kcal: 600, prot: 21, lip: 50, gluc: 20 },
  { keywords: ["fromage blanc"], kcal: 90, prot: 8, lip: 4, gluc: 4 },
  { keywords: ["cottage cheese"], kcal: 98, prot: 11, lip: 4.3, gluc: 3.4 },
  { keywords: ["yaourt grec"], kcal: 97, prot: 9, lip: 5, gluc: 4 },
  { keywords: ["skyr"], kcal: 63, prot: 11, lip: 0.2, gluc: 4 },
  { keywords: ["lait de coco"], kcal: 100, prot: 1, lip: 9, gluc: 3 },
  { keywords: ["lait"], kcal: 46, prot: 3.3, lip: 1.6, gluc: 4.8 },
  { keywords: ["comte", "comté", "fromage"], kcal: 350, prot: 25, lip: 28, gluc: 1 },
  { keywords: ["jambon"], kcal: 107, prot: 18, lip: 3, gluc: 1 },
  { keywords: ["dinde"], kcal: 110, prot: 24, lip: 1, gluc: 0 },
  { keywords: ["poulet"], kcal: 120, prot: 22, lip: 2.5, gluc: 0 },
  { keywords: ["boeuf", "bœuf", "steak"], kcal: 137, prot: 21, lip: 5, gluc: 0 },
  { keywords: ["thon"], kcal: 116, prot: 25, lip: 1, gluc: 0 },
  { keywords: ["cabillaud", "merlan", "poisson blanc", "poisson"], kcal: 82, prot: 18, lip: 0.7, gluc: 0 },
  { keywords: ["crevette"], kcal: 99, prot: 21, lip: 1.5, gluc: 0.5 },
  { keywords: ["oeuf", "œuf"], kcal: 155, prot: 13, lip: 11, gluc: 1.1 },
  { keywords: ["tofu"], kcal: 76, prot: 8, lip: 4.8, gluc: 1.9 },
  { keywords: ["riz"], kcal: 350, prot: 7, lip: 0.6, gluc: 78 },
  { keywords: ["boulgour"], kcal: 342, prot: 12, lip: 1.3, gluc: 76 },
  { keywords: ["semoule"], kcal: 360, prot: 13, lip: 1.1, gluc: 72 },
  { keywords: ["quinoa"], kcal: 368, prot: 14, lip: 6, gluc: 64 },
  { keywords: ["pates", "pâtes", "nouille"], kcal: 350, prot: 12, lip: 1.5, gluc: 70 },
  { keywords: ["avoine", "flocons"], kcal: 389, prot: 17, lip: 7, gluc: 66 },
  { keywords: ["pain complet", "pain"], kcal: 240, prot: 9, lip: 3, gluc: 41 },
  { keywords: ["tortilla", "galette"], kcal: 280, prot: 8, lip: 6, gluc: 48 },
  { keywords: ["lentille"], kcal: 116, prot: 9, lip: 0.4, gluc: 20 },
  { keywords: ["haricots rouges"], kcal: 127, prot: 9, lip: 0.5, gluc: 22 },
  { keywords: ["pois chiche"], kcal: 164, prot: 9, lip: 2.6, gluc: 27 },
  { keywords: ["haricots verts"], kcal: 31, prot: 1.8, lip: 0.1, gluc: 7 },
  { keywords: ["brocoli"], kcal: 34, prot: 2.8, lip: 0.4, gluc: 7 },
  { keywords: ["avocat"], kcal: 160, prot: 2, lip: 15, gluc: 9 },
  { keywords: ["banane"], kcal: 89, prot: 1.1, lip: 0.3, gluc: 23 },
  { keywords: ["pomme"], kcal: 52, prot: 0.3, lip: 0.2, gluc: 14 },
  { keywords: ["fruits rouges", "myrtille", "framboise"], kcal: 50, prot: 1, lip: 0.4, gluc: 11 },
  { keywords: ["orange", "clementine", "clémentine", "kiwi", "raisin"], kcal: 47, prot: 0.9, lip: 0.2, gluc: 12 },
  { keywords: ["compote"], kcal: 55, prot: 0.3, lip: 0.1, gluc: 13 },
  { keywords: ["miel"], kcal: 304, prot: 0.3, lip: 0, gluc: 82 },
  { keywords: ["cacao"], kcal: 230, prot: 20, lip: 11, gluc: 10 },
  { keywords: ["granola", "muesli"], kcal: 450, prot: 10, lip: 15, gluc: 65 },
  { keywords: ["amande", "noix", "noisette", "cajou", "graine"], kcal: 600, prot: 20, lip: 52, gluc: 16 },
  { keywords: ["huile"], kcal: 884, prot: 0, lip: 100, gluc: 0 },
  { keywords: ["whey"], kcal: 380, prot: 75, lip: 6, gluc: 8 },
  { keywords: ["legume", "légume", "courgette", "poivron", "epinard", "épinard", "tomate", "salade", "asperge", "fenouil", "champignon", "carotte", "concombre", "ratatouille"], kcal: 25, prot: 1.5, lip: 0.2, gluc: 4 },
];
const PIECE_WEIGHTS = { "oeuf": 50, "œuf": 50, "banane": 120, "pomme": 150, "avocat": 150, "tranche": 30 };

function stripAccents(s) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function matchIngredient(nom) {
  const norm = stripAccents(nom.toLowerCase());
  let best = null, bestLen = 0;
  for (const entry of NUTRITION_DB) {
    for (const kw of entry.keywords) {
      const kwNorm = stripAccents(kw.toLowerCase());
      if (norm.includes(kwNorm) && kwNorm.length > bestLen) {
        best = { entry, keyword: kwNorm };
        bestLen = kwNorm.length;
      }
    }
  }
  return best;
}
function computeIngredientMacros(qte, unite, nom) {
  const match = matchIngredient(nom || "");
  if (!match || !qte) return { kcal: 0, prot: 0, lip: 0, gluc: 0, recognized: false };
  let grams = qte;
  if (unite === "piece") {
    const w = PIECE_WEIGHTS[match.keyword] || 50;
    grams = qte * w;
  }
  const f = grams / 100;
  return {
    kcal: match.entry.kcal * f, prot: match.entry.prot * f,
    lip: match.entry.lip * f, gluc: match.entry.gluc * f, recognized: true,
  };
}
function sumMacros(ingredients) {
  let kcal = 0, prot = 0, lip = 0, gluc = 0, allRecognized = true;
  for (const i of ingredients) {
    const m = computeIngredientMacros(parseFloat(i.qte), i.unite, i.nom);
    kcal += m.kcal; prot += m.prot; lip += m.lip; gluc += m.gluc;
    if (i.nom.trim() && !m.recognized) allRecognized = false;
  }
  return { kcal: Math.round(kcal), prot: Math.round(prot), lip: Math.round(lip), gluc: Math.round(gluc), approx: !allRecognized };
}

/* ============================== METABOLISME / PROGRAMME PERSONNALISE ============================== */

function activityMultiplier(niveau) {
  return { "Sedentaire": 1.2, "Legere": 1.375, "Moderee": 1.55, "Intense": 1.725 }[niveau] || 1.375;
}
function goalAdjustment(objectifs) {
  const has = (o) => Array.isArray(objectifs) && objectifs.includes(o);
  if (has("Perte de poids") && has("Prise de muscle")) return -150;
  if (has("Perte de poids")) return -450;
  if (has("Prise de muscle")) return 280;
  return 0;
}
function computeMetabolism(p) {
  const poids = p.poidsActuel || p.poidsDepart;
  const objectifs = p.objectifs || (p.objectif ? [p.objectif] : ["Maintien"]);
  const bmr = p.sexe === "Femme"
    ? 10 * poids + 6.25 * p.taille - 5 * p.age - 161
    : 10 * poids + 6.25 * p.taille - 5 * p.age + 5;
  const mult = activityMultiplier(p.niveauActivite);
  const tdee = bmr * mult;
  const adj = goalAdjustment(objectifs);
  const recomposition = objectifs.includes("Perte de poids") && objectifs.includes("Prise de muscle");
  const repos = Math.round(bmr * 1.15 + adj * 0.85);
  const cardio = Math.round(tdee * 0.97 + adj);
  const muscu = Math.round(tdee * 1.02 + adj);
  const prot = Math.round(poids * (recomposition ? 2.2 : 2.1));
  const lip = Math.round(poids * 0.75);
  const gluc = (cible) => Math.max(50, Math.round((cible - prot * 4 - lip * 9) / 4));
  return {
    bmr: Math.round(bmr), tdee: Math.round(tdee),
    table: [
      { type: "Repos (aucun sport)", cible: repos, prot, lip, gluc: gluc(repos) },
      { type: "Jour cardio", cible: cardio, prot, lip, gluc: gluc(cardio) },
      { type: "Jour musculation", cible: muscu, prot, lip, gluc: gluc(muscu) },
    ],
  };
}
function normalizeProfile(p) {
  if (!p) return p;
  if (!p.objectifs) return { ...p, objectifs: p.objectif ? [p.objectif] : ["Maintien"] };
  return p;
}

const SUPPLEMENT_KB = [
  { keywords: ["vitamine d3", "vitamine d", "vit d"], dose: "2 000 UI / jour", moment: "Le matin, avec un repas contenant des lipides" },
  { keywords: ["multivitamine", "complexe vitamine"], dose: "1 prise / jour", moment: "Le matin, au petit-déjeuner" },
  { keywords: ["omega 3", "oméga 3", "epa", "dha"], dose: "2 à 3 g / jour", moment: "Au cours des repas" },
  { keywords: ["omega 6", "oméga 6"], dose: "Voie alimentaire suffisante", moment: "Pas de complément nécessaire sauf carence" },
  { keywords: ["creatine", "créatine"], dose: "3 à 5 g / jour", moment: "Tous les jours, moment indifférent" },
  { keywords: ["whey", "proteine", "protéine"], dose: "25 à 30 g", moment: "Dans l'heure suivant la musculation" },
  { keywords: ["magnesium", "magnésium"], dose: "300 à 400 mg / jour", moment: "Le soir" },
  { keywords: ["zinc"], dose: "15 à 25 mg / jour", moment: "Le soir, à distance des repas riches en calcium" },
  { keywords: ["fer"], dose: "Selon bilan sanguin", moment: "Le matin à jeun, avec de la vitamine C" },
  { keywords: ["calcium"], dose: "500 à 1000 mg / jour", moment: "Réparti sur la journée, à distance du fer" },
  { keywords: ["bcaa"], dose: "5 à 10 g", moment: "Pendant ou juste après l'entraînement" },
  { keywords: ["glutamine"], dose: "5 g / jour", moment: "Après l'entraînement ou avant le coucher" },
  { keywords: ["collagene", "collagène"], dose: "10 g / jour", moment: "Le matin à jeun" },
  { keywords: ["probiotique"], dose: "1 prise / jour", moment: "Le matin à jeun ou selon la notice" },
  { keywords: ["vitamine c", "vit c"], dose: "500 à 1000 mg / jour", moment: "Le matin" },
  { keywords: ["vitamine b12", "b12"], dose: "1000 µg / semaine", moment: "Le matin" },
  { keywords: ["ashwagandha"], dose: "300 à 600 mg / jour", moment: "Le soir" },
  { keywords: ["melatonine", "mélatonine"], dose: "1 à 3 mg", moment: "30 minutes avant le coucher" },
  { keywords: ["zma"], dose: "1 dose / jour", moment: "Le soir, à jeun avant le coucher" },
  { keywords: ["cafeine", "caféine", "pre-workout", "pré-workout"], dose: "150 à 300 mg", moment: "20 à 30 minutes avant l'entraînement" },
  { keywords: ["curcuma"], dose: "500 à 1000 mg / jour", moment: "Avec un repas contenant des lipides" },
  { keywords: ["spiruline"], dose: "3 à 5 g / jour", moment: "Le matin" },
];
function matchSupplement(nom) {
  const norm = stripAccents(nom.toLowerCase());
  let best = null, bestLen = 0;
  for (const entry of SUPPLEMENT_KB) {
    for (const kw of entry.keywords) {
      const kwNorm = stripAccents(kw.toLowerCase());
      if (norm.includes(kwNorm) && kwNorm.length > bestLen) { best = entry; bestLen = kwNorm.length; }
    }
  }
  return best;
}
function defaultSupplements() {
  return [
    { id: 1, nom: "Vitamine D3", dose: "2 000 UI / jour", moment: "Le matin, avec un repas contenant des lipides" },
    { id: 2, nom: "Complexe multivitamine", dose: "1 prise / jour", moment: "Le matin, au petit-déjeuner" },
    { id: 3, nom: "Oméga 3 (EPA/DHA)", dose: "2 à 3 g / jour", moment: "Au cours des repas" },
    { id: 4, nom: "Créatine monohydrate", dose: "3 à 5 g / jour", moment: "Tous les jours, moment indifférent" },
    { id: 5, nom: "Whey", dose: "25 à 30 g", moment: "Dans l'heure suivant la musculation" },
    { id: 6, nom: "Magnésium (bisglycinate)", dose: "300 à 400 mg / jour", moment: "Le soir" },
  ];
}

const MOMENTS = ["Petit-déjeuner", "Collation matin", "Déjeuner", "Collation après-midi", "Dîner"];

/* ============================== COEFFICIENT DE PORTION ============================== */

const MOMENT_SHARE = { "Petit-déjeuner": 0.25, "Collation matin": 0.10, "Déjeuner": 0.30, "Collation après-midi": 0.10, "Dîner": 0.25 };

function suggestedCoefficient(recipe, metabolism) {
  if (!recipe.macros || !recipe.macros.kcal || !metabolism) return 1;
  const avgCible = metabolism.table.reduce((s, r) => s + r.cible, 0) / metabolism.table.length;
  const target = avgCible * (MOMENT_SHARE[recipe.moment] || 0.2);
  let coef = target / recipe.macros.kcal;
  coef = Math.round(coef * 4) / 4;
  return Math.min(2.5, Math.max(0.25, coef));
}
function getCoefficient(recipeId, coefficients, recipe, metabolism) {
  if (coefficients && coefficients[recipeId] != null) return coefficients[recipeId];
  return suggestedCoefficient(recipe, metabolism);
}
function scaleMacros(macros, coef) {
  if (!macros) return null;
  return {
    kcal: Math.round(macros.kcal * coef), prot: Math.round(macros.prot * coef),
    lip: Math.round(macros.lip * coef), gluc: Math.round(macros.gluc * coef), approx: macros.approx,
  };
}
function countToNumber(str) {
  if (str.includes("/")) { const [a, b] = str.split("/"); return parseFloat(a) / parseFloat(b); }
  return parseFloat(str);
}
function formatCount(n) {
  if (Number.isInteger(n)) return String(n);
  return String(parseFloat(n.toFixed(2)));
}
function scaleSegment(seg, coef) {
  let m = seg.match(/^(\d+(?:[.,]\d+)?)\s*(g|ml)\b(.*)$/i);
  if (m) {
    const num = parseFloat(m[1].replace(",", "."));
    const scaled = Math.max(1, Math.round(num * coef));
    return `${scaled} ${m[2]}${m[3]}`;
  }
  m = seg.match(/^(\d+(?:\/\d+)?)\s+(.+?)\s*\((\d+(?:[.,]\d+)?)\s*g\)(.*)$/i);
  if (m) {
    const baseCount = countToNumber(m[1]);
    const gramNum = parseFloat(m[3].replace(",", "."));
    const scaledCount = formatCount(Math.max(0.5, baseCount * coef));
    const scaledGram = Math.max(1, Math.round(gramNum * coef));
    return `${scaledCount} ${m[2]} (${scaledGram} g)${m[4]}`;
  }
  return seg;
}
function scaleDesc(desc, coef) {
  if (coef === 1) return desc;
  return desc.split(" + ").map((seg) => scaleSegment(seg, coef)).join(" + ");
}

const RAW_RECIPES = {
  "Petit-déjeuner": [
    ["Porridge banane amandes", "60 g flocons d'avoine crus + 250 ml lait demi-écrémé + 1 banane (120 g) + 10 g miel + 15 g amandes", 576, 23, 16, 90],
    ["Omelette épinards fromage", "3 œufs (150 g) + 40 g fromage râpé + 50 g épinards frais (30 g cuits) + 1 tranche pain complet (40 g)", 481, 34, 29, 20],
    ["Skyr fruits rouges", "200 g skyr nature + 30 g granola + 100 g fruits rouges + 10 g graines de chia", 371, 28, 10, 40],
    ["Pancakes protéinés", "60 g flocons d'avoine mixés + 2 œufs + 1 banane + 20 g whey, cuits à la poêle", 571, 40, 17, 70],
    ["Pain complet œufs brouillés", "2 tranches pain complet (80 g) + 3 œufs brouillés (150 g crus) + 1/2 avocat (75 g)", 544, 28, 30, 41],
    ["Bowl fromage blanc pomme", "250 g fromage blanc 20% MG + 40 g muesli + 1 pomme (150 g) + cannelle", 483, 24, 16, 57],
    ["Toast avocat œuf poché", "2 tranches pain complet (80 g) + 1 avocat (150 g) + 1 œuf poché (50 g)", 510, 17, 30, 47],
    ["Smoothie bowl fruits rouges", "150 g fruits rouges surgelés + 200 g skyr + 30 g flocons d'avoine + 15 g beurre de cacahuète", 408, 32, 11, 47],
    ["Crêpes avoine banane", "80 g flocons d'avoine + 2 œufs + 1 banane écrasée, cuites en 4 petites crêpes", 573, 28, 17, 82],
    ["Wrap petit-déjeuner", "1 tortilla complète (60 g) + 2 œufs brouillés + 30 g fromage + 40 g jambon blanc", 471, 32, 24, 31],
    ["Yaourt grec fruits secs", "250 g yaourt grec + 20 g noix + 20 g raisins secs + 10 g miel", 402, 27, 23, 24],
    ["Tartines fromage frais saumon", "2 tranches pain complet (80 g) + 60 g fromage frais + 50 g saumon fumé", 475, 35, 21, 33],
    ["Porridge choco-banane", "60 g flocons d'avoine + 250 ml lait + 10 g cacao non sucré + 1 banane", 478, 22, 10, 80],
    ["Omelette champignons jambon", "3 œufs + 80 g champignons frais (60 g cuits) + 40 g jambon blanc", 295, 28, 18, 5],
    ["Bowl quinoa matinal", "60 g quinoa cru (150 g cuit) + 1 œuf poché + 50 g avocat + 80 g tomates cerises", 398, 17, 17, 47],
    ["Muffins avoine banane (x2)", "100 g flocons d'avoine + 1 banane + 2 œufs + 10 g miel, cuits au four", 681, 31, 18, 103],
    ["Fromage blanc compote", "250 g fromage blanc + 100 g compote sans sucre ajouté + 20 g noisettes", 400, 24, 20, 26],
    ["Pain perdu protéiné", "2 tranches pain complet (80 g) + 1 œuf + 100 ml lait, poêlées + 10 g miel", 346, 17, 10, 46],
    ["Bowl cottage cheese", "200 g cottage cheese + 100 g fruits rouges + 20 g graines de lin", 366, 27, 19, 21],
    ["Sandwich petit-déjeuner", "60 g pain complet + 2 œufs + 30 g fromage + 40 g dinde", 448, 36, 22, 26],
  ],
  "Collation matin": [
    ["Pomme et amandes", "1 pomme (150 g) + 20 g amandes", 198, 4, 11, 24],
    ["Skyr miel", "150 g skyr nature + 10 g miel", 125, 17, 0, 14],
    ["Fromage blanc fruits rouges", "150 g fromage blanc 0% + 100 g fruits rouges", 185, 13, 6, 17],
    ["Banane beurre de cacahuète", "1 banane (120 g) + 15 g beurre de cacahuète", 197, 4, 8, 31],
    ["Noix de cajou clémentine", "20 g noix de cajou + 1 clémentine (80 g)", 158, 5, 11, 13],
    ["Barre maison avoine miel", "1 barre maison (40 g) : flocons d'avoine, miel, amandes", 156, 7, 3, 26],
    ["Yaourt grec cacao", "150 g yaourt grec + 5 g cacao non sucré", 157, 14, 8, 6],
    ["Comté concombre", "30 g fromage type comté + rondelles de concombre", 106, 8, 8, 0],
    ["Œuf dur tomates cerises", "1 œuf dur (50 g) + 80 g tomates cerises", 98, 8, 6, 4],
    ["Smoothie fruits rouges", "150 ml lait + 100 g fruits rouges + 10 g flocons d'avoine", 158, 8, 4, 25],
    ["Amandes kiwi", "20 g amandes + 1 kiwi (70 g)", 153, 5, 11, 12],
    ["Cottage cheese myrtilles", "100 g cottage cheese + 50 g myrtilles", 123, 12, 4, 9],
    ["Galettes de riz purée d'amande", "2 galettes de riz soufflé + 20 g purée d'amande", 400, 12, 16, 52],
    ["Pomme et noix", "1 pomme (150 g) + 10 g noix", 138, 2, 6, 23],
    ["Skyr cannelle", "150 g skyr nature + cannelle", 94, 16, 0, 6],
    ["Tartine fromage frais", "1 tranche pain complet (40 g) + 20 g fromage frais", 166, 9, 7, 17],
    ["Graines et fruit", "30 g graines mélangées (tournesol, courge) + 1 fruit de saison", 180, 6, 16, 5],
    ["Raisin et noisettes", "100 g raisin frais + 15 g noisettes", 137, 4, 8, 14],
    ["Fromage blanc 20%", "150 g fromage blanc 20% MG", 135, 12, 6, 6],
    ["Œuf dur jambon", "1 œuf dur + 20 g jambon blanc", 99, 10, 6, 1],
  ],
  "Déjeuner": [
    ["Poulet riz légumes", "150 g blanc de poulet cru + 150 g riz basmati cru (≈400 g cuit) + 200 g légumes vapeur + 1 c. à s. huile d'olive", 879, 46, 19, 125],
    ["Saumon quinoa brocolis", "150 g pavé de saumon + 80 g quinoa cru (≈200 g cuit) + 200 g brocolis", 674, 47, 25, 65],
    ["Steak patate douce", "150 g steak haché 5% + 250 g patate douce cuite + salade verte et vinaigrette", 432, 37, 8, 53],
    ["Dinde pâtes complètes", "150 g filet de dinde + 90 g pâtes complètes crues (≈220 g cuites) + 150 g tomates et courgettes", 518, 49, 3, 69],
    ["Cabillaud riz complet", "150 g cabillaud + 80 g riz complet cru + 200 g haricots verts", 465, 36, 2, 76],
    ["Poulet boulgour poivrons", "150 g escalope de poulet + 80 g boulgour cru + 150 g poivrons", 491, 45, 5, 67],
    ["Bœuf sauté nouilles de riz", "140 g bœuf sauté + 90 g nouilles de riz + 200 g légumes wok", 557, 43, 9, 71],
    ["Chili con carne", "120 g bœuf haché + 150 g haricots rouges cuits + 70 g riz cru", 600, 44, 7, 88],
    ["Curry de poulet léger", "150 g poulet + 100 ml lait de coco léger + 70 g riz basmati cru + 150 g légumes", 562, 41, 13, 64],
    ["Thon grillé semoule", "150 g thon grillé + 80 g semoule complète crue + 150 g légumes grillés", 500, 50, 3, 64],
    ["Omelette thon salade", "3 œufs + 100 g thon + 100 g salade + 1 tranche pain complet (40 g)", 470, 50, 19, 22],
    ["Wok crevettes soba", "150 g crevettes + 80 g nouilles soba crues + 200 g légumes variés", 478, 44, 4, 65],
    ["Poulet rôti pommes de terre", "150 g poulet rôti + 250 g pommes de terre vapeur + 150 g haricots verts", 444, 41, 4, 60],
    ["Steak de bœuf riz", "150 g steak de bœuf + 70 g riz cru + salade de tomates", 452, 36, 8, 55],
    ["Poulet four purée patate douce", "150 g filet de poulet au four + 250 g purée de patate douce + 150 g brocolis", 456, 42, 5, 63],
    ["Dinde poêlée quinoa", "150 g dinde en poêlée de légumes + 80 g quinoa cru", 332, 13, 5, 57],
    ["Saumon papillote riz sauvage", "150 g saumon en papillote + 70 g riz sauvage cru + 150 g asperges", 594, 37, 20, 61],
    ["Chili sin carne", "150 g lentilles cuites + 70 g riz cru + épices", 419, 18, 1, 85],
    ["Bœuf bourguignon allégé", "150 g viande de bœuf + 200 g pommes de terre + carottes", 381, 36, 8, 40],
    ["Cabillaud plancha ratatouille", "150 g cabillaud + 80 g boulgour cru + 200 g ratatouille maison", 447, 40, 2, 69],
  ],
  "Collation après-midi": [
    ["Shaker whey banane", "30 g whey + eau ou lait + 1 banane (120 g)", 223, 24, 2, 30],
    ["Skyr granola", "150 g skyr + 20 g granola", 184, 18, 3, 19],
    ["Pomme beurre d'amande", "1 pomme (150 g) + 20 g beurre d'amande", 198, 5, 10, 25],
    ["Fromage et noix", "30 g fromage + 15 g noix", 195, 10, 16, 3],
    ["Fromage blanc miel", "100 g fromage blanc + 1 c. à c. de miel", 105, 8, 4, 8],
    ["Barre protéinée maison", "1 barre maison (avoine, whey, miel, 40 g)", 194, 8, 4, 33],
    ["Deux œufs durs", "2 œufs durs (100 g)", 155, 13, 11, 1],
    ["Yaourt grec fruits rouges", "150 g yaourt grec + 80 g fruits rouges", 186, 14, 8, 15],
    ["Smoothie protéiné", "25 g whey + 200 ml lait + 100 g fruits", 187, 25, 5, 12],
    ["Amandes orange", "20 g amandes + 1 orange (150 g)", 190, 5, 11, 21],
    ["Toast fromage frais", "30 g pain complet + 20 g fromage frais", 142, 8, 6, 12],
    ["Cottage cheese concombre", "100 g cottage cheese + rondelles de concombre", 99, 11, 4, 4],
    ["Banane noix de cajou", "1 banane (120 g) + 15 g noix de cajou", 197, 4, 8, 30],
    ["Fromage blanc cannelle", "150 g fromage blanc 0% + cannelle", 135, 12, 6, 6],
    ["Chips de pois chiches maison", "30 g pois chiches rôtis au four avec épices", 49, 3, 1, 8],
    ["Œuf dur tomates", "1 œuf dur + 80 g tomates cerises", 98, 8, 6, 4],
    ["Wrap jambon fromage léger", "1 galette (40 g) + 30 g jambon + 20 g fromage", 214, 14, 9, 20],
    ["Compote et noix", "100 g compote sans sucre ajouté + 15 g noix", 145, 3, 8, 15],
    ["Skyr kiwi", "150 g skyr + 1 kiwi (70 g)", 127, 17, 0, 14],
    ["Shaker whey nature", "30 g whey + eau", 114, 22, 2, 2],
  ],
  "Dîner": [
    ["Poulet grillé légumes verts", "150 g blanc de poulet + 250 g légumes verts vapeur + filet d'huile d'olive", 287, 37, 9, 10],
    ["Poisson vapeur courgettes", "150 g poisson blanc vapeur + 200 g courgettes et poivrons sautés", 173, 30, 1, 8],
    ["Omelette légumes salade", "3 œufs + légumes (poivrons, oignons, 100 g) + 100 g salade verte", 259, 21, 17, 6],
    ["Dinde haricots avocat", "150 g filet de dinde grillé + 200 g haricots verts + 1/2 avocat (75 g)", 347, 41, 13, 21],
    ["Soupe et poulet effiloché", "1 bol de soupe de légumes maison + 100 g poulet effiloché", 132, 23, 3, 2],
    ["Salade composée poulet", "120 g poulet + 200 g crudités variées + 1 c. à s. huile d'olive", 268, 26, 17, 0],
    ["Cabillaud papillote brocolis", "150 g cabillaud en papillote + 200 g brocolis vapeur", 191, 33, 2, 14],
    ["Tofu grillé légumes", "150 g tofu grillé + 200 g légumes sautés (option végétarienne)", 164, 15, 8, 11],
    ["Crevettes courgettes spaghetti", "150 g crevettes poêlées + 200 g courgettes en spaghetti", 198, 34, 3, 9],
    ["Steak haché salade", "130 g steak haché 5% + salade verte + tomates", 181, 27, 7, 0],
    ["Saumon vapeur asperges", "130 g saumon vapeur + 200 g asperges", 320, 29, 17, 8],
    ["Poulet ratatouille", "150 g blanc de poulet + 250 g ratatouille maison", 242, 37, 4, 10],
    ["Omelette blancs épinards", "4 blancs d'œufs + 1 jaune + 150 g épinards", 348, 28, 22, 8],
    ["Merlan poêlée de légumes", "150 g filet de merlan + 200 g poêlée de légumes", 173, 30, 1, 8],
    ["Salade de thon", "150 g thon + 200 g crudités + 1 c. à c. huile d'olive", 218, 38, 6, 0],
    ["Dinde fenouil braisé", "150 g escalope de dinde + 200 g fenouil braisé", 215, 39, 2, 8],
    ["Poisson grillé courgettes", "150 g poisson blanc grillé + 200 g courgettes vapeur", 173, 30, 1, 8],
    ["Velouté et poulet", "1 bol de velouté de légumes maison + 100 g poulet", 132, 23, 3, 2],
    ["Poulet émincé champignons", "150 g blancs de poulet émincé + 200 g poêlée de champignons", 230, 36, 4, 8],
    ["Omelette fromage léger", "2 œufs + 30 g fromage léger + 150 g salade verte", 298, 23, 20, 7],
  ],
};

const RECIPES = Object.entries(RAW_RECIPES).flatMap(([moment, list]) =>
  list.map(([nom, desc, kcal, prot, lip, gluc], i) => ({
    id: `${moment}-${i}`, moment, nom, desc,
    macros: { kcal, prot, lip, gluc, approx: true },
  }))
);

const BASE_SESSION_TYPES = ["Repos", "Cardio - Footing", "Cardio - Padel/Squash", "Cardio - Corde à sauter"];
const PROTECTED_SESSIONS = ["Musculation A", "Musculation B"];

const SESSION_COLOR = {
  "Repos": "#94A3B8",
  "Musculation A": "#F97316",
  "Musculation B": "#EA580C",
  "Cardio - Footing": "#0EA5E9",
  "Cardio - Padel/Squash": "#06B6D4",
  "Cardio - Corde à sauter": "#3B82F6",
  "Musculation Thyb": "#DB2777",
  "Calisthénie 1 - Poussée": "#2563EB",
  "Calisthénie 2 - Tirage": "#7C3AED",
  "Calisthénie 3 - Jambes": "#059669",
  "Calisthénie 4 - Explosif": "#DC2626",
  "Calisthénie 5 - Gainage et mobilité": "#D97706",
  "Abdos A": "#0D9488",
  "Abdos B": "#0891B2",
  "Abdos C": "#4F46E5",
  "Abdos fin de séance 1": "#65A30D",
  "Abdos fin de séance 2": "#84812B",
  "Personnalisé": "#6B7280",
};
const CUSTOM_COLORS = ["#6E7F5C", "#8C6E54", "#5C6E7F", "#7F5C6E", "#7F6E3F"];
function getSessionColor(type) {
  if (SESSION_COLOR[type]) return SESSION_COLOR[type];
  let hash = 0;
  for (const c of type) hash += c.charCodeAt(0);
  return CUSTOM_COLORS[hash % CUSTOM_COLORS.length];
}

function getMusicSuggestion(type) {
  if (/Repos/i.test(type)) return "Pas de musique nécessaire, ou une ambiance calme si vous bougez légèrement.";
  if (/Corde/i.test(type)) return "Tempo rapide et percutant : electro, drum & bass, hip-hop énergique.";
  if (/Footing/i.test(type)) return "Rythme tranquille (100-130 BPM) : indie folk, lo-fi, pop douce.";
  if (/Cardio/i.test(type)) return "Énergique et rythmé : pop-rock, dance, hip-hop dynamique.";
  if (/Musculation|Calisthénie|Abdos/i.test(type)) return "Motivation intense : rock puissant, bandes-son de films de sport, hip-hop énergique — pour la dernière répétition.";
  return "Choisissez une ambiance qui vous met en mouvement.";
}

function defaultSessionLibrary() {
  return {
    "Musculation A": [
      { id: 1, nom: "Squat barre", series: 4, reps: "8-10", rest: 90 },
      { id: 2, nom: "Développé couché", series: 4, reps: "8-10", rest: 90 },
      { id: 3, nom: "Rowing barre", series: 4, reps: "10", rest: 90 },
      { id: 4, nom: "Développé militaire haltères", series: 3, reps: "10-12", rest: 75 },
      { id: 5, nom: "Fentes marchées", series: 3, reps: "12/jambe", rest: 60 },
      { id: 6, nom: "Gainage planche", series: 3, reps: "45 sec", rest: 45 },
    ],
    "Musculation B": [
      { id: 1, nom: "Soulevé de terre", series: 4, reps: "6-8", rest: 120 },
      { id: 2, nom: "Tractions ou tirage vertical", series: 4, reps: "8-10", rest: 90 },
      { id: 3, nom: "Développé incliné haltères", series: 4, reps: "10", rest: 90 },
      { id: 4, nom: "Presse à cuisses", series: 3, reps: "12", rest: 75 },
      { id: 5, nom: "Élévations latérales", series: 3, reps: "15", rest: 60 },
      { id: 6, nom: "Gainage latéral", series: 3, reps: "30 sec/côté", rest: 45 },
    ],
    "Musculation Thyb": [],
    "Calisthénie 1 - Poussée": [
      { id: 1, nom: "Pompes", series: 4, reps: "12-15", rest: 60 },
      { id: 2, nom: "Dips sur chaise", series: 3, reps: "12", rest: 60 },
      { id: 3, nom: "Pike push-up (épaules)", series: 3, reps: "10", rest: 60 },
      { id: 4, nom: "Extensions triceps au sol", series: 3, reps: "12", rest: 45 },
      { id: 5, nom: "Gainage planche", series: 3, reps: "40 sec", rest: 45 },
    ],
    "Calisthénie 2 - Tirage": [
      { id: 1, nom: "Tractions (ou rowing australien)", series: 4, reps: "6-10", rest: 90 },
      { id: 2, nom: "Tractions supination", series: 3, reps: "6-8", rest: 90 },
      { id: 3, nom: "Rowing serviette porte", series: 3, reps: "12", rest: 60 },
      { id: 4, nom: "Superman", series: 3, reps: "15", rest: 45 },
      { id: 5, nom: "Gainage dos (superman tenu)", series: 3, reps: "30 sec", rest: 45 },
    ],
    "Calisthénie 3 - Jambes": [
      { id: 1, nom: "Squats sautés", series: 4, reps: "15", rest: 60 },
      { id: 2, nom: "Fentes bulgares", series: 3, reps: "12/jambe", rest: 60 },
      { id: 3, nom: "Chaise contre le mur", series: 3, reps: "40 sec", rest: 60 },
      { id: 4, nom: "Mollets debout", series: 3, reps: "20", rest: 45 },
      { id: 5, nom: "Gainage planche", series: 3, reps: "45 sec", rest: 45 },
    ],
    "Calisthénie 4 - Explosif": [
      { id: 1, nom: "Burpees", series: 4, reps: "12", rest: 60 },
      { id: 2, nom: "Mountain climbers", series: 4, reps: "30 sec", rest: 45 },
      { id: 3, nom: "Squats sautés", series: 3, reps: "15", rest: 60 },
      { id: 4, nom: "Pompes claquées", series: 3, reps: "8-10", rest: 60 },
      { id: 5, nom: "Gainage dynamique", series: 3, reps: "30 sec", rest: 45 },
    ],
    "Calisthénie 5 - Gainage et mobilité": [
      { id: 1, nom: "Planche", series: 3, reps: "45-60 sec", rest: 45 },
      { id: 2, nom: "Planche latérale", series: 3, reps: "30 sec/côté", rest: 45 },
      { id: 3, nom: "Superman", series: 3, reps: "15", rest: 45 },
      { id: 4, nom: "Pont fessier", series: 3, reps: "15", rest: 45 },
      { id: 5, nom: "Étirements dynamiques", series: 1, reps: "5 min", rest: 0 },
    ],
    "Abdos A": [
      { id: 1, nom: "Crunchs", series: 4, reps: "20", rest: 45 },
      { id: 2, nom: "Relevé de jambes", series: 4, reps: "15", rest: 45 },
      { id: 3, nom: "Gainage planche", series: 3, reps: "60 sec", rest: 45 },
      { id: 4, nom: "Rotations russes (obliques)", series: 3, reps: "20", rest: 45 },
      { id: 5, nom: "Mountain climbers", series: 3, reps: "30 sec", rest: 45 },
      { id: 6, nom: "Gainage latéral", series: 3, reps: "30 sec/côté", rest: 45 },
    ],
    "Abdos B": [
      { id: 1, nom: "Crunchs inversés", series: 4, reps: "15", rest: 45 },
      { id: 2, nom: "Ciseaux (leg flutter)", series: 3, reps: "30 sec", rest: 45 },
      { id: 3, nom: "Planche dynamique (touches épaule)", series: 3, reps: "20", rest: 45 },
      { id: 4, nom: "Planche avec levée de jambe", series: 3, reps: "12/jambe", rest: 45 },
      { id: 5, nom: "Rotations debout (obliques)", series: 3, reps: "15/côté", rest: 45 },
      { id: 6, nom: "Superman", series: 3, reps: "15", rest: 45 },
    ],
    "Abdos C": [
      { id: 1, nom: "V-ups", series: 4, reps: "15", rest: 45 },
      { id: 2, nom: "Bicycle crunch", series: 4, reps: "20", rest: 45 },
      { id: 3, nom: "Planche avec rotation", series: 3, reps: "12/côté", rest: 45 },
      { id: 4, nom: "Relevé de jambes suspendu (ou au sol)", series: 3, reps: "12", rest: 60 },
      { id: 5, nom: "Mountain climbers rapides", series: 3, reps: "30 sec", rest: 45 },
      { id: 6, nom: "Gainage creux (hollow body hold)", series: 3, reps: "30 sec", rest: 45 },
    ],
    "Abdos fin de séance 1": [
      { id: 1, nom: "Crunchs", series: 3, reps: "15", rest: 30 },
      { id: 2, nom: "Gainage planche", series: 2, reps: "40 sec", rest: 30 },
      { id: 3, nom: "Rotations russes", series: 2, reps: "20", rest: 30 },
      { id: 4, nom: "Relevé de jambes", series: 2, reps: "12", rest: 30 },
    ],
    "Abdos fin de séance 2": [
      { id: 1, nom: "Gainage planche", series: 2, reps: "45 sec", rest: 30 },
      { id: 2, nom: "Bicycle crunch", series: 3, reps: "20", rest: 30 },
      { id: 3, nom: "Gainage latéral", series: 2, reps: "30 sec/côté", rest: 30 },
      { id: 4, nom: "Mountain climbers", series: 2, reps: "30 sec", rest: 30 },
    ],
  };
}

const MOTIVATION_QUOTES = [
  "Chaque répétition compte, même celle que personne ne voit.",
  "La discipline d'aujourd'hui est le résultat de demain.",
  "Un jour à la fois, un repas à la fois, une séance à la fois.",
  "Le corps s'adapte à ce qu'on lui demande, à condition de le lui demander souvent.",
  "La régularité bat l'intensité sur la durée.",
  "Le progrès ne se voit pas dans le miroir du jour, mais dans celui du mois.",
  "On ne rate pas un objectif, on abandonne l'habitude qui y menait.",
  "La motivation lance, la constance termine.",
  "Se dépasser aujourd'hui, c'est simplement faire une chose de plus qu'hier.",
  "Le repos fait partie de l'entraînement, pas une pause dans l'entraînement.",
  "Une bonne série vaut mieux que trois séries bâclées.",
  "Ce que l'on mesure, on l'améliore.",
  "La meilleure séance est celle qu'on fait vraiment.",
  "Le corps suit l'esprit qui persévère.",
  "Petit à petit, la charge devient légère.",
  "L'effort d'aujourd'hui est invisible, le résultat de demain ne le sera pas.",
  "On ne construit rien de solide dans la précipitation.",
  "Chaque kilo perdu a d'abord été une décision tenue.",
  "La forme physique se gagne dans les jours ordinaires, pas dans les jours parfaits.",
  "Rester en mouvement, même modestement, vaut mieux que l'arrêt complet.",
  "Cette série difficile est exactement celle qui compte le plus.",
  "Ne lâchez pas maintenant, la suite en dépend.",
  "Vous n'avez pas besoin d'être parfait, juste de continuer.",
  "La force se construit répétition après répétition, pas d'un coup.",
];
const PSALMS = [
  { ref: "Psaume 23:1", texte: "L'Éternel est mon berger : je ne manquerai de rien." },
  { ref: "Psaume 118:24", texte: "C'est ici la journée que l'Éternel a faite : qu'elle soit pour nous un sujet d'allégresse et de joie." },
  { ref: "Psaume 46:2", texte: "Dieu est pour nous un refuge et un appui, un secours qui ne manque jamais dans la détresse." },
  { ref: "Psaume 27:1", texte: "L'Éternel est ma lumière et mon salut : de qui aurais-je crainte ?" },
  { ref: "Psaume 121:1-2", texte: "Je lève mes yeux vers les montagnes... Le secours me vient de l'Éternel, qui a fait les cieux et la terre." },
  { ref: "Psaume 34:9", texte: "Sentez et voyez combien l'Éternel est bon ! Heureux l'homme qui cherche en lui son refuge !" },
  { ref: "Psaume 91:1-2", texte: "Celui qui demeure sous l'abri du Très-Haut repose à l'ombre du Tout-Puissant." },
  { ref: "Psaume 37:4", texte: "Fais de l'Éternel tes délices, et il te donnera ce que ton cœur désire." },
  { ref: "Psaume 103:1", texte: "Mon âme, bénis l'Éternel ! Que tout ce qui est en moi bénisse son saint nom !" },
  { ref: "Psaume 16:11", texte: "Tu me feras connaître le sentier de la vie ; il y a d'abondantes joies devant ta face." },
];

/* ============================== UTILITAIRES ============================== */

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => toISO(new Date());
const fmtDate = (iso) => { const [y, m, d] = iso.split("-"); return `${d}/${m}/${y}`; };
const defaultSessionForDate = (date) => {
  const map = { 1: "Musculation A", 2: "Cardio - Footing", 3: "Repos", 4: "Musculation B", 5: "Cardio - Padel/Squash", 6: "Cardio - Corde à sauter", 0: "Repos" };
  return map[date.getDay()];
};
function dayOfYear(d) { const start = new Date(d.getFullYear(), 0, 0); return Math.floor((d - start) / 86400000); }
function todayIndex(len) { return dayOfYear(new Date()) % len; }
function parseRestToSeconds(str) {
  const m = String(str).match(/(\d+)/g);
  if (!m) return 60;
  const n = parseInt(m[0], 10);
  return /min/i.test(str) ? n * 60 : n;
}
function fmtSecs(s) { const mm = Math.floor(s / 60), ss = s % 60; return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`; }

/* Connexion Supabase (compte + données synchronisées entre appareils).
   Remplace les identifiants ci-dessous par ceux de ton propre projet Supabase. */
const SUPABASE_URL = "https://reevzuovmsekeflwoqti.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZXZ6dW92bXNla2VmbHdvcXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0Nzg1NTYsImV4cCI6MjEwNTA1NDU1Nn0.RCXXR812nv45cO8e0cxWEUgnIWsyGiIliq5vlVJ_bew";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Un prénom est converti en une fausse adresse e-mail car Supabase Auth exige un e-mail. */
function emailFromPrenom(prenom) {
  const slug = prenom.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  return `${slug}@dayone.local`;
}


/* ============================== STYLE GLOBAL ============================== */

const GlobalStyle = () => (
  <style>{`
    :root {
      --paper: #EEF0EA; --card: #FFFFFF; --ink: #1C2321;
      --moss: #3F6C51; --moss-dark: #2F5340; --rust: #B5533C; --border: #C9CDBF; --muted: #6B7568;
      --font-display: "Avenir Next", "Century Gothic", "Segoe UI", sans-serif;
      --font-body: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --font-mono: "SF Mono", "Roboto Mono", ui-monospace, Menlo, monospace;
    }
    .fit-root { background: var(--paper); color: var(--ink); font-family: var(--font-body); min-height: 100%; }
    .fit-display { font-family: var(--font-display); letter-spacing: 0.02em; }
    .fit-mono { font-family: var(--font-mono); }
    .fit-card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; }
    .fit-tag { border-top: 2px dashed var(--border); }
    .fit-tab { transition: all .15s ease; }
    .fit-pill { transition: all .15s ease; }
    .fit-pill.active { background: var(--moss); color: white; border-color: var(--moss); }
    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }
  `}</style>
);

const TAB_COLOR = {
  info: "#3F6C51", objectifs: "#2563EB", pesee: "#0D9488",
  nutrition: "#D97706", "historique-nutrition": "#0369A1", compteur: "#059669", entrainement: "#7C3AED",
  footing: "#0891B2", historique: "#DB2777", aide: "#0EA5E9",
};
const TABS = [
  { key: "info", label: "Info", icon: Home },
  { key: "objectifs", label: "Objectifs", icon: Target },
  { key: "pesee", label: "Pesée", icon: Scale },
  { key: "nutrition", label: "Nutrition", icon: UtensilsCrossed },
  { key: "historique-nutrition", label: "Historique nutrition", icon: HistoryIcon },
  { key: "compteur", label: "Compteur", icon: Flame },
  { key: "entrainement", label: "Entraînement", icon: Dumbbell },
  { key: "footing", label: "Progression Footing", icon: Footprints },
  { key: "historique", label: "Historique sport", icon: HistoryIcon },
  { key: "aide", label: "Aide", icon: MessageCircle },
];

function SideNav({ tab, setTab, prenom, onLogout }) {
  return (
    <nav className="hidden md:flex flex-col w-56 shrink-0 p-4 gap-1 border-r" style={{ borderColor: "var(--border)" }}>
      <div className="fit-display font-bold text-lg mb-2 px-2" style={{ color: "var(--moss-dark)" }}>DAY ONE</div>
      <div className="text-xs px-2 mb-4" style={{ color: "var(--muted)" }}>{prenom}</div>
      {TABS.map((t) => (
        <button key={t.key} onClick={() => setTab(t.key)}
          className="fit-tab flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
          style={tab === t.key ? { background: TAB_COLOR[t.key], color: "white" } : { color: "var(--ink)" }}>
          <t.icon size={17} />
          {t.label}
        </button>
      ))}
      <button onClick={onLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-auto" style={{ color: "var(--rust)" }}>
        <LogOut size={17} /> Déconnexion
      </button>
    </nav>
  );
}

function MobileNav({ tab, setTab, prenom, onLogout }) {
  const [open, setOpen] = useState(false);
  const current = TABS.find((t) => t.key === tab);

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 flex items-center gap-3 px-3 py-3 border-b z-30"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}>
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="p-1.5 rounded-lg" style={{ color: "var(--ink)" }}>
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium" style={{ color: TAB_COLOR[tab] }}>
          {current && <current.icon size={17} />}
          {current ? current.label : ""}
        </div>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-72 max-w-[85%] h-full overflow-y-auto p-4 flex flex-col gap-1"
               style={{ background: "var(--card)" }}>
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="fit-display font-bold text-lg" style={{ color: "var(--moss-dark)" }}>DAY ONE</div>
              <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="p-1" style={{ color: "var(--muted)" }}>
                <X size={20} />
              </button>
            </div>
            <div className="text-xs px-2 mb-3" style={{ color: "var(--muted)" }}>{prenom}</div>
            {TABS.map((t) => (
              <button key={t.key} onClick={() => { setTab(t.key); setOpen(false); }}
                className="fit-tab flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left"
                style={tab === t.key ? { background: TAB_COLOR[t.key], color: "white" } : { color: "var(--ink)" }}>
                <t.icon size={17} />
                {t.label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); onLogout(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mt-auto" style={{ color: "var(--rust)" }}>
              <LogOut size={17} /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================== PROGRESSION (SVG) ============================== */

function TrailProgress({ current, start, target }) {
  const total = Math.abs(start - target) || 1;
  const done = Math.abs(start - current);
  const pct = Math.min(100, Math.max(0, (done / total) * 100));
  return (
    <div className="mt-3">
      <svg viewBox="0 0 300 40" className="w-full h-10">
        <line x1="10" y1="24" x2="290" y2="24" stroke="var(--border)" strokeWidth="3" strokeLinecap="round" />
        <line x1="10" y1="24" x2={10 + pct * 2.8} y2="24" stroke="var(--moss)" strokeWidth="3" strokeLinecap="round" />
        <circle cx={10 + pct * 2.8} cy="24" r="6" fill="var(--rust)" stroke="white" strokeWidth="2" />
        <g transform="translate(284,10)"><Flag size={16} color="var(--moss-dark)" /></g>
      </svg>
      <div className="flex justify-between fit-mono text-xs" style={{ color: "var(--muted)" }}>
        <span>{start} kg</span><span>{target} kg</span>
      </div>
    </div>
  );
}

/* ============================== FORMULAIRE PROFIL (onboarding + edition) ============================== */

function ProfileForm({ initial, onSubmit, submitLabel }) {
  const [sexe, setSexe] = useState(initial?.sexe || "Homme");
  const [age, setAge] = useState(initial?.age || "");
  const [taille, setTaille] = useState(initial?.taille || "");
  const [poids, setPoids] = useState(initial?.poidsDepart || "");
  const [poidsCible, setPoidsCible] = useState(initial?.poidsCible || "");
  const [niveauActivite, setNiveauActivite] = useState(initial?.niveauActivite || "Moderee");
  const [objectifs, setObjectifs] = useState(initial?.objectifs || (initial?.objectif ? [initial.objectif] : ["Perte de poids"]));

  const toggleObjectif = (o) => {
    setObjectifs((cur) => (cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o]));
  };

  const valid = age && taille && poids && poidsCible && objectifs.length > 0;

  const submit = () => {
    if (!valid) return;
    onSubmit({
      sexe, age: parseFloat(age), taille: parseFloat(taille),
      poidsDepart: parseFloat(poids), poidsCible: parseFloat(poidsCible),
      niveauActivite, objectifs,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Sexe</label>
          <select value={sexe} onChange={(e) => setSexe(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }}>
            <option value="Homme">Homme</option><option value="Femme">Femme</option>
          </select>
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Âge</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Taille (cm)</label>
          <input type="number" value={taille} onChange={(e) => setTaille(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Poids actuel (kg)</label>
          <input type="number" value={poids} onChange={(e) => setPoids(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Poids cible (kg)</label>
          <input type="number" value={poidsCible} onChange={(e) => setPoidsCible(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Niveau d'activité</label>
          <select value={niveauActivite} onChange={(e) => setNiveauActivite(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }}>
            <option value="Sedentaire">Sédentaire</option>
            <option value="Legere">Légère (1-3 seances/sem)</option>
            <option value="Moderee">Modérée (3-5 seances/sem)</option>
            <option value="Intense">Intense (6-7 seances/sem)</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-xs" style={{ color: "var(--muted)" }}>Objectifs (plusieurs choix possibles, ex : perte de poids + prise de muscle pour une recomposition corporelle)</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["Perte de poids", "Maintien", "Prise de muscle"].map((o) => (
              <button key={o} type="button" onClick={() => toggleObjectif(o)}
                className={`fit-pill text-sm px-3 py-1.5 rounded-full border ${objectifs.includes(o) ? "active" : ""}`}
                style={{ borderColor: "var(--border)" }}>
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={submit} disabled={!valid}
        className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "var(--moss)" }}>
        {submitLabel}
      </button>
    </div>
  );
}

/* ============================== ONGLET INFO ============================== */

function InfoTab({ prenom, profile, metabolism, weightLog, sessionLibrary, setTab }) {
  const current = weightLog.length ? weightLog[weightLog.length - 1].weight : profile.poidsDepart;
  const todaySession = defaultSessionForDate(new Date());
  const objectifs = profile.objectifs || [];
  const recomposition = objectifs.includes("Perte de poids") && objectifs.includes("Prise de muscle");
  const rate = recomposition ? 0.3 : objectifs.includes("Prise de muscle") ? 0.25 : 0.5;
  const weeksLeft = Math.abs(current - profile.poidsCible) / rate;
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + Math.round(weeksLeft * 7));
  const atteint = Math.abs(current - profile.poidsCible) < 0.3;

  return (
    <div className="space-y-4">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.info }}>Bonjour {prenom}</h1>
      <p style={{ color: "var(--muted)" }}>Voici où vous en êtes aujourd'hui.</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="fit-card p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Poids actuel</div>
          <div className="fit-mono text-3xl font-bold mt-1">{current} <span className="text-base font-normal">kg</span></div>
          <TrailProgress current={current} start={profile.poidsDepart} target={profile.poidsCible} />
        </div>
        <div className="fit-card p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Séance du jour</div>
          <div className="fit-display text-xl font-bold mt-1" style={{ color: getSessionColor(todaySession) }}>{todaySession}</div>
          <button onClick={() => setTab("entrainement")} className="text-sm mt-3 underline" style={{ color: "var(--moss)" }}>Voir le planning →</button>
        </div>
        <div className="fit-card p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Objectif estimé</div>
          {atteint ? (
            <div className="fit-display text-lg font-bold mt-1" style={{ color: TAB_COLOR.objectifs }}>Objectif atteint 🎉</div>
          ) : (
            <>
              <div className="fit-mono text-xl font-bold mt-1">{fmtDate(toISO(goalDate))}</div>
              <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>~{Math.ceil(weeksLeft)} semaines restantes</div>
            </>
          )}
        </div>
        <div className="fit-card p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Rythme hebdomadaire</div>
          <div className="fit-display text-xl font-bold mt-1">5 séances</div>
          <div className="text-sm mt-1" style={{ color: "var(--muted)" }}>3 cardio + 2 musculation / calisthénie</div>
        </div>
      </div>

      <div className="fit-card p-5 fit-tag">
        <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Citation du jour</div>
        <p className="fit-display text-base">{MOTIVATION_QUOTES[todayIndex(MOTIVATION_QUOTES.length)]}</p>
      </div>
      <div className="fit-card p-5 fit-tag">
        <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>Psaume du jour</div>
        <p className="text-base italic">{PSALMS[todayIndex(PSALMS.length)].texte}</p>
        <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{PSALMS[todayIndex(PSALMS.length)].ref}</p>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {[["pesee", "Ajouter une pesée"], ["nutrition", "Voir les recettes"], ["historique", "Historique sport"], ["aide", "Poser une question"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className="fit-pill text-sm px-4 py-2 rounded-full border" style={{ borderColor: "var(--border)" }}>{l}</button>
        ))}
      </div>
    </div>
  );
}

/* ============================== ONGLET OBJECTIFS ============================== */

function ObjectifsTab({ profile, setProfile, metabolism, supplements, setSupplements }) {
  const [editing, setEditing] = useState(false);
  const [newSupp, setNewSupp] = useState("");

  const addSupplement = () => {
    const name = newSupp.trim();
    if (!name) return;
    const match = matchSupplement(name);
    setSupplements([...supplements, {
      id: Date.now(), nom: name,
      dose: match ? match.dose : "À définir",
      moment: match ? match.moment : "À définir selon la notice",
    }]);
    setNewSupp("");
  };
  const updateSupp = (id, field, val) => setSupplements(supplements.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  const removeSupp = (id) => setSupplements(supplements.filter((s) => s.id !== id));

  if (editing) {
    return (
      <div className="space-y-4">
        <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.objectifs }}>Modifier mon profil</h1>
        <div className="fit-card p-5">
          <ProfileForm initial={profile} submitLabel="Enregistrer" onSubmit={(p) => { setProfile(p); setEditing(false); }} />
        </div>
        <button onClick={() => setEditing(false)} className="text-sm underline" style={{ color: "var(--muted)" }}>Annuler</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.objectifs }}>Objectifs et métabolisme</h1>
        <button onClick={() => setEditing(true)} className="text-sm px-3 py-1.5 rounded-lg border" style={{ borderColor: "var(--border)" }}>Modifier</button>
      </div>

      <div className="fit-card p-5">
        <h2 className="fit-display font-bold mb-3" style={{ color: TAB_COLOR.objectifs }}>Profil</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div><div style={{ color: "var(--muted)" }}>Sexe</div><div className="font-medium">{profile.sexe}</div></div>
          <div><div style={{ color: "var(--muted)" }}>Âge</div><div className="font-medium">{profile.age} ans</div></div>
          <div><div style={{ color: "var(--muted)" }}>Taille</div><div className="font-medium">{profile.taille} cm</div></div>
          <div><div style={{ color: "var(--muted)" }}>Poids de départ</div><div className="font-medium">{profile.poidsDepart} kg</div></div>
          <div><div style={{ color: "var(--muted)" }}>Poids cible</div><div className="font-medium">{profile.poidsCible} kg</div></div>
          <div><div style={{ color: "var(--muted)" }}>Objectifs</div><div className="font-medium">{(profile.objectifs || []).join(", ")}</div></div>
        </div>
      </div>

      <div className="fit-card p-5">
        <h2 className="fit-display font-bold mb-3" style={{ color: TAB_COLOR.objectifs }}>Métabolisme (estimation)</h2>
        <p className="text-sm mb-1">Métabolisme de base (Mifflin-St Jeor) : <b>{metabolism.bmr} kcal/jour</b></p>
        <p className="text-sm">Dépense totale estimée : <b>{metabolism.tdee} kcal/jour</b></p>
      </div>

      <div className="fit-card p-5 overflow-x-auto">
        <h2 className="fit-display font-bold mb-3" style={{ color: TAB_COLOR.objectifs }}>Apports caloriques par type de journée</h2>
        <table className="w-full text-sm min-w-[500px]">
          <thead><tr style={{ color: "var(--muted)" }} className="text-left"><th className="pb-2">Type</th><th className="pb-2">Cible</th><th className="pb-2">Prot.</th><th className="pb-2">Lip.</th><th className="pb-2">Gluc.</th></tr></thead>
          <tbody className="fit-mono">
            {metabolism.table.map((r) => (
              <tr key={r.type} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="py-2 font-body">{r.type}</td><td className="py-2 font-bold">{r.cible} kcal</td>
                <td className="py-2">{r.prot} g</td><td className="py-2">{r.lip} g</td><td className="py-2">{r.gluc} g</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fit-card p-5">
        <h2 className="fit-display font-bold mb-3" style={{ color: TAB_COLOR.objectifs }}>Mes compléments</h2>
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>Indiquez les compléments que vous prenez : le dosage et le moment de prise sont suggérés automatiquement (modifiables librement).</p>
        <div className="flex gap-2 mb-3">
          <input value={newSupp} onChange={(e) => setNewSupp(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSupplement(); }}
            placeholder="Ex : Créatine, Vitamine D, Zinc..." className="flex-1 border rounded-lg px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
          <button onClick={addSupplement} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.objectifs }}><Plus size={15} /> Ajouter</button>
        </div>
        <div className="space-y-2">
          {supplements.map((s) => (
            <div key={s.id} className="flex flex-wrap gap-2 items-center border-t pt-2" style={{ borderColor: "var(--border)" }}>
              <input value={s.nom} onChange={(e) => updateSupp(s.id, "nom", e.target.value)} className="border rounded-lg px-2 py-1.5 text-sm font-medium flex-1 min-w-[120px]" style={{ borderColor: "var(--border)" }} />
              <input value={s.dose} onChange={(e) => updateSupp(s.id, "dose", e.target.value)} className="border rounded-lg px-2 py-1.5 text-sm fit-mono w-40" style={{ borderColor: "var(--border)" }} />
              <input value={s.moment} onChange={(e) => updateSupp(s.id, "moment", e.target.value)} className="border rounded-lg px-2 py-1.5 text-sm flex-1 min-w-[160px]" style={{ borderColor: "var(--border)", color: "var(--muted)" }} />
              <button onClick={() => removeSupp(s.id)} style={{ color: "var(--rust)" }}><Trash2 size={15} /></button>
            </div>
          ))}
          {supplements.length === 0 && <p className="text-sm text-center py-3" style={{ color: "var(--muted)" }}>Aucun complément ajouté.</p>}
        </div>
      </div>
    </div>
  );
}

/* ============================== ONGLET PESEE ============================== */

function PeseeTab({ weightLog, setWeightLog, profile }) {
  const [date, setDate] = useState(todayISO());
  const [weight, setWeight] = useState("");

  const addEntry = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;
    const next = [...weightLog.filter((e) => e.date !== date), { date, weight: w }].sort((a, b) => a.date.localeCompare(b.date));
    setWeightLog(next); setWeight("");
  };
  const removeEntry = (d) => setWeightLog(weightLog.filter((e) => e.date !== d));
  const chartData = weightLog.map((e) => ({ ...e, label: fmtDate(e.date) }));

  return (
    <div className="space-y-5">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.pesee }}>Pesée hebdomadaire</h1>
      <div className="fit-card p-5 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="block border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Poids (kg)</label>
          <input type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="86.5" className="block border rounded-lg px-3 py-2 mt-1 text-sm w-28" style={{ borderColor: "var(--border)" }} />
        </div>
        <button onClick={addEntry} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.pesee }}><Plus size={16} /> Ajouter</button>
      </div>

      {chartData.length > 1 && (
        <div className="fit-card p-5" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis domain={["dataMin - 2", "dataMax + 2"]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={profile.poidsCible} stroke="var(--rust)" strokeDasharray="5 5" label={{ value: "Objectif", fontSize: 11, fill: "var(--rust)" }} />
              <Line type="monotone" dataKey="weight" stroke={TAB_COLOR.pesee} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="fit-card divide-y" style={{ borderColor: "var(--border)" }}>
        {[...weightLog].reverse().map((e) => (
          <div key={e.date} className="flex justify-between items-center px-4 py-3 text-sm">
            <span style={{ color: "var(--muted)" }}>{fmtDate(e.date)}</span>
            <span className="fit-mono font-bold">{e.weight} kg</span>
            <button onClick={() => removeEntry(e.date)} style={{ color: "var(--rust)" }}><Trash2 size={15} /></button>
          </div>
        ))}
        {weightLog.length === 0 && <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--muted)" }}>Aucune pesée enregistrée pour le moment.</div>}
      </div>
    </div>
  );
}

/* ============================== ONGLET NUTRITION ============================== */

function RecipeBuilder({ onSave, onCancel }) {
  const [titre, setTitre] = useState("");
  const [moment, setMoment] = useState(MOMENTS[0]);
  const [ingredients, setIngredients] = useState([{ id: 1, qte: "", unite: "g", nom: "" }]);
  const [kcal, setKcal] = useState("");
  const [prot, setProt] = useState("");
  const [lip, setLip] = useState("");
  const [gluc, setGluc] = useState("");

  const addRow = () => setIngredients([...ingredients, { id: Date.now(), qte: "", unite: "g", nom: "" }]);
  const removeRow = (id) => setIngredients(ingredients.filter((i) => i.id !== id));
  const updateRow = (id, field, val) => setIngredients(ingredients.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  const save = () => {
    if (!titre.trim()) return;
    const validIngredients = ingredients.filter((i) => i.nom.trim());
    if (validIngredients.length === 0) return;
    const desc = validIngredients.map((i) => `${i.qte || "?"} ${i.unite === "piece" ? "pièce(s)" : i.unite} ${i.nom}`).join(" + ");
    const macros = (kcal || prot || lip || gluc)
      ? { kcal: parseFloat(kcal) || 0, prot: parseFloat(prot) || 0, lip: parseFloat(lip) || 0, gluc: parseFloat(gluc) || 0, approx: false }
      : null;
    onSave({ id: `custom-${Date.now()}`, moment, nom: titre.trim(), desc, custom: true, macros });
    setTitre(""); setIngredients([{ id: 1, qte: "", unite: "g", nom: "" }]);
    setKcal(""); setProt(""); setLip(""); setGluc("");
  };

  return (
    <div className="fit-card p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">Nouvelle recette</h3>
        <button onClick={onCancel}><X size={16} /></button>
      </div>
      <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>Titre</label>
        <input value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Nom de la recette" className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
      </div>
      <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>Moment de la journée</label>
        <select value={moment} onChange={(e) => setMoment(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }}>
          {MOMENTS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>Ingrédients (quantité en grammes ou millilitres, ou en pièces)</label>
        <div className="space-y-2 mt-1">
          {ingredients.map((i) => (
            <div key={i.id} className="flex gap-2 items-center">
              <input type="number" value={i.qte} onChange={(e) => updateRow(i.id, "qte", e.target.value)} placeholder="150" className="border rounded-lg px-2 py-1.5 text-sm w-20" style={{ borderColor: "var(--border)" }} />
              <select value={i.unite} onChange={(e) => updateRow(i.id, "unite", e.target.value)} className="border rounded-lg px-1 py-1.5 text-sm" style={{ borderColor: "var(--border)" }}>
                <option value="g">g</option><option value="ml">ml</option><option value="piece">pièce</option>
              </select>
              <input value={i.nom} onChange={(e) => updateRow(i.id, "nom", e.target.value)} placeholder="Ingrédient" className="border rounded-lg px-2 py-1.5 text-sm flex-1" style={{ borderColor: "var(--border)" }} />
              <button onClick={() => removeRow(i.id)} style={{ color: "var(--rust)" }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="flex items-center gap-1 text-sm mt-2" style={{ color: TAB_COLOR.nutrition }}><Plus size={15} /> Ajouter un ingrédient</button>
      </div>

      <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>Valeurs nutritionnelles (pour la portion entière, à renseigner vous-même)</label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          <div>
            <input type="number" value={kcal} onChange={(e) => setKcal(e.target.value)} placeholder="kcal" className="w-full border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "var(--border)" }} />
            <div className="text-[10px] text-center mt-0.5" style={{ color: "var(--muted)" }}>kcal</div>
          </div>
          <div>
            <input type="number" value={prot} onChange={(e) => setProt(e.target.value)} placeholder="0" className="w-full border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "var(--border)" }} />
            <div className="text-[10px] text-center mt-0.5" style={{ color: "var(--muted)" }}>protéines (g)</div>
          </div>
          <div>
            <input type="number" value={lip} onChange={(e) => setLip(e.target.value)} placeholder="0" className="w-full border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "var(--border)" }} />
            <div className="text-[10px] text-center mt-0.5" style={{ color: "var(--muted)" }}>lipides (g)</div>
          </div>
          <div>
            <input type="number" value={gluc} onChange={(e) => setGluc(e.target.value)} placeholder="0" className="w-full border rounded-lg px-2 py-1.5 text-sm" style={{ borderColor: "var(--border)" }} />
            <div className="text-[10px] text-center mt-0.5" style={{ color: "var(--muted)" }}>glucides (g)</div>
          </div>
        </div>
      </div>

      <button onClick={save} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.nutrition }}>Enregistrer la recette</button>
    </div>
  );
}

function NutritionTab({ favorites, setFavorites, notes, setNotes, customRecipes, setCustomRecipes, coefficients, setCoefficients, metabolism }) {
  const [moment, setMoment] = useState(MOMENTS[0]);
  const [onlyFav, setOnlyFav] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  const allRecipes = useMemo(() => [...RECIPES, ...customRecipes], [customRecipes]);
  const list = useMemo(() => {
    let l = allRecipes.filter((r) => r.moment === moment);
    if (onlyFav) l = l.filter((r) => favorites[r.id]);
    return l;
  }, [allRecipes, moment, onlyFav, favorites]);

  const toggleFav = (id) => setFavorites({ ...favorites, [id]: !favorites[id] });
  const updateNote = (id, val) => setNotes({ ...notes, [id]: val });
  const addRecipe = (r) => { setCustomRecipes([...customRecipes, r]); setShowBuilder(false); };
  const removeRecipe = (id) => setCustomRecipes(customRecipes.filter((r) => r.id !== id));
  const setCoef = (id, val) => setCoefficients({ ...coefficients, [id]: val });
  const resetCoef = (id) => { const next = { ...coefficients }; delete next[id]; setCoefficients(next); };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.nutrition }}>Nutrition</h1>
        <button onClick={() => setShowBuilder(!showBuilder)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.nutrition }}>
          <Plus size={15} /> Créer une recette
        </button>
      </div>

      {showBuilder && <RecipeBuilder onSave={addRecipe} onCancel={() => setShowBuilder(false)} />}

      <div className="flex flex-wrap gap-2">
        {MOMENTS.map((m) => (
          <button key={m} onClick={() => setMoment(m)} className={`fit-pill text-sm px-3 py-1.5 rounded-full border ${moment === m ? "active" : ""}`} style={{ borderColor: "var(--border)" }}>{m}</button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyFav} onChange={(e) => setOnlyFav(e.target.checked)} /> Afficher uniquement mes favoris
      </label>
      <p className="text-xs" style={{ color: "var(--muted)" }}>Le coefficient de portion (1 = quantités telles qu'enregistrées) est pré-réglé selon votre métabolisme et reste modifiable sur chaque recette.</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {list.map((r) => {
          const coef = getCoefficient(r.id, coefficients, r, metabolism);
          const isOverride = coefficients[r.id] != null;
          const scaledDesc = scaleDesc(r.desc, coef);
          const scaledMacros = scaleMacros(r.macros, coef);
          return (
            <div key={r.id} className="fit-card p-4">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-sm">{r.nom}{r.custom && <span className="ml-2 text-[10px] font-normal px-1.5 py-0.5 rounded-full" style={{ background: "var(--paper)", color: "var(--muted)" }}>perso</span>}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleFav(r.id)}>
                    <Heart size={17} fill={favorites[r.id] ? "var(--rust)" : "none"} color={favorites[r.id] ? "var(--rust)" : "var(--muted)"} />
                  </button>
                  {r.custom && <button onClick={() => removeRecipe(r.id)} style={{ color: "var(--rust)" }}><Trash2 size={15} /></button>}
                </div>
              </div>
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{scaledDesc}</p>
              {scaledMacros && (
                <div className="fit-mono text-xs mt-1.5 font-medium" style={{ color: TAB_COLOR.nutrition }}>
                  {scaledMacros.kcal} kcal · {scaledMacros.prot} g P · {scaledMacros.lip} g L · {scaledMacros.gluc} g G
                  {scaledMacros.approx && <span style={{ color: "var(--muted)" }}> (estimation partielle)</span>}
                </div>
              )}
              <div className="flex items-center gap-2 mt-2">
                <label className="text-xs" style={{ color: "var(--muted)" }}>Portion</label>
                <input type="number" step="0.25" min="0.25" value={coef} onChange={(e) => setCoef(r.id, parseFloat(e.target.value) || 1)}
                  className="w-16 border rounded-lg px-2 py-1 text-xs fit-mono" style={{ borderColor: "var(--border)" }} />
                <span className="text-xs" style={{ color: "var(--muted)" }}>x</span>
                {isOverride && <button onClick={() => resetCoef(r.id)} className="text-xs underline" style={{ color: TAB_COLOR.nutrition }}>réinitialiser</button>}
              </div>
              <textarea placeholder="Ajouter une annotation..." value={notes[r.id] || ""} onChange={(e) => updateNote(r.id, e.target.value)} rows={2}
                className="w-full mt-2 text-xs border rounded-lg px-2 py-1.5" style={{ borderColor: "var(--border)" }} />
            </div>
          );
        })}
        {list.length === 0 && <div className="text-sm py-6 text-center col-span-2" style={{ color: "var(--muted)" }}>Aucune recette dans ce filtre.</div>}
      </div>
    </div>
  );
}

/* ============================== ONGLET COMPTEUR JOURNALIER ============================== */

function sessionBucket(type) {
  if (!type || /Repos/i.test(type)) return "Repos (aucun sport)";
  if (/Cardio/i.test(type)) return "Jour cardio";
  return "Jour musculation";
}

function DailyCounterTab({ profile, metabolism, planning, allRecipes, dailyLog, setDailyLog, coefficients }) {
  const [dateObj, setDateObj] = useState(new Date());
  const iso = toISO(dateObj);
  const [picks, setPicks] = useState({});
  const [coefPicks, setCoefPicks] = useState({});

  const dayType = planning[iso]?.type || defaultSessionForDate(dateObj);
  const bucket = sessionBucket(dayType);
  const target = metabolism.table.find((r) => r.type === bucket) || metabolism.table[0];

  const entries = dailyLog.filter((e) => e.date === iso);
  const chiffrees = entries.filter((e) => e.macros);
  const nonChiffrees = entries.filter((e) => !e.macros);
  const consumed = chiffrees.reduce((acc, e) => ({
    kcal: acc.kcal + e.macros.kcal, prot: acc.prot + e.macros.prot, lip: acc.lip + e.macros.lip, gluc: acc.gluc + e.macros.gluc,
  }), { kcal: 0, prot: 0, lip: 0, gluc: 0 });
  const remaining = {
    kcal: target.cible - consumed.kcal, prot: target.prot - consumed.prot,
    lip: target.lip - consumed.lip, gluc: target.gluc - consumed.gluc,
  };

  const pickRecipe = (moment, recipeId) => {
    setPicks({ ...picks, [moment]: recipeId });
    const recipe = allRecipes.find((r) => r.id === recipeId);
    setCoefPicks({ ...coefPicks, [moment]: recipe ? getCoefficient(recipe.id, coefficients, recipe, metabolism) : 1 });
  };
  const addEntry = (moment) => {
    const recipeId = picks[moment];
    if (!recipeId) return;
    const recipe = allRecipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    const coef = coefPicks[moment] || 1;
    setDailyLog([...dailyLog, { id: `log-${Date.now()}`, date: iso, moment, recipeId: recipe.id, nom: `${recipe.nom} (x${coef})`, macros: scaleMacros(recipe.macros, coef) }]);
    setPicks({ ...picks, [moment]: "" });
  };
  const removeEntry = (id) => setDailyLog(dailyLog.filter((e) => e.id !== id));

  const changeDay = (delta) => { const d = new Date(dateObj); d.setDate(d.getDate() + delta); setDateObj(d); };

  return (
    <div className="space-y-4">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.compteur }}>Compteur journalier</h1>

      <div className="fit-card p-4 flex items-center justify-between">
        <button onClick={() => changeDay(-1)}><ChevronLeft size={18} /></button>
        <span className="fit-mono font-bold text-sm">{fmtDate(iso)} {iso === todayISO() && "(aujourd'hui)"}</span>
        <button onClick={() => changeDay(1)}><ChevronRight size={18} /></button>
      </div>

      <div className="fit-card p-5">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Séance du jour : {dayType}</div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>Cible : {target.cible} kcal</div>
          </div>
          <Flame size={22} color={TAB_COLOR.compteur} />
        </div>
        <div className="fit-mono text-3xl font-bold mt-2" style={{ color: remaining.kcal < 0 ? "var(--rust)" : TAB_COLOR.compteur }}>
          {remaining.kcal >= 0 ? remaining.kcal : `${remaining.kcal}`} <span className="text-base font-normal">kcal restants</span>
        </div>
        <div className="w-full h-2 rounded-full mt-2" style={{ background: "var(--border)" }}>
          <div className="h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, (consumed.kcal / target.cible) * 100))}%`, background: consumed.kcal > target.cible ? "var(--rust)" : TAB_COLOR.compteur }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
          <div><div style={{ color: "var(--muted)" }}>Protéines</div><div className="fit-mono font-bold">{remaining.prot} g</div><div className="text-xs" style={{ color: "var(--muted)" }}>sur {target.prot} g</div></div>
          <div><div style={{ color: "var(--muted)" }}>Lipides</div><div className="fit-mono font-bold">{remaining.lip} g</div><div className="text-xs" style={{ color: "var(--muted)" }}>sur {target.lip} g</div></div>
          <div><div style={{ color: "var(--muted)" }}>Glucides</div><div className="fit-mono font-bold">{remaining.gluc} g</div><div className="text-xs" style={{ color: "var(--muted)" }}>sur {target.gluc} g</div></div>
        </div>
        {nonChiffrees.length > 0 && (
          <p className="text-xs mt-3" style={{ color: "var(--muted)" }}>{nonChiffrees.length} repas sans valeurs nutritionnelles renseignées ne sont pas comptés dans le total (complétez-les dans l'onglet Nutrition pour qu'ils comptent).</p>
        )}
      </div>

      {MOMENTS.map((m) => {
        const list = allRecipes.filter((r) => r.moment === m);
        const momentEntries = entries.filter((e) => e.moment === m);
        return (
          <div key={m} className="fit-card p-4">
            <h3 className="fit-display font-bold text-sm mb-2">{m}</h3>
            <div className="flex gap-2">
              <select value={picks[m] || ""} onChange={(e) => pickRecipe(m, e.target.value)} className="flex-1 border rounded-lg px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }}>
                <option value="">Choisir un repas...</option>
                {list.map((r) => <option key={r.id} value={r.id}>{r.nom}{r.macros ? ` (${r.macros.kcal} kcal)` : ""}</option>)}
              </select>
              {picks[m] && (
                <input type="number" step="0.25" min="0.25" value={coefPicks[m] || 1}
                  onChange={(e) => setCoefPicks({ ...coefPicks, [m]: parseFloat(e.target.value) || 1 })}
                  className="w-16 border rounded-lg px-2 py-2 text-sm fit-mono" style={{ borderColor: "var(--border)" }} title="Coefficient de portion" />
              )}
              <button onClick={() => addEntry(m)} className="px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.compteur }}><Plus size={16} /></button>
            </div>
            {momentEntries.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {momentEntries.map((e) => (
                  <div key={e.id} className="flex justify-between items-center text-sm px-2 py-1.5 rounded-lg" style={{ background: "var(--paper)" }}>
                    <span>{e.nom}</span>
                    <div className="flex items-center gap-2">
                      <span className="fit-mono text-xs" style={{ color: "var(--muted)" }}>{e.macros ? `${e.macros.kcal} kcal` : "non chiffré"}</span>
                      <button onClick={() => removeEntry(e.id)} style={{ color: "var(--rust)" }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================== ONGLET HISTORIQUE NUTRITION ============================== */

function HistoriqueNutritionTab({ metabolism, planning, dailyLog }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const dates = useMemo(() => {
    const set = new Set(dailyLog.map((e) => e.date));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [dailyLog]);

  if (selectedDate) {
    const iso = selectedDate;
    const dayType = planning[iso]?.type || defaultSessionForDate(new Date(iso));
    const bucket = sessionBucket(dayType);
    const target = metabolism.table.find((r) => r.type === bucket) || metabolism.table[0];
    const entries = dailyLog.filter((e) => e.date === iso);
    const chiffrees = entries.filter((e) => e.macros);
    const consumed = chiffrees.reduce((acc, e) => ({
      kcal: acc.kcal + e.macros.kcal, prot: acc.prot + e.macros.prot, lip: acc.lip + e.macros.lip, gluc: acc.gluc + e.macros.gluc,
    }), { kcal: 0, prot: 0, lip: 0, gluc: 0 });
    const remaining = { kcal: target.cible - consumed.kcal, prot: target.prot - consumed.prot, lip: target.lip - consumed.lip, gluc: target.gluc - consumed.gluc };

    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedDate(null)} className="flex items-center gap-1 text-sm" style={{ color: TAB_COLOR["historique-nutrition"] }}>
          <ChevronLeft size={16} /> Retour à la liste
        </button>
        <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR["historique-nutrition"] }}>{fmtDate(iso)}</h1>

        <div className="fit-card p-5">
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--muted)" }}>Séance de ce jour : {dayType}</div>
          <div className="fit-mono text-2xl font-bold mt-1" style={{ color: remaining.kcal < 0 ? "var(--rust)" : TAB_COLOR["historique-nutrition"] }}>
            {consumed.kcal} <span className="text-base font-normal">/ {target.cible} kcal consommés</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
            <div><div style={{ color: "var(--muted)" }}>Protéines</div><div className="fit-mono font-bold">{consumed.prot} / {target.prot} g</div></div>
            <div><div style={{ color: "var(--muted)" }}>Lipides</div><div className="fit-mono font-bold">{consumed.lip} / {target.lip} g</div></div>
            <div><div style={{ color: "var(--muted)" }}>Glucides</div><div className="fit-mono font-bold">{consumed.gluc} / {target.gluc} g</div></div>
          </div>
        </div>

        {MOMENTS.map((m) => {
          const momentEntries = entries.filter((e) => e.moment === m);
          if (momentEntries.length === 0) return null;
          return (
            <div key={m} className="fit-card p-4">
              <h3 className="fit-display font-bold text-sm mb-2">{m}</h3>
              <div className="space-y-1.5">
                {momentEntries.map((e) => (
                  <div key={e.id} className="flex justify-between items-center text-sm px-2 py-1.5 rounded-lg" style={{ background: "var(--paper)" }}>
                    <span>{e.nom}</span>
                    <span className="fit-mono text-xs" style={{ color: "var(--muted)" }}>{e.macros ? `${e.macros.kcal} kcal` : "non chiffré"}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR["historique-nutrition"] }}>Historique nutrition</h1>
      <div className="fit-card divide-y" style={{ borderColor: "var(--border)" }}>
        {dates.map((d) => {
          const entries = dailyLog.filter((e) => e.date === d);
          const kcal = entries.filter((e) => e.macros).reduce((sum, e) => sum + e.macros.kcal, 0);
          return (
            <button key={d} onClick={() => setSelectedDate(d)} className="w-full flex justify-between items-center px-4 py-3 text-sm text-left">
              <span className="fit-mono font-medium">{fmtDate(d)}</span>
              <span style={{ color: "var(--muted)" }}>{entries.length} repas · {kcal} kcal</span>
            </button>
          );
        })}
        {dates.length === 0 && <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--muted)" }}>Aucun repas enregistré pour le moment. Ajoutez vos repas depuis l'onglet Compteur.</div>}
      </div>
    </div>
  );
}



/* ============================== MINUTEUR DE REPOS ============================== */

function RestTimerButton({ label, defaultSeconds, onStart }) {
  const [secs, setSecs] = useState(defaultSeconds);
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <input type="number" value={secs} onChange={(e) => setSecs(parseInt(e.target.value, 10) || 0)} className="w-14 text-xs border rounded-lg px-1.5 py-1 fit-mono" style={{ borderColor: "var(--border)" }} />
      <button onClick={() => onStart(label, secs)} className="text-xs px-2 py-1 rounded-lg font-medium text-white" style={{ background: "var(--rust)" }}>Repos</button>
    </div>
  );
}

function TimerBar({ timer, onToggle, onAdjust, onClose }) {
  if (!timer) return null;
  const pct = timer.total ? Math.max(0, Math.min(100, (timer.remaining / timer.total) * 100)) : 0;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-30 w-[92%] max-w-sm fit-card p-3 shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium truncate">{timer.label}</span>
        <button onClick={onClose}><X size={14} /></button>
      </div>
      <div className="flex items-center gap-3">
        <span className="fit-mono text-2xl font-bold">{fmtSecs(timer.remaining)}</span>
        <div className="flex-1 h-1.5 rounded-full" style={{ background: "var(--border)" }}>
          <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: TAB_COLOR.entrainement }} />
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => onAdjust(-15)} className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: "var(--border)" }}>-15s</button>
        <button onClick={() => onAdjust(15)} className="text-xs px-2 py-1 rounded-lg border" style={{ borderColor: "var(--border)" }}>+15s</button>
        <button onClick={onToggle} className="text-xs px-3 py-1 rounded-lg font-medium text-white ml-auto" style={{ background: TAB_COLOR.entrainement }}>
          {timer.running ? "Pause" : "Reprendre"}
        </button>
      </div>
    </div>
  );
}

function MotivationPopup({ quote, onClose }) {
  return (
    <div className="fixed left-1/2 -translate-x-1/2 top-4 z-40 w-[92%] max-w-sm fit-card p-4 shadow-lg" style={{ borderColor: TAB_COLOR.entrainement }}>
      <div className="flex justify-between items-start gap-2">
        <Sparkles size={18} color={TAB_COLOR.entrainement} />
        <button onClick={onClose}><X size={14} /></button>
      </div>
      <p className="fit-display text-sm font-medium mt-1">{quote}</p>
    </div>
  );
}

/* ============================== EDITEUR DE JOUR ============================== */

function DayEditor({ iso, planning, setPlanning, addHistory, onClose, allTypes }) {
  const existing = planning[iso];
  const [type, setType] = useState(existing?.type || defaultSessionForDate(new Date(iso)));
  const [note, setNote] = useState(existing?.note || "");
  const [duration, setDuration] = useState("");

  const save = () => { setPlanning({ ...planning, [iso]: { type, note } }); onClose(); };
  const markDone = () => {
    const d = parseInt(duration, 10);
    if (!d) return;
    addHistory({ date: iso, session: type, duration: d, note });
    setPlanning({ ...planning, [iso]: { type, note, done: true } });
    onClose();
  };

  return (
    <div className="fit-card p-4 mt-3 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm fit-mono">{fmtDate(iso)}</h3>
        <button onClick={onClose}><X size={16} /></button>
      </div>
      <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>Type de séance</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }}>
          {allTypes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {!BASE_SESSION_TYPES.includes(type) && type !== "Personnalisé" && (
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Composez les exercices de cette séance dans la section « Mes séances » ci-dessous.</p>
        )}
        <p className="flex items-center gap-1.5 text-xs mt-1.5" style={{ color: "var(--muted)" }}><Music2 size={13} /> {getMusicSuggestion(type)}</p>
      </div>
      <div>
        <label className="text-xs" style={{ color: "var(--muted)" }}>Annotation</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <button onClick={save} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.entrainement }}>Enregistrer</button>
        <input type="number" placeholder="Durée (min)" value={duration} onChange={(e) => setDuration(e.target.value)} className="border rounded-lg px-3 py-2 text-sm w-32" style={{ borderColor: "var(--border)" }} />
        <button onClick={markDone} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: "var(--rust)" }}><Check size={15} /> Marquer terminé</button>
      </div>
    </div>
  );
}

/* ============================== BIBLIOTHEQUE DE SEANCES ============================== */

function SessionLibraryPanel({ sessionLibrary, setSessionLibrary, onStartTimer }) {
  const [newName, setNewName] = useState("");

  const createType = () => {
    const name = newName.trim();
    if (!name || sessionLibrary[name]) return;
    setSessionLibrary({ ...sessionLibrary, [name]: [] });
    setNewName("");
  };
  const deleteType = (name) => {
    if (PROTECTED_SESSIONS.includes(name)) return;
    const next = { ...sessionLibrary };
    delete next[name];
    setSessionLibrary(next);
  };
  const addExercise = (name) => {
    const ex = { id: Date.now(), nom: "", series: 3, reps: "10", rest: 60 };
    setSessionLibrary({ ...sessionLibrary, [name]: [...sessionLibrary[name], ex] });
  };
  const updateExercise = (name, id, field, val) => {
    setSessionLibrary({ ...sessionLibrary, [name]: sessionLibrary[name].map((e) => (e.id === id ? { ...e, [field]: val } : e)) });
  };
  const deleteExercise = (name, id) => {
    setSessionLibrary({ ...sessionLibrary, [name]: sessionLibrary[name].filter((e) => e.id !== id) });
  };

  return (
    <div className="space-y-3">
      <h2 className="fit-display font-bold text-lg" style={{ color: TAB_COLOR.entrainement }}>Mes séances</h2>
      <p className="text-xs" style={{ color: "var(--muted)" }}>Musculation A et B sont modifiables (exercices, séries, répétitions, repos) mais ne peuvent pas être supprimées. Créez librement d'autres séances, dont vos Calisthénie et Musculation Thyb.</p>
      <div className="fit-card p-4 flex gap-2 items-end flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <label className="text-xs" style={{ color: "var(--muted)" }}>Nom de la nouvelle séance</label>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex : Musculation Jambes" className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
        </div>
        <button onClick={createType} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.entrainement }}><Plus size={15} /> Créer</button>
      </div>

      {Object.entries(sessionLibrary).map(([name, exercises]) => (
        <div key={name} className="fit-card p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="fit-display font-bold text-sm" style={{ color: getSessionColor(name) }}>{name}</h3>
            {!PROTECTED_SESSIONS.includes(name) && <button onClick={() => deleteType(name)} style={{ color: "var(--rust)" }}><Trash2 size={15} /></button>}
          </div>
          <p className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "var(--muted)" }}><Music2 size={12} /> {getMusicSuggestion(name)}</p>
          <div className="space-y-2">
            {exercises.map((ex) => (
              <div key={ex.id} className="flex flex-wrap gap-2 items-center border-t pt-2" style={{ borderColor: "var(--border)" }}>
                <input value={ex.nom} onChange={(e) => updateExercise(name, ex.id, "nom", e.target.value)} placeholder="Exercice" className="border rounded-lg px-2 py-1.5 text-xs flex-1 min-w-[120px]" style={{ borderColor: "var(--border)" }} />
                <input type="number" value={ex.series} onChange={(e) => updateExercise(name, ex.id, "series", parseInt(e.target.value, 10) || 0)} className="border rounded-lg px-2 py-1.5 text-xs w-14 fit-mono" style={{ borderColor: "var(--border)" }} title="Séries" />
                <span className="text-xs" style={{ color: "var(--muted)" }}>x</span>
                <input value={ex.reps} onChange={(e) => updateExercise(name, ex.id, "reps", e.target.value)} placeholder="reps" className="border rounded-lg px-2 py-1.5 text-xs w-16" style={{ borderColor: "var(--border)" }} title="Répétitions" />
                <RestTimerButton label={`${name} — ${ex.nom || "Exercice"}`} defaultSeconds={ex.rest} onStart={onStartTimer} />
                <button onClick={() => deleteExercise(name, ex.id)} style={{ color: "var(--rust)" }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <button onClick={() => addExercise(name)} className="flex items-center gap-1 text-sm mt-2" style={{ color: TAB_COLOR.entrainement }}><Plus size={15} /> Ajouter un exercice</button>
        </div>
      ))}
    </div>
  );
}

/* ============================== ONGLET ENTRAINEMENT ============================== */

function EntrainementTab({ planning, setPlanning, addHistory, sessionLibrary, setSessionLibrary }) {
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(null);
  const [motivation, setMotivation] = useState(null);
  const motivationShown = useRef(false);

  const allTypes = useMemo(() => [...BASE_SESSION_TYPES, ...Object.keys(sessionLibrary), "Personnalisé"], [sessionLibrary]);

  const startTimer = useCallback((label, seconds) => {
    setTimer({ label, total: seconds, remaining: seconds, running: true });
  }, []);

  useEffect(() => {
    if (!timer || !timer.running) return;
    if (timer.remaining <= 0) {
      setTimer((t) => (t ? { ...t, running: false } : t));
      if (/Musculation|Calisthénie/i.test(timer.label) && !motivationShown.current) {
        motivationShown.current = true;
        setMotivation(MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)]);
      }
      return;
    }
    const id = setTimeout(() => setTimer((t) => (t ? { ...t, remaining: t.remaining - 1 } : t)), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const year = cursor.getFullYear(), month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  const monthLabel = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.entrainement }}>Entraînement</h1>

      <div className="fit-card p-4">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft size={18} /></button>
          <span className="fit-display font-bold capitalize">{monthLabel}</span>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight size={18} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1" style={{ color: "var(--muted)" }}>
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const iso = toISO(d);
            const entry = planning[iso];
            const type = entry?.type || defaultSessionForDate(d);
            const isToday = iso === todayISO();
            return (
              <button key={iso} onClick={() => setSelected(iso)} className="aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] p-1 relative"
                style={{ background: entry?.done ? "rgba(63,108,81,0.15)" : "var(--card)", border: isToday ? `2px solid ${TAB_COLOR.entrainement}` : "1px solid var(--border)" }}>
                <span className="fit-mono font-bold">{d.getDate()}</span>
                <span className="w-2 h-2 rounded-full mt-0.5" style={{ background: getSessionColor(type) }} />
              </button>
            );
          })}
        </div>
      </div>

      {selected && <DayEditor iso={selected} planning={planning} setPlanning={setPlanning} addHistory={addHistory} allTypes={allTypes} onClose={() => setSelected(null)} />}

      <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--muted)" }}>
        {allTypes.filter((s) => s !== "Personnalisé").map((s) => (
          <span key={s} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: getSessionColor(s) }} /> {s}</span>
        ))}
      </div>

      <SessionLibraryPanel sessionLibrary={sessionLibrary} setSessionLibrary={setSessionLibrary} onStartTimer={startTimer} />

      <TimerBar timer={timer} onToggle={() => setTimer((t) => (t ? { ...t, running: !t.running } : t))}
        onAdjust={(d) => setTimer((t) => (t ? { ...t, remaining: Math.max(0, t.remaining + d), total: Math.max(t.total, t.remaining + d) } : t))}
        onClose={() => setTimer(null)} />

      {motivation && <MotivationPopup quote={motivation} onClose={() => setMotivation(null)} />}
    </div>
  );
}

/* ============================== ONGLET PROGRESSION FOOTING ============================== */

function parseMMSS(str) {
  if (!str) return null;
  const m = String(str).match(/(\d+)\s*:\s*(\d+)/);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  const m2 = String(str).match(/(\d+(?:[.,]\d+)?)/);
  if (m2) return parseFloat(m2[1].replace(",", ".")) * 60;
  return null;
}

function FootingTab({ footingLog, setFootingLog }) {
  const [date, setDate] = useState(todayISO());
  const [distance, setDistance] = useState("");
  const [temps, setTemps] = useState("");
  const [allure, setAllure] = useState("");
  const [lieu, setLieu] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [focusId, setFocusId] = useState(null);
  const [chartMetric, setChartMetric] = useState("distance");

  const addEntry = () => {
    if (!distance) return;
    const entry = { id: `foot-${Date.now()}`, date, distance: parseFloat(distance) || 0, temps, allure, lieu, commentaire };
    setFootingLog([...footingLog, entry].sort((a, b) => a.date.localeCompare(b.date)));
    setDistance(""); setTemps(""); setAllure(""); setLieu(""); setCommentaire("");
  };
  const removeEntry = (id) => setFootingLog(footingLog.filter((e) => e.id !== id));

  const enriched = useMemo(() => footingLog.map((e) => ({ ...e, label: fmtDate(e.date), tempsSec: parseMMSS(e.temps), allureSec: parseMMSS(e.allure) })), [footingLog]);

  const records = useMemo(() => {
    const withDistance = enriched.filter((e) => e.distance);
    const withTemps = enriched.filter((e) => e.tempsSec != null);
    const withAllure = enriched.filter((e) => e.allureSec != null);
    return {
      longue: withDistance.length ? withDistance.reduce((a, b) => (b.distance > a.distance ? b : a)) : null,
      rapide: withTemps.length ? withTemps.reduce((a, b) => (b.tempsSec < a.tempsSec ? b : a)) : null,
      allure: withAllure.length ? withAllure.reduce((a, b) => (b.allureSec < a.allureSec ? b : a)) : null,
    };
  }, [enriched]);

  const displayed = focusId ? enriched.filter((e) => e.id === focusId) : enriched;

  const METRICS = {
    distance: { label: "Distance", dataKey: "distance", tickFormatter: (v) => `${v}`, tooltipFormatter: (v) => `${v} km` },
    temps: { label: "Temps", dataKey: "tempsSec", tickFormatter: (v) => fmtSecs(v), tooltipFormatter: (v) => fmtSecs(v) },
    allure: { label: "Allure", dataKey: "allureSec", tickFormatter: (v) => fmtSecs(v), tooltipFormatter: (v) => `${fmtSecs(v)} /km` },
  };
  const metric = METRICS[chartMetric];

  return (
    <div className="space-y-5">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.footing }}>Progression Footing</h1>

      <div className="fit-card p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs" style={{ color: "var(--muted)" }}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="text-xs" style={{ color: "var(--muted)" }}>Distance (km)</label>
            <input type="number" step="0.01" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="8.5" className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="text-xs" style={{ color: "var(--muted)" }}>Temps</label>
            <input value={temps} onChange={(e) => setTemps(e.target.value)} placeholder="ex : 45:30" className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
          </div>
          <div>
            <label className="text-xs" style={{ color: "var(--muted)" }}>Allure moyenne</label>
            <input value={allure} onChange={(e) => setAllure(e.target.value)} placeholder="ex : 5:20 /km" className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
          </div>
          <div className="col-span-2">
            <label className="text-xs" style={{ color: "var(--muted)" }}>Lieu</label>
            <input value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="ex : Bord de mer, parc..." className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
          </div>
          <div className="col-span-2">
            <label className="text-xs" style={{ color: "var(--muted)" }}>Commentaire</label>
            <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows={2} className="block w-full border rounded-lg px-3 py-2 mt-1 text-sm" style={{ borderColor: "var(--border)" }} />
          </div>
        </div>
        <button onClick={addEntry} className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: TAB_COLOR.footing }}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => setFocusId(records.longue ? (focusId === records.longue.id ? null : records.longue.id) : null)}
          disabled={!records.longue} className="fit-card p-3 text-left disabled:opacity-40"
          style={{ borderColor: focusId === records.longue?.id ? TAB_COLOR.footing : "var(--border)" }}>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>Plus longue</div>
          <div className="fit-mono font-bold text-sm mt-0.5">{records.longue ? `${records.longue.distance} km` : "—"}</div>
          {records.longue && <div className="text-[10px]" style={{ color: "var(--muted)" }}>{fmtDate(records.longue.date)}</div>}
        </button>
        <button onClick={() => setFocusId(records.rapide ? (focusId === records.rapide.id ? null : records.rapide.id) : null)}
          disabled={!records.rapide} className="fit-card p-3 text-left disabled:opacity-40"
          style={{ borderColor: focusId === records.rapide?.id ? TAB_COLOR.footing : "var(--border)" }}>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>Plus rapide</div>
          <div className="fit-mono font-bold text-sm mt-0.5">{records.rapide ? records.rapide.temps : "—"}</div>
          {records.rapide && <div className="text-[10px]" style={{ color: "var(--muted)" }}>{fmtDate(records.rapide.date)}</div>}
        </button>
        <button onClick={() => setFocusId(records.allure ? (focusId === records.allure.id ? null : records.allure.id) : null)}
          disabled={!records.allure} className="fit-card p-3 text-left disabled:opacity-40"
          style={{ borderColor: focusId === records.allure?.id ? TAB_COLOR.footing : "var(--border)" }}>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--muted)" }}>Meilleure allure</div>
          <div className="fit-mono font-bold text-sm mt-0.5">{records.allure ? records.allure.allure : "—"}</div>
          {records.allure && <div className="text-[10px]" style={{ color: "var(--muted)" }}>{fmtDate(records.allure.date)}</div>}
        </button>
      </div>
      {focusId && <button onClick={() => setFocusId(null)} className="text-xs underline" style={{ color: TAB_COLOR.footing }}>Voir toutes les sorties</button>}

      {enriched.length > 1 && (
        <div className="fit-card p-5">
          <div className="flex gap-2 mb-3">
            {Object.entries(METRICS).map(([k, v]) => (
              <button key={k} onClick={() => setChartMetric(k)} className={`fit-pill text-xs px-3 py-1 rounded-full border ${chartMetric === k ? "active" : ""}`} style={{ borderColor: "var(--border)" }}>{v.label}</button>
            ))}
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enriched}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={metric.tickFormatter} reversed={chartMetric !== "distance"} />
                <Tooltip formatter={metric.tooltipFormatter} />
                <Line type="monotone" dataKey={metric.dataKey} stroke={TAB_COLOR.footing} strokeWidth={2.5} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {chartMetric !== "distance" && <p className="text-[10px] mt-1" style={{ color: "var(--muted)" }}>Axe inversé : plus haut = plus rapide.</p>}
        </div>
      )}

      <div className="fit-card divide-y" style={{ borderColor: "var(--border)" }}>
        {[...displayed].reverse().map((e) => (
          <div key={e.id} className="flex justify-between items-start gap-2 px-4 py-3 text-sm">
            <div>
              <div className="fit-mono font-bold">{fmtDate(e.date)} · {e.distance} km</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {[e.temps && `Temps ${e.temps}`, e.allure && `Allure ${e.allure}`, e.lieu].filter(Boolean).join(" · ")}
              </div>
              {e.commentaire && <div className="text-xs italic mt-1">{e.commentaire}</div>}
            </div>
            <button onClick={() => removeEntry(e.id)} style={{ color: "var(--rust)" }}><Trash2 size={15} /></button>
          </div>
        ))}
        {footingLog.length === 0 && <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--muted)" }}>Aucun footing enregistré pour le moment.</div>}
      </div>
    </div>
  );
}

/* ============================== ONGLET HISTORIQUE ============================== */

function HistoriqueTab({ history, setHistory }) {
  const remove = (idx) => setHistory(history.filter((_, i) => i !== idx));
  const sorted = [...history].map((h, i) => ({ ...h, idx: i })).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.historique }}>Historique sport</h1>
      <div className="fit-card divide-y" style={{ borderColor: "var(--border)" }}>
        {sorted.map((h) => (
          <div key={h.idx} className="flex justify-between items-center px-4 py-3 text-sm gap-2">
            <div>
              <div className="font-medium" style={{ color: getSessionColor(h.session) }}>{h.session}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{fmtDate(h.date)}{h.note ? ` • ${h.note}` : ""}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="fit-mono font-bold text-sm">{h.duration} min</span>
              <button onClick={() => remove(h.idx)} style={{ color: "var(--rust)" }}><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--muted)" }}>Aucune séance enregistrée. Marquez une séance comme terminée depuis l'onglet Entraînement.</div>}
      </div>
    </div>
  );
}

/* ============================== ONGLET AIDE ============================== */

function AideTab({ profile, metabolism }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      // Cette fonctionnalité utilisait l'accès Claude intégré à l'artefact,
      // indisponible dans la version PWA autonome (nécessite une clé API et un serveur relais).
      const textOut = "Cette fonctionnalité (coach IA) n'est pas disponible dans la version autonome de l'application : elle nécessite une clé API et un serveur relais qui ne sont pas inclus ici.";
      setMessages([...newMessages, { role: "assistant", content: textOut }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Une erreur est survenue, réessayez." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="fit-display text-2xl font-bold" style={{ color: TAB_COLOR.aide }}>Aide</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Posez ici vos questions sur la nutrition, l'entraînement ou l'utilisation de l'application : adapter une recette, comprendre un exercice, gérer une gêne physique, ajuster votre planning en cas d'imprévu... L'assistant connaît les grandes lignes de votre profil mais pas votre historique détaillé (pesées, séances passées) sauf si vous les mentionnez vous-même.
      </p>
      <div className="fit-card p-4 min-h-[280px] max-h-[420px] overflow-y-auto space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`text-sm p-2.5 rounded-xl max-w-[85%] ${m.role === "user" ? "ml-auto text-white" : ""}`} style={{ background: m.role === "user" ? TAB_COLOR.aide : "var(--paper)" }}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-sm" style={{ color: "var(--muted)" }}>L'assistant réfléchit...</div>}
        {messages.length === 0 && !loading && <div className="text-sm text-center" style={{ color: "var(--muted)" }}>Aucune question pour le moment.</div>}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Écrivez votre question..." className="flex-1 border rounded-lg px-3 py-2 text-sm" style={{ borderColor: "var(--border)" }} />
        <button onClick={send} disabled={loading} className="px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50" style={{ background: TAB_COLOR.aide }}><Send size={16} /></button>
      </div>
    </div>
  );
}

/* ============================== AUTHENTIFICATION ============================== */

function AuthScreen({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login");
  const [prenom, setPrenom] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError("");
    if (!prenom.trim() || !password) { setError("Renseignez un prénom et un mot de passe."); return; }
    if (mode === "signup" && password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    setBusy(true);
    const result = mode === "login" ? await onLogin(prenom.trim(), password) : await onSignup(prenom.trim(), password);
    setBusy(false);
    if (result && result.error) setError(result.error);
  };

  return (
    <div className="fit-root min-h-screen flex items-center justify-center p-6">
      <GlobalStyle />
      <div className="fit-card p-6 w-full max-w-sm space-y-4">
        <div className="text-center">
          <div className="fit-display font-bold text-xl" style={{ color: "var(--moss-dark)" }}>DAY ONE</div>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>{mode === "login" ? "Connectez-vous" : "Créez votre compte"}</p>
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Prénom</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mt-1" style={{ borderColor: "var(--border)" }}>
            <UserIcon size={15} color="var(--muted)" />
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} className="flex-1 text-sm outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs" style={{ color: "var(--muted)" }}>Mot de passe</label>
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mt-1" style={{ borderColor: "var(--border)" }}>
            <Lock size={15} color="var(--muted)" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 text-sm outline-none" />
          </div>
        </div>
        {mode === "signup" && (
          <div>
            <label className="text-xs" style={{ color: "var(--muted)" }}>Confirmer le mot de passe</label>
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mt-1" style={{ borderColor: "var(--border)" }}>
              <Lock size={15} color="var(--muted)" />
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="flex-1 text-sm outline-none" />
            </div>
          </div>
        )}
        {error && <p className="text-xs" style={{ color: "var(--rust)" }}>{error}</p>}
        <button onClick={submit} disabled={busy} className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: "var(--moss)" }}>
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
        <p className="text-xs text-center" style={{ color: "var(--muted)" }}>
          {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="underline" style={{ color: "var(--moss)" }}>
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
        <p className="text-[10px] text-center" style={{ color: "var(--muted)" }}>La connexion reste valable sur cet appareil ; reconnectez-vous manuellement sur un autre appareil.</p>
      </div>
    </div>
  );
}

function OnboardingScreen({ prenom, onComplete }) {
  return (
    <div className="fit-root min-h-screen flex items-center justify-center p-6">
      <GlobalStyle />
      <div className="fit-card p-6 w-full max-w-md space-y-4">
        <div>
          <div className="fit-display font-bold text-xl" style={{ color: "var(--moss-dark)" }}>Bienvenue {prenom}</div>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Quelques informations pour calculer votre métabolisme et générer votre programme sur mesure.</p>
        </div>
        <ProfileForm submitLabel="Créer mon programme" onSubmit={onComplete} />
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function Dashboard({ prenom, profile, setProfile, onLogout, ...data }) {
  const [tab, setTab] = useState("info");
  const currentWeight = data.weightLog.length ? data.weightLog[data.weightLog.length - 1].weight : profile.poidsDepart;
  const metabolism = useMemo(() => computeMetabolism({ ...profile, poidsActuel: currentWeight }), [profile, currentWeight]);
  const allRecipes = useMemo(() => [...RECIPES, ...data.customRecipes], [data.customRecipes]);

  return (
    <div className="fit-root flex min-h-screen">
      <GlobalStyle />
      <SideNav tab={tab} setTab={setTab} prenom={prenom} onLogout={onLogout} />
      <MobileNav tab={tab} setTab={setTab} prenom={prenom} onLogout={onLogout} />
      <main className="flex-1 p-4 sm:p-6 pt-16 md:pt-6 max-w-3xl">
        {tab === "info" && <InfoTab prenom={prenom} profile={profile} metabolism={metabolism} weightLog={data.weightLog} sessionLibrary={data.sessionLibrary} setTab={setTab} />}
        {tab === "objectifs" && <ObjectifsTab profile={profile} setProfile={setProfile} metabolism={metabolism} supplements={data.supplements} setSupplements={data.setSupplements} />}
        {tab === "pesee" && <PeseeTab weightLog={data.weightLog} setWeightLog={data.setWeightLog} profile={profile} />}
        {tab === "nutrition" && <NutritionTab favorites={data.favorites} setFavorites={data.setFavorites} notes={data.notes} setNotes={data.setNotes} customRecipes={data.customRecipes} setCustomRecipes={data.setCustomRecipes} coefficients={data.coefficients} setCoefficients={data.setCoefficients} metabolism={metabolism} />}
        {tab === "historique-nutrition" && <HistoriqueNutritionTab metabolism={metabolism} planning={data.planning} dailyLog={data.dailyLog} />}
        {tab === "compteur" && <DailyCounterTab profile={profile} metabolism={metabolism} planning={data.planning} allRecipes={allRecipes} dailyLog={data.dailyLog} setDailyLog={data.setDailyLog} coefficients={data.coefficients} />}
        {tab === "entrainement" && <EntrainementTab planning={data.planning} setPlanning={data.setPlanning} addHistory={data.addHistory} sessionLibrary={data.sessionLibrary} setSessionLibrary={data.setSessionLibrary} />}
        {tab === "footing" && <FootingTab footingLog={data.footingLog} setFootingLog={data.setFootingLog} />}
        {tab === "historique" && <HistoriqueTab history={data.history} setHistory={data.setHistory} />}
        {tab === "aide" && <AideTab profile={profile} metabolism={metabolism} />}
      </main>
    </div>
  );
}

/* ============================== RACINE : AUTH + CHARGEMENT ============================== */

export default function Root() {
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [weightLog, setWeightLog] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [notes, setNotes] = useState({});
  const [planning, setPlanning] = useState({});
  const [history, setHistory] = useState([]);
  const [customRecipes, setCustomRecipes] = useState([]);
  const [sessionLibrary, setSessionLibrary] = useState(defaultSessionLibrary());
  const [supplements, setSupplements] = useState(defaultSupplements());
  const [dailyLog, setDailyLog] = useState([]);
  const [coefficients, setCoefficients] = useState({});
  const [footingLog, setFootingLog] = useState([]);

  // Vérifie si une session Supabase existe déjà sur cet appareil (persistée automatiquement).
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (user) {
        setUserId(user.id);
        const { data: row } = await supabase.from("user_data").select("prenom").eq("id", user.id).maybeSingle();
        if (row) setUsername(row.prenom);
      }
      setAuthChecked(true);
    })();
  }, []);

  // Charge les données de l'utilisateur depuis Supabase une fois connecté.
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setDataLoaded(false);
      const { data: row } = await supabase.from("user_data").select("payload").eq("id", userId).maybeSingle();
      const p = row?.payload || {};
      setProfile(normalizeProfile(p.profile ?? null));
      setWeightLog(p.weightLog ?? []);
      setFavorites(p.favorites ?? {});
      setNotes(p.notes ?? {});
      setPlanning(p.planning ?? {});
      setHistory(p.history ?? []);
      setCustomRecipes(p.customRecipes ?? []);
      setSessionLibrary({ ...defaultSessionLibrary(), ...(p.sessionLibrary ?? {}) });
      setSupplements(p.supplements ?? defaultSupplements());
      setDailyLog(p.dailyLog ?? []);
      setCoefficients(p.coefficients ?? {});
      setFootingLog(p.footingLog ?? []);
      setDataLoaded(true);
    })();
  }, [userId]);

  // Réunit tout en un seul objet et l'enregistre sur Supabase (avec un léger délai pour grouper les changements rapprochés).
  const payload = useMemo(() => ({
    profile, weightLog, favorites, notes, planning, history, customRecipes,
    sessionLibrary, supplements, dailyLog, coefficients, footingLog,
  }), [profile, weightLog, favorites, notes, planning, history, customRecipes, sessionLibrary, supplements, dailyLog, coefficients, footingLog]);

  useEffect(() => {
    if (!dataLoaded || !userId) return;
    const t = setTimeout(() => {
      supabase.from("user_data").update({ payload, updated_at: new Date().toISOString() }).eq("id", userId).then(() => {});
    }, 800);
    return () => clearTimeout(t);
  }, [payload, dataLoaded, userId]);

  const addHistory = useCallback((entry) => setHistory((h) => [...h, entry]), []);

  const login = async (name, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailFromPrenom(name), password });
    if (error) return { error: "Prénom ou mot de passe incorrect." };
    setUserId(data.user.id);
    setUsername(name.trim());
    return {};
  };

  const signup = async (name, password) => {
    const { data: existing } = await supabase.from("user_data").select("prenom").ilike("prenom", name.trim()).maybeSingle();
    if (existing) return { error: "Ce prénom est déjà utilisé. Connectez-vous ou choisissez-en un autre." };
    const { data, error } = await supabase.auth.signUp({ email: emailFromPrenom(name), password });
    if (error) return { error: error.message === "Password should be at least 6 characters." ? "Le mot de passe doit contenir au moins 6 caractères." : "Impossible de créer le compte." };
    const { error: insertError } = await supabase.from("user_data").insert({ id: data.user.id, prenom: name.trim(), payload: {} });
    if (insertError) return { error: "Impossible de créer le compte." };
    setUserId(data.user.id);
    setUsername(name.trim());
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUserId(null); setUsername(null); setDataLoaded(false); setProfile(null);
    setWeightLog([]); setFavorites({}); setNotes({}); setPlanning({}); setHistory([]);
    setCustomRecipes([]); setSessionLibrary(defaultSessionLibrary()); setSupplements(defaultSupplements()); setDailyLog([]); setCoefficients({}); setFootingLog([]);
  };

  const completeOnboarding = (p) => {
    setProfile(p);
    setWeightLog([{ date: todayISO(), weight: p.poidsDepart }]);
  };

  if (!authChecked) {
    return <div className="fit-root flex items-center justify-center h-screen text-sm" style={{ color: "var(--muted)" }}><GlobalStyle />Chargement...</div>;
  }
  if (!username) {
    return <AuthScreen onLogin={login} onSignup={signup} />;
  }
  if (!dataLoaded) {
    return <div className="fit-root flex items-center justify-center h-screen text-sm" style={{ color: "var(--muted)" }}><GlobalStyle />Chargement...</div>;
  }
  if (!profile) {
    return <OnboardingScreen prenom={username} onComplete={completeOnboarding} />;
  }

  return (
    <Dashboard
      prenom={username} profile={profile} setProfile={setProfile} onLogout={logout}
      weightLog={weightLog} setWeightLog={setWeightLog}
      favorites={favorites} setFavorites={setFavorites}
      notes={notes} setNotes={setNotes}
      planning={planning} setPlanning={setPlanning}
      history={history} setHistory={setHistory} addHistory={addHistory}
      customRecipes={customRecipes} setCustomRecipes={setCustomRecipes}
      sessionLibrary={sessionLibrary} setSessionLibrary={setSessionLibrary}
      supplements={supplements} setSupplements={setSupplements}
      dailyLog={dailyLog} setDailyLog={setDailyLog}
      coefficients={coefficients} setCoefficients={setCoefficients}
      footingLog={footingLog} setFootingLog={setFootingLog}
    />
  );
}
/* ============================== MONTAGE (nécessaire hors artefact Claude) ============================== */
const rootEl = document.getElementById("root");
ReactDOM.createRoot(rootEl).render(<Root />);
