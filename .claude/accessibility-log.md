# Log des corrections d'accessibilité

## Session 1 — 2026-04-15 (audit initial)

Audit via agent `audit-accessibilité`. 8 problèmes corrigés.

### 🔴 Critiques résolus

| # | Problème | Fichier | Correction |
|---|---|---|---|
| C1 | `outline: none` sur `.form-field` sans remplacement | `css/style.css:528` | Ajout de `.form-field:focus-visible` avec outline accent |
| C2 | Aucun style `:focus-visible` sur liens et boutons | `css/style.css` | Ajout règle globale `a:focus-visible, button:focus-visible` |

### 🟠 Majeures résolues

| # | Problème | Fichier | Correction |
|---|---|---|---|
| M1 | Footer `opacity: 0.55` → contraste ~2.4:1 | `css/style.css:542` | Suppression de `opacity: 0.55` |
| M2 | `.project-card__date` `opacity: 0.7` → contraste ~3.1:1 | `css/style.css:444` | Suppression de `opacity: 0.7` |
| M3 | Formulaire `novalidate` sans feedback d'erreur | `js/main.js` | IIFE de validation ajoutée avec `aria-invalid`, messages d'erreur, focus sur champ invalide |
| M4 | Champs sans `required` ni `aria-required` | `index.html:100-109` | Ajout de `required aria-required="true"` sur les 3 champs |
| M5 | Pas de focus trap dans le menu mobile | `js/main.js` | Fonction `trapFocus()` ajoutée, activée à l'ouverture, focus automatique sur premier lien |
| M6 | Message d'erreur projets sans annonce | `js/main.js:98` | Ajout de `role="alert"` + région `aria-live="polite"` `#projects-status` |

### 🟡 Mineures résolues

| # | Problème | Fichier | Correction |
|---|---|---|---|
| m1 | `scroll-behavior: smooth` sans `prefers-reduced-motion` | `css/style.css` | Ajout media query `prefers-reduced-motion: reduce` en fin de fichier |
| m2 | Bouton theme toggle sans état annoncé | `index.html:41` / `js/main.js` | `aria-label` dynamique ("Activer le mode clair/sombre") + `aria-pressed` géré en JS |
| m3 | Lien LinkedIn `href="#"` sans contexte | `index.html:122` | Ajout `aria-label="LinkedIn (bientôt disponible)"` |
| m4 | Pas de région `aria-live` pour le chargement des projets | `index.html` / `js/main.js` | Ajout `<p id="projects-status" aria-live="polite">` + mise à jour après fetch |

---

## Session 2 — 2026-04-15 (audit accessibility-checker)

Audit via agent `accessibility-checker`. Score initial : 8/10. 2 problèmes "Important" corrigés.

### 🟠 Importants résolus

| # | Problème | Fichier | Correction |
|---|---|---|---|
| I1 | Absence de lien "skip to content" | `index.html:32` / `css/style.css` | Ajout `<a href="#hero" class="skip-link">` + styles CSS (visible au focus uniquement) |
| I2 | Contraste `.btn-accent` mode clair : `#0d9373`/`#fff` = 3.5:1 (échec AA) | `css/style.css:67` | Couleur accent clair → `#0a7a5f` (ratio 4.95:1 ✅) |

### Score après corrections : **9 / 10**

### Problèmes mineurs restants (non bloquants)

| # | Problème | Fichier | Statut |
|---|---|---|---|
| m1 | `<span>Photo</span>` dans `.about__photo` lu par les AT | `index.html:77` | En attente (placeholder sera remplacé par une vraie photo) |
| m2 | `role="alert"` + `aria-live="assertive"` redondants sur `#form-feedback` | `index.html:111` | Inoffensif, non prioritaire |
| m3 | `aria-label` hamburger ne change pas à l'ouverture | `js/main.js` | `aria-expanded` gère ce cas pour les AT principaux |
