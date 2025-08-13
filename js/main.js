// Fetch GitHub repositories
async function fetchGitHubRepos() {
    const username = 'jgarces21';
    const projectsContainer = document.getElementById('github-projects');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

        if (!response.ok) {
            throw new Error('Failed to fetch GitHub repositories');
        }

        const repos = await response.json();

        // Filter out forked repositories and sort by stars (descending)
        const filteredRepos = repos
            .filter(repo => !repo.fork && !repo.archived)
            .sort((a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at));

        if (filteredRepos.length === 0) {
            projectsContainer.innerHTML = '<p>No public repositories found.</p>';
            return;
        }

        // Display the first 6 projects
        const projectsHTML = filteredRepos.slice(0, 6).map(repo => `
            <div class="project-card">
                <div class="project-content">
                    <h3>${repo.name}</h3>
                    <p class="project-description">${repo.description || 'No description available'}</p>
                    <div class="project-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.language || 'N/A'}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                        View on GitHub <i class="fas fa-external-link-alt"></i>
                    </a>
                </div>
            </div>
        `).join('');

        projectsContainer.innerHTML = projectsHTML;

    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        projectsContainer.innerHTML = `
            <p>Unable to load GitHub projects. You can view them directly on 
            <a href="https://github.com/jgarces21" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
        `;
    }
}

// Fetch LinkedIn experience (Note: LinkedIn API requires authentication)
// This is a placeholder function as LinkedIn's API requires OAuth
async function fetchLinkedInExperience() {
    const experienceContainer = document.querySelector('#experience .experience-item');

    // Since we can't directly access LinkedIn's API without OAuth,
    // we'll provide a link to the LinkedIn profile
    experienceContainer.innerHTML = `
        <h3>Professional Experience</h3>
        <p>For a detailed overview of my professional experience, please visit my LinkedIn profile:</p>
        <a href="https://www.linkedin.com/in/george-garces/" target="_blank" rel="noopener noreferrer" class="project-link">
            View my LinkedIn Profile <i class="fab fa-linkedin"></i>
        </a>
    `;
}

function updateYear() {
    const yearElement = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearElement.textContent = '' + currentYear;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
    fetchLinkedInExperience();
    updateYear();
});
