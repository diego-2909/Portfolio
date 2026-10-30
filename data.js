// Contenu du site, en français et en anglais.
// Pour ajouter un projet ou corriger un texte, c'est ici : la mise en page (app.js) n'a pas à changer.
// getContent(lang) renvoie { t, projects } pour la langue demandée ('fr' ou 'en').

function getContent(lang) {
    var GH = {
      diego: 'https://github.com/diego-2909',
      klervi: 'https://github.com/KlerviLMTR',
      etienne: 'https://github.com/etienne-coyac',
      thomas: 'https://github.com/ThomasPirovanoUT1',
      marion: 'https://github.com/marion-sereni',
      esther: 'https://github.com/EstherLYU'
    };

    var T = {
      fr: {
        code: 'fr', navLabel: 'Navigation principale', langLabel: 'Langue', techLabel: 'Technologies', timelineLabel: 'Projets, du plus récent au plus ancien',
        nav: { projects: 'Projets', experience: 'Expérience', skills: 'Compétences', education: 'Formation', contact: 'Contact' },
        hero: {
          role: 'Développeur full-stack · Toulouse',
          intro: "Trois ans chez Airbus et Andil à concevoir des outils web, du recueil des besoins jusqu'à la mise en production.",
          basedLabel: 'Basé à', degreeLabel: 'Diplôme', degree: 'Master MIAGE', linksLabel: 'Liens', cv: 'CV (PDF)',
          photoAlt: 'Portrait de Diego Cortes'
        },
        about: {
          title: 'À propos',
          lead: "J'aime écrire du code, mais j'aime surtout comprendre le problème qu'il doit résoudre.",
          paras: [
            "J'ai commencé par une licence d'informatique à Paul Sabatier, puis l'alternance m'a fait passer de la théorie aux vrais utilisateurs. D'abord chez Andil, sur des plugins Moodle utilisés par des clients au quotidien. Ensuite chez Airbus Operations, pendant deux ans.",
            "Chez Airbus, on m'a confié un sujet sensible : garantir que seules les bonnes personnes accèdent aux Shared Drives de l'entreprise. J'ai mené ce projet en Product Owner technique. J'ai animé les échanges avec les équipes Data Governance et Security, conçu les maquettes, développé l'application en React et TypeScript, rédigé la documentation et accompagné la mise en production.",
            "Cette expérience a fixé ce que je cherche : un poste où l'on code sérieusement, au contact direct du métier. Le Master MIAGE m'a donné les méthodes pour ça : analyse des processus, BPMN, Agile. L'aéronautique m'attire tout particulièrement. L'exigence de qualité y est réelle, et j'y ai déjà mes repères."
          ],
          points: [
            { title: 'Métier et technique', text: "De l'atelier de recueil des besoins à la revue de code." },
            { title: 'Autonomie', text: 'Un projet Airbus mené de bout en bout.' },
            { title: "Travail d'équipe", text: 'La plupart de mes projets, construits à plusieurs.' },
            { title: 'En dehors du code', text: "La course à pied, à l'origine de RunMates." }
          ]
        },
        seek: {
          title: 'Ce que je cherche',
          lead: '',
          rows: [
            { label: 'Poste', value: 'Développeur full-stack, ou développeur et Product Owner' },
            { label: 'Contrat', value: 'CDI, disponible immédiatement' },
            { label: 'Lieu', value: 'Toulouse et alentours' },
            { label: 'Secteur', value: 'Aéronautique en priorité' }
          ]
        },
        p: { context: 'Contexte', result: 'Résultat', approach: "Comment on s'y est pris", open: 'Aperçu', close: 'Réduire', openAria: 'Voir l’aperçu du projet ', closeAria: 'Réduire le projet ' },
        now: {
          title: 'En ce moment', when: "Aujourd'hui",
          items: [
            { name: 'TicketFlow', text: 'Tickets de support en services. Spring Boot, React, PostgreSQL, Docker.' },
            { name: "Suivi d'investissement DCA", text: 'Tableau de bord personnel. Next.js, Prisma.' }
          ]
        },
        projectsDone: 'Projets réalisés', seeCase: 'Voir le projet ↓',
        jobs: [
          {
            dates: '2023 — 2025', place: 'Saint-Martin-du-Touch', company: 'Airbus Operations', logoUrl: 'assets/airbus.png', role: 'Développeur et responsable de projet, en alternance',
            bullets: [
              "Product Owner technique d'un projet de sécurité, du besoin à la production.",
              'Ateliers avec Data Governance et IT Security, PI Planning, backlog.'
            ],
            projects: [
              { name: 'Recertification des accès Google Drive', text: "Application web qui fait revalider les droits d'accès aux Shared Drives.", stack: 'React · TypeScript · Google APIs', projectId: 'airbus' },
              { name: 'Classification des fichiers Google Docs', text: 'Outil interne pour classer les documents selon leur niveau de sensibilité.', stack: 'Google Apps Script', projectId: 'airbus-gdocs' },
              { name: 'Classification des fichiers Windows', text: 'Le même principe, appliqué aux fichiers des postes Windows.', stack: '.NET · C#', projectId: 'airbus-windows' }
            ]
          },
          {
            dates: '2022 — 2023', place: 'Labège', company: 'Andil', logoUrl: 'assets/andil.png', role: 'Développeur full-stack, en alternance',
            bullets: [
              'Développement et maintenance sur la plateforme Moodle des clients.'
            ],
            projects: [
              { name: 'Plugins Moodle sur mesure', text: 'Développement, maintenance et amélioration de plugins pour les besoins des clients.', stack: 'PHP' },
              { name: 'Tableau de bord des plateformes', text: "Une vue centralisée pour suivre et gérer toutes les plateformes Moodle déployées.", stack: 'Laravel · HTML · CSS · JavaScript' }
            ]
          }
        ],
        skills: [
          { title: 'Front-end', items: ['React', 'Next.js', 'TypeScript', 'HTML, CSS', 'Capacitor'] },
          { title: 'Back-end', items: ['Java, Spring Boot', 'C#, .NET', 'Node.js', 'PHP, Laravel', 'API REST'] },
          { title: 'Données', items: ['PostgreSQL, PostGIS', 'SQL Server, MySQL, Oracle', 'BigQuery', 'Supabase, Prisma', 'Python, Pandas'] },
          { title: 'Écosystème Google', items: ['Apps Script', 'Workspace APIs', 'Drive, Shared Drives'] },
          { title: 'Projet et analyse', items: ['Agile, Scrum', 'PI Planning, backlog', 'Recueil des besoins', 'BPMN, UML', 'Jira'] },
          { title: 'Outils', items: ['Git', 'Docker', 'Linux, Bash', 'API Mistral, Gemini'] }
        ],
        eduMore: 'En savoir plus', eduLess: 'Réduire', eduSubjects: 'Enseignements', eduJobs: 'Débouchés visés',
        education: [
          { dates: '2023 — 2025', name: 'Master MIAGE, Ingénierie des Processus Métiers', school: 'Université Toulouse Capitole · en alternance chez Airbus',
            more: "Un master qui forme à accompagner une entreprise dans l'évolution de son système d'information : analyser, modéliser et digitaliser les processus métiers, sur des architectures web, orientées services ou cloud, en tenant compte de la conduite du changement.",
            subjects: ['Analyse des processus métier', 'Modélisation BPMN et UML', 'Recueil des besoins', 'Gestion de projet Agile, Scrum', 'Conception de systèmes d’information', 'Bases de données', 'Développement web', 'Amélioration continue'],
            jobs: 'Product Owner, consultant fonctionnel, chef de projet, ingénieur système d’information, développeur.' },
          { dates: '2022 — 2023', name: 'Licence professionnelle Métiers de l’informatique, parcours RTAI', school: 'Université Toulouse Capitole · en alternance chez Andil',
            more: "Une licence professionnelle d'un an, parcours Responsable Technique d'Applications Internet : concevoir, développer et maintenir des applications web, du front-end à la base de données.",
            subjects: ['Développement web front-end et back-end', 'PHP et Laravel', 'JavaScript', 'Bases de données', 'Gestion de projet web'],
            jobs: '' },
          { dates: '2018 — 2022', name: 'Licence Informatique, niveau L2', school: 'Université Toulouse III Paul Sabatier',
            more: "Les fondamentaux de l'informatique : algorithmique, programmation, structures de données, systèmes et bases de données.",
            subjects: ['Algorithmique', 'Programmation en C et en Java', 'Structures de données', 'Bases de données', 'Systèmes et réseaux', 'UML'],
            jobs: '' }
        ],
        contact: { email: 'E-mail', phone: 'Téléphone', cv: 'Télécharger mon CV (PDF)' }
      },
      en: {
        code: 'en', navLabel: 'Main navigation', langLabel: 'Language', techLabel: 'Technologies', timelineLabel: 'Projects, newest first',
        nav: { projects: 'Projects', experience: 'Experience', skills: 'Skills', education: 'Education', contact: 'Contact' },
        hero: {
          role: 'Full-stack developer · Toulouse',
          intro: 'Three years at Airbus and Andil building web tools, from gathering requirements all the way to production.',
          basedLabel: 'Based in', degreeLabel: 'Degree', degree: "Master's in Information Systems (MIAGE)", linksLabel: 'Links', cv: 'Resume (PDF)',
          photoAlt: 'Portrait of Diego Cortes'
        },
        about: {
          title: 'About',
          lead: 'I enjoy writing code, but what I enjoy most is understanding the problem it has to solve.',
          paras: [
            'I started with a computer science degree at Paul Sabatier University, then work-study programs took me from theory to real users. First at Andil, on Moodle plugins that clients used every day. Then at Airbus Operations, for two years.',
            "At Airbus, I was given a sensitive topic: making sure only the right people can access the company's Shared Drives. I led the project as a technical Product Owner. I ran the discussions with the Data Governance and Security teams, designed the mockups, built the application in React and TypeScript, wrote the documentation and saw it through to production.",
            "That experience made clear what I am looking for: a role where you write serious code, in direct contact with the business. My Master's gave me the methods for it: process analysis, BPMN, Agile. Aerospace appeals to me in particular. The quality bar is real, and I already know my way around it."
          ],
          points: [
            { title: 'Business and tech', text: 'From requirements workshops to code reviews.' },
            { title: 'Autonomy', text: 'An Airbus project delivered end to end.' },
            { title: 'Teamwork', text: 'Most of my projects, built with others.' },
            { title: 'Outside of code', text: 'Running, where RunMates came from.' }
          ]
        },
        seek: {
          title: "What I'm looking for",
          lead: '',
          rows: [
            { label: 'Role', value: 'Full-stack developer, or developer and Product Owner' },
            { label: 'Contract', value: 'Permanent (CDI), available now' },
            { label: 'Location', value: 'Toulouse area' },
            { label: 'Sector', value: 'Aerospace first' }
          ]
        },
        p: { context: 'Context', result: 'Outcome', approach: 'How we went about it', open: 'Preview', close: 'Collapse', openAria: 'Preview project ', closeAria: 'Collapse project ' },
        now: {
          title: 'Currently', when: 'Today',
          items: [
            { name: 'TicketFlow', text: 'Support tickets built as services. Spring Boot, React, PostgreSQL, Docker.' },
            { name: 'DCA investment tracker', text: 'Personal dashboard. Next.js, Prisma.' }
          ]
        },
        projectsDone: 'Projects delivered', seeCase: 'See the project ↓',
        jobs: [
          {
            dates: '2023 — 2025', place: 'Saint-Martin-du-Touch', company: 'Airbus Operations', logoUrl: 'assets/airbus.png', role: 'Developer and project lead, work-study',
            bullets: [
              'Technical Product Owner on a security project, from need to production.',
              'Workshops with Data Governance and IT Security, PI Planning, backlog.'
            ],
            projects: [
              { name: 'Google Drive access recertification', text: 'Web application that has Shared Drive access rights reviewed and re-approved.', stack: 'React · TypeScript · Google APIs', projectId: 'airbus' },
              { name: 'Google Docs file classification', text: 'Internal tool to label documents by sensitivity level.', stack: 'Google Apps Script', projectId: 'airbus-gdocs' },
              { name: 'Windows file classification', text: 'The same idea, applied to files on Windows workstations.', stack: '.NET · C#', projectId: 'airbus-windows' }
            ]
          },
          {
            dates: '2022 — 2023', place: 'Labège', company: 'Andil', logoUrl: 'assets/andil.png', role: 'Full-stack developer, work-study',
            bullets: [
              "Development and maintenance on clients' Moodle platforms."
            ],
            projects: [
              { name: 'Custom Moodle plugins', text: 'Built, maintained and improved plugins for client needs.', stack: 'PHP' },
              { name: 'Platform dashboard', text: 'A central view to monitor and manage every deployed Moodle platform.', stack: 'Laravel · HTML · CSS · JavaScript' }
            ]
          }
        ],
        skills: [
          { title: 'Front-end', items: ['React', 'Next.js', 'TypeScript', 'HTML, CSS', 'Capacitor'] },
          { title: 'Back-end', items: ['Java, Spring Boot', 'C#, .NET', 'Node.js', 'PHP, Laravel', 'REST APIs'] },
          { title: 'Data', items: ['PostgreSQL, PostGIS', 'SQL Server, MySQL, Oracle', 'BigQuery', 'Supabase, Prisma', 'Python, Pandas'] },
          { title: 'Google ecosystem', items: ['Apps Script', 'Workspace APIs', 'Drive, Shared Drives'] },
          { title: 'Project and analysis', items: ['Agile, Scrum', 'PI Planning, backlog', 'Requirements gathering', 'BPMN, UML', 'Jira'] },
          { title: 'Tools', items: ['Git', 'Docker', 'Linux, Bash', 'Mistral, Gemini APIs'] }
        ],
        eduMore: 'Learn more', eduLess: 'Show less', eduSubjects: 'Courses', eduJobs: 'Target roles',
        education: [
          { dates: '2023 — 2025', name: "Master's in Information Systems (MIAGE), Business Process Engineering", school: 'Toulouse Capitole University · work-study at Airbus',
            more: "A master's degree that trains you to guide a company through the evolution of its information system: analysing, modelling and digitising business processes on web, service-oriented or cloud architectures, while managing change.",
            subjects: ['Business process analysis', 'BPMN and UML modelling', 'Requirements gathering', 'Agile project management, Scrum', 'Information system design', 'Databases', 'Web development', 'Continuous improvement'],
            jobs: 'Product Owner, functional consultant, project manager, information systems engineer, developer.' },
          { dates: '2022 — 2023', name: "Professional Bachelor's in Computing, Web Applications (RTAI)", school: 'Toulouse Capitole University · work-study at Andil',
            more: 'A one-year professional degree focused on web application engineering: designing, building and maintaining web applications, from front-end to database.',
            subjects: ['Front-end and back-end web development', 'PHP and Laravel', 'JavaScript', 'Databases', 'Web project management'],
            jobs: '' },
          { dates: '2018 — 2022', name: 'Computer Science degree, second-year level', school: 'Toulouse III Paul Sabatier University',
            more: 'The foundations of computer science: algorithms, programming, data structures, systems and databases.',
            subjects: ['Algorithms', 'Programming in C and Java', 'Data structures', 'Databases', 'Systems and networks', 'UML'],
            jobs: '' }
        ],
        contact: { email: 'Email', phone: 'Phone', cv: 'Download my resume (PDF)' }
      }
    };
    var t = T[lang];

    function m(name, url, didFr, didEn) { return { name: name, url: url || '', hasUrl: !!url, noUrl: !url, did: lang === 'fr' ? didFr : didEn }; }
    function L(fr, en) { return lang === 'fr' ? fr : en; }

    var data = [
      {
        // Présenté dans la partie Expérience (Airbus), pas dans le fil des projets.
        id: 'airbus', year: '2025', inExperience: true,
        name: L('Recertification des accès Drive', 'Drive access recertification'),
        kind: L('Airbus Operations · alternance', 'Airbus Operations · work-study'),
        pitch: L("Faire revalider régulièrement qui a accès aux Shared Drives de l'entreprise.", "Regularly re-approving who has access to the company's Shared Drives."),
        previewLabel: L('Principe de fonctionnement', 'How it works'),
        tree: L(
          ['Campagne de revue', '   │', '   ▼', 'Le responsable du drive', 'voit la liste des accès', '   │', '   ▼', 'Il confirme ou retire', 'chaque accès', '   │', '   ▼', 'Décisions appliquées', 'via les API Google', '   │', '   ▼', 'Suivi pour Security et', 'Data Governance'].join('\n'),
          ['Review campaign', '   │', '   ▼', 'The drive owner sees', 'the list of accesses', '   │', '   ▼', 'They confirm or remove', 'each access', '   │', '   ▼', 'Decisions applied', 'through Google APIs', '   │', '   ▼', 'Reporting for Security', 'and Data Governance'].join('\n')
        ),
        context: L(
          "Chez Airbus, les Shared Drives Google accumulent des droits d'accès qui ne sont jamais revus : des personnes qui ont changé de poste ou de projet gardent l'accès à des données sensibles. L'équipe Digital Workplace m'a confié le sujet, du cadrage jusqu'à la mise en production.",
          'At Airbus, Google Shared Drives pile up access rights that never get reviewed: people who changed roles or projects keep access to sensitive data. The Digital Workplace team gave me the topic, from scoping all the way to production.'
        ),
        // Si tu peux citer des chiffres : result: L('… en français', '… in English'). Vide, le bloc n'apparaît pas.
        result: '',
        approach: L([
          "Recueil des besoins en ateliers avec les équipes Data Governance et IT Security, pour fixer les règles et les contraintes de conformité.",
          "Maquettes validées avec elles avant d'écrire la première ligne de code.",
          "Développement itératif dans le cadre Agile de l'équipe, avec les PI Planning et un backlog partagé.",
          'Documentation technique complète, puis mise en production validée par l’IT Security.'
        ], [
          'Requirements workshops with the Data Governance and IT Security teams to set the rules and compliance constraints.',
          'Mockups approved with them before writing the first line of code.',
          "Iterative development within the team's Agile framework, with PI Planning and a shared backlog.",
          'Full technical documentation, then a production release approved by IT Security.'
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [
          m('Diego Cortes', '', 'Product Owner technique et développeur : besoins, maquettes, développement, documentation, déploiement.', 'Technical Product Owner and developer: requirements, mockups, development, documentation, deployment.'),
          m('Data Governance', '', 'Règles de gouvernance des données, validation fonctionnelle.', 'Data governance rules, functional sign-off.'),
          m('IT Security', '', 'Exigences de sécurité, validation du déploiement.', 'Security requirements, deployment sign-off.')
        ],
        stack: 'React · TypeScript · Google Drive API · Apps Script',
        links: [], private: true, privateLabel: L('Code interne Airbus', 'Internal Airbus code')
      },
      {
        id: 'runmates', year: '2026', name: 'RunMates',
        kind: L('Projet personnel · seul', 'Personal project · solo'),
        pitch: L('Trouver une sortie course ou vélo près de chez soi, à son allure, et la rejoindre en un geste.', 'Find a run or ride nearby, at your pace, and join it in one tap.'),
        img: 'assets/runmates-sorties.jpg',
        imgAlt: L("Maquette de l'écran Sorties de RunMates : sorties du jour et du lendemain avec allure, distance et lieu", 'Mockup of the RunMates Runs screen: today and tomorrow’s runs with pace, distance and place'),
        previewLabel: L("Maquette de l'écran « Sorties »", 'Mockup of the “Runs” screen'),
        context: L(
          "Courir à plusieurs, c'est plus motivant, mais les outils existants supposent de déjà connaître un club : Strava et Meetup fonctionnent par abonnement, les groupes WhatsApp sont fermés. J'ai voulu une application où l'on découvre les sorties autour de soi et où l'on rejoint des inconnus qui courent à la même allure. Elle est en ligne sur le web, et en test sur iOS.",
          "Running with others is more motivating, but existing tools assume you already belong to a club: Strava and Meetup work by membership, WhatsApp groups are closed. I wanted an app where you discover runs around you and join strangers who run at your pace. It is live on the web and in testing on iOS."
        ),
        approach: L([
          "Les fondations d'abord : schéma de la base, types TypeScript et règles d'accès, avant le moindre écran.",
          "Toute l'autorisation portée par PostgreSQL : 101 règles Row Level Security, et une recherche géographique PostGIS pour les sorties proches.",
          "L'application construite par couches : client Supabase, hooks de données avec cache, composants, puis les 22 écrans.",
          "Un audit de sécurité dédié : contacts d'urgence déplacés dans une table privée, webhook Stripe protégé contre le rejeu, fonctions SQL durcies.",
          "Des itérations produit : parcours d'inscription, ajout du vélo à côté de la course, version bureau avec navigation latérale."
        ], [
          'Foundations first: database schema, TypeScript types and access rules, before a single screen.',
          'All authorization handled by PostgreSQL: 101 Row Level Security policies, plus PostGIS geographic search for nearby runs.',
          'The app built in layers: Supabase client, cached data hooks, components, then the 22 screens.',
          'A dedicated security audit: emergency contacts moved to a private table, Stripe webhook protected against replay, SQL functions hardened.',
          'Product iterations: onboarding flow, cycling added alongside running, a desktop version with side navigation.'
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [ m('Diego Cortes', GH.diego, 'Tout, seul : idée, produit, modèle de données, sécurité, front-end, application iOS, paiements.', 'Everything, solo: idea, product, data model, security, front-end, iOS app, payments.') ],
        stack: 'React · TypeScript · Supabase · PostGIS · Mapbox · Capacitor · Stripe',
        links: [], private: true, privateLabel: L('Code privé', 'Private code')
      },
      {
        id: 'dafu', year: '2025', name: 'DAFU Market',
        kind: L('Master MIAGE · équipe de quatre', "Master's project · team of four"),
        pitch: L('Un drive de supermarché complet : client, manager du magasin et préparateurs.', 'A full supermarket click-and-collect: customers, store manager and order pickers.'),
        previewLabel: L('Structure des deux dépôts', 'Structure of both repositories'),
        tree: ['API · Spring Boot', '├─ controllers/  client, admin,', '│                magasin, préparateur…', '├─ services/     LLM, JWT, panier…', '├─ dao/ repositories/ mappers/', '├─ models/ dto/ seeders/', '└─ docker-compose   MariaDB', '', 'Front · React + Vite', '├─ pages/        customer, admin', '├─ api/ hooks/data/ schemas/', '└─ components/   dashboard, tri…'].join('\n'),
        context: L(
          "Projet de Master MIAGE en huit jours : concevoir un drive de supermarché avec trois applications, une pour les clients, une pour le manager du magasin et une pour les préparateurs de commandes, reliées à une même API.",
          "An eight-day Master's project: design a supermarket click-and-collect with three apps, for customers, the store manager and order pickers, all connected to one API."
        ),
        approach: L([
          "Vu le délai, priorité à l'application client pour livrer le maximum de valeur. Les applications manager et préparateur sont fonctionnelles, sans finition.",
          "L'API conçue d'abord et documentée avec Swagger, pour que le front et le back avancent en parallèle.",
          'Une branche et une pull request par fonctionnalité, relues avant fusion.',
          'Côté front, react-query pour le cache des données et zod pour valider les formulaires.'
        ], [
          'Given the deadline, the customer app came first to deliver the most value. The manager and picker apps work, without polish.',
          'The API was designed first and documented with Swagger, so front-end and back-end could move in parallel.',
          'One branch and one pull request per feature, reviewed before merging.',
          'On the front-end, react-query for data caching and zod for form validation.'
        ]),
        teamTitle: L('Qui a fait quoi, d’après les commits', 'Who did what, from the commits'),
        team: [
          m('Diego Cortes', GH.diego, 'API : assistant IA via Mistral, recherche tolérante aux fautes (distance de Levenshtein), panier, bon de commande en PDF envoyé par e-mail, import CSV, statistiques, Swagger.', 'API: AI assistant via Mistral, typo-tolerant search (Levenshtein distance), cart, PDF order slip sent by email, CSV import, statistics, Swagger.'),
          m('Klervi Le Montreer', GH.klervi, 'API : listes de courses et conversion en panier, recherche par marque, inscription des clients.', 'API: shopping lists and conversion to cart, search by brand, customer sign-up.'),
          m('Etienne Coyac', GH.etienne, "Sécurité JWT de l'API, puis l'application client : listes de courses, post-its, fiches produits.", 'JWT security for the API, then the customer app: shopping lists, sticky notes, product pages.'),
          m('Thomas Pirovano', GH.thomas, "Tableau de bord d'administration, tri des produits, documentation de l'API.", 'Admin dashboard, product sorting, API documentation.')
        ],
        stack: 'Java · Spring Boot · React · TypeScript · Docker · Mistral',
        links: [{ label: L("Code de l'API", 'API code'), url: 'https://github.com/KlerviLMTR/dafumarket' }, { label: L('Code du front', 'Front-end code'), url: 'https://github.com/etienne-coyac/dafu-market' }],
        private: false, privateLabel: ''
      },
      {
        id: 'poudlard', year: '2024', name: L('Gestion scolaire « Poudlard »', '“Hogwarts” school manager'),
        kind: L('Master MIAGE · équipe de six', "Master's project · team of six"),
        pitch: L('Élèves, maisons, professeurs et évaluations, en Java sur une base relationnelle.', 'Students, houses, teachers and grades, in Java on a relational database.'),
        previewLabel: L('Structure du dépôt', 'Repository structure'),
        tree: ['src/', '├─ Ecole/', '│  ├─ Personnages/', '│  └─ Jeu/', '├─ dao/', '├─ mapper/', '├─ ExceptionClasses/', '├─ utils/', '└─ sql/'].join('\n'),
        context: L(
          "Projet de début de Master pour pratiquer la programmation objet et l'accès aux données : une application console qui gère une école, ses élèves, ses maisons, ses professeurs et leurs évaluations, avec un classement des maisons et un mini-jeu entre élèves.",
          "An early Master's project to practice object-oriented programming and data access: a console app that manages a school, its students, houses, teachers and grades, with a house ranking and a mini-game between students."
        ),
        approach: L([
          "La modélisation objet d'abord, avec des classes abstraites pour les personnes et les professeurs.",
          "Une couche d'accès aux données générique (DAO) et des mappers pour séparer le SQL du code métier.",
          "Des exceptions métier dédiées pour les erreurs de saisie et les règles de l'école."
        ], [
          'Object modeling first, with abstract classes for people and teachers.',
          'A generic data access layer (DAO) and mappers to keep SQL apart from business code.',
          'Dedicated business exceptions for input errors and school rules.'
        ]),
        teamTitle: L('Qui a fait quoi, d’après les commits', 'Who did what, from the commits'),
        team: [
          m('Diego Cortes', GH.diego, 'Classes DAO et mappers, séparation du programme principal et des utilitaires, évaluation des élèves, encodage.', 'DAO and mapper classes, splitting the main program from utilities, student grading, encoding.'),
          m('EstherLYU', GH.esther, 'DAO générique et service des élèves.', 'Generic DAO and student service.'),
          m('cameljaunes', '', 'Mini-jeu de chifoumi et gestion des exceptions.', 'Rock-paper-scissors mini-game and exception handling.'),
          m('xueqiyouyou', '', 'Classes Enseignant, Maison et Jeu, base de données.', 'Teacher, House and Game classes, database.'),
          m('yuan272, NyHavatiana', '', 'Classes Élève et Maison.', 'Student and House classes.')
        ],
        stack: 'Java · SQL',
        links: [], private: true, privateLabel: L('Code privé', 'Private code')
      },
      {
        id: 'laravel', year: '2023', name: L('Randonnées en montagne', 'Mountain hiking back-office'),
        kind: L('Licence pro · à trois', "Bachelor's project · team of three"),
        pitch: L('Un back-office Laravel pour gérer guides, sommets, refuges, randonnées et réservations.', 'A Laravel back-office to manage guides, summits, huts, hikes and bookings.'),
        previewLabel: L('Structure du dépôt', 'Repository structure'),
        tree: ['app/', '├─ Http/Controllers/  Guide, Sommet,', '│                     Vallee, Abri…', '└─ Models/            9', 'database/migrations/  13', 'routes/web.php        CRUD', 'resources/js/         Vue.js'].join('\n'),
        context: L(
          "Projet de licence professionnelle : une application d'administration pour une agence de randonnée en montagne, qui gère ses guides, les sommets et vallées, les refuges, les randonnées, les ascensions et les réservations.",
          "A professional bachelor's project: an admin application for a mountain hiking agency, managing its guides, summits and valleys, huts, hikes, ascents and bookings."
        ),
        approach: L([
          'Le modèle conceptuel de données traduit en migrations Laravel, entité par entité.',
          'Un contrôleur par entité, avec les routes de création, modification et suppression.',
          "L'authentification de Laravel, avec un rôle administrateur distinct des simples utilisateurs."
        ], [
          'The conceptual data model turned into Laravel migrations, one entity at a time.',
          'One controller per entity, with create, update and delete routes.',
          "Laravel's authentication, with an admin role separate from regular users."
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [
          m('Diego Cortes', GH.diego, 'Lancement du projet, migrations et modèles Eloquent, authentification.', 'Project setup, migrations and Eloquent models, authentication.'),
          m('Marion Sereni', GH.marion, 'Co-autrice du projet.', 'Project co-author.'),
          m('Klervi Le Montreer', GH.klervi, 'Co-autrice du projet.', 'Project co-author.')
        ],
        stack: 'PHP · Laravel · Vue.js · MySQL',
        links: [{ label: 'Code', url: 'https://github.com/diego-2909/ProjetLaravel' }], private: false, privateLabel: ''
      },
      {
        id: 'recettes', year: '2023', name: L('Recettes', 'Recipes'),
        kind: L('Licence pro · à trois', "Bachelor's project · team of three"),
        pitch: L('Recettes, ingrédients, repas et liste de courses, avec une API REST en Node.js.', 'Recipes, ingredients, meals and a shopping list, with a Node.js REST API.'),
        previewLabel: L('Structure du dépôt', 'Repository structure'),
        tree: ['app.js', '├─ controllers/', '├─ services/', '├─ dao/          MySQL', '├─ models/', '└─ views/        EJS × 13', 'docker-compose.yml'].join('\n'),
        context: L(
          "Projet de licence professionnelle pour apprendre Node.js : une application qui gère des recettes, leurs ingrédients, des repas, et génère la liste de courses correspondante.",
          "A professional bachelor's project to learn Node.js: an app that manages recipes, their ingredients and meals, and generates the matching shopping list."
        ),
        approach: L([
          'Une architecture en couches : routes, contrôleurs, services, puis accès aux données.',
          'Des pages rendues côté serveur avec EJS.',
          'La base MySQL lancée avec Docker Compose, pour que tout le monde travaille sur le même environnement.'
        ], [
          'A layered architecture: routes, controllers, services, then data access.',
          'Server-rendered pages with EJS.',
          'The MySQL database run with Docker Compose, so everyone worked on the same environment.'
        ]),
        teamTitle: L('Qui a fait quoi, d’après les commits', 'Who did what, from the commits'),
        team: [
          m('Klervi Le Montreer', GH.klervi, 'La majorité du code : accès aux données, services, ingrédients, repas, tris.', 'Most of the code: data access, services, ingredients, meals, sorting.'),
          m('Marion Sereni', GH.marion, "Premières vues de l'application.", 'First views of the app.'),
          m('Diego Cortes', GH.diego, "Routes des recettes et point d'entrée de l'application.", 'Recipe routes and the app entry point.')
        ],
        stack: 'Node.js · Express · EJS · MySQL · Docker',
        links: [{ label: 'Code', url: 'https://github.com/KlerviLMTR/nodeJs-recettes' }], private: false, privateLabel: ''
      },
      {
        id: 'blockchain', year: '2022', name: 'Blockchain from scratch',
        kind: L('Licence informatique', 'Computer science degree'),
        pitch: L('Une blockchain sans bibliothèque, y compris le hachage SHA-256, en C puis en Java.', 'A blockchain with no libraries, SHA-256 hashing included, in C and then Java.'),
        previewLabel: L('Structure du dépôt', 'Repository structure'),
        tree: ['projets4_c/', '├─ sha256.c', '└─ main.c', 'projets4_java/', '├─ blockchain/', '├─ transactionAleatoire/', '├─ verification/', '├─ interfaceGraphique/', '└─ user/'].join('\n'),
        context: L(
          "Projet de licence pour comprendre ce qu'il y a vraiment sous une blockchain : comment on chaîne des blocs, comment on garantit qu'ils n'ont pas été modifiés.",
          'A degree project to understand what really sits under a blockchain: how blocks are chained, and how you guarantee they were not tampered with.'
        ),
        approach: L([
          "D'abord l'algorithme SHA-256 réécrit en C, pour comprendre le hachage au niveau des octets.",
          "Puis la blockchain complète en Java : blocs, transactions générées aléatoirement, vérification d'intégrité.",
          'Une interface graphique pour suivre la chaîne.'
        ], [
          'First, the SHA-256 algorithm rewritten in C, to understand hashing at the byte level.',
          'Then the full blockchain in Java: blocks, randomly generated transactions, integrity checks.',
          'A graphical interface to follow the chain.'
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [ m('Diego Cortes', GH.diego, 'Projet réalisé seul.', 'Built solo.') ],
        stack: 'C · Java',
        links: [{ label: 'Code', url: 'https://github.com/diego-2909/Projet_Blockchain' }], private: false, privateLabel: ''
      },
      {
        id: 'elrond', year: '2022', name: 'Elrond',
        kind: L('Projet personnel', 'Personal project'),
        pitch: L('Un site de présentation de la blockchain Elrond, avec suivi du cours.', 'A website presenting the Elrond blockchain, with price tracking.'),
        previewLabel: L('Structure du dépôt', 'Repository structure'),
        tree: ['src/', '├─ pages/       Accueil, Chart, About', '└─ components/  navbar, prix,', '                mini-chart,', '                priceChange…'].join('\n'),
        context: L(
          "Un projet personnel pour apprendre React en construisant un vrai site : présenter la blockchain Elrond et suivre l'évolution de son cours.",
          'A personal project to learn React by building a real site: presenting the Elrond blockchain and tracking its price.'
        ),
        approach: L([
          'Un découpage en composants réutilisables : prix, variation, mini-graphique, cadres de présentation.',
          'Trois pages reliées par un routeur : accueil, graphique et à propos.'
        ], [
          'A split into reusable components: price, change, mini chart, presentation blocks.',
          'Three pages connected by a router: home, chart and about.'
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [ m('Diego Cortes', GH.diego, 'Projet réalisé seul.', 'Built solo.') ],
        stack: 'React · JavaScript · CSS',
        links: [{ label: 'Code', url: 'https://github.com/diego-2909/Elrond' }], private: false, privateLabel: ''
      },
      {
        id: 'blog', year: '2022', name: 'Blog',
        kind: L('Projet personnel', 'Personal project'),
        pitch: L("Un blog dynamique en PHP, avec un espace d'administration pour publier.", 'A dynamic PHP blog, with an admin area to publish.'),
        previewLabel: L('Structure du dépôt', 'Repository structure'),
        tree: ['index.php · article.php', 'Espace_Admin/', '├─ connexion.php', '├─ publierArticle.php', '└─ logout.php', 'public/tinymce/'].join('\n'),
        context: L(
          "Mon premier site dynamique : un blog où l'on publie des articles depuis un espace d'administration protégé.",
          'My first dynamic website: a blog where articles are published from a protected admin area.'
        ),
        approach: L([
          "Du PHP sans framework, pour comprendre les sessions, les formulaires et l'accès à la base.",
          "Un espace d'administration protégé par connexion.",
          "L'éditeur TinyMCE intégré pour rédiger en texte riche."
        ], [
          'Plain PHP with no framework, to understand sessions, forms and database access.',
          'An admin area protected by login.',
          'The TinyMCE editor built in for rich-text writing.'
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [ m('Diego Cortes', GH.diego, 'Projet réalisé seul.', 'Built solo.') ],
        stack: 'PHP · MySQL · HTML/CSS',
        links: [{ label: 'Code', url: 'https://github.com/diego-2909/Blog' }], private: false, privateLabel: ''
      },

      // -----------------------------------------------------------------------
      // Projets Airbus présentés dans la partie Expérience (bouton « Aperçu › »).
      // À compléter : context, approach (liste), result. Un champ vide n'est pas affiché.
      // -----------------------------------------------------------------------
      {
        id: 'airbus-gdocs', year: '2025', inExperience: true,
        name: L('Classification des fichiers Google Docs', 'Google Docs file classification'),
        kind: L('Airbus Operations · alternance', 'Airbus Operations · work-study'),
        pitch: L('Un outil interne pour classer les documents Google selon leur niveau de sensibilité.', 'An internal tool to label Google documents by sensitivity level.'),
        context: '',
        approach: [],
        result: '',
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [],
        stack: 'Google Apps Script · Google Workspace APIs',
        links: [], private: true, privateLabel: L('Code interne Airbus', 'Internal Airbus code')
      },
      {
        id: 'airbus-windows', year: '2025', inExperience: true,
        name: L('Classification des fichiers Windows', 'Windows file classification'),
        kind: L('Airbus Operations · alternance', 'Airbus Operations · work-study'),
        pitch: L('Le même principe, appliqué aux fichiers des postes Windows.', 'The same idea, applied to files on Windows workstations.'),
        context: '',
        approach: [],
        result: '',
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [],
        stack: '.NET · C#',
        links: [], private: true, privateLabel: L('Code interne Airbus', 'Internal Airbus code')
      }
    ];

    return { t: t, projects: data };
}
