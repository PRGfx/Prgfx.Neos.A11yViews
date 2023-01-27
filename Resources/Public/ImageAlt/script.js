(() => {
    /**
     * @typedef NodeInformation
     * @property {HTMLImageElement} node
     * @property {string|null} contextPath
     */
    /**
     * @typedef {[HTMLImageElement, string, string|null]} ImageInformation
     */

    /**
     * @return {Array<NodeInformation>}
     */
    const findImagesWithoutAlt = () => {
        /** @type {Array<NodeInformation>} */
        const result = [];
        const doc = document.querySelector('iframe').contentDocument;
        const images = doc.querySelectorAll('img:not([alt],[role=presentation])');
        images.forEach(node => {
            let closestNodePath;
            const closestNode = node.closest('[data-__neos-node-contextpath]');
            if (closestNode) {
                closestNodePath = closestNode.getAttribute('data-__neos-node-contextpath');
            }
            result.push({ node, contextPath: closestNodePath });
        });
        return result;
    };

    /**
     * @param {HTMLImageElement} node
     * @returns {string}
     */
    const getFallbackLabel = node => {
        return node.alt || node.title || node.src.split('/').pop() || node.tagName;
    };

    /**
     * @param {ReturnType<typeof findImagesWithoutAlt>} images
     * @returns {Array<ImageInformation>}
     */
    const fallbackHandling = (images) => {
        return images.map(({node, contextPath}) => [
            node,
            getFallbackLabel(node),
            contextPath,
        ])
    };

    /**
     * @param {Array<ImageInformation>} imageData
     * @return {string}
     */
    const formatContent = (imageData) => {
        return imageData.map(([img, title, contextPath]) => [
            `* **${title}**`,
            // contextPath && ` [show](#${contextPath})`,
            '  \n',
            `![${title}](${img.src})`,
        ].filter(Boolean).join('')).join('\n');
    }

    window.prgfxA11yViews = (window.prgfxA11yViews || {});
    window.prgfxA11yViews.evaluateImageAlt = (documentNode) => {
        const images = findImagesWithoutAlt();

        if (images.length === 0) {
            return 'Prgfx.Neos.A11yViews:NodeTypes.ImageAltMixin:noErrors';
        }

        if (images.some(i => i.contextPath)) {
            return window.neos.q(documentNode.contextPath).find('[instanceof Neos.Neos:Content]').get()
                .then(nodes => {
                    return images.map(({node, contextPath}) => {
                        if (contextPath) {
                            const nodeData = nodes.find(node => node.contextPath === contextPath);

                            if (nodeData) {
                                return [ node, nodeData.label, contextPath ];
                            }

                            const nodeName = contextPath
                                .split('@')[0]
                                .split('/').pop();

                            return [ node, nodeName, contextPath ];
                        }

                        return [ node, getFallbackLabel(node), null ];
                    });
                })
                .catch(() => fallbackHandling(images))
                .then(formatContent);
        }

        return Promise.resolve(fallbackHandling(images))
            .then(formatContent);
    };
})();
