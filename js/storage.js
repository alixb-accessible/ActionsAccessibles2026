/* ============================================================
   STORAGE.JS
   ============================================================ */
const Storage = (() => {
    function _cle(email) {
        return 'aa_orga_' + email.trim().toLowerCase().replace(/[^a-z0-9@._-]/g, '_');
    }
    function charger(email) {
        try {
            const raw = localStorage.getItem(_cle(email));
            return raw ? JSON.parse(raw) : { email: email, evenements: [] };
        } catch(e) { return { email: email, evenements: [] }; }
    }
    function sauvegarder(email, data) {
        try {
            data.modifie = new Date().toISOString();
            localStorage.setItem(_cle(email), JSON.stringify(data));
            return true;
        } catch(e) { console.error('Erreur de sauvegarde :', e); return false; }
    }
    function nouvelEvenement(titre, type) {
        return {
            id: 'evt_' + Date.now(), titre, type,
            cree: new Date().toISOString(), modifie: new Date().toISOString(),
            lieu: '', adresse: '', etage: '', date: '', contact: '', referent: '',
            reperage: { fait: false, date: '', par: '', photos: false, video: false, notes: '' },
            checklist: {}, amenagements_custom: [], annonce: ''
        };
    }
    function getEvenement(data, id) { return data.evenements.find(e => e.id === id) || null; }
    function sauvegarderEvenement(email, evt) {
        const data = charger(email);
        const idx  = data.evenements.findIndex(e => e.id === evt.id);
        evt.modifie = new Date().toISOString();
        if (idx >= 0) { data.evenements[idx] = evt; } else { data.evenements.push(evt); }
        sauvegarder(email, data);
    }
    function supprimerEvenement(email, id) {
        const data = charger(email);
        data.evenements = data.evenements.filter(e => e.id !== id);
        sauvegarder(email, data);
    }
    return { charger, sauvegarder, nouvelEvenement, getEvenement, sauvegarderEvenement, supprimerEvenement };
})();
