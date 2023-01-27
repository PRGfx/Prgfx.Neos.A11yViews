(() => {
    const getHeadingsAndNodes = () => {
        /** @type {Array<{level: number, node: Element, contextPath: string|null}>} */
        const result = [];
        const doc = document.querySelector('iframe').contentDocument;
        const headings = doc.querySelectorAll('h1,h2,h3,h4,h5,h6,[role=heading]');

        headings.forEach(node => {
            let level = 0;
            let closestNodePath = null;
            switch (node.tagName.toUpperCase()) {
                case 'H1':
                    level = 1;
                    break;
                case 'H2':
                    level = 2;
                    break;
                case 'H3':
                    level = 3;
                    break;
                case 'H4':
                    level = 4;
                    break;
                case 'H5':
                    level = 5;
                    break;
                case 'H6':
                    level = 6;
                    break;
                default: {
                    const ariaLevel = node.getAttribute('aria-level');
                    if (ariaLevel !== null) {
                        const levelNr = Number.parseInt(ariaLevel);
                        if (!Number.isNaN(levelNr)) {
                            level = levelNr;
                        }
                    }
                }
            }

            const closestElement = node.closest('[data-__neos-node-contextpath]');
            if (closestElement) {
                closestNodePath = closestElement.getAttribute('data-__neos-node-contextpath');
            }
            result.push({
                level,
                node,
                contextPath: closestNodePath,
            });
        });
        return result;
    }

    window.prgfxA11yViews = (window.prgfxA11yViews || {});
    window.prgfxA11yViews.evaluateHeadings = (node) => {
        const headings = getHeadingsAndNodes();
        let lastLevel = 0;
        const list = headings.map(({node: headingNode, level, contextPath}) => {
            const isSelectedNode = node.contextPath === contextPath;
            const invalidLevel = level > lastLevel && level > lastLevel + 1;
            const indentation = Math.max(0, Math.min(lastLevel + 1, level) - 1);
            lastLevel = level;

            return [
                '  '.repeat(indentation), '* ',
                invalidLevel && '*⚠*',
                '**', level || '*?*', '**',
                ' ',
                isSelectedNode && '**',
                headingNode.textContent,
                isSelectedNode && '**',
            ].filter(Boolean).join('');
        }).join('\n');

        return list || 'Prgfx.Neos.A11yViews:NodeTypes.HeadingLevelsMixin:noHeadings';
    }
})();
