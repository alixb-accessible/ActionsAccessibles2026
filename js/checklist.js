/* ============================================================
   CHECKLIST.JS — logique de la checklist evenement
   ============================================================ */

let emailOrga = null;
let evenement = null;

// Lire les params URL
function getParams() {
    const p = new URLSearchParams(window.location.search);
    return { id: p.get('id'), email: p.get('email') };
}

// Sections actives selon le type d'evenement
function sectionsActives(type) {
    const map = {
        tractage:         ['tous', 'manif'],
        petit:            ['tous', 'lieu', 'non_tractage'],
        reunion_publique: ['tous', 'lieu', 'non_tractage'],
        conference:       ['tous', 'lieu', 'non_tractage', 'grand'],
        manif:            ['tous', 'manif', 'non_tractage'],
        grand:            ['tous', 'lieu', 'non_tractage', 'grand'],
        autre:            ['tous', 'lieu', 'non_tractage'],
    };
    return map[type] || ['tous'];
}

function itemVisible(item, sections) {
    return item.sections.some(s => sections.includes(s));
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    const { id, email } = getParams();
    if (!id || !email) {
        document.getElementById('titre-evenement').textContent = 'Événement introuvable';
        return;
    }
    emailOrga = email;
    const data = Storage.charger(email);
    evenement = Storage.getEvenement(data, id);
    if (!evenement) {
        document.getElementById('titre-evenement').textContent = 'Événement introuvable';
        return;
    }

    // Lien retour avec email
    document.getElementById('lien-retour').href = 'index.html?email=' + encodeURIComponent(email);

    // Entete
    document.getElementById('titre-evenement').textContent = evenement.titre;
    document.getElementById('meta-type').textContent = labelType(evenement.type, evenement.typeAutre);
    if (evenement.lieu) document.getElementById('meta-lieu').textContent = evenement.lieu;

    // Remplir les champs generaux
    remplirChamps();

    // Construire les items de checklist
    const sections = sectionsActives(evenement.type);
    ['inclusion','lieu','cheminement','sensoriel','communication','sante','alimentation','manif'].forEach(cat => {
        const conteneur = document.getElementById('items-' + cat);
        if (!conteneur) return;
        const items = CHECKLIST[cat] || [];
        items.filter(item => itemVisible(item, sections)).forEach(item => {
            conteneur.appendChild(creerItemHTML(item));
        });
    });

    // Onglet manif : masquer l'alerte si c'est une manif
    if (evenement.type === 'manif') {
        const alerte = document.getElementById('alerte-non-manif');
        if (alerte) alerte.style.display = 'none';
    }

    // Aménagements custom
    (evenement.amenagements_custom || []).forEach(am => ajouterAmenagement(am));

    // Repérage
    chargerReperage();

    // Mise a jour progression
    mettreAJourProgression();

    // Onglets
    initialiserOnglets();
});

function creerItemHTML(item) {
    const etatSauve = (evenement.checklist[item.id] || {}).etat || '';
    const notesSauve = (evenement.checklist[item.id] || {}).notes || '';
    const notesId = 'notes-' + item.id;

    const div = document.createElement('div');
    div.className = 'cl-item';
    div.innerHTML = `
        <div class="cl-item-label">
            ${escHtml(item.label)}
            <span class="cl-item-pourquoi">${escHtml(item.pourquoi)}</span>
        </div>
        <select class="select-etat" data-etat="${etatSauve}"
                aria-label="Etat : ${escHtml(item.label)}"
                onchange="changerEtat('${item.id}', this)">
            <option value="">À évaluer</option>
            <option value="non"      ${etatSauve==='non'?'selected':''}>Non prévu</option>
            <option value="prevu"    ${etatSauve==='prevu'?'selected':''}>Prévu</option>
            <option value="commande" ${etatSauve==='commande'?'selected':''}>Commandé / en cours</option>
            <option value="confirme" ${etatSauve==='confirme'?'selected':''}>Confirmé</option>
            <option value="na"       ${etatSauve==='na'?'selected':''}>Non applicable</option>
        </select>
        <textarea class="cl-item-notes ${notesSauve ? 'visible' : ''}"
                  id="${notesId}"
                  placeholder="Notes..."
                  aria-label="Notes pour : ${escHtml(item.label)}"
                  onchange="sauvegarderNotes('${item.id}', this.value)">${escHtml(notesSauve)}</textarea>
    `;
    return div;
}

function changerEtat(id, select) {
    const etat = select.value;
    select.setAttribute('data-etat', etat);
    if (!evenement.checklist[id]) evenement.checklist[id] = {};
    evenement.checklist[id].etat = etat;
    // Afficher le textarea si pas vide ou si etat interessant
    const textarea = document.getElementById('notes-' + id);
    if (textarea && (etat === 'non' || etat === 'prevu' || etat === 'commande')) {
        textarea.classList.add('visible');
    }
    sauvegarderEvenement();
    mettreAJourProgression();
}

function sauvegarderNotes(id, val) {
    if (!evenement.checklist[id]) evenement.checklist[id] = {};
    evenement.checklist[id].notes = val;
    sauvegarderEvenement();
}

function sauvegarderChamp(champ, val) {
    evenement[champ] = val;
    if (champ === 'lieu') document.getElementById('meta-lieu').textContent = val;
    sauvegarderEvenement();
}

function remplirChamps() {
    const champs = ['lieu','etage','date','contact','referent','cheminementLibre','cortegeNote'];
    champs.forEach(c => {
        const el = document.getElementById('champ-' + c);
        if (el && evenement[c]) el.value = evenement[c];
    });
}

// Repérage
function chargerReperage() {
    const r = evenement.reperage || {};
    const el = (id) => document.getElementById(id);
    if (el('reperage-fait')) el('reperage-fait').checked = !!r.fait;
    if (el('reperage-date') && r.date) el('reperage-date').value = r.date;
    if (el('reperage-par') && r.par) el('reperage-par').value = r.par;
    if (el('reperage-notes') && r.notes) el('reperage-notes').value = r.notes;
    if (el('reperage-media-lien') && r.lien) el('reperage-media-lien').value = r.lien;
    if (r.photos) { const b = el('btn-photos'); if(b) { b.classList.add('fait'); b.setAttribute('aria-pressed','true'); } }
    if (r.video)  { const b = el('btn-video');  if(b) { b.classList.add('fait'); b.setAttribute('aria-pressed','true'); } }
}

function sauvegarderReperage(champ, val) {
    if (!evenement.reperage) evenement.reperage = {};
    evenement.reperage[champ] = val;
    sauvegarderEvenement();
}

function toggleMedia(type) {
    if (!evenement.reperage) evenement.reperage = {};
    evenement.reperage[type] = !evenement.reperage[type];
    const btn = document.getElementById('btn-' + type);
    if (btn) {
        btn.classList.toggle('fait', evenement.reperage[type]);
        btn.setAttribute('aria-pressed', evenement.reperage[type] ? 'true' : 'false');
    }
    sauvegarderEvenement();
}

// Aménagements personnalisés
let compteurAm = 0;

function ajouterAmenagement(valeurInitiale) {
    compteurAm++;
    const id = 'am-' + compteurAm;
    const valeur = (typeof valeurInitiale === 'string') ? valeurInitiale : '';
    const div = document.createElement('div');
    div.className = 'amenagement-item';
    div.id = 'conteneur-' + id;
    div.innerHTML = `
        <input type="text" id="${id}" value="${escHtml(valeur)}"
               placeholder="Ex : Places reservees en premiere rangee pour les personnes en fauteuil"
               aria-label="Amenagement personnalise"
               onchange="sauvegarderAmenagements()">
        <button class="btn-suppr-amenagement"
                onclick="supprimerAmenagement('conteneur-${id}')"
                aria-label="Supprimer cet amenagement">
            &times;
        </button>
    `;
    document.getElementById('liste-custom').appendChild(div);
}

function supprimerAmenagement(conteneurId) {
    const el = document.getElementById(conteneurId);
    if (el) el.remove();
    sauvegarderAmenagements();
}

function sauvegarderAmenagements() {
    const inputs = document.querySelectorAll('#liste-custom input[type="text"]');
    evenement.amenagements_custom = Array.from(inputs).map(i => i.value.trim()).filter(Boolean);
    sauvegarderEvenement();
}

// Sections pliables
function toggleSection(btn) {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
}

// Progression
function mettreAJourProgression() {
    const sections = sectionsActives(evenement.type);
    let total = 0, confirmes = 0;
    Object.values(CHECKLIST).forEach(items => {
        items.filter(item => itemVisible(item, sections)).forEach(item => {
            const etat = (evenement.checklist[item.id] || {}).etat;
            if (etat && etat !== 'na') {
                total++;
                if (etat === 'confirme') confirmes++;
            }
        });
    });
    const pct = total > 0 ? Math.round((confirmes / total) * 100) : 0;
    const barre = document.getElementById('prog-barre-inner');
    const texte = document.getElementById('prog-texte');
    const barreAttr = document.getElementById('prog-barre');
    if (barre) barre.style.width = pct + '%';
    if (barreAttr) barreAttr.setAttribute('aria-valuenow', pct);
    if (texte) texte.textContent = confirmes + ' point' + (confirmes > 1 ? 's' : '') + ' confirme' + (confirmes > 1 ? 's' : '');
}

// Onglets
function initialiserOnglets() {
    const btns = document.querySelectorAll('.onglet-btn');
    btns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            btns.forEach(b => { b.setAttribute('aria-selected','false'); });
            document.querySelectorAll('.onglet-panneau').forEach(p => p.classList.remove('actif'));
            btn.setAttribute('aria-selected','true');
            const panneau = document.getElementById(btn.getAttribute('aria-controls'));
            if (panneau) panneau.classList.add('actif');
        });
        btn.addEventListener('keydown', (e) => {
            let ni;
            if (e.key === 'ArrowRight') { e.preventDefault(); ni = (idx+1) % btns.length; btns[ni].click(); btns[ni].focus(); }
            if (e.key === 'ArrowLeft')  { e.preventDefault(); ni = (idx-1+btns.length) % btns.length; btns[ni].click(); btns[ni].focus(); }
        });
    });
}

// Annonce
function genererAnnonce() {
    const evt = evenement;
    const sections = sectionsActives(evt.type);
    let t = '';
    t += 'INFORMATIONS D\'ACCESSIBILITE\n';
    t += '='.repeat(40) + '\n\n';
    if (evt.titre) t += 'Evenement : ' + evt.titre + '\n';
    if (evt.date)  t += 'Date : ' + new Date(evt.date).toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'}) + '\n';
    if (evt.lieu)  t += 'Lieu : ' + evt.lieu + '\n';
    if (evt.etage) t += 'Niveau : ' + evt.etage + '\n';
    t += '\n';

    // Parcourir les categories
    const cats = [
        { key: 'inclusion',      label: 'INCLUSION ET PARTICIPATION' },
        { key: 'lieu',           label: 'ACCESSIBILITÉ DU LIEU' },
        { key: 'cheminement',    label: 'CHEMINEMENT ET ACCÈS' },
        { key: 'sensoriel',      label: 'ENVIRONNEMENT SENSORIEL' },
        { key: 'communication',  label: 'COMMUNICATION' },
        { key: 'sante',          label: 'SANTÉ ET HYGIÈNE' },
        { key: 'alimentation',   label: 'ALIMENTATION' },
        { key: 'manif',          label: 'ORGANISATION DU CORTÈGE' },
    ];

    cats.forEach(({ key, label }) => {
        const items = (CHECKLIST[key] || []).filter(item => itemVisible(item, sections));
        const confirmes = items.filter(item => (evt.checklist[item.id] || {}).etat === 'confirme');
        const prevus    = items.filter(item => ['prevu','commande'].includes((evt.checklist[item.id] || {}).etat));
        if (confirmes.length === 0 && prevus.length === 0) return;
        t += label + '\n' + '-'.repeat(label.length) + '\n';
        confirmes.forEach(item => { t += '  [OK] ' + item.label + '\n'; });
        prevus.forEach(item => { t += '  [En cours] ' + item.label + '\n'; });
        t += '\n';
    });

    // Amenagements custom
    if (evt.amenagements_custom && evt.amenagements_custom.length > 0) {
        t += 'AMÉNAGEMENTS SPÉCIFIQUES\n' + '-'.repeat(24) + '\n';
        evt.amenagements_custom.forEach(am => { t += '  - ' + am + '\n'; });
        t += '\n';
    }

    if (evt.contact) t += 'Contact accessibilite : ' + evt.contact + '\n';
    if (evt.referent) t += 'Personne referente le jour J : ' + evt.referent + '\n';
    t += '\n---\nRien sur nous sans nous\n';
    if (evt.contact) t += 'Pour signaler vos besoins : ' + evt.contact + '\n';

    evenement.annonce = t;
    sauvegarderEvenement();

    const rendu = document.getElementById('annonce-rendu');
    rendu.textContent = t;
    document.getElementById('btn-copier').disabled = false;
    document.getElementById('btn-telecharger').disabled = false;
}

function copierAnnonce() {
    const t = document.getElementById('annonce-rendu').textContent;
    navigator.clipboard.writeText(t).then(() => {
        const btn = document.getElementById('btn-copier');
        const orig = btn.textContent;
        btn.textContent = 'Copie !';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    });
}

function telechargerAnnonce() {
    const t = document.getElementById('annonce-rendu').textContent;
    const blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accessibilite-' + (evenement.titre || 'evenement').replace(/[^a-z0-9]/gi,'-').toLowerCase() + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function sauvegarderEvenement() {
    Storage.sauvegarderEvenement(emailOrga, evenement);
}

function labelType(type, typeAutre) {
    const labels = { tractage:'Tractage / collage', petit:'Petit événement', reunion_publique:'Reunion publique / AG', conference:'Conference / journee d\'etude', manif:'Manifestation / cortege', grand:'Grand evenement', autre: typeAutre || 'Autre' };
    return labels[type] || type;
}

function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
