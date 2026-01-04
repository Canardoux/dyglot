// A learning card in Dyglot v2 is phrase-first.
// One card represents one sentence shown to the user.
export interface LearningCard 
{
        id: string;

        // Main visible content (default view)
        koreanText: string;   // Hangul
        englishText: string;  // Translation

        // Optional links to linguistic data (hidden by default)
        targetWordId?: string;

        // Advanced details (only shown on demand or in expert mode)
        details?: 
        {
                hanja?: string;
                japanese?: string;
                grammarNote?: string;
                examples?: string[];
        };
}