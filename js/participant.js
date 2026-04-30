/* ============================================================
   PARTICIPANT.JS
   ============================================================ */

let compteurCustom = 0;

function ajouterBesoinCustom(valeurInitiale) {
    compteurCustom++;
    const id = 'custom-' + compteurCustom;
    const valeur = (typeof valeurInitiale === 'string') ? valeurInitiale : '';
    const div = document.createElement('div');
    div.className = 'besoin-custom-item';
    div.id = 'conteneur-' + id;
    div.innerHTML = `
        <input type="text" id="${id}" name="besoin_custom" value="${valeur}"
               placeholder="Ex : Besoin d'un espace de repos privé"
               aria-label="Besoin specifique supplementaire">
        <button type="button" class="btn-suppr-besoin"
                onclick="document.getElementById('conteneur-${id}').remove()"
                aria-label="Supprimer ce besoin">
            &times;
        </button>
    `;
    document.getElementById('liste-besoins-custom').appendChild(div);
    document.getElementById(id).focus();
}

function telechargerBesoins() {
    const fd = new FormData(document.getElementById('form-besoins'));
    const nom = (fd.get('nom') || '').trim() || 'Anonyme';
    const date = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });

    let t = '';
    t += '===========================================\n';
    t += '  BESOINS D\'ACCESSIBILITÉ\n';
    t += '===========================================\n\n';
    t += 'Nom / pseudo  : ' + nom + '\n';
    t += 'Document du   : ' + date + '\n\n';
    t += '-------------------------------------------\n\n';

    const sections = [
        { label: 'MOBILITÉ',                          key: 'mobilite'       },
        { label: 'APPAREILLAGES ET AIDES TECHNIQUES', key: 'appareillage'   },
        { label: 'SENSORIEL',                         key: 'sensoriel'      },
        { label: 'COGNITIF ET NEURODIVERGENCE',       key: 'cognitif'       },
        { label: 'SANTÉ ET HYGIÈNE',                  key: 'sante'          },
        { label: 'ACCOMPAGNEMENT',                    key: 'accompagnement' },
        { label: 'ALIMENTATION',                      key: 'alimentation'   },
    ];

    sections.forEach(({ label, key }) => {
        const vals = fd.getAll(key);
        t += label + '\n';
        if (vals.length > 0) {
            vals.forEach(v => { t += '  [x] ' + v + '\n'; });
        } else {
            t += '  Aucun besoin signalé\n';
        }
        t += '\n';
    });

    // Besoins personnalises
    const customs = Array.from(document.querySelectorAll('#liste-besoins-custom input[type="text"]'))
        .map(i => i.value.trim()).filter(Boolean);
    if (customs.length > 0) {
        t += 'BESOINS SPÉCIFIQUES SUPPLÉMENTAIRES\n';
        customs.forEach(v => { t += '  [x] ' + v + '\n'; });
        t += '\n';
    }

    const allergies = (fd.get('allergies') || '').trim();
    if (allergies) {
        t += 'ALLERGIES / INTOLÉRANCES\n';
        t += '  ' + allergies + '\n\n';
    }

    const autres = (fd.get('autres') || '').trim();
    if (autres) {
        t += 'AUTRES BESOINS / PRÉCISIONS\n';
        t += '  ' + autres + '\n\n';
    }

    t += '-------------------------------------------\n';
    t += 'Généré via Actions Accessibles\n';
    t += 'Rien sur nous sans nous\n';

    const blob = new Blob([t], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'besoins-accessibilite.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
