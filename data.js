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
          role: "Développeur full-stack à Toulouse, diplômé d'un Master MIAGE",
          intro: "Je conçois et développe des applications web, de l'analyse du besoin à la mise en production. Mon expérience chez Airbus Operations m'a également amené à piloter techniquement un projet, en collaboration avec des équipes métier et sécurité.",
          status: 'Disponible · CDI · Toulouse', ctaContact: 'Me contacter', ctaCv: 'Télécharger le CV',
          basedLabel: 'Basé à', degreeLabel: 'Diplôme', degree: 'Master MIAGE', linksLabel: 'Liens', cv: 'CV (PDF)',
          photoAlt: 'Portrait de Diego Cortes'
        },
        about: {
          title: 'À propos',
          lead: '',
          paras: [
            "Diplômé d'un Master MIAGE en Ingénierie des Processus Métiers, j'ai acquis trois ans d'expérience en développement informatique, en alternance chez Airbus Operations et Andil.",
            "Chez Airbus, en tant que développeur et responsable projet, j'ai pris en charge une application de recertification des accès Google Drive, du recueil des besoins jusqu'à la mise en production, entre développement et coordination avec les équipes métier et sécurité.",
            "Passer de PHP chez Andil à React, aux Google APIs puis à C# et .NET chez Airbus m'a appris à prendre en main rapidement un nouvel environnement.",
            "En parallèle, je développe mes propres projets, comme RunMates, une application web et iOS pour rejoindre des sorties de course à pied ou de vélo près de chez soi, que je mène seul de la conception à la mise en ligne.",
            "Aujourd'hui, je souhaite mettre cette polyvalence au service d'une équipe, comme développeur full-stack avec, lorsque le projet le permet, une dimension de pilotage technique."
          ],
        },
        seek: {
          title: 'Ce que je cherche',
          lead: '',
          rows: [
            { label: 'Poste', value: 'Développeur full-stack, ou développeur et responsable projet' },
            { label: 'Contrat', value: 'CDI, disponible immédiatement' },
            { label: 'Lieu', value: 'Toulouse et alentours' },
            { label: 'Secteur', value: 'Aéronautique en priorité' }
          ]
        },
        p: { context: 'Contexte', result: 'Résultat', approach: "Comment on s'y est pris", open: 'Aperçu', close: 'Réduire', openAria: 'Voir l’aperçu du projet ', closeAria: 'Réduire le projet ' },
        detail: { more: 'Plus de détails', back: 'Retour', missions: 'Mes missions', company: "L'entreprise", count: function (n) { return n + ' réalisation' + (n > 1 ? 's' : ''); } },
        featured: { tag: 'Mon dernier projet (2026)', others: 'Mes autres projets', more: 'En savoir plus', play: 'Lire la vidéo', pause: 'Mettre la vidéo en pause' },
        now: {
          title: 'En ce moment', when: "Aujourd'hui",
          items: [
            { name: 'TicketFlow', text: "Tickets de support en services, et une première prise en main d'Angular. Spring Boot, Angular, PostgreSQL, Docker." },
            { name: "Suivi d'investissement DCA", text: 'Tableau de bord personnel. Next.js, Prisma.' }
          ]
        },
        projectsDone: 'Projets réalisés', seeCase: 'Voir le projet ↓',
        jobs: [
          {
            dates: '2023 — 2025', place: 'Saint-Martin-du-Touch', company: 'Airbus Operations', logoUrl: 'assets/airbus.png', role: 'Développeur et responsable projet, en alternance',
            about: "Airbus Operations est l'entité d'Airbus qui conçoit et produit les avions commerciaux. J'ai rejoint ses équipes informatiques sur le site de Saint-Martin-du-Touch, à Toulouse, pendant mes deux ans d'alternance en Master MIAGE.",
            missions: [
              "Au sein de l'équipe Digital Workplace, j'ai occupé un rôle à la fois technique et fonctionnel, en participant au développement d'applications et d'outils internes destinés à répondre aux besoins des collaborateurs et des équipes métier. Mon expérience a notamment porté sur la conception et le développement d'applications web, l'intégration des services Google Workspace et la création d'outils de classification de documents. J'ai également participé au fonctionnement de l'équipe dans un environnement Agile, notamment aux PI Planning et aux activités liées au suivi du backlog.",
              "L'un de mes principaux projets a été la recertification des accès aux Shared Drives Google. L'objectif était de développer une application web permettant aux responsables de revoir et de valider régulièrement les droits d'accès aux espaces partagés. Cette démarche répondait à un enjeu de sécurité : éviter que des collaborateurs conservent des accès à des données sensibles après un changement de poste ou de projet. J'ai assuré le pilotage technique et le développement de cette application, de la définition du besoin jusqu'à sa mise en production. J'ai participé aux échanges avec les équipes Data Governance et IT Security afin de comprendre leurs besoins, leurs pratiques et les points qui fonctionnaient ou qui posaient problème dans la gestion des accès. Pour la conception de l'application, j'ai principalement travaillé avec le Product Owner sur les maquettes afin de définir le fonctionnement attendu avant le développement. J'ai ensuite conçu et développé l'application avec React, TypeScript et les Google APIs, en avançant de manière itérative. J'ai également rédigé la documentation technique et accompagné le déploiement, qui a été validé par l'équipe IT Security.",
              "J'ai aussi contribué à d'autres outils internes autour de la classification des documents. Le premier, développé avec Google Apps Script, permettait de classer les fichiers Google Docs selon leur niveau de sensibilité. Le second reposait sur le même principe, mais concernait les fichiers présents sur les postes Windows. Il a été développé avec C# et .NET."
            ],
            projects: [
              { name: 'Recertification des accès Google Drive', text: "Application web pour que les responsables revoient et valident régulièrement les droits d'accès aux Shared Drives. Pilotage technique et développement, du besoin à la mise en production.", stack: 'React · TypeScript · Google APIs', projectId: 'airbus' },
              { name: 'Classification des fichiers Google Docs', text: 'Contribution à un outil interne pour classer les fichiers Google Docs selon leur niveau de sensibilité.', stack: 'Google Apps Script', projectId: 'airbus-gdocs' },
              { name: 'Classification des fichiers Windows', text: 'Le même principe, appliqué aux fichiers des postes Windows.', stack: '.NET · C#', projectId: 'airbus-windows' }
            ]
          },
          {
            dates: '2022 — 2023', place: 'Labège', company: 'Andil', logoUrl: 'assets/andil.png', role: 'Développeur full-stack, en alternance',
            about: "Andil est une entreprise basée à Labège, près de Toulouse, spécialisée dans le déploiement et la maintenance de plateformes Moodle pour ses clients. J'y étais en alternance pendant ma licence professionnelle Responsable Technique d'Applications Internet.",
            missions: [
              "Au sein de l'équipe de développement, j'ai participé à la création, à la maintenance et à l'évolution de plateformes Moodle utilisées par les clients de l'entreprise. Mon travail consistait notamment à développer des fonctionnalités adaptées à leurs besoins et à faire évoluer les outils existants.",
              "J'ai notamment travaillé sur le développement de plugins Moodle sur mesure, en PHP. Ces plugins permettaient d'ajouter ou d'adapter des fonctionnalités à la plateforme afin de répondre aux besoins spécifiques des clients. J'ai également participé au développement d'un tableau de bord centralisé pour la gestion des plateformes Moodle. Développé avec Laravel, HTML, CSS et JavaScript, cet outil avait pour objectif de regrouper les informations et les fonctionnalités nécessaires au suivi et à l'administration des différentes plateformes déployées par l'entreprise."
            ],
            projects: [
              { name: 'Plugins Moodle sur mesure', text: 'Des plugins pour ajouter ou adapter des fonctionnalités de la plateforme selon les besoins spécifiques des clients.', stack: 'PHP' },
              { name: 'Tableau de bord des plateformes', text: "Participation à un tableau de bord centralisé qui regroupe les informations et les fonctions utiles au suivi et à l'administration des plateformes déployées.", stack: 'Laravel · HTML · CSS · JavaScript' }
            ]
          }
        ],
        skills: [
          { title: 'Front-end', fam: 'front', items: ['React', 'Next.js', 'TypeScript', 'HTML, CSS'] },
          { title: 'Back-end', fam: 'back', items: ['Java, Spring Boot', 'C#, .NET', 'Node.js', 'PHP, Laravel', 'Google Apps Script', 'API REST'] },
          { title: 'Données', fam: 'data', items: ['MySQL', 'PostgreSQL', 'Oracle', 'BigQuery', 'Python, Pandas'] },
          { title: 'Écosystème Google', fam: 'google', items: ['Workspace APIs', 'Drive, Shared Drives'] },
          { title: 'Projet et analyse', fam: 'method', items: ['Agile, Scrum', 'PI Planning, backlog', 'Recueil des besoins', 'BPMN, UML', 'Jira'] },
          { title: 'Outils', fam: 'cloud', items: ['Git', 'Docker', 'Linux, Bash', 'API Mistral, Gemini'] },
          { title: 'Certification', fam: 'cloud', items: ['AWS Cloud Foundations'], url: 'https://www.credly.com/badges/a07016d2-69c5-4faf-ab38-83d827173f73/public_url' },
          { title: 'Soft skills', plain: true, items: ['Enthousiasme', 'Adaptabilité', "Esprit d'équipe"] },
          { title: 'Hobbies', plain: true, items: ['Gymnastique', 'Vélo', 'Course à pied', 'Piano'] }
        ],
        certsTitle: 'Certification',
        certs: [
          { name: 'AWS Academy Graduate · Cloud Foundations', issuer: 'Amazon Web Services · obtenu pendant le Master MIAGE', img: 'assets/aws-cloud-foundations.png',
            url: 'https://www.credly.com/badges/a07016d2-69c5-4faf-ab38-83d827173f73/public_url', link: 'Voir le badge' }
        ],
        eduMore: 'En savoir plus', eduLess: 'Réduire', eduSubjects: 'Enseignements', eduJobs: 'Débouchés visés',
        education: [
          { dates: '2023 — 2025', name: 'Master MIAGE, Ingénierie des Processus Métiers', school: 'Université Toulouse Capitole · en alternance chez Airbus', logoUrl: 'assets/ut1-capitole.png',
            more: "Un master en deux ans, suivi en alternance chez Airbus, qui forme à faire évoluer le système d'information d'une entreprise : analyser, modéliser et digitaliser ses processus métiers, puis concevoir et déployer les applications qui les servent. La première année pose les bases (modélisation du SI, des données et des processus, programmation objet, bases de données, gestion de projet). La deuxième, parcours Ingénierie des Processus Métiers, approfondit le développement, le cloud, l'industrialisation et la gouvernance des SI.",
            groups: [
              { title: 'Master 1 · 2023 — 2024', items: ['Modélisation du SI', 'Modélisation des données et des processus', 'Conception et programmation orientée objet', 'Agilité pour le recueil des besoins', 'Bases de données relationnelles avancées', 'Bases de données décisionnelles', 'Gestion de projet', 'Machine learning', 'Intelligence artificielle symbolique', 'Droit du numérique'] },
              { title: 'Master 2 Ingénierie des Processus Métiers · 2024 — 2025', items: ['Développement front et back', 'Développement pour le Big Data', 'Architecture d’entreprise à base de services', 'Données et développement dans le cloud', 'Intégration et déploiement continus', 'Agilité pour la gestion de projets', 'Urbanisation et gouvernance des SI', 'Intégration de données', 'Process Intelligence', 'Recherche et développement'] }
            ],
            subjects: [],
            jobs: 'Consultant fonctionnel, chef de projet, ingénieur système d’information, développeur.' },
          { dates: '2022 — 2023', name: 'Licence professionnelle Métiers de l’informatique, parcours RTAI', school: 'Université Toulouse Capitole · en alternance chez Andil', logoUrl: 'assets/ut1-capitole.png',
            more: "Une licence professionnelle d'un an (L3), parcours Responsable Technique d'Applications Internet, suivie en alternance chez Andil. Elle forme à encadrer un projet web de bout en bout : concevoir et réaliser des applications Internet, suivre la conduite de projet, assurer leur sécurité et leur pérennité, et rédiger leur documentation.",
            groups: [
              { title: 'Développement de sites et d’applications web', items: ['Création de sites web (HTML, CSS)', 'Sites dynamiques et responsive design', 'Programmation côté serveur', 'Frameworks MVC', 'Référencement SEO'] },
              { title: 'Principes de développement', items: ['Programmation', 'Bases de données', 'Modélisation UML', 'Gestion de projet'] },
              { title: 'Réseaux et sécurité', items: ['Réseaux informatiques', 'Serveurs et contenus', 'Sécurité des applications Internet'] },
              { title: 'Culture Internet', items: ['Droit du numérique', 'Économie immatérielle', 'Anglais'] }
            ],
            subjects: [],
            jobs: 'développeur d’applications web, intégrateur web, assistant chef de projet web.' },
          { dates: '2018 — 2022', name: 'Licence Informatique (L2)', school: 'Université Toulouse III Paul Sabatier', logoUrl: 'assets/ut3.png',
            more: "Une licence d'informatique suivie jusqu'au premier semestre de L3. La L1 commence par un semestre scientifique commun (mathématiques, physique-chimie, informatique), puis se concentre sur l'informatique : algorithmique, programmation en C, architecture et logique. La L2 a posé les fondamentaux de la programmation, de l'assembleur au C, à Java et à Python, avec les systèmes, les réseaux, les bases de données et un projet de développement à chaque semestre. Le semestre 5 a ajouté la programmation fonctionnelle en OCaml et la complexité.",
            groups: [
              { title: 'L1 · semestre 1, tronc commun scientifique', items: ['Mathématiques', 'Physique et chimie', 'Informatique et outils mathématiques', 'Sciences du numérique'] },
              { title: 'L1 · semestre 2, informatique', items: ['Algorithmique', 'Programmation en C', 'Architecture des machines', 'Logique', 'Théorie de l\u2019information', 'Mathématiques discrètes', 'Analyse'] },
              { title: 'L2 · Informatique', items: ['Assembleur', 'C', 'Java', 'Python', 'Programmation orientée objet', 'Structures de données', 'Algorithmique et programmation', 'Systèmes', 'Réseaux', 'Architecture des machines', 'Bases de données', 'Interaction homme-machine', 'Projets de développement'] },
              { title: 'L3 · semestre 5', items: ['Programmation fonctionnelle (OCaml)', 'Complexité'] }
            ],
            subjects: [],
            jobs: '' }
        ],
        contact: { lead: 'Je cherche un CDI de développeur full-stack, ou développeur et responsable projet, à Toulouse. Aéronautique en priorité, disponible immédiatement.', email: 'E-mail', phone: 'Téléphone', cv: 'Télécharger mon CV (PDF)' }
      },
      en: {
        code: 'en', navLabel: 'Main navigation', langLabel: 'Language', techLabel: 'Technologies', timelineLabel: 'Projects, newest first',
        nav: { projects: 'Projects', experience: 'Experience', skills: 'Skills', education: 'Education', contact: 'Contact' },
        hero: {
          role: "Full-stack developer in Toulouse, Master's in Information Systems (MIAGE)",
          intro: "I design and build web applications, from requirements analysis to production. At Airbus Operations, I also led a project on the technical side, working with business and security teams.",
          status: 'Available · Permanent role · Toulouse', ctaContact: 'Get in touch', ctaCv: 'Download resume',
          basedLabel: 'Based in', degreeLabel: 'Degree', degree: "Master's in Information Systems (MIAGE)", linksLabel: 'Links', cv: 'Resume (PDF)',
          photoAlt: 'Portrait of Diego Cortes'
        },
        about: {
          title: 'About',
          lead: '',
          paras: [
            "With a Master's in Information Systems (MIAGE), Business Process Engineering track, I have three years of software development experience through work-study at Airbus Operations and Andil.",
            "At Airbus, as developer and project lead, I took charge of an application to recertify Google Drive access rights, from gathering requirements to production, balancing development with coordination with business and security teams.",
            "Moving from PHP at Andil to React, Google APIs and then C# and .NET at Airbus taught me to get up to speed quickly in a new environment.",
            "Alongside my work, I build my own projects, like RunMates, a web and iOS app to join running or cycling meetups nearby, which I'm leading on my own from design to release.",
            "Today I want to bring this versatility to a team, as a full-stack developer with, where the project allows, a technical leadership side."
          ],
        },
        seek: {
          title: "What I'm looking for",
          lead: '',
          rows: [
            { label: 'Role', value: 'Full-stack developer, or developer and project lead' },
            { label: 'Contract', value: 'Permanent (CDI), available now' },
            { label: 'Location', value: 'Toulouse area' },
            { label: 'Sector', value: 'Aerospace first' }
          ]
        },
        p: { context: 'Context', result: 'Outcome', approach: 'How we went about it', open: 'Preview', close: 'Collapse', openAria: 'Preview project ', closeAria: 'Collapse project ' },
        detail: { more: 'More details', back: 'Back', missions: 'What I did', company: 'The company', count: function (n) { return n + ' project' + (n > 1 ? 's' : ''); } },
        featured: { tag: 'My latest project (2026)', others: 'Other projects', more: 'Learn more', play: 'Play the video', pause: 'Pause the video' },
        now: {
          title: 'Currently', when: 'Today',
          items: [
            { name: 'TicketFlow', text: 'Support tickets built as services, and a first hands-on with Angular. Spring Boot, Angular, PostgreSQL, Docker.' },
            { name: 'DCA investment tracker', text: 'Personal dashboard. Next.js, Prisma.' }
          ]
        },
        projectsDone: 'Projects delivered', seeCase: 'See the project ↓',
        jobs: [
          {
            dates: '2023 — 2025', place: 'Saint-Martin-du-Touch', company: 'Airbus Operations', logoUrl: 'assets/airbus.png', role: 'Developer and project lead, work-study',
            about: "Airbus Operations is the Airbus entity that designs and builds commercial aircraft. I joined its IT teams at the Saint-Martin-du-Touch site in Toulouse for the two-year work-study of my Master's degree.",
            missions: [
              "In the Digital Workplace team, I held a role that was both technical and functional, helping build internal applications and tools to meet the needs of employees and business teams. My work focused on designing and developing web applications, integrating Google Workspace services and building document classification tools. I also took part in the team's Agile practices, including PI Planning and backlog follow-up.",
              "One of my main projects was the recertification of access to Google Shared Drives. The goal was to build a web application that lets owners regularly review and approve access rights to shared spaces. It addressed a security issue: preventing employees from keeping access to sensitive data after changing roles or projects. I led the technical side and the development of this application, from defining the need to production. I took part in discussions with the Data Governance and IT Security teams to understand their needs, their practices, and what worked or caused problems in access management. For the design, I worked mainly with the Product Owner on the mockups to define the expected behaviour before development. I then designed and built the application with React, TypeScript and Google APIs, iteratively. I also wrote the technical documentation and supported the deployment, which was approved by the IT Security team.",
              "I also contributed to other internal document classification tools. The first, built with Google Apps Script, labelled Google Docs files by sensitivity level. The second followed the same principle for files stored on Windows workstations, and was built with C# and .NET."
            ],
            projects: [
              { name: 'Google Drive access recertification', text: 'Web application for owners to regularly review and approve access rights to Shared Drives. Technical lead and development, from the first need to production.', stack: 'React · TypeScript · Google APIs', projectId: 'airbus' },
              { name: 'Google Docs file classification', text: 'Contributed to an internal tool that labels Google Docs files by sensitivity level.', stack: 'Google Apps Script', projectId: 'airbus-gdocs' },
              { name: 'Windows file classification', text: 'The same idea, applied to files on Windows workstations.', stack: '.NET · C#', projectId: 'airbus-windows' }
            ]
          },
          {
            dates: '2022 — 2023', place: 'Labège', company: 'Andil', logoUrl: 'assets/andil.png', role: 'Full-stack developer, work-study',
            about: 'Andil is a company based in Labège, near Toulouse, that deploys and maintains Moodle platforms for its clients. I was there on work-study during my professional bachelor (Internet Applications Technical Lead).',
            missions: [
              "In the development team, I helped build, maintain and evolve the Moodle platforms used by the company's clients. My work mainly consisted of developing features tailored to their needs and improving existing tools.",
              "I worked in particular on custom Moodle plugins in PHP, which added or adapted platform features to meet each client's specific needs. I also contributed to a centralised dashboard for managing the Moodle platforms. Built with Laravel, HTML, CSS and JavaScript, it brought together the information and functions needed to monitor and administer the platforms deployed by the company."
            ],
            projects: [
              { name: 'Custom Moodle plugins', text: "Plugins that add or adapt platform features for each client's specific needs.", stack: 'PHP' },
              { name: 'Platform dashboard', text: 'Contributed to a central dashboard bringing together the information and functions needed to monitor and administer the deployed platforms.', stack: 'Laravel · HTML · CSS · JavaScript' }
            ]
          }
        ],
        skills: [
          { title: 'Front-end', fam: 'front', items: ['React', 'Next.js', 'TypeScript', 'HTML, CSS'] },
          { title: 'Back-end', fam: 'back', items: ['Java, Spring Boot', 'C#, .NET', 'Node.js', 'PHP, Laravel', 'Google Apps Script', 'REST APIs'] },
          { title: 'Data', fam: 'data', items: ['MySQL', 'PostgreSQL', 'Oracle', 'BigQuery', 'Python, Pandas'] },
          { title: 'Google ecosystem', fam: 'google', items: ['Workspace APIs', 'Drive, Shared Drives'] },
          { title: 'Project and analysis', fam: 'method', items: ['Agile, Scrum', 'PI Planning, backlog', 'Requirements gathering', 'BPMN, UML', 'Jira'] },
          { title: 'Tools', fam: 'cloud', items: ['Git', 'Docker', 'Linux, Bash', 'Mistral, Gemini APIs'] },
          { title: 'Certification', fam: 'cloud', items: ['AWS Cloud Foundations'], url: 'https://www.credly.com/badges/a07016d2-69c5-4faf-ab38-83d827173f73/public_url' },
          { title: 'Soft skills', plain: true, items: ['Enthusiasm', 'Adaptability', 'Team spirit'] },
          { title: 'Hobbies', plain: true, items: ['Gymnastics', 'Cycling', 'Running', 'Piano'] }
        ],
        certsTitle: 'Certification',
        certs: [
          { name: 'AWS Academy Graduate · Cloud Foundations', issuer: "Amazon Web Services · earned during my Master's", img: 'assets/aws-cloud-foundations.png',
            url: 'https://www.credly.com/badges/a07016d2-69c5-4faf-ab38-83d827173f73/public_url', link: 'View badge' }
        ],
        eduMore: 'Learn more', eduLess: 'Show less', eduSubjects: 'Courses', eduJobs: 'Target roles',
        education: [
          { dates: '2023 — 2025', name: "Master's in Information Systems (MIAGE), Business Process Engineering", school: 'Toulouse Capitole University · work-study at Airbus', logoUrl: 'assets/ut1-capitole.png',
            more: "A two-year master's degree, completed as a work-study at Airbus, that trains you to evolve a company's information system: analysing, modelling and digitising its business processes, then designing and deploying the applications that support them. The first year lays the foundations (information system, data and process modelling, object-oriented programming, databases, project management). The second, specialised in Business Process Engineering, goes deeper into development, cloud, delivery automation and IS governance.",
            groups: [
              { title: "Master's year 1 · 2023 — 2024", items: ['Information system modelling', 'Data and process modelling', 'Object-oriented design and programming', 'Agile requirements gathering', 'Advanced relational databases', 'Decision-support databases', 'Project management', 'Machine learning', 'Symbolic artificial intelligence', 'Digital law'] },
              { title: "Master's year 2, Business Process Engineering · 2024 — 2025", items: ['Front-end and back-end development', 'Big Data development', 'Service-oriented enterprise architecture', 'Cloud data and development', 'Continuous integration and deployment', 'Agile project management', 'IS urbanisation and governance', 'Data integration', 'Process Intelligence', 'Research and development'] }
            ],
            subjects: [],
            jobs: 'Functional consultant, project manager, information systems engineer, developer.' },
          { dates: '2022 — 2023', name: "Professional Bachelor's in Computing, Web Applications (RTAI)", school: 'Toulouse Capitole University · work-study at Andil', logoUrl: 'assets/ut1-capitole.png',
            more: "A one-year professional degree (third year of a bachelor's), specialised as Internet Application Technical Lead, completed as a work-study at Andil. It trains you to run a web project end to end: designing and building Internet applications, following project delivery, keeping them secure and maintainable, and documenting them.",
            groups: [
              { title: 'Web sites and applications', items: ['Building websites (HTML, CSS)', 'Dynamic sites and responsive design', 'Server-side programming', 'MVC frameworks', 'SEO'] },
              { title: 'Development principles', items: ['Programming', 'Databases', 'UML modelling', 'Project management'] },
              { title: 'Networks and security', items: ['Computer networks', 'Servers and content', 'Internet application security'] },
              { title: 'Internet culture', items: ['Digital law', 'Intangible economy', 'English'] }
            ],
            subjects: [],
            jobs: 'web application developer, web integrator, assistant web project manager.' },
          { dates: '2018 — 2022', name: 'Computer Science degree (2nd year)', school: 'Toulouse III Paul Sabatier University', logoUrl: 'assets/ut3.png',
            more: "A computer science degree completed up to the first semester of the third year. Year 1 starts with a shared science semester (mathematics, physics and chemistry, computing), then focuses on computer science: algorithms, C programming, architecture and logic. Year 2 laid the programming foundations, from assembly to C, Java and Python, along with operating systems, networks, databases and a development project every semester. Semester 5 added functional programming in OCaml and complexity theory.",
            groups: [
              { title: 'Year 1 · semester 1, shared science core', items: ['Mathematics', 'Physics and chemistry', 'Computing and mathematical tools', 'Digital sciences'] },
              { title: 'Year 1 · semester 2, computer science', items: ['Algorithms', 'C programming', 'Computer architecture', 'Logic', 'Information theory', 'Discrete mathematics', 'Analysis'] },
              { title: 'Year 2 · Computer Science', items: ['Assembly', 'C', 'Java', 'Python', 'Object-oriented programming', 'Data structures', 'Algorithms and programming', 'Operating systems', 'Networks', 'Computer architecture', 'Databases', 'Human-computer interaction', 'Development projects'] },
              { title: 'Year 3 · semester 5', items: ['Functional programming (OCaml)', 'Complexity'] }
            ],
            subjects: [],
            jobs: '' }
        ],
        contact: { lead: "I'm looking for a permanent full-stack developer role, or developer and project lead, in Toulouse. Aerospace first, available now.", email: 'Email', phone: 'Phone', cv: 'Download my resume (PDF)' }
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
          "Un enjeu de sécurité : éviter que des collaborateurs gardent l'accès à des données sensibles après un changement de poste ou de projet. Au sein de l'équipe Digital Workplace, j'ai assuré le pilotage technique et le développement d'une application web qui permet aux responsables de revoir et de valider régulièrement les droits d'accès aux Shared Drives, de la définition du besoin jusqu'à la mise en production.",
          "A security issue: making sure employees don't keep access to sensitive data after changing roles or projects. In the Digital Workplace team, I led the technical side and built a web application that lets owners regularly review and approve access rights to Shared Drives, from defining the need to production."
        ),
        // Si tu peux citer des chiffres : result: L('… en français', '… in English'). Vide, le bloc n'apparaît pas.
        result: '',
        approach: L([
          "Échanges avec les équipes Data Governance et IT Security pour comprendre leurs besoins, leurs pratiques, et ce qui fonctionnait ou posait problème dans la gestion des accès.",
          "Maquettes travaillées avec le Product Owner pour définir le fonctionnement attendu avant le développement.",
          "Conception et développement avec React, TypeScript et les Google APIs, de manière itérative.",
          "Documentation technique, puis accompagnement du déploiement, validé par l'équipe IT Security."
        ], [
          'Discussions with the Data Governance and IT Security teams to understand their needs, their practices, and what worked or caused problems in access management.',
          'Mockups worked out with the Product Owner to define the expected behaviour before development.',
          'Design and development with React, TypeScript and Google APIs, iteratively.',
          'Technical documentation, then support for the deployment, approved by the IT Security team.'
        ]),
        teamTitle: L('Qui a fait quoi', 'Who did what'),
        team: [
          m('Diego Cortes', '', 'Pilotage technique et développement : besoin, conception, développement, documentation, déploiement.', 'Technical lead and development: requirements, design, development, documentation, deployment.'),
          m('Product Owner', '', 'Maquettes et fonctionnement attendu, avec moi.', 'Mockups and expected behaviour, together with me.'),
          m('Data Governance', '', 'Besoins et pratiques de gestion des accès.', 'Access management needs and practices.'),
          m('IT Security', '', 'Besoins de sécurité, validation du déploiement.', 'Security needs, deployment sign-off.')
        ],
        stack: 'React · TypeScript · Google APIs',
        links: [], private: true, privateLabel: L('Code interne Airbus', 'Internal Airbus code')
      },
      {
        id: 'runmates', year: '2026', name: 'RunMates',
        featured: true, video: 'assets/runmates.mp4?v=4d4ebc9', poster: 'assets/runmates-poster.jpg',
        videoMobile: 'assets/runmates-mobile.mp4?v=4d4ebc9', posterMobile: 'assets/runmates-mobile-poster.jpg?v=9d1d3a6',
        videoLabel: L("Démonstration de RunMates sur iPhone : explorer les sorties, en proposer une à Toulouse, mes sorties, profil et messages", 'RunMates demo on iPhone: browse runs, post one in Toulouse, my runs, profile and messages'),
        kind: L('Projet personnel · développé seul', 'Personal project · built solo'),
        pitch: L("Une application pour découvrir des sorties de course à pied ou de vélo près de chez soi et rejoindre des personnes qui partagent une allure similaire.", 'An app to discover running or cycling meetups nearby and join people who share a similar pace.'),
        img: 'assets/runmates-sorties.jpg',
        imgAlt: L("Maquette de l'écran Sorties de RunMates : sorties du jour et du lendemain avec allure, distance et lieu", 'Mockup of the RunMates Runs screen: today and tomorrow’s runs with pace, distance and place'),
        previewLabel: L("Maquette de l'écran « Sorties »", 'Mockup of the “Runs” screen'),
        context: L([
          "Trouver des personnes avec qui courir ou faire du vélo peut être motivant, mais il n'est pas toujours facile de savoir où chercher. Les clubs et groupes organisent des sorties et communiquent souvent sur Instagram, mais il faut parfois passer du temps à les trouver, à comprendre leur fonctionnement et à savoir si les sorties proposées correspondent à son niveau. Ce n'est pas toujours évident, notamment lorsqu'on débute.",
          "C'est de ce constat qu'est né RunMates : une application qui permet de découvrir les sorties organisées autour de soi, de consulter leurs informations et de rejoindre facilement un groupe adapté à ses envies et à son allure."
        ], [
          "Finding people to run or ride with can be motivating, but it isn't always easy to know where to look. Clubs and groups organise meetups and often post about them on Instagram, but it can take time to find them, understand how they work and tell whether their runs match your level. It isn't always obvious, especially when you're starting out.",
          "That's where RunMates came from: an app that lets you discover meetups organised around you, check their details and easily join a group that fits what you want and your pace."
        ]),
        approachTitle: L('Développement', 'Development'),
        approachText: L(
          "Je développe RunMates seul, de la conception à la réalisation. J'ai commencé par définir le modèle de données et les règles d'accès, avant de construire progressivement l'application avec React et TypeScript. Supabase et PostgreSQL assurent la gestion des données et des utilisateurs, tandis que PostGIS permet de rechercher les sorties selon leur proximité géographique. Mapbox est utilisé pour l'affichage cartographique, et Capacitor permet de proposer une version iOS.",
          "I'm building RunMates on my own, from design to delivery. I started by defining the data model and access rules, then built the app step by step with React and TypeScript. Supabase and PostgreSQL handle data and users, while PostGIS finds meetups by geographic proximity. Mapbox powers the maps, and Capacitor provides an iOS version."
        ),
        stack: 'React · TypeScript · Supabase · PostgreSQL · PostGIS · Mapbox · Capacitor · Stripe',
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
        pitch: L('Un outil interne pour classer les fichiers Google Docs selon leur niveau de sensibilité.', 'An internal tool to label Google Docs files by sensitivity level.'),
        context: L("Un des outils internes de classification des documents auxquels j'ai contribué chez Airbus. Développé avec Google Apps Script, il permettait de classer les fichiers Google Docs selon leur niveau de sensibilité.", 'One of the internal document classification tools I contributed to at Airbus. Built with Google Apps Script, it labelled Google Docs files by sensitivity level.'),
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
        context: L("Le second outil de classification auquel j'ai contribué chez Airbus : le même principe que pour les Google Docs, mais pour les fichiers présents sur les postes Windows, développé avec C# et .NET.", 'The second classification tool I contributed to at Airbus: the same idea as for Google Docs, but for files stored on Windows workstations, built with C# and .NET.'),
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
