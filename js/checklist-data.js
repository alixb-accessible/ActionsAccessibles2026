/* ============================================================
   CHECKLIST-DATA.JS
   ============================================================ */
const CHECKLIST = {

    inclusion: [
        { id: 'incl_reunions_concernees', label: 'Des personnes concernées (handicapées) ont été invitées à participer à la préparation de l\'événement', pourquoi: 'Rien sur nous sans nous. Les concernéEs sont les expertes de leur propre expérience.', sections: ['tous'] },
        { id: 'incl_besoins_collectes', label: 'Un canal a été ouvert pour recueillir les besoins des participant·es avant l\'événement', pourquoi: 'Permettre aux gens de signaler leurs besoins en amont permet de s\'y préparer.', sections: ['tous'] },
        { id: 'incl_benevoles_formes', label: 'Les bénévoles d\'accompagnement ont été formé·es (gestes, communication, respect de l\'autonomie)', pourquoi: 'Un accompagnement mal calibré peut être aussi excluant que l\'absence d\'accompagnement.', sections: ['tous'] },
        { id: 'incl_referente_identifiee', label: 'Une personne référente accessibilité a été identifiée et sera joignable le jour J', pourquoi: 'Les participant·es doivent pouvoir s\'adresser à quelqu\'un de précis en cas de besoin.', sections: ['tous'] },
        { id: 'incl_programme_partage', label: 'Le programme complet (horaires, lieux, contenu) a été partagé en avance avec les participant·es qui en ont besoin', pourquoi: 'Essentiel pour les personnes neurodivergentes et celles qui ont besoin d\'anticiper.', sections: ['tous'] },
        { id: 'incl_changements_signales', label: 'Un protocole existe pour prévenir rapidement en cas de changement de dernière minute', pourquoi: 'Un changement inattendu peut empêcher certaines personnes de participer ou déclencher une grande anxiété.', sections: ['tous'] },
    ],

    lieu: [
        { id: 'lieu_acces_plain_pied', label: 'Accès de plain-pied ou rampe d\'accès fonctionnelle', pourquoi: 'Indispensable pour les fauteuils, déambulateurs et toutes les aides à la mobilité.', sections: ['lieu'] },
        { id: 'lieu_ascenseur', label: 'Ascenseur disponible si l\'espace est sur plusieurs niveaux (et en état de fonctionnement)', pourquoi: 'Un ascenseur en panne le jour J est aussi problématique que l\'absence d\'ascenseur. Vérifier la veille.', sections: ['lieu'] },
        { id: 'lieu_toilettes_ufr', label: 'Toilettes adaptées aux UFR (cabine spacieuse, barre d\'appui, hauteur adaptée)', pourquoi: 'L\'absence de toilettes adaptées est une raison valable de ne pas venir. On dit UFR et non PMR, terme réducteur.', sections: ['lieu'] },
        { id: 'lieu_chaises', label: 'Chaises et assises disponibles en nombre suffisant, accessibles sans effort', pourquoi: 'Pour les personnes qui ne peuvent pas rester debout longtemps.', sections: ['non_tractage'] },
        { id: 'lieu_espace_circulation', label: 'Espace suffisant pour circuler en fauteuil (90 cm minimum entre les obstacles)', pourquoi: 'En dessous de 80 cm, le passage devient impossible pour beaucoup de fauteuils.', sections: ['lieu'] },
        { id: 'lieu_portes', label: 'Portes légères ou avec système d\'ouverture automatique', pourquoi: 'Les portes lourdes sont un obstacle majeur pour les personnes en fauteuil ou avec peu de force dans les bras.', sections: ['lieu'] },
        { id: 'lieu_accueil_entree', label: 'L\'accueil des participant·es est situé à proximité immédiate de l\'entrée principale', pourquoi: 'Chercher l\'accueil après une longue marche est épuisant et désorientant.', sections: ['lieu'] },
        { id: 'lieu_flechage', label: 'Fléchage clair depuis l\'entrée : grands caractères, bon contraste, pictogrammes', pourquoi: 'Pour les personnes malvoyantes, cognitives ou anxieuses, s\'orienter sans signalétique est très difficile.', sections: ['lieu'] },
        { id: 'lieu_recharge', label: 'Des prises électriques accessibles sont disponibles pour recharger fauteuils électriques et autres appareillages', pourquoi: 'Pour les fauteuils électriques, implants cochléaires et autres appareils : une batterie à plat peut forcer quelqu\'un à partir prématurément.', sections: ['lieu'] },
        { id: 'lieu_parking', label: 'Stationnement accessible à proximité immédiate (places GIC/GIG signalées)', pourquoi: 'Un parking trop éloigné peut être rédhibitoire pour certaines personnes.', sections: ['lieu'] },
        { id: 'lieu_vestiaire', label: 'Vestiaire accessible (si vestiaire il y a)', pourquoi: 'Le vestiaire doit être accessible sans marches ni portes lourdes.', sections: ['grand'] },
        { id: 'lieu_caillebotis', label: 'Caillebotis posés sur les axes de circulation en extérieur (pelouse, terre)', pourquoi: 'Sur une pelouse ou de la terre, un fauteuil s\'enfonce immédiatement.', sections: ['grand'] },
        { id: 'lieu_logements', label: 'Des logements accessibles sont disponibles en nombre suffisant à proximité', pourquoi: 'Pour les événements de plusieurs jours : vérifier que les hébergements proposés ont des chambres réellement accessibles.', sections: ['grand'] },
        { id: 'lieu_navettes', label: 'Des navettes accessibles (fauteuils) sont prévues entre les logements et le lieu', pourquoi: 'Un transport inaccessible entre le logement et le lieu annule tous les efforts d\'accessibilité sur place.', sections: ['grand'] },
        { id: 'lieu_chiens', label: 'Chiens guides et chiens d\'assistance acceptés dans tous les espaces', pourquoi: 'Un chien d\'assistance est un appareillage médical, pas un animal de compagnie. Leur refus est illégal.', sections: ['tous'] },
        { id: 'lieu_accompagnants', label: 'Gratuité ou tarif réduit pour les accompagnant·es (professionnel·les ou bénévoles)', pourquoi: 'Faire payer l\'accompagnant·e revient à faire payer deux fois la personne handicapée.', sections: ['non_tractage'] },
    ],

    cheminement: [
        { id: 'chem_sol_type', label: 'Nature du sol renseignée (bitume, pavés, terre, herbe, mixte…)', pourquoi: 'Pavés ou gravier : souvent infranchissable en fauteuil. Bitume dégradé : dangereux.', sections: ['tous'] },
        { id: 'chem_sol_etat', label: 'État du sol vérifié (fissures, trous, revêtement instable)', pourquoi: 'Un sol dégradé est un risque de chute et peut bloquer un fauteuil.', sections: ['tous'] },
        { id: 'chem_largeur', label: 'Largeur du passage libre vérifiée (90 cm minimum recommandé)', pourquoi: 'En dessous de 80 cm, le passage est impossible pour de nombreux fauteuils.', sections: ['tous'] },
        { id: 'chem_pente', label: 'Pente du parcours vérifiée et indiquée', pourquoi: 'Une pente forte est difficile voire dangereuse en fauteuil, surtout électrique.', sections: ['tous'] },
        { id: 'chem_marches', label: 'Marches et obstacles ponctuels identifiés et décrits', pourquoi: 'Même une seule marche peut bloquer un fauteuil ou un déambulateur.', sections: ['tous'] },
        { id: 'chem_trottoirs', label: 'Trottoirs en bon état, bords abaissés aux traversées', pourquoi: 'Un bord de trottoir non abaissé oblige à un détour parfois long.', sections: ['tous'] },
        { id: 'chem_eclairage', label: 'Éclairage suffisant sur le parcours (soir ou lieu sombre)', pourquoi: 'Pour les personnes malvoyantes et pour la sécurité de toutes.', sections: ['tous'] },
        { id: 'chem_tc', label: 'Arrêts de transports en commun accessibles à proximité (lignes, distance)', pourquoi: 'Indiquer précisément la ligne et la distance depuis l\'arrêt aide à planifier le trajet.', sections: ['tous'] },
    ],

    sensoriel: [
        { id: 'sens_luminosite', label: 'Luminosité du lieu vérifiée et indiquée (néons, lumière naturelle, réglable)', pourquoi: 'Les néons clignotants peuvent déclencher des crises pour les personnes épileptiques.', sections: ['non_tractage'] },
        { id: 'sens_volume', label: 'Niveau sonore prévisible indiqué (calme, modéré, très bruyant)', pourquoi: 'Pour les personnes hyperacousiques, un environnement très bruyant peut être physiquement douloureux.', sections: ['tous'] },
        { id: 'sens_espace_calme', label: 'Un espace calme est disponible (salle de repos, zone de décompression)', pourquoi: 'Permet aux personnes neurodivergentes ou anxieuses de se ressourcer sans quitter l\'événement.', sections: ['non_tractage'] },
        { id: 'sens_stroboscopes', label: 'Stroboscopes et lumières clignotantes : présence signalée clairement dans l\'annonce', pourquoi: 'Pour les personnes épileptiques photosensibles, c\'est une information vitale.', sections: ['non_tractage'] },
        { id: 'sens_boucles', label: 'Boucles magnétiques disponibles (pour les personnes appareillées)', pourquoi: 'Permettent aux personnes avec prothèses auditives (programme T) d\'entendre clairement la sono.', sections: ['non_tractage'] },
        { id: 'sens_casques', label: 'Casques anti-bruit disponibles à prêter', pourquoi: 'Pour les personnes autistes, hyperacousiques ou anxieuses : réduit la surcharge sensorielle.', sections: ['non_tractage'] },
        { id: 'sens_parfums', label: 'Demande faite aux participant·es d\'éviter les parfums et produits chimiques forts', pourquoi: 'Pour les personnes chimico-sensibles, un parfum fort peut déclencher une crise.', sections: ['tous'] },
        { id: 'sens_produits_entretien', label: 'Produits d\'entretien sans parfums chimiques forts utilisés dans le lieu', pourquoi: 'Les produits ménagers parfumés peuvent rendre un lieu inaccessible pour les personnes chimico-sensibles.', sections: ['lieu'] },
    ],

    communication: [
        { id: 'com_lsf', label: 'Interprétation LSF prévue', pourquoi: 'La LSF est une langue à part entière. Ne pas la prévoir exclut une partie de la communauté sourde.', sections: ['non_tractage'] },
        { id: 'com_velotypie', label: 'Vélotypie (transcription écrite en direct) prévue', pourquoi: 'Pour les personnes sourdes qui ne signent pas, ou malentendantes.', sections: ['non_tractage'] },
        { id: 'com_soustitres', label: 'Sous-titres pour toutes les vidéos diffusées', pourquoi: 'Indispensable pour les personnes sourdes et malentendantes.', sections: ['non_tractage'] },
        { id: 'com_micro', label: 'Microphone disponible pour toutes les prises de parole', pourquoi: 'Sans micro, une voix faible ou lointaine est inaudible pour beaucoup.', sections: ['non_tractage'] },
        { id: 'com_falc', label: 'Documents clés disponibles en FALC (Facile à Lire et à Comprendre)', pourquoi: 'Pour les personnes ayant des difficultés de lecture ou de compréhension.', sections: ['non_tractage'] },
        { id: 'com_braille', label: 'Version braille des documents disponible sur demande', pourquoi: 'Pour les personnes aveugles qui lisent en braille.', sections: ['grand'] },
        { id: 'com_audiodesc', label: 'Audiodescription disponible pour les supports visuels', pourquoi: 'Pour les personnes aveugles ou malvoyantes.', sections: ['non_tractage'] },
        { id: 'com_masques_transp', label: 'Masques transparents disponibles pour les bénévoles et intervenant·es', pourquoi: 'Pour les personnes sourdes ou malentendantes qui lisent sur les lèvres.', sections: ['tous'] },
        { id: 'com_pictogrammes', label: 'Pictogrammes de signalétique dans le lieu (toilettes, sorties, accueil…)', pourquoi: 'Pour les personnes ne lisant pas bien le français, ou à déficience cognitive.', sections: ['lieu'] },
    ],

    sante: [
        { id: 'sante_masques_recommandes', label: 'Port du masque fortement recommandé, notamment à moins d\'un mètre (personnes immunodéprimées)', pourquoi: 'Beaucoup de personnes handicapées sont immunodéprimées. Formuler comme \"fortement recommandé\" envoie un signal clair.', sections: ['tous'] },
        { id: 'sante_masques_fournis', label: 'Masques fournis sur place pour celles et ceux qui n\'en ont pas', pourquoi: 'Lever la barrière pour celles et ceux qui auraient oublié ou qui n\'en ont pas.', sections: ['tous'] },
        { id: 'sante_aeration', label: 'Aération régulière du lieu assurée (fenêtres ouvertes, ventilation)', pourquoi: 'Réduit le risque de transmission des virus respiratoires.', sections: ['lieu'] },
        { id: 'sante_fumeurs', label: 'Espace fumeurs strictement séparé du groupe principal', pourquoi: 'La fumée de tabac est très problématique pour les personnes asthmatiques et chimico-sensibles.', sections: ['tous'] },
        { id: 'sante_protocrise', label: 'Protocole en cas de crise (malaise, crise d\'angoisse, meltdown) : qui appeler, où aller', pourquoi: 'Savoir quoi faire en cas de crise permet d\'agir rapidement et sans paniquer.', sections: ['tous'] },
        { id: 'sante_trigger', label: 'Avertissement de contenu sensible (trigger warning) prévu si nécessaire', pourquoi: 'Permet aux personnes concernées de se préparer ou de décider de ne pas assister à une partie.', sections: ['non_tractage'] },
    ],

    alimentation: [
        { id: 'alim_allergenes', label: 'Composition des aliments et allergènes indiqués clairement', pourquoi: 'Pour les personnes allergiques, une allergie alimentaire peut être mortelle.', sections: ['non_tractage'] },
        { id: 'alim_pailles', label: 'Pailles disponibles', pourquoi: 'Pour les personnes ayant des difficultés motrices à porter un verre.', sections: ['non_tractage'] },
    ],

    manif: [
        { id: 'manif_parcours_verifie', label: 'Le parcours complet a été vérifié à pied (sol, largeur, obstacles, pente)', pourquoi: 'Un parcours non vérifié peut réserver de mauvaises surprises le jour J.', sections: ['manif'] },
        { id: 'manif_depart_accessible', label: 'Le point de départ est accessible (trottoir abaissé, sol praticable, espace suffisant)', pourquoi: 'Si le point de départ est inaccessible, les personnes en fauteuil ne peuvent pas rejoindre le cortège.', sections: ['manif'] },
        { id: 'manif_cohorte', label: 'Une cohorte de bénévoles formé·es est dédiée à l\'accompagnement accessibilité dans le cortège', pourquoi: 'Accompagner sans avoir été formé·e peut être intrusif ou maladroit.', sections: ['manif'] },
        { id: 'manif_pauses', label: 'Des pauses régulières sont prévues à des points identifiés (fréquence et lieux définis)', pourquoi: 'Pour les personnes fatiguées rapidement, les pauses permettent de tenir sur la durée.', sections: ['manif'] },
        { id: 'manif_points_sortie', label: 'Des points de sortie du cortège sont identifiés sur le parcours', pourquoi: 'Permettre de quitter le cortège à tout moment sans être bloqué.', sections: ['manif'] },
        { id: 'manif_rythme', label: 'Un rythme lent est maintenu (adapté aux fauteuils et personnes à mobilité réduite)', pourquoi: 'Un cortège rapide laisse rapidement les personnes à mobilité réduite derrière.', sections: ['manif'] },
        { id: 'manif_sono', label: 'La sono / le mégaphone est positionné·e de façon à être audible depuis l\'ensemble du cortège', pourquoi: 'Y compris depuis la partie arrière où se situent souvent les personnes les plus lentes.', sections: ['manif'] },
        { id: 'manif_lsf_visible', label: 'L\'interprète LSF est positionné·e de façon visible depuis le cortège', pourquoi: 'Si l\'interprète n\'est pas visible, l\'interprétation ne sert à rien.', sections: ['manif'] },
        { id: 'manif_zone_calme', label: 'Une zone ou position calme est prévue dans ou en marge du cortège pour les personnes hypersensibles', pourquoi: 'Note : il vaut mieux intégrer cette zone au cortège que créer un groupe séparé, pour éviter l\'exclusion.', sections: ['manif'] },
    ],
};

const ETATS_LABELS = {
    'non':      'Non prévu',
    'prevu':    'Prévu',
    'commande': 'Commandé / en cours',
    'confirme': 'Confirmé',
    'na':       null,
    '':         null,
};
