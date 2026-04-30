/* ============================================================
   ORGA-ACCUEIL.JS
   ============================================================ */

let emailOrga = null;
let donneesOrga = null;

function connexion() {
    const input = document.getElementById('orga-email');
    const email = (input.value || '').trim();
    if (!email || !email.includes('@')) {
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        alert('Veuillez entrer un email valide.');
        return;
    }
    input.removeAttribute('aria-invalid');
    emailOrga   = email;
    donneesOrga = Storage.charger(email);
    document.getElementById('section-connexion').classList.add('masque');
    document.getElementById('section-espace').classList.remove('masque');
    document.getElementById('orga-email-affiche').textContent = 'Connecté·e en tant que : ' + email;
    afficherEvenements();
}

function deconnexion() {
    emailOrga = null; donneesOrga = null;
    document.getElementById('orga-email').value = '';
    document.getElementById('section-espace').classList.add('masque');
    document.getElementById('section-connexion').classList.remove('masque');
    document.getElementById('orga-email').focus();
}

function afficherEvenements() {
    const liste = document.getElementById('liste-evenements');
    const evts  = donneesOrga.evenements || [];
    if (evts.length === 0) {
        liste.innerHTML = `<div class="liste-vide">
            <p class="liste-vide-titre">Aucun événement pour l'instant.</p>
            <p>Créez votre premier événement pour commencer à vérifier son accessibilite.</p>
            <button class="btn btn-vert" onclick="afficherModalNouvel()" style="margin-top:1rem">Créer un événement</button>
        </div>`;
        return;
    }
    const tries = [...evts].sort((a, b) => new Date(b.modifie) - new Date(a.modifie));
    liste.innerHTML = tries.map(evt => {
        const prog    = calculerProgression(evt);
        const modifie = new Date(evt.modifie).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
        const typeLabel = labelType(evt.type, evt.typeAutre);
        return `<div class="evenement-carte" role="article" aria-label="${escHtml(evt.titre)}">
            <div class="evenement-info">
                <h2 class="evenement-titre">${escHtml(evt.titre)}</h2>
                <div class="evenement-meta">
                    <span>${typeLabel}</span>
                    ${evt.lieu ? '<span>' + escHtml(evt.lieu) + '</span>' : ''}
                    <span>Modifié le ${modifie}</span>
                </div>
                <div class="evenement-progression" aria-label="Progression : ${prog.pct}%">
                    <div class="barre-progression" role="progressbar"
                         aria-valuenow="${prog.pct}" aria-valuemin="0" aria-valuemax="100"
                         aria-label="Accessibilite verifiee a ${prog.pct}%">
                        <div class="barre-inner" style="width:${prog.pct}%"></div>
                    </div>
                    <span class="progression-label">${prog.confirmes} / ${prog.total} points confirmés</span>
                </div>
            </div>
            <div class="evenement-actions">
                <a href="checklist.html?id=${evt.id}&email=${encodeURIComponent(emailOrga)}" class="btn btn-principal btn-petit">Ouvrir</a>
                <button class="btn btn-contour btn-petit" onclick="supprimerEvenement('${evt.id}')" aria-label="Supprimer ${escHtml(evt.titre)}">Supprimer</button>
            </div>
        </div>`;
    }).join('');
}

function calculerProgression(evt) {
    const vals = Object.values(evt.checklist || {});
    const total     = vals.length;
    const confirmes = vals.filter(v => v && v.etat === 'confirme').length;
    const pct       = total > 0 ? Math.round((confirmes / total) * 100) : 0;
    return { total, confirmes, pct };
}

function labelType(type, typeAutre) {
    const labels = { tractage:'Tractage / collage', petit:'Petit evenement', reunion_publique:'Reunion publique / AG', conference:'Conference / journee d\'etude', manif:'Manifestation / cortege', grand:'Grand evenement', autre: typeAutre || 'Autre' };
    return labels[type] || type;
}

function supprimerEvenement(id) {
    const evt = Storage.getEvenement(donneesOrga, id);
    if (!evt) return;
    if (!confirm('Supprimer définitivement "' + evt.titre + '" ? Cette action est irréversible.')) return;
    Storage.supprimerEvenement(emailOrga, id);
    donneesOrga = Storage.charger(emailOrga);
    afficherEvenements();
}

let focusAvantModal = null;

function afficherModalNouvel() {
    focusAvantModal = document.activeElement;
    const modal = document.getElementById('modal-nouvel');
    modal.classList.remove('masque');
    document.getElementById('nouvel-titre').focus();
    document.addEventListener('keydown', trapFocus);
}

function fermerModal() {
    document.getElementById('modal-nouvel').classList.add('masque');
    document.removeEventListener('keydown', trapFocus);
    if (focusAvantModal) focusAvantModal.focus();
}

function trapFocus(e) {
    if (e.key === 'Escape') { fermerModal(); return; }
    if (e.key !== 'Tab') return;
    const modal = document.getElementById('modal-nouvel');
    const focusables = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const premier = focusables[0];
    const dernier = focusables[focusables.length - 1];
    if (e.shiftKey) { if (document.activeElement === premier) { e.preventDefault(); dernier.focus(); } }
    else            { if (document.activeElement === dernier)  { e.preventDefault(); premier.focus(); } }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nouvel-type').addEventListener('change', function() {
        document.getElementById('nouvel-type-autre-groupe').classList.toggle('masque', this.value !== 'autre');
    });
    document.getElementById('orga-email').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') connexion();
    });
    // Reprise auto si email dans l'URL
    const params = new URLSearchParams(window.location.search);
    const emailUrl = params.get('email');
    if (emailUrl) {
        document.getElementById('orga-email').value = emailUrl;
        connexion();
    }
});

function creerEvenement() {
    const titre     = document.getElementById('nouvel-titre').value.trim();
    const type      = document.getElementById('nouvel-type').value;
    const typeAutre = document.getElementById('nouvel-type-autre').value.trim();
    if (!titre) { document.getElementById('nouvel-titre').focus(); alert('Veuillez indiquer un nom pour l\'evenement.'); return; }
    if (!type)  { document.getElementById('nouvel-type').focus();  alert('Veuillez selectionner un type d\'action.'); return; }
    const evt = Storage.nouvelEvenement(titre, type);
    if (typeAutre) evt.typeAutre = typeAutre;
    Storage.sauvegarderEvenement(emailOrga, evt);
    donneesOrga = Storage.charger(emailOrga);
    fermerModal();
    window.location.href = 'checklist.html?id=' + evt.id + '&email=' + encodeURIComponent(emailOrga);
}

function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
