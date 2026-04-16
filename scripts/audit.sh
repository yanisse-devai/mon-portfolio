#!/usr/bin/env bash
# =============================================================
# audit.sh — Audit complet du portfolio via Claude Code
# Usage : bash scripts/audit.sh
# =============================================================

set -euo pipefail

# --- Config --------------------------------------------------
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATE="$(date +%Y-%m-%d)"
REPORT_DIR="$REPO_ROOT/reports/$DATE"
PASS=0
FAIL=0

# --- Helpers -------------------------------------------------
info()    { echo "  $1"; }
success() { echo "  ✓ $1"; PASS=$((PASS + 1)); }
failure() { echo "  ✗ $1"; FAIL=$((FAIL + 1)); }
section() { echo; echo "── $1"; }

run_audit() {
  local label="$1"
  local prompt="$2"
  local outfile="$3"

  section "$label"
  info "Lancement de Claude Code..."

  if claude --print "$prompt" \
       --no-stream \
       2>/dev/null \
       > "$outfile"; then
    success "Rapport sauvegardé → $outfile"
  else
    failure "Échec de l'audit"
    echo "(prompt exécuté quand même — fichier peut être partiel)" >> "$outfile"
  fi
}

# --- Init ----------------------------------------------------
echo
echo "═══════════════════════════════════════════════"
echo "  Audit portfolio — $DATE"
echo "═══════════════════════════════════════════════"

mkdir -p "$REPORT_DIR"
cd "$REPO_ROOT"

# --- 1. Accessibilité ----------------------------------------
run_audit \
  "1/3 · Audit accessibilité" \
  "Tu es un expert accessibilité web (WCAG 2.1). Audite le fichier index.html et css/style.css de ce portfolio. Pour chaque problème trouvé indique : niveau (critique/majeur/mineur), fichier, ligne, description, correction recommandée. Termine par un score /10 et 3 actions prioritaires." \
  "$REPORT_DIR/accessibility.md"

# --- 2. Revue de code ----------------------------------------
run_audit \
  "2/3 · Revue de code" \
  "Tu es un reviewer senior front-end. Évalue les fichiers index.html, css/style.css et js/main.js sur 4 axes : lisibilité, performance, maintenabilité, bonnes pratiques. Donne une note /10 par fichier avec justification et points d'amélioration concrets. Termine par 3 refactorings prioritaires classés par impact." \
  "$REPORT_DIR/code-review.md"

# --- 3. Checklist déploiement --------------------------------
run_audit \
  "3/3 · Checklist déploiement" \
  "Vérifie la checklist de pré-déploiement de ce site statique : 1) index.html existe à la racine 2) Doctype HTML5, lang, charset, viewport, title, meta description, favicon 3) Pas de !important inutiles en CSS 4) Media queries présentes (mobile/tablette/desktop) 5) Pas de console.log en JS 6) Scripts en fin de body ou defer 7) Images optimisées. Produis un rapport OK/KO pour chaque point." \
  "$REPORT_DIR/deploy-checklist.md"

# --- Résumé --------------------------------------------------
section "Résumé"
echo
echo "  Date      : $DATE"
echo "  Rapports  : $REPORT_DIR/"
echo
ls -1 "$REPORT_DIR/"
echo
echo "  Audits réussis  : $PASS/3"
[ "$FAIL" -gt 0 ] && echo "  Audits échoués  : $FAIL/3"
echo
echo "═══════════════════════════════════════════════"
[ "$FAIL" -eq 0 ] && echo "  Tous les audits sont terminés." \
                  || echo "  $FAIL audit(s) en erreur — vérifier les logs."
echo "═══════════════════════════════════════════════"
echo
