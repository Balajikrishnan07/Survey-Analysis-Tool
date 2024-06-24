document.addEventListener('DOMContentLoaded', function() {
    const csvFileInput = document.getElementById('csvFileInput');
    const uploadButton = document.getElementById('uploadButton');
    const analysisSection = document.getElementById('analysisSection');
    const analysisResults = document.getElementById('analysisResults');

    uploadButton.addEventListener('click', function() {
        const file = csvFileInput.files[0];
        if (!file) {
            alert('Please select a file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const contents = e.target.result;
            const data = parseCSV(contents);
            if (data) {
                localStorage.setItem('surveyData', JSON.stringify(data));
                displayAnalysis(data);
                analysisSection.style.display = 'block';
                uploadForm.style.display = 'none';
            } else {
                alert('Failed to parse CSV file.');
            }
        };
        reader.onerror = function(e) {
            console.error('File reading error:', e);
        };
        reader.readAsText(file);
    });

    function parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header] = values[index].trim();
                });
                data.push(entry);
            }
        }

        return data;
    }

    function displayAnalysis(data) {
        analysisResults.innerHTML = '';

        // Example analysis: count entries by category
        const counts = {};
        data.forEach(entry => {
            const category = entry['category']; // Adjust key as per your CSV headers
            if (counts[category]) {
                counts[category]++;
            } else {
                counts[category] = 1;
            }
        });

        // Display analysis results
        for (let category in counts) {
            const count = counts[category];
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `<strong>${category}</strong> ${count} entries`;
            analysisResults.appendChild(resultItem);
        }
    }
});