// Connexion à Supabase pour les liens uniques par recruteur.
// Supabase → Project Settings → API : copier « Project URL » et la clé « anon public ».
// La clé anon est faite pour être publique. Ne JAMAIS mettre ici la clé « service_role ».
// Tant que ces deux valeurs sont vides, le suivi est désactivé et le site fonctionne normalement.
window.PORTFOLIO_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: ''
};
