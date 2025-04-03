class ComponentLoader {
    static async loadComponent(elementId, componentPath) {
        try {
            console.log(`Loading component: ${componentPath} into #${elementId}`);
            // Adjust path based on current page location
            const path = window.location.pathname;
            let basePath = './';
            
            // Extract state name from URL if in states directory
            const stateMatch = path.match(/\/states\/([^/]+)\//);
            if (stateMatch) {
                // If we're in a state directory, we need to go up two levels
                basePath = '../../';
            } else if (path.includes('/states/')) {
                // Handle the states index page
                basePath = '../';
            } else if (path.includes('/blog/') || path.includes('/attractions/') || 
                       path.includes('/cities/') || path.includes('/restaurants/') || 
                       path.includes('/blog/posts/')) {
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

function adjustHeaderPaths() {
    const currentPath = window.location.pathname;
    const depth = currentPath.split('/').filter(Boolean).length;
    
    // Calculate the relative path prefix based on depth
    const prefix = depth === 0 ? '.' : '../'.repeat(depth);
    
    // Update all navigation links
    const header = document.querySelector('.site-header');
    const links = header.querySelectorAll('a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('/')) {
            // Remove the leading slash and add the appropriate prefix
            link.href = prefix + href.substring(1);
        }
    });
}

// Load all components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ComponentLoader.loadAllComponents();
    adjustHeaderPaths();
}); 