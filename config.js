// Connexion à Supabase pour les liens uniques par recruteur.
// Supabase → Project Settings → API : copier « Project URL » et la clé « anon public » (ou « publishable »).
// La clé anon est faite pour être publique. Ne JAMAIS mettre ici la clé « service_role ».
// Tant que ces deux valeurs sont vides, le suivi est désactivé et le site fonctionne normalement.
window.PORTFOLIO_CONFIG = {
  supabaseUrl: 'https://nuvqernsmrmekbdbxoet.supabase.co',
  supabaseAnonKey: 'sb_publishable_DVbJT7j3a7Gosj2sWc6f9g_ehiDjKk4'
};
