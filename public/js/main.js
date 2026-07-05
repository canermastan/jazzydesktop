document.addEventListener('alpine:init', () => {
    Alpine.data('searchModal', () => ({
        searchOpen: false,
        searchQuery: '',
        allDocs: [],

        async init() {
            this.$watch('searchOpen', value => {
                if (value) {
                    setTimeout(() => this.$refs.searchInput.focus(), 50);
                    if (this.allDocs.length === 0) {
                        this.fetchDocs();
                    }
                } else {
                    this.searchQuery = '';
                }
            });
        },

        async fetchDocs() {
            try {
                const res = await fetch('/public/docs/sidebar.json');
                if (res.ok) {
                    const data = await res.json();
                    let docs = data.flatMap(category => 
                        category.items.map(item => ({
                            title: item.title,
                            path: item.path,
                            category: category.title,
                            content: '',
                            rawContent: ''
                        }))
                    );
                    
                    // Show initial titles immediately
                    this.allDocs = docs;

                    // Fetch all markdown contents in the background
                    const fetchPromises = docs.map(async (doc) => {
                        try {
                            const mdRes = await fetch(`/public/docs/${doc.path}.md`);
                            if (mdRes.ok) {
                                const raw = await mdRes.text();
                                return { ...doc, rawContent: raw, content: raw.toLowerCase() };
                            }
                        } catch (e) {
                            console.error(`Failed to load ${doc.path} for FTS`);
                        }
                        return doc;
                    });
                    
                    // Update docs with FTS content once fully loaded
                    this.allDocs = await Promise.all(fetchPromises);
                }
            } catch (err) {
                console.error("Failed to load search data", err);
            }
        },

        get results() {
            if (this.searchQuery.trim() === '') return [];
            const query = this.searchQuery.toLowerCase();
            
            return this.allDocs.map(doc => {
                let isMatch = false;
                let snippet = '';

                if (doc.title.toLowerCase().includes(query) || doc.category.toLowerCase().includes(query)) {
                    isMatch = true;
                } else if (doc.content && doc.content.includes(query)) {
                    isMatch = true;
                    // Generate FTS Snippet
                    const index = doc.content.indexOf(query);
                    const start = Math.max(0, index - 40);
                    const end = Math.min(doc.content.length, index + query.length + 40);
                    
                    // Extract from rawContent to preserve original casing
                    let before = doc.rawContent.substring(start, index);
                    let matchStr = doc.rawContent.substring(index, index + query.length);
                    let after = doc.rawContent.substring(index + query.length, end);
                    
                    // Clean up markdown syntax for nicer display
                    const cleanText = (t) => t.replace(/\n/g, ' ').replace(/[#*`>\-]/g, '').replace(/<[^>]*>?/gm, '');
                    before = cleanText(before);
                    after = cleanText(after);
                    
                    snippet = `...${before}<span class="text-purple-neon font-medium bg-purple-neon/10 px-1 rounded">${matchStr}</span>${after}...`;
                }

                return { ...doc, isMatch, snippet };
            }).filter(doc => doc.isMatch);
        }
    }))
});
