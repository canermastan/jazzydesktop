document.addEventListener('alpine:init', () => {
    
    if (window.marked) {
        marked.use({
            renderer: {
                code(token) {
                    const code = typeof token === 'string' ? token : token.text;
                    const infostring = typeof token === 'string' ? arguments[1] : token.lang;
                    
                    // Parse language and optional filename
                    const match = (infostring || '').match(/^(\S+)(?:\s+(?:title|filename)="?([^"]+)"?)?/);
                    const lang = match ? match[1] : '';
                    let title = (match && match[2]) ? match[2] : '';
                    
                    let langAlias = lang;
                    if (lang === 'svelte' || lang === 'vue') langAlias = 'xml';
                    if (lang === 'jsx') langAlias = 'javascript';
                    
                    const language = window.hljs && hljs.getLanguage(langAlias) ? langAlias : 'plaintext';
                    
                    // If no title is provided, use the language name as title (capitalized)
                    if (!title) {
                        if (language === 'bash') title = 'Terminal';
                        else if (language === 'javascript') title = 'script.js';
                        else if (language === 'css') title = 'style.css';
                        else if (language === 'xml') title = 'index.html';
                        else if (language === 'nim') title = 'app.nim';
                        else title = language;
                    }

                    // Escape HTML characters in the code string
                    const escapeTest = /[&<>"']/;
                    const escapeReplace = /[&<>"']/g;
                    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
                    const escapedCode = escapeTest.test(code) ? code.replace(escapeReplace, ch => escapeMap[ch]) : code;

                    return `
                        <div x-data="{ copied: false }" class="my-6 border border-white/10 rounded-xl overflow-hidden bg-[#121214] shadow-2xl relative group transition-colors duration-300 hover:border-white/20">
                            <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
                            <div class="bg-white/[0.02] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
                                <div class="flex items-center gap-2.5">
                                    <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l3 3-3 3m5 0h3M4 17h16a2 2 0 002-2V9a2 2 0 00-2-2H4a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                                    <span class="text-[13px] font-mono text-neutral-400 select-none">${title}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <span class="text-[10px] font-mono text-neutral-500 font-semibold uppercase tracking-widest select-none">${lang === 'xml' ? 'html' : lang}</span>
                                    <button @click="navigator.clipboard.writeText(decodeURIComponent($el.dataset.code)); copied = true; setTimeout(() => copied = false, 2000)" data-code="${encodeURIComponent(code)}" class="text-neutral-500 hover:text-white transition-colors focus:outline-none" title="Copy code">
                                        <svg x-show="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                        <svg x-show="copied" style="display: none;" class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <pre style="margin: 0; padding: 1.25rem; background: transparent; overflow-x: auto; border: none; border-radius: 0;" class="text-[13.5px] leading-relaxed"><code class="language-${language}">${escapedCode}</code></pre>
                        </div>
                    `;
                }
            }
        });
    }

    Alpine.data('docsViewer', () => ({
        sidebar: [],
        currentPage: '',
        loading: false,
        error: false,
        isInitialLoad: true,
        toc: [],
        prevPage: null,
        nextPage: null,

        scrollToHeading(id) {
            const el = document.getElementById(id);
            if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 90;
                window.scrollTo({ top: y, behavior: 'smooth' });
                history.pushState(null, '', '#' + id);
            }
        },

        getPageFromUrl() {
            const parts = window.location.pathname.split('/').filter(Boolean);
            const lastPart = parts.pop() || '';
            return (lastPart === 'docs' || !lastPart) ? 'getting-started' : lastPart;
        },

        async init() {
            await this.loadSidebar();
            this.currentPage = this.getPageFromUrl();
            
            this.loadPage(this.currentPage, false);

            window.addEventListener('popstate', (e) => {
                this.loadPage(e.state?.page || this.getPageFromUrl(), false);
            });
        },

        getBasePath() {
            var baseHref = document.querySelector('base').href;
            var origin = window.location.origin;
            if (origin && origin !== "null" && baseHref.startsWith(origin)) {
                var path = baseHref.substring(origin.length);
                if (path.endsWith('/')) path = path.substring(0, path.length - 1);
                return path;
            }
            return "";
        },

        async loadSidebar() {
            try {
                // Fetch using relative path - browser will use <base>
                const res = await fetch('public/docs/sidebar.json');
                if (res.ok) {
                    this.sidebar = await res.json();
                }
            } catch (err) {
                console.error("Failed to load sidebar", err);
            }
        },

        updateTOC() {
            const container = this.$refs.mdContent;
            if (!container) return;
            
            const headings = container.querySelectorAll('h2, h3');
            let tocList = [];
            headings.forEach(heading => {
                const id = heading.id || heading.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                heading.id = id;
                tocList.push({
                    id: id,
                    text: heading.innerText,
                    level: heading.tagName === 'H2' ? 2 : 3
                });
            });
            this.toc = tocList;
        },

        updatePagination() {
            let flatList = [];
            this.sidebar.forEach(cat => {
                cat.items.forEach(item => flatList.push(item));
            });
            const index = flatList.findIndex(item => item.path === this.currentPage);
            if (index !== -1) {
                this.prevPage = index > 0 ? flatList[index - 1] : null;
                this.nextPage = index < flatList.length - 1 ? flatList[index + 1] : null;
                document.title = `${flatList[index].title} | Jazzy Desktop`;
            }
        },

        async loadPage(pagePath, pushState = true) {
            if (!this.isInitialLoad) {
                this.loading = true;
            }
            this.error = false;
            this.currentPage = pagePath;

            if (pushState) {
                // Determine absolute path for history using base path
                const basePath = this.getBasePath();
                const newUrl = basePath ? `${basePath}/docs/${pagePath}` : `docs/${pagePath}`;
                window.history.pushState({ page: pagePath }, '', newUrl);
            }

            try {
                // Fetch using relative path - browser will use <base>
                const res = await fetch(`public/docs/${pagePath}.md`);
                if (!res.ok) throw new Error('Not found');
                
                let mdContent = await res.text();
                
                // Preprocess :::jazzy-snippet to :::tabs
                mdContent = mdContent.replace(/:::jazzy-snippet\r?\n([\s\S]*?)---\r?\n([\s\S]*?):::/g, (match, metaStr, codeStr) => {
                    const meta = {};
                    metaStr.split('\n').forEach(line => {
                        const idx = line.indexOf(':');
                        if (idx !== -1) {
                            meta[line.substring(0, idx).trim()] = line.substring(idx + 1).trim();
                        }
                    });
                    
                    const code = codeStr.trim();
                    const action = meta.action || 'handleClick';
                    const label = meta.label || 'Click Here';
                    
                    let generated = ':::tabs\n';
                    
                    // SVELTE
                    generated += `== Svelte\n\`\`\`svelte title="App.svelte"\n<script>\n  import { jazzy } from './jazzy'\n\n  const ${action} = async () => {\n    ${code.split(/\r?\n/).join('\n    ')}\n  }\n</script>\n\n<button on:click={${action}}>${label}</button>\n\`\`\`\n`;
                    // REACT
                    generated += `== React\n\`\`\`jsx title="App.jsx"\nimport { jazzy } from './jazzy'\n\nexport default function App() {\n  const ${action} = async () => {\n    ${code.split(/\r?\n/).join('\n    ')}\n  }\n\n  return <button onClick={${action}}>${label}</button>\n}\n\`\`\`\n`;
                    // VUE
                    generated += `== Vue\n\`\`\`vue title="App.vue"\n<script setup>\nimport { jazzy } from './jazzy'\n\nconst ${action} = async () => {\n  ${code.split(/\r?\n/).join('\n  ')}\n}\n</script>\n\n<template>\n  <button @click="${action}">${label}</button>\n</template>\n\`\`\`\n`;
                    // SOLID
                    generated += `== Solid\n\`\`\`jsx title="App.jsx"\nimport { jazzy } from './jazzy'\n\nexport default function App() {\n  const ${action} = async () => {\n    ${code.split(/\r?\n/).join('\n    ')}\n  }\n\n  return <button onClick={${action}}>${label}</button>\n}\n\`\`\`\n`;
                    // VANILLA
                    generated += `== Vanilla\n\`\`\`javascript title="main.js"\nimport { jazzy } from './jazzy'\n\ndocument.querySelector('#btn').addEventListener('click', async () => {\n  ${code.split(/\r?\n/).join('\n  ')}\n})\n\`\`\`\n`;
                    
                    generated += ':::';
                    return generated;
                });

                // Preprocess :::tabs with placeholders
                let tabsHtmlMap = {};
                let tabCounter = 0;

                mdContent = mdContent.replace(/:::tabs([\s\S]*?):::/g, (match, content) => {
                    const blocks = content.split(/^==\s+(.+)$/m).filter(s => s.trim().length > 0);
                    
                    let buttons = `<div class="flex flex-wrap gap-1 mb-[-1.5rem] relative z-10 pl-4">`;
                    let panels = `<div>`;
                    
                    for (let i = 0; i < blocks.length; i += 2) {
                        if (i + 1 >= blocks.length) break;
                        const title = blocks[i].trim();
                        const codeMarkdown = blocks[i+1].trim();
                        const index = i/2;
                        
                        buttons += `<button @click="tab = ${index}" :class="tab === ${index} ? 'bg-[#121214] text-white border-white/10 border-b-[#121214] border-b-[2px]' : 'bg-transparent text-neutral-500 border-transparent hover:text-white'" class="px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-all rounded-t-lg">${title}</button>`;
                        
                        const parsedCode = window.marked ? marked.parse(codeMarkdown) : `<pre>${codeMarkdown}</pre>`;
                        panels += `<div x-show="tab === ${index}" ${index !== 0 ? 'style="display: none;"' : ''}>${parsedCode}</div>`;
                    }
                    
                    buttons += `</div>`;
                    panels += `</div>`;
                    
                    const finalHtml = `<div x-data="{ tab: 0 }" class="code-tabs my-8">\n` + buttons + panels + `\n</div>`;
                    const placeholder = `TABPLACEHOLDERXYZ${tabCounter}Z`;
                    tabsHtmlMap[placeholder] = finalHtml;
                    tabCounter++;
                    return placeholder;
                });

                let html = window.marked ? marked.parse(mdContent) : `<pre>${mdContent}</pre>`;
                
                // Inject tabs back into html
                for (const [placeholder, tabHtml] of Object.entries(tabsHtmlMap)) {
                    html = html.replace(`<p>${placeholder}</p>`, tabHtml);
                    html = html.replace(placeholder, tabHtml);
                }
                
                this.loading = false;
                
                await this.$nextTick();
                
                const container = this.$refs.mdContent;
                if (container) {
                    container.innerHTML = html;
                    if (window.hljs) {
                        container.querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });
                    }
                }
                
                this.updateTOC();
                this.updatePagination();
                
            } catch (err) {
                console.error("Failed to load page", err);
                this.error = true;
            } finally {
                this.loading = false;
                
                if (!this.isInitialLoad) {
                    this.$nextTick(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });
                }
                
                this.isInitialLoad = false;
            }
        }
    }));
});
