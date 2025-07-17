(function () {
    // Initialize the component when loaded in Unqork
    Unqork.onInit(function () {
        const button = document.getElementById('viewJsonButton');
        const container = document.getElementById('json-container');

        if (!button || !container) {
            console.error("Error: Required elements 'viewJsonButton' or 'json-container' not found.");
            return;
        }

        // Add event listener to the button
        button.addEventListener('click', displayCurrentUser);

        function displayCurrentUser() {
            console.log('Attempting to display current user data...');
            try {
                // Fetch data from Unqork's submission data
                const jsonData = Unqork.getSubmissionData().currentUser;

                if (!jsonData) {
                    container.innerHTML = "Could not find 'currentUser' data. The object might be empty or unavailable.";
                    console.warn("The path 'Unqork.getSubmissionData().currentUser' returned null or undefined.");
                    return;
                }

                // Render the JSON tree view
                container.innerHTML = createJsonTreeView(jsonData);

                // Remove existing listeners to prevent duplicates
                container.replaceWith(container.cloneNode(true));
                const newContainer = document.getElementById('json-container');
                newContainer.addEventListener('click', handleTreeClick);
            } catch (error) {
                container.innerHTML = "An error occurred while fetching the data.";
                console.error("Error fetching or parsing JSON data:", error);
            }
        }

        function createJsonTreeView(data) {
            let html = '';
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const value = data[key];
                    const isObject = typeof value === 'object' && value !== null;
                    html += `<div class="json-item">`;
                    if (isObject) {
                        const objectType = Array.isArray(value) ? 'Array' : 'Object';
                        const itemCount = Object.keys(value).length;
                        html += `<span class="json-key json-collapsible">${key}</span>: <span class="json-value">${objectType}(${itemCount})</span>`;
                        html += `<div class="json-content">${createJsonTreeView(value)}</div>`;
                    } else {
                        html += `<span class="json-key">${key}: </span>`;
                        html += `<span class="json-value">${JSON.stringify(value)}</span>`;
                    }
                    html += `</div>`;
                }
            }
            return html;
        }

        function handleTreeClick(event) {
            const target = event.target;
            if (target.classList.contains('json-collapsible')) {
                target.classList.toggle('expanded');
                const content = target.parentElement.querySelector('.json-content');
                if (content) {
                    content.classList.toggle('show');
                }
            }
        }
    });
})();
