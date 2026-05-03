/* ============================================================
   CHECKLIST.JS
   ============================================================ */

let emailOrga = null;
let evenement = null;

function getParams() {
    const p = new URLSearchParams(window.location.search);
    return { id: p.get('id'), email: p.get('email') };
}

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

window.addEventListener('DOMContentLoaded', () => {
    const { id, email } = getParams();
    if (!id || !email) { document.getElementById('titre-evenement').textContent = 'Événement introuvable'; return; }
    emailOrga = email;
    const data = Storage.charger(email);
    evenement = Storage.getEvenement(data, id);
    if (!evenement) { document.getElementById('titre-evenement').textContent = 'Événement introuvable'; return; }

    document.getElementById('lien-retour').href = 'index.html?email=' + encodeURIComponent(email);
    document.getElementById('titre-evenement').textContent = evenement.titre;
    document.getElementById('meta-type').textContent = labelType(evenement.type, evenement.typeAutre);
    if (evenement.lieu) document.getElementById('meta-lieu').textContent = evenement.lieu;

    remplirChamps();

    const sections = sectionsActives(evenement.type);
    ['inclusion','lieu','cheminement','sensoriel','communication','sante','alimentation','manif'].forEach(cat => {
        const conteneur = document.getElementById('items-' + cat);
        if (!conteneur) return;
        (CHECKLIST[cat] || []).filter(item => itemVisible(item, sections)).forEach(item => {
            conteneur.appendChild(creerItemHTML(item));
        });
    });

    if (evenement.type === 'manif') {
        const alerte = document.getElementById('alerte-non-manif');
        if (alerte) alerte.style.display = 'none';
    }

    (evenement.amenagements_custom || []).forEach(am => ajouterAmenagement(am));
    chargerReperage();
    mettreAJourProgression();
    mettreAJourDeadlines();
    initialiserOnglets();
});

// ===== DEADLINES =====
function urgenceDeadline(dateStr) {
    if (!dateStr) return null;
    const maintenant = new Date();
    maintenant.setHours(0,0,0,0);
    const deadline = new Date(dateStr);
    const diff = Math.floor((deadline - maintenant) / (1000*60*60*24));
    if (diff < 0)  return { classe: 'deadline-rouge',  label: 'Dépassée !', diff };
    if (diff <= 3) return { classe: 'deadline-rouge',  label: diff === 0 ? 'Aujourd'hui !' : 'Dans ' + diff + ' j', diff };
    if (diff <= 14) return { classe: 'deadline-orange', label: 'Dans ' + diff + ' j', diff };
    return { classe: 'deadline-vert', label: 'Dans ' + diff + ' j', diff };
}

function mettreAJourDeadlines() {
    const liste = document.getElementById('deadlines-liste');
    if (!liste) return;
    const sections = sectionsActives(evenement.type);
    const avecDeadline = [];

    Object.values(CHECKLIST).forEach(items => {
        items.filter(item => itemVisible(item, sections)).forEach(item => {
            const data = evenement.checklist[item.id] || {};
            if (data.deadline) {
                const urgence = urgenceDeadline(data.deadline);
                avecDeadline.push({ item, data, urgence });
            }
        });
    });

    if (avecDeadline.length === 0) {
        liste.innerHTML = '<p style="color:var(--gris-texte);font-size:0.9rem;">Aucune deadline assignée pour l\'instant. Ajoutez des dates depuis les autres onglets.</p>';
        return;
    }

    // Trier par urgence (diff croissant)
    avecDeadline.sort((a, b) => a.urgence.diff - b.urgence.diff);

    liste.innerHTML = avecDeadline.map(({ item, data, urgence }) => `
        <div class="deadline-ligne">
            <span class="deadline-badge ${urgence.classe}">${urgence.label}</span>
            <span class="deadline-ligne-label">${escHtml(item.label)}</span>
            <span style="font-size:0.8rem;color:var(--gris-texte);">${data.deadline ? new Date(data.deadline).toLocaleDateString('fr-FR') : ''}</span>
            <span style="font-size:0.8rem;color:var(--gris-texte);">${data.etat ? escHtml(ETATS_LABELS[data.etat] || data.etat) : 'À évaluer'}</span>
        </div>
    `).join('');
}

function envoyerAlertesMail() {
    const sections = sectionsActives(evenement.type);
    const urgents = [];

    Object.values(CHECKLIST).forEach(items => {
        items.filter(item => itemVisible(item, sections)).forEach(item => {
            const data = evenement.checklist[item.id] || {};
            if (data.deadline) {
                const urgence = urgenceDeadline(data.deadline);
                if (urgence && urgence.diff <= 14) {
                    urgents.push({ item, data, urgence });
                }
            }
        });
    });

    if (urgents.length === 0) {
        alert('Aucune deadline urgente (moins de 2 semaines) à signaler.');
        return;
    }

    urgents.sort((a, b) => a.urgence.diff - b.urgence.diff);

    let corps = 'Bonjour,\n\nVoici les points d\'accessibilité urgents pour : ' + evenement.titre + '\n\n';
    urgents.forEach(({ item, urgence }) => {
        const emoji = urgence.classe === 'deadline-rouge' ? '[URGENT]' : '[Bientôt]';
        corps += emoji + ' ' + urgence.label + ' — ' + item.label + '\n';
    });
    corps += '\nRien sur nous sans nous.';

    const sujet = encodeURIComponent('[Accessibilité] Deadlines urgentes — ' + evenement.titre);
    const body  = encodeURIComponent(corps);
    window.location.href = 'mailto:' + emailOrga + '?subject=' + sujet + '&body=' + body;
}

// ===== ITEMS =====
function creerItemHTML(item) {
    const saved    = evenement.checklist[item.id] || {};
    const etat     = saved.etat || '';
    const notes    = saved.notes || '';
    const deadline = saved.deadline || '';
    const urgence  = urgenceDeadline(deadline);
    const notesId  = 'notes-' + item.id;
    const dlId     = 'dl-' + item.id;

    const badgeHTML = urgence ? `<span class="deadline-badge ${urgence.classe}" style="margin-left:0.4rem">${urgence.label}</span>` : '';

    const div = document.createElement('div');
    div.className = 'cl-item';
    div.id = 'item-' + item.id;
    div.innerHTML = `
        <div class="cl-item-label">
            ${escHtml(item.label)}${badgeHTML}
            <span class="cl-item-pourquoi">${escHtml(item.pourquoi)}</span>
            <div class="deadline-groupe">
                <label class="deadline-label" for="${dlId}">Deadline :</label>
                <input type="date" class="deadline-input" id="${dlId}" value="${deadline}"
                       aria-label="Deadline pour : ${escHtml(item.label)}"
                       onchange="changerDeadline('${item.id}', this)">
            </div>
        </div>
        <select class="select-etat" data-etat="${etat}"
                aria-label="État : ${escHtml(item.label)}"
                onchange="changerEtat('${item.id}', this)">
            <option value="">À évaluer</option>
            <option value="non"      ${etat==='non'?'selected':''}>Non prévu</option>
            <option value="prevu"    ${etat==='prevu'?'selected':''}>Prévu</option>
            <option value="commande" ${etat==='commande'?'selected':''}>Commandé / en cours</option>
            <option value="confirme" ${etat==='confirme'?'selected':''}>Confirmé</option>
            <option value="na"       ${etat==='na'?'selected':''}>Non applicable</option>
        </select>
        <textarea class="cl-item-notes ${notes ? 'visible' : ''}"
                  id="${notesId}"
                  placeholder="Notes…"
                  aria-label="Notes pour : ${escHtml(item.label)}"
                  onchange="sauvegarderNotes('${item.id}', this.value)">${escHtml(notes)}</textarea>
    `;
    return div;
}

function changerDeadline(id, input) {
    if (!evenement.checklist[id]) evenement.checklist[id] = {};
    evenement.checklist[id].deadline = input.value;
    // Mettre à jour le badge dans l'item
    const itemEl = document.getElementById('item-' + id);
    if (itemEl) {
        const urgence = urgenceDeadline(input.value);
        let badge = itemEl.querySelector('.deadline-badge');
        if (urgence) {
            if (!badge) {
                badge = document.createElement('span');
                badge.style.marginLeft = '0.4rem';
                const labelEl = itemEl.querySelector('.cl-item-label');
                labelEl.insertBefore(badge, labelEl.querySelector('.cl-item-pourquoi'));
            }
            badge.className = 'deadline-badge ' + urgence.classe;
            badge.textContent = urgence.label;
        } else if (badge) {
            badge.remove();
        }
    }
    sauvegarderEvenement();
    mettreAJourDeadlines();
}

function changerEtat(id, select) {
    const etat = select.value;
    select.setAttribute('data-etat', etat);
    if (!evenement.checklist[id]) evenement.checklist[id] = {};
    evenement.checklist[id].etat = etat;
    const textarea = document.getElementById('notes-' + id);
    if (textarea && ['non','prevu','commande'].includes(etat)) textarea.classList.add('visible');
    sauvegarderEvenement();
    mettreAJourProgression();
    mettreAJourDeadlines();
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
    ['lieu','etage','date','contact','referent','cheminementLibre','cortegeNote'].forEach(c => {
        const el = document.getElementById('champ-' + c);
        if (el && evenement[c]) el.value = evenement[c];
    });
}

function chargerReperage() {
    const r = evenement.reperage || {};
    const el = id => document.getElementById(id);
    if (el('reperage-fait'))       el('reperage-fait').checked = !!r.fait;
    if (el('reperage-date') && r.date)  el('reperage-date').value = r.date;
    if (el('reperage-par') && r.par)    el('reperage-par').value = r.par;
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
    if (btn) { btn.classList.toggle('fait', evenement.reperage[type]); btn.setAttribute('aria-pressed', String(evenement.reperage[type])); }
    sauvegarderEvenement();
}

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
               placeholder="Ex : Places réservées en première rangée pour les personnes en fauteuil"
               aria-label="Aménagement personnalisé"
               onchange="sauvegarderAmenagements()">
        <button class="btn-suppr-amenagement" onclick="supprimerAmenagement('conteneur-${id}')" aria-label="Supprimer cet aménagement">&times;</button>
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

function toggleSection(btn) {
    btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
}

function mettreAJourProgression() {
    const sections = sectionsActives(evenement.type);
    let total = 0, confirmes = 0;
    Object.values(CHECKLIST).forEach(items => {
        items.filter(item => itemVisible(item, sections)).forEach(item => {
            const etat = (evenement.checklist[item.id] || {}).etat;
            if (etat && etat !== 'na') { total++; if (etat === 'confirme') confirmes++; }
        });
    });
    const pct = total > 0 ? Math.round((confirmes / total) * 100) : 0;
    const barre = document.getElementById('prog-barre-inner');
    const barreAttr = document.getElementById('prog-barre');
    const texte = document.getElementById('prog-texte');
    if (barre) barre.style.width = pct + '%';
    if (barreAttr) barreAttr.setAttribute('aria-valuenow', pct);
    if (texte) texte.textContent = confirmes + ' point' + (confirmes > 1 ? 's' : '') + ' confirmé' + (confirmes > 1 ? 's' : '');
}

function initialiserOnglets() {
    const btns = document.querySelectorAll('.onglet-btn');
    btns.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.setAttribute('aria-selected','false'));
            document.querySelectorAll('.onglet-panneau').forEach(p => p.classList.remove('actif'));
            btn.setAttribute('aria-selected','true');
            const panneau = document.getElementById(btn.getAttribute('aria-controls'));
            if (panneau) panneau.classList.add('actif');
            if (btn.id === 'onglet-deadlines') mettreAJourDeadlines();
        });
        btn.addEventListener('keydown', e => {
            let ni;
            if (e.key === 'ArrowRight') { e.preventDefault(); ni = (idx+1) % btns.length; btns[ni].click(); btns[ni].focus(); }
            if (e.key === 'ArrowLeft')  { e.preventDefault(); ni = (idx-1+btns.length) % btns.length; btns[ni].click(); btns[ni].focus(); }
        });
    });
}

function genererAnnonce() {
    const sections = sectionsActives(evenement.type);
    let t = 'RÉCAP ACCESSIBILITÉ\n' + '='.repeat(40) + '\n\n';
    if (evenement.titre) t += 'Événement : ' + evenement.titre + '\n';
    if (evenement.date)  t += 'Date : ' + new Date(evenement.date).toLocaleDateString('fr-FR', {day:'2-digit',month:'long',year:'numeric'}) + '\n';
    if (evenement.lieu)  t += 'Lieu : ' + evenement.lieu + '\n';
    if (evenement.etage) t += 'Niveau : ' + evenement.etage + '\n';
    t += '\n';

    const cats = [
        { key: 'inclusion',     label: 'INCLUSION ET PARTICIPATION' },
        { key: 'lieu',          label: 'ACCESSIBILITÉ DU LIEU' },
        { key: 'cheminement',   label: 'CHEMINEMENT ET ACCÈS' },
        { key: 'sensoriel',     label: 'ENVIRONNEMENT SENSORIEL' },
        { key: 'communication', label: 'COMMUNICATION' },
        { key: 'sante',         label: 'SANTÉ ET HYGIÈNE' },
        { key: 'alimentation',  label: 'ALIMENTATION' },
        { key: 'manif',         label: 'ORGANISATION DU CORTÈGE' },
    ];

    cats.forEach(({ key, label }) => {
        const items = (CHECKLIST[key] || []).filter(item => itemVisible(item, sections));
        const confirmes = items.filter(item => (evenement.checklist[item.id] || {}).etat === 'confirme');
        const prevus    = items.filter(item => ['prevu','commande'].includes((evenement.checklist[item.id] || {}).etat));
        if (!confirmes.length && !prevus.length) return;
        t += label + '\n' + '-'.repeat(label.length) + '\n';
        confirmes.forEach(item => { t += '  [OK] ' + item.label + '\n'; });
        prevus.forEach(item => { t += '  [En cours] ' + item.label + '\n'; });
        t += '\n';
    });

    if (evenement.amenagements_custom && evenement.amenagements_custom.length > 0) {
        t += 'AMÉNAGEMENTS SPÉCIFIQUES\n' + '-'.repeat(24) + '\n';
        evenement.amenagements_custom.forEach(am => { t += '  - ' + am + '\n'; });
        t += '\n';
    }

    if (evenement.contact)  t += 'Contact accessibilité : ' + evenement.contact + '\n';
    if (evenement.referent) t += 'Personne référente le jour J : ' + evenement.referent + '\n';
    t += '\n---\nRien sur nous sans nous\n';

    evenement.annonce = t;
    sauvegarderEvenement();

    document.getElementById('annonce-rendu').textContent = t;
    document.getElementById('btn-copier').disabled = false;
    document.getElementById('btn-telecharger').disabled = false;
}

function copierAnnonce() {
    navigator.clipboard.writeText(document.getElementById('annonce-rendu').textContent).then(() => {
        const btn = document.getElementById('btn-copier');
        const orig = btn.textContent;
        btn.textContent = 'Copié !';
        setTimeout(() => { btn.textContent = orig; }, 2000);
    });
}

function telechargerAnnonce() {
    const t = document.getElementById('annonce-rendu').textContent;
    const blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recap-accessibilite-' + (evenement.titre || 'evenement').replace(/[^a-z0-9]/gi,'-').toLowerCase() + '.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function sauvegarderEvenement() { Storage.sauvegarderEvenement(emailOrga, evenement); }

function labelType(type, typeAutre) {
    const labels = { tractage:'Tractage / collage', petit:'Petit événement', reunion_publique:'Réunion publique / AG', conference:'Conférence / journée d’étude', manif:'Manifestation / cortège', grand:'Grand événement', autre: typeAutre || 'Autre' };
    return labels[type] || type;
}

function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
