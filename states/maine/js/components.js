class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            console.log(`Loading component: ${componentPath} into #${elementId}`);
            // Adjust path based on current page location
            const path = window.location.pathname;
            let basePath = './';
            if (path.includes('/blog/') || path.includes('/states/') || path.includes('/attractions/') || path.includes('/cities/') || path.includes('/restaurants/') || path.includes('/blog/posts/')) {
                basePath = '../';
            }
            const response = await fetch(`${basePath}${componentPath}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`Element with id '${elementId}' not found`);
            }
            element.innerHTML = html;
            console.log(`Successfully loaded component: ${componentPath}`);
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
        }
    }

    static async loadAllComponents() {
        await Promise.all([
            this.loadComponent('navigation', 'components/header.html'),
            this.loadComponent('footer', 'components/footer.html')
        ]);
    }
}

// Load all components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
}); 